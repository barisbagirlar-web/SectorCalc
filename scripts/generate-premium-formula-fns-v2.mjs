#!/usr/bin/env node

/**
 * V2: Generate EXACT TypeScript formula functions with CLEAN formula IDs.
 * Uses EXISTING_SLUG_MAP to generate readable prefixes.
 */

import fs from "node:fs";

const FORMULAS_FILE = "data/premium-formulas-batch.txt";
const OUTPUT_DIR = "scripts/generated-premium";

fs.mkdirSync(OUTPUT_DIR, { recursive: true });

/// ── Slug mapping (from process-premium-formulas.mjs) ──
const EXISTING_SLUG_MAP = {
  "AI TOKEN MALİYET": "ai-token-cost-analyzer",
  "ALTI SİGMA PROJE ÖNCELİKLENDİRİCİ": "six-sigma-project-prioritizer",
  "AQL SAMPLING RİSK & MALİYET": "aql-sampling-risk-analyzer",
  "ARAÇ AMORTİSMANI": "vehicle-depreciation-tco-analyzer",
  "ARIZA SÜRESİ MALİYETİ": "downtime-cost-analyzer",
  "AUTO REPAIR COMEBACK": "auto-repair-comeback-analyzer",
  "AUTO REPAIR QUOTE": "auto-repair-quote-consistency-analyzer",
  "AUTO SHOP MARJ KAÇAK": "auto-shop-margin-leak-analyzer",
  "BASINÇ VESSEL KALINLIK": "asme-pressure-vessel-analyzer",
  "BASINÇLI HAVA ENERJİ": "compressed-air-energy-cost-analyzer",
  "BAŞABAŞ NOKTASI": "break-even-margin-of-safety-analyzer",
  "BETON HACMİ": "concrete-volume-cost-analyzer",
  "CALIBRATION SAPMA": "calibration-drift-risk-analyzer",
  "CBAM MARUZİYET": "cbam-exposure-analyzer",
  "CBAM UYUMLULUK": "cbam-compliance-verdict-analyzer",
  "CHATTER YÜZEY KALİTE": "chatter-surface-quality-analyzer",
  "CIVATE TORK": "bolt-torque-preload-analyzer",
  "CİRO MALİYETİ": "employee-turnover-cost-analyzer",
  "CLOUD API OVERRUN": "cloud-api-overrun-analyzer",
  "CLOUD FIRE ELIMINATION": "cloud-waste-elimination-analyzer",
  "CLV / CAC ORANI": "clv-cac-ratio-analyzer",
  "CNC ÇEVRİM SÜRESİ": "cnc-cycle-time-analyzer",
  "CNC İŞLEME MALİYETİ": "cnc-machining-cost-analyzer",
  "CPK TO PPM": "cpk-ppm-converter-analyzer",
  "CPM GECİKME CEZASI": "cpm-delay-penalty-analyzer",
  "ÇATI ALANI": "roof-area-load-analyzer",
  "DARBOĞAZ YATIRIM": "bottleneck-investment-analyzer",
  "DEĞİŞİM MATRİSİ SMED": "smed-changeover-matrix-analyzer",
  "DEPO YERLEŞİMİ": "warehouse-layout-analyzer",
  "DEVAMSIZLIK MALİYETİ": "absenteeism-cost-analyzer",
  "DIGITAL TWIN MALİYET": "digital-twin-cost-analyzer",
  "DİKİŞ HATTI DENGELEYİCİ": "sewing-line-balance-analyzer-pro",
  "DYE REÇETE MALİYET": "dye-recipe-cost-analyzer",
  "ENERJİ TÜKETİM RAPORU": "energy-consumption-report-analyzer",
  "ENFLASYON ESKALASYON": "inflation-escalation-analyzer",
  "ENVIRONMENTAL FIRE": "environmental-waste-cost-analyzer",
  "EOQ ENVANTER": "eoq-inventory-optimizer-analyzer",
  "EVM MALİYET FORECAST": "evm-cost-forecast-analyzer",
  "FABRİKA YERLEŞİM MESAFE": "factory-layout-distance-analyzer",
  "FAİZ ORANI RİSKİ": "interest-rate-risk-analyzer",
  "FILAMENT RECYCLING": "filament-recycling-analyzer",
  "FİYAT ESNEKLİĞİ": "price-elasticity-analyzer",
  "FLEXIBLE MANUFACTURING ROI": "flexible-manufacturing-roi-analyzer",
  "GAGE R&R MALİYET": "gage-rnr-cost-analyzer",
  "GIDA FİRE MARJ": "food-waste-margin-analyzer",
  "GÜBRE DOZAJ": "fertilizer-dosage-analyzer",
  "HACCP DEVIATION": "haccp-deviation-cost-analyzer",
  "HACİMSEL AĞIRLIK": "volumetric-weight-chargeable-analyzer",
  "HAFİFLİK MALİYET TASARRUFU": "lightweight-cost-savings-analyzer",
  "HURDA ORANI OPTİMİZE": "scrap-rate-optimize-analyzer",
  "HVAC KAPASİTE": "hvac-capacity-analyzer",
  "HYDRAULIC SİSTEM KAYIP": "hydraulic-system-loss-analyzer",
  "ISI EXCHANGER FOULING": "heat-exchanger-fouling-analyzer",
  "ISO 50001 BASELINE": "iso-50001-baseline-analyzer",
  "İÇ VERİM ORANI IRR": "irr-investment-analyzer",
  "İLERLEME YEM MALİYET": "feed-cost-formulation-analyzer",
  "İSKELE KİRALAMA": "scaffold-rental-cost-analyzer",
  "İSTATİSTİKSEL PROSES KONTROL": "spc-limit-control-analyzer",
  "İŞLEME STRATEJİSİ SÜRE": "machining-strategy-analyzer",
  "KAIZEN TASARRUF TAKİPÇİSİ": "kaizen-savings-tracker-analyzer",
  "Kalite Maliyeti PAF": "quality-cost-paf-analyzer",
  "Karbon Ayak izi Check": "carbon-footprint-check-analyzer",
  "Kaynak Hacmi ve Maliyeti": "weld-volume-cost-analyzer",
  "Kaynak Maliyeti": "weld-cost-analysis-analyzer",
  "Kaynak Mukavemeti": "weld-strength-analyzer",
  "Kesim Parameters Takım ömrü": "cutting-tool-life-analyzer",
  "Kesme-Dolgu Denge": "cut-fill-balance-analyzer",
  "Kiriş Ağırlığı": "beam-weight-analyzer",
  "Kompresör Kaçağı Maliyet": "compressed-air-leak-analyzer",
  "Kompresör Tankı Boyutlandırma": "compressor-tank-sizing-analyzer",
  "Konteyner Yükü": "container-load-analyzer",
  "Kumaş Kesim Optimize Edici": "fabric-cutting-optimizer-analyzer",
  "Kur Riski": "currency-risk-analyzer",
  "KWh Maliyet": "kwh-cost-analyzer",
  "Lojistik Rota Kaybı": "logistics-route-loss-analyzer",
  "Mağaza Saatlik Ücret": "shop-hourly-rate-analyzer",
  "Mahsul Verim Kaybı Analizörü": "crop-yield-loss-analyzer",
  "Makine Ekonomik Ömrü": "machine-economic-life-analyzer",
  "Malzeme Replacement Maliyet": "material-replacement-cost-analyzer",
  "MOQ Stok Denge": "moq-stock-balance-analyzer",
  "MTBF/MTTR Finansal Etki": "mtbf-mttr-financial-analyzer",
  "Muda Atık Maliyet": "muda-waste-cost-analyzer",
  "Nakit Akışı Açığı": "cash-flow-gap-analyzer",
  "Navlun Maliyeti": "freight-cost-analyzer",
  "Noise & Vibration Maliyet": "noise-vibration-cost-analyzer",
  "OEE ve Durma Süresi": "oee-downtime-analyzer",
  "Ofis Malzemeleri Maliyet": "office-supplies-cost-analyzer",
  "Overtime vs. Hiring Breakeven": "overtime-hiring-breakeven-analyzer",
  "Ödeme Vadesi Optimize Edici": "payment-terms-optimizer-analyzer",
  "Öğrenme Eğrisi Süre Tahmincisi": "learning-curve-time-analyzer",
  "Örneklem Büyüklüğü": "sample-size-industrial-analyzer",
  "Palet Rafı Optimize Edici": "pallet-rack-optimizer-analyzer",
  "Poka-Yoke ROI": "poka-yoke-roi-analyzer",
  "Porsiyon Maliyet": "portion-cost-analyzer",
  "Project Maliyet Tahmin": "project-cost-estimate-analyzer",
  "Project Overrun risk": "project-overrun-analyzer",
  "reçete Maliyet Check": "recipe-cost-check-analyzer",
  "Restaurant Menü Marj Kaçak": "restaurant-menu-margin-leak-analyzer",
  "Robot Kol vs. Manuel İşçi": "robot-vs-manual-analyzer",
  "Rota Maliyet": "route-cost-analyzer",
  "Rota Optimizasyonu Analizörü": "route-optimization-analyzer",
  "Rüzgar Türbini Yatırım Getirisi": "wind-turbine-investment-analyzer",
  "SaaS Shelfware Maliyet": "saas-shelfware-analyzer",
  "Saatlik Ücret": "hourly-rate-analyzer",
  "SMED Değişim Optimize Edici": "smed-changeover-optimizer-analyzer",
  "Sözleşme Teşvik": "contract-incentive-analyzer",
  "SPC Signal Delay Maliyet": "spc-signal-delay-analyzer",
  "Steam Trap Enerji kayıp": "steam-trap-energy-loss-analyzer",
  "Stok Devir hızı risk": "inventory-turnover-risk-analyzer",
  "Su Kullanımı Optimize Edici": "water-usage-optimizer-analyzer",
  "Sulama Maliyet Check": "irrigation-cost-check-analyzer",
  "Supplier Performans Tco": "supplier-performance-tco-analyzer",
  "Süt Kâr Dedektörü": "dairy-profit-detector-analyzer",
  "Taguchi kalite kayıp Fonksiyon": "taguchi-quality-loss-analyzer",
  "Takım Aşınma Maliyeti": "tool-wear-cost-analyzer",
  "Takt Süre Flexibility Maliyet": "takt-time-flexibility-analyzer",
  "talep Forecast Stok Maliyet": "demand-forecast-stock-analyzer",
  "Tamirhane Parça ve İşçilik Teklif": "repair-shop-quote-analyzer",
  "Taşeron Marj Sızıntı Dedektörü": "subcontractor-margin-leak-analyzer",
  "Taşıma Mode Maliyet risk": "transport-mode-risk-analyzer",
  "Tedarik Zinciri Kesintisi Risk Değerlendirmesi": "supply-chain-disruption-analyzer",
  "Tedarikçi Döviz Kuru Riski": "supplier-currency-risk-analyzer",
  "Teklif Risk Analizörü": "bid-risk-analyzer",
  "Tekrarlayan Maliyet (RCA)": "recurring-cost-analyzer",
  "Tekstil Atığı Risk Değerlendirmesi": "textile-waste-risk-analyzer",
  "Temizlik Teklifi Optimize Edici": "cleaning-bid-optimizer-analyzer",
  "Teslimat Maliyeti": "delivery-cost-analyzer",
  "Tohum Oranı": "seed-rate-analyzer",
  "Toplam Çalışan Maliyeti": "total-employee-cost-analyzer",
  "Transfer Fiyatlandırması Optimize Edici": "transfer-pricing-optimizer-analyzer",
  "ürün Complexity Hidden Maliyet": "product-complexity-hidden-cost-analyzer",
  "Vakum Kaçağı Enerji Kaybı": "vacuum-leak-energy-analyzer",
  "Vardiya Maliyet Verimliliği": "shift-cost-efficiency-analyzer",
  "Vsm finansal Dönüştürücü": "vsm-financial-converter-analyzer",
  "WPS Preheat Sıcaklık": "wps-preheat-temperature-analyzer",
  "Yakıt Rota Sapma": "fuel-route-drift-analyzer",
  "Yangın Hidrantı Akış": "fire-hydrant-flow-analyzer",
  "Yenileme Bütçesi Optimize Edici": "renovation-budget-optimizer-analyzer",
  "Yenilenebilir Enerji YG": "renewable-energy-irr-analyzer",
  "YG ve NBD": "roi-npv-analyzer",
  "Zaman Etüdü Analizörü": "standard-time-work-study-calculator",
};

