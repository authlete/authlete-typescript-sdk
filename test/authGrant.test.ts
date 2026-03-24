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

describe('AuthGrantFlowTest', () => {
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
    if (clientId) {
      await mgmtClient.client.delete({ serviceId, clientId });
    }
  });

  it('test_authorization_code_flow', async () => {
    const encodedRedirect = encodeURIComponent(REDIRECT_URI);

    // --- Step 1: Authorization Request ---
    const parameters =
      `response_type=code&client_id=${clientId}` +
      `&redirect_uri=${encodedRedirect}` +
      `&state=${STATE}`;

    const authResp = await sdkClient.authorization.processRequest({
      serviceId,
      authorizationRequest: { parameters },
    });

    expect(authResp.action).toBe('INTERACTION');
    expect(authResp.ticket).toBeTruthy();

    // --- Step 2: Authorization Issue (simulate user consent) ---
    const issueResp = await sdkClient.authorization.issue({
      serviceId,
      authorizationIssueRequest: {
        ticket: authResp.ticket!,
        subject: SUBJECT,
      },
    });

    expect(issueResp.action).toBe('LOCATION');
    expect(issueResp.authorizationCode).toBeTruthy();
    expect(issueResp.responseContent).toContain('code=');
    expect(issueResp.responseContent).toContain(`state=${STATE}`);

    // --- Step 3: Token Request ---
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

    // --- Step 4: Introspection ---
    await assertTokenValid(sdkClient, serviceId, tokenResp.accessToken!);

    // --- Step 5: Revocation ---
    const revocationResp = await sdkClient.revocation.process({
      serviceId,
      revocationRequest: {
        parameters: `token=${tokenResp.accessToken}`,
        clientId,
        clientSecret,
      },
    });

    expect(revocationResp.action).toBe('OK');
  });
});
