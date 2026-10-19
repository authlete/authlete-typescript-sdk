# ClientRegistrationDeleteApiRequest

## Example Usage

```typescript
import { ClientRegistrationDeleteApiRequest } from "@authlete/typescript-sdk/models/operations";

let value: ClientRegistrationDeleteApiRequest = {
  requestBody: {
    token: "<value>",
    clientId: "<id>",
  },
};
```

## Fields

| Field                                                                                                                  | Type                                                                                                                   | Required                                                                                                               | Description                                                                                                            |
| ---------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `serviceId`                                                                                                            | *string*                                                                                                               | :heavy_minus_sign:                                                                                                     | A service ID.                                                                                                          |
| `requestBody`                                                                                                          | [operations.ClientRegistrationDeleteApiRequestBody](../../models/operations/clientregistrationdeleteapirequestbody.md) | :heavy_check_mark:                                                                                                     | N/A                                                                                                                    |