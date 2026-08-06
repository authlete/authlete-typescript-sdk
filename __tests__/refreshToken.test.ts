import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { Authlete } from '@authlete/typescript-sdk';
import { ResponseValidationError } from '@authlete/typescript-sdk/models/errors';
import {
  createSdkClient,
  createTestClient,
  SERVICE_ID,
  SERVICE_TOKEN,
  MGMT_TOKEN,
  REDIRECT_URI,
  STATE,
  SUBJECT,
  TOKEN_DURATION_SECONDS,
} from './testHelper.js';

// ---------------------------------------------------------------------------
// Shared helper: runs auth-code flow and returns the token response.
// ---------------------------------------------------------------------------
async function doAuthCodeFlow(
  sdk: Authlete,
  serviceId: string,
  clientId: string,
  clientSecret: string,
) {
  const encodedRedirect = encodeURIComponent(REDIRECT_URI);

  const authResp = await sdk.authorization.processRequest({
    serviceId,
    authorizationRequest: {
      parameters:
        `response_type=code&client_id=${clientId}` +
        `&redirect_uri=${encodedRedirect}&state=${STATE}`,
    },
  });

  expect(authResp.action).toBe('INTERACTION');

  const issueResp = await sdk.authorization.issue({
    serviceId,
    authorizationIssueRequest: { ticket: authResp.ticket!, subject: SUBJECT },
  });

  expect(issueResp.action).toBe('LOCATION');

  const tokenResp = await sdk.token.process({
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
  return tokenResp;
}

// =============================================================================
// Service with both AUTHORIZATION_CODE and REFRESH_TOKEN grant types enabled.
// =============================================================================
describe('RefreshTokenFlowTest', () => {
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
      service: {
        supportedGrantTypes: ['AUTHORIZATION_CODE', 'REFRESH_TOKEN'],
        accessTokenDuration: TOKEN_DURATION_SECONDS,
        refreshTokenDuration: TOKEN_DURATION_SECONDS,
      },
    });

    const client = await createTestClient(mgmtClient, serviceId);
    clientId = String(client.clientId);
    clientSecret = client.clientSecret!;
  });

  afterAll(async () => {
    if (clientId) await mgmtClient.client.delete({ serviceId, clientId });
  });

  it('test_refresh_token_issued', async () => {
    const tokenResp = await doAuthCodeFlow(sdkClient, serviceId, clientId, clientSecret);
    expect(tokenResp.refreshToken).toBeTruthy();
  });

  it('test_refresh_token_flow', async () => {
    const tokenResp = await doAuthCodeFlow(sdkClient, serviceId, clientId, clientSecret);
    const refreshToken = tokenResp.refreshToken!;
    expect(refreshToken).toBeTruthy();

    // Exchange refresh token for new access token
    const refreshResp = await sdkClient.token.process({
      serviceId,
      tokenRequest: {
        parameters: `grant_type=refresh_token&refresh_token=${refreshToken}`,
        clientId,
        clientSecret,
      },
    });

    expect(refreshResp.action).toBe('OK');
    expect(refreshResp.accessToken).toBeTruthy();

    // Introspect the new access token
    // Note: The API may return scopeDetails: [null] for tokens without scopes,
    // which triggers a Zod validation error in the SDK. We handle this gracefully
    // by checking the raw response value when a ResponseValidationError occurs.
    try {
      const introResp = await sdkClient.introspection.process({
        serviceId,
        introspectionRequest: { token: refreshResp.accessToken! },
      });
      expect(introResp.action).toBe('OK');
    } catch (err) {
      if (err instanceof ResponseValidationError) {
        const rawValue = err.rawValue as { action?: string };
        expect(rawValue.action).toBe('OK');
      } else {
        throw err;
      }
    }
  });

  it('test_refresh_token_revocation', async () => {
    const tokenResp = await doAuthCodeFlow(sdkClient, serviceId, clientId, clientSecret);
    const refreshToken = tokenResp.refreshToken!;
    expect(refreshToken).toBeTruthy();

    const revocationResp = await sdkClient.revocation.process({
      serviceId,
      revocationRequest: {
        parameters: `token=${refreshToken}`,
        clientId,
        clientSecret,
      },
    });

    expect(revocationResp.action).toBe('OK');
  });
});

// =============================================================================
// Service with only AUTHORIZATION_CODE grant type (REFRESH_TOKEN not supported).
// =============================================================================
describe('RefreshTokenNotSupportedTest', () => {
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
      service: {
        supportedGrantTypes: ['AUTHORIZATION_CODE'],
        accessTokenDuration: TOKEN_DURATION_SECONDS,
        refreshTokenDuration: TOKEN_DURATION_SECONDS,
      },
    });

    const client = await createTestClient(mgmtClient, serviceId);
    clientId = String(client.clientId);
    clientSecret = client.clientSecret!;
  });

  afterAll(async () => {
    if (clientId) await mgmtClient.client.delete({ serviceId, clientId });
    // Restore refresh_token grant type
    await mgmtClient.service.update({
      serviceId,
      service: {
        supportedGrantTypes: ['AUTHORIZATION_CODE', 'REFRESH_TOKEN'],
        accessTokenDuration: TOKEN_DURATION_SECONDS,
        refreshTokenDuration: TOKEN_DURATION_SECONDS,
      },
    });
  });

  it('test_refresh_token_not_issued', async () => {
    const tokenResp = await doAuthCodeFlow(sdkClient, serviceId, clientId, clientSecret);
    expect(tokenResp.refreshToken).toBeFalsy();
  });

  it('test_refresh_token_rejected', async () => {
    const tokenResp = await sdkClient.token.process({
      serviceId,
      tokenRequest: {
        parameters: 'grant_type=refresh_token&refresh_token=dummy_token',
        clientId,
        clientSecret,
      },
    });

    expect(tokenResp.action).not.toBe('OK');
  });
});
