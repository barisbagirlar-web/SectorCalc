# Industrial Quality Gate

The quality gate is self-contained and uses isolated Firebase Auth and Firestore emulators. It does not require production user credentials, customer accounts, account credits, or a production session cookie.

## Closed verification chain

`route -> tool identity -> schema -> display inputs/units -> canonical normalization -> server formula registry -> output contract -> decision state -> rendered report -> A4 PDF evidence`

## Jobs

- **Calculation kernel**: architecture, schema/formula binding, runtime registration, output isolation, TypeScript, lint, form/runtime tests, premium audit, free golden vectors, root-only routing, and production build.
- **Authenticated Pro runtime**: creates an ephemeral masked password, seeds an emulator-only owner account, starts the production build locally, executes the Break-Even known-answer vector through the browser and API, and captures runtime evidence.
- **Pro PDF evidence**: validates generated PDF size, page count, SectorCalc metadata, SHA-256 evidence, and repeatability.
- **Workflow Security**: runs the pinned zizmor audit over all workflows.

## Security boundary

- No E2E password or session cookie is stored in GitHub, source control, logs, or repository variables.
- The temporary password is generated during each workflow run and masked immediately.
- No production Firebase writes, credit deductions, Paddle calls, or deployments occur in this gate.
- GitHub actions are pinned to immutable commit SHAs.

## Required checks before merge

- `CI / Canonical quality gate`
- `Industrial Quality Gate / Calculation kernel`
- `Industrial Quality Gate / Authenticated Pro runtime`
- `Industrial Quality Gate / Pro PDF evidence`
- `Break-Even Contract Verification / verify-break-even-contract`
- `Break-Even Browser E2E / browser-e2e`
- `SEO Quality Gates / seo-quality-gates`
- `Workflow Security / zizmor workflow audit`

Dependency Review remains conditional on GitHub Advanced Security for this private repository.
