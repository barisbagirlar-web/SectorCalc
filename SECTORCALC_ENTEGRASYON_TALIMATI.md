# SectorCalc Pro — Tam Entegrasyon Talimatı
**192 Araç · Next.js/Firebase · Endüstriyel Kalite Engine**

---

## SİSTEMİN GENEL MANTIĞI

Bu sistemde 3 katman var:

```
[pro_hesaplama_araclari_193_.txt]
         ↓  rewrite-pipeline.mjs (Anthropic API)
[data/pro-tools/PRO_001.json ... PRO_193.json]
         ↓  UniversalCalculator.jsx (React engine)
[sectorcalc.com/tr/pro-tools/PRO_043]  ← kullanıcı görür
```

Pipeline bir kez çalışır, JSON'lar kalıcıdır. Engine her araç için
bu JSON'ı okuyup forma çevirir. Yeni araç eklemek = yeni JSON dosyası koymak.

---

## ADIM 0 — ÖN HAZIRLIK (bir kez yapılır)

### Dosya yapısı

Sana teslim edilen 4 dosyayı Next.js projenin içine şu konumlara koy:

```
sectorcalc/                          ← mevcut Next.js projen
│
├── components/
│   └── calculators/
│       └── UniversalCalculator.jsx  ← teslim edilen dosya buraya
│
├── app/
│   └── [locale]/
│       └── pro-tools/
│           └── [toolId]/
│               └── page.tsx         ← pro-tool-page.tsx buraya (rename et)
│
├── data/
│   └── pro-tools/                   ← pipeline çıktısı buraya gelecek
│       └── (henüz boş)
│
└── scripts/
    └── rewrite-pipeline.mjs         ← teslim edilen dosya buraya
```

### Bağımlılık kur

```bash
cd sectorcalc/
npm install @anthropic-ai/sdk
```

---

## ADIM 1 — PİPELINE İLE 192 JSON ÜRETİMİ

Bu adım API'yi kullanır ve her araç için endüstriyel kalitede JSON üretir.
**Bir kez çalıştırılır.** Sonuç JSON'lar kalıcıdır.

### 1.1 — API key tanımla

```bash
# Mac/Linux terminalde:
export ANTHROPIC_API_KEY="sk-ant-api03-..."

# Windows PowerShell'de:
$env:ANTHROPIC_API_KEY="sk-ant-api03-..."
```

> API key'ini Anthropic Console'dan alırsın: console.anthropic.com → API Keys

### 1.2 — Önce 3 araçla test et

```bash
node scripts/rewrite-pipeline.mjs \
  --input=./pro_hesaplama_araclari_193_.txt \
  --output=./data/pro-tools \
  --only=PRO_043,PRO_091,PRO_098
```

Beklenen çıktı terminalde:
```
[1/3] ⚙  PRO_043 — Talaşlı İmalat Kesme Dinamikleri...
  ✅ Başarılı | {"inputs_ok":true,"formulas_ok":true,"warnings_ok":true,...}
[2/3] ⚙  PRO_091 — WPS Ön Isıtma...
  ✅ Başarılı
[3/3] ⚙  PRO_098 — OEE/TPM...
  ✅ Başarılı
```

### 1.3 — JSON çıktısını kontrol et

```bash
# PRO_043.json'ı oku, input sayısını ve warning sayısını gör
cat data/pro-tools/PRO_043.json | python3 -c "
import json,sys
t=json.load(sys.stdin)
print('Inputs:', len(t['inputs']))
print('Formulas:', len(t['formulas']))
print('Warnings:', len(t['engine_rules']['smart_warnings']))
print('Validations:', len(t['engine_rules']['validation']))
print('Standards:', t['engine_rules'].get('standards',[]))
"
```

Beklenen minimum:
- Inputs: ≥ 8
- Warnings: ≥ 3
- Validations: ≥ 2
- Standards: en az 1 ISO/ASME kodu

### 1.4 — Test geçtiyse tüm 192 araç

```bash
node scripts/rewrite-pipeline.mjs \
  --input=./pro_hesaplama_araclari_193_.txt \
  --output=./data/pro-tools
```

**Süre:** ~2-3 saat (600ms rate limit ile)
**Maliyet:** ~$6-10 (Claude Sonnet 4.6)
**Çıktı:**
- `data/pro-tools/PRO_001.json` ... `PRO_193.json`
- `data/pro-tools/_report.json` (başarı/hata raporu)
- `data/pro-tools/_merged.json` (tüm araçlar tek dosyada)