// ── Helpers ──
function isExcelFunc(name) {
  const fns = new Set([
    "SUM", "SQRT", "ABS", "MAX", "MIN", "IF", "CEILING", "FLOOR",
    "AVERAGE", "STDEV", "LOG10", "LN", "LOG", "COS", "SIN", "TAN",
    "ACOS", "ASIN", "ATAN", "EXP", "POWER", "PI", "ROUND", "ROUNDUP",
    "ROUNDDOWN", "INT", "MOD", "NORMSDIST", "NORMSINV", "BINOMDIST",
  ]);
  return fns.has(name);
}

const EXCEL_FUNCTIONS = {
  SQRT: { js: "Math.sqrt", builtin: true },
  ABS: { js: "Math.abs", builtin: true },
  MAX: { js: "Math.max", builtin: true },
  MIN: { js: "Math.min", builtin: true },
  CEILING: { js: "Math.ceil", builtin: true },
  FLOOR: { js: "Math.floor", builtin: true },
  LOG10: { js: "Math.log10", builtin: true },
  LN: { js: "Math.log", builtin: true },
  LOG: { js: "Math.log", builtin: true },
  COS: { js: "Math.cos", builtin: true },
  SIN: { js: "Math.sin", builtin: true },
  TAN: { js: "Math.tan", builtin: true },
  ACOS: { js: "Math.acos", builtin: true },
  ASIN: { js: "Math.asin", builtin: true },
  ATAN: { js: "Math.atan", builtin: true },
  EXP: { js: "Math.exp", builtin: true },
  PI: { js: "Math.PI", builtin: true },
  ROUND: { js: "Math.round", builtin: true },
  INT: { js: "Math.trunc", builtin: true },
  NORMSDIST: { js: "normStd", builtin: false },
};

