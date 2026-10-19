# ClientAuthorizationUpdateApiRequest

## Example Usage

```typescript
import { ClientAuthorizationUpdateApiRequest } from "@authlete/typescript-sdk/models/operations";

let value: ClientAuthorizationUpdateApiRequest = {
  clientId: "<id>",
};
```

## Fields

| Field                                                                                       | Type                                                                                        | Required                                                                                    | Description                                                                                 |
| ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| `serviceId`                                                                                 | *string*                                                                                    | :heavy_minus_sign:                                                                          | A service ID.                                                                               |
| `clientId`                                                                                  | *string*                                                                                    | :heavy_check_mark:                                                                          | A client ID.<br/>                                                                           |
| `clientAuthorizationUpdateRequest`                                                          | [models.ClientAuthorizationUpdateRequest](../../models/clientauthorizationupdaterequest.md) | :heavy_minus_sign:                                                                          | N/A                                                                                         |