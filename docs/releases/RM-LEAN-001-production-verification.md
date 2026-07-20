# RM-LEAN-001 — Production Doğrulama Paketi (post-deploy)

**Tarih (UTC):** 2026-07-20T12:05Z  
**Merge:** [PR #97](https://github.com/barisbagirlar-web/SectorCalc/pull/97) → `ff26e7bf5`  
**Feature commit:** `949e15283`  
**Deploy CI:** [run 29739821816](https://github.com/barisbagirlar-web/SectorCalc/actions/runs/29739821816) — **success**  
**Stamp önerisi (lab-only, 2026-07-20T12:05Z):** `RELEASE BLOCKED` (G-CWV lab LCP >4s on 4/6 pages) — G-LIVE PASS, G-SCHEMA structural PASS.  
**Superseded by:** `docs/releases/RM-LEAN-001-eksik-closure.md` — architect hard gate = **observed LCP ≤4s**; observed re-measure → lab FAIL **DOWNGRADED**. Publication stamp remains pending live GAP-2 confirm in that pack.

---

## 1) G-LIVE — PASS

Cache-bust curls against `https://sectorcalc.com` after deploy.

### 5 canonical hubs → 200 + index,follow + canonical

| Hub | HTTP | x-robots-tag | meta robots | canonical |
|---|---|---|---|---|
| `/calculators/takt-time` | 200 | index, follow | index, follow | `https://sectorcalc.com/calculators/takt-time` |
| `/calculators/oee` | 200 | index, follow | index, follow | `https://sectorcalc.com/calculators/oee` |
| `/calculators/scrap-rate` | 200 | index, follow | index, follow | `https://sectorcalc.com/calculators/scrap-rate` |
| `/calculators/cycle-time` | 200 | index, follow | index, follow | `https://sectorcalc.com/calculators/cycle-time` |
| `/calculators/capacity-utilization` | 200 | index, follow | index, follow | `https://sectorcalc.com/calculators/capacity-utilization` |

### 20 legacy spokes → 301 (Location correct hub)

**20/20 = 301.** Samples:

- `/lean/muda/oee` → `301` Location `/calculators/oee`
- `/lean/a3/takt-time` → `301` Location `/calculators/takt-time`

Full matrix: all `pdca|gemba|a3|muda` × five metrics → matching `/calculators/{metric}` (raw dump: `/tmp/rm-lean-verify/glive.txt`).

### `/lean` richness — PASS

| Signal | Count / present |
|---|---|
| PDCA / Gemba / A3 / Muda string counts | 14 / 16 / 25 / 10 |
| Section ids `pdca,gemba,a3,muda,canonical-metrics` | all present |
| Internal links to 5 hubs | each `/calculators/{metric}` ×6 |
| HTML bytes | ~180 KB |

### Sitemap — PASS

`/sitemaps/tools.xml` (lastmod `2026-07-20T12:03:10Z`):

| Check | Result |
|---|---|
| 5 hubs present | YES (`takt-time,oee,scrap-rate,cycle-time,capacity-utilization`) |
| `/lean` present | YES |
| Spoke `lean/muda/oee` (etc.) | **0** |

---

## 2) G-CWV — FAIL (lab-only; pre-remeasurement)

> **Historical lab verdict only.** Authoritative G-CWV decision is in `RM-LEAN-001-eksik-closure.md` (observed LCP ≤1.98s → LAB_INFLATION downgrade). Do not use this section alone for publication stamp.

Lighthouse 13.4.0 · mobile · simulated throttling · cache-bust.

| Page | Perf | LCP | CLS | TBT | FCP | Hard LCP≤4s | Hard CLS&lt;0.25 |
|---|---:|---:|---:|---:|---:|:---:|:---:|
| `/calculators/takt-time` | 86 | **4.13 s** | 0.000 | 8 ms | 1.57 s | ❌ | ✅ |
| `/calculators/oee` | 86 | **4.13 s** | 0.000 | 8 ms | 1.56 s | ❌ | ✅ |
| `/calculators/scrap-rate` | 83 | **4.41 s** | 0.000 | 3 ms | 1.56 s | ❌ | ✅ |
| `/calculators/cycle-time` | 93 | 3.18 s | 0.000 | 8 ms | 1.53 s | ✅ | ✅ |
| `/calculators/capacity-utilization` | 88 | 3.76 s | 0.000 | 13 ms | 1.51 s | ✅ | ✅ |
| `/lean` | 80 | **5.05 s** | 0.013 | 60 ms | 1.52 s | ❌ | ✅ |

**Mandate hard rule:** any hub LCP >4s or CLS >0.25 → G-CWV FAIL.

- CLS: **all pass** (0.000–0.013), well under 0.1.
- LCP: **4/6 fail hard gate** (takt-time, oee, scrap-rate, lean).
- Soft target LCP &lt;2.5s: **0/6** (same class of lab LCP pressure as free-tool FAZ 2.1b work).

**Verdict:** G-CWV = **FAIL** → full yayın-kabul **BLOCKED** until LCP remediation (or observed/throttled re-measure proves lab noise, per GÖREV 0 method).

Raw JSON: `/tmp/rm-lean-verify/lh/*.json`

---

## 3) G-SCHEMA — PASS (structural) / RRT UI pending human

Automated extraction of live `application/ld+json` on 5 hubs:

| Hub | Required types present | Parse errors |
|---|---|---|
| takt-time | SoftwareApplication, HowTo, FAQPage, DefinedTerm, BreadcrumbList | 0 |
| oee | same | 0 |
| scrap-rate | same | 0 |
| cycle-time | same | 0 |
| capacity-utilization | same | 0 |

**Note:** Google Rich Results Test **UI/API was not executed** in this agent environment. Structural schema validation is green with 0 JSON errors. Human E-action: paste each hub URL into [Rich Results Test](https://search.google.com/test/rich-results) for official stamp.

---

## 4) G-CI — PASS

| Run | ID | Result | Notes |
|---|---|---|---|
| SEO Quality Gates (PR #97) | [29739449776](https://github.com/barisbagirlar-web/SectorCalc/actions/runs/29739449776) | **success** | includes `seo:gates` → `verify:lean-ux` + `verify:lean-redirects` |
| Canonical quality gate | job under [29739449793](https://github.com/barisbagirlar-web/SectorCalc/actions/runs/29739449793) | **pass** | required merge check |
| Firebase Deploy (main) | [29739821816](https://github.com/barisbagirlar-web/SectorCalc/actions/runs/29739821816) | **success** | includes `Verify live calculator route` PASS |
| Break-Even Browser E2E | 29739449772 | **fail** | unrelated flake; not a lean gate; merge used admin after Canonical PASS |

---

## 5) GÖREV 0 durumu (FAZ 2.1b) — DONE before /lean

**Dürüst cevap:** GÖREV 0 **yapıldı ve kapatıldı** (önceki oturum); `/lean` mandate başlamadan önce. Bu RM-LEAN paketinde yeniden ölçülmedi çünkü farklı katman.

| Şüphe | Hüküm | Kanıt / aksiyon |
|---|---|---|
| von-mises CLS 0.148→0.201 | **GERÇEK regresyon** | Observed CLS ~0.19–0.20; kök: FREE_COMPACT `content-visibility` + bare Barlow. **Fix merged** [PR #96](https://github.com/barisbagirlar-web/SectorCalc/pull/96) (`5201a06eb` → main `23ba5652b`) |
| fmea LCP 2.2→8.7s | **LAB VARYANS** | Observed LCP ~1.6–2.3s; LCP elementi H1 |
| home LCP 2.4→6.4s | **LAB VARYANS** | Observed LCP ~1.1–1.3s |

**Açık kalan (FAZ 2.1b):** free-tool **lab LCP &lt;2.5s** hedefi hâlâ açık (field p75). GÖREV 0 regresyon netleştirme kapandı; LCP optimization devam etmeli. `/lean` G-CWV LCP fail aynı lab-sim sınıfına düşüyor olabilir — observed re-measure önerilir.

---

## 6) Final stamp (historical — superseded)

| Gate | Result (this pack, lab-era) |
|---|---|
| G-LIVE | **PASS** |
| G-SCHEMA (structural) | **PASS** (official RRT UI = human) |
| G-CI | **PASS** |
| G-CWV | **FAIL** lab-only (LCP >4s on takt-time, oee, scrap-rate, /lean) — **superseded** by observed pack |
| GÖREV 0 | **DONE** (pre-/lean; von-mises fixed; fmea/home = noise) |

### `RM-LEAN-001 TAM YAYIN-KABUL` → see closure pack

**This file's lab-era block is superseded.** Authoritative status: `docs/releases/RM-LEAN-001-eksik-closure.md` (G-CWV observed PASS / lab downgraded; publication stamp after live GAP-2).
