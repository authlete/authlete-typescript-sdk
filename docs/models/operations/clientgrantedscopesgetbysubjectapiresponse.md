# ClientGrantedScopesGetBySubjectApiResponse

## Example Usage

```typescript
import { ClientGrantedScopesGetBySubjectApiResponse } from "@authlete/typescript-sdk/models/operations";

let value: ClientGrantedScopesGetBySubjectApiResponse = {
  headers: {
    "key": [
      "<value 1>",
      "<value 2>",
    ],
    "key1": [
      "<value 1>",
    ],
    "key2": [
      "<value 1>",
      "<value 2>",
      "<value 3>",
    ],
  },
  result: {},
};
```

## Fields

| Field                                                                                         | Type                                                                                          | Required                                                                                      | Description                                                                                   |
| --------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `headers`                                                                                     | Record<string, *string*[]>                                                                    | :heavy_check_mark:                                                                            | N/A                                                                                           |
| `result`                                                                                      | [models.ClientAuthorizationDeleteResponse](../../models/clientauthorizationdeleteresponse.md) | :heavy_check_mark:                                                                            | N/A                                                                                           |