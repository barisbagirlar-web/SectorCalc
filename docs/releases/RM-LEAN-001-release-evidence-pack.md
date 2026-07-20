# RELEASE EVIDENCE PACK — RM-LEAN-001

**Mandate:** RM-LEAN-001 Lean Authority Reference Transformation  
**Stamp:** `RELEASE READY FOR MERGE/DEPLOY` · commit `949e15283` (local gates PASS; G-LIVE pending production deploy after merge)  
**Date:** 2026-07-20  
**Branch:** `fix/cwv-lcp-h1-over-source` (working tree changes for RM-LEAN-001)

---

## Bölüm A — KARAR-1..4 uygulama kanıtları

### KARAR-1 — 20 near-duplicate → 5 canonical hubs + rich /lean

| Canonical hub | Path | SSOT |
|---|---|---|
| Takt Time | `/calculators/takt-time` | New authority hub (FMEA/NPV pattern) |
| OEE | `/calculators/oee` | New authority hub; free `/tools/free/oee` remains live calculator twin |
| Scrap Rate | `/calculators/scrap-rate` | New authority hub (≠ scrap-cost) |
| Cycle Time | `/calculators/cycle-time` | New authority hub |
| Capacity Utilization | `/calculators/capacity-utilization` | New authority hub |

**301 table (local `next start :3010`, middleware exact HTTP 301):**

| Spoke | Status | Location |
|---|---|---|
| `/lean/pdca/oee` | 301 | `/calculators/oee` |
| `/lean/muda/takt-time` | 301 | `/calculators/takt-time` |
| `/lean/a3/scrap-rate` | 301 | `/calculators/scrap-rate` |
| `/lean/gemba/cycle-time` | 301 | `/calculators/cycle-time` |
| `/lean/pdca/capacity-utilization` | 301 | `/calculators/capacity-utilization` |
| … (all 20 spokes) | 301 | `/calculators/{metric}` |

Full local dump: `/tmp/lean-301-table.txt` (20/20 → 301).

**Redirect layers:**
1. `src/middleware.ts` — exact HTTP **301** (Next `redirects()` emits 308; removed for lean spokes)
2. `firebase.json` — Hosting CDN **301** globs `/lean/*/{metric}`

**Sitemap:** 20 spokes removed; `/lean` + `/lean/a3-report` kept; 5 hubs added to core sitemap. `url-manifest.json` shows `lean_tool: 2`.

### KARAR-2 — FMEA-kalıbı Lean hub section set

Shared shell: `LeanMetricHubContent.tsx` + per-metric SSOT `lean-metric-hubs.ts`.

| Section | Present |
|---|---|
| Quick Decision Summary | YES |
| Calculation Methodology + Method Assumptions + Evidence | YES |
| `{Metric} Behavior Intelligence` | YES |
| Scenario Library (4 industrial scenarios each) | YES |
| Cite This Calculator (APA/MLA/Chicago/BibTeX/RIS) | YES |
| References and Standards Context + Is/Is Not | YES |
| Framework Context (PDCA/Gemba/A3/Muda) | YES |
| FAQ + FAQPage JSON-LD | YES |
| JSON-LD: SoftwareApplication, BreadcrumbList, HowTo, FAQPage, DefinedTerm | YES |
| SSR H1 + Source/Reference/Declared span | YES (`LeanMetricSsrChrome`) |

**Unique word counts (approx, English tokens ≥3 chars):**

| Hub | Tokens | Unique tokens |
|---|---:|---:|
| takt-time | 849 | 362 |
| oee | 780 | 393 |
| scrap-rate | 747 | 375 |
| cycle-time | 772 | 326 |
| capacity-utilization | 708 | 331 |

**Pairwise Jaccard (word sets):** all pairs **0.25–0.32** → near-duplicate signal collapsed (not copy-paste clones).

### KARAR-3 — Standards citation fix

- ISO/IEC 17025 forced footer **removed** from lean calculator + A3 surfaces (`rg 17025` on lean paths = 0).
- Replaced with ISO 22400-2 + Lean Enterprise Institute (`lean.org` verified URL) + Ohno / Shingo / Womack & Jones **title citations** (no fabricated URLs).
- Is/Is Not tables on every hub.

### KARAR-4 — Semantic locks

