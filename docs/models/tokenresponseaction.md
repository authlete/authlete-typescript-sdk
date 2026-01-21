# TokenResponseAction

The next action that the authorization server implementation should take.

## Example Usage

```typescript
import { TokenResponseAction } from "@authlete/typescript-sdk/models";

let value: TokenResponseAction = "TOKEN_EXCHANGE";
```

## Values

```typescript
"INTERNAL_SERVER_ERROR" | "INVALID_CLIENT" | "BAD_REQUEST" | "PASSWORD" | "OK" | "TOKEN_EXCHANGE" | "JWT_BEARER" | "NATIVE_SSO" | "ID_TOKEN_REISSUABLE"
```