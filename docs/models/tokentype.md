# TokenType

The token type identifier used in OAuth 2.0 Token Exchange (RFC 8693). The API returns short codes (enum constant names) in response fields.


## Example Usage

```typescript
import { TokenType } from "@authlete/typescript-sdk/models";

let value: TokenType = "JWT_BEARER";
```

## Values

```typescript
"JWT" | "ACCESS_TOKEN" | "REFRESH_TOKEN" | "ID_TOKEN" | "SAML1" | "SAML2" | "DEVICE_SECRET" | "DEVICE_CODE" | "TOKEN_EXCHANGE" | "JWT_BEARER"
```