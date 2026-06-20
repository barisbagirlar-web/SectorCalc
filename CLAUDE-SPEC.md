# SECTORCALC — CLAUDE AI'DAN İSTENEN ENDÜSTRİYEL REÇETE

## Proje Bağlamı

SectorCalc, Next.js + TypeScript + Firebase projesidir.
- **Formül derleyici:** `src/lib/generated-tools/compile-formula-expression.ts` (668 satır)
- **Schema formatı:** `generated/schemas/*-schema.json` (2700+ schema dosyası)
- **Schema validasyon:** `src/lib/steelcore/schema-validator.ts` (3 katman: structural → industrial → trust)
- **Fuzz test:** `scripts/steelcore/fuzz-runtime.mjs` (10.000 iterasyon/schema, garbage injection)
- **KAV test:** `scripts/steelcore/enforce-boundaries.mjs` (sadece 1 formül: IRR)
- **SteelCore pipeline:** `scripts/steelcore/` altında shell script ve TS/JS araçlar
- **Mevcut test kütüphanesi:** vitest (fast-check kurulu değil)
- **Schema sayısı:** ~2700 adet (generated/schemas/ altında)

## Amaç

Aşağıdaki 3 yeteneği **endüstriyel sınıf (TÜV-CERTIFIABLE seviyesi)** olarak sisteme eklemek:

1. **fast-check Property-Based Testing** — domain-agnostic matematiksel özellik testleri
2. **Known-Answer Vector Regression** — her formül için referans değer doğrulama
3. **Dimensional Analysis** — formül birim kontrolü

Bu doküman, Claude AI'ın okuyup **her satırı uygulanabilir** bir implementasyon planı (reçete) üretmesi için hazırlanmıştır.

---

## KISIM 1: fast-check PROPERTY-BASED TEST SUITE

### Mevcut Durum

- `scripts/steelcore/fuzz-runtime.mjs` — 16 farklı garbage değer (null, NaN, Infinity, string) ile 10.000 iterasyon
- Feature: Formül crash olmuyor, NaN dönmüyor → PASS
- **Eksik:** Matematiksel özellikler test edilmiyor (monotoniklik, lineerite, simetri, kimlik)

### Gereksinimler

#### R1.1: fast-check Kurulumu
- `npm install fast-check --save-dev`
- fast-check zaten `devDependencies`'de var (mevcut), kullanıma hazır
- TypeScript uyumluluğu kontrol edilmeli

#### R1.2: Property Test Motoru — Dosya: `src/lib/mathematical-property-tester.ts`

Bu modül, **domain-agnostic** matematiksel özellikleri herhangi bir formül üzerinde test eder. Formülün ne yaptığını bilmesi gerekmez. Sadece input-output ilişkisini inceler.

**Test edilecek domain-agnostic property'ler:**

```
1. FINITE_OUTPUT:   ∀ inputs ∈ validRange: isFinite(formula(inputs))
   → Herhangi bir geçerli input için output NaN/Infinity olmamalı

2. NULL_INPUT_ZERO:  ∀ input: formula({...inputs, key: null}) crash olmamalı
   → Tek bir input null olsa bile formül crash vermemeli

3. EXTREME_VALUE_STABILITY:  ∀ inputs ∈ extremes(formula(inputs)): |result| < 1e15
   → Input ekstrem değerlerde bile output makul sınırlarda kalmalı

4. INPUT_PERMUTATION_STABILITY:  input sırası değişince output aynı kalmalı
   → Formül giriş sırasından bağımsız olmalı (commutative property check)

5. SCALE_INVARIANCE (unit conversion check):
   Bir input 1000 ile çarpılıp başka bir input 1000'e bölünürse, output değişmemeli
   → Birim dönüşümüne karşı dayanıklılık

6. ZERO_IDENTITY:
   Tüm numerik inputlar 0 iken output 0 olmalı (formülün doğası gereği geçerliyse)
   → Sıfır noktası kontrolü

7. BOUNDARY_ADHERENCE:
   input min/max değerlerinde output hala isFinite ve makul
   → Sınır değerlerde kararlılık
```

**IMPORTANT DESIGN CONSTRAINT:**
- Formülün hangi input'larının hangi output'larla pozitif/negatif korele olduğunu BİLMİYORUZ
- Bu nedenle monotoniklik gibi domain-specific testler property tester'a dahil edilmez
- Monotoniklik testleri KISIM 2 (KAV) içinde elle tanımlanır
- Property tester SADECE yukarıdaki 7 domain-agnostic testi yapar

**API Design:**

