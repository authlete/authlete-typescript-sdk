# AuthTokenDeleteApiRequest

## Example Usage

```typescript
import { AuthTokenDeleteApiRequest } from "@authlete/typescript-sdk/models/operations";

let value: AuthTokenDeleteApiRequest = {
  accessTokenIdentifier: "<value>",
};
```

## Fields

| Field                                                                                                                                      | Type                                                                                                                                       | Required                                                                                                                                   | Description                                                                                                                                |
| ------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `serviceId`                                                                                                                                | *string*                                                                                                                                   | :heavy_minus_sign:                                                                                                                         | A service ID.                                                                                                                              |
| `accessTokenIdentifier`                                                                                                                    | *string*                                                                                                                                   | :heavy_check_mark:                                                                                                                         | The identifier of an existing access token. The identifier is the value of the access token or the value of the hash of the access token.<br/> |