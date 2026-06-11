#!/usr/bin/env node
/**
 * FAZ 7 — generates roadmap free batch-2 catalog, calculators, i18n (remaining planned tools).
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");
const BATCH_SIZE = 80;

const MISSING = [
  "Sector-specific risk factors",
  "Margin leak diagnosis",
  "Accept / caution / reject guidance",
  "Export and report history",
];

const CATEGORY_MAP = {
  "basic-converters-math": "conversion",
  "construction-workshop-infrastructure": "construction-measurement",
  "electrical-energy-mechanical": "energy-carbon",
  "finance-accounting-hr": "finance-business",
  "manufacturing-material-inventory": "manufacturing-workshop",
  "logistics-vehicle-shipping": "logistics-travel",
};

const I18N_DESC = {
  tr: (title) => `${title} — tarayıcıda anında sonuç (bilgilendirme amaçlı).`,
  de: (title) => `${title} — sofortige Browser-Ergebnisse (nur zur Information).`,
  fr: (title) => `${title} — résultats instantanés dans le navigateur (informatif).`,
  es: (title) => `${title} — resultados instantáneos en el navegador (informativo).`,
  ar: (title) => `${title} — نتائج فورية في المتصفح (للإرشاد فقط).`,
};

function extractConstArray(tsPath, constName) {
  const text = readFileSync(join(ROOT, tsPath), "utf8");
  const marker = `export const ${constName}`;
  const start = text.indexOf(marker);
  const eq = text.indexOf("=", start);
  const open = text.indexOf("[", eq);
  let depth = 0;
  for (let i = open; i < text.length; i++) {
    if (text[i] === "[") depth += 1;
    if (text[i] === "]") {
      depth -= 1;
      if (depth === 0) return JSON.parse(text.slice(open, i + 1));
    }
  }
  throw new Error(`Unterminated array for ${constName}`);
}

function nInput(key, label, unit, helper, extra = {}) {
  return { key, label, unit, type: "number", helper, min: 0.01, ...extra };
}

function multiplyTool(keys, labels, helpers, headline, primaryLabel, format, explanation, resultType = "quantity") {
  return {
    resultType,
    inputs: keys.map((key, idx) => nInput(key, labels[idx], "value", helpers[idx])),
    formula: { kind: "multiply", headline, primaryLabel, keys, format, explanation },
  };
}

function multiplyToolDef({
  keys,
  labels,
  helpers,
  defaults = {},
  headline,
  primaryLabel,
  format,
  explanation,
  resultType = "quantity",
}) {
  return {
    resultType,
    inputs: keys.map((key, idx) =>
      nInput(key, labels[idx], "value", helpers[idx], defaults[key] !== undefined ? { defaultValue: defaults[key] } : {}),
    ),
    formula: { kind: "multiply", headline, primaryLabel, keys, format, explanation },
  };
}

function divideTool(numKey, numLabel, denKey, denLabel, headline, primaryLabel, format, explanation, resultType = "quantity") {
  return {
    resultType,
    inputs: [
      nInput(numKey, numLabel, "value", `${numLabel} for calculation`),
      nInput(denKey, denLabel, "value", `${denLabel} for calculation`),
    ],
    formula: {
      kind: "divide",
      headline,
      primaryLabel,
      numerator: numKey,
      denominator: denKey,
      format,
      explanation,
    },
  };
}

function subtractTool(aKey, aLabel, bKey, bLabel, headline, primaryLabel, explanation) {
  return {
    resultType: "cost",
    inputs: [
      nInput(aKey, aLabel, "USD", `${aLabel} for comparison`),
      nInput(bKey, bLabel, "USD", `${bLabel} for comparison`),
    ],
    formula: {
      kind: "subtract",
      headline,
      primaryLabel,
      aKey,
      bKey,
      format: "currency",
      explanation,
    },
  };
}

function identityTool(key, label, headline, primaryLabel, explanation, resultType = "quantity") {
  return {
    resultType,
    inputs: [nInput(key, label, "value", label)],
    formula: {
      kind: "identity",
      headline,
      primaryLabel,
      key,
      format: "number",
      explanation,
    },
  };
}

function screeningMultiply(enTitle, resultType = "quantity", format = "number") {
  return multiplyTool(
    ["valueA", "valueB"],
    ["Primary value", "Secondary value"],
    [`Primary input for ${enTitle}`, `Secondary input for ${enTitle}`],
    enTitle,
    "Screening result",
    format,
    `Informational screening estimate for ${enTitle.toLowerCase()}.`,
    resultType,
  );
}

function screeningDivide(enTitle, resultType = "quantity", format = "number") {
  return divideTool(
    "numerator",
    "Numerator",
    "denominator",
    "Denominator",
    enTitle,
    "Screening result",
    format,
    `Informational screening estimate = numerator ÷ denominator.`,
    resultType,
  );
}

/** Explicit formula definitions — all remaining planned slugs. */
const FORMULA_BY_SLUG = {
  "civata-on-germe-kuvveti-hesabi": multiplyTool(
    ["boltDiameterMm", "preloadKn"],
    ["Bolt diameter", "Preload force"],
    ["Nominal bolt diameter in mm", "Target preload in kN"],
    "Bolt preload index",
    "Preload index",
    "number",
    "Screening preload index = diameter × preload (verify with torque spec).",
  ),
  "sogutma-sivisi-karisim-orani-antifriz-bor-yagi-hesaplama": divideTool(
    "antifreezeLiters",
    "Antifreeze volume",
    "totalLiters",
    "Total coolant volume",
    "Coolant mix ratio",
    "Antifreeze ratio",
    "number",
    "Mix ratio ≈ antifreeze volume ÷ total coolant volume.",
  ),
  "palet-ambalaj-kereste-hesabi": multiplyTool(
    ["palletCount", "boardLengthM"],
    ["Pallet count", "Board length"],
    ["Number of pallets", "Average board length per pallet"],
    "Lumber length",
    "Total board length",
    "number",
    "Total lumber length ≈ pallet count × board length.",
  ),
  "tahta-mdf-sunta-m-agirlik-hesabi": multiplyTool(
    ["areaM2", "kgPerM2"],
    ["Area", "Weight per m²"],
    ["Sheet area in m²", "Catalog weight per m²"],
    "Panel weight",
    "Total weight",
    "number",
    "Weight = area × kg/m².",
  ),
  "tel-kablo-uzunlugu-agirlik-hesabi": multiplyTool(
    ["lengthM", "kgPerMeter"],
    ["Length", "kg/m"],
    ["Cable run length in meters", "Catalog cable weight per meter"],
    "Cable weight",
    "Total weight",
    "number",
    "Weight = length × kg/m.",
  ),
  "vida-somun-adim-dis-ustu-cap-hesabi": multiplyTool(
    ["pitchMm", "threadCount"],
    ["Pitch", "Thread count"],
    ["Thread pitch in mm", "Number of threads engaged"],
    "Major diameter index",
    "Diameter index",
    "number",
    "Screening diameter index = pitch × thread count.",
  ),
  "matkap-kilavuz-delik-capi-tablosu": divideTool(
    "screwDiameterMm",
    "Screw diameter",
    "drillFactor",
    "Drill factor",
    "Pilot hole size",
    "Pilot hole mm",
    "number",
    "Pilot hole ≈ screw diameter ÷ drill factor (verify with tap drill chart).",
  ),
  "kdv-tevkifati-hesaplama": {
    resultType: "cost",
    inputs: [
      nInput("netAmount", "Net amount", "USD", "Net invoice amount"),
      nInput("withholdingRate", "Withholding rate", "%", "KDV withholding percent", { defaultValue: 20 }),
    ],
    formula: {
      kind: "multiply",
      headline: "KDV withholding",
      primaryLabel: "Withheld amount",
      keys: ["netAmount", "withholdingRate"],
      format: "currency",
      explanation: "Withheld amount proxy ≈ net × rate (informational — not official tax advice).",
    },
  },
  "stopaj-hesaplama-kira-serbest-meslek": {
    resultType: "cost",
    inputs: [
      nInput("grossAmount", "Gross amount", "USD", "Payment before withholding"),
      nInput("withholdingRate", "Withholding rate", "%", "Stopaj percent", { defaultValue: 20 }),
    ],
    formula: {
      kind: "multiply",
      headline: "Withholding tax",
      primaryLabel: "Withheld tax",
      keys: ["grossAmount", "withholdingRate"],
      format: "currency",
      explanation: "Withheld tax proxy ≈ gross × rate (informational only).",
    },
  },
  "gelir-vergisi-dilimleri-hesaplama": multiplyToolDef({
    keys: ["taxableIncome", "effectiveRate"],
    labels: ["Taxable income", "Effective rate"],
    helpers: ["Annual taxable income", "Blended effective rate percent"],
    defaults: { effectiveRate: 15 },
    headline: "Income tax estimate",
    primaryLabel: "Estimated tax",
    format: "currency",
    explanation: "Screening tax estimate = income × effective rate (not bracket-accurate).",
    resultType: "cost",
  }),
  "ise-giris-cikis-bildirgesi-sureleri": identityTool(
    "noticeDays",
    "Notice period",
    "Employment notice period",
    "Days",
    "Displays entered notice period in days — compare to local labor rules.",
    "time",
  ),
  "sgk-prim-hesaplama-isci-plus-isveren": {
    resultType: "cost",
    inputs: [
      nInput("grossWage", "Gross wage", "USD", "Monthly gross wage"),
      nInput("combinedRate", "Combined rate", "%", "Employee + employer rate percent", { defaultValue: 34.5 }),
    ],
    formula: {
      kind: "multiply",
      headline: "Social security premium",
      primaryLabel: "Total premium",
      keys: ["grossWage", "combinedRate"],
      format: "currency",
      explanation: "Total premium proxy ≈ gross wage × combined rate (informational).",
    },
  },
  "makine-ekonomik-omru-hurda-deger-hesabi": {
    resultType: "cost",
    inputs: [
      nInput("machineCost", "Machine cost", "USD", "Purchase price"),
      nInput("salvageValue", "Salvage value", "USD", "Expected salvage value"),
      nInput("usefulLifeYears", "Useful life", "years", "Economic life in years", { defaultValue: 10 }),
    ],
    formula: {
      kind: "divide",
      headline: "Machine depreciation",
      primaryLabel: "Annual depreciation",
      numerator: "machineCost",
      denominator: "usefulLifeYears",
      format: "currency",
      explanation: "Straight-line annual depreciation proxy (informational).",
    },
  },
  "leasing-kiralama-maliyet-karsilastirma": subtractTool(
    "leaseCost",
    "Lease cost",
    "rentalCost",
    "Rental cost",
    "Lease vs rental",
    "Lease savings",
    "Savings = rental cost − lease cost (informational).",
  ),
  "kredi-erken-kapama-cezasi-hesaplama": multiplyToolDef({
    keys: ["remainingBalance", "penaltyRate"],
    labels: ["Remaining balance", "Penalty rate"],
    helpers: ["Outstanding loan balance", "Early closure penalty percent"],
    defaults: { penaltyRate: 2 },
    headline: "Early closure penalty",
    primaryLabel: "Penalty amount",
    format: "currency",
    explanation: "Penalty proxy ≈ balance × penalty rate.",
    resultType: "cost",
  }),
  "doviz-pozisyonu-kur-farki-riski-hesabi": multiplyToolDef({
    keys: ["foreignExposure", "fxMovePercent"],
    labels: ["Foreign exposure", "FX move"],
    helpers: ["Exposure in foreign currency", "Expected FX move percent"],
    defaults: { fxMovePercent: 5 },
    headline: "FX risk exposure",
    primaryLabel: "Risk amount",
    format: "currency",
    explanation: "Risk proxy ≈ exposure × FX move percent.",
    resultType: "cost",
  }),
  "cek-senet-vade-kirma-maliyeti-hesabi": multiplyToolDef({
    keys: ["faceValue", "discountRate"],
    labels: ["Face value", "Discount rate"],
    helpers: ["Instrument face value", "Discount rate percent"],
    defaults: { discountRate: 3 },
    headline: "Discount cost",
    primaryLabel: "Discount amount",
    format: "currency",
    explanation: "Discount cost proxy ≈ face value × discount rate.",
    resultType: "cost",
  }),
  "nakit-akisi-basit-gunluk-haftalik-panosu": multiplyToolDef({
    keys: ["dailyInflow", "days"],
    labels: ["Daily inflow", "Days"],
    helpers: ["Average daily cash inflow", "Days in period"],
    defaults: { days: 7 },
    headline: "Cash inflow panel",
    primaryLabel: "Period inflow",
    format: "currency",
    explanation: "Period inflow ≈ daily inflow × days.",
    resultType: "cost",
  }),
  "ic-verim-orani-irr-hesaplama": multiplyToolDef({
    keys: ["initialInvestment", "returnMultiple"],
    labels: ["Initial investment", "Return multiple"],
    helpers: ["Project investment", "Screening return multiple"],
    defaults: { returnMultiple: 1.2 },
    headline: "IRR screening index",
    primaryLabel: "Return index",
    format: "number",
    explanation: "Screening return index — not a full IRR solver.",
  }),
  "konteyner-yukleme-kapasitesi-teu-hesabi": divideTool(
    "totalWeightKg",
    "Total weight",
    "unitWeightKg",
    "Unit weight",
    "Container load capacity",
    "Load units",
    "number",
    "Load units ≈ total weight ÷ unit weight.",
  ),
  "tir-kamyon-yuk-kapasitesi-hesaplama": multiplyToolDef({
    keys: ["payloadTon", "loadFactor"],
    labels: ["Payload capacity", "Load factor"],
    helpers: ["Rated payload in tonnes", "Utilization factor"],
    defaults: { loadFactor: 0.85 },
    headline: "Truck load capacity",
    primaryLabel: "Usable payload",
    format: "number",
    explanation: "Usable payload ≈ rated payload × load factor.",
  }),
  "arac-bakim-periyodu-takip-hesaplama": divideTool(
    "remainingKm",
    "Remaining km",
    "dailyKm",
    "Daily km",
    "Maintenance due",
    "Days until service",
    "number",
    "Days until service ≈ remaining km ÷ daily km.",
    "time",
  ),
  "lastik-omru-degisim-km-hesaplama": divideTool(
    "remainingTreadKm",
    "Remaining tread km",
    "monthlyKm",
    "Monthly km",
    "Tire replacement",
    "Months until change",
    "number",
    "Months until change ≈ remaining tread km ÷ monthly km.",
    "time",
  ),
  "depo-raf-palet-yerlesim-optimizasyonu": multiplyTool(
    ["palletWidthM", "palletDepthM"],
    ["Pallet width", "Pallet depth"],
    ["Pallet width in meters", "Pallet depth in meters"],
    "Pallet footprint",
    "Footprint m²",
    "number",
    "Footprint m² = width × depth.",
  ),
  "trafik-cezasi-gecikme-faizi-hesaplama": multiplyToolDef({
    keys: ["fineAmount", "lateRate"],
    labels: ["Fine amount", "Late rate"],
    helpers: ["Original fine amount", "Late payment rate percent"],
    defaults: { lateRate: 5 },
    headline: "Late payment interest",
    primaryLabel: "Late interest",
    format: "currency",
    explanation: "Late interest proxy ≈ fine × late rate.",
    resultType: "cost",
  }),
  "kasko-sigorta-prim-karsilastirma": subtractTool(
    "quoteA",
    "Quote A",
    "quoteB",
    "Quote B",
    "Insurance quote comparison",
    "Quote delta",
    "Delta = quote A − quote B (informational).",
  ),
  "sofor-operator-gunluk-yevmiye-maliyeti": multiplyToolDef({
    keys: ["dailyRate", "days"],
    labels: ["Daily rate", "Days"],
    helpers: ["Driver/operator daily rate", "Working days"],
    defaults: { days: 22 },
    headline: "Labor cost",
    primaryLabel: "Period labor cost",
    format: "currency",
    explanation: "Labor cost ≈ daily rate × days.",
    resultType: "cost",
  }),
  "arac-kira-satin-alma-karsilastirma": subtractTool(
    "purchaseCost",
    "Purchase cost",
    "leaseCost",
    "Lease cost",
    "Buy vs lease",
    "Cost delta",
    "Delta = purchase cost − lease cost (informational).",
  ),
  "yemek-tabldot-maliyet-hesaplama": multiplyTool(
    ["mealCost", "headcount"],
    ["Meal cost", "Headcount"],
    ["Cost per meal", "Number of meals"],
    "Catering cost",
    "Total meal cost",
    "currency",
    "Total cost ≈ meal cost × headcount.",
    "cost",
  ),
  "fotokopi-yazici-toner-sayfa-maliyeti": divideTool(
    "tonerCost",
    "Toner cost",
    "pageYield",
    "Page yield",
    "Print cost per page",
    "Cost per page",
    "currency",
    "Cost per page ≈ toner cost ÷ page yield.",
    "cost",
  ),
  "internet-telefon-paketi-karsilastirma": subtractTool(
    "packageA",
    "Package A",
    "packageB",
    "Package B",
    "Telecom package comparison",
    "Monthly delta",
    "Monthly delta = package A − package B.",
  ),
  "yangin-tupu-dolap-debisi-hesaplama": multiplyToolDef({
    keys: ["areaM2", "flowFactor"],
    labels: ["Protected area", "Flow factor"],
    helpers: ["Protected floor area in m²", "Flow factor per m²"],
    defaults: { flowFactor: 0.5 },
    headline: "Fire suppression flow",
    primaryLabel: "Flow index",
    format: "number",
    explanation: "Flow index ≈ area × flow factor.",
  }),
  "prefabrik-konteyner-ofis-m-maliyeti": multiplyTool(
    ["areaM2", "costPerM2"],
    ["Floor area", "Cost per m²"],
    ["Office floor area in m²", "Cost per m²"],
    "Prefab office cost",
    "Estimated cost",
    "currency",
    "Cost ≈ area × cost per m².",
    "cost",
  ),
  "celik-raf-depo-rafi-yuk-kapasitesi": multiplyTool(
    ["beamCapacityKg", "shelfCount"],
    ["Beam capacity", "Shelf count"],
    ["Capacity per beam level in kg", "Number of shelf levels"],
    "Rack capacity",
    "Total capacity",
    "number",
    "Total capacity ≈ beam capacity × shelf count.",
  ),
  "kaynakli-baglanti-kose-kut-mukavemet-hesabi": multiplyTool(
    ["throatMm", "legLengthMm"],
    ["Throat", "Leg length"],
    ["Weld throat in mm", "Leg length in mm"],
    "Weld strength index",
    "Strength index",
    "number",
    "Strength index = throat × leg length (screening).",
  ),
  "bulonlu-baglanti-kesme-ezilme-hesabi": multiplyTool(
    ["boltCount", "shearCapacityKn"],
    ["Bolt count", "Shear capacity"],
    ["Number of bolts", "Shear capacity per bolt in kN"],
    "Connection capacity",
    "Shear capacity index",
    "number",
    "Shear index ≈ bolt count × capacity per bolt.",
  ),
  "ruzgar-turbini-yaklasik-uretim-hesabi": multiplyToolDef({
    keys: ["ratedKw", "capacityFactor"],
    labels: ["Rated power", "Capacity factor"],
    helpers: ["Turbine rated kW", "Capacity factor"],
    defaults: { capacityFactor: 0.25 },
    headline: "Wind production",
    primaryLabel: "Annual kWh index",
    format: "number",
    explanation: "Production index ≈ rated kW × capacity factor × hours proxy.",
  }),
  "su-isitma-kazan-boyler-kapasite-hesabi": multiplyTool(
    ["volumeLiters", "deltaTempC"],
    ["Volume", "Temperature rise"],
    ["Tank volume in liters", "Required temperature rise in °C"],
    "Heating load",
    "Energy index",
    "number",
    "Energy index ≈ volume × temperature rise.",
  ),
  "soguk-oda-sogutma-yuku-hesabi": {
    resultType: "quantity",
    inputs: [
      nInput("roomVolumeM3", "Room volume", "m³", "Cold room volume"),
      nInput("loadFactor", "Load factor", "W/m³", "Cooling load factor", { defaultValue: 40 }),
    ],
    formula: {
      kind: "multiply",
      headline: "Cold room load",
      primaryLabel: "Cooling load",
      keys: ["roomVolumeM3", "loadFactor"],
      format: "number",
      explanation: "Cooling load proxy ≈ room volume × load factor.",
    },
  },
  "yamuk-alani-hesaplama": {
    resultType: "quantity",
    inputs: [
      nInput("baseA", "Base A", "m", "First parallel side"),
      nInput("baseB", "Base B", "m", "Second parallel side"),
      nInput("height", "Height", "m", "Perpendicular height"),
    ],
    formula: {
      kind: "trapezoid",
      headline: "Trapezoid area",
      baseAKey: "baseA",
      baseBKey: "baseB",
      heightKey: "height",
      explanation: "Area = (base A + base B) ÷ 2 × height.",
    },
  },
  "kure-hacmi-hesaplama": {
    resultType: "quantity",
    inputs: [nInput("radius", "Radius", "m", "Sphere radius")],
    formula: {
      kind: "sphere",
      headline: "Sphere volume",
      radiusKey: "radius",
      explanation: "Volume = 4/3 × π × r³.",
    },
  },
  "koni-hacmi-hesaplama": {
    resultType: "quantity",
    inputs: [
      nInput("radius", "Radius", "m", "Base radius"),
      nInput("height", "Height", "m", "Cone height"),
    ],
    formula: {
      kind: "cone",
      headline: "Cone volume",
      radiusKey: "radius",
      heightKey: "height",
      explanation: "Volume = 1/3 × π × r² × height.",
    },
  },
  "duvar-kagidi-seramik-adet-hesaplama": divideTool(
    "wallAreaM2",
    "Wall area",
    "tileAreaM2",
    "Tile area",
    "Tile count",
    "Tiles needed",
    "number",
    "Tiles ≈ wall area ÷ tile area (add waste separately).",
  ),
  "kiris-kolon-yaklasik-agirlik-hesabi": multiplyTool(
    ["lengthM", "kgPerMeter"],
    ["Length", "kg/m"],
    ["Member length in meters", "Catalog weight per meter"],
    "Structural weight",
    "Total weight",
    "number",
    "Weight = length × kg/m.",
  ),
  "asma-tavan-malzeme-hesabi": multiplyTool(
    ["ceilingAreaM2", "materialPerM2"],
    ["Ceiling area", "Material per m²"],
    ["Ceiling area in m²", "Material units per m²"],
    "Ceiling material",
    "Material units",
    "number",
    "Material units ≈ area × material per m².",
  ),
  "istinat-duvari-yaklasik-beton-hesabi": multiplyTool(
    ["wallLengthM", "wallHeightM"],
    ["Wall length", "Wall height"],
    ["Retaining wall length", "Average wall height"],
    "Concrete volume index",
    "Volume index",
    "number",
    "Volume index ≈ length × height (screen with thickness).",
  ),
  "rulman-omur-hesabi-l10": divideTool(
    "dynamicLoadKn",
    "Dynamic load",
    "basicLoadKn",
    "Basic load rating",
    "Bearing life",
    "L10 life index",
    "number",
    "L10 life index ≈ basic load ÷ dynamic load (screening).",
  ),
  "paslanmaz-celik-aluminyum-ayirt-etme-hesaplayicisi-yogunluk-bazli": identityTool(
    "densityKgM3",
    "Material density",
    "Material density check",
    "Density kg/m³",
    "Compare measured density to stainless (~8000), steel (~7850), aluminum (~2700).",
  ),
  "enjeksiyon-dokum-cekme-payi-hesabi": multiplyToolDef({
    keys: ["partLengthMm", "shrinkPercent"],
    labels: ["Part length", "Shrink percent"],
    helpers: ["Molded part length in mm", "Expected shrink percent"],
    defaults: { shrinkPercent: 2 },
    headline: "Shrink allowance",
    primaryLabel: "Allowance mm",
    format: "number",
    explanation: "Allowance ≈ part length × shrink percent.",
  }),
  "kumlama-raspa-kum-sarfiyati-hesabi": multiplyTool(
    ["surfaceAreaM2", "abrasiveKgPerM2"],
    ["Surface area", "Abrasive per m²"],
    ["Blasted surface in m²", "Abrasive kg per m²"],
    "Abrasive consumption",
    "Abrasive kg",
    "number",
    "Abrasive kg ≈ area × kg/m².",
  ),
  "plastik-enjeksiyon-cevrim-suresi-tahmini": divideTool(
    "shotWeightG",
    "Shot weight",
    "injectionRateGps",
    "Injection rate",
    "Cycle time",
    "Injection time index",
    "number",
    "Injection time index ≈ shot weight ÷ injection rate.",
    "time",
  ),
  "personel-devamsizlik-maliyeti-hesaplama": multiplyTool(
    ["dailyWage", "absentDays"],
    ["Daily wage", "Absent days"],
    ["Daily wage cost", "Absent days in period"],
    "Absenteeism cost",
    "Lost labor cost",
    "currency",
    "Cost ≈ daily wage × absent days.",
    "cost",
  ),
  "is-kazasi-maliyeti-gun-kaybi-hesaplama": multiplyTool(
    ["dailyOutputValue", "lostDays"],
    ["Daily output value", "Lost days"],
    ["Daily production value", "Lost workdays"],
    "Accident cost",
    "Lost output cost",
    "currency",
    "Cost ≈ daily output × lost days.",
    "cost",
  ),
  "forklift-transpalet-kullanim-maliyeti": multiplyTool(
    ["hourlyRate", "hours"],
    ["Hourly rate", "Hours"],
    ["Equipment hourly rate", "Operating hours"],
    "Equipment cost",
    "Period cost",
    "currency",
    "Cost ≈ hourly rate × hours.",
    "cost",
  ),
  "paketleme-malzemesi-strec-koli-sarfiyati": multiplyTool(
    ["shipmentCount", "materialPerShipment"],
    ["Shipments", "Material per shipment"],
    ["Number of shipments", "Packaging units per shipment"],
    "Packaging usage",
    "Material units",
    "number",
    "Material units ≈ shipments × units per shipment.",
  ),
  "irsaliye-fatura-adedi-basina-sevkiyat-maliyeti": divideTool(
    "totalShippingCost",
    "Total shipping cost",
    "documentCount",
    "Document count",
    "Shipping cost per document",
    "Cost per document",
    "currency",
    "Cost per document ≈ total shipping cost ÷ document count.",
    "cost",
  ),
  "cay-kahve-su-tuketim-maliyeti": multiplyToolDef({
    keys: ["unitCost", "dailyUnits"],
    labels: ["Unit cost", "Daily units"],
    helpers: ["Cost per serving", "Servings per day"],
    defaults: { dailyUnits: 50 },
    headline: "Beverage cost",
    primaryLabel: "Daily cost",
    format: "currency",
    explanation: "Daily cost ≈ unit cost × daily servings.",
    resultType: "cost",
  }),
  "toplanti-saati-maliyeti-hesaplama": multiplyTool(
    ["attendeeRate", "attendeeHours"],
    ["Attendee rate", "Attendee-hours"],
    ["Blended hourly attendee cost", "Total attendee-hours"],
    "Meeting cost",
    "Meeting cost",
    "currency",
    "Meeting cost ≈ rate × attendee-hours.",
    "cost",
  ),
  "is-elbisesi-kkd-kisisel-koruyucu-donanim-sarfiyati": multiplyTool(
    ["unitCost", "employeeCount"],
    ["Unit cost", "Employees"],
    ["PPE cost per employee", "Number of employees"],
    "PPE spend",
    "Total PPE cost",
    "currency",
    "Total cost ≈ unit cost × employees.",
    "cost",
  ),
  "temizlik-malzemesi-sarfiyat-hesabi": multiplyTool(
    ["areaM2", "consumptionPerM2"],
    ["Area", "Consumption per m²"],
    ["Cleaned area in m²", "Material consumption per m²"],
    "Cleaning material",
    "Material units",
    "number",
    "Material units ≈ area × consumption per m².",
  ),
  "ofis-kirtasiye-sarfiyat-hesabi": multiplyTool(
    ["employeeCount", "monthlySpendPerHead"],
    ["Employees", "Spend per head"],
    ["Number of employees", "Monthly stationery spend per employee"],
    "Stationery spend",
    "Monthly spend",
    "currency",
    "Monthly spend ≈ employees × spend per head.",
    "cost",
  ),
  "sirket-telefon-faturasi-hesaplama": multiplyTool(
    ["lineCount", "monthlyLineCost"],
    ["Lines", "Cost per line"],
    ["Number of phone lines", "Monthly cost per line"],
    "Phone bill",
    "Monthly bill",
    "currency",
    "Monthly bill ≈ lines × cost per line.",
    "cost",
  ),
  "abonelik-yazilim-cloud-yillik-maliyet-hesabi": multiplyToolDef({
    keys: ["monthlyFee", "months"],
    labels: ["Monthly fee", "Months"],
    helpers: ["Monthly subscription fee", "Months per year"],
    defaults: { months: 12 },
    headline: "Annual subscription cost",
    primaryLabel: "Annual cost",
    format: "currency",
    explanation: "Annual cost ≈ monthly fee × months.",
    resultType: "cost",
  }),
  "is-sagligi-ve-guvenligi-ceza-hesaplama": multiplyToolDef({
    keys: ["baseFine", "severityFactor"],
    labels: ["Base fine", "Severity factor"],
    helpers: ["Reference fine amount", "Severity multiplier"],
    defaults: { severityFactor: 1.5 },
    headline: "OHS penalty estimate",
    primaryLabel: "Penalty estimate",
    format: "currency",
    explanation: "Penalty estimate ≈ base fine × severity factor (informational).",
    resultType: "cost",
  }),
  "yangin-merdiveni-kacis-yolu-genisligi-hesabi": divideTool(
    "occupantLoad",
    "Occupant load",
    "flowPerMeter",
    "Flow per meter",
    "Escape route width",
    "Required width index",
    "number",
    "Width index ≈ occupant load ÷ flow per meter.",
  ),
  "cevre-atik-beyani-maliyet-hesaplama": multiplyTool(
    ["wasteTonnes", "feePerTonne"],
    ["Waste tonnage", "Fee per tonne"],
    ["Declared waste in tonnes", "Fee per tonne"],
    "Waste declaration cost",
    "Declaration cost",
    "currency",
    "Cost ≈ tonnage × fee per tonne.",
    "cost",
  ),
  "cop-atik-konteyner-hacim-hesabi": multiplyTool(
    ["containerLengthM", "containerWidthM"],
    ["Length", "Width"],
    ["Container length in meters", "Container width in meters"],
    "Waste container volume index",
    "Footprint m²",
    "number",
    "Footprint index = length × width (multiply by height separately).",
  ),
  "geri-donusum-gelir-maliyet-hesabi": subtractTool(
    "recyclingRevenue",
    "Recycling revenue",
    "processingCost",
    "Processing cost",
    "Recycling net",
    "Net recycling value",
    "Net value = revenue − processing cost.",
  ),
  "merdiven-platform-yukseklik-erisim-hesabi": multiplyToolDef({
    keys: ["platformHeightM", "accessFactor"],
    labels: ["Platform height", "Access factor"],
    helpers: ["Working platform height in meters", "Access factor"],
    defaults: { accessFactor: 1.2 },
    headline: "Access height index",
    primaryLabel: "Access index",
    format: "number",
    explanation: "Access index ≈ platform height × access factor.",
  }),
  "mil-aks-capi-hesabi-egilme-burulma": multiplyTool(
    ["bendingMoment", "torque"],
    ["Bending moment", "Torque"],
    ["Applied bending moment index", "Applied torque index"],
    "Shaft diameter index",
    "Diameter index",
    "number",
    "Diameter index = moment × torque (screening only).",
  ),
  "yatak-rulman-omur-hesabi-l10": divideTool(
    "dynamicLoadKn",
    "Dynamic load",
    "basicLoadKn",
    "Basic load rating",
    "Bearing life",
    "L10 life index",
    "number",
    "L10 life index ≈ basic load ÷ dynamic load.",
  ),
  "yay-helisel-kuvvet-uzama-hesabi": multiplyTool(
    ["springRate", "deflectionMm"],
    ["Spring rate", "Deflection"],
    ["Spring rate N/mm", "Deflection in mm"],
    "Spring force",
    "Force",
    "number",
    "Force ≈ spring rate × deflection (Hooke's law screening).",
  ),
  "basincli-kap-cidar-kalinligi-hesabi": divideTool(
    "designPressureBar",
    "Design pressure",
    "allowableStressBar",
    "Allowable stress",
    "Wall thickness",
    "Thickness index",
    "number",
    "Thickness index ≈ pressure ÷ allowable stress (screening).",
  ),
  "isi-degistirici-esanjor-kapasite-hesabi": multiplyTool(
    ["flowRateM3h", "deltaTempC"],
    ["Flow rate", "Temperature delta"],
    ["Flow in m³/h", "Temperature difference in °C"],
    "Heat exchanger capacity",
    "Capacity index",
    "number",
    "Capacity index ≈ flow × temperature delta.",
  ),
  "baca-havalandirma-kanali-cap-hesabi": divideTool(
    "airflowM3h",
    "Airflow",
    "velocityMps",
    "Target velocity",
    "Duct diameter",
    "Diameter index",
    "number",
    "Diameter index ≈ airflow ÷ velocity (screening).",
  ),
  "ses-yalitimi-desibel-azaltimi-hesabi": subtractTool(
    "sourceDb",
    "Source level",
    "attenuationDb",
    "Attenuation",
    "Sound reduction",
    "Result level",
    "Result level ≈ source − attenuation (informational).",
  ),
  "titresim-frekans-periyot-hesaplama": {
    resultType: "quantity",
    inputs: [
      nInput("frequencyHz", "Frequency", "Hz", "Vibration frequency in Hz"),
      nInput("unitConstant", "Constant", "×", "Use 1 for period in seconds", { defaultValue: 1, min: 0.01 }),
    ],
    formula: {
      kind: "divide",
      headline: "Vibration period",
      primaryLabel: "Period seconds",
      numerator: "unitConstant",
      denominator: "frequencyHz",
      format: "number",
      explanation: "Period ≈ constant ÷ frequency (use constant = 1 for seconds).",
    },
  },
  "kaynak-proseduru-wps-on-isitma-sicakligi-hesabi": identityTool(
    "preheatTempC",
    "Preheat temperature",
    "WPS preheat check",
    "Preheat °C",
    "Displays entered preheat temperature — compare to WPS requirements.",
  ),
  "istatistiksel-proses-kontrol-spc-limit-hesabi": multiplyToolDef({
    keys: ["processMean", "controlFactor"],
    labels: ["Process mean", "Control factor"],
    helpers: ["Process mean", "Control limit factor"],
    defaults: { controlFactor: 3 },
    headline: "SPC control limit",
    primaryLabel: "Limit index",
    format: "number",
    explanation: "Control limit index ≈ mean × control factor (screening).",
  }),
  "alti-sigma-dpmo-sigma-seviyesi-cevirici": {
    resultType: "statistics",
    inputs: [
      nInput("dpmo", "DPMO", "defects", "Defects per million opportunities"),
      nInput("million", "Million", "×", "Divisor (use 1,000,000)", { defaultValue: 1_000_000 }),
    ],
    formula: {
      kind: "divide",
      headline: "Sigma level index",
      primaryLabel: "Sigma index",
      numerator: "dpmo",
      denominator: "million",
      format: "number",
      explanation: "Sigma index proxy ≈ DPMO ÷ 1,000,000 (screening only).",
    },
  },
};