```typescript
// src/lib/mathematical-property-tester.ts

export interface PropertyTestResult {
  propertyName: string;
  passed: boolean;
  iterations: number;
  failures: number;
  counterexample?: unknown;
  detail?: string;
}

export function testFormulaProperties(
  compiledExpression: string,
  inputIds: string[],
  inputRanges: Record<string, { min: number; max: number; type: string }>,
  options?: { iterations?: number; seed?: number }
): PropertyTestResult[]
```

#### R1.3: Test Çalıştırıcı — Dosya: `scripts/audit/audit-property-tests.mjs`

Bu script:
  1. `generated/schemas/` altındaki TÜM schema'ları dolaşır
  2. Her schema için formülleri derler (`compileFormulaExpression`)
  3. Her formula için R1.2'deki 7 property testini çalıştırır
  4. Rapor üretir: hangi schema/formül/property başarısız

**Output:** JSON rapor (`scripts/.cache/property-test-report.json`)
**Exit code:** 1 eğer herhangi bir property testi başarısız olursa

#### R1.4: npm Script — `package.json`

```json
"audit:property-tests": "node scripts/audit/audit-property-tests.mjs"
```

#### R1.5: Pipeline Entegrasyonu

`scripts/steelcore/run-industrial-pipeline.sh` içinde Stage 5'e (Boundary/Fuzz) eklenmeli:
```bash
echo "  [5.x] Property-based tests (fast-check)..."
npm run audit:property-tests || fail "${STAGE}.x" "Property tests failed. Mathematical invariants violated."
```

---

## KISIM 2: KNOWN-ANSWER VECTOR (KAV) REGRESSION SYSTEM

### Mevcut Durum

- `scripts/steelcore/enforce-boundaries.mjs` — sadece IRR testi (1 formül)
- Schema'larda hiçbir formül için referans değer yok
- Regression testi yok: bir formül değişince eski doğru sonucun hala doğru olduğu garantilenemiyor

### Temel Tasarım Kararı: Referans Değerlerinin Kaynağı

**SORUN:** Referans değerlerini AI üretirse döngüsel mantık hatası oluşur.
**ÇÖZÜM:** İki aşamalı:
  - **Aşama 1 (framework):** KAV altyapısı + boş registry
  - **Aşama 2 (domain expert):** Referans değerlerinin elle girilmesi

Claude'dan istenen SADECE Aşama 1'dir. Aşama 2 kullanıcıya bırakılır.

### Gereksinimler

#### R2.1: KAV Registry Formatı — Dosya: `generated/known-answer-vectors.json`

```json
{
  "version": "1.0",
  "generatedAt": "2026-06-20T...",
  "entries": [
    {
      "slug": "irr-calculator",
      "formulaKey": "irr_result",
      "inputs": {
        "cash_flows": "[-1000, 300, 400, 500, 500, 400]",
        "guess": "0.1"
      },
      "expected": 0.29,
      "tolerance": 0.001,
      "description": "Standard IRR test vector: 5-year project with 1000 initial investment",
      "source": "expert",            // "expert" | "generated" | "verified"
      "addedBy": "domain-expert",    // who provided this value
      "addedAt": "2026-06-20"
    }
  ]
}
```

**Kritik Tasarım Noktası:**
- `slug` + `formulaKey` ile unique key oluşturulur
- `tolerance` her entry için ayrı belirtilir (±0.001, ±1, ±%5 gibi)
- `source` alanı referansın güven seviyesini belirtir
  - `"generated"`: AI tarafından otomatik oluşturuldu (güvenilmez, sadece regression için)
  - `"expert"`: Domain uzmanı tarafından girildi (güvenilir, pipeline blocker)
  - `"verified"`: Expert tarafından doğrulandı (en güvenilir)

#### R2.2: KAV Generator (AI-assisted, low trust) — Dosya: `scripts/steelcore/generate-kav.mjs`

Bu script:
  1. Tüm schema'ları dolaşır
  2. Her formül için **default input değerlerini** kullanarak formülü çalıştırır
  3. Sonucu `source: "generated"` olarak KAV registry'e ekler
  4. AI'ın domain bilgisi gerektiren yorum yapmasına izin VERİLMEZ

**Kullanım:** `node scripts/steelcore/generate-kav.mjs [--slug=irr-calculator]`
**Output:** Güncellenmiş `generated/known-answer-vectors.json`

**Uyarı:** Bu script'in ürettiği değerler `source: "generated"` etiketi alır ve pipeline'da BLOCKER değildir. Sadece regression referansı olarak kullanılır.

#### R2.3: KAV Validator — Dosya: `scripts/steelcore/validate-kav.mjs`

