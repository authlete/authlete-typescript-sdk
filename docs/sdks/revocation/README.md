# Revocation

## Overview

### Available Operations

* [process](#process) - Process Revocation Request

## process

This API revokes access tokens and refresh tokens.
### Description
This API is supposed to be called from within the implementation of the revocation endpoint ([RFC
7009](tools.ietf.org/html/rfc7009)) of the authorization server implementation in order to revoke
access tokens and refresh tokens.
The response from `/auth/revocation` API has some parameters. Among them, it is `action` parameter
that the authorization server implementation should check first because it denotes the next action
that the authorization server implementation should take. According to the value of `action`, the
authorization server implementation must take the steps described below.
**INTERNAL\_SERVER\_ERROR**
When the value of `action` is `INTERNAL\_SERVER\_ERROR`, it means that the request from the authorization
server implementation was wrong or that an error occurred in Authlete.
In either case, from the viewpoint of the client application, it is an error on the server side.
Therefore, the service implementation should generate a response to the client application with
HTTP status of "500 Internal Server Error".
The value of `responseContent` is a JSON string which describes the error, so it can be
used as the entity body of the response.
The following illustrates the response which the service implementation should generate and return
to the client application.
```
HTTP/1.1 500 Internal Server Error
Content-Type: application/json
Cache-Control: no-store
Pragma: no-cache
{responseContent}
```
**INVALID\_CLIENT**
When the value of `action` is `INVALID\_CLIENT`, it means that authentication of the client failed.
In this case, the HTTP status of the response to the client application is either "400 Bad Request"
or "401 Unauthorized". The description about `invalid\_client` shown below is an excerpt from [RFC
6749](https://datatracker.ietf.org/doc/html/rfc6749).
`invalid\_client`
> Client authentication failed (e.g., unknown client, no client authentication included, or unsupported
authentication method). The authorization server MAY return an HTTP 401 (Unauthorized) status code
to indicate which HTTP authentication schemes are supported. If the client attempted to authenticate
via the `Authorization` request header field, the authorization server MUST respond with an HTTP
401 (Unauthorized) status code and include the `WWW-Authenticate` response header field matching
the authentication scheme used by the client.
In either case, the value of `responseContent` is a JSON string which can be used as the entity
body of the response to the client application.
The following illustrates the response which the service implementation should generate and return
to the client application.
```
HTTP/1.1 400 Bad Request
Content-Type: application/json
Cache-Control: no-store
Pragma: no-cache
{responseContent}
```
```
HTTP/1.1 401 Unauthorized
WWW-Authenticate: {challenge}
Content-Type: application/json
Cache-Control: no-store
Pragma: no-cache
{responseContent}
```
**BAD\_REQUEST**
When the value of `action` is `BAD\_REQUEST`, it means that the request from the client application
is invalid.
The HTTP status of the response returned to the client application must be "400 Bad Request" and
the content type must be `application/json`. [RFC 7009](https://datatracker.ietf.org/doc/html/rfc7009),
[2.2.1. Error Respons](https://datatracker.ietf.org/doc/html/rfc7009#section-2.2.1) states "The
error presentation conforms to the definition in [Section 5.2](https://datatracker.ietf.org/doc/html/rfc6749#section-5.2)
of [[RFC 6749](https://datatracker.ietf.org/doc/html/rfc6749)]."
The value of `responseContent` is a JSON string which describes the error, so it can be used
as the entity body of the response.
The following illustrates the response which the authorization server implementation should generate
and return to the client application.
```
HTTP/1.1 400 Bad Request
Content-Type: application/json
Cache-Control: no-store
Pragma: no-cache
{responseContent}
```
**OK**
When the value of `action` is `OK`, it means that the request from the client application is valid
and the presented token has been revoked successfully or if the client submitted an invalid token.
Note that invalid tokens do not cause an error. See [2.2. Revocation Response](https://datatracker.ietf.org/doc/html/rfc7009#section-2.2) for details.
The HTTP status of the response returned to the client application must be 200 OK.
If the original request from the client application contains callback request parameter and its
value is not empty, the content type should be `application/javascript` and the content should be
a JavaScript snippet for JSONP.
The value of `responseContent` is JavaScript snippet if the original request from the client application
contains callback request parameter and its value is not empty. Otherwise, the value of `responseContent`
is `null`.
```
HTTP/1.1 200 OK
Content-Type: application/javascript
Cache-Control: no-store
Pragma: no-cache
{responseContent}
```


### Example Usage

<!-- UsageSnippet language="typescript" operationID="auth_revocation_api" method="post" path="/api/{serviceId}/auth/revocation" -->
```typescript
import { Authlete } from "@authlete/typescript-sdk";

const authlete = new Authlete({
  bearer: process.env["AUTHLETE_BEARER"] ?? "",
});

async function run() {
  const result = await authlete.revocation.process({
    serviceId: "<id>",
    revocationRequest: {
      parameters: "VFGsNK-5sXiqterdaR7b5QbRX9VTwVCQB87jbr2_xAI&token_type_hint=access_token",
      clientId: "26478243745571",
      clientSecret: "gXz97ISgLs4HuXwOZWch8GEmgL4YMvUJwu3er_kDVVGcA0UOhA9avLPbEmoeZdagi9yC_-tEiT2BdRyH9dbrQQ",
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
import { revocationProcess } from "@authlete/typescript-sdk/funcs/revocationProcess.js";

// Use `AuthleteCore` for best tree-shaking performance.
// You can create one instance of it to use across an application.
const authlete = new AuthleteCore({
  bearer: process.env["AUTHLETE_BEARER"] ?? "",
});

async function run() {
  const res = await revocationProcess(authlete, {
    serviceId: "<id>",
    revocationRequest: {
      parameters: "VFGsNK-5sXiqterdaR7b5QbRX9VTwVCQB87jbr2_xAI&token_type_hint=access_token",
      clientId: "26478243745571",
      clientSecret: "gXz97ISgLs4HuXwOZWch8GEmgL4YMvUJwu3er_kDVVGcA0UOhA9avLPbEmoeZdagi9yC_-tEiT2BdRyH9dbrQQ",
    },
  });
  if (res.ok) {
    const { value: result } = res;
    console.log(result);
  } else {
    console.log("revocationProcess failed:", res.error);
  }
}

run();
```

### Parameters

| Parameter                                                                                                                                                                      | Type                                                                                                                                                                           | Required                                                                                                                                                                       | Description                                                                                                                                                                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `request`                                                                                                                                                                      | [operations.AuthRevocationApiRequest](../../models/operations/authrevocationapirequest.md)                                                                                     | :heavy_check_mark:                                                                                                                                                             | The request object to use for the request.                                                                                                                                     |
| `options`                                                                                                                                                                      | RequestOptions                                                                                                                                                                 | :heavy_minus_sign:                                                                                                                                                             | Used to set various options for making HTTP requests.                                                                                                                          |
| `options.fetchOptions`                                                                                                                                                         | [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request#options)                                                                                        | :heavy_minus_sign:                                                                                                                                                             | Options that are passed to the underlying HTTP request. This can be used to inject extra headers for examples. All `Request` options, except `method` and `body`, are allowed. |
| `options.retries`                                                                                                                                                              | [RetryConfig](../../lib/utils/retryconfig.md)                                                                                                                                  | :heavy_minus_sign:                                                                                                                                                             | Enables retrying HTTP requests under certain failure conditions.                                                                                                               |

### Response

**Promise\<[models.RevocationResponse](../../models/revocationresponse.md)\>**

### Errors

| Error Type                  | Status Code                 | Content Type                |
| --------------------------- | --------------------------- | --------------------------- |
| errors.ResultError          | 400, 401, 403               | application/json            |
| errors.ResultError          | 500                         | application/json            |
| errors.AuthleteDefaultError | 4XX, 5XX                    | \*/\*                       |