# VciBatchParseApiResponse

## Example Usage

```typescript
import { VciBatchParseApiResponse } from "@authlete/typescript-sdk/models/operations";

let value: VciBatchParseApiResponse = {
  headers: {
    "key": [
      "<value 1>",
    ],
    "key1": [],
  },
  result: {},
};
```

## Fields

| Field                                                                 | Type                                                                  | Required                                                              | Description                                                           |
| --------------------------------------------------------------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------- |
| `headers`                                                             | Record<string, *string*[]>                                            | :heavy_check_mark:                                                    | N/A                                                                   |
| `result`                                                              | [models.VciBatchParseResponse](../../models/vcibatchparseresponse.md) | :heavy_check_mark:                                                    | N/A                                                                   |