Bu script:
  1. `generated/known-answer-vectors.json` dosyasını okur
  2. Her entry için formülü çalıştırır, sonucu `expected ± tolerance` ile karşılaştırır
  3. `source: "expert"` veya `"verified"` olan entry'lerde hata varsa → FAIL (exit 1)
  4. `source: "generated"` olan entry'lerde hata varsa → WARN (exit 0, rapora yaz)

**Output:** JSON rapor (`generated/kav-validation-report.json`)
**Exit code:** Expert/verified entry'lerde hata varsa 1

```typescript
// KAV Validator Result
interface KAVReport {
  timestamp: string;
  totalEntries: number;
  passed: number;
  failedExpert: number;   // expert/verified başarısız → CRITICAL
  failedGenerated: number;  // generated başarısız → WARN
  untestedSlugs: string[];  // KAV'si olmayan schema'lar
  entries: Array<{
    slug: string;
    formulaKey: string;
    expected: number;
    actual: number;
    tolerance: number;
    passed: boolean;
    source: string;
  }>;
}
```

#### R2.4: npm Scripts — `package.json`

```json
"steelcore:generate-kav": "node scripts/steelcore/generate-kav.mjs",
"steelcore:validate-kav": "node scripts/steelcore/validate-kav.mjs"
```

#### R2.5: Pipeline Entegrasyonu

```
Stage 3 (Schema Lock) sonrası:
  npm run steelcore:generate-kav     # KAV referanslarını güncelle (source: generated)

Stage 5 (Boundary/Fuzz) içinde:
  npm run steelcore:validate-kav     # Tüm KAV'ları doğrula
  npm run steelcore:enforce-boundaries  # (mevcut)
```

#### R2.6: Mevcut enforce-boundaries.mjs Güncellemesi

`scripts/steelcore/enforce-boundaries.mjs` dosyası:
  - Mevcut haliyle KALIR (IRR testi)
  - Yeni KAV sistemi ile **çiftleşmez** — ikisi bağımsız çalışır
  - İleride KAV sistemi olgunlaşınca enforce-boundaries KAV içine merge edilebilir

---

## KISIM 3: DIMENSIONAL ANALYSIS

### Mevcut Durum

- Schema'larda `input.unit` alanı string olarak var (örn: "USD", "m", "kg", "%", "years")
- `outputs.unit` alanı da string
- Derleyici (`compileFormulaExpression`) birimler hakkında HİÇBİR ŞEY bilmiyor
- `"metre + saniye"` gibi anlamsız işlemler tespit edilemez

### Temel Tasarım

**3 katmanlı dimension sistemi:**

```
Katman 1: Dimension Registry — SI temel boyutlar + özel sektör boyutları
Katman 2: Schema Annotation — her input/output'a dimension vektörü
Katman 3: Runtime Dimension Checker — derleme anında dimension uyumluluğu
```

### Gereksinimler

#### R3.1: Dimension Types — Dosya: `src/lib/formula-governance/dimension/types.ts`

```typescript
// SI Temel Boyutlar + Finans + Sektör
export type DimensionVector = {
  length: number;      // L (metre)
  mass: number;        // M (kg)
  time: number;        // T (saniye)
  electricCurrent: number; // I (amper)
  temperature: number; // Θ (kelvin)
  amountOfSubstance: number; // N (mol)
  luminousIntensity: number; // J (candela)
  currency: number;    // ₺ (TL/USD/EUR) — finansal boyut
  count: number;       // adet/person/machine — sayılabilir
};

// Özel boyutlar (opsiyonel)
export interface SectorDimension extends DimensionVector {
  // Sektöre özel:
  energy?: number;     // E (kWh, J)
  pressure?: number;   // P (Pa, bar)
  angle?: number;      // rad, derece
  data?: number;       // GB, MB
}

// Önceden tanımlı boyutlar
export const DIMENSIONLESS: DimensionVector = {
  length: 0, mass: 0, time: 0, electricCurrent: 0,
  temperature: 0, amountOfSubstance: 0, luminousIntensity: 0,
  currency: 0, count: 0,
};

export const LENGTH: DimensionVector = { ...DIMENSIONLESS, length: 1 };
export const MASS: DimensionVector = { ...DIMENSIONLESS, mass: 1 };
export const TIME: DimensionVector = { ...DIMENSIONLESS, time: 1 };
export const CURRENCY: DimensionVector = { ...DIMENSIONLESS, currency: 1 };
export const VELOCITY: DimensionVector = { ...DIMENSIONLESS, length: 1, time: -1 };
export const ACCELERATION: DimensionVector = { ...DIMENSIONLESS, length: 1, time: -2 };
export const FORCE: DimensionVector = { ...DIMENSIONLESS, length: 1, mass: 1, time: -2 };
export const ENERGY: DimensionVector = { ...DIMENSIONLESS, length: 2, mass: 1, time: -2 };
export const POWER: DimensionVector = { ...DIMENSIONLESS, length: 2, mass: 1, time: -3 };
export const FREQUENCY: DimensionVector = { ...DIMENSIONLESS, time: -1 };
export const AREA: DimensionVector = { ...DIMENSIONLESS, length: 2 };
export const VOLUME: DimensionVector = { ...DIMENSIONLESS, length: 3 };
export const DENSITY: DimensionVector = { ...DIMENSIONLESS, mass: 1, length: -3 };
export const PRESSURE: DimensionVector = { ...DIMENSIONLESS, length: -1, mass: 1, time: -2 };
```

