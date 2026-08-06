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
   * `serverURL` (or `serverIdx`) for Authlete SaaS clusters;
   * DC/self-managed customers must set it explicitly.
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

    const idpOrigin = idpURL ? new URL(idpURL).origin : undefined;
    const resolvedApiServerId = apiServerId
      ?? SAAS_CLUSTER_IDS[resolveMainOrigin(sdkOptions)];

    if (idpOrigin !== undefined || resolvedApiServerId !== undefined) {
      const httpClient = sdkOptions.httpClient ?? new HTTPClient();
      httpClient.addHook(
        "beforeRequest",
        buildIdpRoutingHook(idpOrigin, resolvedApiServerId),
      );
      sdkOptions.httpClient = httpClient;
    }

    super(sdkOptions);
  }
}

function buildIdpRoutingHook(
  idpOrigin: string | undefined,
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

    const targetOrigin = idpOrigin ?? url.origin;
    const contentType = request.headers.get("content-type") ?? "";
    const needsApiServerId = apiServerId !== undefined
      && request.method === "POST"
      && API_SERVER_ID_PATHS.has(url.pathname)
      && contentType.includes("application/json");

    if (targetOrigin === url.origin && !needsApiServerId) {
      return request;
    }

    const targetUrl = targetOrigin + url.pathname + url.search;
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
