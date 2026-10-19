/*
 * Authlete SDK client with IDP URL routing.
 *
 * This file is hand-written and intentionally lives outside the
 * Speakeasy-generated modules (which are all marked "DO NOT EDIT").
 * It is reachable by consumers through the package's wildcard export:
 *
 *   import { Authlete } from "@authlete/typescript-sdk/client";
 *
 * Background
 * ----------
 * Authlete runs two API surfaces:
 *
 *   - Main API (us.authlete.com, jp.authlete.com, ...): OAuth/OIDC runtime
 *   - IDP (login.authlete.com): service lifecycle, audit logs
 *
 * The OpenAPI spec models IDP endpoints with path-level `servers`, so the
 * generated SDK already routes them to https://login.authlete.com by
 * default. What the generated SDK cannot do is let DC/self-managed
 * customers override that IDP URL once for the whole client, or derive
 * the `apiServerId` (cluster ID) that IDP service operations require.
 *
 * This class adds both, using only public, generation-stable seams:
 * an `HTTPClient` "beforeRequest" hook that matches requests by URL
 * origin. No generated internals are inspected, so the behaviour is
 * unaffected by regeneration, bundling, or minification.
 */

import { SDKOptions, ServerList } from "./lib/config.js";
import { HTTPClient } from "./lib/http.js";
import {
  ServiceCreateIdpApiServerIdp,
  ServiceCreateIdpApiServerList,
} from "./models/operations/servicecreateidpapi.js";
import { Authlete as AuthleteCore } from "./sdk/sdk.js";

/**
 * Maps Authlete SaaS cluster origins to their numeric apiServerId.
 * Used to automatically inject `apiServerId` into IDP service
 * create/remove calls so SaaS customers never need to know internal
 * cluster IDs. DC/self-managed customers must pass `apiServerId`
 * explicitly since a custom domain cannot be mapped here.
 */
export const SAAS_CLUSTER_IDS: Record<string, number> = {
  "https://us.authlete.com": 76281,
  "https://jp.authlete.com": 53285,
  "https://eu.authlete.com": 63294,
  "https://br.authlete.com": 47363,
};

/**
 * The IDP base URL baked into the spec (and therefore into the generated
 * per-operation server lists). Imported from generated code so this
 * wrapper stays in sync with the spec automatically.
 */
const DEFAULT_IDP_ORIGIN = new URL(
  ServiceCreateIdpApiServerList[ServiceCreateIdpApiServerIdp],
).origin;

/**
 * IDP operations that require an `apiServerId` in their JSON body.
 */
const API_SERVER_ID_PATHS = new Set(["/api/service", "/api/service/remove"]);

export type AuthleteOptions = SDKOptions & {
  /**
   * Base URL for IDP operations (service lifecycle, audit logs).
   * Defaults to the spec-defined https://login.authlete.com.
   * DC/self-managed customers set this to their own IDP host.
   */
  idpURL?: string | undefined;
  /**
   * Cluster ID injected into IDP service create/remove request bodies
   * when the caller has not provided one. Derived automatically from
   * `serverURL` (or `serverIdx`) for Authlete SaaS clusters — but only
   * while the IDP is the default (login.authlete.com). Setting a custom
   * `idpURL` disables derivation, since SaaS cluster IDs are meaningless
   * for DC/self-managed deployments; set this explicitly there.
   */
  apiServerId?: number | undefined;
};

function resolveMainOrigin(options: SDKOptions): string {
  const raw = options.serverURL
    ?? ServerList[options.serverIdx ?? 0]
    ?? ServerList[0];
  try {
    return new URL(raw).origin;
  } catch {
    return raw;
  }
}

/**
 * Normalizes an idpURL to origin + path prefix (no trailing slash), so
 * DC deployments hosted behind a path prefix (e.g. a gateway at
 * https://gateway.example.com/authlete-idp) route correctly. Query and
 * fragment are not part of a base URL and are dropped.
 */
function normalizeIdpBase(idpURL: string): string {
  const u = new URL(idpURL);
  return u.origin + u.pathname.replace(/\/+$/, "");
}