#### R3.2: Unit-to-Dimension Mapping — Dosya: `src/lib/formula-governance/dimension/unit-map.ts`

```typescript
// String unit → DimensionVector eşlemesi
// Schema'larda input.unit olarak geçen string'leri boyut vektörüne çevirir

export const UNIT_DIMENSION_MAP: Record<string, DimensionVector> = {
  // Uzunluk
  "m": { ...DIMENSIONLESS, length: 1 },
  "meter": { ...DIMENSIONLESS, length: 1 },
  "meters": { ...DIMENSIONLESS, length: 1 },
  "metre": { ...DIMENSIONLESS, length: 1 },
  "metres": { ...DIMENSIONLESS, length: 1 },
  "km": { ...DIMENSIONLESS, length: 1 },
  "cm": { ...DIMENSIONLESS, length: 1 },
  "mm": { ...DIMENSIONLESS, length: 1 },
  "inch": { ...DIMENSIONLESS, length: 1 },
  "inches": { ...DIMENSIONLESS, length: 1 },
  "ft": { ...DIMENSIONLESS, length: 1 },
  "feet": { ...DIMENSIONLESS, length: 1 },
  "foot": { ...DIMENSIONLESS, length: 1 },
  "yard": { ...DIMENSIONLESS, length: 1 },
  "yards": { ...DIMENSIONLESS, length: 1 },
  "mile": { ...DIMENSIONLESS, length: 1 },
  "miles": { ...DIMENSIONLESS, length: 1 },

  // Alan
  "m2": { ...DIMENSIONLESS, length: 2 },
  "m²": { ...DIMENSIONLESS, length: 2 },
  "sqm": { ...DIMENSIONLESS, length: 2 },
  "sq.m": { ...DIMENSIONLESS, length: 2 },
  "ft2": { ...DIMENSIONLESS, length: 2 },
  "sqft": { ...DIMENSIONLESS, length: 2 },

  // Hacim
  "m3": { ...DIMENSIONLESS, length: 3 },
  "m³": { ...DIMENSIONLESS, length: 3 },
  "liter": { ...DIMENSIONLESS, length: 3 },
  "liters": { ...DIMENSIONLESS, length: 3 },
  "litre": { ...DIMENSIONLESS, length: 3 },
  "L": { ...DIMENSIONLESS, length: 3 },
  "gallon": { ...DIMENSIONLESS, length: 3 },
  "gal": { ...DIMENSIONLESS, length: 3 },

  // Kütle
  "kg": { ...DIMENSIONLESS, mass: 1 },
  "g": { ...DIMENSIONLESS, mass: 1 },
  "gram": { ...DIMENSIONLESS, mass: 1 },
  "grams": { ...DIMENSIONLESS, mass: 1 },
  "ton": { ...DIMENSIONLESS, mass: 1 },
  "tonne": { ...DIMENSIONLESS, mass: 1 },
  "lb": { ...DIMENSIONLESS, mass: 1 },
  "lbs": { ...DIMENSIONLESS, mass: 1 },
  "pound": { ...DIMENSIONLESS, mass: 1 },
  "oz": { ...DIMENSIONLESS, mass: 1 },

  // Zaman
  "s": { ...DIMENSIONLESS, time: 1 },
  "sec": { ...DIMENSIONLESS, time: 1 },
  "second": { ...DIMENSIONLESS, time: 1 },
  "seconds": { ...DIMENSIONLESS, time: 1 },
  "min": { ...DIMENSIONLESS, time: 1 },
  "minute": { ...DIMENSIONLESS, time: 1 },
  "minutes": { ...DIMENSIONLESS, time: 1 },
  "hr": { ...DIMENSIONLESS, time: 1 },
  "hour": { ...DIMENSIONLESS, time: 1 },
  "hours": { ...DIMENSIONLESS, time: 1 },
  "day": { ...DIMENSIONLESS, time: 1 },
  "days": { ...DIMENSIONLESS, time: 1 },
  "week": { ...DIMENSIONLESS, time: 1 },
  "weeks": { ...DIMENSIONLESS, time: 1 },
  "month": { ...DIMENSIONLESS, time: 1 },
  "months": { ...DIMENSIONLESS, time: 1 },
  "year": { ...DIMENSIONLESS, time: 1 },
  "years": { ...DIMENSIONLESS, time: 1 },

  // Para
  "USD": { ...DIMENSIONLESS, currency: 1 },
  "EUR": { ...DIMENSIONLESS, currency: 1 },
  "TRY": { ...DIMENSIONLESS, currency: 1 },
  "TL": { ...DIMENSIONLESS, currency: 1 },
  "$": { ...DIMENSIONLESS, currency: 1 },
  "€": { ...DIMENSIONLESS, currency: 1 },
  "£": { ...DIMENSIONLESS, currency: 1 },
  "currency": { ...DIMENSIONLESS, currency: 1 },

  // Hız
  "m/s": { ...DIMENSIONLESS, length: 1, time: -1 },
  "km/h": { ...DIMENSIONLESS, length: 1, time: -1 },
  "mph": { ...DIMENSIONLESS, length: 1, time: -1 },
  "knot": { ...DIMENSIONLESS, length: 1, time: -1 },
  "knots": { ...DIMENSIONLESS, length: 1, time: -1 },

  // Sıcaklık
  "K": { ...DIMENSIONLESS, temperature: 1 },
  "C": { ...DIMENSIONLESS, temperature: 1 },
  "°C": { ...DIMENSIONLESS, temperature: 1 },
  "F": { ...DIMENSIONLESS, temperature: 1 },
  "°F": { ...DIMENSIONLESS, temperature: 1 },

  // Güç
  "W": { ...DIMENSIONLESS, length: 2, mass: 1, time: -3 },
  "kW": { ...DIMENSIONLESS, length: 2, mass: 1, time: -3 },
  "MW": { ...DIMENSIONLESS, length: 2, mass: 1, time: -3 },
  "hp": { ...DIMENSIONLESS, length: 2, mass: 1, time: -3 },

  // Enerji
  "J": { ...DIMENSIONLESS, length: 2, mass: 1, time: -2 },
  "kJ": { ...DIMENSIONLESS, length: 2, mass: 1, time: -2 },
  "kWh": { ...DIMENSIONLESS, length: 2, mass: 1, time: -2 },
  "cal": { ...DIMENSIONLESS, length: 2, mass: 1, time: -2 },
  "BTU": { ...DIMENSIONLESS, length: 2, mass: 1, time: -2 },

  // Basınç
  "Pa": { ...DIMENSIONLESS, length: -1, mass: 1, time: -2 },
  "kPa": { ...DIMENSIONLESS, length: -1, mass: 1, time: -2 },
  "bar": { ...DIMENSIONLESS, length: -1, mass: 1, time: -2 },
  "psi": { ...DIMENSIONLESS, length: -1, mass: 1, time: -2 },
  "atm": { ...DIMENSIONLESS, length: -1, mass: 1, time: -2 },

  // Açı
  "rad": { ...DIMENSIONLESS, angle: 1 },
  "degree": { ...DIMENSIONLESS, angle: 1 },
  "degrees": { ...DIMENSIONLESS, angle: 1 },
  "°": { ...DIMENSIONLESS, angle: 1 },

  // Sayısal / Birimsiz
  "unit": { ...DIMENSIONLESS },
  "units": { ...DIMENSIONLESS },
  "count": { ...DIMENSIONLESS },
  "ea": { ...DIMENSIONLESS },
  "each": { ...DIMENSIONLESS },
  "pcs": { ...DIMENSIONLESS },
  "pieces": { ...DIMENSIONLESS },
  "workers": { ...DIMENSIONLESS, count: 1 },
  "employees": { ...DIMENSIONLESS, count: 1 },
  "people": { ...DIMENSIONLESS, count: 1 },
  "person": { ...DIMENSIONLESS, count: 1 },
  "machines": { ...DIMENSIONLESS, count: 1 },

  // Yüzde
  "%": { ...DIMENSIONLESS },
  "percent": { ...DIMENSIONLESS },

  // Frekans
  "Hz": { ...DIMENSIONLESS, time: -1 },

  // Diğer
  "dB": { ...DIMENSIONLESS },
  "ppm": { ...DIMENSIONLESS },
  "ratio": { ...DIMENSIONLESS },

  // Veri
  "bit": { ...DIMENSIONLESS, data: 1 },
  "byte": { ...DIMENSIONLESS, data: 1 },
  "KB": { ...DIMENSIONLESS, data: 1 },
  "MB": { ...DIMENSIONLESS, data: 1 },
  "GB": { ...DIMENSIONLESS, data: 1 },
  "TB": { ...DIMENSIONLESS, data: 1 },

  // Yakıt verimliliği
  "L/100km": { ...DIMENSIONLESS, length: -1, volume: 1 },
  "mpg": { ...DIMENSIONLESS, length: -1, volume: 1 },

  // Yoğunluk
  "kg/m3": { ...DIMENSIONLESS, mass: 1, length: -3 },
  "g/cm3": { ...DIMENSIONLESS, mass: 1, length: -3 },
};

// Free text aliases (for schema birimlerindeki serbest metinler)
export const UNIT_ALIAS_MAP: Record<string, string> = {
  "meters": "m",
  "metres": "m",
  "metre": "m",
  "kilograms": "kg",
  "kilogram": "kg",
  "centimeters": "cm",
  "centimeter": "cm",
  "millimeters": "mm",
  "millimeter": "mm",
  "kilometers": "km",
  "kilometer": "km",
  "kilograms per cubic meter": "kg/m3",
  "kilogram per cubic meter": "kg/m3",
  "newton": "N",
  "newtons": "N",
  "pascal": "Pa",
  "pascals": "Pa",
  "watt": "W",
  "watts": "W",
  "joule": "J",
  "joules": "J",
  "hour": "hours",
  "minute": "minutes",
  "second": "seconds",
  "year": "years",
  "month": "months",
  "week": "weeks",
  "day": "days",
  "dollar": "USD",
  "dollars": "USD",
  "euro": "EUR",
  "euros": "EUR",
  "turkish lira": "TRY",
  "tl": "TRY",
  "lira": "TRY",
};
```

