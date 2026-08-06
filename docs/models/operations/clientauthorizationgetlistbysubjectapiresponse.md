# ClientAuthorizationGetListBySubjectApiResponse

## Example Usage

```typescript
import { ClientAuthorizationGetListBySubjectApiResponse } from "@authlete/typescript-sdk/models/operations";

let value: ClientAuthorizationGetListBySubjectApiResponse = {
  headers: {
    "key": [
      "<value 1>",
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

| Field                                                                                           | Type                                                                                            | Required                                                                                        | Description                                                                                     |
| ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `headers`                                                                                       | Record<string, *string*[]>                                                                      | :heavy_check_mark:                                                                              | N/A                                                                                             |
| `result`                                                                                        | [models.ClientAuthorizationGetListResponse](../../models/clientauthorizationgetlistresponse.md) | :heavy_check_mark:                                                                              | N/A                                                                                             |