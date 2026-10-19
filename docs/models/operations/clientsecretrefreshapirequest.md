# ClientSecretRefreshApiRequest

## Example Usage

```typescript
import { ClientSecretRefreshApiRequest } from "@authlete/typescript-sdk/models/operations";

let value: ClientSecretRefreshApiRequest = {
  clientIdentifier: "<value>",
};
```

## Fields

| Field                                              | Type                                               | Required                                           | Description                                        |
| -------------------------------------------------- | -------------------------------------------------- | -------------------------------------------------- | -------------------------------------------------- |
| `serviceId`                                        | *string*                                           | :heavy_minus_sign:                                 | A service ID.                                      |
| `clientIdentifier`                                 | *string*                                           | :heavy_check_mark:                                 | The client ID or the client ID alias of a client.<br/> |