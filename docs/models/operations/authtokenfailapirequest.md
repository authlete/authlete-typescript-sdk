# AuthTokenFailApiRequest

## Example Usage

```typescript
import { AuthTokenFailApiRequest } from "@authlete/typescript-sdk/models/operations";

let value: AuthTokenFailApiRequest = {
  tokenFailRequest: {
    ticket: "<value>",
    reason: "INVALID_TARGET",
  },
};
```

## Fields

| Field                                                       | Type                                                        | Required                                                    | Description                                                 |
| ----------------------------------------------------------- | ----------------------------------------------------------- | ----------------------------------------------------------- | ----------------------------------------------------------- |
| `serviceId`                                                 | *string*                                                    | :heavy_minus_sign:                                          | A service ID.                                               |
| `tokenFailRequest`                                          | [models.TokenFailRequest](../../models/tokenfailrequest.md) | :heavy_check_mark:                                          | N/A                                                         |