# Industrial Quality Gate activation

Required encrypted secrets:

- `BARIS_E2E_TEST_USER_EMAIL`
- `BARIS_E2E_TEST_USER_PASSWORD`
- `BARIS_PDF_TEST_TARGETS`

Use a dedicated non-admin Firebase test account with minimum test credits. Never use an owner or customer account.

Optional variables:

- `BARIS_E2E_BASE_URL` (defaults to `https://sectorcalc.com`)
- `ENABLE_GHAS_DEPENDENCY_REVIEW=true` only when GitHub Advanced Security is enabled for this private repository.

`BARIS_PDF_TEST_TARGETS` is a JSON array:

```json
[
  {
    "name": "break-even-survival-cash",
    "url": "/reports/pro/break-even-survival-cash-calculator/e2e",
    "readySelector": "[data-sectorcalc-report-ready='true']",
    "requiredText": ["Break-Even", "Decision State"],
    "format": "A4"
  }
]
```

Report pages must expose `data-sectorcalc-report-ready="true"` and identify printable sections with `data-pdf-section`. PDF metadata must contain `SectorCalc`.

After one green run with zero failures and zero skips, require these checks on `main`:

- `Industrial Quality Gate / Calculation kernel`
- `Industrial Quality Gate / Authenticated Pro runtime`
- `Industrial Quality Gate / Pro PDF evidence`
- `Workflow Security / zizmor workflow audit`

Do not require `Dependency Review` until GHAS is active and the job has passed.
