# ClientAuthorizationDeleteApiPostRequest

## Example Usage

```typescript
import { ClientAuthorizationDeleteApiPostRequest } from "@authlete/typescript-sdk/models/operations";

let value: ClientAuthorizationDeleteApiPostRequest = {
  serviceId: "<id>",
  clientId: "<id>",
  requestBody: {
    subject: "<value>",
  },
};
```

## Fields

| Field                                                                                                                            | Type                                                                                                                             | Required                                                                                                                         | Description                                                                                                                      |
| -------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `serviceId`                                                                                                                      | *string*                                                                                                                         | :heavy_check_mark:                                                                                                               | A service ID.                                                                                                                    |
| `clientId`                                                                                                                       | *string*                                                                                                                         | :heavy_check_mark:                                                                                                               | A client ID.<br/>                                                                                                                |
| `requestBody`                                                                                                                    | [operations.ClientAuthorizationDeleteApiPostRequestBody](../../models/operations/clientauthorizationdeleteapipostrequestbody.md) | :heavy_check_mark:                                                                                                               | N/A                                                                                                                              |