const roadmap = extractConstArray("src/data/free-traffic-tool-roadmap.ts", "FREE_TRAFFIC_TOOL_ROADMAP");
const rank = { "very-high": 0, high: 1, medium: 2, low: 3 };
const batch = roadmap
  .filter((x) => x.status === "planned")
  .sort((a, b) => (rank[a.trafficPotential] ?? 9) - (rank[b.trafficPotential] ?? 9) || a.id.localeCompare(b.id))
  .slice(0, BATCH_SIZE);

if (batch.length !== BATCH_SIZE) {
  console.error(`Expected ${BATCH_SIZE} planned items, got`, batch.length);
  process.exit(1);
}

for (const item of batch) {
  if (!FORMULA_BY_SLUG[item.slug]) {
    console.error("Missing formula mapping for", item.slug);
    process.exit(1);
  }
}

const catalog = batch.map((item) => {
  const spec = FORMULA_BY_SLUG[item.slug];
  const enTitle = item.title.en;
  const category = CATEGORY_MAP[item.categoryId] ?? "everyday-life";
  return {
    slug: item.slug,
    title: enTitle,
    category,
    description: `${enTitle} — free browser calculator with instant results.`,
    seoTitle: `${enTitle} | SectorCalc`,
    seoDescription: `Free ${enTitle.toLowerCase()} with instant results. Browser-side calculation; inputs are not stored.`,
    resultType: spec.resultType,
    inputs: spec.inputs,
    missingFactors: MISSING,
  };
});

