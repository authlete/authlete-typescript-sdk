# BackchannelLogoutTokenResponse

## Example Usage

```typescript
import { BackchannelLogoutTokenResponse } from "@authlete/typescript-sdk/models";

let value: BackchannelLogoutTokenResponse = {};
```

## Fields

| Field                                                                                                                 | Type                                                                                                                  | Required                                                                                                              | Description                                                                                                           |
| --------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `resultCode`                                                                                                          | *string*                                                                                                              | :heavy_minus_sign:                                                                                                    | The code which represents the result of the API call.                                                                 |
| `resultMessage`                                                                                                       | *string*                                                                                                              | :heavy_minus_sign:                                                                                                    | A short message which explains the result of the API call.                                                            |
| `action`                                                                                                              | [models.BackchannelLogoutTokenResponseAction](../models/backchannellogouttokenresponseaction.md)                      | :heavy_minus_sign:                                                                                                    | The next action that the API caller should take.<br/>                                                                 |
| `logoutToken`                                                                                                         | *string*                                                                                                              | :heavy_minus_sign:                                                                                                    | The logout token issued for the client. The caller should deliver this<br/>token to the client's `backchannelLogoutUri`.<br/> |
| `backchannelLogoutUri`                                                                                                | *string*                                                                                                              | :heavy_minus_sign:                                                                                                    | The backchannel logout URI of the client. The caller should POST the<br/>`logoutToken` to this URI.<br/>              |