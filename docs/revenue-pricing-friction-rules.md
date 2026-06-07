# SectorCalc Pricing Friction Rules

Decision rules for revenue conversion review. **Do not change prices** without product sign-off — fix copy, layout, and offer clarity first.

Related: [revenue-conversion-review-template.md](./revenue-conversion-review-template.md), [conversion-event-qa.md](./conversion-event-qa.md).

---

## IF pricing views high but Pro clicks low

**Likely friction:**
- Pro card not dominant enough
- Report value unclear on pricing page
- Single report option hidden below fold
- Price trust issue (value not tied to decision outcome)

**Actions:**
1. Confirm Pro card has `proBadge` and primary visual weight
2. Ensure “single report from $9” (`singlePrice`, `singleCta`) visible without scroll on mobile (390px)
3. Tie plan copy to hidden drivers, thresholds, export — not feature lists alone
4. Compare `pricing_view` vs `pricing_cta_click` by `ctaId` (pro vs single vs team)

---

## IF premium unlock clicks high but pricing clicks low

**Likely friction:**
- Locked state secondary CTA weak or below fold
- User does not understand what is unlocked after payment
- Report preview not concrete enough before lock

**Actions:**
1. Review `PremiumReportLockedState` copy and bullet list
2. Confirm pricing link fires `view_pricing_from_locked_report`
3. Show headline exposure in preview; reserve full breakdown for unlock
4. Add one value line: “Best when the result affects pricing, operations or management decisions.”

---

## IF free calculator usage high but premium interest low

**Likely friction:**
- Related premium CTA weak or below result panel
- Free result feels “complete enough”
- Missing “what this estimate misses” message

**Actions:**
1. Update free-tool premium block title/body per revenue copy guidelines
2. Place CTA after successful calculate, not before
3. Link related premium analyzer via `resolvePremiumAnalyzerHref()`
4. Compare `free_tool_calculate` vs `free_to_premium_click` by tool slug

---

## IF beta partner submit high but pricing low

**Likely friction:**
- Market wants validation before paying
- Trust gap — needs proof, not more features

**Actions:**
1. Route beta leads into case-study / proof content
2. Do not push pricing CTAs on beta partner confirmation
3. Use beta program for first references, then retarget with premium reports
4. Track `beta_partner_submit` separately from `pricing_cta_click`

---

## IF export intent high but purchase low

**Likely friction:**
- Export is the paywall trigger but entitlement flow unclear
- User expects export after calculate without payment step

**Actions:**
1. Prioritize export entitlement messaging in locked state
2. Ensure `locked_export_click` → unlock → checkout path is clear
3. Review `PremiumReportExportActions` for entitled vs locked states
4. Do not remove export paywall — clarify value before export

---

## Scoring reference

Use `scoreRevenueIntent()` from `src/lib/analytics/revenue-funnel.ts`:

| Event | Score |
|---|---:|
| free_tool_open | 1 |
| free_tool_calculate | 3 |
| free_to_premium_click | 6 |
| premium_analyzer_open | 7 |
| pricing_view | 8 |
| report_csv_click / report_print_click | 9 |
| premium_unlock_click / report_export_click | 10 |
| pricing_cta_click | 12 |
| beta_partner_submit | 15 |

**Levels:** 0–5 cold · 6–18 warm · 19+ hot

---

## Privacy

- Never add email, name, or company to revenue scoring payloads
- Use event names, slugs, and campaignId only
