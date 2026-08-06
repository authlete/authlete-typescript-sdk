# VciMetadataApiResponse

## Example Usage

```typescript
import { VciMetadataApiResponse } from "@authlete/typescript-sdk/models/operations";

let value: VciMetadataApiResponse = {
  headers: {
    "key": [],
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

| Field                                                             | Type                                                              | Required                                                          | Description                                                       |
| ----------------------------------------------------------------- | ----------------------------------------------------------------- | ----------------------------------------------------------------- | ----------------------------------------------------------------- |
| `headers`                                                         | Record<string, *string*[]>                                        | :heavy_check_mark:                                                | N/A                                                               |
| `result`                                                          | [models.VciMetadataResponse](../../models/vcimetadataresponse.md) | :heavy_check_mark:                                                | N/A                                                               |