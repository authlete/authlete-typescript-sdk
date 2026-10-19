# JweEnc

This is the encryption algorithm to be used when encrypting a JWT on client or server side. Depending upon the context, this refers to encryption done by the client or by the server. For instance:
  - as `authorizationEncryptionEnc` value, it refers to the encryption algorithm used by server when creating a JARM response
  - as `requestEncryptionEnc` value, it refers to the expected encryption algorithm used by the client when encrypting a Request Object
  - as `idTokenEncryptionEnc` value, it refers to the algorithm used by the server to encrypt id_tokens


## Example Usage

```typescript
import { JweEnc } from "@authlete/typescript-sdk/models";

let value: JweEnc = "A256CBC_HS512";
```

## Values

```typescript
"A128CBC_HS256" | "A192CBC_HS384" | "A256CBC_HS512" | "A128GCM" | "A192GCM" | "A256GCM"
```