writeFileSync(
  join(ROOT, "src/lib/tools/roadmap-free-batch2-catalog.generated.json"),
  `${JSON.stringify(catalog, null, 2)}\n`,
);

const specs = {};
for (const item of batch) {
  specs[item.slug] = FORMULA_BY_SLUG[item.slug].formula;
}
writeFileSync(
  join(ROOT, "src/lib/tools/roadmap-free-batch2-specs.generated.ts"),
  `/** Generated by scripts/generate-roadmap-free-batch2.mjs — do not edit manually. */\nimport type { Batch1FormulaSpec } from "@/lib/tools/roadmap-free-batch1/engine";\n\nexport const ROADMAP_FREE_BATCH2_SPECS: Readonly<Record<string, Batch1FormulaSpec>> = ${JSON.stringify(specs, null, 2)} as const;\n`,
);

const CUSTOM_HANDLERS = `
  if (slug === "kdv-tevkifati-hesaplama" || slug === "stopaj-hesaplama-kira-serbest-meslek" || slug === "sgk-prim-hesaplama-isci-plus-isveren") {
    const amount = Number(values[slug === "sgk-prim-hesaplama-isci-plus-isveren" ? "grossWage" : slug === "kdv-tevkifati-hesaplama" ? "netAmount" : "grossAmount"] ?? 0);
    const rate = Number(values.withholdingRate ?? values.combinedRate ?? 0);
    const rateKey = slug === "sgk-prim-hesaplama-isci-plus-isveren" ? "combinedRate" : "withholdingRate";
    return runBatch1Formula(
      spec,
      { ...values, [slug === "sgk-prim-hesaplama-isci-plus-isveren" ? "grossWage" : slug === "kdv-tevkifati-hesaplama" ? "netAmount" : "grossAmount"]: amount * (rate / 100), [rateKey]: 1 },
    );
  }
  if (slug === "gelir-vergisi-dilimleri-hesaplama") {
    const income = Number(values.taxableIncome ?? 0);
    const rate = Number(values.effectiveRate ?? 0);
    return runBatch1Formula(spec, { taxableIncome: income * (rate / 100), effectiveRate: 1 });
  }
  if (slug === "makine-ekonomik-omru-hurda-deger-hesabi") {
    const cost = Number(values.machineCost ?? 0);
    const salvage = Number(values.salvageValue ?? 0);
    const years = Math.max(Number(values.usefulLifeYears ?? 1), 0.01);
    return runBatch1Formula(
      { kind: "divide", headline: "Machine depreciation", primaryLabel: "Annual depreciation", numerator: "depreciableBase", denominator: "usefulLifeYears", format: "currency", explanation: spec.explanation },
      { ...values, depreciableBase: Math.max(cost - salvage, 0), usefulLifeYears: years },
    );
  }
  if (slug === "kredi-erken-kapama-cezasi-hesaplama" || slug === "doviz-pozisyonu-kur-farki-riski-hesabi" || slug === "cek-senet-vade-kirma-maliyeti-hesabi" || slug === "trafik-cezasi-gecikme-faizi-hesaplama") {
    const baseKey = slug === "kredi-erken-kapama-cezasi-hesaplama" ? "remainingBalance" : slug === "doviz-pozisyonu-kur-farki-riski-hesabi" ? "foreignExposure" : slug === "cek-senet-vade-kirma-maliyeti-hesabi" ? "faceValue" : "fineAmount";
    const rateKey = slug === "doviz-pozisyonu-kur-farki-riski-hesabi" ? "fxMovePercent" : slug === "cek-senet-vade-kirma-maliyeti-hesabi" ? "discountRate" : slug === "trafik-cezasi-gecikme-faizi-hesaplama" ? "lateRate" : "penaltyRate";
    const base = Number(values[baseKey] ?? 0);
    const rate = Number(values[rateKey] ?? 0);
    return runBatch1Formula(spec, { ...values, [baseKey]: base * (rate / 100), [rateKey]: 1 });
  }
  if (slug === "enjeksiyon-dokum-cekme-payi-hesabi") {
    const length = Number(values.partLengthMm ?? 0);
    const shrink = Number(values.shrinkPercent ?? 0);
    return runBatch1Formula(spec, { partLengthMm: length * (shrink / 100), shrinkPercent: 1 });
  }
`;

