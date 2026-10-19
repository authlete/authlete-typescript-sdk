# BackchannelAuthenticationCompleteApiRequest

## Example Usage

```typescript
import { BackchannelAuthenticationCompleteApiRequest } from "@authlete/typescript-sdk/models/operations";

let value: BackchannelAuthenticationCompleteApiRequest = {
  backchannelAuthenticationCompleteRequest: {
    ticket: "<value>",
    result: "TRANSACTION_FAILED",
    subject: "<value>",
  },
};
```

## Fields

| Field                                                                                                       | Type                                                                                                        | Required                                                                                                    | Description                                                                                                 |
| ----------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `serviceId`                                                                                                 | *string*                                                                                                    | :heavy_minus_sign:                                                                                          | A service ID.                                                                                               |
| `backchannelAuthenticationCompleteRequest`                                                                  | [models.BackchannelAuthenticationCompleteRequest](../../models/backchannelauthenticationcompleterequest.md) | :heavy_check_mark:                                                                                          | N/A                                                                                                         |