/**
 * Drop-in replacement for the generated `Authlete` class that adds
 * IDP-aware routing:
 *
 * ```typescript
 * import { Authlete } from "@authlete/typescript-sdk/client";
 *
 * // SaaS customer — everything is automatic
 * const sdk = new Authlete({ bearer: "TOKEN" });
 * await sdk.service.create({ organizationId: 12345 });
 * // -> POST https://login.authlete.com/api/service, apiServerId injected
 *
 * // DC / self-managed customer
 * const dc = new Authlete({
 *   bearer: "TOKEN",
 *   serverURL: "https://authlete.example.com",
 *   idpURL: "https://authlete-login.example.com",
 *   apiServerId: 99999,
 * });
 * ```
 *
 * Requests that resolve to the spec-defined IDP origin are re-routed to
 * `idpURL`; every other request (including per-call `serverURL`
 * overrides) passes through untouched.
 */
export class Authlete extends AuthleteCore {
  constructor(options: AuthleteOptions = {}) {
    const { idpURL, apiServerId, ...sdkOptions } = options;

    const idpBase = idpURL ? normalizeIdpBase(idpURL) : undefined;

    // Auto-derive the SaaS cluster ID only when the IDP is the default
    // (login.authlete.com). A custom idpURL signals a DC/self-managed
    // deployment where Authlete's SaaS cluster IDs are meaningless —
    // there we inject nothing unless apiServerId is set explicitly.
    const usesDefaultIdp =
      idpBase === undefined || idpBase === DEFAULT_IDP_ORIGIN;
    const resolvedApiServerId = apiServerId
      ?? (usesDefaultIdp
        ? SAAS_CLUSTER_IDS[resolveMainOrigin(sdkOptions)]
        : undefined);

    if (idpBase !== undefined || resolvedApiServerId !== undefined) {
      // Routing rules are per-instance state, so they must never be
      // registered on a caller-provided httpClient (which may be shared
      // across SDK instances). Each instance gets its own private
      // HTTPClient; a provided one is wrapped via delegation, so its
      // fetcher and hooks keep working.
      const inner = sdkOptions.httpClient;
      const httpClient = inner
        ? new HTTPClient({
          fetcher: (input, init) =>
            inner.request(
              input instanceof Request && init == null
                ? input
                : new Request(input, init),
            ),
        })
        : new HTTPClient();
      httpClient.addHook(
        "beforeRequest",
        buildIdpRoutingHook(idpBase, resolvedApiServerId),
      );
      sdkOptions.httpClient = httpClient;
    }

    super(sdkOptions);
  }
}

function buildIdpRoutingHook(
  idpBase: string | undefined,
  apiServerId: number | undefined,
): (request: Request) => Promise<Request> {
  return async (request: Request): Promise<Request> => {
    const url = new URL(request.url);

    // Only requests targeting the spec-defined IDP origin are touched.
    // Per-call serverURL overrides produce a different origin and pass
    // through untouched.
    if (url.origin !== DEFAULT_IDP_ORIGIN) {
      return request;
    }

    // idpBase may carry a path prefix (DC deployments behind a gateway);
    // the original operation path is appended after it.
    const targetBase = idpBase ?? url.origin;
    const contentType = request.headers.get("content-type") ?? "";
    const needsApiServerId = apiServerId !== undefined
      && request.method === "POST"
      && API_SERVER_ID_PATHS.has(url.pathname)
      && contentType.includes("application/json");

    if (targetBase === url.origin && !needsApiServerId) {
      return request;
    }

    const targetUrl = targetBase + url.pathname + url.search;
    let body: string | null = null;

    if (request.body != null) {
      body = await request.text();
      if (needsApiServerId) {
        try {
          const parsed: unknown = JSON.parse(body);
          if (
            parsed !== null
            && typeof parsed === "object"
            && !Array.isArray(parsed)
            && (parsed as Record<string, unknown>)["apiServerId"] == null
          ) {
            (parsed as Record<string, unknown>)["apiServerId"] = apiServerId;
            body = JSON.stringify(parsed);
          }
        } catch {
          // Body is not valid JSON — leave it untouched.
        }
      }
    }

    return new Request(targetUrl, {
      method: request.method,
      headers: request.headers,
      body: body,
      signal: request.signal,
      redirect: request.redirect,
    });
  };
}
