# DynamicClientRegistration

## Overview

### Available Operations

* [register](#register) - Register Client
* [get](#get) - Get Client
* [update](#update) - Update Client
* [delete](#delete) - Delete Client

## register

Register a client. This API is supposed to be used to implement a client registration endpoint that
complies with [RFC 7591](https://datatracker.ietf.org/doc/html/rfc7591) (OAuth 2.0 Dynamic Client
Registration Protocol).
### Description
This API is supposed to be called from the within the implementation of the client registration
endpoint of the authorization server. The authorization server implementation should retrieve
the value of `action` from the response and take the following steps according to the value.
**INTERNAL\_SERVER\_ERROR**
When the value of `action` is `INTERNAL\_SERVER\_ERROR`, it means that the API call from the authorization
server implementation was wrong or that an error occurred in Authlete.
In either case, from a viewpoint of the client or developer, it is an error on the server side.
Therefore, the authorization server implementation should generate a response with "500 Internal
Server Error"s and `application/json`.
The value of `responseContent` is a JSON string which describes the error, so it can be used as
the entity body of the response.
The following illustrates the response which the authorization server implementation should generate
and return to the client or developer.
```
HTTP/1.1 500 Internal Server Error
Content-Type: application/json
Cache-Control: no-store
Pragma: no-cache
{responseContent}
```
The endpoint implementation may return another different response to the client or developer since
"500 Internal Server Error" is not required by the specification.
**BAD\_REQUEST**
When the value of `action` is `BAD\_REQUEST`, it means that the request from the client or developer
was wrong.
The authorization server implementation should generate a response with "400 Bad Request" and `application/json`.
The value of `responseContent` is a JSON string which describes the error, so it can be used
as the entity body of the response.
The following illustrates the response which the authorization server implementation should generate
and return to the client or developer.
```
HTTP/1.1 400 Bad Request
Content-Type: application/json
Cache-Control: no-store
Pragma: no-cache
{responseContent}
```
**CREATED**
When the value of `action` is `CREATED`, it means that the request from the client or developer is
valid.
The authorization server implementation should generate a response to the client or developer with
"201 CREATED" and `application/json`.
The `responseContent` a JSON string which can be used as the entity body of the response.
The following illustrates the response which the authorization server implementation should generate
and return to the client or developer.
```
HTTP/1.1 201 CREATED
Content-Type: application/json
Cache-Control: no-store
Pragma: no-cache
{responseContent}
```


### Example Usage

<!-- UsageSnippet language="typescript" operationID="client_registration_api" method="post" path="/api/{serviceId}/client/registration" -->
```typescript
import { Authlete } from "@authlete/typescript-sdk";

const authlete = new Authlete({
  bearer: process.env["AUTHLETE_BEARER"] ?? "",
});

async function run() {
  const result = await authlete.dynamicClientRegistration.register({
    serviceId: "<id>",
    requestBody: {
      json: "{ \"client_name\": \"My Dynamic Client\" }",
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
import { dynamicClientRegistrationRegister } from "@authlete/typescript-sdk/funcs/dynamicClientRegistrationRegister.js";

// Use `AuthleteCore` for best tree-shaking performance.
// You can create one instance of it to use across an application.
const authlete = new AuthleteCore({
  bearer: process.env["AUTHLETE_BEARER"] ?? "",
});

async function run() {
  const res = await dynamicClientRegistrationRegister(authlete, {
    serviceId: "<id>",
    requestBody: {
      json: "{ \"client_name\": \"My Dynamic Client\" }",
    },
  });
  if (res.ok) {
    const { value: result } = res;
    console.log(result);
  } else {
    console.log("dynamicClientRegistrationRegister failed:", res.error);
  }
}

run();
```

### Parameters

| Parameter                                                                                                                                                                      | Type                                                                                                                                                                           | Required                                                                                                                                                                       | Description                                                                                                                                                                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `request`                                                                                                                                                                      | [operations.ClientRegistrationApiRequest](../../models/operations/clientregistrationapirequest.md)                                                                             | :heavy_check_mark:                                                                                                                                                             | The request object to use for the request.                                                                                                                                     |
| `options`                                                                                                                                                                      | RequestOptions                                                                                                                                                                 | :heavy_minus_sign:                                                                                                                                                             | Used to set various options for making HTTP requests.                                                                                                                          |
| `options.fetchOptions`                                                                                                                                                         | [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request#options)                                                                                        | :heavy_minus_sign:                                                                                                                                                             | Options that are passed to the underlying HTTP request. This can be used to inject extra headers for examples. All `Request` options, except `method` and `body`, are allowed. |
| `options.retries`                                                                                                                                                              | [RetryConfig](../../lib/utils/retryconfig.md)                                                                                                                                  | :heavy_minus_sign:                                                                                                                                                             | Enables retrying HTTP requests under certain failure conditions.                                                                                                               |

### Response

**Promise\<[models.ClientRegistrationResponse](../../models/clientregistrationresponse.md)\>**

### Errors

| Error Type                  | Status Code                 | Content Type                |
| --------------------------- | --------------------------- | --------------------------- |
| errors.ResultError          | 400, 401, 403               | application/json            |
| errors.ResultError          | 500                         | application/json            |
| errors.AuthleteDefaultError | 4XX, 5XX                    | \*/\*                       |

## get

Get a dynamically registered client. This API is supposed to be used to implement a client registration
management endpoint that complies with [RFC 7592](https://datatracker.ietf.org/doc/html/rfc7592)
(OAuth 2.0 Dynamic Registration Management).
### Description
This API is supposed to be called from the within the implementation of the client registration
management endpoint of the authorization server. The authorization server implementation should
retrieve the value of `action` from the response and take the following steps according to the value.
**INTERNAL\_SERVER\_ERROR**
When the value of `action` is `INTERNAL\_SERVER\_ERROR`, it means that the API call from the authorization
server implementation was wrong or that an error occurred in Authlete.
In either case, from a viewpoint of the client or developer, it is an error on the server side.
Therefore, the authorization server implementation should generate a response to the client or developer
with "500 Internal Server Error"s and `application/json`.
The value of `responseContent` is a JSON string which describes the error, so it can be used as
the entity body of the response.
The following illustrates the response which the authorization server implementation should generate
and return to the client or developer.
```
HTTP/1.1 500 Internal Server Error
Content-Type: application/json
Cache-Control: no-store
Pragma: no-cache
{responseContent}
```
The endpoint implementation may return another different response to the client or developer since
"500 Internal Server Error" is not required by the specification.
**BAD\_REQUEST**
When the value of `action` is `BAD\_REQUEST`, it means that the request from the client or developer
was wrong.
The authorization server implementation should generate a response to the client or developer with
"400 Bad Request" and `application/json`.
The value of `responseContent` is a JSON string which describes the error, so it can be used as
the entity body of the response.
The following illustrates the response which the authorization server implementation should generate
and return to the client or developer.
```
HTTP/1.1 400 Bad Request
Content-Type: application/json
Cache-Control: no-store
Pragma: no-cache
{responseContent}
```
**UNAUTHORIZED**
When the value of `action` is `UNAUTHORIZED`, it means that the registration access token used by
the client configuration request (RFC 7592) is invalid, or the client application which the token
is tied to does not exist any longer or is invalid.
The HTTP status of the response returned to the client application must be "401 Unauthorized" and
the content type must be `application/json`.
The value of `responseContent` is a JSON string which describes the error, so it can be used as
the entity body of the response.
The following illustrates the response which the endpoint implementation should generate and return
to the client application.
```
HTTP/1.1 401 Unauthorized
Content-Type: application/json
Cache-Control: no-store
Pragma: no-cache
{responseContent}
```
NOTE: The `UNAUTHORIZED` value was added in October, 2021. See the description of
`Service.unauthorizedOnClientConfigSupported` for details.
**OK**
When the value of `action` is `OK`, it means that the request from the client or developer is valid.
The authorization server implementation should generate a response to the client or developer with
"200 OK" and `application/json`.
The `responseContent` a JSON string which can be used as the entity body of the response.
The following illustrates the response which the authorization server implementation should generate
and return to the client or developer.
```
HTTP/1.1 200 OK
Content-Type: application/json
Cache-Control: no-store
Pragma: no-cache
{responseContent}
```


### Example Usage

<!-- UsageSnippet language="typescript" operationID="client_registration_get_api" method="post" path="/api/{serviceId}/client/registration/get" -->
```typescript
import { Authlete } from "@authlete/typescript-sdk";

const authlete = new Authlete({
  bearer: process.env["AUTHLETE_BEARER"] ?? "",
});

async function run() {
  const result = await authlete.dynamicClientRegistration.get({
    serviceId: "<id>",
    requestBody: {
      token: "qs4Tu5TV7qqDYT93bFs6ISyhTByMF9o-54GY4JU5vTA",
      clientId: "26837717140341",
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
import { dynamicClientRegistrationGet } from "@authlete/typescript-sdk/funcs/dynamicClientRegistrationGet.js";

// Use `AuthleteCore` for best tree-shaking performance.
// You can create one instance of it to use across an application.
const authlete = new AuthleteCore({
  bearer: process.env["AUTHLETE_BEARER"] ?? "",
});

async function run() {
  const res = await dynamicClientRegistrationGet(authlete, {
    serviceId: "<id>",
    requestBody: {
      token: "qs4Tu5TV7qqDYT93bFs6ISyhTByMF9o-54GY4JU5vTA",
      clientId: "26837717140341",
    },
  });
  if (res.ok) {
    const { value: result } = res;
    console.log(result);
  } else {
    console.log("dynamicClientRegistrationGet failed:", res.error);
  }
}

run();
```

### Parameters

| Parameter                                                                                                                                                                      | Type                                                                                                                                                                           | Required                                                                                                                                                                       | Description                                                                                                                                                                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `request`                                                                                                                                                                      | [operations.ClientRegistrationGetApiRequest](../../models/operations/clientregistrationgetapirequest.md)                                                                       | :heavy_check_mark:                                                                                                                                                             | The request object to use for the request.                                                                                                                                     |
| `options`                                                                                                                                                                      | RequestOptions                                                                                                                                                                 | :heavy_minus_sign:                                                                                                                                                             | Used to set various options for making HTTP requests.                                                                                                                          |
| `options.fetchOptions`                                                                                                                                                         | [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request#options)                                                                                        | :heavy_minus_sign:                                                                                                                                                             | Options that are passed to the underlying HTTP request. This can be used to inject extra headers for examples. All `Request` options, except `method` and `body`, are allowed. |
| `options.retries`                                                                                                                                                              | [RetryConfig](../../lib/utils/retryconfig.md)                                                                                                                                  | :heavy_minus_sign:                                                                                                                                                             | Enables retrying HTTP requests under certain failure conditions.                                                                                                               |

### Response

**Promise\<[models.ClientRegistrationResponse](../../models/clientregistrationresponse.md)\>**

### Errors

| Error Type                  | Status Code                 | Content Type                |
| --------------------------- | --------------------------- | --------------------------- |
| errors.ResultError          | 400, 401, 403               | application/json            |
| errors.ResultError          | 500                         | application/json            |
| errors.AuthleteDefaultError | 4XX, 5XX                    | \*/\*                       |

## update

Update a dynamically registered client. This API is supposed to be used to implement a client
registration management endpoint that complies with [RFC 7592](https://datatracker.ietf.org/doc/html/rfc7592)
(OAuth 2.0 Dynamic Registration Management).
### Description
This API is supposed to be called from the within the implementation of the client registration
management endpoint of the authorization server. The authorization server implementation should
retrieve the value of `action` from the response and take the following steps according to the value.
**INTERNAL\_SERVER\_ERROR**
When the value of `action` is `INTERNAL\_SERVER\_ERROR`, it means that the API call from the authorization
server implementation was wrong or that an error occurred in Authlete.
In either case, from a viewpoint of the client or developer, it is an error on the server side.
Therefore, the authorization server implementation should generate a response with "500 Internal
Server Error"s and `application/json`.
The value of `responseContent` is a JSON string which describes the error, so it can be used as
the entity body of the response.
The following illustrates the response which the authorization server implementation should generate
and return to the client or developer.
```
HTTP/1.1 500 Internal Server Error
Content-Type: application/json
Cache-Control: no-store
Pragma: no-cache
{responseContent}
```
The endpoint implementation may return another different response to the client or developer since
"500 Internal Server Error" is not required by the specification.
**BAD\_REQUEST**
When the value of `action` is `BAD\_REQUEST`, it means that the request from the client or developer
was wrong.
The authorization server implementation should generate a response with "400 Bad Request" and `application/json`.
The value of `responseContent` is a JSON string which describes the error, so it can be used as
the entity body of the response.
The following illustrates the response which the authorization server implementation should generate
and return to the client or developer.
```
HTTP/1.1 400 Bad Request
Content-Type: application/json
Cache-Control: no-store
Pragma: no-cache
{responseContent}
```
**UNAUTHORIZED**
When the value of `action` is `UNAUTHORIZED`, it means that the registration access token used by
the client configuration request (RFC 7592) is invalid, or the client application which the token
is tied to does not exist any longer or is invalid.
The HTTP status of the response returned to the client application must be "401 Unauthorized" and
the content type must be `application/json`.
The value of `responseContent` is a JSON string which describes the error, so it can be used as
the entity body of the response.
The following illustrates the response which the endpoint implementation should generate and return
to the client application.
```
HTTP/1.1 401 Unauthorized
Content-Type: application/json
Cache-Control: no-store
Pragma: no-cache
{responseContent}
```
NOTE: The `UNAUTHORIZED` value was added in October, 2021. See the description of
`Service.unauthorizedOnClientConfigSupported` for details.
**UPDATED**
When the value of `action` is `UPDATED`, it means that the request from the client or developer is
valid.
The authorization server implementation should generate a response to the client or developer with
"200 OK" and `application/json`.
The `responseContent` a JSON string which can be used as the entity body of the response.
The following illustrates the response which the authorization server implementation should generate
and return to the client or developer.
```
HTTP/1.1 200 OK
Content-Type: application/json
Cache-Control: no-store
Pragma: no-cache
{responseContent}
```


### Example Usage

<!-- UsageSnippet language="typescript" operationID="client_registration_update_api" method="post" path="/api/{serviceId}/client/registration/update" -->
```typescript
import { Authlete } from "@authlete/typescript-sdk";

const authlete = new Authlete({
  bearer: process.env["AUTHLETE_BEARER"] ?? "",
});

async function run() {
  const result = await authlete.dynamicClientRegistration.update({
    serviceId: "<id>",
    requestBody: {
      json: "{\"client_name\":\"My Updated Dynamic Client\",\"default_max_age\":0,\"registration_client_uri\":\"https://my-service.example.com/dcr/register/26837717140341\",\"client_id\":\"26837717140341\",\"token_endpoint_auth_method\":\"client_secret_basic\",\"require_pushed_authorization_requests\":false,\"backchannel_user_code_parameter\":false,\"client_secret\":\"bMsjvZm2FE1_mqJgxhmYj_Wr8rA0Pia_A_j-V076qQm6-P1edKB055W579GBe7MSbOdxZ3dJKsKinCtdIFwxpw\",\"tls_client_certificate_bound_access_tokens\":false,\"id_token_signed_response_alg\":\"RS256\",\"subject_type\":\"public\",\"require_signed_request_object\":false}",
      token: "qs4Tu5TV7qqDYT93bFs6ISyhTByMF9o-54GY4JU5vTA",
      clientId: "26837717140341",
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
import { dynamicClientRegistrationUpdate } from "@authlete/typescript-sdk/funcs/dynamicClientRegistrationUpdate.js";

// Use `AuthleteCore` for best tree-shaking performance.
// You can create one instance of it to use across an application.
const authlete = new AuthleteCore({
  bearer: process.env["AUTHLETE_BEARER"] ?? "",
});

async function run() {
  const res = await dynamicClientRegistrationUpdate(authlete, {
    serviceId: "<id>",
    requestBody: {
      json: "{\"client_name\":\"My Updated Dynamic Client\",\"default_max_age\":0,\"registration_client_uri\":\"https://my-service.example.com/dcr/register/26837717140341\",\"client_id\":\"26837717140341\",\"token_endpoint_auth_method\":\"client_secret_basic\",\"require_pushed_authorization_requests\":false,\"backchannel_user_code_parameter\":false,\"client_secret\":\"bMsjvZm2FE1_mqJgxhmYj_Wr8rA0Pia_A_j-V076qQm6-P1edKB055W579GBe7MSbOdxZ3dJKsKinCtdIFwxpw\",\"tls_client_certificate_bound_access_tokens\":false,\"id_token_signed_response_alg\":\"RS256\",\"subject_type\":\"public\",\"require_signed_request_object\":false}",
      token: "qs4Tu5TV7qqDYT93bFs6ISyhTByMF9o-54GY4JU5vTA",
      clientId: "26837717140341",
    },
  });
  if (res.ok) {
    const { value: result } = res;
    console.log(result);
  } else {
    console.log("dynamicClientRegistrationUpdate failed:", res.error);
  }
}

run();
```

### Parameters

| Parameter                                                                                                                                                                      | Type                                                                                                                                                                           | Required                                                                                                                                                                       | Description                                                                                                                                                                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `request`                                                                                                                                                                      | [operations.ClientRegistrationUpdateApiRequest](../../models/operations/clientregistrationupdateapirequest.md)                                                                 | :heavy_check_mark:                                                                                                                                                             | The request object to use for the request.                                                                                                                                     |
| `options`                                                                                                                                                                      | RequestOptions                                                                                                                                                                 | :heavy_minus_sign:                                                                                                                                                             | Used to set various options for making HTTP requests.                                                                                                                          |
| `options.fetchOptions`                                                                                                                                                         | [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request#options)                                                                                        | :heavy_minus_sign:                                                                                                                                                             | Options that are passed to the underlying HTTP request. This can be used to inject extra headers for examples. All `Request` options, except `method` and `body`, are allowed. |
| `options.retries`                                                                                                                                                              | [RetryConfig](../../lib/utils/retryconfig.md)                                                                                                                                  | :heavy_minus_sign:                                                                                                                                                             | Enables retrying HTTP requests under certain failure conditions.                                                                                                               |

### Response

**Promise\<[models.ClientRegistrationResponse](../../models/clientregistrationresponse.md)\>**

### Errors

| Error Type                  | Status Code                 | Content Type                |
| --------------------------- | --------------------------- | --------------------------- |
| errors.ResultError          | 400, 401, 403               | application/json            |
| errors.ResultError          | 500                         | application/json            |
| errors.AuthleteDefaultError | 4XX, 5XX                    | \*/\*                       |

## delete

Delete a dynamically registered client. This API is supposed to be used to implement a client
registration management endpoint that complies with [RFC 7592](https://datatracker.ietf.org/doc/html/rfc7592)
(OAuth 2.0 Dynamic Registration Management).
### Description
This API is supposed to be called from the within the implementation of the client registration
management endpoint of the authorization server. The authorization server implementation should
retrieve the value of `action` from the response and take the following steps according to the value.
**INTERNAL\_SERVER\_ERROR**
When the value of `action` is `INTERNAL\_SERVER\_ERROR`, it means that the API call from the authorization
server implementation was wrong or that an error occurred in Authlete.
In either case, from a viewpoint of the client or developer, it is an error on the server side.
Therefore, the authorization server implementation should generate a response with "500 Internal
Server Error"s and `application/json`.
The value of `responseContent` is a JSON string which describes the error, so it can be used as
the entity body of the response.
The following illustrates the response which the authorization server implementation should generate
and return to the client or developer.
```
HTTP/1.1 500 Internal Server Error
Content-Type: application/json
Cache-Control: no-store
Pragma: no-cache
{responseContent}
```
The endpoint implementation may return another different response to the client or developer since
"500 Internal Server Error" is not required by the specification.
**BAD\_REQUEST**
When the value of `action` is `BAD\_REQUEST`, it means that the request from the client or developer
was wrong.
The authorization server implementation should generate a response with "400 Bad Request" and `application/json`.
The value of `responseContent` is a JSON string which describes the error, so it can be used as
the entity body of the response.
The following illustrates the response which the authorization server implementation should generate
and return to the client or developer.
```
HTTP/1.1 400 Bad Request
Content-Type: application/json
Cache-Control: no-store
Pragma: no-cache
{responseContent}
```
**UNAUTHORIZED**
When the value of `action` is `UNAUTHORIZED`, it means that the registration access token used by
the client configuration request (RFC 7592) is invalid, or the client application which the token
is tied to does not exist any longer or is invalid.
The HTTP status of the response returned to the client application must be "401 Unauthorized" and
the content type must be `application/json`.
The value of `responseContent` is a JSON string which describes the error, so it can be used as
the entity body of the response.
The following illustrates the response which the endpoint implementation should generate and return
to the client application.
```
HTTP/1.1 401 Unauthorized
Content-Type: application/json
Cache-Control: no-store
Pragma: no-cache
{responseContent}
```
NOTE: The `UNAUTHORIZED` value was added in October, 2021. See the description of
`Service.unauthorizedOnClientConfigSupported` for details.
**DELETED**
When the value of `action` is `DELETED`, it means that the request from the client or developer is
valid.
The authorization server implementation should generate a response to the client or developer with
"204 No Content".
The following illustrates the response which the authorization server implementation should generate
and return to the client or developer.
```
HTTP/1.1 204 No Content
Cache-Control: no-store
Pragma: no-cache
```


### Example Usage

<!-- UsageSnippet language="typescript" operationID="client_registration_delete_api" method="post" path="/api/{serviceId}/client/registration/delete" -->
```typescript
import { Authlete } from "@authlete/typescript-sdk";

const authlete = new Authlete({
  bearer: process.env["AUTHLETE_BEARER"] ?? "",
});

async function run() {
  const result = await authlete.dynamicClientRegistration.delete({
    serviceId: "<id>",
    requestBody: {
      token: "qs4Tu5TV7qqDYT93bFs6ISyhTByMF9o-54GY4JU5vTA",
      clientId: "26837717140341",
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
import { dynamicClientRegistrationDelete } from "@authlete/typescript-sdk/funcs/dynamicClientRegistrationDelete.js";

// Use `AuthleteCore` for best tree-shaking performance.
// You can create one instance of it to use across an application.
const authlete = new AuthleteCore({
  bearer: process.env["AUTHLETE_BEARER"] ?? "",
});

async function run() {
  const res = await dynamicClientRegistrationDelete(authlete, {
    serviceId: "<id>",
    requestBody: {
      token: "qs4Tu5TV7qqDYT93bFs6ISyhTByMF9o-54GY4JU5vTA",
      clientId: "26837717140341",
    },
  });
  if (res.ok) {
    const { value: result } = res;
    console.log(result);
  } else {
    console.log("dynamicClientRegistrationDelete failed:", res.error);
  }
}

run();
```

### Parameters

| Parameter                                                                                                                                                                      | Type                                                                                                                                                                           | Required                                                                                                                                                                       | Description                                                                                                                                                                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `request`                                                                                                                                                                      | [operations.ClientRegistrationDeleteApiRequest](../../models/operations/clientregistrationdeleteapirequest.md)                                                                 | :heavy_check_mark:                                                                                                                                                             | The request object to use for the request.                                                                                                                                     |
| `options`                                                                                                                                                                      | RequestOptions                                                                                                                                                                 | :heavy_minus_sign:                                                                                                                                                             | Used to set various options for making HTTP requests.                                                                                                                          |
| `options.fetchOptions`                                                                                                                                                         | [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request#options)                                                                                        | :heavy_minus_sign:                                                                                                                                                             | Options that are passed to the underlying HTTP request. This can be used to inject extra headers for examples. All `Request` options, except `method` and `body`, are allowed. |
| `options.retries`                                                                                                                                                              | [RetryConfig](../../lib/utils/retryconfig.md)                                                                                                                                  | :heavy_minus_sign:                                                                                                                                                             | Enables retrying HTTP requests under certain failure conditions.                                                                                                               |

### Response

**Promise\<[models.ClientRegistrationResponse](../../models/clientregistrationresponse.md)\>**

### Errors

| Error Type                  | Status Code                 | Content Type                |
| --------------------------- | --------------------------- | --------------------------- |
| errors.ResultError          | 400, 401, 403               | application/json            |
| errors.ResultError          | 500                         | application/json            |
| errors.AuthleteDefaultError | 4XX, 5XX                    | \*/\*                       |