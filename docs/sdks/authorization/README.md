# Authorization

## Overview

### Available Operations

* [processRequest](#processrequest) - Process Authorization Request
* [fail](#fail) - Fail Authorization Request
* [issue](#issue) - Issue Authorization Response

## processRequest

This API parses request parameters of an authorization request and returns necessary data for the authorization server
implementation to process the authorization request further.
### Description
This API is supposed to be called from within the implementation of the authorization endpoint of
the service. The endpoint implementation must extract the request parameters from the authorization
request from the client application and pass them as the value of parameters request parameter for
Authlete's `/auth/authorization` API.
The value of `parameters` is either (1) the entire query string when the HTTP method of the request
from the client application is `GET` or (2) the entire entity body (which is formatted in
`application/x-www-form-urlencoded`) when the HTTP method of the request from the client application
is `POST`.
The following code snippet is an example in JAX-RS showing how to extract request parameters from
the authorization request.
```java
@GET
public Response get(@Context UriInfo uriInfo)
{
    // The query parameters of the authorization request.
    String parameters = uriInfo.getRequestUri().getQuery();
    ......
}
@POST
@Consumes(MediaType.APPLICATION\_FORM\_URLENCODED)
public Response post(String parameters)
{
    // 'parameters' is the entity body of the authorization request.
    ......
}
```
The endpoint implementation does not have to parse the request parameters from the client application
because Authlete's `/auth/authorization` API does it.
The response from `/auth/authorization` API has various parameters. Among them, it is `action`
parameter that the authorization server implementation should check first because it denotes the
next action that the authorization server implementation should take. According to the value of
`action`, the service implementation must take the steps described below.
**INTERNAL\_SERVER\_ERROR**
When the value of `action` is `INTERNAL\_SERVER\_ERROR`, it means that the request from the authorization
server implementation was wrong or that an error occurred in Authlete.
In either case, from the viewpoint of the client application, it is an error on the server side.
Therefore, the service implementation should generate a response to the client application with
HTTP status of "500 Internal Server Error". Authlete recommends `application/json` as the content
type although OAuth 2.0 specification does not mention the format of the error response when the
redirect URI is not usable.
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
The endpoint implementation may return another different response to the client application
since "500 Internal Server Error" is not required by OAuth 2.0.
**BAD\_REQUEST**
When the value of `action` is `BAD\_REQUEST`, it means that the request from the client application
is invalid.
A response with HTTP status of "400 Bad Request" should be returned to the client application and
Authlete recommends `application/json` as the content type although OAuth 2.0 specification does
not mention the format of the error response when the redirect URI is not usable.
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
The endpoint implementation may return another different response to the client application since
"400 Bad Request" is not required by OAuth 2.0.
**LOCATION**
When the value of `action` is `LOCATION`, it means that the request from the client application
is invalid but the redirect URI
to which the error should be reported has been determined.
A response with HTTP status of "302 Found" must be returned to the client application with `Location`
header which has a redirect URI with error parameter.
The value of `responseContent` is a redirect URI with `error` parameter, so it can be used as the
value of `Location` header.
The following illustrates the response which the service implementation must generate and return
to the client application.
```
HTTP/1.1 302 Found
Location: {responseContent}
Cache-Control: no-store
Pragma: no-cache
```
**FORM**
When the value of `action` is `FORM`, it means that the request from the client application is
invalid but the redirect URI to which the error should be reported has been determined, and that
the authorization request contains `response\_mode=form\_post` as is defined in [OAuth 2.0 Form Post
Response Mode](https://openid.net/specs/oauth-v2-form-post-response-mode-1\_0.html).
The HTTP status of the response returned to the client application should be "200 OK" and the
content type should be `text/html;charset=UTF-8`.
The value of `responseContent` is an HTML which can be used as the entity body of the response.
The following illustrates the response which the service implementation must generate and return
to the client application.
```
HTTP/1.1 200 OK
Content-Type: text/html;charset=UTF-8
Cache-Control: no-store
Pragma: no-cache
{responseContent}
```
**NO\_INTERACTION**
When the value of `action` is `NO\_INTERACTION`, it means that the request from the client application
has no problem and requires the service to process the request without displaying any user interface
pages for authentication or consent. This case happens when the authorization request contains
`prompt=none`.
The service must follow the steps described below.
[1] END-USER AUTHENTICATION
Check whether an end-user has already logged in. If an end-user has logged in, go to the next step ([MAX\_AGE]).
Otherwise, call Authlete's `/auth/authorization/fail` API with `reason=NOT\_LOGGED\_IN` and use the response from
the API to generate a response to the client application.
[2] MAX AGE
Get the value of `maxAge` parameter from the `/auth/authorization` API response. The value represents
the maximum authentication age which has come from `max\_age` request parameter or `defaultMaxAge`
configuration parameter of the client application. If the value is `0`, go to the next step ([SUBJECT]).
Otherwise, follow the sub steps described below.
(i) Get the time at which the end-user was authenticated. that this value is not managed by Authlete,
meaning that it is expected that the service implementation manages the value. If the service implementation
does not manage authentication time of end-users, call Authlete's `/auth/authorization/fail` API
with `reason=MAX\_AGE\_NOT\_SUPPORTED` and use the API response to generate a response to the client
application.
(ii) Add the value of the maximum authentication age (which is represented in seconds) to the authentication
time. The calculated value is the expiration time.
(iii) Check whether the calculated value is equal to or greater than the current time. If this condition
is satisfied, go to the next step ([SUBJECT]). Otherwise, call Authlete's `/auth/authorization/fail`
API with `reason=EXCEEDS\_MAX\_AGE` and use the API response to generate a response to the client
application.
[3] SUBJECT
Get the value of `subject` from the `/auth/authorization` API response. The value represents an
end-user who the client application expects to grant authorization. If the value is `null`, go to
the next step ([ACRs]). Otherwise, follow the sub steps described below.
(i) Compare the value of the requested subject to the current end-user.
(ii) If they are equal, go to the next step ([ACRs]). If they are not equal, call Authlete's
`/auth/authorization/fail` API with `reason=DIFFERENT\_SUBJECT` and use the response from the API
to generate a response to the client application.
[4] ACRs
Get the value of `acrs` from the `/auth/authorization` API response. The value represents a list
of ACRs (Authentication Context Class References) and comes from (1) acr claim in `claims` request
parameter, (2) `acr\_values` request parameter, or (3) `default\_acr\_values` configuration parameter
of the client application.
It is ensured that all the ACRs in acrs are supported by the authorization server implementation.
In other words, it is ensured that all the ACRs are listed in `acr\_values\_supported` configuration
parameter of the authorization server.
If the value of ACRs is `null`, go to the next step ([ISSUE]). Otherwise, follow the sub steps
described below.
(i) Get the ACR performed for the authentication of the current end-user. Note that this value is
managed not by Authlete but by the authorization server implementation. (If the authorization server
implementation cannot handle ACRs, it should not have listed ACRs as `acr\_values\_supported`.)
(ii) Compare the ACR value obtained in the above step to each element in the ACR array (`acrs`)
in the listed order.
(iii) If the ACR value was found in the array, (= the ACR performed for the authentication of the
current end-user did not match any one of the ACRs requested by the client application), check
whether one of the requested ACRs must be satisfied or not using `acrEssential` parameter in the
`/auth/authorization` API response. If the value of `acrEssential` parameter is `true`, call Authlete's
`/auth/authorization/fail` API with `reason=ACR\_NOT\_SATISFIED` and use the response from the API
to generate a response to the client application. Otherwise, go to the next step ([SCOPES]).
[5] SCOPES
Get the value of `scopes` from the `/auth/authorization` API response. If the array contains a
scope which has not been granted to the client application by the end-user in the past, call
Authlete's `/auth/authorization/fail` API with `reason=CONSENT\_REQUIRED` and use the response from
the API to generate a response to the client application. Otherwise, go to the next step ([RESOURCES]).
Note that Authlete provides APIs to manage records of granted scopes (`/api/client/granted\_scopes/\*`
APIs), which is only available in a dedicated/onpremise Authlete server (contact sales@authlete.com
for details).
[6] DYNAMIC SCOPES
Get the value of `dynamicScopes` from the `/auth/authorization` API response. If the array contains
a scope which has not been granted to the client application by the end-user in the past, call
Authlete's `/auth/authorization/fail` API with `reason=CONSENT\_REQUIRED` and use the response from
the API to generate a response to the client application. Otherwise, go to the next step ([RESOURCES]).
Note that Authlete provides APIs to manage records of granted scopes (`/api/client/granted\_scopes/\*`
APIs) but dynamic scopes are not remembered as granted scopes.
[7] RESOURCES
Get the value of `resources` from the `/auth/authorization` API response. The array represents
the values of the `resource` request parameters. If you want to reject the request, call Authlete's
`/auth/authorization/fail` API with `reason=INVALID\_TARGET` and use the response from the API to
generate a response to the client application. Otherwise, go to the next step ([ISSUE]).
See "Resource Indicators for OAuth 2.0" for details.
[8] ISSUE
If all the above steps succeeded, the last step is to issue an authorization code, an ID token
and/or an access token. (There is a special case, though. In the case of `response\_type=none`,
nothing is issued.) It can be performed by calling Authlete's `/auth/authorization/issue` API.
The API requires the following parameters. Prepare these parameters and call `/auth/authorization/issue`
API and use the response to generate a response to the client application.
- `ticket` (required)
  This parameter represents a ticket which is exchanged with tokens at `/auth/authorization/issue`.
  Use the value of `ticket` contained in the `/auth/authorization` API response.
- `subject` (required)
  This parameter represents the unique identifier of the current end-user. It is often called "user ID"
  and it may or may not be visible to the user. In any case, it is a number or a string assigned
  to an end-user by the authorization server implementation. Authlete does not care about the format
  of the value of subject, but it must consist of only ASCII letters and its length must not exceed 100.
  When the value of `subject` parameter in the /auth/authorization API response is not `null`,
  it is necessarily identical to the value of `subject` parameter in the `/auth/authorization/issue`
  API request.
  The value of this parameter will be embedded in an ID token as the value of `sub` claim. When
the value of `subject\_type` configuration parameter of the client application is `PAIRWISE`,
  the value of sub claim is different from the value specified by this parameter, See [8. Subject
Identifier Types](https://openid.net/specs/openid-connect-core-1\_0.html#SubjectIDTypes) of OpenID
  Connect Core 1.0 for details about subject types.
  You can use the `sub` request parameter to adjust the value of the `sub` claim in an ID token.
  See the description of the `sub` request parameter for details.
- `authTime` (optional)
  This parameter represents the time when the end-user authentication occurred. Its value is the
  number of seconds from `1970-01-01`. The value of this parameter will be embedded in an ID token
as the value of `auth\_time` claim.
- `acr` (optional)
  This parameter represents the ACR (Authentication Context Class Reference) which the authentication
  of the end-user satisfies. When `acrs` in the `/auth/authorization` API response is a non-empty
  array and the value of `acrEssential` is `true`, the value of this parameter must be one of the
  array elements. Otherwise, even `null` is allowed. The value of this parameter will be embedded
  in an ID token as the value of `acr` claim.
- `claims` (optional)
  This parameter represents claims of the end-user. "Claims" here are pieces of information about
  the end-user such as `"name"`, `"email"` and `"birthdate"`. The authorization server implementation
  is required to gather claims of the end-user, format the claim values into JSON and set the JSON
  string as the value of this parameter.
  The claims which the authorization server implementation is required to gather are listed in
  `claims` parameter in the `/auth/authorization` API response.
  For example, if claims parameter lists `"name"`, `"email"` and `"birthdate"`, the value of this
  parameter should look like the following.
  ```json
  {
    "name": "John Smith",
    "email": "john@example.com",
    "birthdate": "1974-05-06"
  }
  ```
  `claimsLocales` parameter in the `/auth/authorization` API response lists the end-user's preferred
  languages and scripts, ordered by preference. When `claimsLocales` parameter is a non-empty array,
  its elements should be taken into account when the authorization server implementation gathers
claim values. Especially, note the excerpt below from [5.2. Claims Languages and Scripts](https://openid.net/specs/openid-connect-core-1\_0.html#ClaimsLanguagesAndScripts)
  of OpenID Connect Core 1.0.
> When the OP determines, either through the `claims\_locales` parameter, or by other means, that
  the End-User and Client are requesting Claims in only one set of languages and scripts, it is
  RECOMMENDED that OPs return Claims without language tags when they employ this language and script.
  It is also RECOMMENDED that Clients be written in a manner that they can handle and utilize Claims
  using language tags.
  If `claims` parameter in the `/auth/authorization` API response is `null` or an empty array,
  the value of this parameter should be `null`.
See [5.1. Standard Claims](https://openid.net/specs/openid-connect-core-1\_0.html#StandardClaims)
  of OpenID Connect core 1.0 for claim names and their value formats. Note (1) that the authorization
server implementation support its special claims ([5.1.2. Additional Claims](https://openid.net/specs/openid-connect-core-1\_0.html#AdditionalClaims))
and (2) that claim names may be followed by a language tag ([5.2. Claims Languages and Scripts](https://openid.net/specs/openid-connect-core-1\_0.html#ClaimsLanguagesAndScripts)).
Read the specification of [OpenID Connect Core 1.0](https://openid.net/specs/openid-connect-core-1\_0.html)
  for details.
  The claim values in this parameter will be embedded in an ID token.
  Note that `idTokenClaims` parameter is available in the `/auth/authorization` API response.
The parameter has the value of the `"id\_token"` property in the `claims` request parameter or
  in the `"claims"` property in a request object. The value of this parameter should be considered
  when you prepare claim values.
- `properties` (optional)
  Extra properties to associate with an access token and/or an authorization code that may be issued
  by this request. Note that `properties` parameter is accepted only when `Content-Type` of the
  request is `application/json`, so don't use `application/x-www-form-urlencoded` for details.
- `scopes` (optional)
  Scopes to associate with an access token and/or an authorization code. If this parameter is `null`,
  the scopes specified in the original authorization request from the client application are used.
  In other cases, including the case of an empty array, the specified scopes will replace the original
  scopes contained in the original authorization request.
  Even scopes that are not included in the original authorization request can be specified. However,
  as an exception, `openid` scope is ignored on the server side if it is not included in the original
  request. It is because the existence of `openid` scope considerably changes the validation steps
  and because adding `openid` triggers generation of an ID token (although the client application
  has not requested it) and the behavior is a major violation against the specification.
If you add `offline\_access` scope although it is not included in the original request, keep in
  mind that the specification requires explicit consent from the user for the scope ([OpenID Connect
Core 1.0, 11. Offline Access](https://openid.net/specs/openid-connect-core-1\_0.html#OfflineAccess)).
When `offline\_access` is included in the original request, the current implementation of Authlete's
  `/auth/authorization` API checks whether the request has come along with `prompt` request parameter
  and the value includes consent. However, note that the implementation of Authlete's `/auth/authorization/issue`
API does not perform such checking if `offline\_access` scope is added via this `scopes` parameter.
- `sub` (optional)
  The value of the `sub` claim in an ID token. If the value of this request parameter is not empty,
  it is used as the value of the `sub` claim. Otherwise, the value of the `subject` request parameter
  is used as the value of the `sub` claim. The main purpose of this parameter is to hide the actual
  value of the subject from client applications.
  Note that even if this `sub` parameter is not empty, the value of the subject request parameter
  is used as the value of the subject which is associated with the access token.
**INTERACTION**
When the value of `action` is `INTERACTION`, it means that the request from the client application
has no problem and requires the service to process the request with user interaction by an HTML form.
The purpose of the UI displayed to the end-user is to ask the end-user to grant authorization to
the client application. The items described below are some points which the service implementation
should take into account when it builds the UI.
[1] DISPLAY MODE
The response from `/auth/authorization` API has `display` parameter. It is one of `PAGE` (default),
`POPUP`, `TOUCH` and `WAP` The meanings of the values are described in [3.1.2.1. Authentication
Request of OpenID Connect Core 1.0](https://openid.net/specs/openid-connect-core-1\_0.html#AuthRequest).
Basically, the authorization server implementation should display the UI which is suitable for the
display mode, but it is okay for the authorization server implementation to "attempt to detect the
capabilities of the User Agent and present an appropriate display".
It is ensured that the value of `display` is one of the supported display modes which are specified
by `supportedDisplays` configuration parameter of the service.
[2] UI LOCALE
The response from `/auth/authorization` API has `uiLocales` parameter. It it is not `null`, it lists
language tag values (such as `fr-CA`, `ja-JP` and `en`) ordered by preference. The service implementation
should display the UI in one of the language listed in the parameter when possible. It is ensured
that language tags listed in `uiLocales` are contained in the list of supported UI locales which
are specified by `supportedUiLocales` configuration parameter of the service.
[3] CLIENT INFORMATION
The authorization server implementation should show information about the client application to
the end-user. The information is embedded in `client` parameter in the response from `/auth/authorization`
API.
[4] SCOPES
A client application requires authorization for specific permissions. In OAuth 2.0 specification,
"scope" is a technical term which represents a permission. `scopes` parameter in the response
from `/auth/authorization` API is a list of scopes requested by the client application. The service
implementation should show the end-user the scopes.
The authorization server implementation may choose not to show scopes to which the end-user has
given consent in the past. To put it the other way around, the authorization server implementation
may show only the scopes to which the end-user has not given consent yet. However, if the value
of `prompts` response parameter contains `CONSENT`, the authorization server implementation has
to obtain explicit consent from the end-user even if the end-user has given consent to all the
requested scopes in the past.
Note that Authlete provides APIs to manage records of granted scopes (`/api/client/granted\_scopes/\*`
APIs), but the APIs work only in the case the Authlete server you use is a dedicated Authlete server
(contact sales@authlete.com for details). In other words, the APIs of the shared Authlete server
are disabled intentionally (in order to prevent garbage data from being accumulated) and they
return 403 Forbidden.
It is ensured that the values in `scopes` parameter are contained in the list of supported scopes
which are specified by `supportedScopes` configuration parameter of the service.
[5] DYNAMIC SCOPES
The authorization request may include dynamic scopes. The list of recognized dynamic scopes are
accessible by getDynamicScopes() method. See the description of the [DynamicScope](https://authlete.github.io/authlete-java-common/com/authlete/common/dto/DynamicScope.html)
class for details about dynamic scopes.
[6] AUTHORIZATION DETAILS
The authorization server implementation should show the end-user "authorization details" if the
request includes it. The value of `authorization\_details` parameter in the response is the content
of the `authorization\_details` request parameter.
See "OAuth 2.0 Rich Authorization Requests" for details.
[7] PURPOSE
The authorization server implementation must show the value of the `purpose` request parameter if
it supports [OpenID Connect for Identity Assurance 1.0](https://openid.net/specs/openid-connect-4-identity-assurance-1\_0.html).
See [8. Transaction-specific Purpose](https://openid.net/specs/openid-connect-4-identity-assurance-1\_0.html#rfc.section.8)
in the specification for details.
Note that the value of `purpose` response parameter is the value of the purpose request parameter.
[7] END-USER AUTHENTICATION
Necessarily, the end-user must be authenticated (= must login the service) before granting authorization
to the client application. Simply put, a login form is expected to be displayed for end-user authentication.
The service implementation must follow the steps described below to comply with OpenID Connect.
(Or just always show a login form if it's too much of a bother.)
(i) Get the value of `prompts` response parameter. It corresponds to the value of the `prompt`
request parameter. Details of the request parameter are described in [3.1.2.1. Authentication
Request](https://openid.net/specs/openid-connect-core-1\_0.html#AuthRequest) of OpenID Connect Core 1.0.
(ii) If the value of `prompts` parameter is `SELECT\_ACCOUNT` display a form to let the end-user
select on of his/her accounts for login. If `subject` response parameter is not `null`, it is the
end-user ID that the client application expects, so the value should be used to determine the value
of the login ID. Note that a subject and a login ID are not necessarily equal. If the value of
`subject` response parameter is `null`, the value of `loginHint` response parameter should be referred
to as a hint to determine the value of the login ID. The value of `loginHint` response parameter
is simply the value of the `login\_hint` request parameter.
(iii) If the value of `prompts` response parameter contains `LOGIN`, display a form to urge the
end-user to login even if the end-user has already logged in. If the value of `subject` response
parameter is not `null`, it is the end-user ID that the client application expects, so the value
should be used to determine the value of the login ID. Note that a subject and a login ID are not
necessarily equal. If the value of `subject` response parameter is `null`, the value of `loginHint`
response parameter should be referred to as a hint to determine the value of the login ID. The value
of `loginHint` response parameter is simply the value of the `login\_hint` request parameter.
(iv) If the value of `prompts` response parameter does not contain `LOGIN`, the authorization server
implementation does not have to authenticate the end-user if all the conditions described below
are satisfied. If any one of the conditions is not satisfied, show a login form to authenticate
the end-user.
- An end-user has already logged in the service.
- The login ID of the current end-user matches the value of `subject` response parameter.
This check is required only when the value of `subject` response parameter is a non-null value.
- The max age, which is the number of seconds contained in `maxAge` response parameter,
has not passed since the current end-user logged in your service. This check is required only when
the value of `maxAge` response parameter is a non-zero value.
- If the authorization server implementation does not manage authentication time of end-users
(= if the authorization server implementation cannot know when end-users logged in) and if the
value of `maxAge` response parameter is a non-zero value, a login form should be displayed.
- The ACR (Authentication Context Class Reference) of the authentication performed for
the current end-user satisfies one of the ACRs listed in `acrs` response parameter. This check is
required only when the value of `acrs` response parameter is a non-empty array.
In every case, the end-user authentication must satisfy one of the ACRs listed in `acrs` response
parameter when the value of `acrs` response parameter is a non-empty array and `acrEssential`
response parameter is `true`.
[9] GRANT/DENY BUTTONS
The end-user is supposed to choose either (1) to grant authorization to the client application or
(2) to deny the authorization request. The UI must have UI components to accept the judgment by
the user. Usually, a button to grant authorization and a button to deny the request are provided.
When the value of `subject` response parameter is not `null`, the end-user authentication must be
performed for the subject, meaning that the authorization server implementation should repeatedly
show a login form until the subject is successfully authenticated.
The end-user will choose either (1) to grant authorization to the client application or (2) to
deny the authorization request. When the end-user chose to deny the authorization request, call
Authlete's `/auth/authorization/fail` API with `reason=DENIED` and use the response from the API
to generate a response to the client application.
When the end-user chose to grant authorization to the client application, the authorization server
implementation has to issue an authorization code, an ID token, and/or an access token to the client
application. (There is a special case. When `response\_type=none`, nothing is issued.) Issuing the
tokens can be performed by calling Authlete's `/auth/authorization/issue` API. Read [ISSUE] written
above in the description for the case of `action=NO\_INTERACTION`.


### Example Usage

<!-- UsageSnippet language="typescript" operationID="auth_authorization_api" method="post" path="/api/{serviceId}/auth/authorization" -->
```typescript
import { Authlete } from "@authlete/typescript-sdk";

const authlete = new Authlete({
  bearer: process.env["AUTHLETE_BEARER"] ?? "",
});

async function run() {
  const result = await authlete.authorization.processRequest({
    serviceId: "<id>",
    authorizationRequest: {
      parameters: "response_type=code&client_id=26478243745571&redirect_uri=https%3A%2F%2Fmy-client.example.com%2Fcb1&scope=timeline.read+history.read&code_challenge=E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM&code_challenge_method=S256",
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
import { authorizationProcessRequest } from "@authlete/typescript-sdk/funcs/authorizationProcessRequest.js";

// Use `AuthleteCore` for best tree-shaking performance.
// You can create one instance of it to use across an application.
const authlete = new AuthleteCore({
  bearer: process.env["AUTHLETE_BEARER"] ?? "",
});

async function run() {
  const res = await authorizationProcessRequest(authlete, {
    serviceId: "<id>",
    authorizationRequest: {
      parameters: "response_type=code&client_id=26478243745571&redirect_uri=https%3A%2F%2Fmy-client.example.com%2Fcb1&scope=timeline.read+history.read&code_challenge=E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM&code_challenge_method=S256",
    },
  });
  if (res.ok) {
    const { value: result } = res;
    console.log(result);
  } else {
    console.log("authorizationProcessRequest failed:", res.error);
  }
}

run();
```

### Parameters

| Parameter                                                                                                                                                                      | Type                                                                                                                                                                           | Required                                                                                                                                                                       | Description                                                                                                                                                                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `request`                                                                                                                                                                      | [operations.AuthAuthorizationApiRequest](../../models/operations/authauthorizationapirequest.md)                                                                               | :heavy_check_mark:                                                                                                                                                             | The request object to use for the request.                                                                                                                                     |
| `options`                                                                                                                                                                      | RequestOptions                                                                                                                                                                 | :heavy_minus_sign:                                                                                                                                                             | Used to set various options for making HTTP requests.                                                                                                                          |
| `options.fetchOptions`                                                                                                                                                         | [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request#options)                                                                                        | :heavy_minus_sign:                                                                                                                                                             | Options that are passed to the underlying HTTP request. This can be used to inject extra headers for examples. All `Request` options, except `method` and `body`, are allowed. |
| `options.retries`                                                                                                                                                              | [RetryConfig](../../lib/utils/retryconfig.md)                                                                                                                                  | :heavy_minus_sign:                                                                                                                                                             | Enables retrying HTTP requests under certain failure conditions.                                                                                                               |

### Response

**Promise\<[models.AuthorizationResponse](../../models/authorizationresponse.md)\>**

### Errors

| Error Type                  | Status Code                 | Content Type                |
| --------------------------- | --------------------------- | --------------------------- |
| errors.ResultError          | 400, 401, 403               | application/json            |
| errors.ResultError          | 500                         | application/json            |
| errors.AuthleteDefaultError | 4XX, 5XX                    | \*/\*                       |

## fail

This API generates a content of an error authorization response that the authorization server implementation
returns to the client application.
### Description
This API is supposed to be called from within the implementation of the authorization endpoint of the service
in order to generate an error response to the client application.
The description of the `/auth/authorization` API describes the timing when this API should be called.
The response from `/auth/authorization/fail` API has some parameters.
Among them, it is `action` parameter that the authorization server implementation should check first because
it denotes the next action that the authorization server implementation should take.
According to the value of `action`, the authorization server implementation must take the steps described below.
**INTERNAL\_SERVER\_ERROR**
When the value of `action` is `INTERNAL\_SERVER\_ERROR`, it means that the request from the authorization
server implementation was wrong or that an error occurred in Authlete.
In either case, from the viewpoint of the client application, it is an error on the server side.
Therefore, the service implementation should generate a response to the client application with
HTTP status of "500 Internal Server Error". Authlete recommends `application/json` as the content type.
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
The endpoint implementation may return another different response to the client application since
"500 Internal Server Error" is not required by OAuth 2.0.
**BAD\_REQUEST**
When the value of `action` is `BAD\_REQUEST`, it means that the ticket is no longer valid (deleted
or expired) and that the reason of the invalidity was probably due to the end-user's too-delayed
response to the authorization UI.
A response with HTTP status of "400 Bad Request" should be returned to the client application and
Authlete recommends `application/json` as the content type.
The value of `responseContent` is a JSON string which describes the error, so it can be used
as the entity body of the response.
The following illustrates the response which the service implementation should generate and return
to the client application.
```
HTTP/1.1 400 Bad Request
Content-Type: application/json
Cache-Control: no-store
Pragma: no-cache
{responseContent}
```
The endpoint implementation may return another different response to the client application since
"400 Bad Request" is not required by OAuth 2.0.
**LOCATION**
When the value of `action` is `LOCATION`, it means that the response to the client application must
be "302 Found" with Location header.
The parameter responseContent contains a redirect URI with (1) an authorization code, an ID token
and/or an access token (on success) or (2) an error code (on failure), so it can be used as the
value of `Location` header.
The following illustrates the response which the service implementation must generate and return
to the client application.
```
HTTP/1.1 302 Found
Location: {responseContent}
Cache-Control: no-store
Pragma: no-cache
```
**FORM**
When the value of `action` is `FORM`, it means that the response to the client application must be 200 OK
with an HTML which triggers redirection by JavaScript.
This happens when the authorization request from the client application contained `response\_mode=form\_post`.
The value of `responseContent` is an HTML which can be used as the entity body of the response.
The following illustrates the response which the service implementation must generate and return
to the client application.
```
HTTP/1.1 200 OK
Content-Type: text/html;charset=UTF-8
Cache-Control: no-store
Pragma: no-cache
{responseContent}
```


### Example Usage

<!-- UsageSnippet language="typescript" operationID="auth_authorization_fail_api" method="post" path="/api/{serviceId}/auth/authorization/fail" -->
```typescript
import { Authlete } from "@authlete/typescript-sdk";

const authlete = new Authlete({
  bearer: process.env["AUTHLETE_BEARER"] ?? "",
});

async function run() {
  const result = await authlete.authorization.fail({
    serviceId: "<id>",
    authorizationFailRequest: {
      ticket: "qA7wGybwArICpbUSutrf5Xc9-i1fHE0ySOHxR1eBoBQ",
      reason: "NOT_AUTHENTICATED",
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
import { authorizationFail } from "@authlete/typescript-sdk/funcs/authorizationFail.js";

// Use `AuthleteCore` for best tree-shaking performance.
// You can create one instance of it to use across an application.
const authlete = new AuthleteCore({
  bearer: process.env["AUTHLETE_BEARER"] ?? "",
});

async function run() {
  const res = await authorizationFail(authlete, {
    serviceId: "<id>",
    authorizationFailRequest: {
      ticket: "qA7wGybwArICpbUSutrf5Xc9-i1fHE0ySOHxR1eBoBQ",
      reason: "NOT_AUTHENTICATED",
    },
  });
  if (res.ok) {
    const { value: result } = res;
    console.log(result);
  } else {
    console.log("authorizationFail failed:", res.error);
  }
}

run();
```

### Parameters

| Parameter                                                                                                                                                                      | Type                                                                                                                                                                           | Required                                                                                                                                                                       | Description                                                                                                                                                                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `request`                                                                                                                                                                      | [operations.AuthAuthorizationFailApiRequest](../../models/operations/authauthorizationfailapirequest.md)                                                                       | :heavy_check_mark:                                                                                                                                                             | The request object to use for the request.                                                                                                                                     |
| `options`                                                                                                                                                                      | RequestOptions                                                                                                                                                                 | :heavy_minus_sign:                                                                                                                                                             | Used to set various options for making HTTP requests.                                                                                                                          |
| `options.fetchOptions`                                                                                                                                                         | [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request#options)                                                                                        | :heavy_minus_sign:                                                                                                                                                             | Options that are passed to the underlying HTTP request. This can be used to inject extra headers for examples. All `Request` options, except `method` and `body`, are allowed. |
| `options.retries`                                                                                                                                                              | [RetryConfig](../../lib/utils/retryconfig.md)                                                                                                                                  | :heavy_minus_sign:                                                                                                                                                             | Enables retrying HTTP requests under certain failure conditions.                                                                                                               |

### Response

**Promise\<[models.AuthorizationFailResponse](../../models/authorizationfailresponse.md)\>**

### Errors

| Error Type                  | Status Code                 | Content Type                |
| --------------------------- | --------------------------- | --------------------------- |
| errors.ResultError          | 400, 401, 403               | application/json            |
| errors.ResultError          | 500                         | application/json            |
| errors.AuthleteDefaultError | 4XX, 5XX                    | \*/\*                       |

## issue

This API parses request parameters of an authorization request and returns necessary data for the
authorization server implementation to process the authorization request further.
### Description
This API is supposed to be called from within the implementation of the authorization endpoint of
the service in order to generate a successful response to the client application.
The description of the `/auth/authorization` API describes the timing when this API should be called
and the meaning of request parameters. See [ISSUE] in `NO\_INTERACTION`.
The response from `/auth/authorization/issue` API has some parameters.
Among them, it is `action` parameter that the authorization server implementation should check first
because it denotes the next action that the authorization server implementation should take.
According to the value of `action`, the authorization server implementation must take the steps
described below.
**INTERNAL\_SERVER\_ERROR**
When the value of `action` is `INTERNAL\_SERVER\_ERROR`, it means that the request from the authorization
server implementation was wrong or that an error occurred in Authlete.
In either case, from the viewpoint of the client application, it is an error on the server side.
Therefore, the service implementation should generate a response to the client application with
HTTP status of "500 Internal Server Error".
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
The endpoint implementation may return another different response to the client application since
"500 Internal Server Error" is not required by OAuth 2.0.
**BAD\_REQUEST**
When the value of "action" is `BAD\_REQUEST`, it means that the ticket is no longer valid (deleted
or expired) and that the reason of the invalidity was probably due to the end-user's too-delayed
response to the authorization UI.
The HTTP status of the response returned to the client application should be "400 Bad Request"
and the content type should be `application/json` although OAuth 2.0 specification does not mention
the format of the error response.
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
The endpoint implementation may return another different response to the client application since
"400 Bad Request" is not required by OAuth 2.0.
**LOCATION**
When the value of `action` is `LOCATION`, it means that the response to the client application
should be "302 Found" with `Location` header.
The value of `responseContent` is a redirect URI which contains (1) an authorization code, an ID
token and/or an access token (on success) or (2) an error code (on failure), so it can be used as
the value of `Location` header.
The following illustrates the response which the service implementation must generate and return
to the client application.
```
HTTP/1.1 302 Found
Location: {responseContent}
Cache-Control: no-store
Pragma: no-cache
```
**FORM**
When the value of `action` is `FORM`, it means that the response to the client application should
be "200 OK" with an HTML which triggers redirection by JavaScript. This happens when the authorization
request from the client contains `response\_mode=form\_post` request parameter.
The value of `responseContent` is an HTML which satisfies the requirements of `response\_mode=form\_post`,
so it can be used as the entity body of the response.
The following illustrates the response which the service implementation should generate and return
to the client application.
```
HTTP/1.1 200 OK
Content-Type: text/html;charset=UTF-8
Cache-Control: no-store
Pragma: no-cache
{responseContent}
```


### Example Usage

<!-- UsageSnippet language="typescript" operationID="auth_authorization_issue_api" method="post" path="/api/{serviceId}/auth/authorization/issue" -->
```typescript
import { Authlete } from "@authlete/typescript-sdk";

const authlete = new Authlete({
  bearer: process.env["AUTHLETE_BEARER"] ?? "",
});

async function run() {
  const result = await authlete.authorization.issue({
    serviceId: "<id>",
    authorizationIssueRequest: {
      ticket: "FFgB9gwb_WXh6g1u-UQ8ZI-d_k4B-o-cm7RkVzI8Vnc",
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
import { authorizationIssue } from "@authlete/typescript-sdk/funcs/authorizationIssue.js";

// Use `AuthleteCore` for best tree-shaking performance.
// You can create one instance of it to use across an application.
const authlete = new AuthleteCore({
  bearer: process.env["AUTHLETE_BEARER"] ?? "",
});

async function run() {
  const res = await authorizationIssue(authlete, {
    serviceId: "<id>",
    authorizationIssueRequest: {
      ticket: "FFgB9gwb_WXh6g1u-UQ8ZI-d_k4B-o-cm7RkVzI8Vnc",
      subject: "john",
    },
  });
  if (res.ok) {
    const { value: result } = res;
    console.log(result);
  } else {
    console.log("authorizationIssue failed:", res.error);
  }
}

run();
```

### Parameters

| Parameter                                                                                                                                                                      | Type                                                                                                                                                                           | Required                                                                                                                                                                       | Description                                                                                                                                                                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `request`                                                                                                                                                                      | [operations.AuthAuthorizationIssueApiRequest](../../models/operations/authauthorizationissueapirequest.md)                                                                     | :heavy_check_mark:                                                                                                                                                             | The request object to use for the request.                                                                                                                                     |
| `options`                                                                                                                                                                      | RequestOptions                                                                                                                                                                 | :heavy_minus_sign:                                                                                                                                                             | Used to set various options for making HTTP requests.                                                                                                                          |
| `options.fetchOptions`                                                                                                                                                         | [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request#options)                                                                                        | :heavy_minus_sign:                                                                                                                                                             | Options that are passed to the underlying HTTP request. This can be used to inject extra headers for examples. All `Request` options, except `method` and `body`, are allowed. |
| `options.retries`                                                                                                                                                              | [RetryConfig](../../lib/utils/retryconfig.md)                                                                                                                                  | :heavy_minus_sign:                                                                                                                                                             | Enables retrying HTTP requests under certain failure conditions.                                                                                                               |

### Response

**Promise\<[models.AuthorizationIssueResponse](../../models/authorizationissueresponse.md)\>**

### Errors

| Error Type                  | Status Code                 | Content Type                |
| --------------------------- | --------------------------- | --------------------------- |
| errors.ResultError          | 400, 401, 403               | application/json            |
| errors.ResultError          | 500                         | application/json            |
| errors.AuthleteDefaultError | 4XX, 5XX                    | \*/\*                       |