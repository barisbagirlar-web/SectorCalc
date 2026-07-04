#!/usr/bin/env node

/**
 * Process premium formulas batch file.
 * Parses the user's formulas and generates schema files + formula registry entries.
 *
 * Usage: node scripts/process-premium-formulas.mjs
 *
 * The formulas file contains entries in this format:
 * TOOL NAME FORMULAS: formula1; formula2; ... INPUTS: Persona: Input1 (type), Input2 (type); Persona2: Input3 (type)
 *
 * This script:
 * 1. Parses each tool entry
 * 2. Generates a proper slug
 * 3. Writes the schema file
 * 4. Generates the formula registry additions
 * 5. Outputs the changes needed for schema-registry.ts
 */

import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";

const FORMULAS_FILE = "archive/migration-only/data/premium-formulas-batch.txt";
const SCHEMAS_DIR = "src/lib/premium-schema/schemas";
const FORMULA_REGISTRY_FILE = "src/lib/premium-schema/formula-registry.ts";
const SCHEMA_REGISTRY_FILE = "src/lib/premium-schema/schema-registry.ts";

// ============================================================
// 1. Parse formulas file
// ============================================================

const raw = fs.readFileSync(FORMULAS_FILE, "utf-8");

// Each line is a separate tool entry
const lines = raw.split("\n").filter(Boolean);

function parseToolLine(line) {
  // Split on FORMULAS: ... INPUTS:
  const formulasMatch = line.match(/^(.*?)FORMULAS:\s*(.*?)\s*INPUTS:\s*(.*)$/);
  if (!formulasMatch) {
    console.error(`[WARN] Could not parse line: ${line.slice(0, 80)}...`);
    return null;
  }

  const name = formulasMatch[1].trim();
  const formulasRaw = formulasMatch[2].trim();
  const inputsRaw = formulasMatch[3].trim();

  // Parse formulas (separated by ;)
  const formulas = formulasRaw.split(";").map(f => f.trim()).filter(Boolean);

  // Parse inputs (separated by ; between personas)
  // Each persona group: Persona: Input1 (type), Input2 (type)
  const inputGroups = [];
  const personaRegex = /([^:]+?):\s*([^;]+)/g;
  let m;
  while ((m = personaRegex.exec(inputsRaw)) !== null) {
    const persona = m[1].trim();
    const inputsStr = m[2].trim();
    const inputItems = [];
    const inputRegex = /([^(,]+?)\s*\(([^)]+)\)/g;
    let im;
    while ((im = inputRegex.exec(inputsStr)) !== null) {
      inputItems.push({
        label: im[1].trim(),
        type: im[2].trim(),
      });
    }
    inputGroups.push({ persona, inputs: inputItems });
  }

  // Generate slug from name
  const slug = generateSlug(name);

  return { name, slug, formulas, inputGroups, line };
}

