# SectorCalc Coding-Agent Instructions

Read `AGENTS.md` and `.github/INDUSTRIAL_QUALITY_SETUP.md` before editing.

## Operating objective

Preserve SectorCalc as a deterministic industrial calculation and decision-evidence system. Correctness and traceability outrank speed.

## Mandatory system chain

For every tool-related change, validate the complete chain:

`slug -> schema/tool_id -> required inputs -> canonical units -> formula module -> output contract -> decision state -> sealed report/PDF`

Never repair only the visible UI symptom when the defect can originate in schema identity, unit conversion, auth/session state, engine execution, or result rendering.

## Prohibited behavior

- No invented PASS, hidden SKIP, or unverified completion claim.
- No production deploy unless explicitly requested.
- No secrets, credentials, test passwords, service-account JSON, generated reports, or customer data in Git.
- No client-side Pro formula execution.
- No pricing, credits, Paddle, Firebase production configuration, or legal-copy changes outside explicit scope.
- No second PDF rendering framework; use the existing Playwright + pdf-lib pipeline.
- No cross-tool generic outputs used to satisfy a contract.

## Calculation acceptance

A calculation patch requires independently derived expected values, absolute and relative tolerances, finite-output checks, unit round-trip coverage, nominal/boundary/adverse cases, and tool-specific mathematical properties. Hash-only acceptance is invalid.

## PDF acceptance

PDFs must originate from a sealed result or deterministic report view model and include report ID, tool key, formula/schema version, input snapshot, results, decision state, UTC timestamp, and verification hash. Validate metadata, A4/Letter print layout, overflow, and repeatability.

## Required verification

Run the narrow tests first, then the relevant canonical gates:

```bash
npm ci
npm run typecheck
npm run lint:errors
npm run test:v5-form
npm run test:v5-runtime
npm run guard:pro-v2-all-extended
npm run test:golden:free-v531
npm run build
```

Authenticated runtime and PDF acceptance must finish with `FAIL=0` and `SKIP=0` before a release-ready claim.

## Delivery

Report root cause, files changed, exact commands/results, remaining blockers, and reversibility. Keep PRs narrow; do not mix unrelated historical changes.
