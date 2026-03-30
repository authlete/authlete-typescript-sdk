# Tests

Integration tests that run against a live Authlete API server. Each test creates and deletes its own OAuth client within a shared service.

## Prerequisites

- A running Authlete API server (cloud or self-hosted)
- A service and service access token
- Dependencies installed: `npm install`

## Run tests

```bash
API_BASE_URL="<url>" \
  SERVICE_ID="<id>" \
  SERVICE_TOKEN="<token>" \
  ORG_TOKEN="<org-token>" \
  npm test
```

Add `--reporter=verbose` for per-test output.

Single file:

```bash
API_BASE_URL="<url>" SERVICE_ID="<id>" SERVICE_TOKEN="<token>" \
  npx vitest run __tests__/authGrant.test.ts
```

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `API_BASE_URL` | Yes | Authlete API URL (e.g. `https://us.authlete.com`) |
| `SERVICE_ID` | Yes | Numeric service ID |
| `SERVICE_TOKEN` | Yes | Service access token |
| `ORG_TOKEN` | No | Org-level token for managing service/client settings. Falls back to `SERVICE_TOKEN`. |
