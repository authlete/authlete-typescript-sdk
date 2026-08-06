# HskCreateApiResponse

## Example Usage

```typescript
import { HskCreateApiResponse } from "@authlete/typescript-sdk/models/operations";

let value: HskCreateApiResponse = {
  headers: {
    "key": [],
    "key1": [
      "<value 1>",
      "<value 2>",
    ],
    "key2": [
      "<value 1>",
    ],
  },
  result: {},
};
```

## Fields

| Field                                                         | Type                                                          | Required                                                      | Description                                                   |
| ------------------------------------------------------------- | ------------------------------------------------------------- | ------------------------------------------------------------- | ------------------------------------------------------------- |
| `headers`                                                     | Record<string, *string*[]>                                    | :heavy_check_mark:                                            | N/A                                                           |
| `result`                                                      | [models.HskCreateResponse](../../models/hskcreateresponse.md) | :heavy_check_mark:                                            | N/A                                                           |