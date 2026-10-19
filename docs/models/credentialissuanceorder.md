# CredentialIssuanceOrder

## Example Usage

```typescript
import { CredentialIssuanceOrder } from "@authlete/typescript-sdk/models";

let value: CredentialIssuanceOrder = {};
```

## Fields

| Field                                                                                   | Type                                                                                    | Required                                                                                | Description                                                                             |
| --------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| `requestIdentifier`                                                                     | *string*                                                                                | :heavy_minus_sign:                                                                      | The identifier of a credential request.                                                 |
| `credentialPayload`                                                                     | *string*                                                                                | :heavy_minus_sign:                                                                      | The additional payload that will be added into a credential to be issued.               |
| `issuanceDeferred`                                                                      | *boolean*                                                                               | :heavy_minus_sign:                                                                      | The flag indicating whether to defer credential issuance.                               |
| `credentialDuration`                                                                    | *number*                                                                                | :heavy_minus_sign:                                                                      | The duration of a credential to be issued.                                              |
| `signingKeyId`                                                                          | *string*                                                                                | :heavy_minus_sign:                                                                      | The key ID of a private key that should be used for signing a credential to be issued.<br/> |