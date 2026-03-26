import { randomBytes, createHash } from 'node:crypto';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { Authlete } from '@authlete/typescript-sdk';
import {
  createSdkClient,
  createTestClient,
  SERVICE_ID,
  SERVICE_TOKEN,
  MGMT_TOKEN,
  REDIRECT_URI,
  STATE,
  SUBJECT,
} from '../testHelper.js';
import {
  setupOidcService,
  decodeJwtPayload,
  assertOidcClaims,
} from './oidcHelper.js';

function generateCodeVerifier(): string {
  return randomBytes(48).toString('base64url');
}

function s256CodeChallenge(codeVerifier: string): string {
  return createHash('sha256').update(codeVerifier).digest('base64url');
}

describe('OidcPkceFlowTest', () => {
  let serviceId: string;
  let mgmtClient: Authlete;
  let sdkClient: Authlete;
  let clientId: string;
  let clientSecret: string;

  beforeAll(async () => {
    serviceId = SERVICE_ID;
    mgmtClient = createSdkClient(MGMT_TOKEN);
    sdkClient = createSdkClient(SERVICE_TOKEN);

    await setupOidcService(mgmtClient, serviceId);

    const client = await createTestClient(mgmtClient, serviceId);
    clientId = String(client.clientId);
    clientSecret = client.clientSecret!;
  });

  afterAll(async () => {
    if (clientId) await mgmtClient.client.delete({ serviceId, clientId });
  });

  it('test_pkce_s256_oidc_flow', async () => {
    const nonce = randomBytes(16).toString('hex');
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = s256CodeChallenge(codeVerifier);
    const encodedRedirect = encodeURIComponent(REDIRECT_URI);

    // Authorization request with openid scope, nonce, and PKCE
    const authResp = await sdkClient.authorization.processRequest({
      serviceId,
      authorizationRequest: {
        parameters:
          `response_type=code&client_id=${clientId}` +
          `&redirect_uri=${encodedRedirect}` +
          `&scope=openid&nonce=${nonce}&state=${STATE}` +
          `&code_challenge=${codeChallenge}&code_challenge_method=S256`,
      },
    });

    expect(authResp.action).toBe('INTERACTION');
    expect(authResp.ticket).toBeTruthy();

    const issueResp = await sdkClient.authorization.issue({
      serviceId,
      authorizationIssueRequest: { ticket: authResp.ticket!, subject: SUBJECT },
    });

    expect(issueResp.action).toBe('LOCATION');
    expect(issueResp.authorizationCode).toBeTruthy();

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

    expect(tokenResp.action).toBe('OK');
    expect(tokenResp.accessToken).toBeTruthy();

    const idToken = String(tokenResp.idToken);
    expect(idToken).toBeTruthy();

    assertOidcClaims(decodeJwtPayload(idToken), SUBJECT, nonce, clientId);
  });
});