### 1.5 — Raporu kontrol et

```bash
cat data/pro-tools/_report.json | python3 -c "
import json,sys
r=json.load(sys.stdin)
print('Başarılı:', len(r['success']))
print('Hata:', len(r['failed']))
print('Kalite sorunu:', len(r['quality_failed']))
if r['failed']:
    print('Hata veren araçlar:', [f['id'] for f in r['failed']])
"
```

Hata veren araçları yeniden işle:
```bash
node scripts/rewrite-pipeline.mjs \
  --input=./pro_hesaplama_araclari_193_.txt \
  --output=./data/pro-tools \
  --only=PRO_XXX,PRO_YYY \
  --force
```

---

## ADIM 2 — NEXT.JS SAYFA KURULUMU

### 2.1 — UniversalCalculator.jsx'i yerleştir

```bash
# Zaten components/calculators/ altına koyduysan atla
# Yoksa:
mkdir -p components/calculators
cp UniversalCalculator.jsx components/calculators/
```

### 2.2 — Pro tool sayfasını düzenle

`app/[locale]/pro-tools/[toolId]/page.tsx` dosyasını aç.
**Mevcut sayfan varsa** içine şunu ekle:

```tsx
// app/[locale]/pro-tools/[toolId]/page.tsx

import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";
import UniversalCalculator from "@/components/calculators/UniversalCalculator";

const TOOLS_DIR = path.join(process.cwd(), "data", "pro-tools");

function loadTool(toolId: string) {
  const filePath = path.join(TOOLS_DIR, `${toolId}.json`);
  if (!fs.existsSync(filePath)) return null;
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch {
    return null;
  }
}

export async function generateStaticParams() {
  if (!fs.existsSync(TOOLS_DIR)) return [];
  return fs
    .readdirSync(TOOLS_DIR)
    .filter(f => f.match(/^PRO_\d+\.json$/))
    .map(f => ({ toolId: f.replace(".json", "") }));
}

export async function generateMetadata({
  params,
}: {
  params: { toolId: string; locale: string };
}) {
  const tool = loadTool(params.toolId);
  if (!tool) return {};
  return {
    title: `${tool.tool_name} | SectorCalc Pro`,
    description: `${tool.category} hesaplama aracı — ${
      tool.engine_rules?.standards?.join(", ") || "Endüstriyel standartlar"
    } referanslı.`,
  };
}

export default function ProToolPage({
  params,
}: {
  params: { toolId: string; locale: string };
}) {
  const tool = loadTool(params.toolId);
  if (!tool) notFound();

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">

      {/* Breadcrumb */}
      <nav className="text-xs text-gray-400 mb-5">
        <a href={`/${params.locale}/pro-tools`} className="text-[#BD5D3A]">
          Pro Araçlar
        </a>
        {" / "}
        <span>{tool.category}</span>
        {" / "}
        <span className="text-gray-600">{tool.tool_name}</span>
      </nav>

      {/* Standart referanslar şeridi */}
      {tool.engine_rules?.standards?.length > 0 && (
        <div className="flex gap-2 flex-wrap mb-4">
          <span className="text-[9px] font-bold tracking-widest text-gray-400 uppercase">
            Referans:
          </span>
          {tool.engine_rules.standards.map((s: string, i: number) => (
            <span
              key={i}
              className="text-[9px] font-bold font-mono px-2 py-0.5 border border-gray-300 text-gray-500"
            >
              {s}
            </span>
          ))}
        </div>
      )}

      {/* Hesaplayıcı */}
      <UniversalCalculator tool={tool} locale={params.locale} />

      {/* Footer uyarı */}
      <p className="mt-4 text-[10px] text-gray-400 leading-relaxed border-t border-gray-200 pt-3">
        Bu hesaplayıcı{" "}
        {tool.engine_rules?.standards?.join(", ") || "endüstriyel standartlar"}{" "}
        referanslıdır. Sonuçlar karar desteği amacıyla üretilmekte olup saha
        uygulamalarında yetkili mühendis onayı alınmalıdır. — SectorCalc{" "}
        {tool.tool_id}
      </p>
    </main>
  );
}
```

### 2.3 — `npm run dev` ile test et

