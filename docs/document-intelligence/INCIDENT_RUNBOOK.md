# Document Intelligence — Incident Runbook

## Incident Classification

| Severity | Response Time | Escalation |
|----------|--------------|------------|
| SEV1 — Data breach or revenue loss | Immediate | Engineering lead + Security |
| SEV2 — Service degradation | 1 hour | Engineering lead |
| SEV3 — Minor issue / bug | Next business day | Assignee |

---

## IR1: Cross-Tenant Access Detected

**Severity**: SEV1

### Detection
- Security alert on Firestore security rules
- Audit log showing `documentIntelligenceJobs` read by non-owner UID
- User complaint about unauthorized access

### Immediate Actions
1. **Verify scope**: Check the audit log for the specific jobId and requesting UID.
2. **Confirm breach**: Read the job document's `userId` field. If it differs from the requesting UID, a cross-tenant access event occurred.
3. **Revoke access**: Temporarily disable the API by setting `DOCUMENT_INTELLIGENCE_ENABLED=false` (see ROLLBACK_RUNBOOK.md).
4. **Lock down Firestore rules**: Verify `firestore.rules` matches the expected tenant isolation rule:
   ```
   match /documentIntelligenceJobs/{jobId} {
     allow read: if request.auth != null && resource.data.userId == request.auth.uid;
     allow create, update, delete: if false;
   }
   ```

### Root Cause Investigation
- Check if the API route performing the read has the owner check: `if (job.userId !== user.uid) return 403`
- Verify that all routes (GET job, checkout, execute, downloads) implement this check.
- If a route is missing the check, that route is the source of the breach.
- Review deploy history for recently modified API routes.

### Remediation
1. Fix the affected API route by adding the missing owner check.
2. Deploy the fix.
3. Run cross-tenant access test: User A requests User B's jobId — must receive 403.
4. Notify affected users if data was exposed.

### Postmortem
- Root cause:
- Affected users:
- Data exposed:
- Remediation SHA:

---

## IR2: Duplicate Charge Discovered

**Severity**: SEV1

### Detection
- User reports being charged twice for the same job
- Audit log showing two spend transactions for the same `checkoutRequestId`
- `creditTransactions` query showing duplicate entries

### Immediate Actions
1. **Confirm duplicate**: Query `creditTransactions` for the user's UID and jobId. Count `type: "spend"` records. If > 1, it is a duplicate charge.
2. **Prevent further charges**: Set `DOCUMENT_INTELLIGENCE_ENABLED=false` if the bug is in the execute path.
3. **Issue refund**: Manually credit the user's balance via Firestore admin:
   ```
   users/{uid}/credits/balance  →  { amount: FieldValue.increment(149) }
   ```
4. **Record the refund**: Add a `creditTransactions` record with `type: "release"`.

### Root Cause Investigation
- Check the `consumeEntitlement()` function in `maintenance-bom-entitlement.ts`.
- Verify the idempotency check: does it query for existing `paymentTransactionId` before creating a new spend transaction?
- Check the execute API route for race conditions on the `processingExecutionId`.
- Review Firestore transaction logs for concurrent write conflicts.

### Remediation
1. Fix the idempotency check in the entitlement module.
2. Add integration test for duplicate execute scenario.
3. Reconcile the affected user's balance.

### Postmortem
- Root cause:
- Affected users:
- Total overcharged:
- Remediation SHA:

---

## IR3: Corrupted Workbook

**Severity**: SEV2

### Detection
- User reports cannot open downloaded xlsx file
- Excel shows "corrupted file" error
- Manifest validation failure in worker logs

### Immediate Actions
1. **Verify corruption**: Download the file from GCS directly and try to open. Use `xlsx` CLI to inspect.
2. **Check all outputs**: Are all 4 output files corrupted, or just the workbook?
3. **Regenerate if possible**: If the job data is intact, reprocess by resetting the job status to `extracting` and re-executing.

### Root Cause Investigation
- Check if the `xlsx` (SheetJS) package version changed recently.
- Check the workbook generator for buffer encoding issues.
- Verify that all cell values pass through `safeCellValue()`.
- Check for binary data contamination in extracted cell values.

