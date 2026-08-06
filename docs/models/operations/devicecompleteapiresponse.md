# DeviceCompleteApiResponse

## Example Usage

```typescript
import { DeviceCompleteApiResponse } from "@authlete/typescript-sdk/models/operations";

let value: DeviceCompleteApiResponse = {
  headers: {
    "key": [
      "<value 1>",
      "<value 2>",
      "<value 3>",
    ],
    "key1": [
      "<value 1>",
      "<value 2>",
    ],
  },
  result: {},
};
```

## Fields

| Field                                                                   | Type                                                                    | Required                                                                | Description                                                             |
| ----------------------------------------------------------------------- | ----------------------------------------------------------------------- | ----------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| `headers`                                                               | Record<string, *string*[]>                                              | :heavy_check_mark:                                                      | N/A                                                                     |
| `result`                                                                | [models.DeviceCompleteResponse](../../models/devicecompleteresponse.md) | :heavy_check_mark:                                                      | N/A                                                                     |