# AuthUserinfoIssueApiRequest

## Example Usage

```typescript
import { AuthUserinfoIssueApiRequest } from "@authlete/typescript-sdk/models/operations";

let value: AuthUserinfoIssueApiRequest = {
  userinfoIssueRequest: {
    token: "<value>",
  },
};
```

## Fields

| Field                                                               | Type                                                                | Required                                                            | Description                                                         |
| ------------------------------------------------------------------- | ------------------------------------------------------------------- | ------------------------------------------------------------------- | ------------------------------------------------------------------- |
| `serviceId`                                                         | *string*                                                            | :heavy_minus_sign:                                                  | A service ID.                                                       |
| `userinfoIssueRequest`                                              | [models.UserinfoIssueRequest](../../models/userinfoissuerequest.md) | :heavy_check_mark:                                                  | N/A                                                                 |