### Remediation
1. Roll back any recent changes to `workbook-generator.ts` or `csv-generator.ts`.
2. Regenerate corrupted files from the stored canonical row data.
3. Notify affected users and provide replacement download links.

---

## IR4: Provider Outage

**Severity**: SEV2

### Detection
- Worker jobs stuck in `extracting` stage
- Provider API returning 5xx errors
- `PROVIDER_TRANSIENT` error codes in job events

### Immediate Actions
1. **Verify provider status**: Check provider health endpoint (if available).
2. **Check service account credentials**: Verify `DOCUMENT_PROCESSOR_SERVICE_ACCOUNT` is valid.
3. **Check quotas**: Verify provider API quota is not exhausted.
4. **Fail open**: Jobs in `extracting` will retry with backoff up to 3 times. After that, transition to `failed_terminal`.

### Root Cause Investigation
- Check provider status page or API health endpoint.
- Check Cloud Logging for provider request/response details.
- Check if provider API key or endpoint changed.

### Remediation
1. If provider is down, wait for recovery (automatic retry handles this).
2. If provider endpoint changed, update `DOCUMENT_PROCESSOR_ENDPOINT` and redeploy.
3. If credentials expired, rotate service account key.
4. For extended outages (> 2 hours), manually fail affected jobs to `failed_terminal` to unblock users (credits returned).

---

## IR5: Paddle Webhook Failure (Future)

**Severity**: SEV2

### Detection
- User paid but job not transitioning to `paid`
- Webhook endpoint returning non-2xx
- `paymentStatus` stuck on `checkout_pending`

### Immediate Actions
1. **Check recent webhook logs**: Query the webhook endpoint logs for recent POST requests.
2. **Verify webhook secret**: Ensure `PADDLE_WEBHOOK_SECRET` matches the Paddle dashboard.
3. **Manually confirm payment**: If payment is confirmed in Paddle dashboard but webhook was missed, manually transition the job.

### Manual Transition Procedure
```typescript
// Admin only — run in a secure environment
const adminFirestore = getAdminFirestore();
await adminFirestore.collection("documentIntelligenceJobs").doc(jobId).update({
  paymentStatus: "paid",
  entitlementStatus: "consumed",
  status: "paid",
  updatedAt: new Date().toISOString(),
});
```

### Remediation
1. Fix webhook handling if the issue is in the endpoint code.
2. Add webhook retry mechanism (Paddle retries failed webhooks).
3. Implement a reconciliation job that compares payment records with job payment statuses.

---

## IR6: Job Stuck Beyond SLA

**Severity**: SEV3

### Detection
- Job in `queued` or processing stage for > 30 minutes
- Monitoring alert on job duration

### Investigation
1. **Check job status**: `GET /jobs/{jobId}` to see current status and timestamps.
2. **Check worker logs**: Cloud Logging for the specific `processingExecutionId`.
3. **Check Cloud Tasks queue depth**: Is the queue backed up?
4. **Check worker scaling**: Is Cloud Run at max instances?

### Remediation
1. If queue is backed up: increase `max-concurrent-dispatches` temporarily.
2. If worker is stuck: check if the worker process is hung. Restart the Cloud Run revision.
3. If a single job is stuck: manually reset the job to `queued` to trigger reprocessing.
4. If the issue is systemic: increase worker instance count or reduce per-job processing time.

---

## IR7: Source Deletion Failure

**Severity**: SEV3

### Detection
- Scheduled source deletion task failing
- `RETENTION_DELETE_FAILURE` in job events
- Source files remaining on GCS beyond 24h retention

### Investigation
1. **Check GCS file existence**: Does the source file still exist?
2. **Check service account permissions**: Does the deletion task have `storage.objects.delete` permission?
3. **Check GCS bucket lifecycle rules**: Are there lifecycle policies that should auto-delete?

### Remediation
1. Manually delete the source file if safe:
   ```bash
   gsutil rm gs://sectorcalc-bf412.firebasestorage.app/document-intelligence/{uid}/{jobId}/source/{filename}
   ```
2. Record `sourceDeletedAt` on the job document.
3. If systemic: fix the deletion task and re-run for all affected jobs.

---

## IR8: Payment Without Entitlement

**Severity**: SEV1

