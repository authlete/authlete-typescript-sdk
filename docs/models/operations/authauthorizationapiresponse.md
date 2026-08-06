# AuthAuthorizationApiResponse

## Example Usage

```typescript
import { AuthAuthorizationApiResponse } from "@authlete/typescript-sdk/models/operations";

let value: AuthAuthorizationApiResponse = {
  headers: {
    "key": [
      "<value 1>",
      "<value 2>",
    ],
    "key1": [
      "<value 1>",
      "<value 2>",
    ],
  },
  result: {
    service: {
      number: 715948317,
      serviceName: "My Test Service",
      issuer: "https://example.com",
      supportedGrantTypes: [
        "AUTHORIZATION_CODE",
        "REFRESH_TOKEN",
      ],
      supportedResponseTypes: [
        "CODE",
      ],
      supportedScopes: [
        {},
        {},
        {},
      ],
    },
  },
};
```

## Fields

| Field                                                                 | Type                                                                  | Required                                                              | Description                                                           |
| --------------------------------------------------------------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------- |
| `headers`                                                             | Record<string, *string*[]>                                            | :heavy_check_mark:                                                    | N/A                                                                   |
| `result`                                                              | [models.AuthorizationResponse](../../models/authorizationresponse.md) | :heavy_check_mark:                                                    | N/A                                                                   |