# AuthTokenCreateApiResponse

## Example Usage

```typescript
import { AuthTokenCreateApiResponse } from "@authlete/typescript-sdk/models/operations";

let value: AuthTokenCreateApiResponse = {
  headers: {
    "key": [],
    "key1": [
      "<value 1>",
    ],
    "key2": [
      "<value 1>",
    ],
  },
  result: {},
};
```

## Fields

| Field                                                             | Type                                                              | Required                                                          | Description                                                       |
| ----------------------------------------------------------------- | ----------------------------------------------------------------- | ----------------------------------------------------------------- | ----------------------------------------------------------------- |
| `headers`                                                         | Record<string, *string*[]>                                        | :heavy_check_mark:                                                | N/A                                                               |
| `result`                                                          | [models.TokenCreateResponse](../../models/tokencreateresponse.md) | :heavy_check_mark:                                                | N/A                                                               |