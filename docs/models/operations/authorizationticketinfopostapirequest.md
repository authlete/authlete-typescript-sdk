# AuthorizationTicketInfoPostApiRequest

## Example Usage

```typescript
import { AuthorizationTicketInfoPostApiRequest } from "@authlete/typescript-sdk/models/operations";

let value: AuthorizationTicketInfoPostApiRequest = {
  authorizationTicketInfoRequest: {
    ticket: "<value>",
  },
};
```

## Fields

| Field                                                                                   | Type                                                                                    | Required                                                                                | Description                                                                             |
| --------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| `serviceId`                                                                             | *string*                                                                                | :heavy_minus_sign:                                                                      | A service ID.                                                                           |
| `authorizationTicketInfoRequest`                                                        | [models.AuthorizationTicketInfoRequest](../../models/authorizationticketinforequest.md) | :heavy_check_mark:                                                                      | N/A                                                                                     |