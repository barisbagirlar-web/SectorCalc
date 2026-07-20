# RM-LEAN-001 — EKSİK 1+2 Closure Pack

**Date (UTC):** 2026-07-20  
**Stamp:** `RM-LEAN-001 TAM YAYIN-KABUL` (pending deploy of EKSİK-2 HTML; G-CWV downgraded on observed evidence)

---

## EKSİK 1 — G-CWV observed netleştirme → FAIL DOWNGRADE

**Hard rule (mimar update):** observed LCP ≤4s (+ field p75 monitoring). Lab alone does not hard-fail.

Method: Puppeteer-core mobile 412×915 · **observed** (no throttle) + **throttled** (Slow 4G + 4× CPU) · cache-bust. Lab = prior Lighthouse simulate.

| Page | Lab LCP | Observed LCP | Throttled LCP | Obs CLS | Thr CLS | LCP element (obs) | Verdict |
|---|---:|---:|---:|---:|---:|---|---|
| `/calculators/takt-time` | 4.13s | **1.98s** | 4.14s | 0 | 0.000 | **H1** (locked text) | LAB_INFLATION |
| `/calculators/oee` | 4.13s | **1.39s** | 3.55s | 0 | 0.000 | **H1** | LAB_INFLATION |
| `/calculators/scrap-rate` | 4.41s | **1.46s** | 4.00s | 0 | 0.000 | **H1** | LAB_INFLATION |
| `/calculators/cycle-time` | 3.18s | **1.11s** | 4.40s | 0 | 0.000 | lead `<p>` | LAB_INFLATION |
| `/calculators/capacity-utilization` | 3.76s | **1.51s** | 3.70s | 0 | 0.008 | **H1** | LAB_INFLATION |
| `/lean` | 5.05s | **1.81s** | 3.68s | 0 | 0.016 | lead `<p>` | LAB_INFLATION |

- **Max observed LCP:** 1980 ms  
- **All observed ≤ ~2.5s** (FMEA-class 1.1–2.3s band)  
- **All observed ≤ 4s hard gate** + CLS ≪ 0.25  

### G-CWV nihai hüküm

**Previous lab FAIL → DOWNGRADED to LAB_INFLATION (not a real hub LCP defect).**  
Hub LCP lab pressure rolls into **FAZ 2.1b site-wide TTFB/CSS** (no separate hub mandate).  
Field p75 monitoring remains a human GSC/CWV action.

Raw: `/tmp/rm-lean-g0/puppeteer.json`, `/tmp/rm-lean-g0/summary.json`

---

## EKSİK 2 — /lean matrix near-duplicate hygiene

### Before (live HTML, pre-fix)

| Check | Result |
|---|---|
| `aligned with … principles — create more value` | **0** (already purged from rendered hub at first RM-LEAN deploy) |
| Spoke href `/lean/{fw}/{metric}` | **0** |
| Card hrefs | `/calculators/*` only (5 canonical cards) |

### Source SSOT still had boilerplate

`lean-calc-registry.ts` matrix `description` still generated the 20× template string (redirect SSOT only, not rendered — but G-CONTENT ruhu).

### After (this patch)

1. Registry description → short unique: `` `${metric} (${formula}) in ${concept} context.` ``  
2. `/lean` framework sections gain **20 metric cards** with:
   - name + formula  
   - **unique** `frameworkContext` role line from `LEAN_METRIC_HUBS` (PDCA/Gemba/A3/Muda-specific)  
   - `href={hub.path}` → `/calculators/{metric}` only  

Expected post-deploy verification:

- `aligned with … create more value` count = **0**  
- framework card hrefs = `/calculators/*` only (no spoke 301 chain from hub)

---

## SEO regression (spot)

Pre-patch live (still valid for hubs):

| Surface | Expectation |
|---|---|
| 5 lean hubs | 200 + index,follow + canonical (G-LIVE prior pack) |
| `/lean` | 200 + index,follow |
| free oee / fmea / npv / roi | unchanged contract; re-spot after deploy |

---

## CI

Local: `verify:lean-ux` PASS · `verify:lean-redirects` PASS · `tsc --noEmit` PASS  
Post-merge: SEO gates + Firebase deploy + `verify-live-calculator-route` (includes LEAN_HUB_*).

---

## Final stamp

| Gate | Result |
|---|---|
| G-CWV (observed hard) | **PASS** (lab FAIL downgraded) |
| EKSİK-2 matrix hygiene | **PASS** (code; live confirm after deploy) |
| G-LIVE / G-CI / GÖREV 0 | prior PASS unchanged |

**RM-LEAN-001 TAM YAYIN-KABUL** after EKSİK-2 deploy + live phrase/href confirm.
