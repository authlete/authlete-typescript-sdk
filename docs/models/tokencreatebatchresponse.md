# TokenCreateBatchResponse

Response from a token create batch request.


## Example Usage

```typescript
import { TokenCreateBatchResponse } from "@authlete/typescript-sdk/models";

let value: TokenCreateBatchResponse = {};
```

## Fields

| Field                                     | Type                                      | Required                                  | Description                               |
| ----------------------------------------- | ----------------------------------------- | ----------------------------------------- | ----------------------------------------- |
| `resultCode`                              | *string*                                  | :heavy_minus_sign:                        | The result code of the request.           |
| `resultMessage`                           | *string*                                  | :heavy_minus_sign:                        | The result message of the request.        |
| `requestId`                               | *string*                                  | :heavy_minus_sign:                        | The ID of the issued token batch request. |