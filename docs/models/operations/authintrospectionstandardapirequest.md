# AuthIntrospectionStandardApiRequest

## Example Usage

```typescript
import { AuthIntrospectionStandardApiRequest } from "@authlete/typescript-sdk/models/operations";

let value: AuthIntrospectionStandardApiRequest = {
  standardIntrospectionRequest: {
    parameters: "<value>",
  },
};
```

## Fields

| Field                                                                               | Type                                                                                | Required                                                                            | Description                                                                         |
| ----------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| `serviceId`                                                                         | *string*                                                                            | :heavy_minus_sign:                                                                  | A service ID.                                                                       |
| `standardIntrospectionRequest`                                                      | [models.StandardIntrospectionRequest](../../models/standardintrospectionrequest.md) | :heavy_check_mark:                                                                  | N/A                                                                                 |