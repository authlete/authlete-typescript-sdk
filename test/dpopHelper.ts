import { createHash, randomUUID } from 'node:crypto';
import { generateKeyPair, exportJWK, SignJWT } from 'jose';
import type { KeyLike, JWK } from 'jose';

export const TOKEN_ENDPOINT = 'https://as.example.com/token';
export const RESOURCE_URL = 'https://rs.example.com/api/resource';
export const USERINFO_URL = 'https://as.example.com/userinfo';

export interface EcKeyPair {
  privateKey: KeyLike;
  publicKey: KeyLike;
  publicJwk: JWK;
}

export async function generateEcKey(): Promise<EcKeyPair> {
  const { privateKey, publicKey } = await generateKeyPair('ES256');
  const publicJwk = await exportJWK(publicKey);
  return { privateKey, publicKey, publicJwk };
}

export async function dpopProof(
  keyPair: EcKeyPair,
  htm: string,
  htu: string,
  accessToken?: string,
  nonce?: string,
): Promise<string> {
  const payload: Record<string, unknown> = {
    jti: randomUUID(),
    htm,
    htu,
    iat: Math.floor(Date.now() / 1000),
  };

  if (accessToken) {
    const ath = createHash('sha256').update(accessToken).digest('base64url');
    payload.ath = ath;
  }

  if (nonce) {
    payload.nonce = nonce;
  }

  return new SignJWT(payload)
    .setProtectedHeader({ typ: 'dpop+jwt', alg: 'ES256', jwk: keyPair.publicJwk })
    .sign(keyPair.privateKey);
}