#### R3.3: Dimension Operations — Dosya: `src/lib/formula-governance/dimension/operations.ts`

```typescript
// Boyut vektörleri üzerinde matematiksel işlemler

export function multiplyDimensions(a: DimensionVector, b: DimensionVector): DimensionVector
// Çarpma: boyutlar toplanır
// Örn: length(1) * length(1) = length(2) [alan]

export function divideDimensions(a: DimensionVector, b: DimensionVector): DimensionVector
// Bölme: boyutlar çıkarılır
// Örn: length(1) / time(1) = length(1), time(-1) [hız]

export function addDimensions(a: DimensionVector, b: DimensionVector): DimensionVector | null
// Toplama: BOYUTLAR AYNI OLMALI, yoksa null
// Örn: length(1) + length(1) = length(1) [geçerli]
//      length(1) + time(1) = null [HATA — metre + saniye]
//      currency(1) + currency(1) = currency(1) [geçerli — TL + TL]
//      dimensionless + dimensionless = dimensionless [geçerli — sayı + sayı]

export function powDimension(dim: DimensionVector, exponent: number): DimensionVector
// Üs alma: boyutlar exponent ile çarpılır
// Örn: length(1)^2 = length(2) [alan]
//      length(1)^0.5 = length(0.5) [karekök]
//      length(1)^0 = dimensionless [birimsiz]

export function dimensionsEqual(a: DimensionVector, b: DimensionVector, tolerance?: number): boolean
// İki boyut vektörü eşit mi?

export function dimensionToString(dim: DimensionVector): string
// Okunabilir format: "L^2 M^0 T^-2"
```

