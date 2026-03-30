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

const VISIBLE_PROP = { key: 'tenant_id', value: 'acme-corp' };
const HIDDEN_PROP = { key: 'internal_user_tier', value: 'premium', hidden: true };

describe('ExtraPropertiesTest', () => {
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

  async function obtainTicket(): Promise<string> {
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
    return authResp.ticket!;
  }

  it('test_properties_at_authorization_issue', async () => {
    const encodedRedirect = encodeURIComponent(REDIRECT_URI);

    // Authorization issue — attach properties here
    const issueResp = await sdkClient.authorization.issue({
      serviceId,
      authorizationIssueRequest: {
        ticket: await obtainTicket(),
        subject: SUBJECT,
        properties: [VISIBLE_PROP, HIDDEN_PROP],
      },
    });
    expect(issueResp.action).toBe('LOCATION');

    // Token request — no properties here
    const tokenResp = await sdkClient.token.process({
      serviceId,
      tokenRequest: {
        parameters:
          `grant_type=authorization_code&code=${issueResp.authorizationCode}` +
          `&redirect_uri=${encodedRedirect}`,
        clientId,
        clientSecret,
      },
    });
    expect(tokenResp.action).toBe('OK');

    // SDK deserializes properties array with correct key/value/hidden fields
    const props = tokenResp.properties ?? [];
    const visible = props.find((p) => p.key === VISIBLE_PROP.key);
    const hidden = props.find((p) => p.key === HIDDEN_PROP.key);

    expect(visible).toBeTruthy();
    expect(hidden).toBeTruthy();
    expect(visible!.value).toBe(VISIBLE_PROP.value);
    expect(hidden!.value).toBe(HIDDEN_PROP.value);
    expect(hidden!.hidden).toBe(true);

    // Only visible property appears in responseContent
    const responseJson = JSON.parse(tokenResp.responseContent!);
    expect(responseJson[VISIBLE_PROP.key]).toBe(VISIBLE_PROP.value);
    expect(responseJson[HIDDEN_PROP.key]).toBeUndefined();

    // Both accessible via introspection
    const introResp = await sdkClient.introspection.process({
      serviceId,
      introspectionRequest: { token: tokenResp.accessToken! },
    });
    const introProps = introResp.properties ?? [];
    expect(introProps.some((p) => p.key === VISIBLE_PROP.key)).toBe(true);
    expect(introProps.some((p) => p.key === HIDDEN_PROP.key)).toBe(true);
  });

  it('test_properties_at_token_endpoint', async () => {
    const encodedRedirect = encodeURIComponent(REDIRECT_URI);

    // Authorization issue — no properties here
    const issueResp = await sdkClient.authorization.issue({
      serviceId,
      authorizationIssueRequest: {
        ticket: await obtainTicket(),
        subject: SUBJECT,
      },
    });
    expect(issueResp.action).toBe('LOCATION');

    // Token request — attach properties here
    // Known SDK bug: TokenRequest.properties is typed as string instead of
    // Array<Property>. Will be fixed after SDK regeneration from updated OpenAPI spec.
    const tokenResp = await sdkClient.token.process({
      serviceId,
      tokenRequest: {
        parameters:
          `grant_type=authorization_code&code=${issueResp.authorizationCode}` +
          `&redirect_uri=${encodedRedirect}`,
        clientId,
        clientSecret,
        properties: [VISIBLE_PROP] as any,
      },
    });
    expect(tokenResp.action).toBe('OK');

    const responseJson = JSON.parse(tokenResp.responseContent!);
    expect(responseJson[VISIBLE_PROP.key]).toBe(VISIBLE_PROP.value);
  });
});
