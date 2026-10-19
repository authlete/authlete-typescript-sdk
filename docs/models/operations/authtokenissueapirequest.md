# AuthTokenIssueApiRequest

## Example Usage

```typescript
import { AuthTokenIssueApiRequest } from "@authlete/typescript-sdk/models/operations";

let value: AuthTokenIssueApiRequest = {
  tokenIssueRequest: {
    ticket: "<value>",
    subject: "<value>",
  },
};
```

## Fields

| Field                                                         | Type                                                          | Required                                                      | Description                                                   |
| ------------------------------------------------------------- | ------------------------------------------------------------- | ------------------------------------------------------------- | ------------------------------------------------------------- |
| `serviceId`                                                   | *string*                                                      | :heavy_minus_sign:                                            | A service ID.                                                 |
| `tokenIssueRequest`                                           | [models.TokenIssueRequest](../../models/tokenissuerequest.md) | :heavy_check_mark:                                            | N/A                                                           |