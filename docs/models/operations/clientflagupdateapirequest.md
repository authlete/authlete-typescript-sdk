# ClientFlagUpdateApiRequest

## Example Usage

```typescript
import { ClientFlagUpdateApiRequest } from "@authlete/typescript-sdk/models/operations";

let value: ClientFlagUpdateApiRequest = {
  clientIdentifier: "<value>",
};
```

## Fields

| Field                                                                     | Type                                                                      | Required                                                                  | Description                                                               |
| ------------------------------------------------------------------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| `serviceId`                                                               | *string*                                                                  | :heavy_minus_sign:                                                        | A service ID.                                                             |
| `clientIdentifier`                                                        | *string*                                                                  | :heavy_check_mark:                                                        | A client ID.                                                              |
| `clientFlagUpdateRequest`                                                 | [models.ClientFlagUpdateRequest](../../models/clientflagupdaterequest.md) | :heavy_minus_sign:                                                        | N/A                                                                       |