function generateSlug(name) {
  const tr = name
    .toLowerCase()
    .replace(/[&]/g, "ve")
    .replace(/[^a-z0-9ığüşöç\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/[ı]/g, "i")
    .replace(/[ğ]/g, "g")
    .replace(/[ü]/g, "u")
    .replace(/[ş]/g, "s")
    .replace(/[ö]/g, "o")
    .replace(/[ç]/g, "c")
    .replace(/-+$/, "")
    .replace(/^-+/, "");
  return tr + "-analyzer";
}

function toPascalCase(slug) {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join("")
    .replace(/[0-9]/g, "") || "Tool";
}

const tools = [];
for (const line of lines) {
  const t = parseToolLine(line);
  if (t) tools.push(t);
}

console.log(`\nParsed ${tools.length} tools from formulas file.\n`);

// ============================================================
// 2. Check existing schemas
// ============================================================

const existingSchemaFiles = fs.readdirSync(SCHEMAS_DIR).filter(f => f.endsWith(".ts"));
const existingSchemaNames = new Set(existingSchemaFiles.map(f => f.replace(".ts", "")));

const EXISTING_SLUG_MAP = {
  // Map of user tool names to existing schema slugs
  "AI TOKEN MALİYET": "ai-token-cost-analyzer",
  "ALTI SİGMA PROJECT ÖNCELİKLENDİRİCİ": "six-sigma-project-prioritizer",
  "AQL SAMPLING RİSK & MALİYET": "aql-sampling-risk-analyzer",
  "ARAÇ AMORTİSMANI": "vehicle-depreciation-tco-analyzer",
  "ARIZA SÜRESİ MALİYETİ": "downtime-cost-analyzer",
  "AUTO REPAIR COMEBACK": "auto-repair-comeback-analyzer",
  "AUTO REPAIR QUOTE": "auto-repair-quote-consistency-analyzer",
  "AUTO SHOP MARGIN KAÇAK": "auto-shop-margin-leak-analyzer",
  "BASINÇ VESSEL KALINLIK": "asme-pressure-vessel-analyzer",
  "BASINÇLI HAVA ENERJİ": "compressed-air-energy-cost-analyzer",
  "BAŞABAŞ NOKTASI": "break-even-margin-of-safety-analyzer",
  "CONCRETE HACMİ": "concrete-volume-cost-analyzer",
  "CALIBRATION DEVIATION": "calibration-drift-risk-analyzer",
  "CBAM MARUZİYET": "cbam-exposure-analyzer",
  "CBAM UYUMLULUK": "cbam-compliance-verdict-analyzer",
  "CHATTER YÜZEY KALİTE": "chatter-surface-quality-analyzer",
  "CIVATE TORK": "bolt-torque-preload-analyzer",
  "CİRO MALİYETİ": "employee-turnover-cost-analyzer",
  "CLOUD API OVERRUN": "cloud-api-overrun-analyzer",
  "CLOUD WASTE ELIMINATION": "cloud-waste-elimination-analyzer",
  "CLV / CAC ORANI": "clv-cac-ratio-analyzer",
  "CNC ÇEVRİM SÜRESİ": "cnc-cycle-time-analyzer",
  "CNC İŞLEME MALİYETİ": "cnc-machining-cost-analyzer",
  "CPK TO PPM": "cpk-ppm-converter-analyzer",
  "CPM GECİKME CEZASI": "cpm-delay-penalty-analyzer",
  "ÇATI ALANI": "roof-area-load-analyzer",
  "DARBOĞAZ INVESTMENT": "bottleneck-investment-analyzer",
  "DEĞİŞİM MATRİSİ SMED": "smed-changeover-matrix-analyzer",
  "DEPO YERLEŞİMİ": "warehouse-layout-analyzer",
  "DEVAMSIZLIK MALİYETİ": "absenteeism-cost-analyzer",
  "DIGITAL TWIN MALİYET": "digital-twin-cost-analyzer",
  "DİKİŞ HATTI DENGELEYİCİ": "sewing-line-balance-analyzer-pro",
  "DYE REÇETE MALİYET": "dye-recipe-cost-analyzer",
  "ENERJİ TÜKETİM RAPORU": "energy-consumption-report-analyzer",
  "ENFLASYON ESKALASYON": "inflation-escalation-analyzer",
  "ENVIRONMENTAL WASTE": "environmental-waste-cost-analyzer",
  "EOQ ENVANTER": "eoq-inventory-optimizer-analyzer",
  "EVM MALİYET FORECAST": "evm-cost-forecast-analyzer",
  "FABRİKA YERLEŞİM DISTANCE": "factory-layout-distance-analyzer",
  "FAİZ ORANI RİSKİ": "interest-rate-risk-analyzer",
  "FILAMENT RECYCLING": "filament-recycling-analyzer",
  "FİYAT ESNEKLİĞİ": "price-elasticity-analyzer",
  "FLEXIBLE MANUFACTURING ROI": "flexible-manufacturing-roi-analyzer",
  "GAGE R&R MALİYET": "gage-rnr-cost-analyzer",
  "GIDA FİRE MARGIN": "food-waste-margin-analyzer",
  "GÜBRE DOZAJ": "fertilizer-dosage-analyzer",
  "HACCP DEVIATION": "haccp-deviation-cost-analyzer",
  "HACİMSEL AĞIRLIK": "volumetric-weight-chargeable-analyzer",
  "HAFİFLİK MALİYET TASARRUFU": "lightweight-cost-savings-analyzer",
  "HURDA ORANI OPTİMİZE": "scrap-rate-optimize-analyzer",
  "HVAC KAPASİTE": "hvac-capacity-analyzer",
  "HYDRAULIC SİSTEM LOSS": "hydraulic-system-loss-analyzer",
  "ISI EXCHANGER FOULING": "heat-exchanger-fouling-analyzer",
  "ISO 50001 BASELINE": "iso-50001-baseline-analyzer",
  "İÇ VERİM ORANI IRR": "irr-investment-analyzer",
  "İLERLEME YEM MALİYET": "feed-cost-formulation-analyzer",
  "İSKELE KİRALAMA": "scaffold-rental-cost-analyzer",
  "İSTATİSTİKSEL PROCESS CONTROL": "spc-limit-control-analyzer",
  "İŞLEME STRATEJİSİ SÜRE": "machining-strategy-analyzer",
  "KAIZEN SAVINGS TAKİPÇİSİ": "kaizen-savings-tracker-analyzer",
  "Quality Maliyeti PAF": "quality-cost-paf-analyzer",
  "Karbon Ayak izi Check": "carbon-footprint-check-analyzer",
  "Resource Hacmi ve Maliyeti": "weld-volume-cost-analyzer",
  "Resource Maliyeti": "weld-cost-analysis-analyzer",
  "Resource Mukavemeti": "weld-strength-analyzer",
  "Kesim Parameters Takım ömrü": "cutting-tool-life-analyzer",
  "Kesme-Dolgu Denge": "cut-fill-balance-analyzer",
  "Kiriş Ağırlığı": "beam-weight-analyzer",
  "Kompresör Kaçağı Cost": "compressed-air-leak-analyzer",
  "Kompresör Tankı Boyutlandırma": "compressor-tank-sizing-analyzer",
  "Konteyner Yükü": "container-load-analyzer",
  "Kumaş Kesim Optimize Edici": "fabric-cutting-optimizer-analyzer",
  "Kur Riski": "currency-risk-analyzer",
  "KWh Cost": "kwh-cost-analyzer",
  "Lojistik Rota Kaybı": "logistics-route-loss-analyzer",
  "Mağaza Saatlik Ücret": "shop-hourly-rate-analyzer",
  "Mahsul Efficiency Kaybı Analysisörü": "crop-yield-loss-analyzer",
  "Makine Ekonomik Ömrü": "machine-economic-life-analyzer",
  "Material Replacement Cost": "material-replacement-cost-analyzer",
  "MOQ Inventory Denge": "moq-stock-balance-analyzer",
  "MTBF/MTTR Finansal Etki": "mtbf-mttr-financial-analyzer",
  "Muda Atık Cost": "muda-waste-cost-analyzer",
  "Nakit Akışı Açığı": "cash-flow-gap-analyzer",
  "Navlun Maliyeti": "freight-cost-analyzer",
  "Noise & Vibration Cost": "noise-vibration-cost-analyzer",
  "OEE ve Durma Süresi": "oee-downtime-analyzer",
  "Ofis Malzemeleri Cost": "office-supplies-cost-analyzer",
  "Overtime vs. Hiring Breakeven": "overtime-hiring-breakeven-analyzer",
  "Ödeme Vadesi Optimize Edici": "payment-terms-optimizer-analyzer",
  "Öğrenme Eğrisi Süre Tahmincisi": "learning-curve-time-analyzer",
  "Örneklem Büyüklüğü": "sample-size-industrial-analyzer",
  "Palet Rafı Optimize Edici": "pallet-rack-optimizer-analyzer",
  "Poka-Yoke ROI": "poka-yoke-roi-analyzer",
  "Porsiyon Cost": "portion-cost-analyzer",
  "Project Cost Prediction": "project-cost-estimate-analyzer",
  "Project Overrun risk": "project-overrun-analyzer",
  "reçete Cost Check": "recipe-cost-check-analyzer",
  "Restaurant Menü Margin Kaçak": "restaurant-menu-margin-leak-analyzer",
  "Robot Kol vs. Manuel İşçi": "robot-vs-manual-analyzer",
  "Rota Cost": "route-cost-analyzer",
  "Rota Optimizasyonu Analysisörü": "route-optimization-analyzer",
  "Rüzgar Türbini Yatırım Getirisi": "wind-turbine-investment-analyzer",
  "SaaS Shelfware Cost": "saas-shelfware-analyzer",
  "Saatlik Ücret": "hourly-rate-analyzer",
  "SMED Değişim Optimize Edici": "smed-changeover-optimizer-analyzer",
  "Sözleşme Teşvik": "contract-incentive-analyzer",
  "SPC Signal Delay Cost": "spc-signal-delay-analyzer",
  "Steam Trap Energy kayıp": "steam-trap-energy-loss-analyzer",
  "Inventory Devir hızı risk": "inventory-turnover-risk-analyzer",
  "Su Kullanımı Optimize Edici": "water-usage-optimizer-analyzer",
  "Sulama Cost Check": "irrigation-cost-check-analyzer",
  "Supplier Performance Tco": "supplier-performance-tco-analyzer",
  "Süt Kâr Dedektörü": "dairy-profit-detector-analyzer",
  "Taguchi quality kayıp Fonksiyon": "taguchi-quality-loss-analyzer",
  "Takım Aşınma Maliyeti": "tool-wear-cost-analyzer",
  "Takt Süre Flexibility Cost": "takt-time-flexibility-analyzer",
  "demand Forecast Inventory Cost": "demand-forecast-stock-analyzer",
  "Tamirhane Parça ve İşçilik Teklif": "repair-shop-quote-analyzer",
  "Taşeron Margin Sızıntı Dedektörü": "subcontractor-margin-leak-analyzer",
  "Taşıma Mode Cost risk": "transport-mode-risk-analyzer",
  "Tedarik Zinciri Kesintisi Risk Değerlendirmesi": "supply-chain-disruption-analyzer",
  "Tedarikçi Döviz Kuru Riski": "supplier-currency-risk-analyzer",
  "Teklif Risk Analysisörü": "bid-risk-analyzer",
  "Tekrarlayan Cost (RCA)": "recurring-cost-analyzer",
  "Tekstil Atığı Risk Değerlendirmesi": "textile-waste-risk-analyzer",
  "Temizlik Teklifi Optimize Edici": "cleaning-bid-optimizer-analyzer",
  "Teslimat Maliyeti": "delivery-cost-analyzer",
  "Tohum Ratioı": "seed-rate-analyzer",
  "Total Çalışan Maliyeti": "total-employee-cost-analyzer",
  "Transfer Fiyatlandırması Optimize Edici": "transfer-pricing-optimizer-analyzer",
  "ürün Complexity Hidden Cost": "product-complexity-hidden-cost-analyzer",
  "Vakum Kaçağı Energy Kaybı": "vacuum-leak-energy-analyzer",
  "Vardiya Cost Verimliliği": "shift-cost-efficiency-analyzer",
  "Vsm finansal Dönüştürücü": "vsm-financial-converter-analyzer",
  "WPS Preheat Sıcaklık": "wps-preheat-temperature-analyzer",
  "Yakıt Rota Deviation": "fuel-route-drift-analyzer",
  "Yangın Hidrantı Akış": "waste-hydrant-flow-analyzer",
  "Yenileme Bütçesi Optimize Edici": "renovation-budget-optimizer-analyzer",
  "Yenilenebilir Energy YG": "renewable-energy-irr-analyzer",
  "YG ve NBD": "roi-npv-analyzer",
  "Zaman Etüdü Analysisörü": "standard-time-work-study-calculator",
};

// Output report
console.log("=".repeat(80));
console.log("TOOL TO SCHEMA MAPPING REPORT");
console.log("=".repeat(80));

for (const tool of tools) {
  const existing = EXISTING_SLUG_MAP[tool.name];
  const status = existing ? `EXISTS → ${existing}` : "NEW → no mapping found";
  console.log(`  ${tool.name.padEnd(45)} ${status}`);
}

console.log("\nMapped tools:", tools.length);
console.log("Existing schemas in map:", Object.keys(EXISTING_SLUG_MAP).length);
console.log("");

// ============================================================
// 3. Generate formula ID for each formula
// ============================================================

function extractFormulaVarNames(formulaStr) {
  // Extract variable names from formula expressions
  // e.g., "BasePromptCost = (PromptTokens * PromptPrice) / 1000000"
  const eqParts = formulaStr.split("=");
  if (eqParts.length < 2) return { outputVar: null, expression: formulaStr, vars: [] };
  const outputVar = eqParts[0].trim();
  const expression = eqParts.slice(1).join("=").trim();
  // Find variable names (capitalized words excluding numbers and operators)
  const varPattern = /[A-Za-z_][A-Za-z_0-9]*/g;
  const allWords = expression.match(varPattern) || [];
  const operators = new Set(["SUM", "SQRT", "ABS", "MAX", "MIN", "IF", "STDEV", "AVERAGE",
    "CEILING", "FLOOR", "COS", "SIN", "TAN", "ACOS", "LOG", "LOG10", "LN",
    "NORMSDIST", "NORMSINV", "BINOMDIST", "LOOKUP", "SORT", "T", "PI", "E", "TRUE", "FALSE",
    "AND", "OR", "FLOOR", "ARRAY", "MATRIX", "INDEX", "MATCH", "VLOOKUP", "HLOOKUP",
    "POWER", "EXP", "FACT", "MOD", "INT", "ROUND", "ROUNDUP", "ROUNDDOWN"]);
  const vars = allWords.filter(w =>
    w.length > 1 &&
    !operators.has(w) &&
    !/^\d+$/.test(w) &&
    w !== outputVar
  );
  return { outputVar, expression, vars };
}

function getToolFormulaId(tool, idx) {
  // Generate a clean formula ID based on tool name
  const prefix = tool.slug.replace(/-analyzer$/, "").replace(/-/g, "_");
  return `tool_${prefix}_${idx}`;
}

// ============================================================
// 4. Generate output for each tool
// ============================================================

const OUTPUT_DIR = path.join("scripts", "generated-premium");
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

// Generate individual schema files
let allSchemasOutput = "";
let allRegistryImports = "";
let allRegistryEntries = "";
let allSlugMapEntries = "";

for (const tool of tools) {
  const existingSlug = EXISTING_SLUG_MAP[tool.name];
  const effectiveSlug = existingSlug || tool.slug;
  const pascalName = effectiveSlug
    .replace(/-analyzer$/, "")
    .replace(/-/g, " ")
    .replace(/\b\w/g, c => c.toUpperCase())
    .replace(/\s+/g, "");
  const constName = `${pascalName.toUpperCase().replace(/-/g, "_")}_SCHEMA`;

  // Generate input definitions
  const inputDefs = [];
  let idCounter = 1;
  for (const group of tool.inputGroups) {
    for (const input of group.inputs) {
      const inputId = input.label
        .toLowerCase()
        .replace(/[^a-z0-9ığüşöç\s]/g, "")
        .trim()
        .replace(/\s+/g, "_")
        .replace(/[ı]/g, "i")
        .replace(/[ğ]/g, "g")
        .replace(/[ü]/g, "u")
        .replace(/[ş]/g, "s")
        .replace(/[ö]/g, "o")
        .replace(/[ç]/g, "c");
      const type = input.type === "enum" ? "text" : input.type === "currency" ? "number" : input.type;
      const unit = input.type === "currency" ? "currency" : input.type === "number" ? "" : "";
      inputDefs.push({
        id: inputId || `input_${idCounter}`,
        label: input.label,
        type,
        unit,
        required: true,
        persona: group.persona,
      });
      idCounter++;
    }
  }

  // Generate formula pipeline (basic)
  const pipeline = tool.formulas.map((f, idx) => {
    const { outputVar, expression, vars } = extractFormulaVarNames(f);
    const formulaId = getToolFormulaId(tool, idx);
    const inputMap = {};
    for (const v of vars) {
      // Map to snake_case input ID
      const mappedId = v
        .replace(/([A-Z])/g, "_$1")
        .toLowerCase()
        .replace(/^_/, "");
      // Find matching input in our definitions
      const matchingInput = inputDefs.find(d =>
        mappedId.includes(d.id) || d.id.includes(mappedId) || v.toLowerCase().includes(d.id.replace(/_/g, ""))
      );
      inputMap[v] = matchingInput ? matchingInput.id : mappedId;
    }
    return {
      formulaId: `custom.${tool.slug.replace(/-/g, "_")}_${idx}`,
      inputMap,
      outputId: outputVar ? outputVar.replace(/([A-Z])/g, "_$1").toLowerCase().replace(/^_/, "") : `output_${idx}`,
    };
  });

  // Generate output definitions
  const outputDefs = tool.formulas.map((f, idx) => {
    const { outputVar } = extractFormulaVarNames(f);
    if (outputVar) {
      return {
        id: pipeline[idx].outputId,
        label: outputVar.replace(/([A-Z])/g, " $1").trim(),
        unit: "currency",
        format: "currency",
      };
    }
    return {
      id: pipeline[idx].outputId,
      label: `Output ${idx + 1}`,
      unit: "",
      format: "number",
    };
  });

  // Schema file content
  const schemaContent = `/**
 * ${tool.name} — Premium Calculator Schema
 * Auto-generated from user-provided formulas
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const ${constName}: PremiumCalculatorSchema = {
  id: "${effectiveSlug}",
  legacyPaidSlug: "${effectiveSlug}",
  name: "${tool.name}",
  sectorSlug: "general",
  category: "cost",
  painStatement: "${tool.name} — premium analysis tool.",
  inputs: [${inputDefs.map(d => `
    { id: "${d.id}", label: "${d.label}", type: "${d.type}", required: true },`).join("")}
  ],
  outputs: [${outputDefs.map(d => `
    { id: "${d.id}", label: "${d.label}", unit: "${d.unit}", format: "${d.format}" },`).join("")}
  ],
  thresholds: [],
  formulaPipeline: [${pipeline.map(p => `
    { formulaId: "${p.formulaId}", inputMap: { ${Object.entries(p.inputMap).map(([k, v]) => `${k}: "${v}"`).join(", ")} }, outputId: "${p.outputId}" },`).join("")}
  ],
  reportTemplate: {
    title: "${tool.name} Report",
    sections: ["executive_summary", "loss_breakdown", "thresholds", "action_plan"],
    exportFormats: ["pdf"],
  },
  assumptions: {
    hiddenLossMultiplier: 1.0,
    volatilityPercent: 10,
    targetMarginPercent: 20,
    assumptionNotes: ["Based on user-provided formulas.", "Verify constants periodically."],
  },
};
`;

  // Write schema file
  const schemaFile = path.join(OUTPUT_DIR, `${effectiveSlug}.ts`);
  fs.writeFileSync(schemaFile, schemaContent, "utf-8");

  allSchemasOutput += `  ${tool.name.padEnd(45)} → ${effectiveSlug}\n`;
  allRegistryImports += `import { ${constName} } from "@/lib/premium-schema/schemas/${effectiveSlug}";\n`;
  allRegistryEntries += `  ${constName},\n`;
  allSlugMapEntries += `  "${effectiveSlug}": "${effectiveSlug}",\n`;
}

// Write summary
console.log("Generated schema files in:", OUTPUT_DIR);
console.log("\n--- SCHEMA FILES TO ADD ---");
console.log(allSchemasOutput);

console.log("\n--- IMPORTS TO ADD to schema-registry.ts ---");
console.log(allRegistryImports);

console.log("\n--- ARRAY ENTRIES TO ADD to PREMIUM_CALCULATOR_SCHEMAS ---");
console.log(allRegistryEntries);

console.log("\n--- SLUG MAP ENTRIES TO ADD to PREMIUM_SCHEMA_SLUG_MAP ---");
console.log(allSlugMapEntries);

// Write combined output for easy reference
const report = `# Premium Formulas Processing Report
Generated: ${new Date().toISOString()}

## Summary
- Total tools parsed: ${tools.length}
- Existing schemas mapped: ${Object.keys(EXISTING_SLUG_MAP).length}

## Schema Files Generated
${allSchemasOutput}

## Next Steps
1. Copy generated schema files to src/lib/premium-schema/schemas/
2. Add imports to schema-registry.ts
3. Add array entries to PREMIUM_CALCULATOR_SCHEMAS
4. Add slug map entries to PREMIUM_SCHEMA_SLUG_MAP
5. Add formula definitions to formula-registry.ts
6. Run npm run typecheck
`;

fs.writeFileSync(path.join(OUTPUT_DIR, "report.md"), report, "utf-8");
console.log("\nReport written to:", path.join(OUTPUT_DIR, "report.md"));
