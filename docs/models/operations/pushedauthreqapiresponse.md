# PushedAuthReqApiResponse

## Example Usage

```typescript
import { PushedAuthReqApiResponse } from "@authlete/typescript-sdk/models/operations";

let value: PushedAuthReqApiResponse = {
  headers: {
    "key": [
      "<value 1>",
    ],
    "key1": [
      "<value 1>",
    ],
    "key2": [],
  },
  result: {},
};
```

## Fields

| Field                                                                             | Type                                                                              | Required                                                                          | Description                                                                       |
| --------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| `headers`                                                                         | Record<string, *string*[]>                                                        | :heavy_check_mark:                                                                | N/A                                                                               |
| `result`                                                                          | [models.PushedAuthorizationResponse](../../models/pushedauthorizationresponse.md) | :heavy_check_mark:                                                                | N/A                                                                               |