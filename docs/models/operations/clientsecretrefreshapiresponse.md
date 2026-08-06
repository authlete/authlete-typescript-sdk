# ClientSecretRefreshApiResponse

## Example Usage

```typescript
import { ClientSecretRefreshApiResponse } from "@authlete/typescript-sdk/models/operations";

let value: ClientSecretRefreshApiResponse = {
  headers: {
    "key": [
      "<value 1>",
      "<value 2>",
      "<value 3>",
    ],
    "key1": [
      "<value 1>",
      "<value 2>",
      "<value 3>",
    ],
  },
  result: {},
};
```

## Fields

| Field                                                                             | Type                                                                              | Required                                                                          | Description                                                                       |
| --------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| `headers`                                                                         | Record<string, *string*[]>                                                        | :heavy_check_mark:                                                                | N/A                                                                               |
| `result`                                                                          | [models.ClientSecretRefreshResponse](../../models/clientsecretrefreshresponse.md) | :heavy_check_mark:                                                                | N/A                                                                               |