function toCamel(name) {
  return name.charAt(0).toLowerCase() + name.slice(1);
}

function isNumeric(word) {
  return /^\d+\.?\d*$/.test(word);
}

function slugToPrefix(slug) {
  // ai-token-cost-analyzer → ai_token_cost
  return slug.replace(/-analyzer$/, "").replace(/-calculator$/, "").replace(/-/g, "_");
}

function convertExcelToJS(expr) {
  expr = expr.replace(/\^/g, "**");
  expr = expr.replace(/\bPI\b/g, "Math.PI");
  expr = expr.replace(/\bTRUE\b/g, "true");
  expr = expr.replace(/\bFALSE\b/g, "false");
  expr = expr.replace(/AND\s*\(([^,]+),\s*([^)]+)\)/g, "($1 && $2)");
  expr = expr.replace(/OR\s*\(([^,]+),\s*([^)]+)\)/g, "($1 || $2)");
  expr = expr.replace(/NOT\s*\(([^)]+)\)/g, "!($1)");
  
  for (const [excelF, jsInfo] of Object.entries(EXCEL_FUNCTIONS)) {
    if (excelF === "PI") continue;
    const re = new RegExp(`\\b${excelF}\\s*\\(`, "g");
    if (jsInfo.builtin) {
      expr = expr.replace(re, `${jsInfo.js}(`);
    } else {
      expr = expr.replace(re, `__${excelF}__(`);
    }
  }
  
  // Handle IF manually (simple cases)
  expr = expr.replace(/IF\s*\(/g, "__IF__(");
  
  // Convert remaining capitalized words to camelCase
  expr = expr.replace(/\b([A-Z][A-Za-z0-9_]*)\b/g, (match) => {
    if (isNumeric(match)) return match;
    if (isExcelFunc(match)) return match;
    if (match === "Math" || match === "true" || match === "false") return match;
    return toCamel(match);
  });
  
  return expr;
}

