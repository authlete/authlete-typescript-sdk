# VciSingleIssueApiResponse

## Example Usage

```typescript
import { VciSingleIssueApiResponse } from "@authlete/typescript-sdk/models/operations";

let value: VciSingleIssueApiResponse = {
  headers: {
    "key": [
      "<value 1>",
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
| `result`                                                                | [models.VciSingleIssueResponse](../../models/vcisingleissueresponse.md) | :heavy_check_mark:                                                      | N/A                                                                     |