#### R3.4: Schema Dimension Extractor — Dosya: `src/lib/formula-governance/dimension/schema-dimension-extractor.ts`

Bu modül:
  1. `generated/schemas/*-schema.json` dosyasını okur (veya singleton olarak gelen schema objesi)
  2. Her input için `input.unit` string'ini UNIT_DIMENSION_MAP'ten boyut vektörüne çevirir
  3. Tanınmayan unit'ler için WARN log'lanır, DIMENSIONLESS kabul edilir
  4. Output için de aynı işlem yapılır

```typescript
export interface SchemaDimensionMap {
  slug: string;
  inputs: Record<string, { unit: string; dimension: DimensionVector }>;
  outputs: Record<string, { unit: string; dimension: DimensionVector }>;
  unresolved: string[];  // tanınmayan unit'ler
}

export function extractSchemaDimensions(schema: Record<string, unknown>): SchemaDimensionMap
export function extractAllSchemaDimensions(): SchemaDimensionMap[]
```

#### R3.5: Formula Compiler Dimension Integration — `compile-formula-expression.ts`

**Bu en kritik kısım.** Mevcut `compileFormulaExpression` fonksiyonu şu şekilde değiştirilmeli:

**Mevcut:** string expression gir → AST validate → safety check → string expression çık
**Yeni:** string expression gir → AST validate → safety check → **DIMENSION CHECK** → string expression çık

