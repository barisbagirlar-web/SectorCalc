# Document Intelligence — API Contracts

## Response Envelope

```typescript
{
  ok: boolean;
  data?: object;
  error?: {
    code: string;
    message: string;
  };
  requestId?: string;
}
```

## Endpoints

### Health Check

```
GET /api/document-intelligence/health
```

Returns feature flag status and product availability.

### Diagnostic Upload

```
POST /api/document-intelligence/maintenance-bom/diagnostic/upload
Auth: Bearer token
Body: FormData with PDF file
```

Returns `jobId` and upload parameters.

### Diagnostic Start

```
POST /api/document-intelligence/maintenance-bom/diagnostic/start
Auth: Bearer token
Body: { jobId: string }
```

Runs diagnostic on uploaded file. Returns eligibility result and preview rows.

### Job Status

```
GET /api/document-intelligence/maintenance-bom/jobs/{jobId}
Auth: Bearer token
```

Returns full job state. Owner-only access.

### Checkout

```
POST /api/document-intelligence/maintenance-bom/jobs/{jobId}/checkout
Auth: Bearer token
```

Allowed only for `diagnostic_eligible` jobs. Returns product info and credit availability.

### Execute

```
POST /api/document-intelligence/maintenance-bom/jobs/{jobId}/execute
Auth: Bearer token
```

Allowed only when payment is confirmed. Idempotent — safe to retry.

### Downloads

```
GET /api/document-intelligence/maintenance-bom/jobs/{jobId}/downloads
Auth: Bearer token
```

Returns short-lived signed URLs for all available artifacts. Owner-only, completed-only.

### Process (Internal)

```
POST /api/document-intelligence/maintenance-bom/internal/process
Auth: Service-to-service
Body: { jobId, processingExecutionId }
```

Private worker endpoint. Not exposed to clients.

### Samples

```
GET /api/document-intelligence/samples?file=bom|exception|source-map
No auth required
```

Returns downloadable synthetic sample files.

## Error Codes

| Code | HTTP | Description |
|---|---|---|
| UNAUTHORIZED | 401 | Missing or invalid auth token |
| FORBIDDEN | 403 | Cross-tenant access attempt |
| NOT_FOUND | 404 | Job not found |
| PRODUCT_UNAVAILABLE | 503 | Feature flag disabled |
| INVALID_STATE | 400 | Job status prevents operation |
| NOT_ELIGIBLE | 400 | Diagnostic not eligible |
| INSUFFICIENT_CREDITS | 402 | Need more credits |
| PAYMENT_NOT_CONFIRMED | 402 | Payment not verified |
| NOT_COMPLETED | 400 | Outputs not ready |
| EXPIRED | 410 | Outputs expired |
| SERVER_ERROR | 500 | Internal error |
