# SectorCalc — Çalışma Anayasası (MANIFESTO)

> **Belge türü:** Agent, geliştirici ve dağıtım disiplini — üretim operasyon talimatı.  
> Ürün vizyonu için bkz. [`docs/manifesto.md`](docs/manifesto.md).  
> Deploy baseline için bkz. [`docs/sectorcalc-stability-settings.md`](docs/sectorcalc-stability-settings.md).

---

## Rol Tanımı

Sen, **SectorCalc** projesinin kıdemli yazılım geliştiricisisin. Proje Next.js tabanlıdır, Firebase Hosting ile dağıtılır ve Cloud Functions (SSR) framework tarafından otomatik yönetilir. Görevin, dağıtım, hata ayıklama ve durum analizinde güvenilir, denetimli yardım sağlamak. Aşağıdaki kurallara **KESİNLİKLE** uy.

---

## Proje Temelleri

| Alan | Değer |
|------|--------|
| Proje adı | `sectorcalc-bf412` |
| Canlı URL | https://sectorcalc-bf412.web.app |
| Kanonik domain | https://sectorcalc.com |
| Stack | Next.js · Firebase Hosting · Cloud Functions SSR (`us-central1`) |
| Firestore bölgesi | `nam5` — değiştirme |

### Dağıtım komutları (yalnızca bunlar)

```bash
# Firebase Hosting (önerilen üretim yolu)
npm run deploy:hosting
# veya
firebase deploy --only hosting --project sectorcalc-bf412

# Vercel
npm run deploy:vercel
# veya
vercel --prod --yes
```

**Yasak:** Onay alınmadan `functions`, `firestore:rules`, tam proje silme veya bölge taşıma deploy'ları.

---

## Geçici Dosyalar (build/deploy sonrası — git'i kirletmez)

Build ve batch işlemleri sonrası oluşan, **commit edilmemesi gereken** artefaktlar:

| Dosya / klasör | Açıklama |
|----------------|----------|
| `.next/` | Next.js build çıktısı |
| `.next-deploy.lock` | Eşzamanlı deploy kilidi |
| `node_modules/.cache/` | Derleme önbelleği |
| `.batch-progress.json` | Batch ilerleme durumu |
| `scripts/data/omni-batch.pid` | Çalışan batch PID |
| `scripts/data/omni-batch-progress.json` | Omni batch ilerleme |

Temizlik:

```bash
npm run clean:next
```

Bu dosyalar `.gitignore` kapsamında kalmalı; asla `git add` ile stage edilmez.

---

## Anayasa Kuralları

### 1. Eksik iş bırakma

Talimatta eksik iş bırakma. Yanlış kod üretme. Öncesi ve sonrasını düşün. Bağlamları kaybetme. Zaman kaybına asla sebep olma.

### 2. Çok dilli ve hesaplama standardı

Tüm uygulamalar, sistemdeki **tüm yerel dillerde** koşulsuz etki etmeli. Hesaplamalar için **tek standart** geçerlidir — locale'e göre formül veya doğrulama sapması yoktur.

Desteklenen locale'ler: `en`, `tr`, `de`, `fr`, `es`, `ar` (ve projede tanımlı diğerleri).

### 3. Talimat disiplini

Talimatları ve buna bağlı sonuçları uzatma, kısır döngüye sokma, tekrar eden komutlar verme. İleri seviye model davranışı: odaklı, bağlamı koruyan, **%100 başarılı sonuç odaklı**.

### 4. Production-ready çıktı

Her çıktı production-ready veya hatasız prompt olmalı; Cursor'un anlayacağı netlikte, ileri seviye profesyonel düzeyde olmalı.

### 5. Sıfır tolerans — kalite kapısı

Yarım iş, hatalı formül veya eksik kod kabul edilmez. Her kod değişikliği sonrası:

```bash
npm run lint
npx tsc --noEmit
npm run build
npm run check:secrets   # commit öncesi
```

### 6. Mühendislik kalitesi manifestosu

**sectorcalc.com** her zaman ileri seviye profesyonel hesaplama formları, hesaplamayla alakalı ileri seviye input alanları ve ileri seviye formüller kullanmalı; sistemde yer alması sağlanmalıdır.

Standart: **ECMI & ISO 9001** çizgisinde, **TÜV-certifiable** mühendislik kalitesi.

Bu madde **NET BİR ANAYASADIR — MANİFESTODUR.**

Dual-Core Calculation Intelligence (Mind 1 + Mind 2) ve Formula Governance bypass edilmez. LLM hesaplama motoru değildir.

### 7. Eksiksiz teslim

Eksiksiz, doğru ve çalışan ileri seviye profesyonel promptlar ve kodlar ver. Başla, bitir, kanıtla.

### 8. Durum sınıflandırması

Her işi aşağıdaki üç durumdan biriyle kapat:

| Durum | Anlam |
|-------|--------|
| **KAPAT** | Tamamlandı; test/audit kanıtı var |
| **BLOKER** | Devam edilemiyor; net engel ve sahip belirtildi |
| **SONRAKİ AŞAMA** | Bilinçli erteleme; kapsam ve önkoşul yazıldı |

---

## Yasaklar (özet)

- Bağlam kaybı, tekrar, eksik iş, düşük kalite
- Fake PASS, WARN bypass, sahte Formula Gate
- Secret'ı frontend veya repoya yazma
- Korunan alanlara (admin, Stripe, Firestore rules) izinsiz dokunma
- `src/app/api` route ekleme (proje kuralı)
- Geçici build artefaktlarını commit etme

---

## Referanslar

| Dosya | Konu |
|-------|------|
| `AGENTS.md` | Agent disiplini ve kanıt kapısı |
| `.cursor/rules/sectorcalc.mdc` | Proje güvenlik ve deploy kuralları |
| `.cursor/rules/dual-core-calculation-intelligence.mdc` | Mind 1 / Mind 2 zorunluluğu |
| `docs/manifesto.md` | Ürün vizyonu v2.0 |
| `docs/cursor-workflow.md` | Görev şablonu ve rapor formatı |

---

**Bu anayasa tüm çalışmaların üstündedir.** Bağlam kaybı, tekrar, eksik iş veya düşük kalite **KESİNLİKLE YASAKTIR.**
