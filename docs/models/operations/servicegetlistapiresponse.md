# ServiceGetListApiResponse

## Example Usage

```typescript
import { ServiceGetListApiResponse } from "@authlete/typescript-sdk/models/operations";

let value: ServiceGetListApiResponse = {
  headers: {
    "key": [
      "<value 1>",
      "<value 2>",
    ],
    "key1": [
      "<value 1>",
    ],
  },
  result: {
    services: [
      {
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
    ],
  },
};
```

## Fields

| Field                                                                   | Type                                                                    | Required                                                                | Description                                                             |
| ----------------------------------------------------------------------- | ----------------------------------------------------------------------- | ----------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| `headers`                                                               | Record<string, *string*[]>                                              | :heavy_check_mark:                                                      | N/A                                                                     |
| `result`                                                                | [models.ServiceGetListResponse](../../models/servicegetlistresponse.md) | :heavy_check_mark:                                                      | N/A                                                                     |