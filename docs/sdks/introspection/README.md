# Introspection

## Overview

### Available Operations

* [process](#process) - Process Introspection Request
* [standardProcess](#standardprocess) - Process OAuth 2.0 Introspection Request

## process

This API gathers information about an access token.
### Description
This API is supposed to be called from within the implementations of protected resource endpoints
of the authorization server implementation in order to get information about the access token which
was presented by the client application.
In general, a client application accesses a protected resource endpoint of a service with an access
token, and the implementation of the endpoint checks whether the presented access token has enough
privileges (= scopes) to access the protected resource before returning the protected resource to
the client application. To achieve this flow, the endpoint implementation has to know detailed
information about the access token. Authlete `/auth/introspection` API can be used to get such information.
The response from `/auth/introspection` API has some parameters. Among them, it is `action` parameter
that the authorization server implementation should check first because it denotes the next action
that the authorization server implementation should take. According to the value of `action`, the
authorization server implementation must take the steps described below.
**INTERNAL\_SERVER\_ERROR**
When the value of `action` is `INTERNAL\_SERVER\_ERROR`, it means that the request from the authorization
server implementation was wrong or that an error occurred in Authlete.
In either case, from the viewpoint of the client application, it is an error on the server side.
Therefore, the service implementation should generate a response to the client application with
HTTP status of "500 Internal Server Error". Authlete recommends `application/json` as the content
type although OAuth 2.0 specification does not mention the format of the error response when the
redirect URI is not usable.
The value of `responseContent` is a string which describes the error in the format of
[RFC 6750](https://datatracker.ietf.org/doc/html/rfc6750) (OAuth 2.0 Bearer Token Usage), so if
the protected resource of the service implementation wants to return an error response to the client
application in the way that complies with RFC 6750 (in other words, if `accessTokenType` configuration
parameter of the service is Bearer), the value of `responseContent` can be used as the value of
`WWW-Authenticate` header.
The following is an example response which complies with RFC 6750.
```
HTTP/1.1 500 Internal Server Error
Content-Type: application/json
Cache-Control: no-store
Pragma: no-cache
{responseContent}
```
**BAD\_REQUEST**
When the value of `action` is `BAD\_REQUEST`, it means that the request from the client application
does not contain an access token (= the request from the authorization server implementation to
Authlete does not contain `token` request parameter).
A response with HTTP status of "400 Bad Request" must be returned to the client application and
the content type must be `application/json`.
The value of `responseContent` is a string which describes the error in the format of [RFC
6750](https://datatracker.ietf.org/doc/html/rfc6750) (OAuth 2.0 Bearer Token Usage), so if the
protected resource of the service implementation wants to return an error response to the client
application in the way that complies with RFC 6750 (in other words, if `accessTokenType` configuration
parameter of the service is `Bearer`), the value of `responseContent` can be used as the value of
`WWW-Authenticate` header.
The following is an example response which complies with RFC 6750.
```
HTTP/1.1 400 Bad Request
WWW-Authenticate: {responseContent}
Cache-Control: no-store
Pragma: no-cache
```
**UNAUTHORIZED**
When the value of `action` is `UNAUTHORIZED`, it means that the access token does not exist or has
expired.
The value of `responseContent` is a string which describes the error in the format of RFC
6750 (OAuth 2.0 Bearer Token Usage), so if the protected resource of the service implementation
wants to return an error response to the client application in the way that complies with [RFC
6750](https://datatracker.ietf.org/doc/html/rfc6750) (in other words, if `accessTokenType` configuration
parameter of the service is `Bearer`), the value of `responseContent` can be used as the value of
`WWW-Authenticate` header.
The following is an example response which complies with RFC 6750.
```
HTTP/1.1 401 Unauthorized
WWW-Authenticate: {responseContent}
Cache-Control: no-store
Pragma: no-cache
```
**FORBIDDEN**
When the value of `action` is `FORBIDDEN`, it means that the access token does not cover the required
scopes or that the subject associated with the access token is different from the subject contained
in the request.
A response with HTTP status of "400 Bad Request" must be returned to the client application and
the content type must be `application/json`.
The value of `responseContent` is a string which describes the error in the format of [RFC
6750](https://datatracker.ietf.org/doc/html/rfc6750) (OAuth 2.0 Bearer Token Usage), so if the
protected resource of the service implementation wants to return an error response to the client
application in the way that complies with RFC 6750 (in other words, if `accessTokenType` configuration
parameter of the service is Bearer), the value of `responseContent` can be used as the value of
`WWW-Authenticate` header.
The following is an example response which complies with RFC 6750.
```
HTTP/1.1 403 Forbidden
WWW-Authenticate: {responseContent}
Cache-Control: no-store
Pragma: no-cache
```
**OK**
When the value of `action` is `OK`, it means that the access token which the client application
presented is valid (= exists and has not expired).
The implementation of the protected resource endpoint is supposed to return the protected resource
to the client application.
When action is `OK`, the value of `responseContent` is `"Bearer error=\"invalid\_request\""`. This
is the simplest string which can be used as the value of `WWW-Authenticate` header to indicate
"400 Bad Request". The implementation of the protected resource endpoint may use this string to
tell the client application that the request was bad (e.g. in case necessary request parameters
for the protected resource endpoint are missing). However, in such a case, the implementation
should generate a more informative error message to help developers of client applications.
The following is an example error response which complies with RFC 6750.
```
HTTP/1.1 400 Bad Request
WWW-Authenticate: {responseContent}
Cache-Control: no-store
Pragma: no-cache
```
Basically, The value of `responseContent` is a string which describes the error in the format of
[RFC 6750](https://datatracker.ietf.org/doc/html/rfc6750) (OAuth 2.0 Bearer Token Usage). So, if
the service has selected `Bearer` as the value of `accessTokenType` configuration parameter, the
value of `responseContent` can be used directly as the value of `WWW-Authenticate` header. However,
if the service has selected another different token type, the service has to generate error messages
for itself.
\_**JWT-based access token**\_
Since version 2.1, Authlete provides a feature to issue access tokens in JWT format. This feature
can be enabled by setting a non-null value to the `accessTokenSignAlg` property of the service
(see the description of the Service class for details). `/api/auth/introspection` API can accept
access tokens in JWT format. However, note that the API does not return information contained in
a given JWT-based access token but returns information stored in the database record which corresponds
to the given JWT-based access token. Because attributes of the database record can be modified
after the access token is issued (for example, by using `/api/auth/token/update` API), information
returned by `/api/auth/introspection` API and information the given JWT-based access token holds
may be different.


### Example Usage

<!-- UsageSnippet language="typescript" operationID="auth_introspection_api" method="post" path="/api/{serviceId}/auth/introspection" -->
```typescript
import { Authlete } from "@authlete/typescript-sdk";

const authlete = new Authlete({
  bearer: process.env["AUTHLETE_BEARER"] ?? "",
});

async function run() {
  const result = await authlete.introspection.process({
    serviceId: "<id>",
    introspectionRequest: {
      token: "VFGsNK-5sXiqterdaR7b5QbRX9VTwVCQB87jbr2_xAI",
      scopes: [
        "history.read",
        "timeline.read",
      ],
      subject: "john",
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
import { introspectionProcess } from "@authlete/typescript-sdk/funcs/introspectionProcess.js";

// Use `AuthleteCore` for best tree-shaking performance.
// You can create one instance of it to use across an application.
const authlete = new AuthleteCore({
  bearer: process.env["AUTHLETE_BEARER"] ?? "",
});

async function run() {
  const res = await introspectionProcess(authlete, {
    serviceId: "<id>",
    introspectionRequest: {
      token: "VFGsNK-5sXiqterdaR7b5QbRX9VTwVCQB87jbr2_xAI",
      scopes: [
        "history.read",
        "timeline.read",
      ],
      subject: "john",
    },
  });
  if (res.ok) {
    const { value: result } = res;
    console.log(result);
  } else {
    console.log("introspectionProcess failed:", res.error);
  }
}

run();
```

### Parameters

| Parameter                                                                                                                                                                      | Type                                                                                                                                                                           | Required                                                                                                                                                                       | Description                                                                                                                                                                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `request`                                                                                                                                                                      | [operations.AuthIntrospectionApiRequest](../../models/operations/authintrospectionapirequest.md)                                                                               | :heavy_check_mark:                                                                                                                                                             | The request object to use for the request.                                                                                                                                     |
| `options`                                                                                                                                                                      | RequestOptions                                                                                                                                                                 | :heavy_minus_sign:                                                                                                                                                             | Used to set various options for making HTTP requests.                                                                                                                          |
| `options.fetchOptions`                                                                                                                                                         | [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request#options)                                                                                        | :heavy_minus_sign:                                                                                                                                                             | Options that are passed to the underlying HTTP request. This can be used to inject extra headers for examples. All `Request` options, except `method` and `body`, are allowed. |
| `options.retries`                                                                                                                                                              | [RetryConfig](../../lib/utils/retryconfig.md)                                                                                                                                  | :heavy_minus_sign:                                                                                                                                                             | Enables retrying HTTP requests under certain failure conditions.                                                                                                               |

### Response

**Promise\<[models.IntrospectionResponse](../../models/introspectionresponse.md)\>**

### Errors

| Error Type                  | Status Code                 | Content Type                |
| --------------------------- | --------------------------- | --------------------------- |
| errors.ResultError          | 400, 401, 403               | application/json            |
| errors.ResultError          | 500                         | application/json            |
| errors.AuthleteDefaultError | 4XX, 5XX                    | \*/\*                       |

## standardProcess

This API exists to help your authorization server provide its own introspection API which complies
with [RFC 7662](https://tools.ietf.org/html/rfc7662) (OAuth 2.0 Token Introspection).
### Description
This API is supposed to be called from within the implementations of the introspection endpoint
of your service. The authorization server implementation should retrieve the value of `action` from
the response and take the following steps according to the value.
In general, a client application accesses a protected resource endpoint of a service with an access
token, and the implementation of the endpoint checks whether the presented access token has enough
privileges (= scopes) to access the protected resource before returning the protected resource to
the client application. To achieve this flow, the endpoint implementation has to know detailed
information about the access token. Authlete `/auth/introspection` API can be used to get such information.
The response from `/auth/introspection` API has some parameters. Among them, it is `action` parameter
that the authorization server implementation should check first because it denotes the next action
that the authorization server implementation should take. According to the value of `action`, the
authorization server implementation must take the steps described below.
**INTERNAL\_SERVER\_ERROR**
When the value of `action` is `INTERNAL\_SERVER\_ERROR`, it means that the request from the authorization
server implementation was wrong or that an error occurred in Authlete.
In either case, from the viewpoint of the client application, it is an error on the server side.
Therefore, the service implementation should generate a response to the client application with
HTTP status of "500 Internal Server Error".
The value of `responseContent` is a JSON string which describes the error, so it can be used
as the entity body of the response if you want. Note that, however, [RFC 7662](https://datatracker.ietf.org/doc/html/rfc7662) does not mention anything about the response
body of error responses.
The following illustrates an example response which the introspection endpoint of the authorization
server implementation generates and returns to the client application.
```
HTTP/1.1 500 Internal Server Error
Content-Type: application/json
{responseContent}
```
**BAD\_REQUEST**
When the value of `action` is `BAD\_REQUEST`, it means that the request from the client application
is invalid. This happens when the request from the client did not include the token request parameter.
See "[2.1. Introspection Request](https://datatracker.ietf.org/doc/html/rfc7662#section-2.1)" in
RFC 7662 for details about requirements for introspection requests.
The HTTP status of the response returned to the client application should be "400 Bad Request".
The value of `responseContent` is a JSON string which describes the error, so it can be used
as the entity body of the response if you want. Note that, however, [RFC 7662](https://datatracker.ietf.org/doc/html/rfc7662)
does not mention anything about the response body of error responses.
The following illustrates an example response which the introspection endpoint of the authorization
server implementation generates and returns to the client application.
```
HTTP/1.1 400 Bad Request
Content-Type: application/json
{responseContent}
```
**OK**
When the value of `action` is `OK`, the request from the client application is valid.
The HTTP status of the response returned to the client application must be "200 OK" and its content
type must be `application/json`.
The value of `responseContent` is a JSON string which complies with the introspection response
defined in "2.2. Introspection Response" in RFC7662.
The following illustrates the response which the introspection endpoint of your authorization server
implementation should generate and return to the client application.
```
HTTP/1.1 200 OK
Content-Type: application/json
{responseContent}
```
Note that RFC 7662 says \_"To prevent token scanning attacks, **the endpoint MUST also require some
form of authorization to access this endpoint**"\_. This means that you have to protect your introspection
endpoint in some way or other. Authlete does not care about how your introspection endpoint is protected.
In most cases, as mentioned in RFC 7662, "401 Unauthorized" is a proper response when an introspection
request does not satisfy authorization requirements imposed by your introspection endpoint.


### Example Usage

<!-- UsageSnippet language="typescript" operationID="auth_introspection_standard_api" method="post" path="/api/{serviceId}/auth/introspection/standard" -->
```typescript
import { Authlete } from "@authlete/typescript-sdk";

const authlete = new Authlete({
  bearer: process.env["AUTHLETE_BEARER"] ?? "",
});

async function run() {
  const result = await authlete.introspection.standardProcess({
    serviceId: "<id>",
    standardIntrospectionRequest: {
      parameters: "token=VFGsNK-5sXiqterdaR7b5QbRX9VTwVCQB87jbr2_xAI&token_type_hint=access_token",
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
import { introspectionStandardProcess } from "@authlete/typescript-sdk/funcs/introspectionStandardProcess.js";

// Use `AuthleteCore` for best tree-shaking performance.
// You can create one instance of it to use across an application.
const authlete = new AuthleteCore({
  bearer: process.env["AUTHLETE_BEARER"] ?? "",
});

async function run() {
  const res = await introspectionStandardProcess(authlete, {
    serviceId: "<id>",
    standardIntrospectionRequest: {
      parameters: "token=VFGsNK-5sXiqterdaR7b5QbRX9VTwVCQB87jbr2_xAI&token_type_hint=access_token",
    },
  });
  if (res.ok) {
    const { value: result } = res;
    console.log(result);
  } else {
    console.log("introspectionStandardProcess failed:", res.error);
  }
}

run();
```

### Parameters

| Parameter                                                                                                                                                                      | Type                                                                                                                                                                           | Required                                                                                                                                                                       | Description                                                                                                                                                                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `request`                                                                                                                                                                      | [operations.AuthIntrospectionStandardApiRequest](../../models/operations/authintrospectionstandardapirequest.md)                                                               | :heavy_check_mark:                                                                                                                                                             | The request object to use for the request.                                                                                                                                     |
| `options`                                                                                                                                                                      | RequestOptions                                                                                                                                                                 | :heavy_minus_sign:                                                                                                                                                             | Used to set various options for making HTTP requests.                                                                                                                          |
| `options.fetchOptions`                                                                                                                                                         | [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request#options)                                                                                        | :heavy_minus_sign:                                                                                                                                                             | Options that are passed to the underlying HTTP request. This can be used to inject extra headers for examples. All `Request` options, except `method` and `body`, are allowed. |
| `options.retries`                                                                                                                                                              | [RetryConfig](../../lib/utils/retryconfig.md)                                                                                                                                  | :heavy_minus_sign:                                                                                                                                                             | Enables retrying HTTP requests under certain failure conditions.                                                                                                               |

### Response

**Promise\<[models.StandardIntrospectionResponse](../../models/standardintrospectionresponse.md)\>**

### Errors

| Error Type                  | Status Code                 | Content Type                |
| --------------------------- | --------------------------- | --------------------------- |
| errors.ResultError          | 400, 401, 403               | application/json            |
| errors.ResultError          | 500                         | application/json            |
| errors.AuthleteDefaultError | 4XX, 5XX                    | \*/\*                       |