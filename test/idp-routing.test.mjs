/*
 * IDP routing verification for src/client.ts.
 *
 * Runs against the BUILT package output (dist/esm) so it verifies the
 * artifact customers actually consume, not just the TypeScript source.
 *
 *   npm run build && node --test test/idp-routing.test.mjs
 *
 * No network access: a capture fetcher records every request the SDK
 * would send and returns a canned response.
 */

import assert from "node:assert/strict";
import { test } from "node:test";

import { Authlete } from "../dist/esm/client.js";
import { HTTPClient } from "../dist/esm/lib/http.js";

/** Builds an HTTPClient whose fetcher captures requests instead of sending them. */
function captureClient(captured) {
  return new HTTPClient({
    fetcher: async (input, init) => {
      const request = input instanceof Request ? input : new Request(input, init);
      captured.push({
        method: request.method,
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

/** SDK calls parse the canned "{}" response; parse failures are irrelevant here. */
async function swallow(promise) {
  try {
    await promise;
  } catch {
    // Only the captured request matters.
  }
}

test("default SaaS: service.create routes to login.authlete.com with US apiServerId", async () => {
  const captured = [];
  const sdk = new Authlete({ bearer: "t", httpClient: captureClient(captured) });

  await swallow(sdk.service.create({ organizationId: 12345 }));

  assert.equal(captured.length, 1);
  assert.equal(captured[0].url.origin, "https://login.authlete.com");
  assert.equal(captured[0].url.pathname, "/api/service");
  assert.equal(JSON.parse(captured[0].body).apiServerId, 76281);
});

test("main-API calls are untouched", async () => {
  const captured = [];
  const sdk = new Authlete({
    bearer: "t",
    idpURL: "https://idp.example.test",
    httpClient: captureClient(captured),
  });

  await swallow(sdk.service.get({ serviceId: "42" }));

  assert.equal(captured[0].url.origin, "https://us.authlete.com");
  assert.equal(captured[0].url.pathname, "/api/42/service/get");
});

test("idpURL override reroutes IDP operations only", async () => {
  const captured = [];
  const sdk = new Authlete({
    bearer: "t",
    serverURL: "https://authlete.example.com",
    idpURL: "https://authlete-login.example.com",
    apiServerId: 99999,
    httpClient: captureClient(captured),
  });

  await swallow(sdk.service.create({ organizationId: 1 }));
  await swallow(sdk.service.get({ serviceId: "42" }));

  assert.equal(captured[0].url.origin, "https://authlete-login.example.com");
  assert.equal(captured[0].url.pathname, "/api/service");
  assert.equal(JSON.parse(captured[0].body).apiServerId, 99999);

  assert.equal(captured[1].url.origin, "https://authlete.example.com");
});

test("JP cluster: apiServerId derived from serverURL", async () => {
  const captured = [];
  const sdk = new Authlete({
    bearer: "t",
    serverURL: "https://jp.authlete.com",
    httpClient: captureClient(captured),
  });

  await swallow(sdk.service.create({ organizationId: 1 }));

  assert.equal(JSON.parse(captured[0].body).apiServerId, 53285);
});

test("caller-provided apiServerId in the body is never overwritten", async () => {
  const captured = [];
  const sdk = new Authlete({ bearer: "t", httpClient: captureClient(captured) });

  await swallow(sdk.service.create({ organizationId: 1, apiServerId: 424242 }));

  assert.equal(JSON.parse(captured[0].body).apiServerId, 424242);
});

test("service.remove gets apiServerId injected too", async () => {
  const captured = [];
  const sdk = new Authlete({
    bearer: "t",
    serverURL: "https://eu.authlete.com",
    idpURL: "https://idp.example.test",
    apiServerId: 63294,
    httpClient: captureClient(captured),
  });

  await swallow(sdk.service.remove({ organizationId: 1, serviceId: 42 }));

  assert.equal(captured[0].url.origin, "https://idp.example.test");
  assert.equal(captured[0].url.pathname, "/api/service/remove");
  assert.equal(JSON.parse(captured[0].body).apiServerId, 63294);
});

// --- Regression tests for review findings (PR #36, reviewer: Otso) ---

test("shared httpClient: each instance keeps its own apiServerId", async () => {
  const captured = [];
  const shared = captureClient(captured);
  const sdkA = new Authlete({ bearer: "a", apiServerId: 111, httpClient: shared });
  const sdkB = new Authlete({ bearer: "b", apiServerId: 222, httpClient: shared });

  await swallow(sdkA.service.create({ organizationId: 1 }));
  await swallow(sdkB.service.create({ organizationId: 1 }));

  assert.equal(JSON.parse(captured[0].body).apiServerId, 111);
  assert.equal(JSON.parse(captured[1].body).apiServerId, 222);
});

test("shared httpClient: one instance's idpURL never hijacks another's routing", async () => {
  const captured = [];
  const shared = captureClient(captured);
  const sdkA = new Authlete({
    bearer: "a",
    idpURL: "https://idp-a.example.test",
    httpClient: shared,
  });
  const sdkB = new Authlete({ bearer: "b", httpClient: shared });

  await swallow(sdkA.service.create({ organizationId: 1 }));
  await swallow(sdkB.service.create({ organizationId: 1 }));

  assert.equal(captured[0].url.origin, "https://idp-a.example.test");
  assert.equal(captured[1].url.origin, "https://login.authlete.com");
});

test("caller-provided httpClient keeps its own hooks working (delegation)", async () => {
  const captured = [];
  const inner = captureClient(captured);
  inner.addHook("beforeRequest", (request) => {
    const headers = new Headers(request.headers);
    headers.set("x-caller-hook", "ran");
    return new Request(request, { headers });
  });
  const sdk = new Authlete({
    bearer: "t",
    idpURL: "https://idp.example.test",
    httpClient: inner,
    // captureClient doesn't record headers; assert via fetcher below instead.
  });

  let sawHeader = false;
  inner.addHook("response", (_res, req) => {
    sawHeader = req.headers.get("x-caller-hook") === "ran";
  });

  await swallow(sdk.service.create({ organizationId: 1 }));

  assert.equal(captured[0].url.origin, "https://idp.example.test");
  assert.equal(sawHeader, true, "caller's own beforeRequest hook did not run");
});

test("custom idpURL without apiServerId: nothing is injected", async () => {
  const captured = [];
  const sdk = new Authlete({
    bearer: "t",
    idpURL: "https://authlete-login.customer.com",
    httpClient: captureClient(captured),
  });

  await swallow(sdk.service.create({ organizationId: 1 }));

  assert.equal(captured[0].url.origin, "https://authlete-login.customer.com");
  assert.equal(JSON.parse(captured[0].body).apiServerId, undefined);
});

test("custom idpURL disables derivation even with a SaaS serverURL", async () => {
  const captured = [];
  const sdk = new Authlete({
    bearer: "t",
    serverURL: "https://jp.authlete.com",
    idpURL: "https://authlete-login.customer.com",
    httpClient: captureClient(captured),
  });

  await swallow(sdk.service.create({ organizationId: 1 }));

  assert.equal(JSON.parse(captured[0].body).apiServerId, undefined);
});

test("idpURL with a path prefix keeps the prefix (gateway deployments)", async () => {
  const captured = [];
  const sdk = new Authlete({
    bearer: "t",
    idpURL: "https://gateway.customer.com/authlete-idp",
    apiServerId: 7,
    httpClient: captureClient(captured),
  });

  await swallow(sdk.service.create({ organizationId: 1 }));

  assert.equal(
    captured[0].url.href,
    "https://gateway.customer.com/authlete-idp/api/service",
  );
});

test("idpURL trailing slash is normalized away", async () => {
  const captured = [];
  const sdk = new Authlete({
    bearer: "t",
    idpURL: "https://idp.example.test/",
    apiServerId: 7,
    httpClient: captureClient(captured),
  });

  await swallow(sdk.service.create({ organizationId: 1 }));

  assert.equal(captured[0].url.href, "https://idp.example.test/api/service");
});

test("five clients in mixed configurations share one httpClient, all isolated", async () => {
  const captured = [];
  const shared = captureClient(captured);
  const clients = [
    new Authlete({ bearer: "1", apiServerId: 101, httpClient: shared }),
    new Authlete({ bearer: "2", apiServerId: 202, httpClient: shared }),
    new Authlete({ bearer: "3", serverURL: "https://jp.authlete.com", httpClient: shared }),
    new Authlete({ bearer: "4", idpURL: "https://idp-4.example.test", apiServerId: 404, httpClient: shared }),
    new Authlete({ bearer: "5", idpURL: "https://idp-5.example.test", httpClient: shared }),
  ];
  for (const client of clients) {
    await swallow(client.service.create({ organizationId: 1 }));
  }

  const results = captured.map((c) => ({
    origin: c.url.origin,
    apiServerId: JSON.parse(c.body).apiServerId,
  }));
  assert.deepEqual(results, [
    { origin: "https://login.authlete.com", apiServerId: 101 },
    { origin: "https://login.authlete.com", apiServerId: 202 },
    { origin: "https://login.authlete.com", apiServerId: 53285 },
    { origin: "https://idp-4.example.test", apiServerId: 404 },
    { origin: "https://idp-5.example.test", apiServerId: undefined },
  ]);
});

// --- Reviewer-authored test cases (Otso) ---

test("two clients sharing one httpClient stay isolated", async () => {
  const captured = [];
  const shared = captureClient(captured);

  new Authlete({
    bearer: "t1",
    serverURL: "https://us.authlete.com",
    httpClient: shared,
  });

  const jp = new Authlete({
    bearer: "t2",
    serverURL: "https://jp.authlete.com",
    httpClient: shared,
  });

  await swallow(jp.service.create({ organizationId: 1 }));

  assert.equal(captured[0].url.origin, "https://login.authlete.com");
  assert.equal(
    JSON.parse(captured[0].body).apiServerId,
    53285,
    "the JP client sent another client's cluster ID",
  );
});

test("idpURL with an untouched serverURL injects no apiServerId", async () => {
  const captured = [];
  const sdk = new Authlete({
    bearer: "customer-token",
    idpURL: "https://authlete-login.customer.example",
    httpClient: captureClient(captured),
  });

  await swallow(sdk.service.create({ organizationId: 1 }));

  assert.equal(captured[0].url.origin, "https://authlete-login.customer.example");
  assert.equal(
    JSON.parse(captured[0].body).apiServerId,
    undefined,
    "US apiserver ID was injected into a request aimed at a customer's own IDP",
  );
});

test("explicit idpURL equal to the default keeps SaaS derivation", async () => {
  const captured = [];
  const sdk = new Authlete({
    bearer: "t",
    idpURL: "https://login.authlete.com",
    httpClient: captureClient(captured),
  });

  await swallow(sdk.service.create({ organizationId: 1 }));

  assert.equal(JSON.parse(captured[0].body).apiServerId, 76281);
});

test("audit GET operations reroute without body manipulation", async () => {
  const captured = [];
  const sdk = new Authlete({
    bearer: "t",
    idpURL: "https://idp.example.test",
    httpClient: captureClient(captured),
  });

  await swallow(sdk.audit.getTypes({}));

  assert.equal(captured[0].method, "GET");
  assert.equal(captured[0].url.origin, "https://idp.example.test");
  assert.equal(captured[0].body, null);
});

test("per-call serverURL override wins over idpURL", async () => {
  const captured = [];
  const sdk = new Authlete({
    bearer: "t",
    idpURL: "https://idp.example.test",
    httpClient: captureClient(captured),
  });

  await swallow(sdk.service.create(
    { organizationId: 1 },
    { serverURL: "https://percall.example.test" },
  ));

  assert.equal(captured[0].url.origin, "https://percall.example.test");
});

test("plain generated behaviour is preserved when no options are set", async () => {
  const captured = [];
  const sdk = new Authlete({ bearer: "t", httpClient: captureClient(captured) });

  await swallow(sdk.service.list({}));

  assert.equal(captured[0].url.origin, "https://us.authlete.com");
});
