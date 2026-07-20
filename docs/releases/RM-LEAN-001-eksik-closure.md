# RM-LEAN-001 — GAP 1+2 Closure Pack (FINAL)

**Date (UTC):** 2026-07-20  
**Merge:** [PR #100](https://github.com/barisbagirlar-web/SectorCalc/pull/100) → `6ac39664c`  
**Deploy:** [Firebase Deploy 29763612984](https://github.com/barisbagirlar-web/SectorCalc/actions/runs/29763612984) — **success** (supersedes cancelled lean-only run 29762897811; concurrency coalesced)  
**Authority:** Supersedes lab-only G-CWV block in `RM-LEAN-001-production-verification.md`.

### Stamp

# `RM-LEAN-001 TAM YAYIN-KABUL`

---

## EKSİK 1 — G-CWV observed → FAIL DOWNGRADE

**Hard rule:** observed LCP ≤4s (+ field p75 monitoring). Lab alone does not hard-fail.

| Page | Lab LCP | Observed LCP | Throttled LCP | Obs CLS | LCP element (obs) | Verdict |
|---|---:|---:|---:|---:|---:|---|
| `/calculators/takt-time` | 4.13s | **1.98s** | 4.14s | 0 | **H1** | LAB_INFLATION |
| `/calculators/oee` | 4.13s | **1.39s** | 3.55s | 0 | **H1** | LAB_INFLATION |
| `/calculators/scrap-rate` | 4.41s | **1.46s** | 4.00s | 0 | **H1** | LAB_INFLATION |
| `/calculators/cycle-time` | 3.18s | **1.11s** | 4.40s | 0 | lead `<p>` | LAB_INFLATION |
| `/calculators/capacity-utilization` | 3.76s | **1.51s** | 3.70s | 0 | **H1** | LAB_INFLATION |
| `/lean` | 5.05s | **1.81s** | 3.68s | 0 | lead `<p>` | LAB_INFLATION |

- Max observed LCP **1980 ms** ≤ ~2.5s FMEA band and ≤4s hard gate.  
- **G-CWV nihai hüküm:** lab FAIL → **DOWNGRADE (LAB_INFLATION)**. Hub LCP rolls into FAZ 2.1b site-wide TTFB/CSS (no separate hub mandate).

---

## EKSİK 2 — /lean matrix hygiene (live)

| Check | Before (pre GAP-2 deploy) | After (live post-deploy) |
|---|---|---|
| `aligned with … principles — create more value` | **0** (already absent in rendered HTML) | **0** |
| Framework metric cards (`lean-card-*`) | 0 (5 top canonical only) | **20** |
| Card hrefs | `/calculators/*` | **20/20** `/calculators/{takt-time,oee,scrap-rate,cycle-time,capacity-utilization}` |
| Spoke hrefs `/lean/{fw}/{metric}` from cards | **0** | **0** |

Framework intro copy (PDCA/Gemba/A3/Muda) retained. Registry boilerplate descriptions purged.

---

## SEO regression (live spot, cache-bust)

| Surface | HTTP | robots | canonical | form | JSON-LD |
|---|---|---|---|---|---|
| 5 lean hubs | 200 | index, follow | self | yes | yes |
| `/lean` | 200 | index, follow | self | yes | yes |
| `/calculators/fmea-rpn` `/npv` `/roi` | 200 | index, follow | self | yes | yes |
| free tools sample | 200 | noindex (site-wide free-tool policy; not lean-specific) | self | yes | yes |

H1 locked; SSR Source/Reference/Declared evidence strip preserved on hubs.

---

## CI

| Gate | Result |
|---|---|
| `verify:lean-ux` | PASS |
| `verify:lean-redirects` | PASS |
| SEO Quality Gates (PR #100) | PASS |
| industrial-pipeline + Canonical | PASS |
| Firebase Deploy + `verify-live-calculator-route` | PASS (29763612984) |
| Break-Even Browser E2E / Vercel | non-blocking (prior RM-LEAN practice; Vercel account blocked) |

---

## Final gate matrix

| Gate | Result |
|---|---|
| G-LIVE | PASS (prior + reconfirmed) |
| G-CWV (observed hard) | **PASS** (lab FAIL downgraded) |
| EKSİK-2 matrix | **PASS** (live) |
| G-CI | PASS |
| GÖREV 0 | closed (prior) |

**RM-LEAN-001 TAM YAYIN-KABUL**
