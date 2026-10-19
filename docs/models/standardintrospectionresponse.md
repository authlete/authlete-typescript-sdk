# StandardIntrospectionResponse

## Example Usage

```typescript
import { StandardIntrospectionResponse } from "@authlete/typescript-sdk/models";

let value: StandardIntrospectionResponse = {};
```

## Fields

| Field                                                                                             | Type                                                                                              | Required                                                                                          | Description                                                                                       |
| ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `resultCode`                                                                                      | *string*                                                                                          | :heavy_minus_sign:                                                                                | The code which represents the result of the API call.                                             |
| `resultMessage`                                                                                   | *string*                                                                                          | :heavy_minus_sign:                                                                                | A short message which explains the result of the API call.                                        |
| `action`                                                                                          | [models.StandardIntrospectionResponseAction](../models/standardintrospectionresponseaction.md)    | :heavy_minus_sign:                                                                                | The next action that the authorization server implementation should take.                         |
| `responseContent`                                                                                 | *string*                                                                                          | :heavy_minus_sign:                                                                                | The content that the authorization server implementation is to return to the client application.<br/> |