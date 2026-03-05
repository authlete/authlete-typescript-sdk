# AuthTokenCreateApiRequest

## Example Usage

```typescript
import { AuthTokenCreateApiRequest } from "@authlete/typescript-sdk/models/operations";

let value: AuthTokenCreateApiRequest = {
  serviceId: "<id>",
  tokenCreateRequest: {
    grantType: "DEVICE_CODE",
  },
};
```

## Fields

| Field                                                           | Type                                                            | Required                                                        | Description                                                     |
| --------------------------------------------------------------- | --------------------------------------------------------------- | --------------------------------------------------------------- | --------------------------------------------------------------- |
| `serviceId`                                                     | *string*                                                        | :heavy_check_mark:                                              | A service ID.                                                   |
| `tokenCreateRequest`                                            | [models.TokenCreateRequest](../../models/tokencreaterequest.md) | :heavy_check_mark:                                              | N/A                                                             |