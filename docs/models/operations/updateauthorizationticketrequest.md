# UpdateAuthorizationTicketRequest

## Example Usage

```typescript
import { UpdateAuthorizationTicketRequest } from "@authlete/typescript-sdk/models/operations";

let value: UpdateAuthorizationTicketRequest = {
  serviceId: "<id>",
  authorizationTicketUpdateRequest: {
    ticket: "<value>",
    info: {},
  },
};
```

## Fields

| Field                                                                                       | Type                                                                                        | Required                                                                                    | Description                                                                                 |
| ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| `serviceId`                                                                                 | *string*                                                                                    | :heavy_check_mark:                                                                          | A service ID.                                                                               |
| `authorizationTicketUpdateRequest`                                                          | [models.AuthorizationTicketUpdateRequest](../../models/authorizationticketupdaterequest.md) | :heavy_check_mark:                                                                          | N/A                                                                                         |