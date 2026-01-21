# AuthTokenCreateBatchApiRequest

## Example Usage

```typescript
import { AuthTokenCreateBatchApiRequest } from "@authlete/typescript-sdk/models/operations";

let value: AuthTokenCreateBatchApiRequest = {
  serviceId: "<id>",
  requestBody: [],
};
```

## Fields

| Field                                                                            | Type                                                                             | Required                                                                         | Description                                                                      |
| -------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| `serviceId`                                                                      | *string*                                                                         | :heavy_check_mark:                                                               | A service ID.                                                                    |
| `dryRun`                                                                         | *boolean*                                                                        | :heavy_minus_sign:                                                               | If `true`, the request is processed but access tokens are not actually created.<br/> |
| `requestBody`                                                                    | [models.TokenCreateRequest](../../models/tokencreaterequest.md)[]                | :heavy_check_mark:                                                               | N/A                                                                              |