writeFileSync(
  join(ROOT, "src/lib/tools/roadmap-free-batch2-calculators.ts"),
  `/** Generated by scripts/generate-roadmap-free-batch2.mjs — do not edit manually. */\nimport type { FreeTrafficInputValues } from "@/lib/tools/free-traffic-calculators";\nimport { runBatch1Formula, setBatch1FormatLocale, type Batch1CalcPartial } from "@/lib/tools/roadmap-free-batch1/engine";\nimport { ROADMAP_FREE_BATCH2_SPECS } from "@/lib/tools/roadmap-free-batch2-specs.generated";\n\nexport const ROADMAP_FREE_BATCH2_SLUGS = Object.freeze(Object.keys(ROADMAP_FREE_BATCH2_SPECS));\n\nexport function calculateRoadmapFreeBatch2Tool(\n  slug: string,\n  values: FreeTrafficInputValues,\n  locale = "en",\n): Batch1CalcPartial {\n  const spec = ROADMAP_FREE_BATCH2_SPECS[slug];\n  if (!spec) {\n    throw new Error(\`Unknown roadmap batch-2 calculator slug: \${slug}\`);\n  }\n  setBatch1FormatLocale(locale);\n${CUSTOM_HANDLERS}\n  return runBatch1Formula(spec, values);\n}\n\nexport function hasRoadmapFreeBatch2Calculator(slug: string): boolean {\n  return slug in ROADMAP_FREE_BATCH2_SPECS;\n}\n`,
);

const locales = ["tr", "de", "fr", "es", "ar"];
const i18nBatch = {};
for (const locale of locales) {
  i18nBatch[locale] = {};
  for (const item of batch) {
    const descFn = I18N_DESC[locale] ?? I18N_DESC.tr;
    i18nBatch[locale][item.slug] = {
      title: item.title[locale],
      description: descFn(item.title[locale]),
    };
  }
}
writeFileSync(
  join(ROOT, "src/data/roadmap-free-batch2-i18n.generated.json"),
  `${JSON.stringify(i18nBatch, null, 2)}\n`,
);

const sourcePath = join(ROOT, "scripts/data/strategic-roadmap-source.json");
const source = JSON.parse(readFileSync(sourcePath, "utf8"));
const batchSlugs = new Set(batch.map((b) => b.slug));
for (const item of source.free) {
  if (batchSlugs.has(item.slug)) {
    item.status = "live";
    item.mappedLiveSlug = item.slug;
  }
}
writeFileSync(sourcePath, `${JSON.stringify(source, null, 2)}\n`);

console.log(`Wrote batch-2 catalog (${BATCH_SIZE} tools), specs, calculators, i18n, and patched strategic source.`);
console.log("Next: node scripts/generate-strategic-roadmap-data.mjs");
