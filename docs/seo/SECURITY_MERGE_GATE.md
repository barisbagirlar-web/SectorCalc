# Security Merge Gate

Merge only if:
- unit tests PASS;
- typecheck PASS;
- Paddle Production Guard PASS;
- full build PASS;
- Public Secret Guard PASS;
- changed-file review confirms no runtime scope drift.

Provider rotation issue #260 remains a separate prerequisite for declaring AIP-13 fully clear and beginning SEO V6 phase execution.
