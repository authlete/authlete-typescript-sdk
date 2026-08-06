# AuthTokenIssueApiResponse

## Example Usage

```typescript
import { AuthTokenIssueApiResponse } from "@authlete/typescript-sdk/models/operations";

let value: AuthTokenIssueApiResponse = {
  headers: {
    "key": [
      "<value 1>",
      "<value 2>",
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

| Field                                                           | Type                                                            | Required                                                        | Description                                                     |
| --------------------------------------------------------------- | --------------------------------------------------------------- | --------------------------------------------------------------- | --------------------------------------------------------------- |
| `headers`                                                       | Record<string, *string*[]>                                      | :heavy_check_mark:                                              | N/A                                                             |
| `result`                                                        | [models.TokenIssueResponse](../../models/tokenissueresponse.md) | :heavy_check_mark:                                              | N/A                                                             |