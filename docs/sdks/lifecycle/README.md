# Lifecycle

## Overview

### Available Operations

* [getApiLifecycleHealthcheck](#getapilifecyclehealthcheck) - Health Check

## getApiLifecycleHealthcheck

Perform a health check of the server.


### Example Usage

<!-- UsageSnippet language="typescript" operationID="get_/api/lifecycle/healthcheck" method="get" path="/api/lifecycle/healthcheck" -->
```typescript
import { Authlete } from "@authlete/typescript-sdk";

const authlete = new Authlete();

async function run() {
  const result = await authlete.lifecycle.getApiLifecycleHealthcheck();

  console.log(result);
}

run();
```

### Standalone function

The standalone function version of this method:

```typescript
import { AuthleteCore } from "@authlete/typescript-sdk/core.js";
import { lifecycleGetApiLifecycleHealthcheck } from "@authlete/typescript-sdk/funcs/lifecycleGetApiLifecycleHealthcheck.js";

// Use `AuthleteCore` for best tree-shaking performance.
// You can create one instance of it to use across an application.
const authlete = new AuthleteCore();

async function run() {
  const res = await lifecycleGetApiLifecycleHealthcheck(authlete);
  if (res.ok) {
    const { value: result } = res;
    console.log(result);
  } else {
    console.log("lifecycleGetApiLifecycleHealthcheck failed:", res.error);
  }
}

run();
```

### Parameters

| Parameter                                                                                                                                                                      | Type                                                                                                                                                                           | Required                                                                                                                                                                       | Description                                                                                                                                                                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `request`                                                                                                                                                                      | [operations.GetApiLifecycleHealthcheckRequest](../../models/operations/getapilifecyclehealthcheckrequest.md)                                                                   | :heavy_check_mark:                                                                                                                                                             | The request object to use for the request.                                                                                                                                     |
| `options`                                                                                                                                                                      | RequestOptions                                                                                                                                                                 | :heavy_minus_sign:                                                                                                                                                             | Used to set various options for making HTTP requests.                                                                                                                          |
| `options.fetchOptions`                                                                                                                                                         | [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request#options)                                                                                        | :heavy_minus_sign:                                                                                                                                                             | Options that are passed to the underlying HTTP request. This can be used to inject extra headers for examples. All `Request` options, except `method` and `body`, are allowed. |
| `options.retries`                                                                                                                                                              | [RetryConfig](../../lib/utils/retryconfig.md)                                                                                                                                  | :heavy_minus_sign:                                                                                                                                                             | Enables retrying HTTP requests under certain failure conditions.                                                                                                               |

### Response

**Promise\<[string](../../models/.md)\>**

### Errors

| Error Type                  | Status Code                 | Content Type                |
| --------------------------- | --------------------------- | --------------------------- |
| errors.AuthleteDefaultError | 4XX, 5XX                    | \*/\*                       |