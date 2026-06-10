# SectorCalc Manifesto-Aligned Product Roadmap

> **Document type:** Product direction and phase plan — not a live deploy log.  
> For current HEAD, smoke results, and production baseline, see [production-reality.md](./production-reality.md).  
> For vision and positioning, see [manifesto.md](./manifesto.md) and [product-strategy.md](./product-strategy.md).

---

## Güncel durum (2026-06-10)

| Phase | Durum | Not |
|-------|--------|-----|
| **P0** Final Hard Stabilization | **DONE** | Premium route collision, revert baseline, smoke lock |
| **P1** Grouped Catalog Search | **DONE** | 6 locale catalog + homepage search |
| **P2.0** Smart Form Pilot (3 tool) | **DONE** | CNC, welding, HVAC dynamic form |
| **P2.1** Public Preview + Auth Gate Fix | **DONE** | Hard gate kaldırıldı; Pro-only aksiyonlar kilitli |
| **P2.2** Smart Form Layout Stabilization | **DONE** | Desktop 2-col, mobile 375px, decision output panel |
| **P2.3** Smart Form Full Premium Rollout | **DONE** | 27/27 premium analyzer Smart Form + runtime compatibility |
| **P2.4** Full Calculation Form Repair Sweep | **ACTIVE / OPEN** | Free, legacy, locale/mobile form sweep — closure pending |
| **P3** Feedback / Formula Objection System | **BLOCKED UNTIL P2.4 DONE** | Do not start before P2.4 closure evidence |
| **P4** Trust Trace / Validation Stamp / Public Verify | **WAITING** | Blocked behind P3 |

**Current active phase:** **P2.4 — Full Calculation Form Repair Sweep**

### Phase gate (EN)

P2.3 closed only the premium Smart Form rollout scope. It does not certify that every calculation-related form in the product is visually repaired, mobile-safe, locale-safe, and layout-stable. Therefore P2.4 — Full Calculation Form Repair Sweep is now the active phase and P3 must not start before P2.4 closure evidence is produced.

### Faz kapısı (TR)

P2.3 yalnızca premium Smart Form kapsamını kapatır. Bu kapanış, sitedeki tüm hesaplama formlarının düzeldiği anlamına gelmez. Free tool formları, legacy calculator formları, eski hesaplama componentleri ve locale/mobile kaynaklı form kırıkları P2.4 kapsamında ayrıca taranıp kapatılacaktır. P2.4 kapanmadan P3 başlatılmayacaktır.

---

## Phase overview

```
P0 Stabilization ──► P1 Catalog ──► P2 Smart Form (pilot → layout → 27/27 → P2.4 all forms)
                                              │
    P3 Feedback ◄── P4 Trust Trace ◄── P5 Units ◄── P6 Benchmark
         │                  │              │            │
    P7 Case Study ◄── P8 PWA ◄── P9 Packaging ◄── P10 AI Assistant
                                              │
                                    P11 Autonomous Release Gate
```

**Active now:** P2.4 (all calculation forms). **Blocked:** P3 until P2.4 closes.

---

## P2 — Smart Form Full Premium Rollout *(DONE)*

**Goal:** 27/27 premium analyzer Smart Form kapsamında; formula logic değişmeden.

### Deliverables

- [x] Merkezi registry: `premium-smart-form-definitions.ts`  
- [x] Runtime compatibility layer: `runtime-compatibility.ts`  
- [x] 27 tool × 2 scenario, simple/advanced, contract-aligned input keys  
- [x] 6 locale `smartForm.*` message coverage  
- [x] `npm run smoke:premium-smart-forms` gate  
- [x] Production deploy + post-deploy smoke PASS (verify via `production-reality.md`)  

### Exit criteria

- [x] 27/27 premium route public preview + Smart Form marker  
- [x] Sign-in required **hard gate yok**  
- [x] Runtime compatibility audit PASS  
- [x] Build + formula + dual-intelligence + locale + browser smoke PASS  

---

## P2.4 — Full Calculation Form Repair Sweep *(ACTIVE / OPEN)*

**Goal:** Premium Smart Form dışındaki tüm hesaplama form yüzeylerini envantere almak, sınıflandırmak, layout/mobile/locale kırıklarını düzeltmek; formula logic değiştirmeden.

### Scope status

| Scope                       | Status | Closure Evidence                     |
| --------------------------- | ------ | ------------------------------------ |
| Premium Smart Forms         | DONE   | 27/27 premium smart forms smoke PASS |
| Free Tool Forms             | OPEN   | Inventory + repair + smoke pending   |
| Legacy Calculator Forms     | OPEN   | Inventory + repair + smoke pending   |
| Calculation Result Panels   | OPEN   | Layout QA pending                    |
| Mobile 375px Forms          | OPEN   | QA pending                           |
| Locale Long Labels          | OPEN   | TR/AR/DE/FR/ES QA pending            |
| RTL Arabic Forms            | OPEN   | QA pending                           |
| All Calculation Forms Smoke | OPEN   | smoke:all-calculation-forms pending  |

### P2.4 can be closed only if

1. All calculation-related form surfaces are inventoried.
2. Form surfaces are classified as:
   - `premium_smart_form`
   - `free_tool_form`
   - `legacy_calculator_form`
   - `report/calculation-related form`
   - `account/pricing/contact` non-core form
