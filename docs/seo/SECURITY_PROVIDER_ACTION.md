# Provider Rotation Action

Required external action tracked in issue #260:

1. Revoke the exposed Paddle server API key.
2. Rotate the exposed Paddle webhook/notification secret.
3. Store replacements only in GCP Secret Manager.
4. Disable superseded secret versions.
5. Re-run production Paddle readiness checks with redacted logging.

No secret value may be pasted into this repository, GitHub issues, PRs, commits or logs.
