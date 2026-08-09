# SectorCalc SEO V3 — Phase 2 Report

## Canonical policy

- Canonical host: `https://sectorcalc.com` (non-www).
- Canonical path ownership remains in `seo/registry.mjs` / `seo/registry-data.mjs`.
- Firebase Hosting uses `trailingSlash: false`.
- Legacy calculator/content URLs use permanent 301 redirects to registry-owned canonical routes.

## Machine gates

- `scripts/seo/redirect-v3.ts` rejects duplicate sources, self redirects, non-permanent redirects, redirect loops and configured redirect chains over one hop.
- Required existing headers are asserted: `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, CSP `upgrade-insecure-requests`.
- HSTS `preload` is explicitly forbidden from automatic activation.

## Existing stronger controls reused

- `verify:host-parity`
- canonical gates
- production critical E2E
- registry canonical SSOT

## Residual runtime hardening

The custom-domain HSTS header will be shipped with the final runtime SEO hardening set only after all V3 runtime-affecting phases are green, avoiding repeated production deploys. It will use `max-age=31536000; includeSubDomains` without `preload`.