### Detection
- Job has `paymentStatus: "paid"` but no associated credit transaction
- `entitlementStatus` is `none` or `reserved` but user has access to paid features
- Reconciliation script finds mismatch between paid jobs and spend transactions

### Immediate Actions
1. **Isolate the job**: Transition the job to `failed_terminal` to prevent further access.
2. **Check payment processing**: Review the checkout/execute flow for the affected job.
3. **Deduct credits manually**: If no reservation exists, deduct 149 credits from the user's balance and record the transaction.

### Root Cause Investigation
- Check if the checkout API correctly calls `reserveCredits()`.
- Check if the execute API correctly calls `consumeEntitlement()`.
- Check for error paths where `paymentStatus` is set but entitlement is not recorded.

### Remediation
1. Fix the entitlement recording gap.
2. Add a consistency check: every `paid` job must have at least one `reserve` credit transaction.
3. Implement a scheduled reconciliation job (daily).

---

## IR9: Terminal Failure Spike

**Severity**: SEV2

### Detection
- > 10% of jobs transitioning to `failed_terminal` in a 1-hour window
- Monitoring alert on poison job count

### Immediate Actions
1. **Disable the service**: Set `DOCUMENT_INTELLIGENCE_ENABLED=false` to prevent new uploads.
2. **Check error codes**: Query job events for the most common `failureCode`.
3. **Check provider status**: If the spike is `PROVIDER_TRANSIENT` or `PROVIDER_INVALID_OUTPUT`, the provider may be having issues.

### Investigation
- Check recent deployments to the worker or API routes.
- Check if PDF processing volume changed dramatically.
- Check for an edge case or bug introduced in the last deploy.

### Remediation
1. Roll back the most recent deploy if it is the suspected cause.
2. If the provider is the issue, either switch to mock provider temporarily or wait for provider recovery.
3. Failed jobs will have credits returned automatically via `releaseEntitlement()`.
4. Notify affected users and offer to reprocess once the issue is resolved.

---

## IR10: Secret Exposure

**Severity**: SEV1

### Detection
- Secret committed to public repository
- `check:secrets` CI gate fails
- Alert from GitHub secret scanning
- Unauthorized API calls detected using a rotated credential

### Immediate Actions
1. **Rotate the exposed secret immediately**:
   - Firebase Admin SDK service account: generate new key in GCP Console, delete old key.
   - `DOCUMENT_PROCESSOR_SECRET`: generate new secret, update environment variable.
   - `INTERNAL_AUTH_TOKEN`: generate new token, update all consuming services.
2. **Remove the secret from git history**:
   ```bash
   # If the secret was committed recently
   git filter-branch --force --index-filter \
     "git rm --cached --ignore-unmatch <file-containing-secret>" \
     --prune-empty --tag-name-filter cat -- --all
   ```
3. **Check if secret was used**: Review audit logs for unexpected API calls using the exposed credential.

### Prevention
1. Always run `npm run check:secrets` before commit.
2. Never commit `.env.local`, `*service-account*`, `*firebase-adminsdk*`, or credentials files.
3. Ensure `.gitignore` covers all secret file patterns.
4. Use environment variables for all secrets — never hardcode.

---

## Communication Templates

### SEV1 Notification (Internal)

```
SEV1 INCIDENT: [Brief Description]
Severity: SEV1
Detected at: [Timestamp]
Detected by: [Alert/User Report]
Affected component: [API Route / Worker / Payment]
Current status: Investigating / Mitigated / Resolved
Lead: @[Name]
```

### User-Facing Status (When applicable)

```
We are investigating a service issue affecting Document Intelligence.
You may experience delays in job processing or download failures.
We will provide an update within 30 minutes.
```

## Postmortem Template

```markdown
## Incident Report: [Title]

### Summary
[1-2 sentence description]

### Timeline
- [Timestamp] Detection
- [Timestamp] Mitigation started
- [Timestamp] Service restored

### Root Cause
[Description]

### Impact
- Users affected:
- Jobs affected:
- Revenue impact:
- Duration:

### Action Items
- [ ] Fix [priority]
- [ ] Add monitoring [priority]
- [ ] Update runbook [priority]
- [ ] Add test [priority]
```
