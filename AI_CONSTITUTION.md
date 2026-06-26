# SectorCalc — Dual-AI Anayasası (Constitution)

Bu belge, **Cursor (DeepSeek API)** ve **Google Antigravity** olmak üzere
iki AI sisteminin SectorCalc projesinde **çakışmadan, üstüne yazmadan,
birbirini bozmadan** çalışmasını sağlar.

**Versiyon:** 1.1

---

## 1. Bölge Haritası — Kim Nereye Dokunur

Her AI kendi bölgesindeki dosyaları okur, değiştirir, siler.
Karşı bölgedeki dosyalar **sadece okunabilir (Read-Only)** — değişiklik ve silme yasaktır.
Korumalı alanlara hiçbir AI dokunamaz.

> **Read-Only kuralı:** Karşı bölgeden bir dosyayı **okuyabilirsin** (anlamak, referans almak için).
> Ancak **değiştiremez, silemez, taşıyamazsın.**

### Cursor (DeepSeek) Bölgesi — "Hesaplama Motoru & Altyapı"

| Dizin / Alan | Yetki | Açıklama |
|---|---|---|
| `src/lib/formula-governance/` | **Sahibi** | Contract, validation, oracle, audit, runtime |
| `src/lib/premium-schema/` | **Sahibi** | Premium calculator schemas, formula registry |
| `src/lib/tools/` | **Sahibi** | Revenue tools, free tool registry, catalog |
| `src/lib/calculators/` | **Sahibi** | Calculator implementations |
| `src/lib/compliance/` | **Sahibi** | Regional compliance engine |
| `src/lib/regional/` | **Sahibi** | Regional config, unit defaults |
| `src/lib/leads/` | **Sahibi** | Lead system logic |
| `src/lib/ai/` | **Sahibi** | AI gateway, deepseek client, embedding |
| `src/lib/ai-gateway/` | **Sahibi** | Customer AI gateway |
| `src/lib/assistant/` | **Sahibi** | Assistant logic |
| `src/lib/semantic/` | **Sahibi** | JSON-LD, semantic schema |
| `src/lib/seo/` | **Sahibi** | SEO metadata, sitemap, indexing |
| `src/lib/analytics/` | **Sahibi** | Revenue analytics |
| `src/lib/feedback/` | **Sahibi** | Verification queue, feedback |
| `src/lib/catalog/` | **Sahibi** | Catalog build logic |
| `src/lib/i18n/` | **Sahibi** | i18n engine, locale config |
| `src/lib/locale-center/` | **Sahibi** | Locale center audit |
| `src/lib/industries/` | **Sahibi** | Industry tool resolution |
| `src/lib/format/` | **Sahibi** | Localization format helpers |
| `src/lib/math/` | **Sahibi** | Math/stochastic engine |
| `src/lib/os/` | **Sahibi** | Industrial OS core |
| `src/lib/benchmarks/` | **Sahibi** | Benchmark logic |
| `src/lib/guidance/` | **Sahibi** | Reference guidance logic |
| `src/lib/actions/` | **Sahibi** | Server actions |
| `src/lib/engine/` | **Sahibi** | Mock DB, engine core |
| `src/lib/paddle-provider.tsx` | **Sahibi** | Paddle payment provider |
| `src/lib/firebase/` | **Sahibi** | Firebase config, auth |
| `src/lib/metadata.ts` | **Sahibi** | Metadata helpers |
| `src/config/` | **Sahibi** | Config files (locales, regions, site) |
| `src/data/` | **Sahibi** | Data registries, i18n data files |
| `messages/` | **Sahibi** | Translation message files |
| `functions/` | **Sahibi** | Firebase Cloud Functions |
| `scripts/` | **Sahibi** | Build, audit, CI scripts |
| `public/sw.js` | **Sahibi** | Service worker |
| **`src/app/api/`** | **Sahibi** | **API route'ları (backend logic)** |
| `next.config.ts` | **Ortak** | Next.js config (koordineli değişiklik) |
| `src/middleware.ts` | **Ortak** | Middleware (koordineli değişiklik) |

### Google Antigravity Bölgesi — "Ön Yüz & Tasarım"

| Dizin / Alan | Yetki | Açıklama |
|---|---|---|
| `src/components/` | **Sahibi** | Tüm UI bileşenleri (React) |
| `src/app/` (api hariç) | **Sahibi** | Sayfalar, layout, routing |
| `src/styles/` | **Sahibi** | CSS, tasarım stilleri |
| `public/` (sw.js hariç) | **Sahibi** | Statik dosyalar, img, font |
| `src/config/brand.ts` | **Sahibi** | Marka varlıkları konfigürasyonu |
| `src/components/brand/` | **Sahibi** | Logo, favicon bileşenleri |
| `.cursor/rules/brand-assets-lock.mdc` | **Sahibi** | Marka kuralları |

### Korumalı Alan — İkisi de Dokunamaz

AI'lar bu alanlara **kesinlikle dokunamaz**. Sadece kullanıcı yetki verir.

| Dizin / Alan | Gerekçe |
|---|---|
| `src/app/admin/` | Admin panel — manuel review gerektirir |
| `src/components/admin/` | Admin UI bileşenleri |
| `src/lib/firebase/` admin yolları | Firebase admin yetkileri |
| `functions/src/admin/` | Admin cloud functions |
| `firestore.rules` | Firestore güvenlik kuralları |
| `.env.local` | Ortam değişkenleri |
| `*.service-account*` | Servis hesabı JSON |

---

## 2. Çalışma Kuralları

### Kural 1: Kendi Bölgende Kal — Karşı Bölgeyi Sadece Oku

