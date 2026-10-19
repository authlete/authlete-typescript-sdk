# AuthUserinfoApiRequest

## Example Usage

```typescript
import { AuthUserinfoApiRequest } from "@authlete/typescript-sdk/models/operations";

let value: AuthUserinfoApiRequest = {
  userinfoRequest: {
    token: "<value>",
  },
};
```

## Fields

| Field                                                     | Type                                                      | Required                                                  | Description                                               |
| --------------------------------------------------------- | --------------------------------------------------------- | --------------------------------------------------------- | --------------------------------------------------------- |
| `serviceId`                                               | *string*                                                  | :heavy_minus_sign:                                        | A service ID.                                             |
| `userinfoRequest`                                         | [models.UserinfoRequest](../../models/userinforequest.md) | :heavy_check_mark:                                        | N/A                                                       |