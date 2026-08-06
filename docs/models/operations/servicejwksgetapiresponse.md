# ServiceJwksGetApiResponse

## Example Usage

```typescript
import { ServiceJwksGetApiResponse } from "@authlete/typescript-sdk/models/operations";

let value: ServiceJwksGetApiResponse = {
  headers: {
    "key": [
      "<value 1>",
    ],
    "key1": [
      "<value 1>",
      "<value 2>",
    ],
    "key2": [
      "<value 1>",
      "<value 2>",
      "<value 3>",
    ],
  },
};
```

## Fields

| Field                                                                   | Type                                                                    | Required                                                                | Description                                                             |
| ----------------------------------------------------------------------- | ----------------------------------------------------------------------- | ----------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| `headers`                                                               | Record<string, *string*[]>                                              | :heavy_check_mark:                                                      | N/A                                                                     |
| `result`                                                                | [models.ServiceJwksGetResponse](../../models/servicejwksgetresponse.md) | :heavy_minus_sign:                                                      | N/A                                                                     |