```bash
npm run dev
```

Tarayıcıda aç: `http://localhost:3000/tr/pro-tools/PRO_043`

PRO_043 sayfası açılıyorsa kurulum doğru.

---

## ADIM 3 — MEVCUT PRO-TOOLS KATALOG SAYFASINA ENTEGRASYON

Mevcut araç listeleme sayfana (CatalogPageShell veya benzeri) araçları eklemek için:

```tsx
// app/[locale]/pro-tools/page.tsx içinde — mevcut koda ek

import fs from "fs";
import path from "path";

// Pipeline çıktısından araç listesini oku
function loadToolList() {
  const mergedPath = path.join(process.cwd(), "data", "pro-tools", "_merged.json");
  if (!fs.existsSync(mergedPath)) return [];
  try {
    return JSON.parse(fs.readFileSync(mergedPath, "utf-8"));
  } catch {
    return [];
  }
}

// Sayfa bileşeninde kullan:
const allTools = loadToolList();

const toolCards = allTools.map((tool: any) => ({
  id: tool.tool_id,
  name: tool.tool_name,
  category: tool.category,
  href: `/tr/pro-tools/${tool.tool_id}`,
  standards: tool.engine_rules?.standards || [],
  scope: tool.scope || "process_agnostic",
}));
```

---

## ADIM 4 — KREDİ SİSTEMİ ENTEGRASYONU (CreditWall)

Pro araçlara erişimi kredi sistemine bağlamak için `UniversalCalculator.jsx`'e
bir `onCalculate` callback ekle ve hesaplama öncesi kredi kontrolü yap:

```tsx
// app/[locale]/pro-tools/[toolId]/page.tsx içinde
"use client";

import { useState } from "react";
import UniversalCalculator from "@/components/calculators/UniversalCalculator";
import CreditWall from "@/components/CreditWall"; // mevcut bileşenin

export default function ProToolPage({ tool, locale }: { tool: any; locale: string }) {
  const [showPaywall, setShowPaywall] = useState(false);

  return (
    <>
      {showPaywall && <CreditWall onClose={() => setShowPaywall(false)} />}
      <UniversalCalculator
        tool={tool}
        locale={locale}
        onCalculate={async () => {
          // Kredi kontrolü — mevcut Firebase mantığın
          const hasCredits = await checkUserCredits();
          if (!hasCredits) {
            setShowPaywall(true);
            return false; // hesaplamayı durdur
          }
          await deductCredit();
          return true;
        }}
      />
    </>
  );
}
```

`UniversalCalculator.jsx` içindeki `calculate` fonksiyonuna `onCalculate` prop desteği ekle:

```jsx
// UniversalCalculator.jsx — calculate fonksiyonunda (satır ~210 civarı)
const calculate = useCallback(async () => {
  // onCalculate prop varsa önce çalıştır
  if (onCalculate) {
    const allowed = await onCalculate();
    if (!allowed) return; // kredi yoksa dur
  }
  // ... mevcut hesaplama kodu devam eder
}, [tool, inputValues, onCalculate]);
```

---

## ADIM 5 — PDF RAPOR ENTEGRASYONU

Hesaplama sonucu PDF indirme özelliği için `onResult` callback'ini kullan:

```tsx
<UniversalCalculator
  tool={tool}
  locale={locale}
  onResult={(result) => {
    // result.computed → tüm hesaplanan değerler
    // result.warnings → tetiklenen uyarılar
    // result.parsed → kullanıcı inputları
    
    // Firebase'e kaydet
    saveResultToFirebase({
      toolId: tool.tool_id,
      userId: currentUser.uid,
      inputs: result.parsed,
      outputs: result.computed,
      warnings: result.warnings,
      timestamp: Date.now(),
    });
  }}
/>
```

---

## ADIM 6 — YENİ ARAÇ EKLEME (sonraki araçlar için)

Yeni bir araç eklemek istediğinde:

### Seçenek A — Pipeline ile (önerilen)

Yeni aracın JSON'unu orijinal format ile bir dosyaya yaz, pipeline'a ver:

```bash
node scripts/rewrite-pipeline.mjs \
  --input=./yeni_arac.json \
  --output=./data/pro-tools \
  --only=PRO_200
```

### Seçenek B — Manuel JSON

`data/pro-tools/PRO_200.json` dosyasını şu şablon ile oluştur:

