# SectorCalc Universal Calculator Engine — Kurulum Rehberi

## Teslim Edilen Dosyalar

| Dosya | Amaç |
|---|---|
| `UniversalCalculator.jsx` | Tüm 192 araç için tek React bileşeni |
| `rewrite-pipeline.mjs` | 192 JSON'u API ile endüstriyel kaliteye yükseltir |
| `pro-tool-page.tsx` | Next.js sayfa bileşeni (JSON → UI) |

---

## ADIM 1 — Pipeline Çalıştır (192 araç JSON yeniden üretimi)

```bash
# Bağımlılık kur
npm install @anthropic-ai/sdk

# API key (zaten varsa atla)
export ANTHROPIC_API_KEY="sk-ant-..."

# Önce test: sadece 2 araç (PRO_019 ve PRO_043)
node rewrite-pipeline.mjs \
  --input=./pro_hesaplama_araclari_193_.txt \
  --output=./data/pro-tools \
  --only=PRO_019,PRO_043

# Çıktıyı kontrol et
cat ./data/pro-tools/PRO_043.json | python3 -m json.tool

# Test geçtiyse tüm 192 araç (~2-3 saat, ~$8-12 API maliyeti)
node rewrite-pipeline.mjs \
  --input=./pro_hesaplama_araclari_193_.txt \
  --output=./data/pro-tools
```

**Tahminler:**
- 192 araç × ortalama 2500 token = ~480K token
- Claude Sonnet 4.6 maliyeti: ~$4-8 toplam
- Süre: ~120 dakika (0.6s delay ile)
- Çıktı: 192 ayrı JSON + `_merged.json` + `_report.json`

---

## ADIM 2 — Next.js'e Entegrasyon

```
sectorcalc/
├── app/
│   └── [locale]/
│       └── pro-tools/
│           └── [toolId]/
│               └── page.tsx          ← pro-tool-page.tsx'i buraya kopyala
├── components/
│   └── calculators/
│       └── UniversalCalculator.jsx   ← buraya kopyala
└── data/
    └── pro-tools/
        ├── PRO_001.json              ← pipeline çıktısı
        ├── PRO_002.json
        ├── ...
        └── PRO_193.json
```

```bash
# Dosyaları yerleştir
cp UniversalCalculator.jsx components/calculators/
cp pro-tool-page.tsx app/[locale]/pro-tools/[toolId]/page.tsx
mkdir -p data/pro-tools
# data/pro-tools/ içine pipeline çıktısını kopyala
```

---

## ADIM 3 — Araç Listesi Sayfası (mevcut pro-tools sayfana entegrasyon)

`data/pro-tools/_merged.json` dosyasını kullanarak mevcut katalog sayfana araçları ekle:

```typescript
// app/[locale]/pro-tools/page.tsx içinde
import mergedTools from "@/data/pro-tools/_merged.json";

const toolList = mergedTools.map(tool => ({
  id: tool.tool_id,
  name: tool.tool_name,
  category: tool.category,
  href: `/${locale}/pro-tools/${tool.tool_id}`,
  standards: tool.engine_rules?.standards || [],
}));
```

---

## ADIM 4 — Kalite Kontrolü

Pipeline sonrası `_report.json` dosyasına bak:

```json
{
  "quality_failed": [
    { "id": "PRO_XXX", "quality_gate": { "warnings_ok": false } }
  ]
}
```

`quality_failed` listesindeki araçları tek tek yeniden işle:

```bash
node rewrite-pipeline.mjs \
  --input=./pro_hesaplama_araclari_193_.txt \
  --output=./data/pro-tools \
  --only=PRO_XXX,PRO_YYY \
  --force
```

---

## UniversalCalculator Props

```typescript
<UniversalCalculator
  tool={toolJson}          // JSON objesi (zorunlu)
  locale="tr"              // "tr" | "en" | "de" vb.
  onResult={(result) => {  // opsiyonel callback
    console.log(result.computed);   // hesaplanan tüm değişkenler
    console.log(result.warnings);   // tetiklenen uyarılar
  }}
/>
```

---

## Engine'in Desteklediği Formül Fonksiyonları

```
POWER(x, n)    ABS(x)      SQRT(x)    LN(x)      LOG10(x)
EXP(x)         SIN(x)      COS(x)     TAN(x)     PI
NORMSINV(p)    NORMSDIST(z)
MAX(a,b)       MIN(a,b)    FLOOR(x)   CEIL(x)
```

---

## Dikkat Edilmesi Gerekenler

1. **`absolute_min`** — Her sayısal inputta tanımlı olmalı (pipeline bunu zorluyor)
2. **Formül sırası** — Bağımlı değişkenler önce tanımlanmalı (`n_rpm` → `Vf` → `T_cut`)
3. **Birim tutarlılığı** — mm/dak ile m/dak karışmamalı; formüller içinde çevrim faktörü kullan
4. **PRO_019** — Pipeline tarafından sıfırdan üretilecek (şu an boş)
5. **Scope çakışması** — `multi_operation` scope'lu araçlarda `formulas_milling` ve `formulas_turning` ayrı diziler olarak yazılacak; engine bunu henüz ayrıştırmıyor (gerekirse eklenebilir)

---

*SectorCalc Engine v1.0 — 2026*
