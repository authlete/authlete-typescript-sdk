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
  TOKEN_DURATION_SECONDS,
} from './testHelper.js';
import {
  generateEcKey,
  dpopProof,
  TOKEN_ENDPOINT,
  RESOURCE_URL,
} from './dpopHelper.js';

// =============================================================================
// Standard service — DPoP is optional
// =============================================================================
describe('DpopFlowTest', () => {
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
        tokenEndpoint: TOKEN_ENDPOINT,
        accessTokenDuration: TOKEN_DURATION_SECONDS,
      },
    });

    const client = await createTestClient(mgmtClient, serviceId);
    clientId = String(client.clientId);
    clientSecret = client.clientSecret!;
  });

  afterAll(async () => {
    if (clientId) await mgmtClient.client.delete({ serviceId, clientId });
  });

  it('test_dpop_basic_flow', async () => {
    const keyPair = await generateEcKey();
    const encodedRedirect = encodeURIComponent(REDIRECT_URI);

    // Step 1: Authorization request (no DPoP needed at auth endpoint)
    const authResp = await sdkClient.authorization.processRequest({
      serviceId,
      authorizationRequest: {
        parameters:
          `response_type=code&client_id=${clientId}` +
          `&redirect_uri=${encodedRedirect}&state=${STATE}`,
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
  });

  it('test_dpop_introspection_valid', async () => {
    const keyPair = await generateEcKey();
    const encodedRedirect = encodeURIComponent(REDIRECT_URI);

    // Obtain DPoP-bound access token
    const authResp = await sdkClient.authorization.processRequest({
      serviceId,
      authorizationRequest: {
        parameters:
          `response_type=code&client_id=${clientId}` +
          `&redirect_uri=${encodedRedirect}&state=${STATE}`,
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
        dpop: await dpopProof(keyPair, 'POST', TOKEN_ENDPOINT),
        htm: 'POST',
        htu: TOKEN_ENDPOINT,
      },
    });

    expect(tokenResp.action).toBe('OK');
    const accessToken = tokenResp.accessToken!;

    // Introspect with valid DPoP proof (htm=GET, ath included)
    const introResp = await sdkClient.introspection.process({
      serviceId,
      introspectionRequest: {
        token: accessToken,
        dpop: await dpopProof(keyPair, 'GET', RESOURCE_URL, accessToken),
        htm: 'GET',
        htu: RESOURCE_URL,
      },
    });

    expect(introResp.action).toBe('OK');
  });

  it('test_dpop_introspection_without_proof_rejected', async () => {
    const keyPair = await generateEcKey();
    const encodedRedirect = encodeURIComponent(REDIRECT_URI);

    // Obtain DPoP-bound access token
    const authResp = await sdkClient.authorization.processRequest({
      serviceId,
      authorizationRequest: {
        parameters:
          `response_type=code&client_id=${clientId}` +
          `&redirect_uri=${encodedRedirect}&state=${STATE}`,
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
        dpop: await dpopProof(keyPair, 'POST', TOKEN_ENDPOINT),
        htm: 'POST',
        htu: TOKEN_ENDPOINT,
      },
    });

    expect(tokenResp.action).toBe('OK');
    const accessToken = tokenResp.accessToken!;

    // Introspect without any DPoP proof — must not return OK
    const introResp = await sdkClient.introspection.process({
      serviceId,
      introspectionRequest: { token: accessToken },
    });

    expect(introResp.action).not.toBe('OK');
  });
});

// =============================================================================
// Client with dpopRequired: true
// =============================================================================
describe('DpopRequiredTest', () => {
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
        tokenEndpoint: TOKEN_ENDPOINT,
        accessTokenDuration: TOKEN_DURATION_SECONDS,
      },
    });

    // Create a client with dpopRequired: true
    const client = await mgmtClient.client.create({
      serviceId,
      client: {
        clientName: `ts-sdk-test-dpop-required-${Date.now()}`,
        clientType: 'CONFIDENTIAL',
        grantTypes: ['AUTHORIZATION_CODE'],
        responseTypes: ['CODE'],
        redirectUris: [REDIRECT_URI],
        dpopRequired: true,
      },
    });

    clientId = String(client.clientId);
    clientSecret = client.clientSecret!;
  });

  afterAll(async () => {
    if (clientId) await mgmtClient.client.delete({ serviceId, clientId });
  });

  it('test_token_without_dpop_rejected', async () => {
    const encodedRedirect = encodeURIComponent(REDIRECT_URI);

    const authResp = await sdkClient.authorization.processRequest({
      serviceId,
      authorizationRequest: {
        parameters:
          `response_type=code&client_id=${clientId}` +
          `&redirect_uri=${encodedRedirect}&state=${STATE}`,
      },
    });
    expect(authResp.action).toBe('INTERACTION');

    const issueResp = await sdkClient.authorization.issue({
      serviceId,
      authorizationIssueRequest: { ticket: authResp.ticket!, subject: SUBJECT },
    });
    expect(issueResp.action).toBe('LOCATION');

    // Token request WITHOUT DPoP proof — must be rejected
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

    expect(tokenResp.action).not.toBe('OK');
  });

  it('test_dpop_flow_succeeds_when_required', async () => {
    const keyPair = await generateEcKey();
    const encodedRedirect = encodeURIComponent(REDIRECT_URI);

    const authResp = await sdkClient.authorization.processRequest({
      serviceId,
      authorizationRequest: {
        parameters:
          `response_type=code&client_id=${clientId}` +
          `&redirect_uri=${encodedRedirect}&state=${STATE}`,
      },
    });
    expect(authResp.action).toBe('INTERACTION');

    const issueResp = await sdkClient.authorization.issue({
      serviceId,
      authorizationIssueRequest: { ticket: authResp.ticket!, subject: SUBJECT },
    });
    expect(issueResp.action).toBe('LOCATION');

    // Token request WITH DPoP proof — must succeed
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
  });
});
