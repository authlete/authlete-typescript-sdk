# FederationRegistrationApiResponse

## Example Usage

```typescript
import { FederationRegistrationApiResponse } from "@authlete/typescript-sdk/models/operations";

let value: FederationRegistrationApiResponse = {
  headers: {},
  result: {
    client: {
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
  },
};
```

## Fields

| Field                                                                                   | Type                                                                                    | Required                                                                                | Description                                                                             |
| --------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| `headers`                                                                               | Record<string, *string*[]>                                                              | :heavy_check_mark:                                                                      | N/A                                                                                     |
| `result`                                                                                | [models.FederationRegistrationResponse](../../models/federationregistrationresponse.md) | :heavy_check_mark:                                                                      | N/A                                                                                     |