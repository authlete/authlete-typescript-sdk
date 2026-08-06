import { randomBytes } from 'node:crypto';
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
} from '../testHelper.js';
import {
  setupOidcService,
  decodeJwtPayload,
  assertOidcClaims,
} from './oidcHelper.js';

describe('OidcAuthGrantFlowTest', () => {
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

  it('test_oidc_basic_flow', async () => {
    const nonce = randomBytes(16).toString('hex');
    const encodedRedirect = encodeURIComponent(REDIRECT_URI);

    // Step 1: Authorization request with scope=openid and nonce
    const authResp = await sdkClient.authorization.processRequest({
      serviceId,
      authorizationRequest: {
        parameters:
          `response_type=code&client_id=${clientId}` +
          `&redirect_uri=${encodedRedirect}` +
          `&scope=openid&nonce=${nonce}&state=${STATE}`,
      },
    });

    expect(authResp.action).toBe('INTERACTION');
    expect(authResp.ticket).toBeTruthy();

    // Step 2: Authorization issue (simulate user consent)
    const issueResp = await sdkClient.authorization.issue({
      serviceId,
      authorizationIssueRequest: {
        ticket: authResp.ticket!,
        subject: SUBJECT,
      },
    });

    expect(issueResp.action).toBe('LOCATION');
    expect(issueResp.authorizationCode).toBeTruthy();

    // Step 3: Token request
    const tokenResp = await sdkClient.token.process({
      serviceId,
      tokenRequest: {
        parameters:
          `grant_type=authorization_code` +
          `&code=${issueResp.authorizationCode}` +
          `&redirect_uri=${encodedRedirect}`,
        clientId,
        clientSecret,
      },
    });

    expect(tokenResp.action).toBe('OK');
    expect(tokenResp.accessToken).toBeTruthy();

    const idToken = String(tokenResp.idToken);
    expect(idToken).toBeTruthy();

    // Step 4: Validate ID token payload claims
    assertOidcClaims(decodeJwtPayload(idToken), SUBJECT, nonce, clientId);

    // Step 5: Introspect the access token
    await assertTokenValid(sdkClient, serviceId, tokenResp.accessToken!);
  });
});
