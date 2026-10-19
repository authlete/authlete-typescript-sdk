# AuthIntrospectionApiRequest

## Example Usage

```typescript
import { AuthIntrospectionApiRequest } from "@authlete/typescript-sdk/models/operations";

let value: AuthIntrospectionApiRequest = {
  introspectionRequest: {
    token: "<value>",
  },
};
```

## Fields

| Field                                                               | Type                                                                | Required                                                            | Description                                                         |
| ------------------------------------------------------------------- | ------------------------------------------------------------------- | ------------------------------------------------------------------- | ------------------------------------------------------------------- |
| `serviceId`                                                         | *string*                                                            | :heavy_minus_sign:                                                  | A service ID.                                                       |
| `introspectionRequest`                                              | [models.IntrospectionRequest](../../models/introspectionrequest.md) | :heavy_check_mark:                                                  | N/A                                                                 |