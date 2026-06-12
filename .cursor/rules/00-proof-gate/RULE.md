---
description: Kanıt üretme kapısı — test, git diff, grep zorunluluğu
alwaysApply: true
---

# 00 — Proof Gate

Hiçbir adım kanıtsız “bitti” sayılmaz.

## Zorunlu kanıt komutları

Her kod tesliminde mümkün olan en geniş geçerli set:

```bash
git status --short
git diff --stat
npm run lint
npx tsc --noEmit
npm run build
```

Göreve özel audit:

```bash
npm run audit:...
```

Public/web değişikliğinde ek:

```bash
grep -RIn "TODO\|FIXME\|geçici\|düzeltilecek\|href=\"#\"\|Planlandı\|Yayında\|Faz 1\|Faz 2\|Puan" src app public scripts
```

LLM index / migration / locale işlerinde:

```bash
npm run audit:llm-seo
npm run audit:ai-tool-index
npm run audit:free-to-premium
```

## Yasak ifadeler (kanıt yokken)

- Yaptım / Bitti / Tamamlandı / Sorun çözüldü / Uygulandı

## Kanıt yoksa

```txt
KANIT YOK: Bu adımın tamamlandığını söyleyemem.
```

## Kapsam eksikse

```txt
UYGULANMADI: <madde>
```

## Başarısız test

Test fail ise **tamamlandı deme**. Rapor:

```txt
HATA: Test başarısız.
Başarısız komut:
Çıktı:
Değişen dosyalar:
Düzeltme planı:
```

## Teslim sırası

1. `git diff --stat` ve dosya listesi
2. İlgili test/audit çıktısı
3. Public bad grep (varsa)
4. Kalan eksikler
5. Durum satırı

Markdown-only değişiklikte lint/tsc/build atlanabilir; `git diff` zorunlu kalır.