function simplifyExpression(expr) {
  let result = expr;
  
  // SUM(a, b, ...) → (a + b + ...)
  const sumPattern = /__SUM__\s*\(([^)]*)\)/g;
  result = result.replace(sumPattern, (match, inner) => {
    const parts = inner.split(",").map(s => s.trim()).filter(Boolean);
    return parts.length === 0 ? "0" : "(" + parts.join(" + ") + ")";
  });
  
  // IF(cond, t, f) → (cond ? t : f)
  const ifPattern = /__IF__\s*\(([^,]+),\s*([^,]+),\s*([^)]+)\)/g;
  result = result.replace(ifPattern, (match, cond, tVal, fVal) => {
    return `((${cond.trim()}) ? (${tVal.trim()}) : (${fVal.trim()}))`;
  });
  
  return result;
}

// ── Main ──
const raw = fs.readFileSync(FORMULAS_FILE, "utf-8");
const lines = raw.split("\n").filter(Boolean);

let formulaOutput = "";
let metaOutput = "";
let allOutputs = [];
let pipelinesOutput = "";
let toolCount = 0;
let formulaCount = 0;

for (const line of lines) {
  const m = line.match(/^(.*?)FORMULAS:\s*(.*?)\s*INPUTS:\s*(.*)$/);
  if (!m) continue;
  
  const name = m[1].trim();
  const slug = EXISTING_SLUG_MAP[name];
  if (!slug) {
    console.log(`WARN: No slug mapping for: ${name}`);
    continue;
  }
  
  const formulasRaw = m[2].trim();
  const inputsRaw = m[3].trim();
  const formulas = formulasRaw.split(";").map(f => f.trim()).filter(Boolean);
  const prefix = slugToPrefix(slug);
  
  // Parse input groups for the comments
  const inputGroups = [];
  const personaRegex = /([^:]+?):\s*([^;]+)/g;
  let pm;
  while ((pm = personaRegex.exec(inputsRaw)) !== null) {
    const persona = pm[1].trim();
    const inputsStr = pm[2].trim();
    const inputItems = [];
    const inputRegex = /([^(,]+?)\s*\(([^)]+)\)/g;
    let im;
    while ((im = inputRegex.exec(inputsStr)) !== null) {
      inputItems.push({ label: im[1].trim(), type: im[2].trim() });
    }
    inputGroups.push({ persona, inputs: inputItems });
  }
  
  toolCount++;
  formulaOutput += `\n  // ── ${name} (${formulas.length} formulas) ──\n`;
  metaOutput += `  // ── ${name} ──\n`;
  pipelinesOutput += `\n// ── ${name} ──\n`;
  pipelinesOutput += `// SLUG: ${slug}\n`;
  pipelinesOutput += `// INPUTS: ${inputGroups.map(g => `${g.persona}: ${g.inputs.map(i => i.label).join(", ")}`).join(" | ")}\n`;
  
  for (let fi = 0; fi < formulas.length; fi++) {
    const rawF = formulas[fi];
    const eqParts = rawF.split("=");
    let outputVar = "";
    let expression = rawF;
    if (eqParts.length >= 2) {
      outputVar = eqParts[0].trim();
      expression = eqParts.slice(1).join("=").trim();
    }
    
    const outputCamel = outputVar ? toCamel(outputVar) : `step_${fi}`;
    const formulaId = `user.${prefix}_${fi}`;
    
    // Detect complex functions
    const complexFuncs = ["BINOMDIST", "NORMSINV", "LOOKUP", "VLOOKUP", "HLOOKUP", "INDEX", "MATCH", "SORT"];
    const hasComplex = complexFuncs.some(f => expression.includes(f));
    
    if (hasComplex) {
      formulaOutput += `  {
    id: "${formulaId}",
    family: "general",
    label: "${name} — ${outputVar || "Step " + (fi+1)}",
    fn: (inputs) => {
      // COMPLEX: ${rawF}
      // Requires external implementation
      return 0;
    },
  },\n`;
    } else {
      let jsExpr = convertExcelToJS(expression);
      jsExpr = simplifyExpression(jsExpr).replace(/;\s*$/, "");
      
      // Extract variables
      const varPattern = /[a-zA-Z][a-zA-Z0-9]*/g;
      const allWords = jsExpr.match(varPattern) || [];
      const jsKeywords = new Set(["true", "false", "null", "undefined", "Math", "Infinity", "NaN",
        "if", "else", "return", "normStd", "sumArr",
        "acos", "asin", "atan", "cos", "sin", "tan", "sqrt", "abs",
        "log", "log10", "exp", "round", "trunc", "ceil", "floor", "max", "min",
      ]);
      
      const usedVars = [...new Set(allWords.filter(w =>
        !isNumeric(w) && !jsKeywords.has(w) && w !== "Math" && w !== "normStd" &&
        w.charAt(0) !== "_" && !/^[A-Z]+$/.test(w)
      ))];
      
      let fnBody = "(inputs) => {\n";
      for (const v of usedVars) {
        fnBody += `    const ${v} = num(inputs, "${v}");\n`;
      }
      fnBody += `    return nonNegative(assertFinite(${jsExpr}));\n`;
      fnBody += "  }";
      
      formulaOutput += `  {
    id: "${formulaId}",
    family: "general",
    label: "${name} — ${outputVar || "Step " + (fi+1)}",
    fn: ${fnBody},
  },\n`;
    }
    
    // Metadata
    metaOutput += `  "${formulaId}": { description: "${name}: ${rawF.replace(/"/g, "'")}", requiredInputs: [], outputHint: "number" },\n`;
    
    // Pipeline entry
    pipelinesOutput += `  { formulaId: "${formulaId}", inputMap: { /* TODO: map schema inputs */ }, outputId: "${outputCamel}" },\n`;
    
    formulaCount++;
    allOutputs.push({ id: formulaId, outVar: outputCamel });
  }
}

const combined = `// ═══════════════════════════════════════════════════════════════════════════
// USER-PROVIDED PREMIUM FORMULAS (${toolCount} tools, ${formulaCount} formulas)
// Auto-generated — must match user's exact specs
// ═══════════════════════════════════════════════════════════════════════════

  // ── User formulas — append to FORMULA_DEFINITIONS ──
${formulaOutput}

  // ── User formula metadata — append to FORMULA_META ──
${metaOutput}

// Total: ${toolCount} tools, ${formulaCount} formulas
// Generated: ${new Date().toISOString()}
`;

fs.writeFileSync(`${OUTPUT_DIR}/formula-definitions-v2.ts`, combined, "utf-8");
fs.writeFileSync(`${OUTPUT_DIR}/pipeline-entries.ts`, pipelinesOutput, "utf-8");

console.log(`✅ V2: ${toolCount} tools, ${formulaCount} formulas`);
console.log(`   -> ${OUTPUT_DIR}/formula-definitions-v2.ts`);
console.log(`   -> ${OUTPUT_DIR}/pipeline-entries.ts`);
