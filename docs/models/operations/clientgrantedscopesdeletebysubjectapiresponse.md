# ClientGrantedScopesDeleteBySubjectApiResponse

## Example Usage

```typescript
import { ClientGrantedScopesDeleteBySubjectApiResponse } from "@authlete/typescript-sdk/models/operations";

let value: ClientGrantedScopesDeleteBySubjectApiResponse = {
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
    "key2": [],
  },
  result: {},
};
```

## Fields

| Field                                                                                         | Type                                                                                          | Required                                                                                      | Description                                                                                   |
| --------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `headers`                                                                                     | Record<string, *string*[]>                                                                    | :heavy_check_mark:                                                                            | N/A                                                                                           |
| `result`                                                                                      | [models.ClientGrantedScopesDeleteResponse](../../models/clientgrantedscopesdeleteresponse.md) | :heavy_check_mark:                                                                            | N/A                                                                                           |