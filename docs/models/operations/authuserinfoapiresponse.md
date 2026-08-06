# AuthUserinfoApiResponse

## Example Usage

```typescript
import { AuthUserinfoApiResponse } from "@authlete/typescript-sdk/models/operations";

let value: AuthUserinfoApiResponse = {
  headers: {
    "key": [
      "<value 1>",
      "<value 2>",
      "<value 3>",
    ],
    "key1": [
      "<value 1>",
      "<value 2>",
      "<value 3>",
    ],
  },
  result: {},
};
```

## Fields

| Field                                                       | Type                                                        | Required                                                    | Description                                                 |
| ----------------------------------------------------------- | ----------------------------------------------------------- | ----------------------------------------------------------- | ----------------------------------------------------------- |
| `headers`                                                   | Record<string, *string*[]>                                  | :heavy_check_mark:                                          | N/A                                                         |
| `result`                                                    | [models.UserinfoResponse](../../models/userinforesponse.md) | :heavy_check_mark:                                          | N/A                                                         |