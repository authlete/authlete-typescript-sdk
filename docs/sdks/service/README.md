# Service

## Overview

### Available Operations

* [get](#get) - Get Service
* [list](#list) - List Services
* [create](#create) - Create Service
* [update](#update) - Update Service
* [delete](#delete) - Delete Service ⚡
* [getConfiguration](#getconfiguration) - Get Service Configuration

## get

Get a service.

If the access token can only view or modify clients underneath this service, but does not
have access to view this service directly, a limited view of the service will be returned.


### Example Usage

<!-- UsageSnippet language="typescript" operationID="service_get_api" method="get" path="/api/{serviceId}/service/get" -->
```typescript
import { Authlete } from "@authlete/typescript-sdk";

const authlete = new Authlete({
  bearer: process.env["AUTHLETE_BEARER"] ?? "",
});

async function run() {
  const result = await authlete.service.get({
    serviceId: "<id>",
  });

  console.log(result);
}

run();
```

### Standalone function

The standalone function version of this method:

```typescript
import { AuthleteCore } from "@authlete/typescript-sdk/core.js";
import { serviceGet } from "@authlete/typescript-sdk/funcs/serviceGet.js";

// Use `AuthleteCore` for best tree-shaking performance.
// You can create one instance of it to use across an application.
const authlete = new AuthleteCore({
  bearer: process.env["AUTHLETE_BEARER"] ?? "",
});

async function run() {
  const res = await serviceGet(authlete, {
    serviceId: "<id>",
  });
  if (res.ok) {
    const { value: result } = res;
    console.log(result);
  } else {
    console.log("serviceGet failed:", res.error);
  }
}

run();
```

### Parameters

| Parameter                                                                                                                                                                      | Type                                                                                                                                                                           | Required                                                                                                                                                                       | Description                                                                                                                                                                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `request`                                                                                                                                                                      | [operations.ServiceGetApiRequest](../../models/operations/servicegetapirequest.md)                                                                                             | :heavy_check_mark:                                                                                                                                                             | The request object to use for the request.                                                                                                                                     |
| `options`                                                                                                                                                                      | RequestOptions                                                                                                                                                                 | :heavy_minus_sign:                                                                                                                                                             | Used to set various options for making HTTP requests.                                                                                                                          |
| `options.fetchOptions`                                                                                                                                                         | [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request#options)                                                                                        | :heavy_minus_sign:                                                                                                                                                             | Options that are passed to the underlying HTTP request. This can be used to inject extra headers for examples. All `Request` options, except `method` and `body`, are allowed. |
| `options.retries`                                                                                                                                                              | [RetryConfig](../../lib/utils/retryconfig.md)                                                                                                                                  | :heavy_minus_sign:                                                                                                                                                             | Enables retrying HTTP requests under certain failure conditions.                                                                                                               |

### Response

**Promise\<[models.Service](../../models/service.md)\>**

### Errors

| Error Type                  | Status Code                 | Content Type                |
| --------------------------- | --------------------------- | --------------------------- |
| errors.ResultError          | 400, 401, 403               | application/json            |
| errors.ResultError          | 500                         | application/json            |
| errors.AuthleteDefaultError | 4XX, 5XX                    | \*/\*                       |

## list

Get a list of services.

If the access token can only view or modify clients underneath a service, but does not
have access to view that service directly, a limited view of the service will be returned.
Otherwise, all properties of the service are returned.

If the access token is an administrative token, this returns a list of all services on the Authlete instance.
Otherwise, all services that the access token can view, even in a limited fashion, are returned.


### Example Usage

<!-- UsageSnippet language="typescript" operationID="service_get_list_api" method="get" path="/api/service/get/list" -->
```typescript
import { Authlete } from "@authlete/typescript-sdk";

const authlete = new Authlete({
  bearer: process.env["AUTHLETE_BEARER"] ?? "",
});

async function run() {
  const result = await authlete.service.list();

  console.log(result);
}

run();
```

### Standalone function

The standalone function version of this method:

```typescript
import { AuthleteCore } from "@authlete/typescript-sdk/core.js";
import { serviceList } from "@authlete/typescript-sdk/funcs/serviceList.js";

// Use `AuthleteCore` for best tree-shaking performance.
// You can create one instance of it to use across an application.
const authlete = new AuthleteCore({
  bearer: process.env["AUTHLETE_BEARER"] ?? "",
});

async function run() {
  const res = await serviceList(authlete);
  if (res.ok) {
    const { value: result } = res;
    console.log(result);
  } else {
    console.log("serviceList failed:", res.error);
  }
}

run();
```

### Parameters

| Parameter                                                                                                                                                                      | Type                                                                                                                                                                           | Required                                                                                                                                                                       | Description                                                                                                                                                                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `request`                                                                                                                                                                      | [operations.ServiceGetListApiRequest](../../models/operations/servicegetlistapirequest.md)                                                                                     | :heavy_check_mark:                                                                                                                                                             | The request object to use for the request.                                                                                                                                     |
| `options`                                                                                                                                                                      | RequestOptions                                                                                                                                                                 | :heavy_minus_sign:                                                                                                                                                             | Used to set various options for making HTTP requests.                                                                                                                          |
| `options.fetchOptions`                                                                                                                                                         | [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request#options)                                                                                        | :heavy_minus_sign:                                                                                                                                                             | Options that are passed to the underlying HTTP request. This can be used to inject extra headers for examples. All `Request` options, except `method` and `body`, are allowed. |
| `options.retries`                                                                                                                                                              | [RetryConfig](../../lib/utils/retryconfig.md)                                                                                                                                  | :heavy_minus_sign:                                                                                                                                                             | Enables retrying HTTP requests under certain failure conditions.                                                                                                               |

### Response

**Promise\<[models.ServiceGetListResponse](../../models/servicegetlistresponse.md)\>**

### Errors

| Error Type                  | Status Code                 | Content Type                |
| --------------------------- | --------------------------- | --------------------------- |
| errors.ResultError          | 400, 401, 403               | application/json            |
| errors.ResultError          | 500                         | application/json            |
| errors.AuthleteDefaultError | 4XX, 5XX                    | \*/\*                       |

## create

Create a new service.


### Example Usage

<!-- UsageSnippet language="typescript" operationID="service_create_api" method="post" path="/api/service/create" -->
```typescript
import { Authlete } from "@authlete/typescript-sdk";

const authlete = new Authlete({
  bearer: process.env["AUTHLETE_BEARER"] ?? "",
});

async function run() {
  const result = await authlete.service.create({
    serviceName: "My service",
    issuer: "https://my-service.example.com",
    clientIdAliasEnabled: true,
    supportedGrantTypes: [
      "AUTHORIZATION_CODE",
      "REFRESH_TOKEN",
    ],
    supportedResponseTypes: [
      "CODE",
    ],
    authorizationEndpoint: "https://my-service.example.com/authz",
    pkceRequired: true,
    tokenEndpoint: "https://my-service.example.com/token",
    supportedTokenAuthMethods: [
      "CLIENT_SECRET_BASIC",
    ],
    revocationEndpoint: "https://my-service.example.com/revocation",
    supportedRevocationAuthMethods: [
      "CLIENT_SECRET_BASIC",
    ],
    introspectionEndpoint: "https://my-service.example.com/introspection",
    supportedIntrospectionAuthMethods: [
      "CLIENT_SECRET_BASIC",
    ],
    accessTokenType: "Bearer",
    accessTokenDuration: 3600,
    refreshTokenDuration: 3600,
    supportedScopes: [
      {
        name: "timeline.read",
        defaultEntry: false,
        description: "A permission to read your timeline.",
      },
      {
        name: "history.read",
        defaultEntry: false,
        description: "A permission to read your history.",
      },
    ],
    attributes: [
      {
        key: "attribute1-key",
        value: "attribute1-value",
      },
      {
        key: "attribute2-key",
        value: "attribute2-value",
      },
    ],
  });

  console.log(result);
}

run();
```

### Standalone function

The standalone function version of this method:

```typescript
import { AuthleteCore } from "@authlete/typescript-sdk/core.js";
import { serviceCreate } from "@authlete/typescript-sdk/funcs/serviceCreate.js";

// Use `AuthleteCore` for best tree-shaking performance.
// You can create one instance of it to use across an application.
const authlete = new AuthleteCore({
  bearer: process.env["AUTHLETE_BEARER"] ?? "",
});

async function run() {
  const res = await serviceCreate(authlete, {
    serviceName: "My service",
    issuer: "https://my-service.example.com",
    clientIdAliasEnabled: true,
    supportedGrantTypes: [
      "AUTHORIZATION_CODE",
      "REFRESH_TOKEN",
    ],
    supportedResponseTypes: [
      "CODE",
    ],
    authorizationEndpoint: "https://my-service.example.com/authz",
    pkceRequired: true,
    tokenEndpoint: "https://my-service.example.com/token",
    supportedTokenAuthMethods: [
      "CLIENT_SECRET_BASIC",
    ],
    revocationEndpoint: "https://my-service.example.com/revocation",
    supportedRevocationAuthMethods: [
      "CLIENT_SECRET_BASIC",
    ],
    introspectionEndpoint: "https://my-service.example.com/introspection",
    supportedIntrospectionAuthMethods: [
      "CLIENT_SECRET_BASIC",
    ],
    accessTokenType: "Bearer",
    accessTokenDuration: 3600,
    refreshTokenDuration: 3600,
    supportedScopes: [
      {
        name: "timeline.read",
        defaultEntry: false,
        description: "A permission to read your timeline.",
      },
      {
        name: "history.read",
        defaultEntry: false,
        description: "A permission to read your history.",
      },
    ],
    attributes: [
      {
        key: "attribute1-key",
        value: "attribute1-value",
      },
      {
        key: "attribute2-key",
        value: "attribute2-value",
      },
    ],
  });
  if (res.ok) {
    const { value: result } = res;
    console.log(result);
  } else {
    console.log("serviceCreate failed:", res.error);
  }
}

run();
```

### Parameters

| Parameter                                                                                                                                                                      | Type                                                                                                                                                                           | Required                                                                                                                                                                       | Description                                                                                                                                                                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `request`                                                                                                                                                                      | [models.ServiceInput](../../models/serviceinput.md)                                                                                                                            | :heavy_check_mark:                                                                                                                                                             | The request object to use for the request.                                                                                                                                     |
| `options`                                                                                                                                                                      | RequestOptions                                                                                                                                                                 | :heavy_minus_sign:                                                                                                                                                             | Used to set various options for making HTTP requests.                                                                                                                          |
| `options.fetchOptions`                                                                                                                                                         | [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request#options)                                                                                        | :heavy_minus_sign:                                                                                                                                                             | Options that are passed to the underlying HTTP request. This can be used to inject extra headers for examples. All `Request` options, except `method` and `body`, are allowed. |
| `options.retries`                                                                                                                                                              | [RetryConfig](../../lib/utils/retryconfig.md)                                                                                                                                  | :heavy_minus_sign:                                                                                                                                                             | Enables retrying HTTP requests under certain failure conditions.                                                                                                               |

### Response

**Promise\<[models.Service](../../models/service.md)\>**

### Errors

| Error Type                  | Status Code                 | Content Type                |
| --------------------------- | --------------------------- | --------------------------- |
| errors.ResultError          | 400, 401, 403               | application/json            |
| errors.ResultError          | 500                         | application/json            |
| errors.AuthleteDefaultError | 4XX, 5XX                    | \*/\*                       |

## update

Update a service.


### Example Usage

<!-- UsageSnippet language="typescript" operationID="service_update_api" method="post" path="/api/{serviceId}/service/update" -->
```typescript
import { Authlete } from "@authlete/typescript-sdk";

const authlete = new Authlete({
  bearer: process.env["AUTHLETE_BEARER"] ?? "",
});

async function run() {
  const result = await authlete.service.update({
    serviceId: "<id>",
    service: {
      serviceName: "My updated service",
      issuer: "https://my-service.example.com",
      clientsPerDeveloper: 0,
      clientIdAliasEnabled: true,
      supportedGrantTypes: [
        "AUTHORIZATION_CODE",
        "REFRESH_TOKEN",
      ],
      supportedResponseTypes: [
        "CODE",
      ],
      errorDescriptionOmitted: false,
      errorUriOmitted: false,
      authorizationEndpoint: "https://my-service.example.com/authz",
      directAuthorizationEndpointEnabled: false,
      supportedDisplays: [
        "PAGE",
      ],
      pkceRequired: true,
      pkceS256Required: false,
      authorizationResponseDuration: 0,
      tokenEndpoint: "https://my-service.example.com/token",
      directTokenEndpointEnabled: false,
      supportedTokenAuthMethods: [
        "CLIENT_SECRET_BASIC",
      ],
      missingClientIdAllowed: false,
      revocationEndpoint: "https://my-service.example.com/revocation",
      directRevocationEndpointEnabled: false,
      supportedRevocationAuthMethods: [
        "CLIENT_SECRET_BASIC",
      ],
      introspectionEndpoint: "https://my-service.example.com/introspection",
      directIntrospectionEndpointEnabled: false,
      supportedIntrospectionAuthMethods: [
        "CLIENT_SECRET_BASIC",
      ],
      pushedAuthReqDuration: 0,
      parRequired: false,
      requestObjectRequired: false,
      traditionalRequestObjectProcessingApplied: false,
      mutualTlsValidatePkiCertChain: false,
      accessTokenType: "Bearer",
      tlsClientCertificateBoundAccessTokens: false,
      accessTokenDuration: 3600,
      singleAccessTokenPerSubject: false,
      refreshTokenDuration: 3600,
      refreshTokenDurationKept: false,
      refreshTokenDurationReset: false,
      refreshTokenKept: false,
      supportedScopes: [
        {
          name: "history.read",
          defaultEntry: false,
          description: "A permission to read your history.",
        },
        {
          name: "timeline.read",
          defaultEntry: false,
          description: "A permission to read your timeline.",
        },
      ],
      scopeRequired: false,
      idTokenDuration: 0,
      allowableClockSkew: 0,
      supportedClaimTypes: [
        "NORMAL",
      ],
      claimShortcutRestrictive: false,
      directJwksEndpointEnabled: false,
      directUserInfoEndpointEnabled: false,
      dynamicRegistrationSupported: false,
      backchannelAuthReqIdDuration: 0,
      backchannelPollingInterval: 0,
      backchannelUserCodeParameterSupported: false,
      backchannelBindingMessageRequiredInFapi: false,
      deviceFlowCodeDuration: 0,
      deviceFlowPollingInterval: 0,
      userCodeLength: 0,
      attributes: [
        {
          key: "attribute1-key",
          value: "attribute1-value",
        },
        {
          key: "attribute2-key",
          value: "attribute2-value",
        },
      ],
      nbfOptional: false,
      issSuppressed: false,
      tokenExpirationLinked: false,
      frontChannelRequestObjectEncryptionRequired: false,
      requestObjectEncryptionAlgMatchRequired: false,
      requestObjectEncryptionEncMatchRequired: false,
      hsmEnabled: false,
      grantManagementActionRequired: false,
      unauthorizedOnClientConfigSupported: false,
      dcrScopeUsedAsRequestable: false,
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
import { serviceUpdate } from "@authlete/typescript-sdk/funcs/serviceUpdate.js";

// Use `AuthleteCore` for best tree-shaking performance.
// You can create one instance of it to use across an application.
const authlete = new AuthleteCore({
  bearer: process.env["AUTHLETE_BEARER"] ?? "",
});

async function run() {
  const res = await serviceUpdate(authlete, {
    serviceId: "<id>",
    service: {
      serviceName: "My updated service",
      issuer: "https://my-service.example.com",
      clientsPerDeveloper: 0,
      clientIdAliasEnabled: true,
      supportedGrantTypes: [
        "AUTHORIZATION_CODE",
        "REFRESH_TOKEN",
      ],
      supportedResponseTypes: [
        "CODE",
      ],
      errorDescriptionOmitted: false,
      errorUriOmitted: false,
      authorizationEndpoint: "https://my-service.example.com/authz",
      directAuthorizationEndpointEnabled: false,
      supportedDisplays: [
        "PAGE",
      ],
      pkceRequired: true,
      pkceS256Required: false,
      authorizationResponseDuration: 0,
      tokenEndpoint: "https://my-service.example.com/token",
      directTokenEndpointEnabled: false,
      supportedTokenAuthMethods: [
        "CLIENT_SECRET_BASIC",
      ],
      missingClientIdAllowed: false,
      revocationEndpoint: "https://my-service.example.com/revocation",
      directRevocationEndpointEnabled: false,
      supportedRevocationAuthMethods: [
        "CLIENT_SECRET_BASIC",
      ],
      introspectionEndpoint: "https://my-service.example.com/introspection",
      directIntrospectionEndpointEnabled: false,
      supportedIntrospectionAuthMethods: [
        "CLIENT_SECRET_BASIC",
      ],
      pushedAuthReqDuration: 0,
      parRequired: false,
      requestObjectRequired: false,
      traditionalRequestObjectProcessingApplied: false,
      mutualTlsValidatePkiCertChain: false,
      accessTokenType: "Bearer",
      tlsClientCertificateBoundAccessTokens: false,
      accessTokenDuration: 3600,
      singleAccessTokenPerSubject: false,
      refreshTokenDuration: 3600,
      refreshTokenDurationKept: false,
      refreshTokenDurationReset: false,
      refreshTokenKept: false,
      supportedScopes: [
        {
          name: "history.read",
          defaultEntry: false,
          description: "A permission to read your history.",
        },
        {
          name: "timeline.read",
          defaultEntry: false,
          description: "A permission to read your timeline.",
        },
      ],
      scopeRequired: false,
      idTokenDuration: 0,
      allowableClockSkew: 0,
      supportedClaimTypes: [
        "NORMAL",
      ],
      claimShortcutRestrictive: false,
      directJwksEndpointEnabled: false,
      directUserInfoEndpointEnabled: false,
      dynamicRegistrationSupported: false,
      backchannelAuthReqIdDuration: 0,
      backchannelPollingInterval: 0,
      backchannelUserCodeParameterSupported: false,
      backchannelBindingMessageRequiredInFapi: false,
      deviceFlowCodeDuration: 0,
      deviceFlowPollingInterval: 0,
      userCodeLength: 0,
      attributes: [
        {
          key: "attribute1-key",
          value: "attribute1-value",
        },
        {
          key: "attribute2-key",
          value: "attribute2-value",
        },
      ],
      nbfOptional: false,
      issSuppressed: false,
      tokenExpirationLinked: false,
      frontChannelRequestObjectEncryptionRequired: false,
      requestObjectEncryptionAlgMatchRequired: false,
      requestObjectEncryptionEncMatchRequired: false,
      hsmEnabled: false,
      grantManagementActionRequired: false,
      unauthorizedOnClientConfigSupported: false,
      dcrScopeUsedAsRequestable: false,
    },
  });
  if (res.ok) {
    const { value: result } = res;
    console.log(result);
  } else {
    console.log("serviceUpdate failed:", res.error);
  }
}

run();
```

### Parameters

| Parameter                                                                                                                                                                      | Type                                                                                                                                                                           | Required                                                                                                                                                                       | Description                                                                                                                                                                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `request`                                                                                                                                                                      | [operations.ServiceUpdateApiRequest](../../models/operations/serviceupdateapirequest.md)                                                                                       | :heavy_check_mark:                                                                                                                                                             | The request object to use for the request.                                                                                                                                     |
| `options`                                                                                                                                                                      | RequestOptions                                                                                                                                                                 | :heavy_minus_sign:                                                                                                                                                             | Used to set various options for making HTTP requests.                                                                                                                          |
| `options.fetchOptions`                                                                                                                                                         | [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request#options)                                                                                        | :heavy_minus_sign:                                                                                                                                                             | Options that are passed to the underlying HTTP request. This can be used to inject extra headers for examples. All `Request` options, except `method` and `body`, are allowed. |
| `options.retries`                                                                                                                                                              | [RetryConfig](../../lib/utils/retryconfig.md)                                                                                                                                  | :heavy_minus_sign:                                                                                                                                                             | Enables retrying HTTP requests under certain failure conditions.                                                                                                               |

### Response

**Promise\<[models.Service](../../models/service.md)\>**

### Errors

| Error Type                  | Status Code                 | Content Type                |
| --------------------------- | --------------------------- | --------------------------- |
| errors.ResultError          | 400, 401, 403               | application/json            |
| errors.ResultError          | 500                         | application/json            |
| errors.AuthleteDefaultError | 4XX, 5XX                    | \*/\*                       |

## delete

Delete a service.


### Example Usage

<!-- UsageSnippet language="typescript" operationID="service_delete_api" method="delete" path="/api/{serviceId}/service/delete" -->
```typescript
import { Authlete } from "@authlete/typescript-sdk";

const authlete = new Authlete({
  bearer: process.env["AUTHLETE_BEARER"] ?? "",
});

async function run() {
  await authlete.service.delete({
    serviceId: "<id>",
  });


}

run();
```

### Standalone function

The standalone function version of this method:

```typescript
import { AuthleteCore } from "@authlete/typescript-sdk/core.js";
import { serviceDelete } from "@authlete/typescript-sdk/funcs/serviceDelete.js";

// Use `AuthleteCore` for best tree-shaking performance.
// You can create one instance of it to use across an application.
const authlete = new AuthleteCore({
  bearer: process.env["AUTHLETE_BEARER"] ?? "",
});

async function run() {
  const res = await serviceDelete(authlete, {
    serviceId: "<id>",
  });
  if (res.ok) {
    const { value: result } = res;
    
  } else {
    console.log("serviceDelete failed:", res.error);
  }
}

run();
```

### Parameters

| Parameter                                                                                                                                                                      | Type                                                                                                                                                                           | Required                                                                                                                                                                       | Description                                                                                                                                                                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `request`                                                                                                                                                                      | [operations.ServiceDeleteApiRequest](../../models/operations/servicedeleteapirequest.md)                                                                                       | :heavy_check_mark:                                                                                                                                                             | The request object to use for the request.                                                                                                                                     |
| `options`                                                                                                                                                                      | RequestOptions                                                                                                                                                                 | :heavy_minus_sign:                                                                                                                                                             | Used to set various options for making HTTP requests.                                                                                                                          |
| `options.fetchOptions`                                                                                                                                                         | [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request#options)                                                                                        | :heavy_minus_sign:                                                                                                                                                             | Options that are passed to the underlying HTTP request. This can be used to inject extra headers for examples. All `Request` options, except `method` and `body`, are allowed. |
| `options.retries`                                                                                                                                                              | [RetryConfig](../../lib/utils/retryconfig.md)                                                                                                                                  | :heavy_minus_sign:                                                                                                                                                             | Enables retrying HTTP requests under certain failure conditions.                                                                                                               |

### Response

**Promise\<void\>**

### Errors

| Error Type                  | Status Code                 | Content Type                |
| --------------------------- | --------------------------- | --------------------------- |
| errors.ResultError          | 400, 401, 403               | application/json            |
| errors.ResultError          | 500                         | application/json            |
| errors.AuthleteDefaultError | 4XX, 5XX                    | \*/\*                       |

## getConfiguration

This API gathers configuration information about a service.
### Description
This API is supposed to be called from within the implementation of the configuration endpoint of
the service where the service that supports OpenID Connect and [OpenID Connect Discovery 1.0](https://openid.net/specs/openid-connect-discovery-1\_0.html)
must expose its configuration information in a JSON format. Details about the format are described
in "[3. OpenID Provider Metadata](https://openid.net/specs/openid-connect-discovery-1\_0.html#ProviderMetadata)"
in OpenID Connect Discovery 1.0.


### Example Usage

<!-- UsageSnippet language="typescript" operationID="service_configuration_api" method="get" path="/api/{serviceId}/service/configuration" -->
```typescript
import { Authlete } from "@authlete/typescript-sdk";

const authlete = new Authlete({
  bearer: process.env["AUTHLETE_BEARER"] ?? "",
});

async function run() {
  const result = await authlete.service.getConfiguration({
    serviceId: "<id>",
  });

  console.log(result);
}

run();
```

### Standalone function

The standalone function version of this method:

```typescript
import { AuthleteCore } from "@authlete/typescript-sdk/core.js";
import { serviceGetConfiguration } from "@authlete/typescript-sdk/funcs/serviceGetConfiguration.js";

// Use `AuthleteCore` for best tree-shaking performance.
// You can create one instance of it to use across an application.
const authlete = new AuthleteCore({
  bearer: process.env["AUTHLETE_BEARER"] ?? "",
});

async function run() {
  const res = await serviceGetConfiguration(authlete, {
    serviceId: "<id>",
  });
  if (res.ok) {
    const { value: result } = res;
    console.log(result);
  } else {
    console.log("serviceGetConfiguration failed:", res.error);
  }
}

run();
```

### Parameters

| Parameter                                                                                                                                                                      | Type                                                                                                                                                                           | Required                                                                                                                                                                       | Description                                                                                                                                                                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `request`                                                                                                                                                                      | [operations.ServiceConfigurationApiRequest](../../models/operations/serviceconfigurationapirequest.md)                                                                         | :heavy_check_mark:                                                                                                                                                             | The request object to use for the request.                                                                                                                                     |
| `options`                                                                                                                                                                      | RequestOptions                                                                                                                                                                 | :heavy_minus_sign:                                                                                                                                                             | Used to set various options for making HTTP requests.                                                                                                                          |
| `options.fetchOptions`                                                                                                                                                         | [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request#options)                                                                                        | :heavy_minus_sign:                                                                                                                                                             | Options that are passed to the underlying HTTP request. This can be used to inject extra headers for examples. All `Request` options, except `method` and `body`, are allowed. |
| `options.retries`                                                                                                                                                              | [RetryConfig](../../lib/utils/retryconfig.md)                                                                                                                                  | :heavy_minus_sign:                                                                                                                                                             | Enables retrying HTTP requests under certain failure conditions.                                                                                                               |

### Response

**Promise\<[{ [k: string]: any }](../../models/.md)\>**

### Errors

| Error Type                  | Status Code                 | Content Type                |
| --------------------------- | --------------------------- | --------------------------- |
| errors.ResultError          | 400, 401, 403               | application/json            |
| errors.ResultError          | 500                         | application/json            |
| errors.AuthleteDefaultError | 4XX, 5XX                    | \*/\*                       |