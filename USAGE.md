<!-- Start SDK Example Usage [usage] -->
```typescript
import { Authlete } from "@authlete/typescript-sdk";

const authlete = new Authlete({
  serviceId: "<id>",
  bearer: process.env["AUTHLETE_BEARER"] ?? "",
});

async function run() {
  const result = await authlete.service.get({});

  console.log(result);
}

run();

```
<!-- End SDK Example Usage [usage] -->