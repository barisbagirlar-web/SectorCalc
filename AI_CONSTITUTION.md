# SectorCalc — AI Anayasası (Constitution)

**Google Antigravity'nin yetkileri iptal edilmiştir.**
Cursor (DeepSeek) tüm kod tabanında tam yetkilidir.

**Versiyon:** 2.0

---

## 1. Yetki Haritası

Cursor (DeepSeek) tüm dizinlerde tam yetkiye sahiptir.

### Tam Yetki

| Dizin / Alan | Açıklama |
|---|---|
| `src/lib/**` | Hesaplama motoru, schema, tools, compliance, AI, SEO, analytics |
| `src/components/**` | Tüm UI bileşenleri |
| `src/app/**` | Sayfalar, layout, routing, API route'ları |
| `src/styles/**` | CSS, tasarım stilleri |
| `src/config/**` | Tüm konfigürasyon |
| `src/data/**` | Veri kayıtları |
| `public/**` | Statik dosyalar, img, font, sw.js |
| `messages/**` | Çeviri mesaj dosyaları |
| `functions/**` | Firebase Cloud Functions |
| `scripts/**` | Build, audit, CI scriptleri |
| `next.config.ts` | Next.js config |
| `src/middleware.ts` | Middleware |
| `firestore.rules` | Firestore güvenlik kuralları |
| `.cursor/rules/**` | Cursor kuralları |

### Korumalı (sadece kullanıcı yetkisiyle)

| Dizin / Alan | Açıklama |
|---|---|
| `.env.local`, `.env` | Ortam değişkenleri |
| `*service-account*` | Servis hesabı JSON |
| `*firebase-adminsdk*` | Firebase admin |
| `*credentials*`, `*private-key*` | Kimlik bilgileri |

---

## 2. Çalışma Kuralları

### Kural 1: Tek AI — Tam Yetki

- Tüm dosyalarda **ekle, değiştir, silebilirsin**.
- Korumalı alanlara sadece kullanıcı açık izin verirse dokun.

### Kural 2: Test Disiplini

Her değişiklik sonrası:
```bash
npm run lint
npm run build
```

### Kural 3: Dev Server

```bash
sh dev.sh        # clean build + serve
```

### Kural 4: Commit Formatı

```
alan: kısa açıklama
```

Örnek:
```
formula-governance: fix margin validation boundary
components: update pricing page layout
```

---

## 3. Senkronizasyon

Google Antigravity artık yetkili olmadığı için senkronizasyon brief'i gereksizdir.
Tüm değişiklikler doğrudan Cursor tarafından yapılır.

---

_Anayasa sürüm 2.0 — Google Antigravity yetkileri iptal edildi, Cursor tam yetkili._
