# Sprint S1–S6 — Master Tool Activation Control + Premium Readiness Command Matrix

Generated phase: **S1/6** (manifest + plan only — no route/formula patches in this prompt)

## Sprint hedefi

SectorCalc’ın 479 tool evrenini tek merkezi aktivasyon manifesti altında sınıflandırmak; 6 promptluk sprint için güvenli batch listeleri üretmek; payment/formula gate kilidini koruyarak düşük riskli adayları otomatik uygulanabilir hale getirmek.

Bu faz **doğrudan büyük route/formül patch basmaz**. Sonraki promptlar (S2–S6) manifest batch’lerini uygular.

## Mevcut gerçek tablo (P5B + P25 kontrol düzlemi)

| Metrik | Değer |
|--------|------:|
| Toplam tool | 479 |
| Aktif route | 328 |
| Category-only / quarantine | 151 |
| PASS / WARN / FAIL / QUARANTINE | 33 / 219 / 76 / 151 |
| premium_ready | 22 |
| near_premium | 5 |
| premium_schema_fail_manual | 12 |
| free_active_missing_backing | 136 |
| category_only_quarantine | 151 |
| guide_oracle_missing | 473 |
| payment_locked_safe | 457 |
| deepseek_auto_repair_candidate | 190 |
| paymentEligible | 22 (değişmeyecek) |
| formulaGateEligible | 22 (değişmeyecek) |
| free paymentEligible | 0 |

Kaynak: `scripts/.cache/sprint-tool-activation-manifest.json` (S1 üretimi), alt raporlar P24/P25/P5B/runtime-trust/quarantine/input-guide/formula-KG.

## 6 promptluk plan

| Prompt | Kod adı | Amaç | Risk |
|--------|---------|------|------|
| **S1** | `build-sprint-activation-manifest` | Merkezi manifest + batch plan | Yok (read-only) |
| **S2** | `S2_lowRiskActivationBatch1` | İlk ~50 düşük riskli scaffold (i18n/guide/validation shell) | Düşük |
| **S3** | `S3_lowRiskActivationBatch2` | Kalan düşük riskli free/estimator kapanışı | Düşük |
| **S4** | `S4_categoryOnlyRouteDecisionAndScaffold` | 151 category-only için route kararı + scaffold (bağlama yoksa stub kalır) | Orta |
| **S5** | `S5_guideOracleUxScaffold` | Generic guide/oracle UX scaffold (sector-specific olmayanlar) | Düşük–orta |
| **S6** | `S6_finalAuditAndDeployReadiness` | PASS cluster audit, deploy guard, revenue gate — deploy yine kapalı | Düşük |

## Hangi tool’lar önce aktiflenecek (S2 → S3)

Öncelik sırası manifest `quickWins` + `lowRiskActivation` birleşiminden gelir:

1. **Food / menu / agriculture / cleaning / painting / landscaping** — basit aritmetik veya mevcut contract
2. **Auto-repair candidate** — eksik yalnızca i18n, guide hide, validation scaffold, result shell
3. **Active route + partial schema** — formül core değiştirmeden tamamlanabilir

Örnek quick-win ailesi (P5B): `agriculture-irrigation-yield-loss`, `menu-profit-leak-detector`, `painting-job-profit-verdict`, `landscaping-contract-profit-tool`, `meal-planning-verdict`.

## Hangi tool’lar kesin manuel kalacak

| Slug | Neden |
|------|-------|
| `pressure-vessel-wall-thickness-calculator` | Safety-critical engineering |
| `welded-bolted-connection-calculator` | Structural / load-bearing |
| `doviz-pozisyonu-kur-farki-riski-hesabi` | FX / finance risk |
| `abonelik-yazilim-cloud-yillik-maliyet-hesabi` | Problem slug — payment/formula gate kilitli |

Ek otomatik tespit: slug’ta pressure, vessel, welded, bolted, structural, electrical safety, chemical, tax, legal, finance risk, FX, debt risk.

## 151 category-only için karar mantığı (S4)