```json
{
  "tool_id": "PRO_200",
  "tool_name": "Araç Adı",
  "category": "Kategori",
  "scope": "single_operation",
  "primary_operation": "milling",
  "inputs": [
    {
      "id": "input_id",
      "name": "Türkçe Etiket (Sembol)",
      "unit": "mm",
      "type": "number",
      "required": true,
      "confidence_label": "KESİN",
      "absolute_min": 0.1,
      "absolute_max": 500
    }
  ],
  "formulas": [
    "Result = input_a * input_b   // [birim] | Kaynak: ISO XXXX"
  ],
  "engine_rules": {
    "standards": ["ISO XXXX"],
    "validation": {
      "min_check": {
        "absolute_min": 0.1,
        "error_msg": "Değer 0.1'den küçük olamaz."
      }
    },
    "smart_warnings": [
      {
        "condition": "Result > 100",
        "severity": "WARNING",
        "source": "ISO XXXX",
        "message": "Değer limit üzerinde. Parametre düşürün."
      }
    ]
  }
}
```

Dosyayı `data/pro-tools/` klasörüne koy. `npm run dev` → sayfa otomatik oluşur.

---

## ADIM 7 — VERCEL DEPLOY

```bash
# Build test
npm run build

# Deploy
vercel --prod
```

`generateStaticParams()` tüm PRO_XXX sayfalarını statik olarak üretir.
192 araç × ortalama 2KB = ~400KB toplam sayfa verisi. Vercel limitlerinde sorun yok.

---

## SORUN GİDERME

### "Cannot find module" hatası
```bash
# UniversalCalculator.jsx'in doğru yerde olduğunu kontrol et
ls components/calculators/UniversalCalculator.jsx
```

### "Tool not found" (404)
```bash
# JSON dosyasının mevcut olduğunu kontrol et
ls data/pro-tools/PRO_043.json
```

### Pipeline "JSON parse edilemedi" hatası
API bazen geçersiz JSON döner. `--force` ile yeniden dene:
```bash
node scripts/rewrite-pipeline.mjs \
  --input=./pro_hesaplama_araclari_193_.txt \
  --output=./data/pro-tools \
  --only=PRO_XXX \
  --force
```

### Formül hesaplanmıyor (null sonuç)
Formül sırasını kontrol et — bağımlı değişkenler önce tanımlanmalı:
```json
// YANLIŞ: Vf, n_rpm'ye bağlı ama n_rpm sonra tanımlanıyor
"formulas": ["Vf = fz * z * n_rpm", "n_rpm = ..."]

// DOĞRU:
"formulas": ["n_rpm = ...", "Vf = fz * z * n_rpm"]
```

### Uyarı tetiklenmiyor
`condition` alanındaki değişken adının formülde tanımlanan değişken adıyla
tam eşleştiğini kontrol et:
```json
// Formülde: "P_motor = Pc_net / (eta/100)"
// Warning'de: "condition": "P_motor > machine_power_kw"  ← eşleşmeli
```

---

## KALİTE GEREKSİNİMLERİ (ÖZET)

Para ödetecek kalite için her JSON'da minimum:

| Kriter | Minimum |
|---|---|
| Input sayısı | ≥ 6 |
| Formül sayısı | ≥ 4 |
| Smart warning | ≥ 3 |
| Validation kuralı | ≥ 2 |
| Standards referansı | ≥ 1 |
| confidence_label | Her inputta |
| absolute_min | Her sayısal inputta |

---

## DOSYA REFERANS TABLOSU

| Dosya | Konum | Amaç |
|---|---|---|
| `UniversalCalculator.jsx` | `components/calculators/` | Tüm 192 araç için tek React engine |
| `rewrite-pipeline.mjs` | `scripts/` | JSON üretim pipeline'ı |
| `pro-tool-page.tsx` | `app/[locale]/pro-tools/[toolId]/page.tsx` | Next.js sayfa şablonu |
| `PRO_XXX.json` | `data/pro-tools/` | Her araç için hesaplama verisi |
| `_merged.json` | `data/pro-tools/` | Tüm araçlar tek dosyada (katalog için) |
| `_report.json` | `data/pro-tools/` | Pipeline kalite raporu |

---

*SectorCalc Pro Engine — sectorcalc.com · Folkart Towers, İzmir*
