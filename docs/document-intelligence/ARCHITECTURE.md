# Document Intelligence — Architecture

## Runtime Topology

```
Browser (Next.js UI)
  │
  ├── Public Pages (Server Components — SEO indexable)
  │   ├── /document-intelligence                          (Category landing)
  │   └── /document-intelligence/maintenance-bom-recovery  (Product landing)
  │
  ├── Authenticated Pages (Client Components)
  │   ├── /document-intelligence/maintenance-bom-recovery/new               (Upload/Diagnostic)
  │   ├── /document-intelligence/maintenance-bom-recovery/jobs/[jobId]      (Job detail)
  │   └── /document-intelligence/maintenance-bom-recovery/jobs/[jobId]/review (Review UI)
  │
  └── API Routes (Next.js Route Handlers — Node.js runtime)
      ├── POST  /api/document-intelligence/maintenance-bom/diagnostic/upload
      ├── POST  /api/document-intelligence/maintenance-bom/diagnostic/start
      ├── GET   /api/document-intelligence/maintenance-bom/jobs/{jobId}
      ├── POST  /api/document-intelligence/maintenance-bom/jobs/{jobId}/checkout
      ├── POST  /api/document-intelligence/maintenance-bom/jobs/{jobId}/execute
      ├── GET   /api/document-intelligence/maintenance-bom/jobs/{jobId}/downloads
      ├── POST  /api/document-intelligence/maintenance-bom/internal/process
      ├── GET   /api/document-intelligence/health
      └── GET   /api/document-intelligence/samples

Firebase Services
  ├── Firebase Auth                      (Authentication)
  ├── Cloud Firestore                    (Job metadata, events, state machine)
  ├── Cloud Storage                      (Source PDFs, output artifacts)
  ├── Cloud Tasks (future)               (Async processing queue)
  └── Cloud Run Worker (future)          (Heavy PDF processing)

External
  └── Document Processor Provider (mock/configurable — PDF extraction)

Payment
  └── Existing SectorCalc Credit System  (users/{uid}/credits/balance)
```

## Integration Points

| System | Integration |
|---|---|
| Firebase Auth | Token verification via `verifySignedInUser()` |
| Firestore | `documentIntelligenceJobs/{jobId}` collection |
| Cloud Storage | `document-intelligence/{uid}/{jobId}/source/` and `output/` |
| Credit System | Dedicated entitlement module checks/deducts credits |
| Navigation | SiteHeader (desktop) + MobileNavigationShell + EnterpriseFooter |
| Sitemap | `getDocumentIntelligenceSitemapRoutes()` in sitemap manifest |
| Feature Flag | `DOCUMENT_INTELLIGENCE_ENABLED` env var |
