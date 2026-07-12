# SectorCalc Engineering Control Plane

## Objective

Prevent unverified code, formula, payment, authentication, and deployment changes from reaching `main`.

## Required pull-request evidence

Every production-affecting pull request must report:

```text
SCOPE=
TOUCHED_FILES=
TYPECHECK=
LINT_ERRORS=
GOLDEN_TESTS=
BUILD=
BROWSER_E2E=
LIVE_SMOKE=
EXPECTED_DEPLOYMENT_SHA=
ACTUAL_DEPLOYMENT_SHA=
PAYMENT_FILES_TOUCHED=YES|NO
ENV_FILES_TOUCHED=YES|NO
OPEN_RISKS=
```

A blank field is not a pass.

## Merge policy

`main` should require the following checks before merge:

- `Engineering Control Plane / Canonical quality gate`
- `CodeQL / Analyze JavaScript and TypeScript`

Recommended repository settings:

- require a pull request before merging
- require status checks to pass
- require branches to be up to date
- require conversation resolution
- block force pushes
- block branch deletion
- include administrators in branch protection

## Validation tiers

### Tier 1 — Documentation and governance

- diff inspection
- path/scope verification
- no credential or production configuration changes

### Tier 2 — Application code

- `npm ci`
- `npm run check:secrets`
- `npm run typecheck`
- `npm run lint:errors`
- relevant unit, golden, and contract tests
- `npm run build`

### Tier 3 — Commercial and production-critical code

Tier 2 plus the relevant dedicated gate:

- Free tools: `npm run guard:free-release`
- Pro V2: `npm run guard:pro-v2-all-extended`
- Payments and credits: `npm run guard:payment-release-all`
- Full release: `npm run verify:gate`

### Tier 4 — Live closure

Required before stating production readiness:

- live route HTTP verification
- real browser input → calculation → result verification
- mobile viewport verification where UI changed
- authentication and entitlement verification where affected
- Paddle sandbox or production transaction evidence where affected
- webhook receipt and idempotency evidence where affected
- expected deployment SHA equals live deployment SHA

## Failure modes and controls

### Green CI but broken production environment

Control: live smoke tests and deployment SHA matching remain mandatory outside pull-request CI.

### Dependency update regression

Control: Dependabot major updates are ignored; minor and patch updates open reviewable pull requests and must pass the canonical gate.

### AI or automation changes unrelated files

Control: CODEOWNERS, scoped pull requests, protected paths, and explicit touched-file evidence.

### False-positive PASS reporting

Control: no readiness statement without command output or verifiable live evidence.