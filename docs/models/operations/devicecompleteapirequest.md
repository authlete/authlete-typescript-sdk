# DeviceCompleteApiRequest

## Example Usage

```typescript
import { DeviceCompleteApiRequest } from "@authlete/typescript-sdk/models/operations";

let value: DeviceCompleteApiRequest = {
  deviceCompleteRequest: {
    userCode: "<value>",
    result: "AUTHORIZED",
    subject: "<value>",
  },
};
```

## Fields

| Field                                                                 | Type                                                                  | Required                                                              | Description                                                           |
| --------------------------------------------------------------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------- |
| `serviceId`                                                           | *string*                                                              | :heavy_minus_sign:                                                    | A service ID.                                                         |
| `deviceCompleteRequest`                                               | [models.DeviceCompleteRequest](../../models/devicecompleterequest.md) | :heavy_check_mark:                                                    | N/A                                                                   |