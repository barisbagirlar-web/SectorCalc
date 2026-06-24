---
description: SectorCalc korunan alanlar ve migration/LLM audit zorunluluğu
alwaysApply: true
---

# 01 — SectorCalc Safety

Açık kullanıcı izni olmadan aşağıdaki alanlara dokunma.

## Dokunulmaz alanlar

```txt
.env / .env.local / functions/.env
*secret* / service-account / firebase-adminsdk
firebase config, firestore.rules, functions deploy
vercel.json / cloudflare wrangler (deploy config)
auth flows, payment, checkout, Stripe webhooks
admin panel (src/app/admin/**, src/components/admin/**)
private routes: /account, /checkout, /login, /admin, /api/*
lead system, Firestore client subscription writes
paddle integration locks: src/lib/paddle-provider.tsx, src/lib/plans.ts, src/components/pricing/CreditWall.tsx
-> PADDLE RULE: DO NOT modify paddle-provider or re-introduce successUrl in overlay mode. DO NOT remove hardcoded Price IDs from plans.ts.
```

## İçerik ve route güvenliği

- **152 premium seed** içeriğine izinsiz edit yok (`src/lib/premium-schema/schemas/*` toplu değişiklik)
- **Mevcut route slug** rastgele rename / redirect kırma yok
- **Brand assets** kilidi: `src/config/brand.ts`, `public/img/brand/*` — bkz. `brand-assets-lock.mdc`
- **`src/app/api`** yeni route ekleme yasak (proje kuralı)

## Audit zorunlu işler

Bu alanlarda patch sonrası ilgili audit **PASS** olmadan teslim yok:

| İş | Audit |
|---|---|
| LLM / AI index, llms.txt, robots | `audit:llm-seo`, `audit:ai-tool-index`, `audit:ai-crawler-policy` |
| Free → premium migration | `audit:free-to-premium` |
| Locale / calculator copy | `audit:calculator-copy`, `audit:calculator-surface` |
| Premium catalog / categories | `audit:premium-catalog`, `audit:global-categories` |
| Semantic JSON-LD | `audit:semantic-jsonld` |

## Export / prebuild

- `llms.txt` yalnızca `npm run export:ai-index` ile üretilir
- Eski slug-dump format (`Free tool slugs`, `Count: 230`, `AI & LLM Source Guide`) public dosyalara dönmez
- `seo:authority-txt` `llms.txt` üzerine yazmaz

## Commit öncesi

```bash
npm run check:secrets
git diff --cached --name-only
```

Secret veya credential diff’te görünürse commit durdur.

## İhlal durumu

```txt
UYGULANMADI: Korunan alana izinsiz dokunuldu — <path>
```
