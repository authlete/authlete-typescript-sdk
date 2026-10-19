# JweAlg

this is the 'alg' header value for encrypted JWT tokens. Depending upon the context, this refers to key transport scheme to be used by the client and by the server. For instance:
- as `authorizationEncryptionAlg` value, it refers to the encoding algorithm used by server for transporting they keys on JARM objects
- as `requestEncryptionAlg` value, it refers to the expected key transport encoding algorithm that server expect from client when encrypting a Request Object
- as `idTokenEncryptionAlg` value, it refers to the algorithm used by the server to key transport of id_tokens

**Please note that some of the algorithms are more secure than others, some are not supported very well cross platforms and some (like RSA1_5) is known to be weak**.


## Example Usage

```typescript
import { JweAlg } from "@authlete/typescript-sdk/models";

let value: JweAlg = "A128GCMKW";
```

## Values

```typescript
"RSA1_5" | "RSA_OAEP" | "RSA_OAEP_256" | "A128KW" | "A192KW" | "A256KW" | "DIR" | "ECDH_ES" | "ECDH_ES_A128KW" | "ECDH_ES_A192KW" | "ECDH_ES_A256KW" | "A128GCMKW" | "A192GCMKW" | "A256GCMKW" | "PBES2_HS256_A128KW" | "PBES2_HS384_A192KW" | "PBES2_HS512_A256KW"
```