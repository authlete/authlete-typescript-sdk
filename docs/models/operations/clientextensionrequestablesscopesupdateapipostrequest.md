# ClientExtensionRequestablesScopesUpdateApiPostRequest

## Example Usage

```typescript
import { ClientExtensionRequestablesScopesUpdateApiPostRequest } from "@authlete/typescript-sdk/models/operations";

let value: ClientExtensionRequestablesScopesUpdateApiPostRequest = {
  clientId: "<id>",
  clientExtensionRequestableScopesUpdateRequest: {},
};
```

## Fields

| Field                                                                                                                 | Type                                                                                                                  | Required                                                                                                              | Description                                                                                                           |
| --------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `serviceId`                                                                                                           | *string*                                                                                                              | :heavy_minus_sign:                                                                                                    | A service ID.                                                                                                         |
| `clientId`                                                                                                            | *string*                                                                                                              | :heavy_check_mark:                                                                                                    | A client ID.<br/>                                                                                                     |
| `clientExtensionRequestableScopesUpdateRequest`                                                                       | [models.ClientExtensionRequestableScopesUpdateRequest](../../models/clientextensionrequestablescopesupdaterequest.md) | :heavy_check_mark:                                                                                                    | N/A                                                                                                                   |