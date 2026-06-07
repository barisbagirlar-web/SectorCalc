# Week-1 Fix Decision Rules

Apply fixes only when Week-1 data shows a clear signal. One change at a time when possible; note in the weekly report.

---

## Indexing & SEO

### IF: GSC “Discovered – currently not indexed”

**THEN:**
1. Add 2–3 internal links from Tier-1 or Tier-2 pages to the affected URL
2. Confirm `FeaturedAnswerBlock` renders on the page (SEO landing / guide / free tool where applicable)
3. Verify H1, title, and meta description are specific (not generic duplicates)
4. Confirm sitemap includes the URL and canonical matches the inspected URL
5. Request indexing in GSC after fixes

**Do not:** Change URL structure, remove hreflang, or add noindex.

---

## Free tool funnel

### IF: Free tool opens high but calculate low

**THEN:**
1. Clarify helper text on ambiguous inputs (no formula changes)
2. Verify default values produce a valid first result
3. Confirm result panel visible above fold on mobile (390px)
4. Check validation error messages are plain language
5. Test form on mobile — tap targets ≥ 44px

**Do not:** Remove required inputs without product approval.

---

### IF: Calculate high but premium CTA low

**THEN:**
1. Strengthen related premium block copy (`premiumBlockTitle`, `premiumBlockBody`)
2. Make CTA label outcome-focused: “See what this estimate misses”
3. Add one line under CTA: hidden drivers, thresholds, export
4. Confirm premium link resolves via `resolvePremiumAnalyzerHref()`

**Do not:** Add second premium CTA block on the same page.

---

## Premium funnel

### IF: Premium preview high but unlock low

**THEN:**
1. Review locked state copy (`premiumDecisionReport.locked`)
2. Ensure preview shows concrete headline exposure before lock
3. Confirm pricing link visible in locked state secondary CTA
4. Verify `premium_unlock_click` fires on unlock button (see [conversion-event-qa.md](./conversion-event-qa.md))

**Do not:** Change checkout flow, Stripe, or pricing amounts.

---

## Pricing funnel

### IF: Pricing view high but CTA low

**THEN:**
1. Confirm Pro card is visually dominant (`proBadge`, placement)
2. Check for copy conflicts between Single / Pro / Team cards
3. Ensure “single report from $9” (`singlePrice`, `singleCta`) is visible without scroll on mobile
4. Verify `pricing_cta_click` includes `ctaId` for plan differentiation

**Do not:** Change prices or plan structure in Week-1.

---

## Technical blockers

### IF: Console error on Tier-1 page

**THEN:** Fix only if error blocks calculate, CTA, or navigation.

### IF: Mobile horizontal scroll at 390px

**THEN:** Fix overflow on affected component (`overflow-x-hidden`, `min-w-0`, break-words).

### IF: Broken internal link

**THEN:** Fix href to match sitemap manifest path pattern.

---

## What NOT to fix in Week-1

- Missing translations for es/de/ar (unless blocking EN/TR launch)
- Long-tail Tier-3 pages with zero traffic
- Subjective design preferences without conversion data
- Premium engine, formulas, Firestore, Auth, Admin

---

## Escalation

| Signal | Escalate to |
|---|---|
| Sitemap missing URLs | Engineering — sitemap manifest |
| Canonical/hreflang conflict | Engineering — metadata + sitemap |
| Checkout failure | Engineering — billing (out of Week-1 scope) |
| Zero indexing after 7 days on Tier-1 | SEO runbook + IndexNow re-submit |
