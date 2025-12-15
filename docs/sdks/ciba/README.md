# Ciba

## Overview

### Available Operations

* [processAuthentication](#processauthentication) - Process Backchannel Authentication Request
* [issue](#issue) - Issue Backchannel Authentication Response
* [fail](#fail) - Fail Backchannel Authentication Request
* [complete](#complete) - Complete Backchannel Authentication

## processAuthentication

This API parses request parameters of a [backchannel authentication request](https://openid.net/specs/openid-client-initiated-backchannel-authentication-core-1\_0.html#auth\_request)
and returns necessary data for the authorization server implementation to process the backchannel
authentication request further.
### Description
This API is supposed to be called from within the implementation of the [backchannel authentication
endpoint](https://openid.net/specs/openid-client-initiated-backchannel-authentication-core-1\_0.html#auth\_backchannel\_endpoint)
of the service. The endpoint implementation must extract the request parameters from the
backchannel authentication request from the client application and pass them as the value of parameters
request parameter for Authlete's `/backchannel/authentication` API.
The value of parameters is the entire entity body (which is formatted in `application/x-www-form-urlencoded`)
of the request from the client application.
The following code snippet is an example in JAX-RS showing how to extract request parameters from
the backchannel authentication request.
```java
@POST
@Consumes(MediaType.APPLICATION\_FORM\_URLENCODED)
public Response post(String parameters)
{
// 'parameters' is the entity body of the backchannel authentication request.
......
}
```
The endpoint implementation does not have to parse the request parameters from the client application
because Authlete's `/backchannel/authentication` API does it.
The response from `/backchannel/authentication` API has various parameters. Among them, it is `action`
parameter that the authorization server implementation should check first because it denotes the
next action that the authorization server implementation should take. According to the value of
`action`, the service implementation must take the steps described below.
**INTERNAL\_SERVER\_ERROR**
When the value of `action` is `INTERNAL\_SERVER\_ERROR`, it means that the request from the authorization
server implementation was wrong or that an error occurred in Authlete.
In either case, from the viewpoint of the client application, it is an error on the server side.
Therefore, the service implementation should generate a response to the client application with
HTTP status of "500 Internal Server Error" and `application/json`.
The value of `responseContent` is a JSON string which describes the error, so it can be used
as the entity body of the response.
The following illustrates the response which the service implementation should generate and return
to the client application.
```
HTTP/1.1 500 Internal Server Error
Content-Type: application/json
Cache-Control: no-store
Pragma: no-cache
{responseContent}
```
**BAD\_REQUEST**
When the value of `action` is `BAD\_REQUEST`, it means that the request from the client application
is invalid.
The authorization server implementation should generate a response to the client application with
"400 Bad Request" and `application/json`.
The value of `responseContent` is a JSON string which describes the error, so it can be used as
the entity body of the response.
The following illustrates the response which the service implementation should generate and return
to the client application.
```
HTTP/1.1 400 Bad Request
Content-Type: application/json
Cache-Control: no-store
Pragma: no-cache
{responseContent}
```
**UNAUTHORIZED**
When the value of `action` is `UNAUTHORIZED`, it means that client authentication of the backchannel
authentication request failed. Note that client authentication is always required at the backchannel
authentication endpoint. This implies that public clients are not allowed to use the backchannel
authentication endpoint.
The authorization server implementation should generate a response to the client application with
"401 Unauthorized" and `application/json`.
The value of `responseContent` is a JSON string which describes the error, so it can be used as
the entity body of the response.
The following illustrates the response which the service implementation must generate and return
to the client application.
```
HTTP/1.1 401 Unauthorized
WWW-Authenticate: (challenge)
Content-Type: application/json
Cache-Control: no-store
Pragma: no-cache
{responseContent}
```
**USER\_IDENTIFICATION**
When the value of `action` is `USER\_IDENTIFICATION`, it means that the backchannel authentication
request from the client application is valid. The authorization server implementation has to follow
the steps below.
[1] END-USER IDENTIFICATION
The first step is to determine the subject (= unique identifier) of the end-user from whom the
client application wants to get authorization.
According to the CIBA specification, a backchannel authentication request contains one (and only
one) of the `login\_hint\_token`, `id\_token\_hint` and `login\_hint` request parameters as a hint
by which the authorization server identifies the subject of an end-user.
The authorization server implementation can know which hint is included in the backchannel authentication
request by the `hintType` parameter. For example, when the value of the parameter `LOGIN\_HINT`,
it means that the backchannel authentication request contains the `login\_hint` request parameter
as a hint.
The value of the `hint` parameter is the value of the hint. For example, when the value of the
`hintType` parameter is `LOGIN\_HINT`, The value of the `hint` parameter is the value of the `login\_hint`
request parameter.
It is up to the authorization server implementation how to determine the subject of the end-user
from the hint. Only when the `id\_token\_hint` request parameter is used, authorization server
implementation can use the sub response parameter, which holds the value of the sub claim in the
`id\_token\_hint` request parameter.
[2] END-USER IDENTIFICATION ERROR
There are some cases where the authorization server implementation encounters an error during
the user identification process. In any error case, the service implementation has to return an
HTTP response with the error response parameter to the client application. The following is an
example of such error responses.
```
HTTP/1.1 400 Bad Request
Content-Type: application/json
Cache-Control: no-store
Pragma: no-cache
{ "error":"unknown\_user\_id" }
```
Authlete provides `/backchannel/authentication/fail` API that builds the response body (JSON)
of an error response. However, because it is easy to build an error response manually, you may
choose not to call the API. One good thing in using the API is that the API call can trigger
deletion of the ticket which has been issued from Authlete's `/backchannel/authentication` API.
If you don't call `/backchannel/authentication/fail` API, the ticket will continue to exist in
the database until it is cleaned up by the batch program after the ticket expires.
Possible error cases that the authorization server implementation itself has to handle are as
follows. Other error cases have already been covered by `/backchannel/authentication` API.
- `expired\_login\_hint\_token`
The authorization server implementation detected that the hint presented by the `login\_hint\_token`
request parameter has expired.
Note that the format of `login\_hint\_token` is not described in the CIBA Core spec at all and
so there is no consensus on how to detect expiration of `login\_hint\_token`. Interpretation
of `login\_hint\_token` is left to each authorization server implementation.
- `unknown\_user\_id`
The authorization server implementation could not determine the subject of the end-user by
the presented hint.
- `unauthorized\_client`
The authorization server implementation has custom rules to reject backchannel authentication
requests from some particular clients and found that the client which has made the backchannel
authentication request is one of the particular clients.
Note that `/backchannel/authentication` API does not return `action=USER\_IDENTIFICATION` in
cases where the client does not exist or client authentication has failed. Therefore, the
authorization server implementation will never have to use the error code `unauthorized\_client`
unless the server has intentionally implemented custom rules to reject backchannel authentication
requests based on clients.
- `missing\_user\_code`
The authorization server implementation has custom rules to require that a backchannel authentication
request include a user code for some particular users and found that the user identified by
the hint is one of the particular users.
Note that `/backchannel/authentication` API does not return `action=USER\_IDENTIFICATION` when
both the `backchannel\_user\_code\_parameter\_supported` metadata of the server and the
`backchannel\_user\_code\_parameter` metadata of the client are true and the backchannel authentication
request does not include the user\_code request parameter. In this case, `/backchannel/authentication`
API returns action=BAD\_REQUEST with JSON containing `"error":"missing\_user\_code"`. Therefore,
the authorization server implementation will never have to use the error code `missing\_user\_code`
unless the server has intentionally implemented custom rules to require a user code based
on users even in the case where the `backchannel\_user\_code\_parameter` metadata of the client
which has made the backchannel authentication request is `false`.
- `invalid\_user\_code`
The authorization server implementation detected that the presented user code is invalid.
Note that the format of user\_code is not described in the CIBA Core spec at all and so there
is no consensus on how to judge whether a user code is valid or not. It is up to each authorization
server implementation how to handle user codes.
- `invalid\_binding\_message`
The authorization server implementation detected that the presented binding message is invalid.
Note that the format of binding\_message is not described in the CIBA Core spec at all and
so there is no consensus on how to judge whether a binding message is valid or not. It is
up to each authorization server implementation how to handle binding messages.
- `invalid\_target`
The authorization server implementation rejects the requested target resources.
The error code invalid\_target is from "Resource Indicators for OAuth 2.0". The specification
defines the resource request parameter. By using the parameter, client applications can request
target resources that should be bound to the access token being issued. If the authorization
server wants to reject the request, call `/backchannel/authentication/fail` API with `INVALID\_TARGET`.
- `access\_denined`
The authorization server implementation has custom rules to reject backchannel authentication
requests without asking the end-user and respond to the client as if the end-user had rejected
the request in some particular cases and found that the backchannel authentication request
is one of the particular cases.
The authorization server implementation will never have to use the error code `access\_denied`
at this timing unless the server has intentionally implemented custom rules to reject backchannel
authentication requests without asking the end-user and respond to the client as if the end-user
had rejected the request.
[3] AUTH\_REQ\_ID ISSUE
If the authorization server implementation has successfully determined the subject of the end-user,
the next action is to return an HTTP response to the client application which contains `auth\_req\_id`.
Authlete provides `/backchannel/authentication/issue` API which generates a JSON containing `auth\_req\_id`,
so, your next action is (1) call the API, (2) receive the response from the API, (3) build a response
to the client application using the content of the API response, and (4) return the response to
the client application. See the description of `/backchannel/authentication/issue` API for details.
[4] END-USER AUTHENTICATION AND AUTHORIZATION
After sending a JSON containing `auth\_req\_id` back to the client application, the service implementation
starts to communicate with an authentication device of the end-user. It is assumed that end-user
authentication is performed on the authentication device and the end-user confirms the content of
the backchannel authentication request and grants authorization to the client application if everything
is okay. The authorization server implementation must be able to receive the result of the end-user
authentication and authorization from the authentication device.
How to communicate with an authentication device and achieve end-user authentication and authorization
is up to each authorization server implementation, but the following request parameters of the backchannel
authentication request should be taken into consideration in any implementation.
- `acr\_values`
A backchannel authentication request may contain an array of ACRs (Authentication Context Class
References) in preference order. If multiple authentication devices are registered for the end-user,
the authorization server implementation should take the ACRs into consideration when selecting
the best authentication device.
- `scope`
A backchannel authentication request always contains a list of scopes. At least, `openid` is
included in the list (otherwise `/backchannel/authentication` API returns `action=BAD\_REQUEST`).
It would be better to show the requested scopes to the end-user on the authentication device
or somewhere appropriate.
If the scope request parameter contains `address`, `email`, `phone` and/or `profile`, they are
interpreted as defined in "5.4. Requesting Claims using Scope Values of OpenID Connect Core 1.0".
That is, they are expanded into a list of claim names. The claimNames parameter returns the expanded
result.
- `binding\_message`
A backchannel authentication request may contain a binding message. It is a human readable identifier
or message intended to be displayed on both the consumption device (client application) and the
authentication device.
- `user\_code`
A backchannel authentication request may contain a user code. It is a secret code, such as password
or pin, known only to the end-user but verifiable by the authorization server. The user code should
be used to authorize sending a request to the authentication device.
[5] END-USER AUTHENTICATION AND AUTHORIZATION COMPLETION
After receiving the result of end-user authentication and authorization, the authorization server
implementation must call Authlete's `/backchannel/authentication/complete` API to tell Authlete
the result and pass necessary data so that Authlete can generate an ID token, an access token and
optionally a refresh token. See the description of the API for details.
[6] CLIENT NOTIFICATION
When the backchannel token delivery mode is either `ping` or `push`, the authorization server implementation
must send a notification to the pre-registered notification endpoint of the client after the end-user
authentication and authorization. In this case, the `action` parameter in a response from `/backchannel/authentication/complete`
API is `NOTIFICATION`. See the description of `/backchannel/authentication/complete` API for details.
[7] TOKEN REQUEST
When the backchannel token delivery mode is either `ping` or `poll`, the client application will make
a token request to the token endpoint to get an ID token, an access token and optionally a refresh
token.
A token request that corresponds to a backchannel authentication request uses `urn:openid:params:grant-type:ciba`
as the value of the `grant\_type` request parameter. Authlete's `/auth/token` API recognizes the
grant type automatically and behaves properly, so the existing token endpoint implementation does
not have to be changed to support CIBA.


### Example Usage

<!-- UsageSnippet language="typescript" operationID="backchannel_authentication_api" method="post" path="/api/{serviceId}/backchannel/authentication" -->
```typescript
import { Authlete } from "@authlete/typescript-sdk";

const authlete = new Authlete({
  bearer: process.env["AUTHLETE_BEARER"] ?? "",
});

async function run() {
  const result = await authlete.ciba.processAuthentication({
    serviceId: "<id>",
    backchannelAuthenticationRequest: {
      parameters: "login_hint=john&scope=openid&client_notification_token=my-client-notification-token&user_code=my-user-code",
      clientId: "26862190133482",
      clientSecret: "8J9pAEX6IQw7lYtYGsc_s9N4jlEz_DfkoCHIswJjFjfgKZX-nC4EvKtaHXcP9mHBfS7IU4jytjSZZpaK9UJ77A",
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
import { cibaProcessAuthentication } from "@authlete/typescript-sdk/funcs/cibaProcessAuthentication.js";

// Use `AuthleteCore` for best tree-shaking performance.
// You can create one instance of it to use across an application.
const authlete = new AuthleteCore({
  bearer: process.env["AUTHLETE_BEARER"] ?? "",
});

async function run() {
  const res = await cibaProcessAuthentication(authlete, {
    serviceId: "<id>",
    backchannelAuthenticationRequest: {
      parameters: "login_hint=john&scope=openid&client_notification_token=my-client-notification-token&user_code=my-user-code",
      clientId: "26862190133482",
      clientSecret: "8J9pAEX6IQw7lYtYGsc_s9N4jlEz_DfkoCHIswJjFjfgKZX-nC4EvKtaHXcP9mHBfS7IU4jytjSZZpaK9UJ77A",
    },
  });
  if (res.ok) {
    const { value: result } = res;
    console.log(result);
  } else {
    console.log("cibaProcessAuthentication failed:", res.error);
  }
}

run();
```

### Parameters

| Parameter                                                                                                                                                                      | Type                                                                                                                                                                           | Required                                                                                                                                                                       | Description                                                                                                                                                                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `request`                                                                                                                                                                      | [operations.BackchannelAuthenticationApiRequest](../../models/operations/backchannelauthenticationapirequest.md)                                                               | :heavy_check_mark:                                                                                                                                                             | The request object to use for the request.                                                                                                                                     |
| `options`                                                                                                                                                                      | RequestOptions                                                                                                                                                                 | :heavy_minus_sign:                                                                                                                                                             | Used to set various options for making HTTP requests.                                                                                                                          |
| `options.fetchOptions`                                                                                                                                                         | [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request#options)                                                                                        | :heavy_minus_sign:                                                                                                                                                             | Options that are passed to the underlying HTTP request. This can be used to inject extra headers for examples. All `Request` options, except `method` and `body`, are allowed. |
| `options.retries`                                                                                                                                                              | [RetryConfig](../../lib/utils/retryconfig.md)                                                                                                                                  | :heavy_minus_sign:                                                                                                                                                             | Enables retrying HTTP requests under certain failure conditions.                                                                                                               |

### Response

**Promise\<[models.BackchannelAuthenticationResponse](../../models/backchannelauthenticationresponse.md)\>**

### Errors

| Error Type                  | Status Code                 | Content Type                |
| --------------------------- | --------------------------- | --------------------------- |
| errors.ResultError          | 400, 401, 403               | application/json            |
| errors.ResultError          | 500                         | application/json            |
| errors.AuthleteDefaultError | 4XX, 5XX                    | \*/\*                       |

## issue

This API prepares JSON that contains an `auth\_req\_id`. The JSON should be used as the response body
of the response which is returned to the client from the [backchannel authentication endpoint](https://openid.net/specs/openid-client-initiated-backchannel-authentication-core-1\_0.html#auth\_backchannel\_endpoint)
### Description
This API is supposed to be called from within the implementation of the backchannel authentication
endpoint of the service in order to generate a successful response to the client application.
The description of the `/backchannel/authentication` API describes the timing when this API should
be called and the meaning of request parameters. See [AUTH\_REQ\_ID ISSUE] in `USER\_IDENTIFICATION`.
The response from `/backchannel/authentication/issue` API has some parameters. Among them, it is
`action` parameter that the authorization server implementation should check first because it denotes
the next `action` that the authorization server implementation should take. According to the value
of `action`, the authorization server implementation must take the steps described below.
```java
@POST
@Consumes(MediaType.APPLICATION\_FORM\_URLENCODED)
public Response post(String parameters)
{
// 'parameters' is the entity body of the backchannel authentication request.
......
}
```
The endpoint implementation does not have to parse the request parameters from the client application
because Authlete's `/backchannel/authentication` API does it.
The response from `/backchannel/authentication` API has various parameters. Among them, it is `action`
parameter that the authorization server implementation should check first because it denotes the
next action that the authorization server implementation should take. According to the value of
`action`, the service implementation must take the steps described below.
**INTERNAL\_SERVER\_ERROR**
When the value of `action` is `INTERNAL\_SERVER\_ERROR`, it means that the request from the authorization
server implementation was wrong or that an error occurred in Authlete.
In either case, from the viewpoint of the client application, it is an error on the server side.
Therefore, the service implementation should generate a response to the client application with
HTTP status of "500 Internal Server Error" and `application/json`.
The value of `responseContent` is a JSON string which describes the error, so it can be used as
the entity body of the response.
The following illustrates the response which the service implementation should generate and return
to the client application.
```
HTTP/1.1 500 Internal Server Error
Content-Type: application/json
Cache-Control: no-store
Pragma: no-cache
{responseContent}
```
**INVALID\_TICKET**
When the value of `action` is `INVALID\_TICKET`, it means that the ticket included in the API call
was invalid. For example, it does not exist or has expired.
From a viewpoint of the client application, this is an error on the server side. Therefore, the
authorization server implementation should generate a response to the client application with
"500 Internal Server Error" and `application/json`.
You can build an error response in the same way as shown in the description for the case of `INTERNAL\_SERVER\_ERROR`.
**OK**
When the value of `action` is `OK`, it means that Authlete has succeeded in preparing JSON that
contains an `auth\_req\_id`. The JSON should be used as the response body of the response that is
returned to the client from the backchannel authentication endpoint. `responseContent` contains
the JSON.
The following illustrates the response which the authorization server implementation should generate
and return to the client application.
```
HTTP/1.1 200 OK
Content-Type: text/html;charset=UTF-8
Cache-Control: no-store
Pragma: no-cache
{responseContent}
```


### Example Usage

<!-- UsageSnippet language="typescript" operationID="backchannel_authentication_issue_api" method="post" path="/api/{serviceId}/backchannel/authentication/issue" -->
```typescript
import { Authlete } from "@authlete/typescript-sdk";

const authlete = new Authlete({
  bearer: process.env["AUTHLETE_BEARER"] ?? "",
});

async function run() {
  const result = await authlete.ciba.issue({
    serviceId: "<id>",
    backchannelAuthenticationIssueRequest: {
      ticket: "NFIHGx_btVrWmtAD093D-87JxvT4DAtuijEkLVHbS4Q",
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
import { cibaIssue } from "@authlete/typescript-sdk/funcs/cibaIssue.js";

// Use `AuthleteCore` for best tree-shaking performance.
// You can create one instance of it to use across an application.
const authlete = new AuthleteCore({
  bearer: process.env["AUTHLETE_BEARER"] ?? "",
});

async function run() {
  const res = await cibaIssue(authlete, {
    serviceId: "<id>",
    backchannelAuthenticationIssueRequest: {
      ticket: "NFIHGx_btVrWmtAD093D-87JxvT4DAtuijEkLVHbS4Q",
    },
  });
  if (res.ok) {
    const { value: result } = res;
    console.log(result);
  } else {
    console.log("cibaIssue failed:", res.error);
  }
}

run();
```

### Parameters

| Parameter                                                                                                                                                                      | Type                                                                                                                                                                           | Required                                                                                                                                                                       | Description                                                                                                                                                                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `request`                                                                                                                                                                      | [operations.BackchannelAuthenticationIssueApiRequest](../../models/operations/backchannelauthenticationissueapirequest.md)                                                     | :heavy_check_mark:                                                                                                                                                             | The request object to use for the request.                                                                                                                                     |
| `options`                                                                                                                                                                      | RequestOptions                                                                                                                                                                 | :heavy_minus_sign:                                                                                                                                                             | Used to set various options for making HTTP requests.                                                                                                                          |
| `options.fetchOptions`                                                                                                                                                         | [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request#options)                                                                                        | :heavy_minus_sign:                                                                                                                                                             | Options that are passed to the underlying HTTP request. This can be used to inject extra headers for examples. All `Request` options, except `method` and `body`, are allowed. |
| `options.retries`                                                                                                                                                              | [RetryConfig](../../lib/utils/retryconfig.md)                                                                                                                                  | :heavy_minus_sign:                                                                                                                                                             | Enables retrying HTTP requests under certain failure conditions.                                                                                                               |

### Response

**Promise\<[models.BackchannelAuthenticationIssueResponse](../../models/backchannelauthenticationissueresponse.md)\>**

### Errors

| Error Type                  | Status Code                 | Content Type                |
| --------------------------- | --------------------------- | --------------------------- |
| errors.ResultError          | 400, 401, 403               | application/json            |
| errors.ResultError          | 500                         | application/json            |
| errors.AuthleteDefaultError | 4XX, 5XX                    | \*/\*                       |

## fail

The API prepares JSON that contains an error. The JSON should be used as the response body of the
response which is returned to the client from the [backchannel authentication endpoint](https://openid.net/specs/openid-client-initiated-backchannel-authentication-core-1\_0.html#auth\_backchannel\_endpoint).
### Description
This API is supposed to be called from within the implementation of the [backchannel authentication
endpoint](https://openid.net/specs/openid-client-initiated-backchannel-authentication-core-1\_0.html#auth\_backchannel\_endpoint)
of the service in order to generate an error response to the client application.
The response from `/backchannel/authentication/fails` API has some parameters. Among them, it is
`action` parameter that the authorization server implementation should check first because it denotes
the next action that the authorization server implementation should take. According to the value
of `action`, the authorization server implementation must take the steps described below.
**INTERNAL\_SERVER\_ERROR**
When the value of `action` is `INTERNAL\_SERVER\_ERROR`, it means that (1) the `reason` request parameter
of the API call was `SERVER\_ERROR`, (2) an error occurred on Authlete side, or (3) the request parameters
of the API call were wrong. In this case, the authorization server implementation should return
a "500 Internal Server Error" response to the client application. However, in most cases, commercial
implementations prefer to use other HTTP status code than 5xx.
**BAD\_REQUEST**
When the value of `action` is `BAD\_REQUEST`, the authorization server implementation should return a
"400 Bad Request" response to the client application.
**FORBIDDEN**
When the value of `action` is `FORBIDDEN`, it means that the `reason` request parameter of the API call
was `ACCESS\_DENIED`. In this case, the backchannel authentication endpoint of the authorization
server implementation should return a "403 Forbidden" response to the client application.


### Example Usage

<!-- UsageSnippet language="typescript" operationID="backchannel_authentication_fail_api" method="post" path="/api/{serviceId}/backchannel/authentication/fail" -->
```typescript
import { Authlete } from "@authlete/typescript-sdk";

const authlete = new Authlete({
  bearer: process.env["AUTHLETE_BEARER"] ?? "",
});

async function run() {
  const result = await authlete.ciba.fail({
    serviceId: "<id>",
    backchannelAuthenticationFailRequest: {
      ticket: "<value>",
      reason: "MISSING_USER_CODE",
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
import { cibaFail } from "@authlete/typescript-sdk/funcs/cibaFail.js";

// Use `AuthleteCore` for best tree-shaking performance.
// You can create one instance of it to use across an application.
const authlete = new AuthleteCore({
  bearer: process.env["AUTHLETE_BEARER"] ?? "",
});

async function run() {
  const res = await cibaFail(authlete, {
    serviceId: "<id>",
    backchannelAuthenticationFailRequest: {
      ticket: "<value>",
      reason: "MISSING_USER_CODE",
    },
  });
  if (res.ok) {
    const { value: result } = res;
    console.log(result);
  } else {
    console.log("cibaFail failed:", res.error);
  }
}

run();
```

### Parameters

| Parameter                                                                                                                                                                      | Type                                                                                                                                                                           | Required                                                                                                                                                                       | Description                                                                                                                                                                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `request`                                                                                                                                                                      | [operations.BackchannelAuthenticationFailApiRequest](../../models/operations/backchannelauthenticationfailapirequest.md)                                                       | :heavy_check_mark:                                                                                                                                                             | The request object to use for the request.                                                                                                                                     |
| `options`                                                                                                                                                                      | RequestOptions                                                                                                                                                                 | :heavy_minus_sign:                                                                                                                                                             | Used to set various options for making HTTP requests.                                                                                                                          |
| `options.fetchOptions`                                                                                                                                                         | [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request#options)                                                                                        | :heavy_minus_sign:                                                                                                                                                             | Options that are passed to the underlying HTTP request. This can be used to inject extra headers for examples. All `Request` options, except `method` and `body`, are allowed. |
| `options.retries`                                                                                                                                                              | [RetryConfig](../../lib/utils/retryconfig.md)                                                                                                                                  | :heavy_minus_sign:                                                                                                                                                             | Enables retrying HTTP requests under certain failure conditions.                                                                                                               |

### Response

**Promise\<[models.BackchannelAuthenticationFailResponse](../../models/backchannelauthenticationfailresponse.md)\>**

### Errors

| Error Type                  | Status Code                 | Content Type                |
| --------------------------- | --------------------------- | --------------------------- |
| errors.ResultError          | 400, 401, 403               | application/json            |
| errors.ResultError          | 500                         | application/json            |
| errors.AuthleteDefaultError | 4XX, 5XX                    | \*/\*                       |

## complete

This API returns information about what action the authorization server should take after it receives
the result of end-user's decision about whether the end-user has approved or rejected a client application's
request on the authentication device.
### Description
After the implementation of the backchannel authentication endpoint returns JSON containing an
`auth\_req\_id` to the client, the authorization server starts a background process that communicates
with the authentication device of the end-user. On the authentication device, end-user authentication
is performed and the end-user is asked whether they give authorization to the client or not. The
authorization server will receive the result of end-user authentication and authorization from
the authentication device.
After the authorization server receives the result from the authentication device, or even in the
case where the server gave up receiving a response from the authentication device for some reasons,
the server should call the `/backchannel/authentication/complete` API to tell Authlete the result.
When the end-user was authenticated and authorization was granted to the client by the end-user,
the authorization server should call the API with `result=AUTHORIZED`. In this successful case,
the `subject` request parameter is mandatory. If the token delivery mode is `push`, the API will generate
an access token, an ID token and optionally a refresh token. On the other hand, if the token delivery
mode is `poll` or `ping`, the API will just update the database record so that `/auth/token` API
can generate tokens later.
When the authorization server received the decision of the end-user from the authentication device
and it indicates that the end-user has rejected to give authorization to the client, the authorization
server should call the API with `result=ACCESS\_DENIED`. In this case, if the token delivery mode
is `push`, the API will generate an error response that contains the error response parameter and
optionally the `error\_description` and error\_uri response parameters (if the `errorDescription`
and `errorUri` request parameters have been given). On the other hand, if the token delivery mode
is `poll` or `ping`, the API will just update the database record so that `/auth/token` API can
generate an error response later. In any token delivery mode, the value of the error parameter will
become `access\_denied`.
When the authorization server could not get the result of end-user authentication and authorization
from the authentication device for some reasons, the authorization server should call the API with
`result=TRANSACTION\_FAILED`. In this error case, the API will behave in the same way as in the case
of `ACCESS\_DENIED`. The only difference is that `expired\_token` is used as the value of the `error`
parameter.
The response from `/backchannel/authentication/complete` API has various parameters. Among them,
it is `action` parameter that the authorization server implementation should check first because
it denotes the next action that the authorization server implementation should take. According to
the value of `action`, the service implementation must take the steps described below.
**SERVER\_ERROR**
When the value of `action` is `SERVER\_ERROR`, it means either (1) that the request from the authorization
server to Authlete was wrong, or (2) that an error occurred on Authlete side.
When the backchannel token delivery mode is `ping` or `push`, `SERVER\_ERROR` is used only when
an error is detected before the record of the ticket (which is included in the API call to `/backchannel/authentication/complete`)
is retrieved from the database successfully. If an error is detected after the record of the ticket
is retrieved from the database, `NOTIFICATION` is used instead of `SERVER\_ERROR`.
When the backchannel token delivery mode is `poll`, `SERVER\_ERROR` is used regardless of whether
it is before or after the record of the ticket is retrieved from the database.
**NO\_ACTION**
When the value of `action` is `NO\_ACTION`, it means that the authorization server does not have
to take any immediate action.
`NO\_ACTION` is returned when the backchannel token delivery mode is `poll`. In this case, the client
will receive the final result at the token endpoint.
**NOTIFICATION**
When the value of `action` is `NOTIFICATION`, it means that the authorization server must send a
notification to the client notification endpoint.
According to the CIBA Core specification, the notification is an HTTP POST request whose request
body is JSON and whose `Authorization` header contains the client notification token, which was
included in the backchannel authentication request as the value of the `client\_notification\_token`
request parameter, as a bearer token.
When the backchannel token delivery mode is `ping`, the request body of the notification is JSON
which contains the `auth\_req\_id` property only. When the backchannel token delivery mode is `push`,
the request body will additionally contain an access token, an ID token and other properties. Note
that when the backchannel token delivery mode is `poll`, a notification does not have to be sent
to the client notification endpoint.
In error cases, in the ping mode, however, the content of a notification is not different from the
content in successful cases. That is, the notification contains the `auth\_req\_id` property only.
The client will know the error when it accesses the token endpoint. On the other hand, in the
`push` mode, in error cases, the content of a notification will include the `error` property instead
of an access token and an ID token. The client will know the error by detecting that error is included
in the notification.
In any case, the value of `responseContent` is JSON which can be used as the request body of the
notification.
The client notification endpoint that the notification should be sent to the value of the `clientNotificationEndpoint`
parameter. Likewise, the client notification token that the notification should include as a bearer
token is the `clientNotificationToken` parameter. With these methods, the notification can be built
like the following.
```
POST {clientNotificationEndpoint} HTTP/1.1
HOST: {The host of clientNotificationEndpoint}
Authorization: Bearer {notificationToken}
Content-Type: application/json
{responseContent}
```


### Example Usage

<!-- UsageSnippet language="typescript" operationID="backchannel_authentication_complete_api" method="post" path="/api/{serviceId}/backchannel/authentication/complete" -->
```typescript
import { Authlete } from "@authlete/typescript-sdk";

const authlete = new Authlete({
  bearer: process.env["AUTHLETE_BEARER"] ?? "",
});

async function run() {
  const result = await authlete.ciba.complete({
    serviceId: "<id>",
    backchannelAuthenticationCompleteRequest: {
      ticket: "NFIHGx_btVrWmtAD093D-87JxvT4DAtuijEkLVHbS4Q",
      result: "AUTHORIZED",
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
import { cibaComplete } from "@authlete/typescript-sdk/funcs/cibaComplete.js";

// Use `AuthleteCore` for best tree-shaking performance.
// You can create one instance of it to use across an application.
const authlete = new AuthleteCore({
  bearer: process.env["AUTHLETE_BEARER"] ?? "",
});

async function run() {
  const res = await cibaComplete(authlete, {
    serviceId: "<id>",
    backchannelAuthenticationCompleteRequest: {
      ticket: "NFIHGx_btVrWmtAD093D-87JxvT4DAtuijEkLVHbS4Q",
      result: "AUTHORIZED",
      subject: "john",
    },
  });
  if (res.ok) {
    const { value: result } = res;
    console.log(result);
  } else {
    console.log("cibaComplete failed:", res.error);
  }
}

run();
```

### Parameters

| Parameter                                                                                                                                                                      | Type                                                                                                                                                                           | Required                                                                                                                                                                       | Description                                                                                                                                                                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `request`                                                                                                                                                                      | [operations.BackchannelAuthenticationCompleteApiRequest](../../models/operations/backchannelauthenticationcompleteapirequest.md)                                               | :heavy_check_mark:                                                                                                                                                             | The request object to use for the request.                                                                                                                                     |
| `options`                                                                                                                                                                      | RequestOptions                                                                                                                                                                 | :heavy_minus_sign:                                                                                                                                                             | Used to set various options for making HTTP requests.                                                                                                                          |
| `options.fetchOptions`                                                                                                                                                         | [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request#options)                                                                                        | :heavy_minus_sign:                                                                                                                                                             | Options that are passed to the underlying HTTP request. This can be used to inject extra headers for examples. All `Request` options, except `method` and `body`, are allowed. |
| `options.retries`                                                                                                                                                              | [RetryConfig](../../lib/utils/retryconfig.md)                                                                                                                                  | :heavy_minus_sign:                                                                                                                                                             | Enables retrying HTTP requests under certain failure conditions.                                                                                                               |

### Response

**Promise\<[models.BackchannelAuthenticationCompleteResponse](../../models/backchannelauthenticationcompleteresponse.md)\>**

### Errors

| Error Type                  | Status Code                 | Content Type                |
| --------------------------- | --------------------------- | --------------------------- |
| errors.ResultError          | 400, 401, 403               | application/json            |
| errors.ResultError          | 500                         | application/json            |
| errors.AuthleteDefaultError | 4XX, 5XX                    | \*/\*                       |