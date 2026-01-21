# TokenBatchStatus

Status of a token batch operation.


## Example Usage

```typescript
import { TokenBatchStatus } from "@authlete/typescript-sdk/models";

let value: TokenBatchStatus = {};
```

## Fields

| Field                                                                | Type                                                                 | Required                                                             | Description                                                          |
| -------------------------------------------------------------------- | -------------------------------------------------------------------- | -------------------------------------------------------------------- | -------------------------------------------------------------------- |
| `batchKind`                                                          | [models.BatchKind](../models/batchkind.md)                           | :heavy_minus_sign:                                                   | The kind of batch operation.                                         |
| `requestId`                                                          | *string*                                                             | :heavy_minus_sign:                                                   | The request ID.                                                      |
| `result`                                                             | [models.TokenBatchStatusResult](../models/tokenbatchstatusresult.md) | :heavy_minus_sign:                                                   | The result of the batch operation.                                   |
| `errorCode`                                                          | *string*                                                             | :heavy_minus_sign:                                                   | The error code if the operation failed.                              |
| `errorDescription`                                                   | *string*                                                             | :heavy_minus_sign:                                                   | The error description if the operation failed.                       |
| `tokenCount`                                                         | *number*                                                             | :heavy_minus_sign:                                                   | The number of tokens processed.                                      |
| `createdAt`                                                          | *number*                                                             | :heavy_minus_sign:                                                   | The time at which the batch operation was created (timestamp).       |
| `modifiedAt`                                                         | *number*                                                             | :heavy_minus_sign:                                                   | The time at which the batch operation was last modified (timestamp). |