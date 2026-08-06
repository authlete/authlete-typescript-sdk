# ClientGetListApiResponse

## Example Usage

```typescript
import { ClientGetListApiResponse } from "@authlete/typescript-sdk/models/operations";

let value: ClientGetListApiResponse = {
  headers: {
    "key": [
      "<value 1>",
      "<value 2>",
    ],
    "key1": [
      "<value 1>",
    ],
    "key2": [],
  },
  result: {
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
  },
};
```

## Fields

| Field                                                                 | Type                                                                  | Required                                                              | Description                                                           |
| --------------------------------------------------------------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------- |
| `headers`                                                             | Record<string, *string*[]>                                            | :heavy_check_mark:                                                    | N/A                                                                   |
| `result`                                                              | [models.ClientGetListResponse](../../models/clientgetlistresponse.md) | :heavy_check_mark:                                                    | N/A                                                                   |