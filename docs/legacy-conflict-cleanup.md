# Legacy Conflict Cleanup — P1A Safe Isolation Policy

P2.5 Enterprise Control Plane, DeepSeek Bulk Repair Factory ve Formula Knowledge Graph kurulmadan önce eski, çakışan veya yarım kalmış yüzeyler **silinmez** — audit edilir ve güvenli şekilde izole edilir.

## Ne silinmeyecek?

- Tool kayıtları (catalog, revenue-tools, premium-schema)
- Route dosyaları (`src/app/[locale]/tools/**`)
- Formula implementation (`formula-registry`, contracts, oracle)
- P9 WIP payment dosyaları (`functions/src/createStripeCheckout.ts`, `stripeWebhook.ts`, billing hooks)
- Firebase / Firestore / Auth altyapısı
- `apps/guide-frontend` (ayrı CMS hattı olarak kalır)

## Ne deprecated sayılacak?

| Yüzey | Durum |
|---|---|
| `GuidedReferenceGraphic` + `GenericCalculatorGraphic` | Deprecated — canlı render yolu kapalı |
| `ReferenceGraphicCard` | Deprecated — `return null` (GDE-0) |
| Legacy verify / certified / QR / hash / legal-grade pazarlama iddiaları | Deprecated — yeni ürün yüzeyinde kullanılmaz |
| `public/ai-*` build drift | Deprecated karar kaynağı — yalnızca export sonrası fresh kabul |
| Eski `scripts/.cache` raporları (regenerate edilmemiş) | Deprecated — stale finding |

## Ne safe-isolated olacak?

### 1. Audit cache (`scripts/.cache/*`)

- P2.4, Runtime Trust, legacy conflict raporları burada üretilir.
- **Commit edilmez.**
- Control Plane bu dosyaları yalnızca `legacy finding` olarak okur; fresh regenerate olmadan final karar vermez.

### 2. Build drift (`public/ai-*`, `next-env.d.ts`)

- `npm run export:ai-tool-index` ve build çıktılarından türeyen dosyalar.
- P1A promptunda commit dışı tutulur.
- Bulk repair / Control Plane karar kaynağı değildir.

### 3. P9 WIP payment

- `functions/src/createStripeCheckout.ts`
- `functions/src/stripeWebhook.ts`
- `src/lib/billing/use-premium-tool-access.ts`

Tool recovery tamamlanana kadar ikinci öncelik. P1A bu dosyaları **raporlar**, değiştirmez.

### 4. Rehber CMS (`apps/guide-frontend`)

- Strapi + Astro + Cloudflare Pages hattı.
- Ana Next.js tool pipeline'ına import edilmez.
- SEO rehber içeriği ayrı domain/path politikasıyla yönetilir.

### 5. Firebase Hosting

- `firebase.json` hosting + `frameworksBackend` yapılandırması mevcut.
- **Primary production:** `www.sectorcalc.com` — Vercel (Next.js).
- **Secondary:** Firebase Hosting (legacy / backup deploy path).
- Control Plane hosting silme yapmaz; Firebase'i sole production sanmaz.

## Yeni Control Plane hangi legacy kaynakları ignore edecek?

P2.5 ve DeepSeek Bulk Repair otomatik karar kaynağı olarak **kullanmayacak:**

1. Stale `scripts/.cache` (regenerate timestamp eski veya audit komutu çalışmamış)
2. `public/ai-*` build drift (fresh export yok)
3. Legacy verify / certified / QR / hash / mühürlü / sertifikalı iddiaları
4. `apps/guide-*` rehber CMS içeriği
5. P9 WIP payment kod yolları
6. Firebase Hosting'i tek production otoritesi sanma
7. Generic guide fallback çıktıları (`wouldLegacyGenericGuideRender === true`)
8. `hasFormulaSourceAudit` tek başına — Formula Gate kararı için yetersiz

## P2.5 kurulurken hangi eski raporlar kaynak alınmayacak?

- Regenerate edilmemiş `p24-tool-quality-report.json`
- Regenerate edilmemiş `runtime-trust-engine-report.json`
- Manuel JSON düzenlemeleri / fake PASS override
- Eski quality-scan CSV'leri (oracle yerine geçmez)
- `legacy-conflict-report.json` içindeki **info** severity kayıtları (bulgu listesi, karar değil)

**Kaynak alınacak (fresh regenerate sonrası):**

```bash
node scripts/tool-activation/audit-p24-tool-quality.mjs
node scripts/tool-activation/audit-runtime-trust-engine.mjs
npm run assert:revenue-gate
npm run audit:legacy-conflicts
```

## Formula Gate — güvenli yüzey kuralı

Formula Gate Approved badge yalnızca şu zincirle gösterilir:

1. `evaluateRuntimeTrust()`
2. `canShowFormulaGateApproved(decision)`
3. `getFormulaGateVerifiedLabel()` (i18n copy)

`hasFormulaSourceAudit(slug)` tek başına badge yetkisi vermez.

## Generic input guide — güvenli yüzey kuralı

- `shouldRenderInputGuide()` default **false** (spec + inputMap yoksa render yok)
- `ReferenceGraphicCard` kalıcı kapalı
- Legacy `resolveReferenceGraphic` yalnızca audit hook'ta

## Premium / free copy — güvenli yüzey kuralı

Premium route'ta:

- `contentAuthority.premium.faqIsFree*` kullanılır (ücretsiz değil cevabı)
- `contentAuthority.free.faqFreeAnswer` ("Evet...") premium yüzeye sızmaz
- `premiumSurfaceUsesFreeCopy: true` trust engine'de `tier_copy_mismatch` üretir

## Audit komutu

```bash
npm run audit:legacy-conflicts
```

Çıktı: `scripts/.cache/legacy-conflict-report.json` (commit edilmez)

## P1B Control Plane geçiş önkoşulları

- [ ] `audit:legacy-conflicts` çalışır
- [ ] Revenue gate PASS (`npm run assert:revenue-gate`)
- [ ] P9 WIP ana tool hattından izole
- [ ] `apps/guide-frontend` main `src/` import graph'ta yok
- [ ] Formula Gate yüzeyleri runtime trust guard kullanıyor
- [ ] Generic guide fallback canlı render kapalı
- [ ] `lint` / `tsc` / `build` PASS
