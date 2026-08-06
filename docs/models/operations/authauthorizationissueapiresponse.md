# AuthAuthorizationIssueApiResponse

## Example Usage

```typescript
import { AuthAuthorizationIssueApiResponse } from "@authlete/typescript-sdk/models/operations";

let value: AuthAuthorizationIssueApiResponse = {
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

| Field                                                                           | Type                                                                            | Required                                                                        | Description                                                                     |
| ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| `headers`                                                                       | Record<string, *string*[]>                                                      | :heavy_check_mark:                                                              | N/A                                                                             |
| `result`                                                                        | [models.AuthorizationIssueResponse](../../models/authorizationissueresponse.md) | :heavy_check_mark:                                                              | N/A                                                                             |