# SectorCalc Industrial Quality Gate

## Required repository secrets

Create a dedicated, non-admin Firebase test account. Do not use an owner or production customer account.

- `BARIS_E2E_TEST_USER_EMAIL`
- `BARIS_E2E_TEST_USER_PASSWORD`
- `BARIS_PDF_TEST_TARGETS`

`BARIS_PDF_TEST_TARGETS` must be a JSON array. Example:

```json
[
  {
    "name": "break-even-survival-cash",
    "url": "/reports/pro/break-even-survival-cash-calculator/e2e",
    "readySelector": "[data-sectorcalc-report-ready='true']",
    "requiredText": ["Break-Even", "Decision State"],
    "format": "A4"
  },
  {
    "name": "machine-hourly-rate",
    "url": "/reports/pro/machine-hourly-rate-proof-report/e2e",
    "requiredText": ["Machine Hourly Rate", "Decision State"],
    "format": "Letter"
  }
]
```

The report URLs must resolve sealed, deterministic E2E fixtures. They must not debit real customer credits or create billable transactions.

## Optional repository variable

- `BARIS_E2E_BASE_URL`: defaults to `https://sectorcalc.com`.
- `ENABLE_GHAS_DEPENDENCY_REVIEW`: set to `true` only when GitHub Advanced Security is enabled for this private repository. Without GHAS, the official dependency review API is unavailable and the job remains skipped by design.

## Required branch protection check

After one complete green run with `FAIL=0` and `SKIP=0`, require:

- `Industrial Quality Gate / Calculation kernel`
- `Industrial Quality Gate / Authenticated Pro runtime`
- `Industrial Quality Gate / Pro PDF evidence`
- `Workflow Security / zizmor workflow audit`

Do not make `Dependency Review` required until GHAS is enabled and the job has completed successfully.

## PDF report DOM contract

Every report page used by the PDF gate must expose:

```html
<main data-sectorcalc-report-ready="true">
  <section data-pdf-section="identity">...</section>
  <section data-pdf-section="inputs">...</section>
  <section data-pdf-section="results">...</section>
  <section data-pdf-section="decision">...</section>
</main>
```

Required visible markers:

- `SectorCalc`
- `Report ID`
- `Tool`
- `Formula`
- `Decision`

Required PDF metadata must contain `SectorCalc` in title, subject, or keywords.

## Security constraints

- External actions are pinned to immutable commit SHAs.
- Checkout credentials are not persisted.
- Workflow permissions default to read-only or empty.
- Test credentials are never committed, printed, or stored as artifacts.
- Test accounts must have the minimum entitlement required for one deterministic execution.
