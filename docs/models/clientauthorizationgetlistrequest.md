# ClientAuthorizationGetListRequest

## Example Usage

```typescript
import { ClientAuthorizationGetListRequest } from "@authlete/typescript-sdk/models";

let value: ClientAuthorizationGetListRequest = {
  subject: "<value>",
};
```

## Fields

| Field                                      | Type                                       | Required                                   | Description                                |
| ------------------------------------------ | ------------------------------------------ | ------------------------------------------ | ------------------------------------------ |
| `subject`                                  | *string*                                   | :heavy_check_mark:                         | Unique user ID of an end-user.             |
| `developer`                                | *string*                                   | :heavy_minus_sign:                         | Unique ID of a client developer.           |
| `start`                                    | *number*                                   | :heavy_minus_sign:                         | Start index of search results (inclusive). |
| `end`                                      | *number*                                   | :heavy_minus_sign:                         | End index of search results (exclusive).   |