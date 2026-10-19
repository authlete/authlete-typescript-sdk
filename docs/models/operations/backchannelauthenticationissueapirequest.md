# BackchannelAuthenticationIssueApiRequest

## Example Usage

```typescript
import { BackchannelAuthenticationIssueApiRequest } from "@authlete/typescript-sdk/models/operations";

let value: BackchannelAuthenticationIssueApiRequest = {
  backchannelAuthenticationIssueRequest: {
    ticket: "<value>",
  },
};
```

## Fields

| Field                                                                                                 | Type                                                                                                  | Required                                                                                              | Description                                                                                           |
| ----------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `serviceId`                                                                                           | *string*                                                                                              | :heavy_minus_sign:                                                                                    | A service ID.                                                                                         |
| `backchannelAuthenticationIssueRequest`                                                               | [models.BackchannelAuthenticationIssueRequest](../../models/backchannelauthenticationissuerequest.md) | :heavy_check_mark:                                                                                    | N/A                                                                                                   |