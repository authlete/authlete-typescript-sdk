# JwsAlg

The signature algorithm for JWT. This value is represented on 'alg' attribute of the header of JWT.

it's semantics depends upon where is this defined, for instance:
  - as service accessTokenSignAlg value, it defines that access token are JWT and the algorithm used to sign it. Check your [KB article](https://kb.authlete.com/en/s/oauth-and-openid-connect/a/jwt-based-access-token).
  - as client authorizationSignAlg value, it represents the signature algorithm used when [creating a JARM response](https://kb.authlete.com/en/s/oauth-and-openid-connect/a/enabling-jarm).
  - or as client requestSignAlg value, it specifies which is the expected signature used by [client on a Request Object](https://kb.authlete.com/en/s/oauth-and-openid-connect/a/request-objects).


## Example Usage

```typescript
import { JwsAlg } from "@authlete/typescript-sdk/models";

let value: JwsAlg = "PS384";
```

## Values

```typescript
"NONE" | "HS256" | "HS384" | "HS512" | "RS256" | "RS384" | "RS512" | "ES256" | "ES384" | "ES512" | "PS256" | "PS384" | "PS512" | "ES256K" | "EdDSA"
```