# Launch Incident Response

Severity-based response during the first 14 days (and ongoing freeze period). Operations hub: [Final Launch Command Center](./final-launch-command-center.md).

---

## Severity 1 — Critical

**Examples:** Site down, build fail, homepage crash, sitemap broken, secret leak, payment/export leak, robots blocking public pages.

**Response:**

1. Stop campaign sharing
2. Rollback or hotfix on `main`
3. Run `npm run lint`, `npx tsc --noEmit`, `npm run test`, `npm run build`
4. Redeploy only after all pass
5. Document issue (date, cause, fix, prevention) in daily note or Week-1 report
6. Re-run [Quick Launch Checklist](./quick-launch-checklist.md) before resuming shares

**Escalation:** If secret leak suspected, rotate credentials per [Security Notes](./security-notes.md) and [Env Checklist](./env-checklist.md).

---

## Severity 2 — Major

**Examples:** Important CTA broken, premium analyzer crash, mobile unusable on Tier-1 URL, broken internal link on priority page, invalid JSON-LD on major landing.

**Response:**

1. Fix within same day
2. Retest affected user journey (free calculate → premium CTA → preview → unlock)
3. Redeploy after test/build pass
4. Note in command center daily log

Do not batch Severity 2 with unrelated feature work.

---

## Severity 3 — Minor

**Examples:** Copy typo, small spacing, non-critical FAQ gap, minor card height mismatch.

**Response:**

1. Add to [Backlog Intake](./backlog-intake-template.md)
2. Fix during weekly batch **only if** conversion data shows impact
3. Otherwise defer until after freeze or Week-2 decision

---

## Post-incident checklist

- [ ] Severity classified correctly
- [ ] Blocker matrix updated ([command center §3](./final-launch-command-center.md#3-launch-blocker-matrix))
- [ ] Tests and build green
- [ ] Manual QA on affected URLs
- [ ] Campaign sharing resumed (if paused)
- [ ] Known risk documented for next daily review
