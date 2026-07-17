# Document Intelligence — Rollback Runbook

## Rollback Principles

1. **Safety first**: Rollback is always the preferred response to a production issue. Debugging on live is prohibited.
2. **No destructive data migration**: Rollback must not delete user data, job records, or credit transactions.
3. **Feature flag first**: Disabling the feature flag is the fastest and safest rollback.
4. **Deployment rollback as last resort**: Only when the feature flag is insufficient.

---

## R1: Feature Rollback via Environment Variable

**Use when**: The Document Intelligence feature is causing errors, performance issues, or security concerns but the rest of the site is stable.

### Procedure

1. Set `DOCUMENT_INTELLIGENCE_ENABLED=false` in the hosting environment.

   **Firebase Hosting (env vars):**
   ```bash
   # Update hosting environment variable
   firebase functions:config:set document_intelligence.enabled=false
   ```

   **Or directly in repo .env.production (then redeploy):**
   ```
   DOCUMENT_INTELLIGENCE_ENABLED=false
   ```

2. Redeploy hosting:
   ```bash
   DEPLOY_FORCE_REBUILD=1 node scripts/deploy-production.mjs
   ```

3. Verify the health endpoint returns `enabled: false`:
   ```bash
   curl -s https://sectorcalc.com/api/document-intelligence/health
   # Expected: { "ok": true, "data": { "enabled": false, ... } }
   ```

4. Verify API routes return 503 Feature Disabled:
   ```bash
   curl -s -o /dev/null -w "%{http_code}" \
     https://sectorcalc.com/api/document-intelligence/maintenance-bom/diagnostic/upload
   # Expected: 503
   ```

### Effects

| Area | Effect |
|------|--------|
| API routes | Return 503 `FEATURE_DISABLED` |
| Landing pages | Continue to serve (they are static) |
| Upload flow | Blocked at all API endpoints |
| Existing jobs | Inaccessible via API (routes blocked, user sees error) |
| Job data | **Preserved** in Firestore and Storage |
| Credit transactions | **Preserved** — no rollback of entitlement operations |
| Download links | Unavailable (routes blocked) |
| Source deletion | Suspended while disabled |

### Recovery

To re-enable, set `DOCUMENT_INTELLIGENCE_ENABLED=true` and redeploy. Job data is preserved and will be accessible.

---

## R2: Hide Header Link

**Use when**: The feature is functionally sound but the landing page or product page has a content/SEO issue.

### Procedure

1. Revert the navigation integration in these files:

   **SiteHeader.tsx** — Remove the Document Intelligence link:
   ```tsx
   // Remove this line
   <Link href="/document-intelligence" prefetch={true} className="sc-navbtn">Document Intelligence</Link>
   ```

   **MobileNavigationShell.tsx** — Remove the Document Intelligence section:
   ```tsx
   // Remove the Document Intelligence section and its children
   ```

   **EnterpriseFooter.tsx** — Remove the footer link:
   ```tsx
   // Remove this line
   <Link href="/document-intelligence" prefetch={true}>Document Intelligence</Link>
   ```

2. Redeploy hosting:
   ```bash
   npm run build && DEPLOY_FORCE_REBUILD=1 node scripts/deploy-production.mjs
   ```

### Effects

| Area | Effect |
|------|--------|
| Header | No Document Intelligence link |
| Mobile nav | No Document Intelligence section |
| Footer | No Document Intelligence link |
| Direct URLs | **Still accessible** at `/document-intelligence/*` |
| API routes | **Still functional** |
| Existing jobs | **Still accessible** via direct jobId URL |

### Recovery

Re-add the navigation links and redeploy.

---

## R3: Deployment Rollback to Prior SHA

**Use when**: A code change (not just the feature flag) introduced a bug that cannot be fixed by disabling the feature alone (e.g., the bug affects shared infrastructure or the credit system).

### Prerequisites

- The previous working SHA is known and accessible in git history
- No destructive migrations have been applied between the current and target SHA
- The rollback does not revert data schema changes

