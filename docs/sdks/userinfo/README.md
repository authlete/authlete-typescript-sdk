# Userinfo

## Overview

### Available Operations

* [process](#process) - Process UserInfo Request
* [issue](#issue) - Issue UserInfo Response

## process

This API gathers information about a user.
### Description
This API is supposed to be called from within the implementation of the [userinfo endpoint](https://openid.net/specs/openid-connect-core-1\_0.html#UserInfo)
of the authorization server in order to get information about the user that is associated with
an access token.
The response from `/auth/userinfo` API has various parameters. Among them, it is `action` parameter
that the authorization server implementation should check first because it denotes the next action
that the authorization server implementation should take. According to the value of `action`, the
service implementation must take the steps described below.
**INTERNAL\_SERVER\_ERROR**
When the value of `action` is `INTERNAL\_SERVER\_ERROR`, it means that the request from the authorization
server implementation was wrong or that an error occurred in Authlete. In either case, from the
viewpoint of the client application, it is an error on the server side. Therefore, the service
implementation should generate a response to the client application with HTTP status of "500 Internal
Server Error".
The value of `responseContent` is a string which describes the error in the format of [RFC 6750](https://datatracker.ietf.org/doc/html/rfc6750)
(OAuth 2.0 Bearer Token Usage) so the userinfo endpoint implementation can use the value of `responseContent`
as the value of`WWW-Authenticate` header.
The following is an example response which complies with RFC 6750. Note that OpenID Connect Core
1.0 requires that an error response from userinfo endpoint comply with RFC 6750. See [5.3.3. UserInfo
Response](https://openid.net/specs/openid-connect-core-1\_0.html#UserInfoError) for details.
```
HTTP/1.1 500 Internal Server Error
WWW-Authenticate: {responseContent}
Cache-Control: no-store
Pragma: no-cache
```
**BAD\_REQUEST**
When the value of `action` is `BAD\_REQUEST`, it means that the request from the client application
does not contain an access token (= the request from the authorization server implementation to
Authlete does not contain `token` parameter).
The value of `responseContent` is a string which describes the error in the format
of [RFC 6750](https://datatracker.ietf.org/doc/html/rfc6750) (OAuth 2.0 Bearer Token Usage) so the
userinfo endpoint implementation can use the value of `responseContent` as the value of`WWW-Authenticate`
header.
The following is an example response which complies with RFC 6750. Note that OpenID Connect Core
1.0 requires that an error response from userinfo endpoint comply with RFC 6750. See [5.3.3. UserInfo
Response](https://openid.net/specs/openid-connect-core-1\_0.html#UserInfoError) for details.
```
HTTP/1.1 400 Bad Request
WWW-Authenticate: {responseContent}
Cache-Control: no-store
Pragma: no-cache
```
**UNAUTHORIZED**
When the value of `action` is `UNAUTHORIZED`, it means that the access token does not exist, has
expired, or is not associated with any subject (= any user account).
The value of `responseContent` is a string which describes the error in the format of [RFC
6750](https://datatracker.ietf.org/doc/html/rfc6750) (OAuth 2.0 Bearer Token Usage) so the userinfo
endpoint implementation can use the value of `responseContent` as the value of`WWW-Authenticate`
header.
The following is an example response which complies with RFC 6750. Note that OpenID Connect Core
1.0 requires that an error response from userinfo endpoint comply with RFC 6750. See [5.3.3. UserInfo
Response](https://openid.net/specs/openid-connect-core-1\_0.html#UserInfoError) for details.
```
HTTP/1.1 401 Unauthorized
WWW-Authenticate: {responseContent}
Cache-Control: no-store
Pragma: no-cache
```
**FORBIDDEN**
When the value of `action` is `FORBIDDEN`, it means that the access token does not include the
`openid` scope.
The value of `responseContent` is a string which describes the error in the format of [RFC 6750](https://datatracker.ietf.org/doc/html/rfc6750)
(OAuth 2.0 Bearer Token Usage) so the userinfo endpoint implementation can use the value of `responseContent`
as the value of`WWW-Authenticate` header.
The following is an example response which complies with RFC 6750. Note that OpenID Connect Core
1.0 requires that an error response from userinfo endpoint comply with RFC 6750. See [5.3.3. UserInfo
Response](https://openid.net/specs/openid-connect-core-1\_0.html#UserInfoError) for details.
```
HTTP/1.1 403 Forbidden
WWW-Authenticate: {responseContent}
Cache-Control: no-store
Pragma: no-cache
```
**OK**
When the value of `action` is `OK`, it means that the access token which the client application
presented is valid. To be concrete, it means that the access token exists, has not expired, includes
the openid scope, and is associated with a subject (= a user account).
What the userinfo endpoint implementation should do next is to collect information about the subject
(user) from your database. The value of the `subject` is contained in the subject parameter in the
response from this API and the names of data, i.e., the claims names are contained in the claims
parameter in the response. For example, if the `subject` parameter is `joe123` and the claims
parameter is `[ "given\_name", "email" ]`, you need to extract information about joe123's given name
and email from your database.
Then, call Authlete's `/auth/userinfo/issue` API with the collected information and the access token
in order to make Authlete generate an ID token.
If an error occurred during the above steps, generate an error response to the client. The response
should comply with [RFC 6750](https://datatracker.ietf.org/doc/html/rfc6750). For example, if the
subject associated with the access token does not exist in your database any longer, you may feel
like generating a response like below.
```
HTTP/1.1 400 Bad Request
WWW-Authenticate: Bearer error="invalid\_token",
error\_description="The subject associated with the access token does not exist."
Cache-Control: no-store
Pragma: no-cache
```
Also, an error might occur on database access. If you treat the error as an internal server error,
then the response would be like the following.
```
HTTP/1.1 500 Internal Server Error
WWW-Authenticate: Bearer error="server\_error",
error\_description="Failed to extract information about the subject from the database."
Cache-Control: no-store
Pragma: no-cache
```


### Example Usage

<!-- UsageSnippet language="typescript" operationID="auth_userinfo_api" method="post" path="/api/{serviceId}/auth/userinfo" -->
```typescript
import { Authlete } from "@authlete/typescript-sdk";

const authlete = new Authlete({
  bearer: process.env["AUTHLETE_BEARER"] ?? "",
});

async function run() {
  const result = await authlete.userinfo.process({
    serviceId: "<id>",
    userinfoRequest: {
      token: "Ntm9MDb8WXQAevqrBkd84KTTHbYHVQrTjgUZCOWqEUI",
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
import { userinfoProcess } from "@authlete/typescript-sdk/funcs/userinfoProcess.js";

// Use `AuthleteCore` for best tree-shaking performance.
// You can create one instance of it to use across an application.
const authlete = new AuthleteCore({
  bearer: process.env["AUTHLETE_BEARER"] ?? "",
});

async function run() {
  const res = await userinfoProcess(authlete, {
    serviceId: "<id>",
    userinfoRequest: {
      token: "Ntm9MDb8WXQAevqrBkd84KTTHbYHVQrTjgUZCOWqEUI",
    },
  });
  if (res.ok) {
    const { value: result } = res;
    console.log(result);
  } else {
    console.log("userinfoProcess failed:", res.error);
  }
}

run();
```

### Parameters

| Parameter                                                                                                                                                                      | Type                                                                                                                                                                           | Required                                                                                                                                                                       | Description                                                                                                                                                                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `request`                                                                                                                                                                      | [operations.AuthUserinfoApiRequest](../../models/operations/authuserinfoapirequest.md)                                                                                         | :heavy_check_mark:                                                                                                                                                             | The request object to use for the request.                                                                                                                                     |
| `options`                                                                                                                                                                      | RequestOptions                                                                                                                                                                 | :heavy_minus_sign:                                                                                                                                                             | Used to set various options for making HTTP requests.                                                                                                                          |
| `options.fetchOptions`                                                                                                                                                         | [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request#options)                                                                                        | :heavy_minus_sign:                                                                                                                                                             | Options that are passed to the underlying HTTP request. This can be used to inject extra headers for examples. All `Request` options, except `method` and `body`, are allowed. |
| `options.retries`                                                                                                                                                              | [RetryConfig](../../lib/utils/retryconfig.md)                                                                                                                                  | :heavy_minus_sign:                                                                                                                                                             | Enables retrying HTTP requests under certain failure conditions.                                                                                                               |

### Response

**Promise\<[models.UserinfoResponse](../../models/userinforesponse.md)\>**

### Errors

| Error Type                  | Status Code                 | Content Type                |
| --------------------------- | --------------------------- | --------------------------- |
| errors.ResultError          | 400, 401, 403               | application/json            |
| errors.ResultError          | 500                         | application/json            |
| errors.AuthleteDefaultError | 4XX, 5XX                    | \*/\*                       |

## issue

This API generates an ID token.
### Description
This API is supposed to be called from within the implementation of the [userinfo endpoint](https://openid.net/specs/openid-connect-core-1\_0.html#UserInfo)
of the authorization server in order to generate an ID token. Before calling this API, a valid
response from `/auth/userinfo` API must be obtained. Then, call this API with the access token
contained in the response and the claims values of the user (subject) associated with the access
token. See **OK** written in the description of `/auth/userinfo` API for details.
The response from `/auth/userinfo/issue` API has various parameters. Among them, it is `action`
parameter that the authorization server implementation should check first because it denotes the
next action that the authorization server implementation should take. According to the value of
`action`, the service implementation must take the steps described below.
**INTERNAL\_SERVER\_ERROR**
When the value of `action` is `INTERNAL\_SERVER\_ERROR`, it means that the request from the authorization
server implementation was wrong or that an error occurred in Authlete. In either case, from the
viewpoint of the client application, it is an error on the server side. Therefore, the service
implementation should generate a response to the client application with HTTP status of "500 Internal
Server Error".
The parameter `responseContent` returns a string which describes the error in the format of [RFC
6750](https://datatracker.ietf.org/doc/html/rfc6750) (OAuth 2.0 Bearer Token Usage) so the userinfo
endpoint implementation can use the value of `responseContent` as the value of`WWW-Authenticate`
header.
The following is an example response which complies with RFC 6750. Note that OpenID Connect Core
1.0 requires that an error response from userinfo endpoint comply with RFC 6750. See [5.3.3. UserInfo
Response](https://openid.net/specs/openid-connect-core-1\_0.html#UserInfoError) for details.
```
HTTP/1.1 500 Internal Server Error
WWW-Authenticate: {responseContent}
Cache-Control: no-store
Pragma: no-cache
```
**BAD\_REQUEST**
When the value of `action` is `BAD\_REQUEST`, it means that the request from the client application
does not contain an access token (= the request from the authorization server implementation to
Authlete does not contain `token` parameter).
The parameter `responseContent` returns a string which describes the error in the format of [RFC
6750](https://datatracker.ietf.org/doc/html/rfc6750) (OAuth 2.0 Bearer Token Usage) so the userinfo
endpoint implementation can use the value of `responseContent` as the value of`WWW-Authenticate`
header.
The following is an example response which complies with RFC 6750. Note that OpenID Connect Core
1.0 requires that an error response from userinfo endpoint comply with RFC 6750. See [5.3.3. UserInfo
Response](https://openid.net/specs/openid-connect-core-1\_0.html#UserInfoError) for details.
```
HTTP/1.1 400 Bad Request
WWW-Authenticate: {responseContent}
Cache-Control: no-store
Pragma: no-cache
```
**UNAUTHORIZED**
When the value of `action` is `UNAUTHORIZED`, it means that the access token does not exist, has
expired, or is not associated with any subject (= any user account).
The parameter `responseContent` returns a string which describes the error in the format of [RFC
6750](https://datatracker.ietf.org/doc/html/rfc6750) (OAuth 2.0 Bearer Token Usage) so the userinfo
endpoint implementation can use the value of `responseContent` as the value of`WWW-Authenticate`
header.
The following is an example response which complies with RFC 6750. Note that OpenID Connect Core
1.0 requires that an error response from userinfo endpoint comply with RFC 6750. See [5.3.3. UserInfo
Response](https://openid.net/specs/openid-connect-core-1\_0.html#UserInfoError) for details.
```
HTTP/1.1 401 Unauthorized
WWW-Authenticate: {responseContent}
Cache-Control: no-store
Pragma: no-cache
```
**FORBIDDEN**
When the value of `action` is `FORBIDDEN`, it means that the access token does not include the
`openid` scope.
The parameter `responseContent` returns a string which describes the error in the format of [RFC
6750](https://datatracker.ietf.org/doc/html/rfc6750) (OAuth 2.0 Bearer Token Usage) so the userinfo
endpoint implementation can use the value of `responseContent` as the value of`WWW-Authenticate`
header.
The following is an example response which complies with RFC 6750. Note that OpenID Connect Core
1.0 requires that an error response from userinfo endpoint comply with RFC 6750. See [5.3.3. UserInfo
Response](https://openid.net/specs/openid-connect-core-1\_0.html#UserInfoError) for details.
```
HTTP/1.1 403 Forbidden
WWW-Authenticate: {responseContent}
Cache-Control: no-store
Pragma: no-cache
```
**JSON**
When the value of `action` is `JSON`, it means that the access token which the client application
presented is valid and an ID token was successfully generated in the format of JSON.
The userinfo endpoint implementation is expected to generate a response to the client application.
The content type of the response must be `application/json` and the response body must be an ID
token in JSON format.
The value of `responseContent` is the ID token in JSON format when `action` is `JSON`, so
a response to the client can be built like below.
```
HTTP/1.1 200 OK
Cache-Control: no-store
Pragma: no-cache
Content-Type: application/json;charset=UTF-8
{responseContent}
```
**JWT**
When the value of `action` is `JWT`, it means that the access token which the client application
presented is valid and an ID token was successfully generated in the format of JWT (JSON Web Token)
([RFC 7519](https://datatracker.ietf.org/doc/html/rfc7519)).
The userinfo endpoint implementation is expected to generate a response to the client application.
The content type of the response must be `application/jwt` and the response body must be an ID
token in JWT format.
The value of `responseContent` is the ID token in JSON format when `action` is `JWT`, so a response
to the client can be built like below.
```
HTTP/1.1 200 OK
Cache-Control: no-store
Pragma: no-cache
Content-Type: application/jwt
{responseContent}
```


### Example Usage

<!-- UsageSnippet language="typescript" operationID="auth_userinfo_issue_api" method="post" path="/api/{serviceId}/auth/userinfo/issue" -->
```typescript
import { Authlete } from "@authlete/typescript-sdk";

const authlete = new Authlete({
  bearer: process.env["AUTHLETE_BEARER"] ?? "",
});

async function run() {
  const result = await authlete.userinfo.issue({
    serviceId: "<id>",
    userinfoIssueRequest: {
      token: "Ntm9MDb8WXQAevqrBkd84KTTHbYHVQrTjgUZCOWqEUI",
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
import { userinfoIssue } from "@authlete/typescript-sdk/funcs/userinfoIssue.js";

// Use `AuthleteCore` for best tree-shaking performance.
// You can create one instance of it to use across an application.
const authlete = new AuthleteCore({
  bearer: process.env["AUTHLETE_BEARER"] ?? "",
});

async function run() {
  const res = await userinfoIssue(authlete, {
    serviceId: "<id>",
    userinfoIssueRequest: {
      token: "Ntm9MDb8WXQAevqrBkd84KTTHbYHVQrTjgUZCOWqEUI",
    },
  });
  if (res.ok) {
    const { value: result } = res;
    console.log(result);
  } else {
    console.log("userinfoIssue failed:", res.error);
  }
}

run();
```

### Parameters

| Parameter                                                                                                                                                                      | Type                                                                                                                                                                           | Required                                                                                                                                                                       | Description                                                                                                                                                                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `request`                                                                                                                                                                      | [operations.AuthUserinfoIssueApiRequest](../../models/operations/authuserinfoissueapirequest.md)                                                                               | :heavy_check_mark:                                                                                                                                                             | The request object to use for the request.                                                                                                                                     |
| `options`                                                                                                                                                                      | RequestOptions                                                                                                                                                                 | :heavy_minus_sign:                                                                                                                                                             | Used to set various options for making HTTP requests.                                                                                                                          |
| `options.fetchOptions`                                                                                                                                                         | [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request#options)                                                                                        | :heavy_minus_sign:                                                                                                                                                             | Options that are passed to the underlying HTTP request. This can be used to inject extra headers for examples. All `Request` options, except `method` and `body`, are allowed. |
| `options.retries`                                                                                                                                                              | [RetryConfig](../../lib/utils/retryconfig.md)                                                                                                                                  | :heavy_minus_sign:                                                                                                                                                             | Enables retrying HTTP requests under certain failure conditions.                                                                                                               |

### Response

**Promise\<[models.UserinfoIssueResponse](../../models/userinfoissueresponse.md)\>**

### Errors

| Error Type                  | Status Code                 | Content Type                |
| --------------------------- | --------------------------- | --------------------------- |
| errors.ResultError          | 400, 401, 403               | application/json            |
| errors.ResultError          | 500                         | application/json            |
| errors.AuthleteDefaultError | 4XX, 5XX                    | \*/\*                       |