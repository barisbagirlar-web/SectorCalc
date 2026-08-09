# SectorCalc SEO Decision Ledger

## 2026-08-09 — Security precheck

- Decision: SEO MASTER MANDATE V6 execution remains BLOCKED under AIP-13 until the exposed Paddle server credentials are rotated at provider level.
- Approved by: user instruction to perform the required remediation.
- Reason: redacting visible PR text does not revoke a credential.
- Execution: PR #257 description was redacted; issue #260 was opened; repository secret guards were hardened on a separate security branch.
- Irreversible part: provider credential revocation/rotation. The connected GitHub tool has no Paddle/GCP mutation capability.
- ROLLBACK: repository guard changes can be reverted by reverting the security PR; exposed credentials must never be restored.
