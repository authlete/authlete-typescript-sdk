# AuthTokenFailApiResponse

## Example Usage

```typescript
import { AuthTokenFailApiResponse } from "@authlete/typescript-sdk/models/operations";

let value: AuthTokenFailApiResponse = {
  headers: {
    "key": [
      "<value 1>",
      "<value 2>",
    ],
    "key1": [],
    "key2": [
      "<value 1>",
      "<value 2>",
    ],
  },
  result: {},
};
```

## Fields

| Field                                                         | Type                                                          | Required                                                      | Description                                                   |
| ------------------------------------------------------------- | ------------------------------------------------------------- | ------------------------------------------------------------- | ------------------------------------------------------------- |
| `headers`                                                     | Record<string, *string*[]>                                    | :heavy_check_mark:                                            | N/A                                                           |
| `result`                                                      | [models.TokenFailResponse](../../models/tokenfailresponse.md) | :heavy_check_mark:                                            | N/A                                                           |