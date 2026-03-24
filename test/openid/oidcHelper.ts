import { randomUUID } from 'node:crypto';
import { expect } from 'vitest';
import { generateKeyPair, exportJWK } from 'jose';
import { Authlete } from '@authlete/typescript-sdk';
import { TOKEN_DURATION_SECONDS } from '../testHelper.js';

export interface RsaJwksInfo {
  jwks: string;
  kid: string;
}

export async function generateRsaJwks(): Promise<RsaJwksInfo> {
  const { privateKey } = await generateKeyPair('RS256', { extractable: true });
  const jwk = await exportJWK(privateKey);
  const kid = randomUUID();
  jwk.kid = kid;
  jwk.use = 'sig';
  jwk.alg = 'RS256';

  return {
    jwks: JSON.stringify({ keys: [jwk] }),
    kid,
  };
}

export async function setupOidcService(
  sdk: Authlete,
  serviceId: string,
  tokenEndpoint?: string,
): Promise<RsaJwksInfo> {
  const jwksInfo = await generateRsaJwks();

  await sdk.service.update({
    serviceId,
    service: {
      issuer: 'https://as.example.com',
      jwks: jwksInfo.jwks,
      idTokenSignatureKeyId: jwksInfo.kid,
      tokenEndpoint: tokenEndpoint,
      accessTokenDuration: TOKEN_DURATION_SECONDS,
      supportedScopes: [{ name: 'openid', defaultEntry: false }],
    },
  });

  return jwksInfo;
}

export function decodeJwtPayload(jwt: string): Record<string, unknown> {
  const segment = jwt.split('.')[1]!;
  const json = Buffer.from(segment, 'base64url').toString('utf-8');
  return JSON.parse(json);
}

export function assertOidcClaims(
  claims: Record<string, unknown>,
  expectedSub: string,
  expectedNonce: string,
  expectedClientId: string,
): void {
  expect(claims.sub).toBe(expectedSub);
  expect(claims.nonce).toBe(expectedNonce);
  expect(claims.iss).toBeTruthy();

  const aud = Array.isArray(claims.aud) ? claims.aud : [claims.aud];
  expect(aud.some((a: unknown) => String(a) === expectedClientId)).toBe(true);
}
