# RM-FINAL-001 — Release Evidence Pack

**Stamp:** TAM YAYIN-KABUL  
**Date:** 2026-07-20  
**Merge:** [#102](https://github.com/barisbagirlar-web/SectorCalc/pull/102) → `a698c8da393d`  
**Deploy:** Firebase Hosting + SSR (`sectorcalc-bf412`) — hosting release complete; live probes green.

## Gate matrix

| Gate | Result | Evidence |
|---|---|---|
| G-CWV-OBSERVED | PASS | Prior observed Lighthouse (provided throttling): LCP 1042–2235 ms, CLS 0. Unchanged surface for this release. |
| G-LEAN-MATRIX | PASS | Live `/lean`: `aligned with`=0, `create more value with fewer resources`=0; hub hrefs → `/calculators/*`; no spoke matrix cards. |
| G-BREAK-EVEN-SSR | PASS | `/tools/free/break-even` → **HTTP 404** plain `Not Found` (hard). Canonical `/tools/free/break-even-and-margin-of-safety-analysis` → 200 + `index, follow`. |
| G-SEO-REGRESSION | PASS | `/tools/free/von-mises-stress-calculator` SSR contains `Source:` and `Declared span:`. |
| G-CI | PASS | browser-e2e: 3× `workflow_dispatch` green on `fb9bf16a4` (runs 29765069101, 29765073052, 29765076998); PR tip `a2c382a` dual green; main merge SHA e2e triggered. |
| G-LIVE | PASS | Hard 404: `break-even`, `von_mises_stress_calculator`, `roi-calculator`, `this-does-not-exist`. Industries: unknown → 404; `cnc-manufacturing` → 200 + index,follow. |

## Root cause → fix

Firebase SSR soft-404 (200+noindex) for non-allowlisted `/tools/free/*`.  
Middleware now allowlists `ACTIVE_FREE_TOOL_SLUGS` and returns hard 404 (same pattern as `/industries/{slug}`).

## ADIM checklist

1. Middleware free-tool hard-404 — merged + deployed + 4 slug 404 verified  
2. `/industries/{slug}` — already hard-404 (PR #82); re-verified live  
3. browser-e2e — product drift + owner bypass 402 fixed; 3× green  
4. `/lean` matrix hygiene — already on main via #100; live re-verified  
5. Six-gate re-audit — all PASS → TAM YAYIN-KABUL  

## Human follow-ups (non-blocking)

- GSC sitemap resubmit / RRT hub crawl  
- Field RUM monitoring for CWV p75  
