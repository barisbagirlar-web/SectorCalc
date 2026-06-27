#!/usr/bin/env node
/**
 * FAZ 6 — generates roadmap free batch-1 catalog, calculators, i18n, roadmap live patches.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");
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

function sInput(key, label, unit, helper, options, defaultValue) {
  return { key, label, unit, type: "select", helper, options, defaultValue };
}

const PRESSURE = {
  factors: { pa: 1, bar: 100000, psi: 6894.757293168, kpa: 1000, atm: 101325 },
  labels: { pa: "Pascals (Pa)", bar: "Bar", psi: "PSI", kpa: "Kilopascals (kPa)", atm: "Atmospheres (atm)" },
  primaryUnit: "bar",
  primaryLabel: "Bar",
  headline: "Pressure conversion",
  explanation: "Convert pressure across bar, PSI, pascal and related units.",
};

const FORCE = {
  factors: { n: 1, kgf: 9.80665, lbf: 4.4482216153, kn: 1000 },
  labels: { n: "Newtons (N)", kgf: "Kilogram-force (kgf)", lbf: "Pound-force (lbf)", kn: "Kilonewtons (kN)" },
  primaryUnit: "n",
  primaryLabel: "Newtons",
  headline: "Force conversion",
  explanation: "Convert force between newton, kilogram-force and pound-force.",
};

const ENERGY = {
  factors: { j: 1, cal: 4.184, kcal: 4184, wh: 3600, kwh: 3600000 },
  labels: { j: "Joules (J)", cal: "Calories (cal)", kcal: "Kilocalories (kcal)", wh: "Watt-hours (Wh)", kwh: "Kilowatt-hours (kWh)" },
  primaryUnit: "kwh",
  primaryLabel: "Kilowatt-hours",
  headline: "Energy conversion",
  explanation: "Convert energy between joule, calorie and watt-hour units.",
};

const POWER = {
  factors: { w: 1, kw: 1000, hp: 745.699872, ps: 735.49875 },
  labels: { w: "Watts (W)", kw: "Kilowatts (kW)", hp: "Horsepower (hp)", ps: "Metric hp (PS)" },
  primaryUnit: "kw",
  primaryLabel: "Kilowatts",
  headline: "Power conversion",
  explanation: "Convert power between kilowatts, horsepower and watts.",
};

function unitTool(table) {
  const options = Object.entries(table.labels).map(([value, label]) => ({ value, label }));
  return {
    resultType: "conversion",
    inputs: [
      nInput("value", "Value", "value", "Amount to convert", { min: 0 }),
      sInput("fromUnit", "From unit", "unit", "Source unit", options, Object.keys(table.factors)[0]),
    ],
    formula: {
      kind: "unit",
      headline: table.headline,
      primaryLabel: table.primaryLabel,
      primaryUnit: table.primaryUnit,
      explanation: table.explanation,
      factors: table.factors,
      labels: table.labels,
    },
  };
}

function multiplyTool(keys, labels, helpers, headline, primaryLabel, format, explanation, resultType = "quantity") {
  return {
    resultType,
    inputs: keys.map((key, idx) => nInput(key, labels[idx], "value", helpers[idx])),
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

const FORMULA_BY_SLUG = {
  "bar-psi-pascal-cevirici": unitTool(PRESSURE),
  "newton-kilogram-kuvvet-cevirici": unitTool(FORCE),
  "joule-kalori-watt-saat-cevirici": unitTool(ENERGY),
  "beygir-gucu-kilowatt-cevirici": unitTool(POWER),
  "motor-gucu-kw-hp-cevirici": unitTool(POWER),
  "amper-kilowatt-kw-cevirici": {
    resultType: "conversion",
    inputs: [
      nInput("amps", "Current", "A", "Line current in amperes"),
      nInput("volts", "Voltage", "V", "Line voltage"),
      nInput("powerFactor", "Power factor", "×", "Power factor (0–1)", { min: 0.1, max: 1, defaultValue: 0.9 }),
    ],
    formula: {
      kind: "power_kw_from_amps",
      headline: "Electrical power",
      ampsKey: "amps",
      voltsKey: "volts",
      powerFactorKey: "powerFactor",
      explanation: "kW = amps × volts × power factor ÷ 1000.",
    },
  },
  "klima-btu-secim-hesaplama": {
    resultType: "quantity",
    inputs: [
      nInput("areaM2", "Floor area", "m²", "Cooled floor area"),
      nInput("ceilingM", "Ceiling height", "m", "Room height", { defaultValue: 2.7 }),
      nInput("loadFactor", "Load factor", "BTU/h·m²", "Cooling load factor", { defaultValue: 600 }),
    ],
    formula: {
      kind: "btu_hvac",
      headline: "HVAC cooling load",
      areaKey: "areaM2",
      heightKey: "ceilingM",
      factorKey: "loadFactor",
      explanation: "Approximate cooling load = area × ceiling height × load factor.",
    },
  },
  "daire-alani-cevresi-hesaplama": {
    resultType: "quantity",
    inputs: [nInput("radius", "Radius", "m", "Circle radius")],
    formula: {
      kind: "circle",
      headline: "Circle geometry",
      radiusKey: "radius",
      explanation: "Area = πr² and circumference = 2πr.",
    },
  },
  "ucgen-alani-cevresi-hesaplama": {
    resultType: "quantity",
    inputs: [
      nInput("base", "Base", "m", "Triangle base length"),
      nInput("height", "Height", "m", "Triangle height"),
    ],
    formula: {
      kind: "triangle",
      headline: "Triangle area",
      baseKey: "base",
      heightKey: "height",
      explanation: "Area = base × height ÷ 2.",
    },
  },
  "silindir-hacmi-hesaplama": {
    resultType: "quantity",
    inputs: [
      nInput("radius", "Radius", "m", "Cylinder radius"),
      nInput("height", "Height", "m", "Cylinder height"),
    ],
    formula: {
      kind: "cylinder",
      headline: "Cylinder volume",
      radiusKey: "radius",
      heightKey: "height",
      explanation: "Volume = πr²h.",
    },
  },
  "su-deposu-hacmi-hesaplama": {
    resultType: "quantity",
    inputs: [
      nInput("radius", "Radius", "m", "Tank radius", { defaultValue: 1.2 }),
      nInput("height", "Height", "m", "Tank height", { defaultValue: 2.5 }),
    ],
    formula: {
      kind: "cylinder",
      headline: "Water tank volume",
      radiusKey: "radius",
      heightKey: "height",
      explanation: "Cylindrical tank volume = πr²h.",
    },
  },
  "agirlikli-ortalama-hesaplama": {
    resultType: "statistics",
    inputs: [
      nInput("value1", "Value 1", "value", "First value"),
      nInput("weight1", "Weight 1", "weight", "Weight for value 1", { defaultValue: 1 }),
      nInput("value2", "Value 2", "value", "Second value"),
      nInput("weight2", "Weight 2", "weight", "Weight for value 2", { defaultValue: 1 }),
      nInput("value3", "Value 3", "value", "Third value"),
      nInput("weight3", "Weight 3", "weight", "Weight for value 3", { defaultValue: 1 }),
    ],
    formula: {
      kind: "weighted_avg",
      headline: "Weighted average",
      valueKeys: ["value1", "value2", "value3"],
      weightKeys: ["weight1", "weight2", "weight3"],
      explanation: "Weighted average = Σ(value × weight) ÷ Σ(weight).",
    },
  },
  "rastgele-sayi-ureteci": {
    resultType: "statistics",
    inputs: [
      nInput("minValue", "Minimum", "value", "Minimum integer", { defaultValue: 1, min: -999999 }),
      nInput("maxValue", "Maximum", "value", "Maximum integer", { defaultValue: 100, min: -999999 }),
    ],
    formula: {
      kind: "random_int",
      headline: "Random integer",
      minKey: "minValue",
      maxKey: "maxValue",
      explanation: "Uniform random integer between minimum and maximum (inclusive).",
    },
  },
  "kesir-ondalik-cevirici": divideTool(
    "numerator",
    "Numerator",
    "denominator",
    "Denominator",
    "Fraction to decimal",
    "Decimal value",
    "number",
    "Decimal = numerator ÷ denominator.",
  ),
  "cit-korkuluk-malzeme-hesabi": divideTool(
    "length",
    "Fence length",
    "postSpacing",
    "Post spacing",
    "Fence post count",
    "Estimated posts",
    "number",
    "Posts ≈ fence length ÷ post spacing.",
  ),
  "prefabrik-konteyner-olcu-hesaplama": multiplyTool(
    ["length", "width"],
    ["Length", "Width"],
    ["Container length", "Container width"],
    "Floor area",
    "Floor area",
    "number",
    "Floor area = length × width.",
  ),
  "yalitim-malzemesi-m-hesaplama": multiplyTool(
    ["areaM2", "layers"],
    ["Surface area", "Layers"],
    ["Insulated surface in m²", "Number of layers"],
    "Material area",
    "Total material area",
    "number",
    "Material area = surface area × number of layers.",
  ),
  "celik-cati-makas-yaklasik-agirligi": multiplyTool(
    ["span", "weightPerMeter"],
    ["Roof span", "Weight per meter"],
    ["Truss span in meters", "Approximate steel weight per meter"],
    "Truss weight",
    "Estimated weight",
    "number",
    "Estimated truss steel weight = span × weight per meter.",
  ),
  "npu-npi-profil-agirlik-hesaplama": multiplyTool(
    ["length", "kgPerMeter"],
    ["Profile length", "kg/m"],
    ["Bar length in meters", "Catalog weight per meter"],
    "Profile weight",
    "Total weight",
    "number",
    "Weight = length × kg/m.",
  ),
  "kosebent-lama-agirlik-hesaplama": multiplyTool(
    ["length", "kgPerMeter"],
    ["Bar length", "kg/m"],
    ["Angle bar length", "Catalog weight per meter"],
    "Bar weight",
    "Total weight",
    "number",
    "Weight = length × kg/m.",
  ),
  "boru-agirlik-hesaplama-celik-paslanmaz": multiplyTool(
    ["length", "kgPerMeter"],
    ["Pipe length", "kg/m"],
    ["Pipe run length", "Catalog pipe weight per meter"],
    "Pipe weight",
    "Total weight",
    "number",
    "Weight = length × kg/m.",
  ),
  "dogalgaz-tuketimi-hesaplama": multiplyTool(
    ["consumptionSm3", "unitPrice"],
    ["Consumption", "Unit price"],
    ["Natural gas consumption in sm³", "Price per sm³"],
    "Gas bill",
    "Estimated cost",
    "currency",
    "Cost = consumption × unit price.",
    "cost",
  ),
  "lpg-benzin-tasarruf-karsilastirma": {
    resultType: "cost",
    inputs: [
      nInput("lpgCost", "LPG cost", "USD", "Cost per km on LPG"),
      nInput("gasolineCost", "Gasoline cost", "USD", "Cost per km on gasoline"),
    ],
    formula: {
      kind: "subtract",
      headline: "Fuel cost delta",
      primaryLabel: "LPG savings per km",
      aKey: "gasolineCost",
      bKey: "lpgCost",
      format: "currency",
      explanation: "Savings per km = gasoline cost − LPG cost.",
    },
  },
  "dizel-benzin-maliyet-karsilastirma": {
    resultType: "cost",
    inputs: [
      nInput("dieselCost", "Diesel cost", "USD", "Cost per km on diesel"),
      nInput("gasolineCost", "Gasoline cost", "USD", "Cost per km on gasoline"),
    ],
    formula: {
      kind: "subtract",
      headline: "Fuel cost delta",
      primaryLabel: "Diesel savings per km",
      aKey: "gasolineCost",
      bKey: "dieselCost",
      format: "currency",
      explanation: "Savings per km = gasoline cost − diesel cost.",
    },
  },
  "akaryakit-fiyati-ile-yol-butcesi": multiplyTool(
    ["distanceKm", "costPerKm"],
    ["Distance", "Cost per km"],
    ["Trip distance in km", "Fuel cost per km"],
    "Trip fuel budget",
    "Trip fuel cost",
    "currency",
    "Trip fuel cost = distance × cost per km.",
    "cost",
  ),
  "fazla-mesai-ucreti-hesaplama": multiplyTool(
    ["overtimeHours", "hourlyRate"],
    ["Overtime hours", "Hourly rate"],
    ["Overtime hours worked", "Base hourly rate"],
    "Overtime pay",
    "Overtime pay",
    "currency",
    "Overtime pay = overtime hours × hourly rate (informational).",
    "cost",
  ),
  "enflasyon-fiyat-eskalasyonu-hesaplama": {
    resultType: "cost",
    inputs: [
      nInput("baseAmount", "Base amount", "USD", "Starting amount"),
      nInput("inflationPercent", "Inflation rate", "%", "Inflation percent to apply once", { defaultValue: 8 }),
    ],
    formula: {
      kind: "multiply",
      headline: "Inflation-adjusted amount",
      primaryLabel: "Escalated amount",
      keys: ["baseAmount", "inflationPercent"],
      format: "currency",
      explanation: "Single-period escalation ≈ base × (1 + rate/100) — informational only.",
    },
  },
  "boya-kaplama-sarfiyati-m-basina-hesabi": divideTool(
    "areaM2",
    "Coverage area",
    "coveragePerLiter",
    "Coverage per liter",
    "Paint consumption",
    "Liters needed",
    "number",
    "Liters = wall area ÷ coverage per liter.",
  ),
  "civata-sikma-torku-hesaplama": multiplyTool(
    ["clampForce", "boltDiameterMm"],
    ["Clamp force", "Bolt diameter"],
    ["Target clamp force", "Nominal bolt diameter in mm"],
    "Torque index",
    "Torque index",
    "number",
    "Screening torque index = force × diameter (verify with torque spec).",
  ),
  "kaynak-dikis-hacmi-maliyeti-hesabi": multiplyTool(
    ["throatMm", "weldLengthM"],
    ["Throat", "Weld length"],
    ["Weld throat in mm", "Weld length in meters"],
    "Weld volume index",
    "Volume index",
    "number",
    "Volume index = throat × length (screening estimate).",
  ),
  "kesme-bukme-abkant-tonaj-hesabi": multiplyTool(
    ["sheetLengthMm", "sheetThicknessMm"],
    ["Sheet length", "Thickness"],
    ["Bend line length in mm", "Sheet thickness in mm"],
    "Tonnage index",
    "Tonnage index",
    "number",
    "Screening tonnage index = length × thickness.",
  ),
  "disli-modul-cap-hesaplama": multiplyTool(
    ["module", "teeth"],
    ["Module", "Teeth"],
    ["Gear module", "Number of teeth"],
    "Pitch diameter",
    "Pitch diameter",
    "number",
    "Pitch diameter ≈ module × teeth.",
  ),
  "jenerator-kapasitesi-secim-hesaplama": {
    resultType: "quantity",
    inputs: [
      nInput("peakLoadKw", "Peak load", "kW", "Peak load in kW"),
      nInput("safetyFactor", "Safety factor", "×", "Recommended safety factor", { defaultValue: 1.25 }),
    ],
    formula: {
      kind: "multiply",
      headline: "Generator size",
      primaryLabel: "Required kW",
      keys: ["peakLoadKw", "safetyFactor"],
      format: "number",
      explanation: "Required generator kW ≈ peak load × safety factor.",
    },
  },
  "kablo-kesiti-mm-secim-hesaplama": divideTool(
    "loadAmps",
    "Load current",
    "ampacityPerMm2",
    "Ampacity per mm²",
    "Cable sizing",
    "Minimum cross-section",
    "number",
    "Cross-section mm² ≈ load amps ÷ ampacity per mm².",
  ),
  "gerilim-dusumu-hesaplama": multiplyTool(
    ["current", "lineLengthM"],
    ["Current", "Line length"],
    ["Load current in amps", "One-way cable length in meters"],
    "Voltage drop index",
    "Drop index",
    "number",
    "Drop index = current × length (use with cable resistance tables).",
  ),
  "topraklama-direnci-hesaplama": {
    resultType: "quantity",
    inputs: [nInput("measuredOhms", "Measured resistance", "Ω", "Ground resistance reading")],
    formula: {
      kind: "identity",
      headline: "Ground resistance check",
      primaryLabel: "Resistance",
      key: "measuredOhms",
      format: "number",
      explanation: "Displays measured ground resistance — compare to local code limits.",
    },
  },
  "aku-kapasitesi-calisma-suresi-hesabi": divideTool(
    "batteryAh",
    "Battery capacity",
    "loadAmps",
    "Load current",
    "Battery runtime",
    "Runtime hours",
    "number",
    "Runtime hours ≈ battery Ah ÷ load amps.",
  ),
  "aydinlatma-armatur-sayisi-hesaplama": divideTool(
    "totalLumensNeeded",
    "Total lumens",
    "lumensPerFixture",
    "Lumens per fixture",
    "Lighting layout",
    "Fixture count",
    "number",
    "Fixtures ≈ total lumens ÷ lumens per fixture.",
  ),
  "ups-kesintisiz-guc-kaynagi-secimi": multiplyTool(
    ["loadWatts", "runtimeMinutes"],
    ["Load", "Runtime"],
    ["Connected load in watts", "Required runtime in minutes"],
    "VA estimate",
    "VA estimate",
    "number",
    "Screening VA estimate = load × runtime factor.",
  ),
  "kompresor-debisi-tank-hacmi-hesabi": multiplyTool(
    ["flowCfm", "fillMinutes"],
    ["Compressor flow", "Fill time"],
    ["Compressor flow rate", "Desired tank fill time in minutes"],
    "Tank volume index",
    "Tank index",
    "number",
    "Tank sizing index = flow × fill time.",
  ),
  "hidrolik-silindir-itme-kuvveti-hesabi": multiplyTool(
    ["pressureBar", "boreMm"],
    ["Pressure", "Bore diameter"],
    ["System pressure in bar", "Cylinder bore in mm"],
    "Force index",
    "Force index",
    "number",
    "Force index = pressure × bore (screen with bore area).",
  ),
  "pnomatik-silindir-kuvvet-hesabi": multiplyTool(
    ["pressureBar", "boreMm"],
    ["Pressure", "Bore diameter"],
    ["Air pressure in bar", "Cylinder bore in mm"],
    "Force index",
    "Force index",
    "number",
    "Force index = pressure × bore (screen with bore area).",
  ),
  "hidrolik-pompa-gucu-hesaplama": multiplyTool(
    ["flowLpm", "pressureBar"],
    ["Flow", "Pressure"],
    ["Flow in L/min", "Pressure in bar"],
    "Power index",
    "Power index",
    "number",
    "Power index = flow × pressure (screening estimate).",
  ),
  "boru-capi-akis-hizi-hesaplama": divideTool(
    "flowLpm",
    "Flow rate",
    "velocityMps",
    "Target velocity",
    "Pipe diameter",
    "Diameter index",
    "number",
    "Diameter index ≈ flow ÷ velocity (screening).",
  ),
  "pompa-gucu-basma-yuksekligi-hesabi": multiplyTool(
    ["flowM3h", "headM"],
    ["Flow", "Head"],
    ["Flow in m³/h", "Total head in meters"],
    "Pump power index",
    "Power index",
    "number",
    "Power index = flow × head (screening estimate).",
  ),
  "su-debisi-litre-dakika-hesaplama": divideTool(
    "volumeLiters",
    "Volume",
    "minutes",
    "Minutes",
    "Flow rate",
    "L/min",
    "number",
    "Flow L/min = volume ÷ minutes.",
  ),
  "isitma-sogutma-yuku-kcal-kw-hesabi": {
    resultType: "quantity",
    inputs: [
      nInput("areaM2", "Area", "m²", "Conditioned floor area"),
      nInput("loadKcal", "Load factor", "kcal/h·m²", "Load factor kcal/h·m²", { defaultValue: 100 }),
    ],
    formula: {
      kind: "multiply",
      headline: "Heating/cooling load",
      primaryLabel: "Load kcal/h",
      keys: ["areaM2", "loadKcal"],
      format: "number",
      explanation: "Load kcal/h = area × load factor.",
    },
  },
  "radyator-petek-boyu-hesaplama": divideTool(
    "heatLoadKcal",
    "Heat load",
    "panelOutputKcal",
    "Panel output",
    "Radiator length",
    "Panel count index",
    "number",
    "Panel index ≈ heat load ÷ panel output per section.",
  ),
  "arac-amortisman-hesaplama": {
    resultType: "cost",
    inputs: [
      nInput("vehicleCost", "Vehicle cost", "USD", "Purchase price"),
      nInput("salvageValue", "Salvage value", "USD", "Expected salvage value"),
      nInput("usefulLifeYears", "Useful life", "years", "Depreciation years", { defaultValue: 5 }),
    ],
    formula: {
      kind: "divide",
      headline: "Vehicle depreciation",
      primaryLabel: "Annual depreciation",
      numerator: "vehicleCost",
      denominator: "usefulLifeYears",
      format: "currency",
      explanation: "Straight-line annual depreciation ≈ (cost − salvage) ÷ years (informational).",
    },
  },
  "mtv-motorlu-tasitlar-vergisi-hesaplama": {
    resultType: "cost",
    inputs: [
      nInput("engineCc", "Engine displacement", "cc", "Engine size in cc"),
      nInput("ageFactor", "Age factor", "×", "Informational age band factor", { defaultValue: 1 }),
    ],
    formula: {
      kind: "multiply",
      headline: "MTV estimate index",
      primaryLabel: "Tax index",
      keys: ["engineCc", "ageFactor"],
      format: "number",
      explanation: "Informational index only — not official tax calculation.",
    },
  },
};

const I18N_DESC = {
  tr: (title) => `${title} — tarayıcıda anında sonuç (bilgilendirme amaçlı).`,
  de: (title) => `${title} — sofortige Browser-Ergebnisse (nur zur Information).`,
  fr: (title) => `${title} — résultats instantanés dans le navigateur (informatif).`,
  es: (title) => `${title} — resultados instantáneos en el navegador (informativo).`,
};

const roadmap = extractConstArray("src/data/free-traffic-tool-roadmap.ts", "FREE_TRAFFIC_TOOL_ROADMAP");
const rank = { "very-high": 0, high: 1, medium: 2, low: 3 };
const batch = roadmap
  .filter((x) => x.status === "planned")
  .sort((a, b) => (rank[a.trafficPotential] ?? 9) - (rank[b.trafficPotential] ?? 9) || a.id.localeCompare(b.id))
  .slice(0, 50);

if (batch.length !== 50) {
  console.error("Expected 50 planned items, got", batch.length);
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
  join(ROOT, "src/lib/tools/roadmap-free-batch1-catalog.generated.json"),
  `${JSON.stringify(catalog, null, 2)}\n`,
);

const specs = {};
for (const item of batch) {
  specs[item.slug] = FORMULA_BY_SLUG[item.slug].formula;
}
writeFileSync(
  join(ROOT, "src/lib/tools/roadmap-free-batch1-specs.generated.ts"),
  `/** Generated by scripts/generate-roadmap-free-batch1.mjs — do not edit manually. */\nimport type { Batch1FormulaSpec } from "@/lib/tools/roadmap-free-batch1/engine";\n\nexport const ROADMAP_FREE_BATCH1_SPECS: Readonly<Record<string, Batch1FormulaSpec>> = ${JSON.stringify(specs, null, 2)} as const;\n`,
);

writeFileSync(
  join(ROOT, "src/lib/tools/roadmap-free-batch1-calculators.ts"),
  `/** Generated by scripts/generate-roadmap-free-batch1.mjs — do not edit manually. */\nimport type { FreeTrafficInputValues } from "@/lib/tools/free-traffic-calculators";\nimport { runBatch1Formula, setBatch1FormatLocale, type Batch1CalcPartial } from "@/lib/tools/roadmap-free-batch1/engine";\nimport { ROADMAP_FREE_BATCH1_SPECS } from "@/lib/tools/roadmap-free-batch1-specs.generated";\n\nexport const ROADMAP_FREE_BATCH1_SLUGS = Object.freeze(Object.keys(ROADMAP_FREE_BATCH1_SPECS));\n\nexport function calculateRoadmapFreeBatch1Tool(\n  slug: string,\n  values: FreeTrafficInputValues,\n  locale = "en",\n): Batch1CalcPartial {\n  const spec = ROADMAP_FREE_BATCH1_SPECS[slug];\n  if (!spec) {\n    throw new Error(\`Unknown roadmap batch-1 calculator slug: \${slug}\`);\n  }\n  setBatch1FormatLocale(locale);\n  if (slug === "enflasyon-fiyat-eskalasyonu-hesaplama") {\n    const base = Number(values.baseAmount ?? 0);\n    const rate = Number(values.inflationPercent ?? 0);\n    return runBatch1Formula(\n      {\n        kind: "multiply",\n        headline: "Inflation-adjusted amount",\n        primaryLabel: "Escalated amount",\n        keys: ["baseAmount", "inflationPercent"],\n        format: "currency",\n        explanation: "Single-period escalation ≈ base × (1 + rate/100) — informational only.",\n      },\n      { baseAmount: base * (1 + rate / 100), inflationPercent: 1 },\n    );\n  }\n  if (slug === "arac-amortisman-hesaplama") {\n    const cost = Number(values.vehicleCost ?? 0);\n    const salvage = Number(values.salvageValue ?? 0);\n    const years = Math.max(Number(values.usefulLifeYears ?? 1), 0.01);\n    return runBatch1Formula(\n      {\n        kind: "divide",\n        headline: "Vehicle depreciation",\n        primaryLabel: "Annual depreciation",\n        numerator: "depreciableBase",\n        denominator: "usefulLifeYears",\n        format: "currency",\n        explanation: "Straight-line annual depreciation ≈ (cost − salvage) ÷ years (informational).",\n      },\n      { ...values, depreciableBase: Math.max(cost - salvage, 0), usefulLifeYears: years },\n    );\n  }\n  return runBatch1Formula(spec, values);\n}\n\nexport function hasRoadmapFreeBatch1Calculator(slug: string): boolean {\n  return slug in ROADMAP_FREE_BATCH1_SPECS;\n}\n`,
);

// i18n batch translations from roadmap titles
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
  join(ROOT, "src/data/roadmap-free-batch1-i18n.generated.json"),
  `${JSON.stringify(i18nBatch, null, 2)}\n`,
);

// Patch strategic source free items
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

console.log("Wrote batch-1 catalog (50 tools), specs, calculators, i18n, and patched strategic source.");
console.log("Next: node scripts/generate-strategic-roadmap-data.mjs");
