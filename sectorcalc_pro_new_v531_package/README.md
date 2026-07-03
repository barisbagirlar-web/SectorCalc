# SectorCalc V5.3.1 Cursor Schema Package

This package contains one Cursor-ready V5.3.1 JSON schema file per calculator.

## Count
- Schema files: 135
- Source workbook: `sectorcalc-tool-portfolio-english.xlsx`
- Renderer target: `UniversalIndustrialDecisionForm`
- Runtime model: deterministic server-side execution only
- Public exact formula exposure: forbidden
- Public runtime LLM usage: forbidden

## Use
Run:

```bash
node validate-v531-cursor-package.mjs .
```

Then apply with the instructions in `CURSOR_APPLY_PROMPT.md`.

## Important Boundary
These files are public-safe schema contracts and formula graph blueprints. Exact executable formula expressions must remain in a private server-side formula registry and must not be exposed in the browser, public PDF, public JSON audit, or copy summary.
