# VciBatchIssueResponse

## Example Usage

```typescript
import { VciBatchIssueResponse } from "@authlete/typescript-sdk/models";

let value: VciBatchIssueResponse = {};
```

## Fields

| Field                                                                                                | Type                                                                                                 | Required                                                                                             | Description                                                                                          |
| ---------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `resultCode`                                                                                         | *string*                                                                                             | :heavy_minus_sign:                                                                                   | The code which represents the result of the API call.                                                |
| `resultMessage`                                                                                      | *string*                                                                                             | :heavy_minus_sign:                                                                                   | A short message which explains the result of the API call.                                           |
| `action`                                                                                             | [models.VciBatchIssueResponseAction](../models/vcibatchissueresponseaction.md)                       | :heavy_minus_sign:                                                                                   | The next action that the implementation of the batch credential endpoint should take.<br/>           |
| `responseContent`                                                                                    | *string*                                                                                             | :heavy_minus_sign:                                                                                   | The content of the response that the implementation of the batch credential endpoint should return.<br/> |