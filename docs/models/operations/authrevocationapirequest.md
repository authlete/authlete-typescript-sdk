# AuthRevocationApiRequest

## Example Usage

```typescript
import { AuthRevocationApiRequest } from "@authlete/typescript-sdk/models/operations";

let value: AuthRevocationApiRequest = {
  revocationRequest: {
    parameters: "<value>",
  },
};
```

## Fields

| Field                                                         | Type                                                          | Required                                                      | Description                                                   |
| ------------------------------------------------------------- | ------------------------------------------------------------- | ------------------------------------------------------------- | ------------------------------------------------------------- |
| `serviceId`                                                   | *string*                                                      | :heavy_minus_sign:                                            | A service ID.                                                 |
| `revocationRequest`                                           | [models.RevocationRequest](../../models/revocationrequest.md) | :heavy_check_mark:                                            | N/A                                                           |