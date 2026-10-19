# ClientRegistrationUpdateApiRequestBody

## Example Usage

```typescript
import { ClientRegistrationUpdateApiRequestBody } from "@authlete/typescript-sdk/models/operations";

let value: ClientRegistrationUpdateApiRequestBody = {
  json: "{key: 7112400702100740, key1: null, key2: \"<value>\"}",
  token: "<value>",
  clientId: "<id>",
};
```

## Fields

| Field                                                                                                                                                          | Type                                                                                                                                                           | Required                                                                                                                                                       | Description                                                                                                                                                    |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `json`                                                                                                                                                         | *string*                                                                                                                                                       | :heavy_check_mark:                                                                                                                                             | Client metadata in JSON format that complies with [RFC 7591](https://datatracker.ietf.org/doc/html/rfc7591) (OAuth 2.0 Dynamic Client Registration Protocol).<br/> |
| `token`                                                                                                                                                        | *string*                                                                                                                                                       | :heavy_check_mark:                                                                                                                                             | The client registration access token. Used only for GET, UPDATE, and DELETE requests.<br/>                                                                     |
| `clientId`                                                                                                                                                     | *string*                                                                                                                                                       | :heavy_check_mark:                                                                                                                                             | The client's identifier. Used for GET, UPDATE, and DELETE requests<br/>                                                                                        |