### Procedure

1. **Identify the last known good SHA**:
   ```bash
   git log --oneline -20
   # Identify the commit before the problematic change
   ```

2. **Create a rollback branch**:
   ```bash
   git checkout -b rollback/document-intelligence-$(date +%Y%m%d)
   ```

3. **Revert the problematic commits**:
   ```bash
   # Identify the problematic commit SHA
   # Method 1: revert specific commits
   git revert <problematic-commit-sha>
   
   # Method 2: reset to known good SHA (if no shared changes since)
   git reset --hard <known-good-sha>
   ```

   Note: Prefer `git revert` over `git reset --hard` when commits include changes outside Document Intelligence, to preserve unrelated modifications.

4. **Verify the rollback**:
   ```bash
   npm run build
   npx tsc --noEmit
   npm run lint
   npx vitest run tests/document-intelligence/
   ```

5. **Deploy the rollback**:
   ```bash
   DEPLOY_FORCE_REBUILD=1 node scripts/deploy-production.mjs
   ```

6. **Verify rollback live**:
   ```bash
   curl -s https://sectorcalc.com/api/document-intelligence/health
   git rev-parse HEAD  # Confirm deployed SHA
   ```

7. **Run smoke tests** from DEPLOYMENT_RUNBOOK.md.

### Effects

| Area | Effect |
|------|--------|
| Feature code | Reverted to prior version |
| Job data | **Preserved** (no destructive migration) |
| Credit transactions | **Preserved** |
| Storage artifacts | **Preserved** |
| Shared infrastructure | Unaffected (if reverted cleanly) |

### Recovery

To re-apply the feature after the bug is fixed, create a new branch from `main` with the fix and deploy normally.

---

## R4: Data Cleanup (Non-Destructive)

**Use when**: Test/development data was inadvertently created in the production environment, or a bug caused incorrect job states.

### Procedure

1. **Identify affected jobs**:
   ```bash
   # Query for jobs in unexpected states (admin-only script)
   node scripts/find-stale-jobs.mjs
   ```

2. **Clean up via Firestore admin** (no client writes):
   - Do **NOT** delete job records — update status to `expired` instead
   - Do **NOT** delete credit transactions — they are permanent records
   - Do **NOT** delete Storage artifacts — let retention policy handle them
   - Use `db.collection("documentIntelligenceJobs").doc(jobId).update({ status: "expired" })`

### Constraints

- **Never** delete Firestore documents for production jobs
- **Never** alter credit transaction records
- **Never** modify job records outside of a documented incident procedure

---

## Decision Matrix

| Scenario | Rollback Action | Priority |
|----------|----------------|----------|
| Feature is broken (API errors) | R1: Feature flag disable | Immediate |
| Content/SEO issue on landing page | R2: Hide header link | Same day |
| Security vulnerability in Document Intelligence code | R1 + R3: Feature flag + code revert | Immediate |
| Bug in shared infrastructure (credit system, auth) | R3: Deployment rollback | Immediate |
| Data integrity concern (job records) | R1 + investigation | Immediate |
| Wallet/credit system affected | R3: Deployment rollback | Immediate |
| Minor UI issue in product page | R2: Hide link | Next deploy |
| Provider integration issue | R1: Feature flag (keep pages up) | Within 1 hour |

## Rollback Communication

When a rollback is executed:

1. **Internal**: Notify the engineering team via the designated channel.
2. **If user-facing**: Add a note to the product landing page if the feature is expected to be live.
3. **Incident ticket**: Create an incident ticket documenting the rollback reason, SHA, and verification steps.

## Post-Rollback Tasks

- [ ] Confirm feature flag is disabled (`DOCUMENT_INTELLIGENCE_ENABLED=false`)
- [ ] Confirm API routes return 503
- [ ] Confirm no error alerts for Document Intelligence endpoints
- [ ] Confirm credit system and other SectorCalc features are unaffected
- [ ] Create a fix-forward branch with the identified fix
- [ ] Schedule a postmortem for the incident
