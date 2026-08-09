# SectorCalc SEO V6 Control Plane

This directory contains execution evidence and control-plane records for SEO MASTER MANDATE V6.

- `PROGRESS.md` — execution state
- `MANDATE_ERRATA.md` — SectorCalc-specific mandate compatibility resolutions
- `KARAR_DEFTERI.md` — human approval/decision ledger
- `BULGULAR_KUYRUGU.md` — findings queue; not an execution list
- `YORUM_KAYDI.md` — restrictive interpretation log
- `YETKI_IHLALI.md` — automation authority violations
- `SECURITY_PRECHECK.md` — prerequisite security gate
- `ROLLBACK.md` — security hardening rollback note

Rules are enforced phase-by-phase. A finding is not changed outside its owning phase except when a higher-priority security rule requires immediate containment.
