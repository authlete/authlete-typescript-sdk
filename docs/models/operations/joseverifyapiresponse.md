# JoseVerifyApiResponse

## Example Usage

```typescript
import { JoseVerifyApiResponse } from "@authlete/typescript-sdk/models/operations";

let value: JoseVerifyApiResponse = {
  headers: {
    "key": [
      "<value 1>",
      "<value 2>",
    ],
    "key1": [],
  },
  result: {},
};
```

## Fields

| Field                                                           | Type                                                            | Required                                                        | Description                                                     |
| --------------------------------------------------------------- | --------------------------------------------------------------- | --------------------------------------------------------------- | --------------------------------------------------------------- |
| `headers`                                                       | Record<string, *string*[]>                                      | :heavy_check_mark:                                              | N/A                                                             |
| `result`                                                        | [models.JoseVerifyResponse](../../models/joseverifyresponse.md) | :heavy_check_mark:                                              | N/A                                                             |