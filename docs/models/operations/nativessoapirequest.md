# NativeSsoApiRequest

## Example Usage

```typescript
import { NativeSsoApiRequest } from "@authlete/typescript-sdk/models/operations";

let value: NativeSsoApiRequest = {
  nativeSsoRequest: {
    accessToken: "<value>",
    deviceSecret: "<value>",
  },
};
```

## Fields

| Field                                                       | Type                                                        | Required                                                    | Description                                                 |
| ----------------------------------------------------------- | ----------------------------------------------------------- | ----------------------------------------------------------- | ----------------------------------------------------------- |
| `serviceId`                                                 | *string*                                                    | :heavy_minus_sign:                                          | A service ID.                                               |
| `nativeSsoRequest`                                          | [models.NativeSsoRequest](../../models/nativessorequest.md) | :heavy_check_mark:                                          | N/A                                                         |