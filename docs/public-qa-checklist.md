# Public QA checklist

Manual QA before and after first deploy to **sectorcalc.com**. Check each route in **mobile (375px)** and **desktop (1280px)** unless noted.

**Pass criteria per route:**

- [ ] Page loads without console errors
- [ ] No horizontal overflow / clipped content
- [ ] Title and meta description reasonable (view source or SEO extension)
- [ ] Canonical URL uses production origin when `NEXT_PUBLIC_SITE_URL` is set
- [ ] Primary CTAs navigate correctly
- [ ] Touch targets feel usable on mobile (≈44px)

---

## Core pages

### `/` — Homepage

- [ ] Hero, industry preview, pricing preview, footer
- [ ] Nav links work
- [ ] Footer: Privacy, Terms, Disclaimer, contact emails

### `/free-tools`

- [ ] All 5 free tools listed with links
- [ ] Cards link to correct tool routes

### `/industries`

- [ ] All 5 industry hubs linked

### `/industries/construction`

- [ ] Hub copy, free + premium tool links

### `/industries/cleaning`

- [ ] Same checks as construction hub

### `/industries/restaurant`

- [ ] Same checks as construction hub

### `/industries/ecommerce`

- [ ] Same checks as construction hub

### `/industries/cnc-manufacturing`

- [ ] Same checks as construction hub

### `/pricing`

- [ ] Plan cards render
- [ ] Free plan → `/free-tools`
- [ ] Single Report / Sector Pass / Pro → lead modal (not payment)
- [ ] Premium tool grid links work

### `/reports/sample-decision-report`

- [ ] Sample report layout
- [ ] “Request a premium report” opens lead modal
- [ ] Secondary CTAs to industries / pricing

### `/for-consultants`

- [ ] Benefits section, CTAs to pricing and sample report

### `/privacy`

- [ ] Legal copy, privacy@sectorcalc.com, canonical `/privacy`

### `/terms`

- [ ] Legal copy, canonical `/terms`

### `/disclaimer`

- [ ] Legal copy, canonical `/disclaimer`

---

## Free tool pages

For each route: calculator inputs, live results, validation on blur, export toolbar mock, premium teaser where applicable.

| Route | Extra checks |
|-------|----------------|
| `/tools/free/machine-hour-estimator` | Teaser → CNC premium tool |
| `/tools/free/project-cost-estimator` | Construction teaser |
| `/tools/free/cleaning-cost-estimator` | Cleaning teaser |
| `/tools/free/food-cost-calculator` | Restaurant teaser |
| `/tools/free/product-margin-calculator` | E-commerce teaser |

- [ ] machine-hour-estimator
- [ ] project-cost-estimator
- [ ] cleaning-cost-estimator
- [ ] food-cost-calculator
- [ ] product-margin-calculator

---

## Premium tool pages

For each route: calculator, risk verdict, scenarios, decision report preview, unlock CTA → lead modal, export preview in panel, export toolbar + “Request premium report access” after mock export click.

| Route |
|-------|
| `/tools/premium/cnc-minimum-safe-quote-analyzer` |
| `/tools/premium/change-order-impact-analyzer` |
| `/tools/premium/office-cleaning-bid-optimizer` |
| `/tools/premium/menu-profit-leak-detector` |
| `/tools/premium/return-rate-profit-erosion-tool` |

- [ ] cnc-minimum-safe-quote-analyzer
- [ ] change-order-impact-analyzer
- [ ] office-cleaning-bid-optimizer
- [ ] menu-profit-leak-detector
- [ ] return-rate-profit-erosion-tool

**Lead modal (any premium page):**

- [ ] Required fields validated
- [ ] Success state after valid submit
- [ ] Rate limit after 5 submits in 10 minutes

---

## SEO / system routes

### `/sitemap.xml`

- [ ] Includes home, hubs, 10 tools, pricing, legal pages
- [ ] URLs use `NEXT_PUBLIC_SITE_URL` origin
- [ ] No `/admin` URLs

### `/robots.txt`

- [ ] `Disallow: /admin/`
- [ ] `Sitemap:` points to production sitemap URL

---

## Admin (production)

### `/admin/leads`

**With `NEXT_PUBLIC_ENABLE_ADMIN_LIGHT` unset (default production):**

- [ ] Disabled state only — **no lead table loaded**
- [ ] Amber + red security warnings visible

**Do not enable on public production without auth.**

---

## Post-deploy smoke (5 minutes)

1. Homepage → one free tool → one premium tool → lead submit
2. `/sitemap.xml` + `/robots.txt`
3. One legal page from footer
4. Confirm `/admin/leads` disabled on production URL

Detailed live walkthrough: [first-live-test-script.md](./first-live-test-script.md).
