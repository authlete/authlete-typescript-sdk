# BackchannelLogoutTokenApiRequest

## Example Usage

```typescript
import { BackchannelLogoutTokenApiRequest } from "@authlete/typescript-sdk/models/operations";

let value: BackchannelLogoutTokenApiRequest = {
  serviceId: "<id>",
  backchannelLogoutTokenRequest: {
    clientIdentifier: "<value>",
  },
};
```

## Fields

| Field                                                                                 | Type                                                                                  | Required                                                                              | Description                                                                           |
| ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `serviceId`                                                                           | *string*                                                                              | :heavy_check_mark:                                                                    | A service ID.                                                                         |
| `backchannelLogoutTokenRequest`                                                       | [models.BackchannelLogoutTokenRequest](../../models/backchannellogouttokenrequest.md) | :heavy_check_mark:                                                                    | N/A                                                                                   |