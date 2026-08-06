# AuthTokenApiResponse

## Example Usage

```typescript
import { AuthTokenApiResponse } from "@authlete/typescript-sdk/models/operations";

let value: AuthTokenApiResponse = {
  headers: {
    "key": [
      "<value 1>",
      "<value 2>",
      "<value 3>",
    ],
  },
  result: {},
};
```

## Fields

| Field                                                 | Type                                                  | Required                                              | Description                                           |
| ----------------------------------------------------- | ----------------------------------------------------- | ----------------------------------------------------- | ----------------------------------------------------- |
| `headers`                                             | Record<string, *string*[]>                            | :heavy_check_mark:                                    | N/A                                                   |
| `result`                                              | [models.TokenResponse](../../models/tokenresponse.md) | :heavy_check_mark:                                    | N/A                                                   |