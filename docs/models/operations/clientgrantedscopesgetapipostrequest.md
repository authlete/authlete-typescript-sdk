# ClientGrantedScopesGetApiPostRequest

## Example Usage

```typescript
import { ClientGrantedScopesGetApiPostRequest } from "@authlete/typescript-sdk/models/operations";

let value: ClientGrantedScopesGetApiPostRequest = {
  serviceId: "<id>",
  clientId: "<id>",
  requestBody: {
    subject: "<value>",
  },
};
```

## Fields

| Field                                                                                                                      | Type                                                                                                                       | Required                                                                                                                   | Description                                                                                                                |
| -------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `serviceId`                                                                                                                | *string*                                                                                                                   | :heavy_check_mark:                                                                                                         | A service ID.                                                                                                              |
| `clientId`                                                                                                                 | *string*                                                                                                                   | :heavy_check_mark:                                                                                                         | A client ID.<br/>                                                                                                          |
| `requestBody`                                                                                                              | [operations.ClientGrantedScopesGetApiPostRequestBody](../../models/operations/clientgrantedscopesgetapipostrequestbody.md) | :heavy_check_mark:                                                                                                         | N/A                                                                                                                        |