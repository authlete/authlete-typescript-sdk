# AuthTokenCreateBatchStatusApiRequest

## Example Usage

```typescript
import { AuthTokenCreateBatchStatusApiRequest } from "@authlete/typescript-sdk/models/operations";

let value: AuthTokenCreateBatchStatusApiRequest = {
  serviceId: "<id>",
  tokenBatchRequestId: "<id>",
};
```

## Fields

| Field                      | Type                       | Required                   | Description                |
| -------------------------- | -------------------------- | -------------------------- | -------------------------- |
| `serviceId`                | *string*                   | :heavy_check_mark:         | A service ID.              |
| `tokenBatchRequestId`      | *string*                   | :heavy_check_mark:         | A token batch request ID.<br/> |