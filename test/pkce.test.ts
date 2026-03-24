import { randomBytes, createHash } from 'node:crypto';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { Authlete } from '@authlete/typescript-sdk';
import {
  createSdkClient,
  createTestClient,
  assertTokenValid,
  SERVICE_ID,
  SERVICE_TOKEN,
  MGMT_TOKEN,
  REDIRECT_URI,
  STATE,
  SUBJECT,
  TOKEN_DURATION_SECONDS,
} from './testHelper.js';

// ---------------------------------------------------------------------------
// PKCE helpers
// ---------------------------------------------------------------------------
function generateCodeVerifier(): string {
  return randomBytes(48).toString('base64url');
}

function s256CodeChallenge(codeVerifier: string): string {
  return createHash('sha256').update(codeVerifier).digest('base64url');
}

// ---------------------------------------------------------------------------
// Shared flow helper
// ---------------------------------------------------------------------------
async function authCodeFlowWithPkce(
  sdkClient: Authlete,
  serviceId: string,
  clientId: string,
  clientSecret: string,
  codeVerifier: string,
  codeChallenge: string,
  codeChallengeMethod: string,
) {
  const encodedRedirect = encodeURIComponent(REDIRECT_URI);

  // Authorization request with code_challenge
  const authResp = await sdkClient.authorization.processRequest({
    serviceId,
    authorizationRequest: {
      parameters:
        `response_type=code&client_id=${clientId}` +
        `&redirect_uri=${encodedRedirect}` +
        `&state=${STATE}` +
        `&code_challenge=${codeChallenge}&code_challenge_method=${codeChallengeMethod}`,
    },
  });

  expect(authResp.action).toBe('INTERACTION');
  expect(authResp.ticket).toBeTruthy();

  // Issue authorization code
  const issueResp = await sdkClient.authorization.issue({
    serviceId,
    authorizationIssueRequest: { ticket: authResp.ticket!, subject: SUBJECT },
  });

  expect(issueResp.action).toBe('LOCATION');
  expect(issueResp.authorizationCode).toBeTruthy();

  // Token request with code_verifier
  const tokenResp = await sdkClient.token.process({
    serviceId,
    tokenRequest: {
      parameters:
        `grant_type=authorization_code` +
        `&code=${issueResp.authorizationCode}` +
        `&redirect_uri=${encodedRedirect}` +
        `&code_verifier=${codeVerifier}`,
      clientId,
      clientSecret,
    },
  });

  return tokenResp;
}

// =============================================================================
// Standard service — PKCE is optional
// =============================================================================
describe('PkceFlowTest', () => {
  let serviceId: string;
  let mgmtClient: Authlete;
  let sdkClient: Authlete;
  let clientId: string;
  let clientSecret: string;

  beforeAll(async () => {
    serviceId = SERVICE_ID;
    mgmtClient = createSdkClient(MGMT_TOKEN);
    sdkClient = createSdkClient(SERVICE_TOKEN);

    await mgmtClient.service.update({
      serviceId,
      service: { accessTokenDuration: TOKEN_DURATION_SECONDS },
    });

    const client = await createTestClient(mgmtClient, serviceId);
    clientId = String(client.clientId);
    clientSecret = client.clientSecret!;
  });

  afterAll(async () => {
    if (clientId) await mgmtClient.client.delete({ serviceId, clientId });
  });

  it('test_pkce_s256_flow', async () => {
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = s256CodeChallenge(codeVerifier);

    const tokenResp = await authCodeFlowWithPkce(
      sdkClient, serviceId, clientId, clientSecret,
      codeVerifier, codeChallenge, 'S256',
    );

    expect(tokenResp.action).toBe('OK');
    expect(tokenResp.accessToken).toBeTruthy();
    await assertTokenValid(sdkClient, serviceId, tokenResp.accessToken!);
  });

  it('test_pkce_plain_flow', async () => {
    const codeVerifier = generateCodeVerifier();

    const tokenResp = await authCodeFlowWithPkce(
      sdkClient, serviceId, clientId, clientSecret,
      codeVerifier, codeVerifier, 'plain',
    );

    expect(tokenResp.action).toBe('OK');
    expect(tokenResp.accessToken).toBeTruthy();
    await assertTokenValid(sdkClient, serviceId, tokenResp.accessToken!);
  });

  it('test_wrong_code_verifier_rejected', async () => {
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = s256CodeChallenge(codeVerifier);
    const wrongVerifier = generateCodeVerifier();
    const encodedRedirect = encodeURIComponent(REDIRECT_URI);

    // Auth request with correct code_challenge
    const authResp = await sdkClient.authorization.processRequest({
      serviceId,
      authorizationRequest: {
        parameters:
          `response_type=code&client_id=${clientId}` +
          `&redirect_uri=${encodedRedirect}` +
          `&state=${STATE}` +
          `&code_challenge=${codeChallenge}&code_challenge_method=S256`,
      },
    });
    expect(authResp.action).toBe('INTERACTION');

    const issueResp = await sdkClient.authorization.issue({
      serviceId,
      authorizationIssueRequest: { ticket: authResp.ticket!, subject: SUBJECT },
    });
    expect(issueResp.action).toBe('LOCATION');

    // Token request with WRONG code_verifier
    const tokenResp = await sdkClient.token.process({
      serviceId,
      tokenRequest: {
        parameters:
          `grant_type=authorization_code` +
          `&code=${issueResp.authorizationCode}` +
          `&redirect_uri=${encodedRedirect}` +
          `&code_verifier=${wrongVerifier}`,
        clientId,
        clientSecret,
      },
    });

    expect(tokenResp.action).not.toBe('OK');
  });
});

