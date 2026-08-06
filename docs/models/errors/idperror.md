# IdpError

Error response returned by the Authlete IdP server. Unlike the main API's
`resultCode`/`resultMessage` format, IdP errors carry a human-readable `error` message,
optionally accompanied by contextual fields (such as `organizationId` or `apiServerId`).
Request validation failures instead return an `errors` array of per-field messages.


## Example Usage

```typescript
import { IdpError } from "@authlete/typescript-sdk/models/errors";

// No examples available for this model
```

## Fields

| Field                                                                         | Type                                                                          | Required                                                                      | Description                                                                   |
| ----------------------------------------------------------------------------- | ----------------------------------------------------------------------------- | ----------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| `error`                                                                       | *string*                                                                      | :heavy_minus_sign:                                                            | A human-readable error message.                                               |
| `errors`                                                                      | *string*[]                                                                    | :heavy_minus_sign:                                                            | Per-field validation error messages, present for request validation failures. |
| `additionalProperties`                                                        | Record<string, *any*>                                                         | :heavy_minus_sign:                                                            | N/A                                                                           |