- Kendi bölgende dosya **ekle, değiştir, silebilirsin**.
- Karşı bölgedeki dosyaları **anlamak ve referans almak için okuyabilirsin (Read-Only)**.
- Karşı bölgede **kesinlikle değişiklik veya silme yapamazsın**.
- Bir dosyanın kime ait olduğundan emin değilsen bu anayasaya bak.

**Örnek (Antigravity):** `src/lib/tools/revenue-tools.ts`'i **okuyup** "bu fonksiyon hangi veriyi döndürüyor" anlayabilirsin. Ama o dosyayı **değiştiremezsin**.

**Örnek (DeepSeek):** `src/components/tools/PremiumToolPage.tsx`'i **okuyup** "bu bileşen hangi prop'ları bekliyor" görebilirsin. Ama o dosyayı **değiştiremezsin**.

### Kural 2: Ortak Dosyalarda Koordinasyon

`next.config.ts` ve `src/middleware.ts` ortak dosyalardır.
- Değişiklik gerekiyorsa sadece **kendi alanını** ekle/güncelle.
- Başka AI'ın eklediği bir şeyi **silme, değiştirme**.
- Çakışma olursa kullanıcıya bildir.

### Kural 3: Senkronizasyon Brief'i (Sync Brief)

Bir AI, kendi bölgesinde yaptığı bir değişiklik **karşı bölgedeki bir dosyayı etkiliyorsa** (API kontratı, veri yapısı, import path, variable/function name değişikliği), değişiklik sonrası **kullanıcıya kısa bir özet (brief) bildirir**.

**Zorunlu bildirim konuları:**
- Yeni/Değişen API route: method, path, request/response shape
- Değişen veri tipi / interface / type export
- Değişen import path veya dosya adı
- Kaldırılan/güncellenen fonksiyon imzası
- Eklenen yeni bağımlılık (npm package)

**Format:**
```
[SENKRONİZASYON BREFİ]
AI: CURSOR / ANTIGRAVITY
Değişiklik: <özet>
Etkilenen alan: <karşı bölgedeki hangi dosya/bileşen>
Yeni kontrat: <güncel API/imza/veri yapısı>
```

**Örnek:**
```
[SENKRONİZASYON BREFİ]
AI: CURSOR
Değişiklik: RevenueToolInput tipine 'unit' alanı eklendi
Etkilenen alan: MigratedFreePremiumToolSurface.tsx (input render)
Yeni kontrat: RevenueToolInput = { key: string; label: string; unit?: string; ... }
```

Kullanıcı brief'i Antigravity'e iletir. İki AI arasında doğrudan iletişim yoktur.

### Kural 4: Değişiklik Bildirimi

Her AI, commit mesajında hangi bölgede çalıştığını belirtir:
```
[CURSOR] formula-governance: fix margin validation boundary
[ANTIGRAVITY] components: update pricing page layout
```

Senkronizasyon brief'i gerektiren durumlarda commit mesajının son satırına eklenir:
```
[CURSOR] tools: add unit field to RevenueToolInput type

Sync-brief: RevenueToolInput tipine unit alanı eklendi — UI tarafı input render'ı güncellemeli.
```

### Kural 5: Çöp Kutusuna Saygı

Diğer AI'ın çalıştığı bir branch/dosyada değişiklik varsa bekle.
`git pull` yapmadan ve çakışma kontrolü yapmadan push etme.

### Kural 6: Test Disiplini

Her iki AI da kendi bölgesinde değişiklik sonrası şunları çalıştırır:
```bash
npm run lint
npm run build
```

### Kural 7: Dev Server — Static Build + Serve (ÇİFT ONAYLI)

**Kullanılacak TEK komut:**
```bash
sh dev.sh
```

**Kesinlikle yasak:** `npx next dev`, `npm run dev`, `next dev`, `npm start`

#### Nasıl çalışır?

`dev.sh` → `scripts/dev-static.mjs`'i çalıştırır:

1. **`next build`** ile production build alır (0 runtime error)
2. **`next start -p 3000`** ile built dosyaları sunar
3. **`fs.watch`** ile `src/`, `data/`, `messages/`, `public/` klasörlerini izler
4. Dosya değişince → rebuild → restart (hot swap)
5. **Build hatası = crash yok** — eski build yayında kalır

#### Neden %100 stabil?

| next dev (ESKİ) | next build + serve (YENİ) |
|---|---|
| Runtime derleme → crash | Derleme bitti, sadece dosya sunar |
| Fast Refresh hata üretir | Production code = 0 hata |
| SW offline sorunu | Production build = doğru SW |
| Bellek sızıntısı | Statik dosya sunar, sızıntı yok |

#### Süreç kuralı

- Bir AI server'ı başlattıysa diğeri restart etmez
- Değişiklik görünmezse: **hard refresh (Cmd+Shift+R)** + 5 saniye bekle (rebuild sürüyor olabilir)
- Gerçekten restart gerekiyorsa: `sh dev.sh` (eski port'u öldürür, rebuild + serve yapar)

---

## 3. Ortak Komutlar

```
[AI_ADI] alan: kısa açıklama

Örnekler:
[CURSOR] tools: register new scrap-rate free tool
[ANTIGRAVITY] components: redesign industry hub cards
[CURSOR] formula-governance: fix dimension check in heat-loss
[ANTIGRAVITY] styles: update color palette to terracotta
```

---

## 4. Sıkıntı Durumunda

1. Değişiklik yapmadan önce `git status` ile temiz working tree kontrol et
2. Çakışma varsa **kullanıcıya haber ver**, kendin çözme
3. `AI_CONSTITUTION.md`'yi güncelleme gerekiyorsa kullanıcıya sor

---

_Anayasa sürüm 1.1 — Her AI çalışmaya başlamadan önce bu belgeyi okur._
