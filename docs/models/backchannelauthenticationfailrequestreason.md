# BackchannelAuthenticationFailRequestReason

The reason of the failure of the backchannel authentication request. This request parameter is not mandatory but optional. However, giving this parameter is recommended. If omitted, `SERVER_ERROR` is used as a reason.


## Example Usage

```typescript
import { BackchannelAuthenticationFailRequestReason } from "@authlete/typescript-sdk/models";

let value: BackchannelAuthenticationFailRequestReason =
  "INVALID_BINDING_MESSAGE";
```

## Values

```typescript
"ACCESS_DENIED" | "EXPIRED_LOGIN_HINT_TOKEN" | "INVALID_BINDING_MESSAGE" | "INVALID_TARGET" | "INVALID_USER_CODE" | "MISSING_USER_CODE" | "SERVER_ERROR" | "UNAUTHORIZED_CLIENT" | "UNKNOWN_USER_ID"
```