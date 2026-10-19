# AuthorizationFailRequest

## Example Usage

```typescript
import { AuthorizationFailRequest } from "@authlete/typescript-sdk/models";

let value: AuthorizationFailRequest = {
  ticket: "<value>",
  reason: "TEMPORARILY_UNAVAILABLE",
};
```

## Fields

| Field                                                                                                                                            | Type                                                                                                                                             | Required                                                                                                                                         | Description                                                                                                                                      |
| ------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `ticket`                                                                                                                                         | *string*                                                                                                                                         | :heavy_check_mark:                                                                                                                               | The ticket issued from Authlete `/auth/authorization` API.<br/>                                                                                  |
| `reason`                                                                                                                                         | [models.AuthorizationFailRequestReason](../models/authorizationfailrequestreason.md)                                                             | :heavy_check_mark:                                                                                                                               | The reason of the failure of the authorization request. For more details, see [NO_INTERACTION] in the description of `/auth/authorization` API.<br/> |
| `description`                                                                                                                                    | *string*                                                                                                                                         | :heavy_minus_sign:                                                                                                                               | The custom description about the authorization failure.<br/>                                                                                     |