/*
 * Root-export guard.
 *
 * Verifies that the package's MAIN entry point — the import every doc and
 * generated code sample shows — serves the IDP-aware client, not the plain
 * generated class:
 *
 *   import { Authlete } from "@authlete/typescript-sdk";
 *
 * Speakeasy regenerates src/index.ts on every run, reverting the root
 * export to the plain class. scripts/patch-root-export.mjs (wired as
 * "prebuild") re-applies the swap on every build. THIS test is the
 * backstop: if the patch ever fails to apply, the routing assertions
 * below fail and CI blocks the merge/publish.
 *
 *   npm run build && node --test test/root-export.test.mjs
 */

import assert from "node:assert/strict";
import { test } from "node:test";

// Deliberately the ROOT index — not ../dist/esm/client.js.
import { Authlete } from "../dist/esm/index.js";
import { HTTPClient } from "../dist/esm/lib/http.js";

function captureClient(captured) {
  return new HTTPClient({
    fetcher: async (input, init) => {
      const request = input instanceof Request ? input : new Request(input, init);
      captured.push({
        url: new URL(request.url),
        body: request.body == null ? null : await request.text(),
      });
      return new Response("{}", {
        status: 200,
        headers: { "content-type": "application/json" },
      });
    },
  });
}

async function swallow(promise) {
  try {
    await promise;
  } catch {
    // Only the captured request matters.
  }
}

test("root import accepts the IDP-aware constructor options", () => {
  // The plain generated class would ignore these options; the wrapper
  // declares them. Constructing must not throw either way, so the real
  // assertion is behavioural (next test) — this one documents intent.
  const sdk = new Authlete({
    bearer: "t",
    idpURL: "https://idp.example.test",
    apiServerId: 1,
  });
  assert.ok(sdk instanceof Authlete);
});

test("root import routes IDP calls via idpURL (proves wrapper is the root export)", async () => {
  const captured = [];
  const sdk = new Authlete({
    bearer: "t",
    idpURL: "https://idp.example.test",
    apiServerId: 99999,
    httpClient: captureClient(captured),
  });

  await swallow(sdk.service.create({ organizationId: 1 }));

  assert.equal(captured.length, 1);
  assert.equal(
    captured[0].url.origin,
    "https://idp.example.test",
    "IDP call was NOT rerouted — the root export is serving the plain " +
      "generated class. Run scripts/patch-root-export.mjs (or `npm run build`) " +
      "and rebuild before publishing.",
  );
  assert.equal(JSON.parse(captured[0].body).apiServerId, 99999);
});

test("root import auto-injects SaaS apiServerId by default", async () => {
  const captured = [];
  const sdk = new Authlete({ bearer: "t", httpClient: captureClient(captured) });

  await swallow(sdk.service.create({ organizationId: 1 }));

  assert.equal(captured[0].url.origin, "https://login.authlete.com");
  assert.equal(JSON.parse(captured[0].body).apiServerId, 76281);
});

test("root import leaves main-API traffic untouched", async () => {
  const captured = [];
  const sdk = new Authlete({
    bearer: "t",
    idpURL: "https://idp.example.test",
    httpClient: captureClient(captured),
  });

  await swallow(sdk.service.get({ serviceId: "42" }));

  assert.equal(captured[0].url.origin, "https://us.authlete.com");
});