**Dimension Check Pipeline (compileFormulaExpression sonunda, return öncesi):**

```
1. expression'i parse et (jsep ile)
2. AST'deki her düğümü dolaş:
   - BinaryExpression (+ - * /): operand'ların boyutlarını kontrol et
     - + ve -: operand boyutları eşit olmalı
     - * : boyutlar çarpılır
     - / : boyutlar bölünür
   - CallExpression (Math.sqrt, Math.pow vb.): 
     - Math.sqrt: argüman dimensionless olmalı veya dim^0.5 hesaplanmalı
     - Math.pow: taban boyutu^üs şeklinde
   - Identifier: input veya formula referansı → dimension map'ten al
3. Çıktı boyutu hesapla:
   - Expression'in top-level boyutu = output boyutu
   - outputs.primary ile karşılaştır: uyuşmazlık varsa WARN
4. Sonuç:
   - BOYUT UYUŞMAZLIĞI (dimensionError): compile NULL döner, hata mesajı
   - BOYUT UYUYOR: expression aynen döner
   - UYARI (dimensionMismatch): expression döner, ama WARN log'lanır
```

**API Değişikliği:**

```typescript
// compileFormulaExpression'a dimensionMap parametresi eklenir
export function compileFormulaExpression(
  rawExpression: string,
  options: {
    readonly inputIds: readonly string[];
    readonly inputToAccess: (inputId: string) => string;
    readonly formulaKeys: readonly string[];
    readonly selfKey?: string;
    readonly failureAccumulator?: FormulaFailureAccumulator;
    readonly schemaSlugForLog?: string;
    readonly dimensionMap?: Record<string, DimensionVector>;  // YENİ
  },
): string | null
```

#### R3.6: Dimension Audit Script — Dosya: `scripts/audit/audit-dimensions.mjs`

Bu script:
  1. Tüm schema'ları dolaşır
  2. Her formula `compileFormulaExpression` ile dimension check yaparak dener
  3. Tanınmayan unit'leri raporlar
  4. Dimension uyuşmazlığı olan formülleri raporlar

```bash
node scripts/audit/audit-dimensions.mjs
# Output: scripts/.cache/dimension-audit-report.json
# Exit 1 if dimension errors found
```

**Rapor Formatı:**

```json
{
  "timestamp": "2026-06-20T...",
  "totalSchemas": 2700,
  "dimensionErrors": 5,
  "dimensionWarnings": 23,
  "unresolvedUnits": ["furlong", "stone", "slug"],
  "errors": [
    { "slug": "roi-npv-calculator", "formulaKey": "result",
      "message": "Cannot add currency(initial_investment) + dimensionless(discount_rate): dimension mismatch",
      "dimensions": { "left": { "currency": 1 }, "right": {} }
    }
  ],
  "warnings": [
    { "slug": "pythagorean-theorem-calculator", "formulaKey": "hypotenuse",
      "message": "Output dimension L^1 does not match expected L^1 (OK: matched)"
    }
  ]
}
```

#### R3.7: npm Scripts — `package.json`

```json
"audit:dimensions": "node scripts/audit/audit-dimensions.mjs"
```

#### R3.8: Pipeline Entegrasyonu

```
Stage 3 (Schema Lock) içinde:
  npm run audit:dimensions     # Dimension uyumluluğu kontrolü
```

Dimension testi **WARN seviyesinde** başlamalı, zamanla FAIL seviyesine yükseltilmeli.

---

## GENEL ENTEGRASYON ŞEMASI

### Pipeline Sırası (Güncellenmiş Siemens Modeli)

```
STAGE 1: Code Quality (Lint/TSC)
STAGE 2: Security & Privacy (OWASP/KVKK)
STAGE 3: Schema Lock + Dimensions + i18n
  ├── steelcore:validate:industrial
  ├── audit:dimensions                  ← YENİ
  └── i18n:check

STAGE 4: Generate (Factory)
  ├── generate:all
  ├── quarantine-snapshot
  └── steelcore:generate-kav           ← YENİ

STAGE 5: Boundary/Fuzz/Property
  ├── audit:formula-compile
  ├── steelcore:enforce-boundaries
  ├── steelcore:fuzz
  ├── steelcore:ci-gate:enforce
  ├── audit:property-tests             ← YENİ (fast-check)
  └── steelcore:validate-kav           ← YENİ

STAGE 6: Build
STAGE 7: Smoke/Performance/A11y
STAGE 8: Data Integrity
STAGE 9: Release Gate
```

