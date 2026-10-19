# ClientGrantedScopesGetApiRequest

## Example Usage

```typescript
import { ClientGrantedScopesGetApiRequest } from "@authlete/typescript-sdk/models/operations";

let value: ClientGrantedScopesGetApiRequest = {
  clientId: "1140735077",
  subject: "<value>",
};
```

## Fields

| Field                           | Type                            | Required                        | Description                     | Example                         |
| ------------------------------- | ------------------------------- | ------------------------------- | ------------------------------- | ------------------------------- |
| `serviceId`                     | *string*                        | :heavy_minus_sign:              | A service ID.                   |                                 |
| `clientId`                      | *string*                        | :heavy_check_mark:              | A client ID.<br/>               | 1140735077                      |
| `subject`                       | *string*                        | :heavy_check_mark:              | Unique user ID of an end-user.<br/> |                                 |