# BackchannelAuthenticationFailApiRequest

## Example Usage

```typescript
import { BackchannelAuthenticationFailApiRequest } from "@authlete/typescript-sdk/models/operations";

let value: BackchannelAuthenticationFailApiRequest = {
  backchannelAuthenticationFailRequest: {
    ticket: "<value>",
    reason: "EXPIRED_LOGIN_HINT_TOKEN",
  },
};
```

## Fields

| Field                                                                                               | Type                                                                                                | Required                                                                                            | Description                                                                                         |
| --------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `serviceId`                                                                                         | *string*                                                                                            | :heavy_minus_sign:                                                                                  | A service ID.                                                                                       |
| `backchannelAuthenticationFailRequest`                                                              | [models.BackchannelAuthenticationFailRequest](../../models/backchannelauthenticationfailrequest.md) | :heavy_check_mark:                                                                                  | N/A                                                                                                 |