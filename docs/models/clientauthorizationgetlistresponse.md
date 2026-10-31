# ClientAuthorizationGetListResponse

## Example Usage

```typescript
import { ClientAuthorizationGetListResponse } from "@authlete/typescript-sdk/models";

let value: ClientAuthorizationGetListResponse = {
  clients: [
    {
      number: 1140735077,
      serviceNumber: 715948317,
      clientName: "My Test Client",
      clientId: 1140735077,
      clientSecret:
        "gXz97ISgLs4HuXwOZWch8GEmgL4YMvUJwu3er_kDVVGcA0UOhA9avLPbEmoeZdagi9yC_-tEiT2BdRyH9dbrQQ",
      clientType: "PUBLIC",
      grantTypes: [
        "AUTHORIZATION_CODE",
      ],
      responseTypes: [
        "CODE",
      ],
      redirectUris: [
        "https://example.com/callback",
      ],
    },
  ],
};
```

## Fields

| Field                                       | Type                                        | Required                                    | Description                                 |
| ------------------------------------------- | ------------------------------------------- | ------------------------------------------- | ------------------------------------------- |
| `start`                                     | *number*                                    | :heavy_minus_sign:                          | Start index of search results (inclusive).<br/> |
| `end`                                       | *number*                                    | :heavy_minus_sign:                          | End index of search results (exclusive).<br/> |
| `developer`                                 | *string*                                    | :heavy_minus_sign:                          | Unique ID of a client developer.<br/>       |
| `subject`                                   | *string*                                    | :heavy_minus_sign:                          | Unique user ID of an end-user.<br/>         |
| `totalCount`                                | *number*                                    | :heavy_minus_sign:                          | Unique ID of a client developer.<br/>       |
| `clients`                                   | [models.Client](../models/client.md)[]      | :heavy_minus_sign:                          | An array of clients.<br/>                   |