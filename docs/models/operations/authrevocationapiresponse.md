# AuthRevocationApiResponse

## Example Usage

```typescript
import { AuthRevocationApiResponse } from "@authlete/typescript-sdk/models/operations";

let value: AuthRevocationApiResponse = {
  headers: {
    "key": [
      "<value 1>",
    ],
    "key1": [
      "<value 1>",
      "<value 2>",
      "<value 3>",
    ],
    "key2": [
      "<value 1>",
    ],
  },
  result: {},
};
```

## Fields

| Field                                                           | Type                                                            | Required                                                        | Description                                                     |
| --------------------------------------------------------------- | --------------------------------------------------------------- | --------------------------------------------------------------- | --------------------------------------------------------------- |
| `headers`                                                       | Record<string, *string*[]>                                      | :heavy_check_mark:                                              | N/A                                                             |
| `result`                                                        | [models.RevocationResponse](../../models/revocationresponse.md) | :heavy_check_mark:                                              | N/A                                                             |