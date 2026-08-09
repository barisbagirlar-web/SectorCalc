# Security Prerequisite Scope Note

This branch is a prerequisite security containment branch, not Faz 0. It exists because AIP-13 has higher priority than phase scope and blocks ordinary SEO phase execution until credential exposure is remediated.

No public runtime HTML, robots, sitemap, redirect, pricing, calculator, payment logic, or deployment target is changed by this branch.

After this branch is validated, SEO phase work resumes on dedicated `seo/faz-<NN>-<slug>` branches.