3. Premium Smart Forms remain 27/27 PASS.
4. Free tool forms are checked and repaired.
5. Legacy calculator forms are checked and repaired.
6. Mobile 375px overflow is checked.
7. Desktop 1440px layout is checked.
8. Arabic RTL is checked.
9. German/French/Spanish long label behavior is checked.
10. No formula logic changes.
11. No runtime calculation changes.
12. No route/slug changes.
13. No `/en` prefix.
14. `smoke:all-calculation-forms` PASS.
15. Browser smoke remains 25/25 PASS.
16. Locale smoke remains 42/42 PASS.
17. `production-reality.md` contains coverage numbers.

### In progress (not closure)

Partial engineering work may exist in repo (e.g. shared `.sc-form-*` CSS, smoke script scaffold). **P2.4 is not DONE** until the closure criteria above are evidenced in `production-reality.md`.

---

## P3 — Feedback / Formula Objection System *(BLOCKED UNTIL P2.4 DONE)*

**Goal:** Kullanıcı geri bildirimi ve formül itirazı admin queue’ya düşer.

> **EN:** P3 Feedback / Formula Objection is blocked until P2.4 completes. Feedback UI must not be added on top of broken forms.
>
> **TR:** P3, P2.4 tamamlanmadan başlatılmayacak. Kırık formların üzerine feedback UI eklenmeyecek.

| Feature | Product phase status |
|---------|----------------------|
| Tool feedback form (8 kinds) | **BLOCKED** — wait for P2.4 |
| Formula objection | **BLOCKED** — wait for P2.4 |
| Admin queue | **BLOCKED** — wait for P2.4 |
| 6 locale i18n | **BLOCKED** — wait for P2.4 |
| Smoke gate (`smoke:feedback-ui`) | **BLOCKED** — wait for P2.4 |

*Note:* Early P3 code may exist in git history from exploratory work. Product phase **P3 must not start** and must not be treated as DONE until P2.4 closure evidence exists.

---

## P4 — Trust Trace / Validation Stamp / Public Verify *(WAITING)*

**Status:** Waiting — blocked behind P3 (which is blocked behind P2.4).

**Goal:** Premium rapor üçüncü tarafça doğrulanabilir.

| Bileşen | Açıklama |
|---------|----------|
| Report ID + hash | Tekil kimlik |
| QR code | Mobil verify |
| Formula version | Contract versiyonu |
| Input / result snapshot | Denetim |
| `/verify` backend lookup | Public doğrulama sayfası |
| Export | PDF / Excel / Word (Pro+) |
| Disclaimer / Usage Agreement | Hukuki çerçeve |

*Related live status:* Verify UI placeholder — full backend P4 scope.*

---

## P5 — Metric / Imperial / Regional Unit Engine

- Locale default unit  
- User override  
- Canonical internal conversion  
- Display unit separation  
- Pilot foundation exists — production-wide rollout P5  

---

## P6 — Regional Benchmark Engine

- TÜİK / TSE / ISO / sektör odası / akademik kaynak yapısı  
- Tool bazlı benchmark  
- Ülke bazlı benchmark  
- Kaynakça zorunlu — kaynaksız “sektör ortalaması” yok  

---

## P7 — Case Study Proof Layer

- Sektör bazlı vaka analizleri  
- Metodoloji + input/result breakdown  
- Trust Trace bağlantısı  
- Tüm locale yayın  

*Current:* Representative drafts exist — 27/27 complete hedefi P7.*

---

## P8 — PWA / Saha Mode

- Offline shell  
- Basic offline calculations  
- Sync  
- Large buttons, high contrast  
- 3-second readable result target  

---

## P9 — Pricing / Business / Enterprise Packaging

| Tier | Monetization |
|------|----------------|
| Pro | Premium tools, PDF, Trust Trace |
| Business | White-label, team, logo |
| Enterprise | API, custom benchmark, audit trail |

Trust Trace ve verification ayrı monetization lever.

---

## P10 — AI Assistant

- **Free:** marketing assistant, tool routing, explanation  
- **Paid:** operational support, input prep, report commentary  
- **Boundary:** AI never calculates, never selects formula, never overrides oracle  

*Current:* Lib boundary only — not live product.*

---

## P11 — Autonomous Release Gate

Her production release öncesi zorunlu gate seti:

```bash
npm run lint
npx tsc --noEmit
npm run check:secrets
npm run assert:route-cache-policy
npm run build
npm run test:formulas
npm run audit:dual-intelligence-runtime-coverage
npm run smoke:premium-routes
npm run smoke:premium-smart-forms
npm run smoke:locale-routes
npm run smoke:browser-routes -- --probe
npm run smoke:browser-routes
```

Post-deploy: Cloud Run minInstances + production smoke tekrarı.  
Future: rollback / canary automation.

---

## Deprecated / superseded notes

Aşağıdaki eski ifadeler **artık geçerli değildir** — bu roadmap ile değiştirilmiştir:

- ~~“Smart Form global wrapper — NOT production-wide”~~ → P2.3 hedefi production-wide 27/27  
- ~~“P0 açık — Smart Form rollout bekliyor”~~ → P2.0–P2.3 DONE, **P2.4 ACTIVE**  
- ~~“P2.3 = all forms complete”~~ → P2.3 closes **premium Smart Form only**; P2.4 sweeps all calculation forms  
- ~~“P3 Feedback DONE”~~ → P3 **BLOCKED** until P2.4 closure evidence  
- ~~“Universal Smart Form Architecture NOT LIVE”~~ → rollout fazında; live durum `production-reality.md` ile doğrulanır  

Operational freeze docs ([product-roadmap-freeze.md](./product-roadmap-freeze.md)) revenue measurement dönemi için geçerlidir; manifesto fazları ile çelişirse **manifesto-aligned roadmap** product direction için üstündür.

---

*Last updated: 2026-06-10*
