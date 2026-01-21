# ClientGrantedScopesDeleteBySubjectApiRequest

## Example Usage

```typescript
import { ClientGrantedScopesDeleteBySubjectApiRequest } from "@authlete/typescript-sdk/models/operations";

let value: ClientGrantedScopesDeleteBySubjectApiRequest = {
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