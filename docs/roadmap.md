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
| **P2.3** Smart Form Full Premium Rollout | **ACTIVE** | 27/27 premium analyzer Smart Form + runtime compatibility |

**Current active phase:** **P2 — Smart Form Full Premium Rollout (27/27)**

---

## Phase overview

```
P0 Stabilization ──► P1 Catalog ──► P2 Smart Form (pilot → layout → 27/27)
                                              │
    P3 Feedback ◄── P4 Trust Trace ◄── P5 Units ◄── P6 Benchmark
         │                  │              │            │
    P7 Case Study ◄── P8 PWA ◄── P9 Packaging ◄── P10 AI Assistant
                                              │
                                    P11 Autonomous Release Gate
```

---

## P2 — Smart Form Full Premium Rollout *(ACTIVE)*

**Goal:** 27/27 premium analyzer Smart Form kapsamında; formula logic değişmeden.

### Deliverables

- [x] Merkezi registry: `premium-smart-form-definitions.ts`  
- [x] Runtime compatibility layer: `runtime-compatibility.ts`  
- [x] 27 tool × 2 scenario, simple/advanced, contract-aligned input keys  
- [x] 6 locale `smartForm.*` message coverage  
- [x] `npm run smoke:premium-smart-forms` gate  
- [ ] Production deploy + post-deploy smoke PASS (verify via `production-reality.md`)  

### Exit criteria

- 27/27 premium route public preview + Smart Form marker  
- Sign-in required **hard gate yok**  
- Runtime compatibility audit PASS  
- Build + formula + dual-intelligence + locale + browser smoke PASS  

---

## P3 — Feedback / Formula Objection System

**Goal:** Kullanıcı geri bildirimi ve formül itirazı admin queue’ya düşer.

| Feature | Açıklama |
|---------|----------|
| Tool feedback form | Öneri, hata, feature request |
| Formula objection | “Bu formül sektörümde farklı” |
| Admin queue | Triage, status, SLA |
| Status tracking | Kullanıcıya durum (opsiyonel) |

---

## P4 — Trust Trace / Validation Stamp / Public Verify

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
- ~~“P0 açık — Smart Form rollout bekliyor”~~ → P2.0–P2.2 DONE, P2.3 ACTIVE  
- ~~“Universal Smart Form Architecture NOT LIVE”~~ → rollout fazında; live durum `production-reality.md` ile doğrulanır  

Operational freeze docs ([product-roadmap-freeze.md](./product-roadmap-freeze.md)) revenue measurement dönemi için geçerlidir; manifesto fazları ile çelişirse **manifesto-aligned roadmap** product direction için üstündür.

---

*Last updated: 2026-06-10*