// =============================================================================
// Service with pkceRequired: true
// =============================================================================
describe('PkceRequiredTest', () => {
  let serviceId: string;
  let mgmtClient: Authlete;
  let sdkClient: Authlete;
  let clientId: string;
  let clientSecret: string;

  beforeAll(async () => {
    serviceId = SERVICE_ID;
    mgmtClient = createSdkClient(MGMT_TOKEN);
    sdkClient = createSdkClient(SERVICE_TOKEN);

    await mgmtClient.service.update({
      serviceId,
      service: { pkceRequired: true, accessTokenDuration: TOKEN_DURATION_SECONDS },
    });

    const client = await createTestClient(mgmtClient, serviceId);
    clientId = String(client.clientId);
    clientSecret = client.clientSecret!;
  });

  afterAll(async () => {
    if (clientId) await mgmtClient.client.delete({ serviceId, clientId });
    await mgmtClient.service.update({
      serviceId,
      service: { pkceRequired: false, accessTokenDuration: TOKEN_DURATION_SECONDS },
    });
  });

  it('test_missing_code_challenge_rejected', async () => {
    const encodedRedirect = encodeURIComponent(REDIRECT_URI);

    const authResp = await sdkClient.authorization.processRequest({
      serviceId,
      authorizationRequest: {
        parameters:
          `response_type=code&client_id=${clientId}` +
          `&redirect_uri=${encodedRedirect}&state=${STATE}`,
      },
    });

    expect(authResp.action).not.toBe('INTERACTION');
  });

  it('test_pkce_s256_flow_succeeds', async () => {
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = s256CodeChallenge(codeVerifier);

    const tokenResp = await authCodeFlowWithPkce(
      sdkClient, serviceId, clientId, clientSecret,
      codeVerifier, codeChallenge, 'S256',
    );

    expect(tokenResp.action).toBe('OK');
    expect(tokenResp.accessToken).toBeTruthy();
    await assertTokenValid(sdkClient, serviceId, tokenResp.accessToken!);
  });
});

// =============================================================================
// Service with pkceS256Required: true
// =============================================================================
describe('PkceS256RequiredTest', () => {
  let serviceId: string;
  let mgmtClient: Authlete;
  let sdkClient: Authlete;
  let clientId: string;
  let clientSecret: string;

  beforeAll(async () => {
    serviceId = SERVICE_ID;
    mgmtClient = createSdkClient(MGMT_TOKEN);
    sdkClient = createSdkClient(SERVICE_TOKEN);

    await mgmtClient.service.update({
      serviceId,
      service: { pkceS256Required: true, accessTokenDuration: TOKEN_DURATION_SECONDS },
    });

    const client = await createTestClient(mgmtClient, serviceId);
    clientId = String(client.clientId);
    clientSecret = client.clientSecret!;
  });

  afterAll(async () => {
    if (clientId) await mgmtClient.client.delete({ serviceId, clientId });
    await mgmtClient.service.update({
      serviceId,
      service: { pkceS256Required: false, accessTokenDuration: TOKEN_DURATION_SECONDS },
    });
  });

  it('test_plain_method_rejected', async () => {
    const codeVerifier = generateCodeVerifier();
    const encodedRedirect = encodeURIComponent(REDIRECT_URI);

    const authResp = await sdkClient.authorization.processRequest({
      serviceId,
      authorizationRequest: {
        parameters:
          `response_type=code&client_id=${clientId}` +
          `&redirect_uri=${encodedRedirect}` +
          `&state=${STATE}` +
          `&code_challenge=${codeVerifier}&code_challenge_method=plain`,
      },
    });

    expect(authResp.action).not.toBe('INTERACTION');
  });

  it('test_s256_flow_succeeds', async () => {
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = s256CodeChallenge(codeVerifier);

    const tokenResp = await authCodeFlowWithPkce(
      sdkClient, serviceId, clientId, clientSecret,
      codeVerifier, codeChallenge, 'S256',
    );

    expect(tokenResp.action).toBe('OK');
    expect(tokenResp.accessToken).toBeTruthy();
    await assertTokenValid(sdkClient, serviceId, tokenResp.accessToken!);
  });
});
