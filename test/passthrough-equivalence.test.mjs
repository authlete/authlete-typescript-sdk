/*
 * Passthrough equivalence guard.
 *
 * Proves the IDP-aware wrapper (src/client.ts) leaves the REST of the SDK
 * completely unaffected: for every non-IDP operation, the wrapper — even
 * with idpURL and apiServerId configured — must produce a request that is
 * BYTE-IDENTICAL to the plain generated class: same method, same full URL,
 * same auth header, same content-type, same body.
 *
 * Operations are sampled from every SDK group (authorization, token,
 * introspection, revocation, userinfo, client, PAR, device flow, CIBA,
 * verifiable credentials, HSK, service, token management).
 *
 *   npm run build && node --test test/passthrough-equivalence.test.mjs
 */

import assert from "node:assert/strict";
import { test } from "node:test";

import { Authlete as PlainSDK } from "../dist/esm/sdk/sdk.js";
import { Authlete as WrappedSDK } from "../dist/esm/client.js";
import { HTTPClient } from "../dist/esm/lib/http.js";

function captureClient(captured) {
  return new HTTPClient({
    fetcher: async (input, init) => {
      const request = input instanceof Request ? input : new Request(input, init);
      captured.push({
        method: request.method,
        url: request.url,
        authorization: request.headers.get("authorization"),
        contentType: request.headers.get("content-type"),
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
    // Response parsing of the canned "{}" is irrelevant here.
  }
}

// One entry per SDK group — representative non-IDP operations.
const OPERATIONS = [
  ["authorization.processRequest", (s) =>
    s.authorization.processRequest({ serviceId: "1", authorizationRequest: { parameters: "response_type=code&client_id=x" } })],
  ["token.process", (s) =>
    s.token.process({ serviceId: "1", tokenRequest: { parameters: "grant_type=authorization_code&code=x" } })],
  ["introspection.process", (s) =>
    s.introspection.process({ serviceId: "1", introspectionRequest: { token: "at-x" } })],
  ["revocation.process", (s) =>
    s.revocation.process({ serviceId: "1", revocationRequest: { parameters: "token=at-x" } })],
  ["userinfo.process", (s) =>
    s.userinfo.process({ serviceId: "1", userinfoRequest: { token: "at-x" } })],
  ["client.get", (s) => s.client.get({ serviceId: "1", clientId: "2" })],
  ["client.list", (s) => s.client.list({ serviceId: "1" })],
  ["client.delete", (s) => s.client.delete({ serviceId: "1", clientId: "2" })],
  ["pushedAuthorization.create", (s) =>
    s.pushedAuthorization.create({ serviceId: "1", pushedAuthorizationRequest: { parameters: "response_type=code" } })],
  ["deviceFlow.authorization", (s) =>
    s.deviceFlow.authorization({ serviceId: "1", deviceAuthorizationRequest: { parameters: "client_id=x" } })],
  ["ciba.processAuthentication", (s) =>
    s.ciba.processAuthentication({ serviceId: "1", backchannelAuthenticationRequest: { parameters: "login_hint=x" } })],
  ["verifiableCredentials.getMetadata", (s) =>
    s.verifiableCredentials.getMetadata({ serviceId: "1", vciMetadataRequest: { pretty: false } })],
  ["hardwareSecurityKeys.list", (s) => s.hardwareSecurityKeys.list({ serviceId: "1" })],
  ["service.getConfiguration", (s) => s.service.getConfiguration({ serviceId: "1" })],
  ["service.get", (s) => s.service.get({ serviceId: "1" })],
  ["service.list", (s) => s.service.list({})],
  ["token.management.list", (s) => s.token.management.list({ serviceId: "1" })],
];

for (const [name, invoke] of OPERATIONS) {
  test(`${name}: wrapper request is byte-identical to plain SDK`, async () => {
    const plainCaptured = [];
    const plain = new PlainSDK({
      bearer: "test-token",
      httpClient: captureClient(plainCaptured),
    });

    const wrappedCaptured = [];
    // Worst case for interference: ALL wrapper features enabled.
    const wrapped = new WrappedSDK({
      bearer: "test-token",
      idpURL: "https://idp.example.test",
      apiServerId: 424242,
      httpClient: captureClient(wrappedCaptured),
    });

    await swallow(invoke(plain));
    await swallow(invoke(wrapped));

    assert.equal(
      plainCaptured.length,
      1,
      `plain SDK sent no request — fix the test input for ${name}`,
    );
    assert.equal(
      wrappedCaptured.length,
      1,
      `wrapper sent no request — fix the test input for ${name}`,
    );
    assert.deepEqual(
      wrappedCaptured[0],
      plainCaptured[0],
      `wrapper altered a non-IDP request for ${name}`,
    );
  });
}

test("sanity: the same harness DOES detect the intended IDP difference", async () => {
  // Guards against a vacuous pass: if the harness is wired correctly, the
  // one place the wrapper is SUPPOSED to differ must show up as different.
  const plainCaptured = [];
  const plain = new PlainSDK({
    bearer: "test-token",
    httpClient: captureClient(plainCaptured),
  });
  const wrappedCaptured = [];
  const wrapped = new WrappedSDK({
    bearer: "test-token",
    idpURL: "https://idp.example.test",
    apiServerId: 424242,
    httpClient: captureClient(wrappedCaptured),
  });

  await swallow(plain.service.create({ organizationId: 1 }));
  await swallow(wrapped.service.create({ organizationId: 1 }));

  assert.notDeepEqual(wrappedCaptured[0], plainCaptured[0]);
  assert.equal(new URL(wrappedCaptured[0].url).origin, "https://idp.example.test");
  assert.equal(new URL(plainCaptured[0].url).origin, "https://login.authlete.com");
});
