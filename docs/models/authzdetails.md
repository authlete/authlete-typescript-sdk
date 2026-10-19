# AuthzDetails

The authorization details. This represents the value of the `authorization_details` request parameter in the preceding device authorization request which is defined in "OAuth 2.0 Rich Authorization Requests".


## Example Usage

```typescript
import { AuthzDetails } from "@authlete/typescript-sdk/models";

let value: AuthzDetails = {};
```

## Fields

| Field                                                                            | Type                                                                             | Required                                                                         | Description                                                                      |
| -------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| `elements`                                                                       | [models.AuthorizationDetailsElement](../models/authorizationdetailselement.md)[] | :heavy_minus_sign:                                                               | Elements of this authorization details.<br/>                                     |