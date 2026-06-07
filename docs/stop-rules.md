# Stop Rules

When to **stop** development, campaigns, SEO expansion, and paid ads.

**Related:** [Stop / Measure / Decide](./stop-measure-decide.md) · [Final Decision Tree](./final-decision-tree.md)

---

## Stop development if

- No data supports the change
- Change adds product surface (calculator, schema, page, dashboard)
- Change needs broad refactor without production blocker proof
- Change is only visual preference (no metric reference)
- Change duplicates an existing feature
- Change delays revenue learning
- Idea is in [backlog only](./cursor-scope-control.md) classification

**Action:** Add to [Post-launch Backlog Items](./post-launch-backlog-items.md) with `needs_data` status.

---

## Stop campaign (organic or paid) if

- Checkout broken
- Premium export leaks without entitlement
- Mobile unusable (390px horizontal scroll, broken forms)
- Tracking broken (primary CTA events not firing)
- Wrong-audience traffic (zero calculate after meaningful visits)
- No calculator usage after meaningful clicks (30–50+ landing sessions)

**Action:** Pause distribution; fix blocker or change cluster/angle.

---

## Stop SEO expansion if

- Tier-1 pages not indexed
- Sitemap has errors
- Canonical / hreflang broken on indexable URLs
- Existing guides are thin (fix before adding)
- Internal links weak (fix linking before new URLs)

**Action:** SEO hotfix sprint only — inspection, internal links, meta refresh on **existing** URLs.

**Not allowed during stop:** New SEO landing pages, new guides (freeze).

---

## Stop paid ads if

- Free tool usage not proven (calculate rate unknown or zero)
- Premium CTA not proven (no unlock/pricing intent in organic)
- Checkout not proven ([Final Monetization Verdict](./final-monetization-verdict.md) not READY)
- No event tracking (even no-op must not crash flows)

**Action:** Return to organic + [Paid Ads Readiness Gate](./paid-ads-readiness-gate.md).

---

## Hotfix exceptions (do not stop — fix immediately)

| Blocker | Allowed work |
|---|---|
| Payment / export leak | Entitlement + gate hotfix only |
| SEO indexing on Tier-1 | Canonical, noindex, sitemap hotfix |
| Mobile layout break | CSS/layout hotfix on affected URL |
| Build / test failure on main | Minimal fix to restore green CI |

All hotfixes: small diff, tested, one PR.

---

## Resume checklist

Before resuming stopped work:

- [ ] Blocker fixed and verified on production
- [ ] Signal re-measured (24–48h after fix)
- [ ] Decision tree case re-evaluated
- [ ] One sprint selected from [Next Sprint Selector](./next-sprint-selector.md)
