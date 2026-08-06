# ClientFlagUpdateApiResponse

## Example Usage

```typescript
import { ClientFlagUpdateApiResponse } from "@authlete/typescript-sdk/models/operations";

let value: ClientFlagUpdateApiResponse = {
  headers: {
    "key": [],
    "key1": [
      "<value 1>",
      "<value 2>",
    ],
    "key2": [
      "<value 1>",
      "<value 2>",
    ],
  },
  result: {
    resultCode: "<value>",
    resultMessage: "<value>",
  },
};
```

## Fields

| Field                                                                       | Type                                                                        | Required                                                                    | Description                                                                 |
| --------------------------------------------------------------------------- | --------------------------------------------------------------------------- | --------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| `headers`                                                                   | Record<string, *string*[]>                                                  | :heavy_check_mark:                                                          | N/A                                                                         |
| `result`                                                                    | [models.ClientFlagUpdateResponse](../../models/clientflagupdateresponse.md) | :heavy_check_mark:                                                          | N/A                                                                         |