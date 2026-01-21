# PushedAuthorizationResponseClientAuthMethod

The client authentication method that the client application declares that it uses at the token
endpoint. This property corresponds to `token_endpoint_auth_method` in [OpenID Connect Dynamic
Client Registration 1.0, 2. Client Metadata](https://openid.net/specs/openid-connect-registration-1_0.html#ClientMetadata).


## Example Usage

```typescript
import { PushedAuthorizationResponseClientAuthMethod } from "@authlete/typescript-sdk/models";

let value: PushedAuthorizationResponseClientAuthMethod =
  "ATTEST_JWT_CLIENT_AUTH";
```

## Values

```typescript
"NONE" | "CLIENT_SECRET_BASIC" | "CLIENT_SECRET_POST" | "CLIENT_SECRET_JWT" | "PRIVATE_KEY_JWT" | "TLS_CLIENT_AUTH" | "SELF_SIGNED_TLS_CLIENT_AUTH" | "ATTEST_JWT_CLIENT_AUTH"
```