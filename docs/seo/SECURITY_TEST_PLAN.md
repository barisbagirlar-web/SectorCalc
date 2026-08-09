# Security Hardening Validation Plan

Required before merge:

1. `npm test` — includes `tests/public-text-secret-scan.test.ts`.
2. `npm run typecheck`.
3. `node scripts/verify-paddle-production-guard.mjs`.
4. `npm run build` — includes Paddle Production Guard against the production bundle.
5. Public Secret Guard workflow must PASS on the PR.
6. Review changed files: no runtime HTML, robots, sitemap, redirects, pricing or payment behavior changes.

Negative-test acceptance:
- synthetic Paddle API key → exit 1;
- synthetic Paddle webhook secret containing `+`, `/`, `=` → exit 1;
- scanner stdout/stderr must not contain the synthetic secret;
- empty scanner input → exit 3.

Provider rotation is tracked independently by issue #260 and remains a security gate even if repository CI passes.
