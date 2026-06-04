# Live QA report — SectorCalc MVP

| Field | Value |
|-------|--------|
| **Deployment date** | _YYYY-MM-DD_ (fill after first deploy) |
| **Domain tested** | https://sectorcalc.com |
| **Build verified** | `npm run lint`, `npx tsc --noEmit`, `npm run build` |
| **QA type** | Pre/post-deploy codebase QA + documented live checklist |

This pass was executed against the **repository and static build** (live HTTP checks require your deployed host). Re-run [first-live-test-script.md](./first-live-test-script.md) on production after deploy.

---

## Routes checked (expected)

### Core

| Route | Status |
|-------|--------|
| `/` | OK — static |
| `/free-tools` | OK |
| `/industries` | OK |
| `/industries/construction` | OK |
| `/industries/cleaning` | OK |
| `/industries/restaurant` | OK |
| `/industries/ecommerce` | OK |
| `/industries/cnc-manufacturing` | OK |
| `/reports/sample-decision-report` | OK |
| `/pricing` | OK |
| `/for-consultants` | OK |
| `/privacy` | OK |
| `/terms` | OK |
| `/disclaimer` | OK |

### Tools (10)

| Route | Status |
|-------|--------|
| `/tools/free/project-cost-estimator` | OK |
| `/tools/free/cleaning-cost-estimator` | OK |
| `/tools/free/food-cost-calculator` | OK |
| `/tools/free/product-margin-calculator` | OK |
| `/tools/free/machine-hour-estimator` | OK |
| `/tools/premium/change-order-impact-analyzer` | OK |
| `/tools/premium/office-cleaning-bid-optimizer` | OK |
| `/tools/premium/menu-profit-leak-detector` | OK |
| `/tools/premium/return-rate-profit-erosion-tool` | OK |
| `/tools/premium/cnc-minimum-safe-quote-analyzer` | OK |

### SEO / admin

| Route | Status |
|-------|--------|
| `/sitemap.xml` | OK — uses `NEXT_PUBLIC_SITE_URL` / default |
| `/robots.txt` | OK — disallows `/admin/`, `/api/` |
| `/admin/leads` | OK — disabled in production without flag |

---

## Issues found

| # | Area | Issue |
|---|------|--------|
| 1 | Links | Footer About/Contact and FAQ “Contact support” used `href="#"` |
| 2 | SEO | `hreflang` alternates pointed to `/tr`, `/de`, etc. (404 — locales not live) |
| 3 | Conversion | Premium unlock CTA said “Unlock flow coming soon” (unclear intent) |
| 4 | Conversion | Pricing paid-plan CTAs said “Explore Premium Tools” (sounded like navigation) |
| 5 | Conversion | Export lead CTA only appeared after clicking preview export |
| 6 | Conversion | Pricing lead modal did not prefill tool/report from plan |
| 7 | Mobile | Hero CTAs not full-width on narrow viewports |
| 8 | Mobile | Mobile nav did not close after selecting a link |
| 9 | Premium clarity | Report panel could better state paid deliverable vs live calculator |
| 10 | Export copy | Mock export message could imply files were generated |

---

## Fixes applied (Task 11)

| # | Fix |
|---|-----|
| 1 | Footer Contact → `mailto:hello@sectorcalc.com`; removed broken About `#` |
| 2 | FAQ contact → `mailto:hello@sectorcalc.com` |
| 3 | Removed non-live `hreflang` alternates; kept canonical only |
| 4 | Premium panel: “Request decision report”, clearer paid-deliverable copy, assumptions note |
| 5 | Pricing CTAs: “Request a decision report” / “Request sector access” / “Request Pro access” |
| 6 | Export toolbar: always-visible “Request premium report access”; clearer preview copy |
| 7 | Premium export block: lead CTA after preview message |
| 8 | Pricing `LeadIntentTrigger` prefills `toolRequested` (e.g. “Single Report (pricing inquiry)”) |
| 9 | Hero buttons `w-full` on mobile |
| 10 | `MobileNav` closes on link click |
| 11 | `overflow-x-hidden` / `min-w-0` on tool finder, tool shell, export toolbar, premium panel |
| 12 | Risk verdict heading accessibility (`aria-labelledby`) |
| 13 | Login page `noindex` |
| 14 | Lead modal clears field errors on successful submit |

---

## Conversion flow (code review)

| Step | Expected |
|------|----------|
| Free machine-hour estimator | Live calculator + teaser → CNC premium href |
| Premium CNC tool | Report preview + request CTAs with `toolTitle` + industry prefill |
| Export → lead | Toolbar CTA always visible; panel CTA after preview click |
| Pricing Single Report | Opens modal with plan + prefilled tool label |
| Success state | No stale inline errors after submit |

**Live verify:** submit two leads (export + pricing); confirm Firestore `leadIntents` if Firebase env is set.

---

## Lighthouse (manual — run on production)

Run Chrome Lighthouse (mobile) on:

- `https://sectorcalc.com/`
- `https://sectorcalc.com/tools/premium/cnc-minimum-safe-quote-analyzer`

| Category | Notes |
|----------|--------|
| **Performance** | Static SSG; no heavy images. Expect reasonable LCP if hosting CDN is warm. |
| **Accessibility** | Form labels in lead modal and tool inputs; risk verdict heading wired; mobile nav has sr-only label. |
| **Best Practices** | HTTPS required on live domain; no mixed content expected. |
| **SEO** | Canonical per page; sitemap/robots present; admin/login noindex. |

Document scores here after live run:

| Page | Perf | A11y | BP | SEO |
|------|------|------|-----|-----|
| Homepage | _TBD_ | _TBD_ | _TBD_ | _TBD_ |
| CNC premium tool | _TBD_ | _TBD_ | _TBD_ | _TBD_ |

---

## Remaining known limitations

- No payment, auth, email, or real export files
- Client-side rate limit only (5 / 10 min per browser)
- Admin-light disabled in production by default; Firestore rules block public read
- `/login` is a placeholder
- Language switcher UI only (English live)
- Lighthouse scores depend on hosting CDN and live env — not run in CI

---

## Next recommended tasks

1. Deploy with `NEXT_PUBLIC_SITE_URL=https://sectorcalc.com` and Firestore rules.
2. Run [first-live-test-script.md](./first-live-test-script.md) on production.
3. Fill Lighthouse table above with real scores.
4. Add auth + secured admin reads before enabling `NEXT_PUBLIC_ENABLE_ADMIN_LIGHT` on any public URL.
5. Server-side rate limiting before paid marketing traffic.

---

## Sign-off

| Role | Name | Date |
|------|------|------|
| QA | | |
| Deploy | | |