### Yeni Script Özeti

| Script | Tip | Exit 1 koşulu |
|--------|-----|---------------|
| `audit:property-tests` | YENİ | Herhangi bir property testi başarısız |
| `steelcore:generate-kav` | YENİ | Asla exit 1 (sadece veri üretir) |
| `steelcore:validate-kav` | YENİ | Expert/verified KAV başarısız |
| `audit:dimensions` | YENİ | Dimension error var |

### Değişen Mevcut Dosyalar

| Dosya | Değişiklik |
|-------|-----------|
| `src/lib/generated-tools/compile-formula-expression.ts` | dimensionMap parametresi + dimension check |
| `scripts/steelcore/run-industrial-pipeline.sh` | Yeni stage'ler eklenecek |
| `package.json` | Yeni script tanımları |

---

## IMPLEMENTASYON SIRASI (Claude'dan bu sırayı önermesi beklenir)

1. **fast-check property tester** (en kolay, bağımsız, hemen çalışır)
2. **Dimension types + operations + unit-map** (bağımsız modül)
3. **compile-formula-expression dimension entegrasyonu** (en kritik, mevcut kodu değiştirir)
4. **KAV generator + validator** (schema'lar tamamlandıktan sonra)
5. **Script'ler ve pipeline entegrasyonu** (en son)

---

## TEST KRİTERLERİ

Claude'un önereceği implementasyon şu testleri geçmelidir:

1. `node --check scripts/audit/audit-property-tests.mjs` → OK
2. `node --check scripts/steelcore/generate-kav.mjs` → OK
3. `node --check scripts/steelcore/validate-kav.mjs` → OK
4. `node --check scripts/audit/audit-dimensions.mjs` → OK
5. `npx tsc --noEmit` → yeni kod için hata yok
6. `npm run lint` → yeni kod için hata/uyarı yok
7. `bash -n scripts/steelcore/run-industrial-pipeline.sh` → OK
8. Tüm npm script'ler tanımlı ve çalışıyor

**Test edilecek matematiksel senaryolar:**

```typescript
// Bu testler Claude'un önereceği kodla ÇALIŞMALIDIR:

// Property test:
// - legA=3, legB=4 için hypotenuse ≈ 5 (Pisagor teoremi)
// - Tüm inputlar 0 iken output 0
// - Input NaN iken output NaN değil (hata mesajı veya 0)

// Dimension test:
// - Uzunluk + Uzunluk = Uzunluk (✓)
// - Uzunluk + Zaman = HATA (✗)
// - Hız × Zaman = Uzunluk (✓)
// - Para / Adet = Para/Adet (✓)

// KAV test:
// - Kayıtlı referans değerleri ± tolerance içinde
// - Kayıtlı referans yoksa WARN (FAIL değil)
```

---

## KISITLAMALAR (Claude'un BİLMESİ GEREKENLER)

1. **Mevcut kodu kırma:** `compileFormulaExpression`'a dimension parametresi EKLENİR, mevcut çağrılar değişmez.
2. **Domain-specific yok:** Property testler domain-agnostic olmalı. Monotoniklik testi KAV içinde elle tanımlanır.
3. **Yavaşlık:** Property test 2700 schema için dakikalarca sürebilir. `--quick` (100 iterasyon) ve `--full` (10000 iterasyon) modları olmalı.
4. **Schema formatı değişmez:** Schema'lara yeni alan eklenmez. Mevcut `input.unit` ve `outputs.unit` kullanılır.
5. **fast-check:** Zaten `devDependencies`'de. Versiyon: `^4.8.0`.
6. **Modülerlik:** Her yeni modül kendi dosyasında, `src/lib/formula-governance/dimension/` altında.

---

**İSTENEN ÇIKTI:**

Claude AI'dan şu formatta bir reçete (recipe) beklenmektedir:

1. **Değişecek dosya listesi** (tam yol)
2. **Her dosya için diff** (hangi satırlar eklenecek/silinecek)
3. **Yeni dosyalar** (tam içerik)
4. **npm script tanımları**
5. **Pipeline güncellemesi**
6. **Test komutları** (çalıştırma sırası)
7. **Risk değerlendirmesi** (hangi adım riskli, rollback planı)

Her satırı kopyalanıp doğrudan uygulanabilir olmalıdır. "Bu kısmı sen implement et" gibi muğlak ifadeler kabul edilmez.
