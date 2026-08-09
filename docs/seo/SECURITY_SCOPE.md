# Security Branch Scope Lock

Allowed in this branch:
- repository secret scanning and non-disclosure guards;
- tests for those guards;
- CI wiring for public PR/commit text scanning;
- SEO control-plane records needed to document the blocker and compatibility errata.

Forbidden in this branch:
- robots/sitemap/canonical/redirect changes;
- calculator or pricing changes;
- Paddle business logic changes;
- deployment or Firebase configuration changes;
- content publication.
