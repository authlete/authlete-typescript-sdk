# AuthAuthorizationFailApiRequest

## Example Usage

```typescript
import { AuthAuthorizationFailApiRequest } from "@authlete/typescript-sdk/models/operations";

let value: AuthAuthorizationFailApiRequest = {
  authorizationFailRequest: {
    ticket: "<value>",
    reason: "INVALID_TARGET",
  },
};
```

## Fields

| Field                                                                       | Type                                                                        | Required                                                                    | Description                                                                 |
| --------------------------------------------------------------------------- | --------------------------------------------------------------------------- | --------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| `serviceId`                                                                 | *string*                                                                    | :heavy_minus_sign:                                                          | A service ID.                                                               |
| `authorizationFailRequest`                                                  | [models.AuthorizationFailRequest](../../models/authorizationfailrequest.md) | :heavy_check_mark:                                                          | N/A                                                                         |