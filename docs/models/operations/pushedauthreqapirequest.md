# PushedAuthReqApiRequest

## Example Usage

```typescript
import { PushedAuthReqApiRequest } from "@authlete/typescript-sdk/models/operations";

let value: PushedAuthReqApiRequest = {
  pushedAuthorizationRequest: {
    parameters: "<value>",
  },
};
```

## Fields

| Field                                                                           | Type                                                                            | Required                                                                        | Description                                                                     |
| ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| `serviceId`                                                                     | *string*                                                                        | :heavy_minus_sign:                                                              | A service ID.                                                                   |
| `pushedAuthorizationRequest`                                                    | [models.PushedAuthorizationRequest](../../models/pushedauthorizationrequest.md) | :heavy_check_mark:                                                              | N/A                                                                             |