Her category-only tool için manifest şu alanları üretir:

- **routeReady** — partial backing + düşük risk → route wiring adayı
- **keepCategoryStub** — yüksek risk / quarantine / keep_safe → stub kalır
- **scaffoldOpenable** — route_wiring veya auto_repair önerisi + düşük risk
- **guideFirst** — sector-specific veya expert guide gerekli
- **resultRendererNeeded** — result renderer eksik mi

S4 batch yalnızca `scaffoldOpenable && !keepCategoryStub` adaylarını alır. Bu fazda **canlı route bağlama yapılmaz**.

## 136 free active missing backing için kapanış stratejisi

1. **S2/S3**: Düşük riskli free active tool’larda validation + result shell scaffold (formül core dokunulmaz)
2. **Orta risk**: Sadece mevcut contract alignment (P6A listesi)
3. **Yüksek risk / regulated**: manualOnly — backing eklenmeden route açılmaz
4. **Problem slug**: blocked listesinde kalır

## 473 guide/oracle gap için scaffold stratejisi (S5)

| Seviye | Uygulama |
|--------|----------|
| `generic_scaffold_allowed` | S5 batch — generic guide hide / spec draft / oracle placeholder |
| `sector_specific_guide_required` | Manuel sector copy + contract review |
| `manual_expert_guide_required` | Engineering/finance/legal — expert only |

## Premium kalite standardı

Bir tool “premium ready” sayılması için (mevcut 22 referans):

- P24 **PASS** + runtime **ready**
- Formula contract + validation + result renderer hizalı
- paymentEligible + formulaGateEligible (tier ≠ free)
- Oracle coverage complete veya contract scenario tests mevcut
- Generic label / mixed locale yok

Sprint sonu hedef: **60–120 premium ready** (agresif değil, güvenli artış).

## Revenue/payment güvenlik sınırları

Manifest guardrails (S1–S6 boyunca sabit):

```json
{
  "paymentUnlockAllowed": false,
  "formulaGateUnlockAllowed": false,
  "freePaymentAllowed": false,
  "deployAllowed": false,
  "problemSlugMustRemainLocked": true
}
```

- paymentEligible: **22 → 22** (değişmez)
- formulaGateEligible: **22 → 22** (değişmez)
- free paymentEligible: **0** zorunlu
- P9/payment ayrı faz — tool recovery tamamlanana kadar ikinci öncelik

## Rollback planı

1. Manifest ve batch uygulamaları **ayrı commit** (S1 manifest commit’i tek başına)
2. S2+ patch’ler feature branch veya phase commit
3. Her batch sonrası: `npm run lint`, `tsc`, `build`, `assert:revenue-gate`, `audit:p4-deploy-guard`
4. Regresyon: `git restore` ilgili scaffold dosyaları; payment/formula gate dosyalarına dokunulmadığı için revenue gate korunur
5. Deploy bu sprintte **kapalı** — yalnızca S6 deploy-readiness audit

## P5C / P5D / P7 / P8 isim karmaşası — ana faz notu

| Eski / rapor adı | Sprint karşılığı | İçerik |
|------------------|------------------|--------|
| **P5B** | S1 kaynak | Full scan + segmentasyon raporu |
| **P5C / P6A** | S2 öncesi gate | 12 premium_schema_fail_manual — formula alignment, manual |
| **P5D** | — | P5C ile birleştirildi; “premium schema fail manual audit” |
| **P7** (151 quarantine) | **S4** | Category-only route kararı + scaffold |
| **P8** (guide/oracle) | **S5** | Guide spec + oracle UX scaffold |
| **P9** | Sprint dışı | Payment/billing — tool gövdesi sonrası |
| **P10** | S2/S3 içinde | i18n/mobile/RTL — düşük risk batch’lerde |

Tek komuta matrisi: `npm run audit:sprint-activation-manifest` → `scripts/.cache/sprint-tool-activation-manifest.json`

## Komutlar

```bash
npm run audit:sprint-activation-manifest
npm run assert:revenue-gate
npm run audit:p4-deploy-guard
```
