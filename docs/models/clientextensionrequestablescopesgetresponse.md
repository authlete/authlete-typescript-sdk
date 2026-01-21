# ClientExtensionRequestableScopesGetResponse

## Example Usage

```typescript
import { ClientExtensionRequestableScopesGetResponse } from "@authlete/typescript-sdk/models";

let value: ClientExtensionRequestableScopesGetResponse = {};
```

## Fields

| Field                                                                                                                              | Type                                                                                                                               | Required                                                                                                                           | Description                                                                                                                        |
| ---------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `requestableScopes`                                                                                                                | *string*[]                                                                                                                         | :heavy_minus_sign:                                                                                                                 | The requestable scopes for this client. This is null if the Requestable Scopes per Client feature is not enabled for this client.<br/> |