# AuthTokenApiRequest

## Example Usage

```typescript
import { AuthTokenApiRequest } from "@authlete/typescript-sdk/models/operations";

let value: AuthTokenApiRequest = {
  tokenRequest: {
    parameters: "<value>",
  },
};
```

## Fields

| Field                                               | Type                                                | Required                                            | Description                                         |
| --------------------------------------------------- | --------------------------------------------------- | --------------------------------------------------- | --------------------------------------------------- |
| `serviceId`                                         | *string*                                            | :heavy_minus_sign:                                  | A service ID.                                       |
| `tokenRequest`                                      | [models.TokenRequest](../../models/tokenrequest.md) | :heavy_check_mark:                                  | N/A                                                 |