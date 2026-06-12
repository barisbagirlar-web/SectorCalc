---
description: SectorCalc premium-sade UI kalite ve responsive kontrol
alwaysApply: true
---

# 02 — UI Quality

SectorCalc görünümü: premium, sade, endüstriyel güven — sıradan hesap makinesi sitesi değil.

## Tasarım yasağı

- Gereksiz animasyon
- Anlamsız gradient / dekoratif blur
- Fazla badge, emoji premium kartlarda, hero clutter
- `href="#"` veya boş tıklanabilir alan
- Horizontal scroll (mobil)

## Tasarım zorunluluğu

- Mobile-first; dokunma hedefi ≥ 44px mümkün olduğunca
- Semantic HTML (`main`, `nav`, `section`)
- Mevcut token/CSS convention’a uy (`design-craft.css`, `apple-ui.css`)
- Tool listeleri: `ToolTile` + `ToolsTileGrid` (bkz. `tool-listing-tiles.mdc`)

## Değişiklik alanları — ek kontrol

| Alan | Kontrol |
|---|---|
| Hero | Oran, metin taşması, arama kutusu padding, mobil kırpılma |
| Footer | Link hedefleri, kaynak linkleri, mobil sütun |
| Card / catalog | Tile yoğunluğu, kategori anchor, `#tool-{slug}` |
| Premium shell | Paywall, verdict, PDF teaser ayrımı |

## UI teslim öncesi manuel QA

Her UI patch’inde raporla veya kullanıcıdan iste:

- Desktop (≥1280px)
- Mobile (≤390px)
- Tablet (768px) — hero/catalog değiştiyse
- Browser console temiz
- Network: beklenmeyen 404 / CORS yok

KANIT YOK ise:

```txt
KANIT YOK: Desktop/mobile QA yapılmadı.
```

## Secret / API

- Hardcoded secret yok
- Stripe/Firebase secret `NEXT_PUBLIC_*` içinde yok
- Frontend’e service account JSON yok

## Audit (UI + copy)

Public copy değişikliğinde:

```bash
npm run audit:public-surface
npm run audit:sector-footer
grep -RIn 'href="#"' src/components src/app
```

Fail varsa UI işi bitmiş sayılmaz.
