# AuthTokenRevokeApiRequest

## Example Usage

```typescript
import { AuthTokenRevokeApiRequest } from "@authlete/typescript-sdk/models/operations";

let value: AuthTokenRevokeApiRequest = {
  tokenRevokeRequest: {},
};
```

## Fields

| Field                                                           | Type                                                            | Required                                                        | Description                                                     |
| --------------------------------------------------------------- | --------------------------------------------------------------- | --------------------------------------------------------------- | --------------------------------------------------------------- |
| `serviceId`                                                     | *string*                                                        | :heavy_minus_sign:                                              | A service ID.                                                   |
| `tokenRevokeRequest`                                            | [models.TokenRevokeRequest](../../models/tokenrevokerequest.md) | :heavy_check_mark:                                              | N/A                                                             |