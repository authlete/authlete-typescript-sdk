# DeviceFlow

## Overview

### Available Operations

* [authorization](#authorization) - Process Device Authorization Request
* [verification](#verification) - Process Device Verification Request
* [complete](#complete) - Complete Device Authorization

## authorization

This API parses request parameters of a [device authorization request](https://datatracker.ietf.org/doc/html/rfc8628#section-3.1)
and returns necessary data for the authorization server implementation to process the device authorization
request further.
### Description
This API is supposed to be called from the within the implementation of the device authorization
endpoint of the service. The service implementation should retrieve the value of `action` from the
response and take the following steps according to the value.
**INTERNAL\_SERVER\_ERROR**
When the value of `action` is `INTERNAL\_SERVER\_ERROR`, it means that the API call from the authorization
server implementation was wrong or that an error occurred in Authlete.
In either case, from a viewpoint of the client application, it is an error on the server side.
Therefore, the authorization server implementation should generate a response to the client application
with "500 Internal Server Error"s and `application/json`.
The value of `responseContent` is a JSON string which describes t he error, so it can be
used as the entity body of the response.
The following illustrates the response which the authorization server implementation should generate
and return to the client application.
```
HTTP/1.1 500 Internal Server Error
Content-Type: application/json
Cache-Control: no-store
Pragma: no-cache
{responseContent}
```
**BAD\_REQUEST**
When the value of `action` is `BAD\_REQUEST`, it means that the request from the client application
is wrong.
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
When the value of `action` is `UNAUTHORIZED`, it means that client authentication of the device authorization
request failed.
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
**OK**
When the value of `action` is `OK`, it means that the device authorization request from the client
application is valid.
The authorization server implementation should generate a response to the client application with
"200 OK" and `application/json`.
The `responseContent` is a JSON string which can be used as the entity body of the response.
The following illustrates the response which the authorization server implementation should generate
and return to the client application.


### Example Usage

<!-- UsageSnippet language="typescript" operationID="device_authorization_api" method="post" path="/api/{serviceId}/device/authorization" -->
```typescript
import { Authlete } from "@authlete/typescript-sdk";

const authlete = new Authlete({
  bearer: process.env["AUTHLETE_BEARER"] ?? "",
});

async function run() {
  const result = await authlete.deviceFlow.authorization({
    serviceId: "<id>",
    deviceAuthorizationRequest: {
      parameters: "client_id=26888344961664&scope=history.read",
      clientId: "26888344961664",
      clientSecret: "SfnYOLkJdofrb_66mTd6q03_SDoDEUnpXtvqFaE4k6L6UcpZzbdVJi2GpBj48AvGeDDllwsTruC62WYqQ_LGog",
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
import { deviceFlowAuthorization } from "@authlete/typescript-sdk/funcs/deviceFlowAuthorization.js";

// Use `AuthleteCore` for best tree-shaking performance.
// You can create one instance of it to use across an application.
const authlete = new AuthleteCore({
  bearer: process.env["AUTHLETE_BEARER"] ?? "",
});

async function run() {
  const res = await deviceFlowAuthorization(authlete, {
    serviceId: "<id>",
    deviceAuthorizationRequest: {
      parameters: "client_id=26888344961664&scope=history.read",
      clientId: "26888344961664",
      clientSecret: "SfnYOLkJdofrb_66mTd6q03_SDoDEUnpXtvqFaE4k6L6UcpZzbdVJi2GpBj48AvGeDDllwsTruC62WYqQ_LGog",
    },
  });
  if (res.ok) {
    const { value: result } = res;
    console.log(result);
  } else {
    console.log("deviceFlowAuthorization failed:", res.error);
  }
}

run();
```

### Parameters

| Parameter                                                                                                                                                                      | Type                                                                                                                                                                           | Required                                                                                                                                                                       | Description                                                                                                                                                                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `request`                                                                                                                                                                      | [operations.DeviceAuthorizationApiRequest](../../models/operations/deviceauthorizationapirequest.md)                                                                           | :heavy_check_mark:                                                                                                                                                             | The request object to use for the request.                                                                                                                                     |
| `options`                                                                                                                                                                      | RequestOptions                                                                                                                                                                 | :heavy_minus_sign:                                                                                                                                                             | Used to set various options for making HTTP requests.                                                                                                                          |
| `options.fetchOptions`                                                                                                                                                         | [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request#options)                                                                                        | :heavy_minus_sign:                                                                                                                                                             | Options that are passed to the underlying HTTP request. This can be used to inject extra headers for examples. All `Request` options, except `method` and `body`, are allowed. |
| `options.retries`                                                                                                                                                              | [RetryConfig](../../lib/utils/retryconfig.md)                                                                                                                                  | :heavy_minus_sign:                                                                                                                                                             | Enables retrying HTTP requests under certain failure conditions.                                                                                                               |

### Response

**Promise\<[models.DeviceAuthorizationResponse](../../models/deviceauthorizationresponse.md)\>**

### Errors

| Error Type                  | Status Code                 | Content Type                |
| --------------------------- | --------------------------- | --------------------------- |
| errors.ResultError          | 400, 401, 403               | application/json            |
| errors.ResultError          | 500                         | application/json            |
| errors.AuthleteDefaultError | 4XX, 5XX                    | \*/\*                       |

## verification

The API returns information associated with a user code.
### Description
After receiving a response from the device authorization endpoint of the authorization server,
the client application shows the end-user the user code and the verification URI which are included
in the device authorization response. Then, the end-user will access the verification URI using
a web browser on another device (typically, a smart phone). In normal implementations, the verification
endpoint will return an HTML page with an input form where the end-user inputs a user code. The
authorization server will receive a user code from the form.
After receiving a user code, the authorization server should call Authlete's `/device/verification`
API with the user code. And then, the authorization server implementation should retrieve the value
of `action` parameter from the API response and take the following steps according to the value.
**SERVER\_ERROR**
When the value of `action` is `SERVER\_ERROR`, it means that an error occurred on Authlete side. The
authorization server implementation should tell the end-user that something wrong happened and
urge her to re-initiate a device flow.
**NOT\_EXIST**
When the value of `action` is `NOT\_EXIST`, it means that the user code does not exist. The authorization
server implementation should tell the end-user that the user code is invalid and urge her to retry
to input a valid user code.
**EXPIRED**
When the value of `action` is `EXPIRED`, it means that the user code has expired. The authorization
server implementation should tell the end-user that the user code has expired and urge her to
re-initiate a device flow.
**VALID**
When the value of `action` is `VALID`, it means that the user code exists, has not expired, and
belongs to the service. The authorization server implementation should interact with the end-user
to ask whether she approves or rejects the authorization request from the device.


### Example Usage

<!-- UsageSnippet language="typescript" operationID="device_verification_api" method="post" path="/api/{serviceId}/device/verification" -->
```typescript
import { Authlete } from "@authlete/typescript-sdk";

const authlete = new Authlete({
  bearer: process.env["AUTHLETE_BEARER"] ?? "",
});

async function run() {
  const result = await authlete.deviceFlow.verification({
    serviceId: "<id>",
    deviceVerificationRequest: {
      userCode: "XWWKPBWVXQ",
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
import { deviceFlowVerification } from "@authlete/typescript-sdk/funcs/deviceFlowVerification.js";

// Use `AuthleteCore` for best tree-shaking performance.
// You can create one instance of it to use across an application.
const authlete = new AuthleteCore({
  bearer: process.env["AUTHLETE_BEARER"] ?? "",
});

async function run() {
  const res = await deviceFlowVerification(authlete, {
    serviceId: "<id>",
    deviceVerificationRequest: {
      userCode: "XWWKPBWVXQ",
    },
  });
  if (res.ok) {
    const { value: result } = res;
    console.log(result);
  } else {
    console.log("deviceFlowVerification failed:", res.error);
  }
}

run();
```

### Parameters

| Parameter                                                                                                                                                                      | Type                                                                                                                                                                           | Required                                                                                                                                                                       | Description                                                                                                                                                                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `request`                                                                                                                                                                      | [operations.DeviceVerificationApiRequest](../../models/operations/deviceverificationapirequest.md)                                                                             | :heavy_check_mark:                                                                                                                                                             | The request object to use for the request.                                                                                                                                     |
| `options`                                                                                                                                                                      | RequestOptions                                                                                                                                                                 | :heavy_minus_sign:                                                                                                                                                             | Used to set various options for making HTTP requests.                                                                                                                          |
| `options.fetchOptions`                                                                                                                                                         | [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request#options)                                                                                        | :heavy_minus_sign:                                                                                                                                                             | Options that are passed to the underlying HTTP request. This can be used to inject extra headers for examples. All `Request` options, except `method` and `body`, are allowed. |
| `options.retries`                                                                                                                                                              | [RetryConfig](../../lib/utils/retryconfig.md)                                                                                                                                  | :heavy_minus_sign:                                                                                                                                                             | Enables retrying HTTP requests under certain failure conditions.                                                                                                               |

### Response

**Promise\<[models.DeviceVerificationResponse](../../models/deviceverificationresponse.md)\>**

### Errors

| Error Type                  | Status Code                 | Content Type                |
| --------------------------- | --------------------------- | --------------------------- |
| errors.ResultError          | 400, 401, 403               | application/json            |
| errors.ResultError          | 500                         | application/json            |
| errors.AuthleteDefaultError | 4XX, 5XX                    | \*/\*                       |

## complete

This API returns information about what action the authorization server should take after it receives
the result of end-user's decision about whether the end-user has approved or rejected a client
application's request.
### Description
In the device flow, an end-user accesses the verification endpoint of the authorization server where
she interacts with the verification endpoint and inputs a user code. The verification endpoint checks
if the user code is valid and then asks the end-user whether she approves or rejects the authorization
request which the user code represents.
After the authorization server receives the decision of the end-user, it should call Authlete's
`/device/complete` API to tell Authlete the decision.
When the end-user was authenticated and authorization was granted to the client by the end-user,
the authorization server should call the API with `result=AUTHORIZED`. In this successful case,
the subject request parameter is mandatory. The API will update the database record so that `/auth/token`
API can generate an access token later.
If the `scope` parameter of the device authorization request included the openid scope, an ID token
is generated. In this case, `sub`, `authTime`, `acr` and `claims` request parameters in the API
call to `/device/complete` affect the ID token.
When the authorization server receives the decision of the end-user and it indicates that she has
rejected to give authorization to the client, the authorization server should call the API with
`result=ACCESS\_DENIED`. In this case, the API will update the database record so that the `/auth/token`
API can generate an error response later. If `errorDescription` and `errorUri` request parameters
are given to the `/device/complete` API, they will be used as the values of `error\_description`
and `error\_uri` response parameters in the error response from the token endpoint.
When the authorization server could not get decision from the end-user for some reasons, the authorization
server should call the API with `result=TRANSACTION\_FAILED`. In this error case, the API will behave
in the same way as in the case of `ACCESS\_DENIED`. The only difference is that `expired\_token` is
used as the value of the `error` response parameter instead of `access\_denied`.
After receiving a response from the `/device/complete` API, the implementation of the authorization
server should retrieve the value of `action` from the response and take the following steps according
to the value.
**SERVER\_ERROR**
When the value of `action` is `SERVER\_ERROR`, it means that an error occurred on Authlete side. The
authorization server implementation should tell the end-user that something wrong happened and
urge her to re-initiate a device flow.
**USER\_CODE\_NOT\_EXIST**
When the value of `action` is `USER\_CODE\_NOT\_EXIST`, it means that the user code included in the API
call does not exist. The authorization server implementation should tell the end-user that the user
code has been invalidated and urge her to re-initiate a device flow.
**USER\_CODE\_EXPIRED**
When the value of `action` is `USER\_CODE\_EXPIRED`, it means that the user code included in the API
call has expired. The authorization server implementation should tell the end-user that the user
code has expired and urge her to re-initiate a device flow.
**INVALID\_REQUEST**
When the value of `action` is `INVALID\_REQUEST`, it means that the API call is invalid. Probably,
the authorization server implementation has some bugs.
**SUCCESS**
When the value of `action` is `SUCCESS`, it means that the API call has been processed successfully.
The authorization server should return a successful response to the web browser the end-user is
using.


### Example Usage

<!-- UsageSnippet language="typescript" operationID="device_complete_api" method="post" path="/api/{serviceId}/device/complete" -->
```typescript
import { Authlete } from "@authlete/typescript-sdk";

const authlete = new Authlete({
  bearer: process.env["AUTHLETE_BEARER"] ?? "",
});

async function run() {
  const result = await authlete.deviceFlow.complete({
    serviceId: "<id>",
    deviceCompleteRequest: {
      userCode: "XWWKPBWVXQ",
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
import { deviceFlowComplete } from "@authlete/typescript-sdk/funcs/deviceFlowComplete.js";

// Use `AuthleteCore` for best tree-shaking performance.
// You can create one instance of it to use across an application.
const authlete = new AuthleteCore({
  bearer: process.env["AUTHLETE_BEARER"] ?? "",
});

async function run() {
  const res = await deviceFlowComplete(authlete, {
    serviceId: "<id>",
    deviceCompleteRequest: {
      userCode: "XWWKPBWVXQ",
      result: "AUTHORIZED",
      subject: "john",
    },
  });
  if (res.ok) {
    const { value: result } = res;
    console.log(result);
  } else {
    console.log("deviceFlowComplete failed:", res.error);
  }
}

run();
```

### Parameters

| Parameter                                                                                                                                                                      | Type                                                                                                                                                                           | Required                                                                                                                                                                       | Description                                                                                                                                                                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `request`                                                                                                                                                                      | [operations.DeviceCompleteApiRequest](../../models/operations/devicecompleteapirequest.md)                                                                                     | :heavy_check_mark:                                                                                                                                                             | The request object to use for the request.                                                                                                                                     |
| `options`                                                                                                                                                                      | RequestOptions                                                                                                                                                                 | :heavy_minus_sign:                                                                                                                                                             | Used to set various options for making HTTP requests.                                                                                                                          |
| `options.fetchOptions`                                                                                                                                                         | [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request#options)                                                                                        | :heavy_minus_sign:                                                                                                                                                             | Options that are passed to the underlying HTTP request. This can be used to inject extra headers for examples. All `Request` options, except `method` and `body`, are allowed. |
| `options.retries`                                                                                                                                                              | [RetryConfig](../../lib/utils/retryconfig.md)                                                                                                                                  | :heavy_minus_sign:                                                                                                                                                             | Enables retrying HTTP requests under certain failure conditions.                                                                                                               |

### Response

**Promise\<[models.DeviceCompleteResponse](../../models/devicecompleteresponse.md)\>**

### Errors

| Error Type                  | Status Code                 | Content Type                |
| --------------------------- | --------------------------- | --------------------------- |
| errors.ResultError          | 400, 401, 403               | application/json            |
| errors.ResultError          | 500                         | application/json            |
| errors.AuthleteDefaultError | 4XX, 5XX                    | \*/\*                       |