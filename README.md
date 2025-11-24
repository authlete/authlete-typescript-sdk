# Authlete Typescript SDK

Developer-friendly & type-safe Typescript SDK specifically catered to leverage *Authlete* API.

<div align="left">
    <a href="https://www.speakeasy.com/?utm_source=authlete&utm_campaign=typescript"><img src="https://custom-icon-badges.demolab.com/badge/-Built%20By%20Speakeasy-212015?style=for-the-badge&logoColor=FBE331&logo=speakeasy&labelColor=545454" /></a>
    <a href="https://opensource.org/licenses/MIT">
        <img src="https://img.shields.io/badge/License-MIT-blue.svg" style="width: 100px; height: 28px;" />
    </a>
    <br /><br />
</div>

> [!IMPORTANT]
> This is a beta SDK.

## 🎓 Tutorials

If you're new to Authlete or want to see sample implementations, these resources will help you get started:

- [🚀 Getting Started with Authlete](https://www.authlete.com/developers/getting_started/)
- [🔑 From Sign-Up to the First API Request](https://www.authlete.com/developers/tutorial/signup/)

## 🛠 Contact Us

If you have any questions or need assistance, our team is here to help:

- [Contact Page](https://www.authlete.com/contact/)
<!-- End Summary [summary] -->

<!-- Start Table of Contents [toc] -->
## Table of Contents
<!-- $toc-max-depth=2 -->
* [Authlete Typescript SDK](#authlete-typescript-sdk)
  * [SDK Installation](#sdk-installation)
  * [Requirements](#requirements)
  * [Access Tokens](#access-tokens)
  * [SDK Example Usage](#sdk-example-usage)
  * [Authentication](#authentication)
  * [Available Resources and Operations](#available-resources-and-operations)
  * [Standalone functions](#standalone-functions)
  * [Retries](#retries)
  * [Error Handling](#error-handling)
  * [Server Selection](#server-selection)
  * [Custom HTTP Client](#custom-http-client)
  * [Debugging](#debugging)
* [Development](#development)
  * [Maturity](#maturity)
  * [Contributions](#contributions)

<!-- End Table of Contents [toc] -->

<!-- Start SDK Installation [installation] -->
## SDK Installation

The SDK can be installed with either [npm](https://www.npmjs.com/), [pnpm](https://pnpm.io/), [bun](https://bun.sh/) or [yarn](https://classic.yarnpkg.com/en/) package managers.

### NPM

```bash
npm add @authlete/typescript-sdk
```

### PNPM

```bash
pnpm add @authlete/typescript-sdk
```

### Bun

```bash
bun add @authlete/typescript-sdk
```

### Yarn

```bash
yarn add @authlete/typescript-sdk
```

> [!NOTE]
> This package is published with CommonJS and ES Modules (ESM) support.
<!-- End SDK Installation [installation] -->

<!-- Start Requirements [requirements] -->
## Requirements

For supported JavaScript runtimes, please consult [RUNTIMES.md](RUNTIMES.md).
<!-- End Requirements [requirements] -->

## Access Tokens

You need to pass a valid access token to be able to use any resource or operation. Refer to [Creating an Access Token](https://www.authlete.com/developers/tutorial/signup/) to learn how to create one.

Authlete supports two types of access tokens:

- **Service Access Token** - Scoped to a single service (authorization server instance). Create from **Service Settings** → **Access Tokens** in the [Authlete Console](https://console.authlete.com).
- **Organization Token** - Scoped to your entire organization, allowing access to all services. Create from **[Organization Settings](https://www.authlete.com/developers/terraform/starting/#setting-your-environment)** → **Access Tokens**.

Make sure that you create a token with the correct scope. If you face permission (403) errors when already sending a token, it can be one of the following problems:

- The token you are using has expired. Check the expiry date in the Authlete Console.
- The token does not have access to the correct scope, either not the right service or it does not have account level access.
- The resource or operation you are trying to use is not available for that service tier. For example, some features are Enterprise-only and you may be using a token for a service on a different plan.

<!-- Start SDK Example Usage [usage] -->
## SDK Example Usage

### Example

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
<!-- End SDK Example Usage [usage] -->

<!-- Start Authentication [security] -->
## Authentication

### Per-Client Security Schemes

This SDK supports the following security scheme globally:

| Name     | Type | Scheme      | Environment Variable |
| -------- | ---- | ----------- | -------------------- |
| `bearer` | http | HTTP Bearer | `AUTHLETE_BEARER`    |

To authenticate with the API the `bearer` parameter must be set when initializing the SDK client instance. For example:
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
<!-- End Authentication [security] -->

<!-- Start Available Resources and Operations [operations] -->
## Available Resources and Operations

<details open>
<summary>Available methods</summary>

### [authorization](docs/sdks/authorization/README.md)

* [processRequest](docs/sdks/authorization/README.md#processrequest) - Process Authorization Request
* [fail](docs/sdks/authorization/README.md#fail) - Fail Authorization Request
* [issue](docs/sdks/authorization/README.md#issue) - Issue Authorization Response

#### [authorization.management](docs/sdks/authorizationmanagement/README.md)

* [getTicketInfo](docs/sdks/authorizationmanagement/README.md#getticketinfo) - Get Ticket Information
* [updateTicket](docs/sdks/authorizationmanagement/README.md#updateticket) - Update Ticket Information

### [ciba](docs/sdks/ciba/README.md)

* [processAuthentication](docs/sdks/ciba/README.md#processauthentication) - Process Backchannel Authentication Request
* [issue](docs/sdks/ciba/README.md#issue) - Issue Backchannel Authentication Response
* [fail](docs/sdks/ciba/README.md#fail) - Fail Backchannel Authentication Request
* [complete](docs/sdks/ciba/README.md#complete) - Complete Backchannel Authentication

### [client](docs/sdks/client/README.md)

* [get](docs/sdks/client/README.md#get) - Get Client
* [list](docs/sdks/client/README.md#list) - List Clients
* [create](docs/sdks/client/README.md#create) - Create Client
* [update](docs/sdks/client/README.md#update) - Update Client
* [delete](docs/sdks/client/README.md#delete) - Delete Client ⚡

#### [client.management](docs/sdks/clientmanagement/README.md)

* [updateLockFlag](docs/sdks/clientmanagement/README.md#updatelockflag) - Update Client Lock
* [refreshSecret](docs/sdks/clientmanagement/README.md#refreshsecret) - Rotate Client Secret
* [updateSecret](docs/sdks/clientmanagement/README.md#updatesecret) - Update Client Secret
* [listAuthorizations](docs/sdks/clientmanagement/README.md#listauthorizations) - Get Authorized Applications
* [updateAuthorizations](docs/sdks/clientmanagement/README.md#updateauthorizations) - Update Client Tokens
* [deleteAuthorizations](docs/sdks/clientmanagement/README.md#deleteauthorizations) - Delete Client Tokens
* [getGrantedScopes](docs/sdks/clientmanagement/README.md#getgrantedscopes) - Get Granted Scopes
* [deleteGrantedScopes](docs/sdks/clientmanagement/README.md#deletegrantedscopes) - Delete Granted Scopes
* [getRequestableScopes](docs/sdks/clientmanagement/README.md#getrequestablescopes) - Get Requestable Scopes
* [updateRequestableScopes](docs/sdks/clientmanagement/README.md#updaterequestablescopes) - Update Requestable Scopes
* [deleteRequestableScopes](docs/sdks/clientmanagement/README.md#deleterequestablescopes) - Delete Requestable Scopes

### [deviceFlow](docs/sdks/deviceflow/README.md)

* [authorization](docs/sdks/deviceflow/README.md#authorization) - Process Device Authorization Request
* [verification](docs/sdks/deviceflow/README.md#verification) - Process Device Verification Request
* [complete](docs/sdks/deviceflow/README.md#complete) - Complete Device Authorization

### [dynamicClientRegistration](docs/sdks/dynamicclientregistration/README.md)

* [register](docs/sdks/dynamicclientregistration/README.md#register) - Register Client
* [get](docs/sdks/dynamicclientregistration/README.md#get) - Get Client
* [update](docs/sdks/dynamicclientregistration/README.md#update) - Update Client
* [delete](docs/sdks/dynamicclientregistration/README.md#delete) - Delete Client

### [federation](docs/sdks/federation/README.md)

* [configuration](docs/sdks/federation/README.md#configuration) - Process Entity Configuration Request
* [registration](docs/sdks/federation/README.md#registration) - Process Federation Registration Request

### [grantManagement](docs/sdks/grantmanagement/README.md)

* [processRequest](docs/sdks/grantmanagement/README.md#processrequest) - Process Grant Management Request

### [hardwareSecurityKeys](docs/sdks/hardwaresecuritykeys/README.md)

* [create](docs/sdks/hardwaresecuritykeys/README.md#create) - Create Security Key
* [delete](docs/sdks/hardwaresecuritykeys/README.md#delete) - Delete Security Key
* [get](docs/sdks/hardwaresecuritykeys/README.md#get) - Get Security Key
* [list](docs/sdks/hardwaresecuritykeys/README.md#list) - List Security Keys

### [introspection](docs/sdks/introspection/README.md)

* [process](docs/sdks/introspection/README.md#process) - Process Introspection Request
* [standardProcess](docs/sdks/introspection/README.md#standardprocess) - Process OAuth 2.0 Introspection Request

### [joseObject](docs/sdks/joseobject/README.md)

* [joseVerifyApi](docs/sdks/joseobject/README.md#joseverifyapi) - Verify JOSE

### [jwkSetEndpoint](docs/sdks/jwksetendpoint/README.md)

* [serviceJwksGetApi](docs/sdks/jwksetendpoint/README.md#servicejwksgetapi) - Get JWK Set

### [nativeSso](docs/sdks/nativesso/README.md)

* [process](docs/sdks/nativesso/README.md#process) - Native SSO Processing
* [logout](docs/sdks/nativesso/README.md#logout) - Native SSO Logout Processing

### [pushedAuthorization](docs/sdks/pushedauthorization/README.md)

* [create](docs/sdks/pushedauthorization/README.md#create) - Process Pushed Authorization Request

### [revocation](docs/sdks/revocation/README.md)

* [process](docs/sdks/revocation/README.md#process) - Process Revocation Request

### [service](docs/sdks/service/README.md)

* [get](docs/sdks/service/README.md#get) - Get Service
* [list](docs/sdks/service/README.md#list) - List Services
* [create](docs/sdks/service/README.md#create) - Create Service
* [update](docs/sdks/service/README.md#update) - Update Service
* [delete](docs/sdks/service/README.md#delete) - Delete Service ⚡
* [getConfiguration](docs/sdks/service/README.md#getconfiguration) - Get Service Configuration

### [token](docs/sdks/token/README.md)

* [process](docs/sdks/token/README.md#process) - Process Token Request
* [fail](docs/sdks/token/README.md#fail) - Fail Token Request
* [issue](docs/sdks/token/README.md#issue) - Issue Token Response

#### [token.management](docs/sdks/tokenmanagement/README.md)

* [reissueIdToken](docs/sdks/tokenmanagement/README.md#reissueidtoken) - Reissue ID Token
* [list](docs/sdks/tokenmanagement/README.md#list) - List Issued Tokens
* [create](docs/sdks/tokenmanagement/README.md#create) - Create Access Token
* [update](docs/sdks/tokenmanagement/README.md#update) - Update Access Token
* [delete](docs/sdks/tokenmanagement/README.md#delete) - Delete Access Token
* [revoke](docs/sdks/tokenmanagement/README.md#revoke) - Revoke Access Token

### [userinfo](docs/sdks/userinfo/README.md)

* [process](docs/sdks/userinfo/README.md#process) - Process UserInfo Request
* [issue](docs/sdks/userinfo/README.md#issue) - Issue UserInfo Response

### [verifiableCredentials](docs/sdks/verifiablecredentials/README.md)

* [getMetadata](docs/sdks/verifiablecredentials/README.md#getmetadata) - Get Verifiable Credential Issuer Metadata
* [getJwtIssuer](docs/sdks/verifiablecredentials/README.md#getjwtissuer) - Get JWT Issuer Information
* [getJwks](docs/sdks/verifiablecredentials/README.md#getjwks) - Get JSON Web Key Set
* [createOffer](docs/sdks/verifiablecredentials/README.md#createoffer) - Create Credential Offer
* [getOfferInfo](docs/sdks/verifiablecredentials/README.md#getofferinfo) - Get Credential Offer Information
* [parse](docs/sdks/verifiablecredentials/README.md#parse) - Parse Single Credential
* [issue](docs/sdks/verifiablecredentials/README.md#issue) - Issue Single Credential
* [batchParse](docs/sdks/verifiablecredentials/README.md#batchparse) - Parse Batch Credentials
* [batchIssue](docs/sdks/verifiablecredentials/README.md#batchissue) - Issue Batch Credentials
* [deferredParse](docs/sdks/verifiablecredentials/README.md#deferredparse) - Parse Deferred Credential
* [deferredIssue](docs/sdks/verifiablecredentials/README.md#deferredissue) - Issue Deferred Credential

</details>
<!-- End Available Resources and Operations [operations] -->

<!-- Start Standalone functions [standalone-funcs] -->
## Standalone functions

All the methods listed above are available as standalone functions. These
functions are ideal for use in applications running in the browser, serverless
runtimes or other environments where application bundle size is a primary
concern. When using a bundler to build your application, all unused
functionality will be either excluded from the final bundle or tree-shaken away.

To read more about standalone functions, check [FUNCTIONS.md](./FUNCTIONS.md).

<details>

<summary>Available standalone functions</summary>

- [`authorizationFail`](docs/sdks/authorization/README.md#fail) - Fail Authorization Request
- [`authorizationIssue`](docs/sdks/authorization/README.md#issue) - Issue Authorization Response
- [`authorizationManagementGetTicketInfo`](docs/sdks/authorizationmanagement/README.md#getticketinfo) - Get Ticket Information
- [`authorizationManagementUpdateTicket`](docs/sdks/authorizationmanagement/README.md#updateticket) - Update Ticket Information
- [`authorizationProcessRequest`](docs/sdks/authorization/README.md#processrequest) - Process Authorization Request
- [`cibaComplete`](docs/sdks/ciba/README.md#complete) - Complete Backchannel Authentication
- [`cibaFail`](docs/sdks/ciba/README.md#fail) - Fail Backchannel Authentication Request
- [`cibaIssue`](docs/sdks/ciba/README.md#issue) - Issue Backchannel Authentication Response
- [`cibaProcessAuthentication`](docs/sdks/ciba/README.md#processauthentication) - Process Backchannel Authentication Request
- [`clientCreate`](docs/sdks/client/README.md#create) - Create Client
- [`clientDelete`](docs/sdks/client/README.md#delete) - Delete Client ⚡
- [`clientGet`](docs/sdks/client/README.md#get) - Get Client
- [`clientList`](docs/sdks/client/README.md#list) - List Clients
- [`clientManagementDeleteAuthorizations`](docs/sdks/clientmanagement/README.md#deleteauthorizations) - Delete Client Tokens
- [`clientManagementDeleteGrantedScopes`](docs/sdks/clientmanagement/README.md#deletegrantedscopes) - Delete Granted Scopes
- [`clientManagementDeleteRequestableScopes`](docs/sdks/clientmanagement/README.md#deleterequestablescopes) - Delete Requestable Scopes
- [`clientManagementGetGrantedScopes`](docs/sdks/clientmanagement/README.md#getgrantedscopes) - Get Granted Scopes
- [`clientManagementGetRequestableScopes`](docs/sdks/clientmanagement/README.md#getrequestablescopes) - Get Requestable Scopes
- [`clientManagementListAuthorizations`](docs/sdks/clientmanagement/README.md#listauthorizations) - Get Authorized Applications
- [`clientManagementRefreshSecret`](docs/sdks/clientmanagement/README.md#refreshsecret) - Rotate Client Secret
- [`clientManagementUpdateAuthorizations`](docs/sdks/clientmanagement/README.md#updateauthorizations) - Update Client Tokens
- [`clientManagementUpdateLockFlag`](docs/sdks/clientmanagement/README.md#updatelockflag) - Update Client Lock
- [`clientManagementUpdateRequestableScopes`](docs/sdks/clientmanagement/README.md#updaterequestablescopes) - Update Requestable Scopes
- [`clientManagementUpdateSecret`](docs/sdks/clientmanagement/README.md#updatesecret) - Update Client Secret
- [`clientUpdate`](docs/sdks/client/README.md#update) - Update Client
- [`deviceFlowAuthorization`](docs/sdks/deviceflow/README.md#authorization) - Process Device Authorization Request
- [`deviceFlowComplete`](docs/sdks/deviceflow/README.md#complete) - Complete Device Authorization
- [`deviceFlowVerification`](docs/sdks/deviceflow/README.md#verification) - Process Device Verification Request
- [`dynamicClientRegistrationDelete`](docs/sdks/dynamicclientregistration/README.md#delete) - Delete Client
- [`dynamicClientRegistrationGet`](docs/sdks/dynamicclientregistration/README.md#get) - Get Client
- [`dynamicClientRegistrationRegister`](docs/sdks/dynamicclientregistration/README.md#register) - Register Client
- [`dynamicClientRegistrationUpdate`](docs/sdks/dynamicclientregistration/README.md#update) - Update Client
- [`federationConfiguration`](docs/sdks/federation/README.md#configuration) - Process Entity Configuration Request
- [`federationRegistration`](docs/sdks/federation/README.md#registration) - Process Federation Registration Request
- [`grantManagementProcessRequest`](docs/sdks/grantmanagement/README.md#processrequest) - Process Grant Management Request
- [`hardwareSecurityKeysCreate`](docs/sdks/hardwaresecuritykeys/README.md#create) - Create Security Key
- [`hardwareSecurityKeysDelete`](docs/sdks/hardwaresecuritykeys/README.md#delete) - Delete Security Key
- [`hardwareSecurityKeysGet`](docs/sdks/hardwaresecuritykeys/README.md#get) - Get Security Key
- [`hardwareSecurityKeysList`](docs/sdks/hardwaresecuritykeys/README.md#list) - List Security Keys
- [`introspectionProcess`](docs/sdks/introspection/README.md#process) - Process Introspection Request
- [`introspectionStandardProcess`](docs/sdks/introspection/README.md#standardprocess) - Process OAuth 2.0 Introspection Request
- [`joseObjectJoseVerifyApi`](docs/sdks/joseobject/README.md#joseverifyapi) - Verify JOSE
- [`jwkSetEndpointServiceJwksGetApi`](docs/sdks/jwksetendpoint/README.md#servicejwksgetapi) - Get JWK Set
- [`nativeSsoLogout`](docs/sdks/nativesso/README.md#logout) - Native SSO Logout Processing
- [`nativeSsoProcess`](docs/sdks/nativesso/README.md#process) - Native SSO Processing
- [`pushedAuthorizationCreate`](docs/sdks/pushedauthorization/README.md#create) - Process Pushed Authorization Request
- [`revocationProcess`](docs/sdks/revocation/README.md#process) - Process Revocation Request
- [`serviceCreate`](docs/sdks/service/README.md#create) - Create Service
- [`serviceDelete`](docs/sdks/service/README.md#delete) - Delete Service ⚡
- [`serviceGet`](docs/sdks/service/README.md#get) - Get Service
- [`serviceGetConfiguration`](docs/sdks/service/README.md#getconfiguration) - Get Service Configuration
- [`serviceList`](docs/sdks/service/README.md#list) - List Services
- [`serviceUpdate`](docs/sdks/service/README.md#update) - Update Service
- [`tokenFail`](docs/sdks/token/README.md#fail) - Fail Token Request
- [`tokenIssue`](docs/sdks/token/README.md#issue) - Issue Token Response
- [`tokenManagementCreate`](docs/sdks/tokenmanagement/README.md#create) - Create Access Token
- [`tokenManagementDelete`](docs/sdks/tokenmanagement/README.md#delete) - Delete Access Token
- [`tokenManagementList`](docs/sdks/tokenmanagement/README.md#list) - List Issued Tokens
- [`tokenManagementReissueIdToken`](docs/sdks/tokenmanagement/README.md#reissueidtoken) - Reissue ID Token
- [`tokenManagementRevoke`](docs/sdks/tokenmanagement/README.md#revoke) - Revoke Access Token
- [`tokenManagementUpdate`](docs/sdks/tokenmanagement/README.md#update) - Update Access Token
- [`tokenProcess`](docs/sdks/token/README.md#process) - Process Token Request
- [`userinfoIssue`](docs/sdks/userinfo/README.md#issue) - Issue UserInfo Response
- [`userinfoProcess`](docs/sdks/userinfo/README.md#process) - Process UserInfo Request
- [`verifiableCredentialsBatchIssue`](docs/sdks/verifiablecredentials/README.md#batchissue) - Issue Batch Credentials
- [`verifiableCredentialsBatchParse`](docs/sdks/verifiablecredentials/README.md#batchparse) - Parse Batch Credentials
- [`verifiableCredentialsCreateOffer`](docs/sdks/verifiablecredentials/README.md#createoffer) - Create Credential Offer
- [`verifiableCredentialsDeferredIssue`](docs/sdks/verifiablecredentials/README.md#deferredissue) - Issue Deferred Credential
- [`verifiableCredentialsDeferredParse`](docs/sdks/verifiablecredentials/README.md#deferredparse) - Parse Deferred Credential
- [`verifiableCredentialsGetJwks`](docs/sdks/verifiablecredentials/README.md#getjwks) - Get JSON Web Key Set
- [`verifiableCredentialsGetJwtIssuer`](docs/sdks/verifiablecredentials/README.md#getjwtissuer) - Get JWT Issuer Information
- [`verifiableCredentialsGetMetadata`](docs/sdks/verifiablecredentials/README.md#getmetadata) - Get Verifiable Credential Issuer Metadata
- [`verifiableCredentialsGetOfferInfo`](docs/sdks/verifiablecredentials/README.md#getofferinfo) - Get Credential Offer Information
- [`verifiableCredentialsIssue`](docs/sdks/verifiablecredentials/README.md#issue) - Issue Single Credential
- [`verifiableCredentialsParse`](docs/sdks/verifiablecredentials/README.md#parse) - Parse Single Credential

</details>
<!-- End Standalone functions [standalone-funcs] -->

<!-- Start Retries [retries] -->
## Retries

Some of the endpoints in this SDK support retries.  If you use the SDK without any configuration, it will fall back to the default retry strategy provided by the API.  However, the default retry strategy can be overridden on a per-operation basis, or across the entire SDK.

To change the default retry strategy for a single API call, simply provide a retryConfig object to the call:
```typescript
import { Authlete } from "@authlete/typescript-sdk";

const authlete = new Authlete({
  bearer: process.env["AUTHLETE_BEARER"] ?? "",
});

async function run() {
  const result = await authlete.service.get({
    serviceId: "<id>",
  }, {
    retries: {
      strategy: "backoff",
      backoff: {
        initialInterval: 1,
        maxInterval: 50,
        exponent: 1.1,
        maxElapsedTime: 100,
      },
      retryConnectionErrors: false,
    },
  });

  console.log(result);
}

run();

```

If you'd like to override the default retry strategy for all operations that support retries, you can provide a retryConfig at SDK initialization:
```typescript
import { Authlete } from "@authlete/typescript-sdk";

const authlete = new Authlete({
  retryConfig: {
    strategy: "backoff",
    backoff: {
      initialInterval: 1,
      maxInterval: 50,
      exponent: 1.1,
      maxElapsedTime: 100,
    },
    retryConnectionErrors: false,
  },
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
<!-- End Retries [retries] -->

<!-- Start Error Handling [errors] -->
## Error Handling

[`AuthleteError`](./src/models/errors/authleteerror.ts) is the base class for all HTTP error responses. It has the following properties:

| Property            | Type       | Description                                                                             |
| ------------------- | ---------- | --------------------------------------------------------------------------------------- |
| `error.message`     | `string`   | Error message                                                                           |
| `error.statusCode`  | `number`   | HTTP response status code eg `404`                                                      |
| `error.headers`     | `Headers`  | HTTP response headers                                                                   |
| `error.body`        | `string`   | HTTP body. Can be empty string if no body is returned.                                  |
| `error.rawResponse` | `Response` | Raw HTTP response                                                                       |
| `error.data$`       |            | Optional. Some errors may contain structured data. [See Error Classes](#error-classes). |

### Example
```typescript
import { Authlete } from "@authlete/typescript-sdk";
import * as errors from "@authlete/typescript-sdk/models/errors";

const authlete = new Authlete({
  bearer: process.env["AUTHLETE_BEARER"] ?? "",
});

async function run() {
  try {
    const result = await authlete.service.get({
      serviceId: "<id>",
    });

    console.log(result);
  } catch (error) {
    // The base class for HTTP error responses
    if (error instanceof errors.AuthleteError) {
      console.log(error.message);
      console.log(error.statusCode);
      console.log(error.body);
      console.log(error.headers);

      // Depending on the method different errors may be thrown
      if (error instanceof errors.ResultError) {
        console.log(error.data$.resultCode); // string
        console.log(error.data$.resultMessage); // string
      }
    }
  }
}

run();

```

### Error Classes
**Primary errors:**
* [`AuthleteError`](./src/models/errors/authleteerror.ts): The base class for HTTP error responses.
  * [`ResultError`](./src/models/errors/resulterror.ts): .

<details><summary>Less common errors (6)</summary>

<br />

**Network errors:**
* [`ConnectionError`](./src/models/errors/httpclienterrors.ts): HTTP client was unable to make a request to a server.
* [`RequestTimeoutError`](./src/models/errors/httpclienterrors.ts): HTTP request timed out due to an AbortSignal signal.
* [`RequestAbortedError`](./src/models/errors/httpclienterrors.ts): HTTP request was aborted by the client.
* [`InvalidRequestError`](./src/models/errors/httpclienterrors.ts): Any input used to create a request is invalid.
* [`UnexpectedClientError`](./src/models/errors/httpclienterrors.ts): Unrecognised or unexpected error.


**Inherit from [`AuthleteError`](./src/models/errors/authleteerror.ts)**:
* [`ResponseValidationError`](./src/models/errors/responsevalidationerror.ts): Type mismatch between the data returned from the server and the structure expected by the SDK. See `error.rawValue` for the raw value and `error.pretty()` for a nicely formatted multi-line string.

</details>
<!-- End Error Handling [errors] -->

<!-- Start Server Selection [server] -->
## Server Selection

### Select Server by Index

You can override the default server globally by passing a server index to the `serverIdx: number` optional parameter when initializing the SDK client instance. The selected server will then be used as the default on the operations that use it. This table lists the indexes associated with the available servers:

| #   | Server                    | Description         |
| --- | ------------------------- | ------------------- |
| 0   | `https://us.authlete.com` | 🇺🇸 US Cluster     |
| 1   | `https://jp.authlete.com` | 🇯🇵 Japan Cluster  |
| 2   | `https://eu.authlete.com` | 🇪🇺 Europe Cluster |
| 3   | `https://br.authlete.com` | 🇧🇷 Brazil Cluster |

#### Example

```typescript
import { Authlete } from "@authlete/typescript-sdk";

const authlete = new Authlete({
  serverIdx: 0,
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

### Override Server URL Per-Client

The default server can also be overridden globally by passing a URL to the `serverURL: string` optional parameter when initializing the SDK client instance. For example:
```typescript
import { Authlete } from "@authlete/typescript-sdk";

const authlete = new Authlete({
  serverURL: "https://br.authlete.com",
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
<!-- End Server Selection [server] -->

<!-- Start Custom HTTP Client [http-client] -->
## Custom HTTP Client

The TypeScript SDK makes API calls using an `HTTPClient` that wraps the native
[Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API). This
client is a thin wrapper around `fetch` and provides the ability to attach hooks
around the request lifecycle that can be used to modify the request or handle
errors and response.

The `HTTPClient` constructor takes an optional `fetcher` argument that can be
used to integrate a third-party HTTP client or when writing tests to mock out
the HTTP client and feed in fixtures.

The following example shows how to use the `"beforeRequest"` hook to to add a
custom header and a timeout to requests and how to use the `"requestError"` hook
to log errors:

```typescript
import { Authlete } from "@authlete/typescript-sdk";
import { HTTPClient } from "@authlete/typescript-sdk/lib/http";

const httpClient = new HTTPClient({
  // fetcher takes a function that has the same signature as native `fetch`.
  fetcher: (request) => {
    return fetch(request);
  }
});

httpClient.addHook("beforeRequest", (request) => {
  const nextRequest = new Request(request, {
    signal: request.signal || AbortSignal.timeout(5000)
  });

  nextRequest.headers.set("x-custom-header", "custom value");

  return nextRequest;
});

httpClient.addHook("requestError", (error, request) => {
  console.group("Request Error");
  console.log("Reason:", `${error}`);
  console.log("Endpoint:", `${request.method} ${request.url}`);
  console.groupEnd();
});

const sdk = new Authlete({ httpClient: httpClient });
```
<!-- End Custom HTTP Client [http-client] -->

<!-- Start Debugging [debug] -->
## Debugging

You can setup your SDK to emit debug logs for SDK requests and responses.

You can pass a logger that matches `console`'s interface as an SDK option.

> [!WARNING]
> Beware that debug logging will reveal secrets, like API tokens in headers, in log messages printed to a console or files. It's recommended to use this feature only during local development and not in production.

```typescript
import { Authlete } from "@authlete/typescript-sdk";

const sdk = new Authlete({ debugLogger: console });
```

You can also enable a default debug logger by setting an environment variable `AUTHLETE_DEBUG` to true.
<!-- End Debugging [debug] -->

<!-- Placeholder for Future Speakeasy SDK Sections -->

# Development

## Maturity

This SDK is in beta, and there may be breaking changes between versions without a major version update. Therefore, we recommend pinning usage
to a specific package version. This way, you can install the same version each time without breaking changes unless you are intentionally
looking for the latest version.

## Contributions

While we value open-source contributions to this SDK, this library is generated programmatically. Any manual changes added to internal files will be overwritten on the next generation. 
We look forward to hearing your feedback. Feel free to open a PR or an issue with a proof of concept and we'll do our best to include it in a future release. 

### SDK Created by [Speakeasy](https://www.speakeasy.com/?utm_source=authlete&utm_campaign=typescript)
