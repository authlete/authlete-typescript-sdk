# TokenCreateBatchStatusResponse

Response from a token create batch status request.


## Example Usage

```typescript
import { TokenCreateBatchStatusResponse } from "@authlete/typescript-sdk/models";

let value: TokenCreateBatchStatusResponse = {};
```

## Fields

| Field                                                    | Type                                                     | Required                                                 | Description                                              |
| -------------------------------------------------------- | -------------------------------------------------------- | -------------------------------------------------------- | -------------------------------------------------------- |
| `resultCode`                                             | *string*                                                 | :heavy_minus_sign:                                       | The result code of the request.                          |
| `resultMessage`                                          | *string*                                                 | :heavy_minus_sign:                                       | The result message of the request.                       |
| `status`                                                 | [models.TokenBatchStatus](../models/tokenbatchstatus.md) | :heavy_minus_sign:                                       | Status of a token batch operation.<br/>                  |