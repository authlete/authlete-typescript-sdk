# ClientAuthorizationGetListApiPostRequest

## Example Usage

```typescript
import { ClientAuthorizationGetListApiPostRequest } from "@authlete/typescript-sdk/models/operations";

let value: ClientAuthorizationGetListApiPostRequest = {
  serviceId: "<id>",
  clientAuthorizationGetListRequest: {
    subject: "<value>",
  },
};
```

## Fields

| Field                                                                                         | Type                                                                                          | Required                                                                                      | Description                                                                                   |
| --------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `serviceId`                                                                                   | *string*                                                                                      | :heavy_check_mark:                                                                            | A service ID.                                                                                 |
| `clientAuthorizationGetListRequest`                                                           | [models.ClientAuthorizationGetListRequest](../../models/clientauthorizationgetlistrequest.md) | :heavy_check_mark:                                                                            | N/A                                                                                           |