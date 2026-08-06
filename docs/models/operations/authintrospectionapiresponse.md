# AuthIntrospectionApiResponse

## Example Usage

```typescript
import { AuthIntrospectionApiResponse } from "@authlete/typescript-sdk/models/operations";

let value: AuthIntrospectionApiResponse = {
  headers: {
    "key": [
      "<value 1>",
      "<value 2>",
    ],
    "key1": [
      "<value 1>",
      "<value 2>",
    ],
    "key2": [
      "<value 1>",
      "<value 2>",
    ],
  },
  result: {},
};
```

## Fields

| Field                                                                 | Type                                                                  | Required                                                              | Description                                                           |
| --------------------------------------------------------------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------- |
| `headers`                                                             | Record<string, *string*[]>                                            | :heavy_check_mark:                                                    | N/A                                                                   |
| `result`                                                              | [models.IntrospectionResponse](../../models/introspectionresponse.md) | :heavy_check_mark:                                                    | N/A                                                                   |