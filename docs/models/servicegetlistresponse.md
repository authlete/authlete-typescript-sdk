# ServiceGetListResponse

## Example Usage

```typescript
import { ServiceGetListResponse } from "@authlete/typescript-sdk/models";

let value: ServiceGetListResponse = {
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
};
```

## Fields

| Field                                                                                                                     | Type                                                                                                                      | Required                                                                                                                  | Description                                                                                                               |
| ------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `start`                                                                                                                   | *number*                                                                                                                  | :heavy_minus_sign:                                                                                                        | Start index (inclusive) of the result set. The default value is 0. Must not be a negative number.<br/>                    |
| `end`                                                                                                                     | *number*                                                                                                                  | :heavy_minus_sign:                                                                                                        | Start index (inclusive) of the result set. The default value is 0. Must not be a negative number.<br/>                    |
| `totalCount`                                                                                                              | *number*                                                                                                                  | :heavy_minus_sign:                                                                                                        | Total number of services owned by the service owner. This doesn't mean the number of services contained in the response.<br/> |
| `services`                                                                                                                | [models.Service](../models/service.md)[]                                                                                  | :heavy_minus_sign:                                                                                                        | An array of services.<br/>                                                                                                |