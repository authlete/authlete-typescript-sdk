# UpdateAuthorizationTicketRequest

## Example Usage

```typescript
import { UpdateAuthorizationTicketRequest } from "@authlete/typescript-sdk/models/operations";

let value: UpdateAuthorizationTicketRequest = {
  authorizationTicketUpdateRequest: {
    ticket: "<value>",
    info: {},
  },
};
```

## Fields

| Field                                                                                       | Type                                                                                        | Required                                                                                    | Description                                                                                 |
| ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| `serviceId`                                                                                 | *string*                                                                                    | :heavy_minus_sign:                                                                          | A service ID.                                                                               |
| `authorizationTicketUpdateRequest`                                                          | [models.AuthorizationTicketUpdateRequest](../../models/authorizationticketupdaterequest.md) | :heavy_check_mark:                                                                          | N/A                                                                                         |