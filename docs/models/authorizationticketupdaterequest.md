# AuthorizationTicketUpdateRequest

## Example Usage

```typescript
import { AuthorizationTicketUpdateRequest } from "@authlete/typescript-sdk/models";

let value: AuthorizationTicketUpdateRequest = {
  ticket: "<value>",
  info: {},
};
```

## Fields

| Field                                                                  | Type                                                                   | Required                                                               | Description                                                            |
| ---------------------------------------------------------------------- | ---------------------------------------------------------------------- | ---------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| `ticket`                                                               | *string*                                                               | :heavy_check_mark:                                                     | The ticket.                                                            |
| `info`                                                                 | [models.AuthorizationTicketInfo](../models/authorizationticketinfo.md) | :heavy_check_mark:                                                     | N/A                                                                    |