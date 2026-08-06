# BackChannelLogout

## Overview

### Available Operations

* [backchannelLogoutTokenApi](#backchannellogouttokenapi) - Backchannel Logout Token Issuing

## backchannelLogoutTokenApi

The `/backchannel/logout/token` API issues a logout token for a client application
in the context of [OpenID Connect Back-Channel Logout 1.0](https://openid.net/specs/openid-connect-backchannel-1_0.html).


### Example Usage

<!-- UsageSnippet language="typescript" operationID="backchannel_logout_token_api" method="post" path="/api/{serviceId}/backchannel/logout/token" -->
```typescript
import { Authlete } from "@authlete/typescript-sdk";

const authlete = new Authlete({
  bearer: process.env["AUTHLETE_BEARER"] ?? "",
});

async function run() {
  const result = await authlete.backChannelLogout.backchannelLogoutTokenApi({
    serviceId: "<id>",
    backchannelLogoutTokenRequest: {
      clientIdentifier: "1140735077",
      subject: "user123",
      sessionId: "my-sid",
    },
  });

  console.log(result);
}

run();
```

### Standalone function

The standalone function version of this method:

```typescript
import { AuthleteCore } from "@authlete/typescript-sdk/core.js";
import { backChannelLogoutBackchannelLogoutTokenApi } from "@authlete/typescript-sdk/funcs/backChannelLogoutBackchannelLogoutTokenApi.js";

// Use `AuthleteCore` for best tree-shaking performance.
// You can create one instance of it to use across an application.
const authlete = new AuthleteCore({
  bearer: process.env["AUTHLETE_BEARER"] ?? "",
});

async function run() {
  const res = await backChannelLogoutBackchannelLogoutTokenApi(authlete, {
    serviceId: "<id>",
    backchannelLogoutTokenRequest: {
      clientIdentifier: "1140735077",
      subject: "user123",
      sessionId: "my-sid",
    },
  });
  if (res.ok) {
    const { value: result } = res;
    console.log(result);
  } else {
    console.log("backChannelLogoutBackchannelLogoutTokenApi failed:", res.error);
  }
}

run();
```

### Parameters

| Parameter                                                                                                                                                                      | Type                                                                                                                                                                           | Required                                                                                                                                                                       | Description                                                                                                                                                                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `request`                                                                                                                                                                      | [operations.BackchannelLogoutTokenApiRequest](../../models/operations/backchannellogouttokenapirequest.md)                                                                     | :heavy_check_mark:                                                                                                                                                             | The request object to use for the request.                                                                                                                                     |
| `options`                                                                                                                                                                      | RequestOptions                                                                                                                                                                 | :heavy_minus_sign:                                                                                                                                                             | Used to set various options for making HTTP requests.                                                                                                                          |
| `options.fetchOptions`                                                                                                                                                         | [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request#options)                                                                                        | :heavy_minus_sign:                                                                                                                                                             | Options that are passed to the underlying HTTP request. This can be used to inject extra headers for examples. All `Request` options, except `method` and `body`, are allowed. |
| `options.retries`                                                                                                                                                              | [RetryConfig](../../lib/utils/retryconfig.md)                                                                                                                                  | :heavy_minus_sign:                                                                                                                                                             | Enables retrying HTTP requests under certain failure conditions.                                                                                                               |

### Response

**Promise\<[operations.BackchannelLogoutTokenApiResponse](../../models/operations/backchannellogouttokenapiresponse.md)\>**

### Errors

| Error Type                  | Status Code                 | Content Type                |
| --------------------------- | --------------------------- | --------------------------- |
| errors.ResultError          | 400, 401, 403               | application/json            |
| errors.ResultError          | 429                         | application/json            |
| errors.ResultError          | 500                         | application/json            |
| errors.AuthleteDefaultError | 4XX, 5XX                    | \*/\*                       |