# NativeSsoLogoutApiRequest

## Example Usage

```typescript
import { NativeSsoLogoutApiRequest } from "@authlete/typescript-sdk/models/operations";

let value: NativeSsoLogoutApiRequest = {
  nativeSsoLogoutRequest: {
    sessionId: "<id>",
  },
};
```

## Fields

| Field                                                                   | Type                                                                    | Required                                                                | Description                                                             |
| ----------------------------------------------------------------------- | ----------------------------------------------------------------------- | ----------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| `serviceId`                                                             | *string*                                                                | :heavy_minus_sign:                                                      | A service ID.                                                           |
| `nativeSsoLogoutRequest`                                                | [models.NativeSsoLogoutRequest](../../models/nativessologoutrequest.md) | :heavy_check_mark:                                                      | N/A                                                                     |