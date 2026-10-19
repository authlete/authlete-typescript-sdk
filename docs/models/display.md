# Display

The display mode which the client application requests by `display` request parameter. When the authorization request does not have `display` request parameter, `PAGE` is set as the default value.

It is ensured that the value of `display` is one of the supported display modes which are specified by `supportedDisplays` configuration parameter of the service. If the display mode specified by the authorization request is not supported, an error is raised.

Values for this property correspond to the values listed in "[OpenID Connect Core 1.0, 3.1.2.1. Authentication Request](https://openid.net/specs/openid-connect-core-1_0.html#AuthRequest), display".


## Example Usage

```typescript
import { Display } from "@authlete/typescript-sdk/models";

let value: Display = "POPUP";
```

## Values

```typescript
"PAGE" | "POPUP" | "TOUCH" | "WAP"
```