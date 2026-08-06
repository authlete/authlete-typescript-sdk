import { expect } from 'vitest';
import { Authlete } from '@authlete/typescript-sdk';

// ---------------------------------------------------------------------------
// Environment configuration
// ---------------------------------------------------------------------------
export const API_BASE_URL = requireEnv('API_BASE_URL');
export const SERVICE_ID = requireEnv('SERVICE_ID');
export const SERVICE_TOKEN = requireEnv('SERVICE_TOKEN');

// Management token — used for service.update, client.create, client.delete.
// Falls back to SERVICE_TOKEN if ORG_TOKEN is not set.
export const MGMT_TOKEN = process.env['ORG_TOKEN'] ?? SERVICE_TOKEN;

// ---------------------------------------------------------------------------
// OAuth flow constants
// ---------------------------------------------------------------------------
export const REDIRECT_URI = 'https://client.example.com/callback';
export const STATE = 'testState';
export const SUBJECT = 'testuser';
export const TOKEN_DURATION_SECONDS = 600; // 10 minutes

// ---------------------------------------------------------------------------
// SDK client factory
// ---------------------------------------------------------------------------
export function createSdkClient(token: string): Authlete {
  return new Authlete({
    bearer: token,
    serverURL: API_BASE_URL,
  });
}

// ---------------------------------------------------------------------------
// Introspect an access token and assert it is valid (action === 'OK').
// ---------------------------------------------------------------------------
export async function assertTokenValid(
  sdk: Authlete,
  serviceId: string,
  accessToken: string,
): Promise<void> {
  const introResp = await sdk.introspection.process({
    serviceId,
    introspectionRequest: { token: accessToken },
  });
  expect(introResp.action).toBe('OK');
}

// ---------------------------------------------------------------------------
// Create a confidential OAuth client on the given service via the SDK.
// ---------------------------------------------------------------------------
export async function createTestClient(sdk: Authlete, serviceId: string) {
  const client = await sdk.client.create({
    serviceId,
    client: {
      clientName: `ts-sdk-test-client-${Date.now()}`,
      clientType: 'CONFIDENTIAL',
      grantTypes: ['AUTHORIZATION_CODE', 'REFRESH_TOKEN'],
      responseTypes: ['CODE'],
      redirectUris: [REDIRECT_URI],
    },
  });
  return client;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Required environment variable ${name} is not set`);
  }
  return value;
}
