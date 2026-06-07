# Growth Backlog Scoring Model

Quantitative scoring for [Post-launch Growth Backlog](./post-launch-growth-backlog.md) items.

**Code mirror:** `src/lib/growth/growth-backlog-score.ts` (testable pure functions)

---

## Score criteria

| Criterion | Range | Notes |
|---|---:|---|
| Revenue impact | 0–5 | Direct path to checkout, payment, or paid report |
| Traffic impact | 0–5 | Organic impressions, campaign landing views |
| Conversion impact | 0–5 | Calculate rate, premium click, pricing CTA |
| User pain evidence | 0–5 | Feedback, support, beta partner quote |
| SEO evidence | 0–5 | GSC query, indexing status, crawl issue |
| Implementation effort | −1 to −5 | S=−1, M=−3, L=−5 |
| Technical risk | −1 to −5 | Low=−1, Medium=−3, High=−5 |
| Maintenance cost | −1 to −5 | Ongoing ops burden |

---

## Total score

```
total = (revenue + traffic + conversion + evidence + seo)
      + effort + risk + maintenance
```

Positive criteria add; negative criteria subtract (effort/risk/maintenance are stored as negative numbers).

---

## Decision bands

| Total score | Default status | Sprint eligible? |
|---:|---|---|
| **15+** | `candidate` | Yes — if [sprint rules](./sprint-selection-rules.md) pass |
| **10–14** | `needs_data` or review | Review at weekly gate |
| **5–9** | backlog | No — stay in backlog |
| **< 5** | `parked` | No |

---

## Overrides (ignore score band)

| Condition | Result |
|---|---|
| Revenue / payment / security blocker | **P0** — sprint immediately |
| SEO indexing blocker on Tier-1 URL | **P0** (non-revenue) — sprint immediately |
| Status = `needs_data` | **Never sprint** until evidence attached |
| Category = New product surface during freeze | **Parked** unless explicit freeze lift |

---

## Scoring examples

### Example A — Webhook verification (blocker)

| Criterion | Score |
|---|---:|
| Revenue | 5 |
| Traffic | 0 |
| Conversion | 3 |
| Evidence | 5 |
| SEO | 0 |
| Effort | −2 |
| Risk | −2 |
| Maintenance | −1 |
| **Total** | **8** |

Score alone → backlog, but **blocker override → P0 candidate**.

### Example B — Premium CTA copy (measured)

| Criterion | Score |
|---|---:|
| Revenue | 3 |
| Traffic | 1 |
| Conversion | 4 |
| Evidence | 4 |
| SEO | 0 |
| Effort | −1 |
| Risk | −1 |
| Maintenance | −1 |
| **Total** | **9** |

→ backlog until KPI shows `needs_premium_value`; then re-score with event counts.

### Example C — 50 new free tools

| Criterion | Score |
|---|---:|
| Revenue | 1 |
| Traffic | 3 |
| Conversion | 1 |
| Evidence | 0 |
| SEO | 2 |
| Effort | −5 |
| Risk | −3 |
| Maintenance | −5 |
| **Total** | **−6** |

→ **parked** (freeze violation + low score).

---

## Weekly review checklist

1. Pull [Live KPI Review](/admin/kpi) verdict
2. Re-score items with new event counts
3. Promote `needs_data` → `candidate` only when evidence fields are filled
4. Max **1–2** non-blocker items per sprint during freeze
