# VciJwtissuerResponseAction

The next action that the implementation of the JWT issuer metadata endpoint (`/.well-known/jwt-issuer`) should take after getting a response from Authlete's `/vci/jwtissuer` API.


## Example Usage

```typescript
import { VciJwtissuerResponseAction } from "@authlete/typescript-sdk/models";

let value: VciJwtissuerResponseAction = "NOT_FOUND";
```

## Values

```typescript
"OK" | "NOT_FOUND" | "INTERNAL_SERVER_ERROR"
```