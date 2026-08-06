import { randomBytes } from 'node:crypto';
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
  generateEcKey,
  dpopProof,
  TOKEN_ENDPOINT,
} from '../dpopHelper.js';
import {
  setupOidcService,
  decodeJwtPayload,
  assertOidcClaims,
} from './oidcHelper.js';

describe('OidcDpopFlowTest', () => {
  let serviceId: string;
  let mgmtClient: Authlete;
  let sdkClient: Authlete;
  let clientId: string;
  let clientSecret: string;

  beforeAll(async () => {
    serviceId = SERVICE_ID;
    mgmtClient = createSdkClient(MGMT_TOKEN);
    sdkClient = createSdkClient(SERVICE_TOKEN);

    await setupOidcService(mgmtClient, serviceId, TOKEN_ENDPOINT);

    const client = await createTestClient(mgmtClient, serviceId);
    clientId = String(client.clientId);
    clientSecret = client.clientSecret!;
  });

  afterAll(async () => {
    if (clientId) await mgmtClient.client.delete({ serviceId, clientId });
  });

  it('test_dpop_oidc_flow', async () => {
    const keyPair = await generateEcKey();
    const nonce = randomBytes(16).toString('hex');
    const encodedRedirect = encodeURIComponent(REDIRECT_URI);

    // Step 1: Authorization request with openid scope, nonce
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

    // Step 2: Issue authorization code
    const issueResp = await sdkClient.authorization.issue({
      serviceId,
      authorizationIssueRequest: { ticket: authResp.ticket!, subject: SUBJECT },
    });

    expect(issueResp.action).toBe('LOCATION');
    expect(issueResp.authorizationCode).toBeTruthy();

    // Step 3: Token request with DPoP proof
    const tokenResp = await sdkClient.token.process({
      serviceId,
      tokenRequest: {
        parameters:
          `grant_type=authorization_code` +
          `&code=${issueResp.authorizationCode}` +
          `&redirect_uri=${encodedRedirect}`,
        clientId,
        clientSecret,
        dpop: await dpopProof(keyPair, 'POST', TOKEN_ENDPOINT),
        htm: 'POST',
        htu: TOKEN_ENDPOINT,
      },
    });

    expect(tokenResp.action).toBe('OK');
    expect(tokenResp.accessToken).toBeTruthy();

    // Validate ID token
    const idToken = String(tokenResp.idToken);
    expect(idToken).toBeTruthy();

    assertOidcClaims(decodeJwtPayload(idToken), SUBJECT, nonce, clientId);
  });
});