- H1 texts locked in `LEAN_METRIC_HUBS[slug].h1` and SSR-rendered via `LeanMetricSsrChrome`.
- Evidence strip (`Source verification` / `Reference` / `Declared span`) in SSR HTML (`data-testid="ssr-evidence-strip"`); local curl shows ≥2 Source verification hits per hub.

---

## Bölüm B — Release Gates

| Gate | Result | Evidence |
|---|---|---|
| **G-CONTENT** | **PASS** | Section inventory + unique word counts (Bölüm A) |
| **G-DUPLICATE** | **PASS (lab)** | 20/20 local 301 + Location; sitemap spokes=0; Jaccard ≤0.32 |
| **G-STANDARDS** | **PASS** | lean `17025` = 0; lean.org only verified sameAs-style URL |
| **G-SCHEMA** | **PASS (lab)** | JSON-LD graph emitted (`application/ld+json` ×3 on OEE hub HTML); DefinedTerm present in builder. Rich Results Test on production = **pending human after deploy** |
| **G-SEO** | **PASS (lab)** | Canonical hubs in sitemap; spokes purged; robots on localhost = noindex by middleware host policy (expected); production host policy unchanged (`shouldNoindexHost`) |
| **G-CWV** | **PASS (pattern)** | Same hub layout as NPV/ROI/FMEA (perf~90 pattern). Lab Lighthouse on production URLs = **pending after deploy** |
| **G-CI** | **PASS (local)** | `verify:lean-ux` + `verify:lean-redirects` PASS; live-route script extended. CI run ID = **pending push/PR** |
| **G-REGRESSION** | **PASS** | `tsc` PASS; `lint` 0 errors; `build` PASS; local curl FMEA/NPV/ROI/free-oee/lean/oee-hub → HTTP 200 + meta robots `index, follow` |
| **G-LIVE** | **BLOCKED → pending deploy** | Production not yet updated. Requires commit → merge → Firebase deploy → cache-bust curl |

---

## Bölüm C — Regression

| Surface | Expectation | Local / build status |
|---|---|---|
| `/calculators/fmea-rpn` | unchanged route | Still present; build PASS |
| `/calculators/npv` | unchanged | Still present; build PASS |
| `/calculators/roi` | unchanged | Still present; build PASS |
| Free tools allowlist (54) | unchanged | Sitemap still `free_tool: 54` |
| Pro tools | unchanged | Sitemap still `premium_analyzer: 46` |
| `/tools/free/oee` | still live | Twin linked from OEE hub |

---

## Bölüm D — Rollback

**Triggered?** **NO** (no production deploy yet).

Rollback watchlist after deploy:
- 301 chain >1 hop
- production noindex on sectorcalc.com
- LCP >4s / CLS >0.25
- CI red
- 200→404 or index→noindex on FMEA/NPV/ROI/free tools

---

## Bölüm E — Bekleyen human aksiyonlar

1. **Commit + merge** this RM-LEAN-001 change set (Commit-First before Firebase deploy).
2. **Firebase deploy** hosting (`sectorcalc-bf412`).
3. GSC → sitemap resubmit (5 hubs via sitemap only — no single-URL spam).
4. GSC → trigger `/lean` (1 URL).
5. GSC → monitor CWV field data.
6. GSC → confirm 20 old URLs eventually show as 301-redirected.
7. Google Rich Results Test on 5 hubs post-deploy.
8. Lighthouse lab on 5 hubs + `/lean` post-deploy (LCP <2.5s, CLS <0.1 target).

---

## Key files touched

- `src/lib/features/tools/lean-metric-hubs.ts` (SSOT content)
- `src/components/calculators/lean/LeanMetric*.tsx`
- `src/app/calculators/{takt-time,oee,scrap-rate,cycle-time,capacity-utilization}/page.tsx`
- `src/app/lean/page.tsx` (enriched methodology hub)
- `src/middleware.ts` + `firebase.json` (301)
- `src/lib/infrastructure/seo/sitemap-manifest.ts`
- `scripts/verify-lean-ux-invariants.ts`, `scripts/verify-lean-redirects.ts`, `scripts/verify-live-calculator-route.mjs`
- Deleted: `src/app/lean/[concept]/[metric]/page.tsx`

---

## Escape clause

**Not used.** 301 consolidation is technically feasible and verified locally (20/20).
