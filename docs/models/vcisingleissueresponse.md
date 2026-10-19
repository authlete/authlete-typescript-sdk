# VciSingleIssueResponse

## Example Usage

```typescript
import { VciSingleIssueResponse } from "@authlete/typescript-sdk/models";

let value: VciSingleIssueResponse = {};
```

## Fields

| Field                                                                                          | Type                                                                                           | Required                                                                                       | Description                                                                                    |
| ---------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| `resultCode`                                                                                   | *string*                                                                                       | :heavy_minus_sign:                                                                             | The code which represents the result of the API call.                                          |
| `resultMessage`                                                                                | *string*                                                                                       | :heavy_minus_sign:                                                                             | A short message which explains the result of the API call.                                     |
| `action`                                                                                       | [models.VciSingleIssueResponseAction](../models/vcisingleissueresponseaction.md)               | :heavy_minus_sign:                                                                             | The next action that the implementation of the credential endpoint should take.<br/>           |
| `responseContent`                                                                              | *string*                                                                                       | :heavy_minus_sign:                                                                             | The content of the response that the implementation of the credential endpoint should return.<br/> |
| `transactionId`                                                                                | *string*                                                                                       | :heavy_minus_sign:                                                                             | The issued transaction ID.<br/>                                                                |