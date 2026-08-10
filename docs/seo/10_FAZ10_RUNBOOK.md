# Phase 10 — Migration and Crisis Runbook

## Migration sequence
1. Export the current SEO registry and immutable baseline evidence.
2. Prepare a redirect ledger using the Phase 2 contract; do not execute redirects from an autonomous job.
3. Build and validate in preview/staging: canonical parity, sitemap/robots parity, first-HTML parity, schema, E2E and security gates.
4. Record the explicit production approval in `docs/seo/KARAR_DEFTERI.md` before any domain or irreversible migration action.
5. Merge only after all required CI checks pass.
6. Promote the merged candidate, then validate HTTP status, canonical, robots, sitemap, H1, JSON-LD and critical flows.
7. Observe the defined post-change window using verified GSC/log/CWV evidence when available; never synthesize missing measurements.
8. Accept or revert from the merged commit using the same quality gates.

## Scenario A — Algorithm / organic click decline
Detection: compare verified 28-day evidence only after structural-break controls. First four hours: freeze speculative mass edits, verify indexability/canonical/robots and separate demand from ranking. Decision: technical fault → repair/revert; verified demand/ranking change → Phase 11 portfolio review. Communication: evidence, uncertainty and next checkpoint only.

## Scenario B — Manual action
Detection: verified Search Console notice. First four hours: preserve notice/evidence, stop risky off-page actions, inventory affected URLs. Decision: remediate the cited policy issue, review evidence, then use the documented reconsideration process. Communication: exact scope and remediation; no invented recovery date.

## Scenario C — Technical disaster
Detection: accidental noindex, robots block, canonical drift, redirect chain/loop, sitemap collapse or first-HTML loss. First four hours: identify offending merge, run rollback gates, restore last-known-good through normal merge/deploy control. Decision: promote only if preview and post-deploy live contracts pass. Communication: incident facts, affected surface and verified recovery state.

## Scenario D — Revenue crisis
Detection: verified acquisition remains stable while measured business value materially declines. First four hours: do not attribute the problem to SEO without evidence; validate analytics integrity and product/checkout path. Decision: route to conversion discipline and Phase 17 portfolio economics. Communication: separate acquisition, conversion and monetization causes.

## Annual exercise record
2026-08-10: repository tabletop exercise completed for Scenario C using the existing revert → build → guards → merge → deploy → live-contract sequence. This is a tabletop record, not a claim that a staging incident was executed. A future staging exercise remains evidence-dependent.

## Execution boundaries
Autonomous jobs may prepare evidence and PRs; they may not execute domain migration, bulk retirement, disavow, paid-link acquisition, cross-site link schemes or content publication. HSTS preload is not part of this runbook.

ROLLBACK: revert the runbook/contract PR. Any later production migration uses the specific rollback commit identified before execution.
