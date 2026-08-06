# HskGetApiResponse

## Example Usage

```typescript
import { HskGetApiResponse } from "@authlete/typescript-sdk/models/operations";

let value: HskGetApiResponse = {
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

| Field                                                   | Type                                                    | Required                                                | Description                                             |
| ------------------------------------------------------- | ------------------------------------------------------- | ------------------------------------------------------- | ------------------------------------------------------- |
| `headers`                                               | Record<string, *string*[]>                              | :heavy_check_mark:                                      | N/A                                                     |
| `result`                                                | [models.HskGetResponse](../../models/hskgetresponse.md) | :heavy_check_mark:                                      | N/A                                                     |