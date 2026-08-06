# DeviceCompleteResponse

## Example Usage

```typescript
import { DeviceCompleteResponse } from "@authlete/typescript-sdk/models";

let value: DeviceCompleteResponse = {};
```

## Fields

| Field                                                                            | Type                                                                             | Required                                                                         | Description                                                                      |
| -------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| `resultCode`                                                                     | *string*                                                                         | :heavy_minus_sign:                                                               | The code which represents the result of the API call.                            |
| `resultMessage`                                                                  | *string*                                                                         | :heavy_minus_sign:                                                               | A short message which explains the result of the API call.                       |
| `action`                                                                         | [models.DeviceCompleteResponseAction](../models/devicecompleteresponseaction.md) | :heavy_minus_sign:                                                               | The next action that the authorization server implementation should take.<br/>   |
| `consentedClaims`                                                                | *string*[]                                                                       | :heavy_minus_sign:                                                               | the claims that the user has consented for the client application<br/>to know.<br/> |