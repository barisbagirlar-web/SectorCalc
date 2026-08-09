# Security Hardening Changelog

2026-08-09

- Redacted exposed server credential values from historical PR #257 description.
- Opened issue #260 for mandatory provider-level credential rotation.
- Hardened Paddle Production Guard to report filenames only and broaden webhook secret detection.
- Added public PR/commit text secret scanner with non-disclosure behavior.
- Added CI workflow to scan PR title/body and commit messages.
- Added negative tests for API key, webhook secret, legacy webhook secret and GitHub token patterns.
- Initialized SEO V6 evidence/control records and SectorCalc compatibility errata.
