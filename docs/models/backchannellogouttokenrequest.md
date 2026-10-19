# BackchannelLogoutTokenRequest

## Example Usage

```typescript
import { BackchannelLogoutTokenRequest } from "@authlete/typescript-sdk/models";

let value: BackchannelLogoutTokenRequest = {
  clientIdentifier: "<value>",
};
```

## Fields

| Field                                                                                                                                            | Type                                                                                                                                             | Required                                                                                                                                         | Description                                                                                                                                      |
| ------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `clientIdentifier`                                                                                                                               | *string*                                                                                                                                         | :heavy_check_mark:                                                                                                                               | The identifier of the client application. Either a client ID or a client alias.<br/>                                                             |
| `subject`                                                                                                                                        | *string*                                                                                                                                         | :heavy_minus_sign:                                                                                                                               | The subject (end-user) identifier. The logout token will be issued for this subject. At least one of `subject` or `sessionId` must be provided.<br/> |
| `sessionId`                                                                                                                                      | *string*                                                                                                                                         | :heavy_minus_sign:                                                                                                                               | The session ID (`sid`) identifying the user session to log out. At least one of `subject` or `sessionId` must be provided.<br/>                  |