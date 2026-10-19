# AuthAuthorizationIssueApiRequest

## Example Usage

```typescript
import { AuthAuthorizationIssueApiRequest } from "@authlete/typescript-sdk/models/operations";

let value: AuthAuthorizationIssueApiRequest = {
  authorizationIssueRequest: {
    ticket: "<value>",
    subject: "<value>",
  },
};
```

## Fields

| Field                                                                         | Type                                                                          | Required                                                                      | Description                                                                   |
| ----------------------------------------------------------------------------- | ----------------------------------------------------------------------------- | ----------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| `serviceId`                                                                   | *string*                                                                      | :heavy_minus_sign:                                                            | A service ID.                                                                 |
| `authorizationIssueRequest`                                                   | [models.AuthorizationIssueRequest](../../models/authorizationissuerequest.md) | :heavy_check_mark:                                                            | N/A                                                                           |