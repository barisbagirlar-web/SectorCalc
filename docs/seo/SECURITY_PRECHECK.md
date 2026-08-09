# SEO V6 Security Precheck — SectorCalc

Date: 2026-08-09
Status: BLOCKED_PENDING_PROVIDER_ROTATION

## [Kesin] Findings

1. A historical public PR description exposed a production Paddle server API key and webhook secret in plain text.
2. The visible PR description has been redacted, but redaction cannot revoke credentials.
3. The previous repository guard used `git grep -nE`, which could print a matched secret value into CI logs when a violation occurred.
4. The previous webhook pattern did not cover all non-whitespace characters used by provider secrets, including `+`, `/`, and `=`.

## Remediation implemented in repository

- Paddle tracked-file guard reports filenames only; matching values are never printed.
- Secret detection covers Paddle API keys, webhook secrets, legacy webhook secrets and public-text GitHub token patterns.
- A public-text scanner blocks credential patterns in PR title/body and commit messages.
- Negative tests verify blocking and verify that the detected value is not echoed.

## Provider action still required

- Revoke/rotate the exposed Paddle authentication API key.
- Rotate the exposed Paddle webhook/notification secret.
- Update only GCP Secret Manager with replacement values.
- Re-run production billing readiness checks using redacted logging.

Tracking issue: #260

ROLLBACK: repository guard changes can be reverted by reverting the security PR. Provider credential rotation is intentionally non-reversible.
