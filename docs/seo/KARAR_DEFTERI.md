# SectorCalc SEO Decision Ledger

## 2026-08-09 — Security precheck

- Decision: SEO MASTER MANDATE V6 execution remains BLOCKED under AIP-13 until the exposed Paddle server credentials are rotated at provider level.
- Approved by: user instruction to perform the required remediation.
- Reason: redacting visible PR text does not revoke a credential.
- Execution: PR #257 description was redacted; issue #260 was opened; repository secret guards were hardened on a separate security branch and merged through PR #261.
- Irreversible part: provider credential revocation/rotation. The connected GitHub tool has no Paddle/GCP mutation capability.
- ROLLBACK: repository guard changes can be reverted by reverting the security PR; exposed credentials must never be restored.

## 2026-08-09 — V6 execution authority and profile

- Decision: install the V6 machine execution package and execute the SectorCalc program under application profile M.
- Approved by: project owner in the current instruction, granting authority to perform the required reversible repository changes and complete the SEO contract within available tool permissions.
- Reason: SectorCalc is one growing commercial site/repository; profile L is reserved for multi-site factory/portfolio operation and would add non-applicable machinery rather than useful rigor.
- Commercial objective: maximize qualified organic discovery and monetizable engineering decision sessions while preserving evidence, safety and deterministic release controls.
- Threshold decision: all operational thresholds live in `sites/sectorcalc/seo.config.json`; economic values with no measured evidence start at zero rather than being fabricated.
- Budget-governance split: INVEST 50 / HOLD 30 / HARVEST 15 / DIVEST 5. This is an allocation rule for prioritization, not a performance claim.
- AI crawler policy: search/retrieval allowed; training crawlers blocked unless a later recorded decision changes the policy.
- Phase 18: SKIP_NA under profile M.
- ROLLBACK: revert the V6 bootstrap PR; existing production SEO/runtime guards remain authoritative during rollback.
