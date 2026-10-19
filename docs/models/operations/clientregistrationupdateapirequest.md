# ClientRegistrationUpdateApiRequest

## Example Usage

```typescript
import { ClientRegistrationUpdateApiRequest } from "@authlete/typescript-sdk/models/operations";

let value: ClientRegistrationUpdateApiRequest = {
  requestBody: {
    json: "{key: 1707899379638283, key1: null, key2: \"<value>\"}",
    token: "<value>",
    clientId: "<id>",
  },
};
```

## Fields

| Field                                                                                                                  | Type                                                                                                                   | Required                                                                                                               | Description                                                                                                            |
| ---------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `serviceId`                                                                                                            | *string*                                                                                                               | :heavy_minus_sign:                                                                                                     | A service ID.                                                                                                          |
| `requestBody`                                                                                                          | [operations.ClientRegistrationUpdateApiRequestBody](../../models/operations/clientregistrationupdateapirequestbody.md) | :heavy_check_mark:                                                                                                     | N/A                                                                                                                    |