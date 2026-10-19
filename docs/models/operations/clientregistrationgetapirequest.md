# ClientRegistrationGetApiRequest

## Example Usage

```typescript
import { ClientRegistrationGetApiRequest } from "@authlete/typescript-sdk/models/operations";

let value: ClientRegistrationGetApiRequest = {
  requestBody: {
    token: "<value>",
    clientId: "<id>",
  },
};
```

## Fields

| Field                                                                                                            | Type                                                                                                             | Required                                                                                                         | Description                                                                                                      |
| ---------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `serviceId`                                                                                                      | *string*                                                                                                         | :heavy_minus_sign:                                                                                               | A service ID.                                                                                                    |
| `requestBody`                                                                                                    | [operations.ClientRegistrationGetApiRequestBody](../../models/operations/clientregistrationgetapirequestbody.md) | :heavy_check_mark:                                                                                               | N/A                                                                                                              |