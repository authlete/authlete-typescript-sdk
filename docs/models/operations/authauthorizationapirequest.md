# AuthAuthorizationApiRequest

## Example Usage

```typescript
import { AuthAuthorizationApiRequest } from "@authlete/typescript-sdk/models/operations";

let value: AuthAuthorizationApiRequest = {
  authorizationRequest: {
    parameters: "<value>",
  },
};
```

## Fields

| Field                                                               | Type                                                                | Required                                                            | Description                                                         |
| ------------------------------------------------------------------- | ------------------------------------------------------------------- | ------------------------------------------------------------------- | ------------------------------------------------------------------- |
| `serviceId`                                                         | *string*                                                            | :heavy_minus_sign:                                                  | A service ID.                                                       |
| `authorizationRequest`                                              | [models.AuthorizationRequest](../../models/authorizationrequest.md) | :heavy_check_mark:                                                  | N/A                                                                 |