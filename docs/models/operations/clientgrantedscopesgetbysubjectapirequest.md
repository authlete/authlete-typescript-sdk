# ClientGrantedScopesGetBySubjectApiRequest

## Example Usage

```typescript
import { ClientGrantedScopesGetBySubjectApiRequest } from "@authlete/typescript-sdk/models/operations";

let value: ClientGrantedScopesGetBySubjectApiRequest = {
  serviceId: "<id>",
  clientId: "<id>",
  subject: "<value>",
};
```

## Fields

| Field                           | Type                            | Required                        | Description                     |
| ------------------------------- | ------------------------------- | ------------------------------- | ------------------------------- |
| `serviceId`                     | *string*                        | :heavy_check_mark:              | A service ID.                   |
| `clientId`                      | *string*                        | :heavy_check_mark:              | A client ID.<br/>               |
| `subject`                       | *string*                        | :heavy_check_mark:              | Unique user ID of an end-user.<br/> |