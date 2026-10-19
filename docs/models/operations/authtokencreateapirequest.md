# AuthTokenCreateApiRequest

## Example Usage

```typescript
import { AuthTokenCreateApiRequest } from "@authlete/typescript-sdk/models/operations";

let value: AuthTokenCreateApiRequest = {
  tokenCreateRequest: {
    grantType: "DEVICE_CODE",
  },
};
```

## Fields

| Field                                                           | Type                                                            | Required                                                        | Description                                                     |
| --------------------------------------------------------------- | --------------------------------------------------------------- | --------------------------------------------------------------- | --------------------------------------------------------------- |
| `serviceId`                                                     | *string*                                                        | :heavy_minus_sign:                                              | A service ID.                                                   |
| `tokenCreateRequest`                                            | [models.TokenCreateRequest](../../models/tokencreaterequest.md) | :heavy_check_mark:                                              | N/A                                                             |