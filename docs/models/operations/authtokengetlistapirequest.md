# AuthTokenGetListApiRequest

## Example Usage

```typescript
import { AuthTokenGetListApiRequest } from "@authlete/typescript-sdk/models/operations";

let value: AuthTokenGetListApiRequest = {};
```

## Fields

| Field                                                              | Type                                                               | Required                                                           | Description                                                        |
| ------------------------------------------------------------------ | ------------------------------------------------------------------ | ------------------------------------------------------------------ | ------------------------------------------------------------------ |
| `serviceId`                                                        | *string*                                                           | :heavy_minus_sign:                                                 | A service ID.                                                      |
| `clientIdentifier`                                                 | *string*                                                           | :heavy_minus_sign:                                                 | Client Identifier (client ID or client ID alias).<br/>             |
| `subject`                                                          | *string*                                                           | :heavy_minus_sign:                                                 | Unique user ID.<br/>                                               |
| `start`                                                            | *number*                                                           | :heavy_minus_sign:                                                 | Start index of search results (inclusive). The default value is 0. |
| `end`                                                              | *number*                                                           | :heavy_minus_sign:                                                 | End index of search results (exclusive). The default value is 5.<br/> |