# AuthTokenGetListApiResponse

## Example Usage

```typescript
import { AuthTokenGetListApiResponse } from "@authlete/typescript-sdk/models/operations";

let value: AuthTokenGetListApiResponse = {
  headers: {
    "key": [
      "<value 1>",
      "<value 2>",
      "<value 3>",
    ],
    "key1": [
      "<value 1>",
    ],
  },
  result: {},
};
```

## Fields

| Field                                                               | Type                                                                | Required                                                            | Description                                                         |
| ------------------------------------------------------------------- | ------------------------------------------------------------------- | ------------------------------------------------------------------- | ------------------------------------------------------------------- |
| `headers`                                                           | Record<string, *string*[]>                                          | :heavy_check_mark:                                                  | N/A                                                                 |
| `result`                                                            | [models.TokenGetListResponse](../../models/tokengetlistresponse.md) | :heavy_check_mark:                                                  | N/A                                                                 |