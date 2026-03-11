# NativeSso

## Overview

### Available Operations

* [process](#process) - Native SSO Processing
* [logout](#logout) - Native SSO Logout Processing

## process

This API should be called by the implementation of a token endpoint to generate the ID token and
token response that comply with [OpenID Connect Native SSO for Mobile Apps 1.0](https://openid.net/specs/openid-connect-native-sso-1_0.html)
(Native SSO) when Authlete’s `/auth/token` response indicates `action = NATIVE_SSO` (after you validate
the session id and verify or generate the device secret as required by the flow). The token endpoint
implementation should retrieve the value of `action` from the response and take the following steps
according to the value.


### Example Usage

<!-- UsageSnippet language="typescript" operationID="native_sso_api" method="post" path="/api/{serviceId}/nativesso" -->
```typescript
import { Authlete } from "@authlete/typescript-sdk";

const authlete = new Authlete({
  bearer: process.env["AUTHLETE_BEARER"] ?? "",
});

async function run() {
  const result = await authlete.nativeSso.process({
    serviceId: "715948317",
    nativeSsoRequest: {
      accessToken: "_kh1aygxZ5NKLYKCJRM8M_AYvDg2wCWoprQDjfO87ZWq",
      refreshToken: "kHUGSt_d3LSgiCQzH7wa5TpwIHWgjAZGw14zZV7hRqw",
      claims: "{\"given_name\":\"John\",\"family_name\":\"Brown\",\"email\":\"test@example.com\"}",
      deviceSecret: "my-ds",
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
import { nativeSsoProcess } from "@authlete/typescript-sdk/funcs/nativeSsoProcess.js";

// Use `AuthleteCore` for best tree-shaking performance.
// You can create one instance of it to use across an application.
const authlete = new AuthleteCore({
  bearer: process.env["AUTHLETE_BEARER"] ?? "",
});

async function run() {
  const res = await nativeSsoProcess(authlete, {
    serviceId: "715948317",
    nativeSsoRequest: {
      accessToken: "_kh1aygxZ5NKLYKCJRM8M_AYvDg2wCWoprQDjfO87ZWq",
      refreshToken: "kHUGSt_d3LSgiCQzH7wa5TpwIHWgjAZGw14zZV7hRqw",
      claims: "{\"given_name\":\"John\",\"family_name\":\"Brown\",\"email\":\"test@example.com\"}",
      deviceSecret: "my-ds",
    },
  });
  if (res.ok) {
    const { value: result } = res;
    console.log(result);
  } else {
    console.log("nativeSsoProcess failed:", res.error);
  }
}

run();
```

### Parameters

| Parameter                                                                                                                                                                      | Type                                                                                                                                                                           | Required                                                                                                                                                                       | Description                                                                                                                                                                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `request`                                                                                                                                                                      | [operations.NativeSsoApiRequest](../../models/operations/nativessoapirequest.md)                                                                                               | :heavy_check_mark:                                                                                                                                                             | The request object to use for the request.                                                                                                                                     |
| `options`                                                                                                                                                                      | RequestOptions                                                                                                                                                                 | :heavy_minus_sign:                                                                                                                                                             | Used to set various options for making HTTP requests.                                                                                                                          |
| `options.fetchOptions`                                                                                                                                                         | [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request#options)                                                                                        | :heavy_minus_sign:                                                                                                                                                             | Options that are passed to the underlying HTTP request. This can be used to inject extra headers for examples. All `Request` options, except `method` and `body`, are allowed. |
| `options.retries`                                                                                                                                                              | [RetryConfig](../../lib/utils/retryconfig.md)                                                                                                                                  | :heavy_minus_sign:                                                                                                                                                             | Enables retrying HTTP requests under certain failure conditions.                                                                                                               |

### Response

**Promise\<[models.NativeSsoResponse](../../models/nativessoresponse.md)\>**

### Errors

| Error Type                  | Status Code                 | Content Type                |
| --------------------------- | --------------------------- | --------------------------- |
| errors.ResultError          | 400, 401, 403               | application/json            |
| errors.ResultError          | 500                         | application/json            |
| errors.AuthleteDefaultError | 4XX, 5XX                    | \*/\*                       |

## logout

The `/nativesso/logout` API is supposed to be used to support the concept of "logout from all applications"
in the context of [OpenID Connect Native SSO for Mobile Apps 1.0](https://openid.net/specs/openid-connect-native-sso-1_0.html)
(Native SSO). This is accomplished by deleting access/refresh token records associated with the
specified session ID. In Authlete's implementation, access/refresh token records can be associated
with a session ID only through the mechanism introduced by Native SSO.


### Example Usage

<!-- UsageSnippet language="typescript" operationID="native_sso_logout_api" method="post" path="/api/{serviceId}/nativesso/logout" -->
```typescript
import { Authlete } from "@authlete/typescript-sdk";

const authlete = new Authlete({
  bearer: process.env["AUTHLETE_BEARER"] ?? "",
});

async function run() {
  const result = await authlete.nativeSso.logout({
    serviceId: "<id>",
    nativeSsoLogoutRequest: {
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
import { nativeSsoLogout } from "@authlete/typescript-sdk/funcs/nativeSsoLogout.js";

// Use `AuthleteCore` for best tree-shaking performance.
// You can create one instance of it to use across an application.
const authlete = new AuthleteCore({
  bearer: process.env["AUTHLETE_BEARER"] ?? "",
});

async function run() {
  const res = await nativeSsoLogout(authlete, {
    serviceId: "<id>",
    nativeSsoLogoutRequest: {
      sessionId: "my-sid",
    },
  });
  if (res.ok) {
    const { value: result } = res;
    console.log(result);
  } else {
    console.log("nativeSsoLogout failed:", res.error);
  }
}

run();
```

### Parameters

| Parameter                                                                                                                                                                      | Type                                                                                                                                                                           | Required                                                                                                                                                                       | Description                                                                                                                                                                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `request`                                                                                                                                                                      | [operations.NativeSsoLogoutApiRequest](../../models/operations/nativessologoutapirequest.md)                                                                                   | :heavy_check_mark:                                                                                                                                                             | The request object to use for the request.                                                                                                                                     |
| `options`                                                                                                                                                                      | RequestOptions                                                                                                                                                                 | :heavy_minus_sign:                                                                                                                                                             | Used to set various options for making HTTP requests.                                                                                                                          |
| `options.fetchOptions`                                                                                                                                                         | [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request#options)                                                                                        | :heavy_minus_sign:                                                                                                                                                             | Options that are passed to the underlying HTTP request. This can be used to inject extra headers for examples. All `Request` options, except `method` and `body`, are allowed. |
| `options.retries`                                                                                                                                                              | [RetryConfig](../../lib/utils/retryconfig.md)                                                                                                                                  | :heavy_minus_sign:                                                                                                                                                             | Enables retrying HTTP requests under certain failure conditions.                                                                                                               |

### Response

**Promise\<[models.NativeSsoLogoutResponse](../../models/nativessologoutresponse.md)\>**

### Errors

| Error Type                  | Status Code                 | Content Type                |
| --------------------------- | --------------------------- | --------------------------- |
| errors.ResultError          | 400, 401, 403               | application/json            |
| errors.ResultError          | 500                         | application/json            |
| errors.AuthleteDefaultError | 4XX, 5XX                    | \*/\*                       |