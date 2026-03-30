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

// =============================================================================
// Standard service — PAR is optional
// =============================================================================
describe('ParFlowTest', () => {
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

  it('test_par_basic_flow', async () => {
    const encodedRedirect = encodeURIComponent(REDIRECT_URI);

    // Step 1: Push authorization parameters
    const parResp = await sdkClient.pushedAuthorization.create({
      serviceId,
      pushedAuthorizationRequest: {
        parameters:
          `response_type=code&client_id=${clientId}` +
          `&redirect_uri=${encodedRedirect}&state=${STATE}`,
        clientId,
        clientSecret,
      },
    });

    expect(parResp.action).toBe('CREATED');
    expect(parResp.requestUri).toBeTruthy();

    // Step 2: Authorization request using request_uri
    const authResp = await sdkClient.authorization.processRequest({
      serviceId,
      authorizationRequest: {
        parameters:
          `client_id=${clientId}` +
          `&request_uri=${encodeURIComponent(parResp.requestUri!)}`,
      },
    });

    expect(authResp.action).toBe('INTERACTION');
    expect(authResp.ticket).toBeTruthy();

    // Step 3: Issue authorization code
    const issueResp = await sdkClient.authorization.issue({
      serviceId,
      authorizationIssueRequest: { ticket: authResp.ticket!, subject: SUBJECT },
    });

    expect(issueResp.action).toBe('LOCATION');
    expect(issueResp.authorizationCode).toBeTruthy();

    // Step 4: Token exchange
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
    await assertTokenValid(sdkClient, serviceId, tokenResp.accessToken!);
  });

  it('test_par_missing_client_secret_rejected', async () => {
    const encodedRedirect = encodeURIComponent(REDIRECT_URI);

    const parResp = await sdkClient.pushedAuthorization.create({
      serviceId,
      pushedAuthorizationRequest: {
        parameters:
          `response_type=code&client_id=${clientId}` +
          `&redirect_uri=${encodedRedirect}&state=${STATE}`,
        clientId,
        // clientSecret intentionally omitted
      },
    });

    expect(parResp.action).not.toBe('CREATED');
  });
});

// =============================================================================
// Service with parRequired: true
// =============================================================================
describe('ParRequiredTest', () => {
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
      service: { parRequired: true, accessTokenDuration: TOKEN_DURATION_SECONDS },
    });

    const client = await createTestClient(mgmtClient, serviceId);
    clientId = String(client.clientId);
    clientSecret = client.clientSecret!;
  });

  afterAll(async () => {
    if (clientId) await mgmtClient.client.delete({ serviceId, clientId });
    await mgmtClient.service.update({
      serviceId,
      service: { parRequired: false, accessTokenDuration: TOKEN_DURATION_SECONDS },
    });
  });

  it('test_direct_auth_request_rejected', async () => {
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

  it('test_par_flow_succeeds_when_required', async () => {
    const encodedRedirect = encodeURIComponent(REDIRECT_URI);

    // PAR request
    const parResp = await sdkClient.pushedAuthorization.create({
      serviceId,
      pushedAuthorizationRequest: {
        parameters:
          `response_type=code&client_id=${clientId}` +
          `&redirect_uri=${encodedRedirect}&state=${STATE}`,
        clientId,
        clientSecret,
      },
    });

    expect(parResp.action).toBe('CREATED');
    expect(parResp.requestUri).toBeTruthy();

    // Auth request with request_uri
    const authResp = await sdkClient.authorization.processRequest({
      serviceId,
      authorizationRequest: {
        parameters:
          `client_id=${clientId}` +
          `&request_uri=${encodeURIComponent(parResp.requestUri!)}`,
      },
    });

    expect(authResp.action).toBe('INTERACTION');

    const issueResp = await sdkClient.authorization.issue({
      serviceId,
      authorizationIssueRequest: { ticket: authResp.ticket!, subject: SUBJECT },
    });

    expect(issueResp.action).toBe('LOCATION');

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
    await assertTokenValid(sdkClient, serviceId, tokenResp.accessToken!);
  });
});
