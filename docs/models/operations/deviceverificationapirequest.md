# DeviceVerificationApiRequest

## Example Usage

```typescript
import { DeviceVerificationApiRequest } from "@authlete/typescript-sdk/models/operations";

let value: DeviceVerificationApiRequest = {
  deviceVerificationRequest: {
    userCode: "<value>",
  },
};
```

## Fields

| Field                                                                         | Type                                                                          | Required                                                                      | Description                                                                   |
| ----------------------------------------------------------------------------- | ----------------------------------------------------------------------------- | ----------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| `serviceId`                                                                   | *string*                                                                      | :heavy_minus_sign:                                                            | A service ID.                                                                 |
| `deviceVerificationRequest`                                                   | [models.DeviceVerificationRequest](../../models/deviceverificationrequest.md) | :heavy_check_mark:                                                            | N/A                                                                           |