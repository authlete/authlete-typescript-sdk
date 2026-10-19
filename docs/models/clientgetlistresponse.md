# ClientGetListResponse

## Example Usage

```typescript
import { ClientGetListResponse } from "@authlete/typescript-sdk/models";

let value: ClientGetListResponse = {
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

| Field                                                                                                                   | Type                                                                                                                    | Required                                                                                                                | Description                                                                                                             |
| ----------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `start`                                                                                                                 | *number*                                                                                                                | :heavy_minus_sign:                                                                                                      | Start index (inclusive) of the result set of the query.<br/>                                                            |
| `end`                                                                                                                   | *number*                                                                                                                | :heavy_minus_sign:                                                                                                      | End index (exclusive) of the result set of the query.<br/>                                                              |
| `totalCount`                                                                                                            | *number*                                                                                                                | :heavy_minus_sign:                                                                                                      | Total number of clients that belong to the service. This doesn't mean the number of clients contained in the response.<br/> |
| `clients`                                                                                                               | [models.Client](../models/client.md)[]                                                                                  | :heavy_minus_sign:                                                                                                      | An array of clients.<br/>                                                                                               |