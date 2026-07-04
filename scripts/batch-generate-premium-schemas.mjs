#!/usr/bin/env node
// Batch Premium Schema Generator v2 — Plain JS for Node runtime

import fs from "node:fs";
import path from "node:path";

const BATCH_FILE = "archive/migration-only/data/premium-formulas-batch.txt";
const SCHEMAS_DIR = "src/lib/premium-schema/schemas";
const REGISTRY_FILE = "src/lib/premium-schema/schema-registry.ts";
const GENERATED_JSON_DIR = "generated/schemas";

function toSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function toPascal(name) {
  return name
    .split(/[\s-/]+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join("");
}

function toSnake(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "");
}

function toCamel(str) {
  // Normalize diacritics FIRST, then strip combining marks
  str = str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  // Remove non-allowed chars, keep spaces and underscore
  str = str.replace(/[^a-zA-Z0-9_\s]/g, "");
  // Convert space/underscore-separated words to camelCase
  return str
    .replace(/[_\s]+(\w)/g, (_, c) => c.toUpperCase())
    .replace(/^[A-Z]/, (c) => c.toLowerCase());
}

function parseInputItem(text) {
  const typeMatch = text.match(/^(.*?)\s*\(([^)]+)\)\s*$/);
  if (typeMatch) {
    const label = typeMatch[1].trim();
    const rawType = typeMatch[2].trim().toLowerCase();
    const id = toCamel(label);
    return { id, label, type: mapInputType(rawType) };
  }
  const label = text.trim();
  const id = toCamel(label.replace(/[^a-zA-Z0-9\u00C0-\u024F\s]/g, ""));
  return { id, label, type: "number" };
}

function mapInputType(rawType) {
  const t = rawType.toLowerCase();
  if (t.includes("currency") || t.includes("money")) return "currency";
  if (t.includes("enum") || t.includes("select") || t.includes("choice") || 
      t.includes("tier") || t.includes("level") || t.includes("tip") || 
      t.includes("class") || t.includes("method") || t.includes("mod")) return "select";
  if (t.includes("array") || t.includes("matrix") || t.includes("list")) return "array_number";
  if (t.includes("bool") || t.includes("boolean")) return "boolean";
  return "number";
}

function parseBatchLine(line) {
  const trimmed = line.trim();
  if (!trimmed) return null;

  const formulasMatch = trimmed.match(/^(.*?)\s+FORMULAS:\s*(.*?)\s+INPUTS:\s*(.*)$/);
  if (!formulasMatch) return null;

  const toolName = formulasMatch[1].trim();
  const formulasText = formulasMatch[2].trim();
  const inputsText = formulasMatch[3].trim();

  // Parse formulas
  const formulas = [];
  const formulaParts = formulasText.split(";").map((s) => s.trim()).filter(Boolean);
  for (const part of formulaParts) {
    const eqMatch = part.match(/^(\w[\w\d_]*)\s*=\s*(.+)$/);
    if (eqMatch) {
      formulas.push({ varName: eqMatch[1], expression: eqMatch[2].trim() });
    } else {
      formulas.push({ varName: "result", expression: part });
    }
  }

  // Parse inputs
  const inputPersonas = [];
  const personaParts = inputsText.split(";").map((s) => s.trim()).filter(Boolean);
  for (const part of personaParts) {
    const personaMatch = part.match(/^([^:]+?):\s*(.+)$/);
    if (!personaMatch) continue;
    const persona = personaMatch[1].trim();
    const inputsStr = personaMatch[2].trim();

    const personaInputs = [];
    let depth = 0;
    let current = "";
    for (const ch of inputsStr) {
      if (ch === "(") depth++;
      if (ch === ")") depth--;
      if (ch === "," && depth === 0) {
        if (current.trim()) personaInputs.push(parseInputItem(current.trim()));
        current = "";
      } else {
        current += ch;
      }
    }
    if (current.trim()) personaInputs.push(parseInputItem(current.trim()));

    inputPersonas.push({ persona, inputs: personaInputs });
  }

  // Flatten
  const seenIds = new Set();
  const inputs = [];
  for (const p of inputPersonas) {
    for (const inp of p.inputs) {
      if (!seenIds.has(inp.id)) {
        seenIds.add(inp.id);
        inputs.push(inp);
      }
    }
  }

  return { toolName, formulas, inputs, inputPersonas };
}

function extractVars(expr) {
  const vars = new Set();
  const tokens = expr.match(/\b([a-zA-Z_]\w*)\b/g) || [];
  const skipWords = new Set([
    "IF", "AND", "OR", "NOT", "TRUE", "FALSE", "SUM", "SQRT", "MAX", "MIN", "ABS",
    "PI", "STDEV", "AVERAGE", "LOG", "LN", "LOG10", "CEILING", "FLOOR", "POWER",
    "COS", "SIN", "TAN", "ACOS", "NORMSDIST", "NORMSINV", "BINOMDIST",
    "LOOKUPCODELETTER", "SAMPLESIZE", "ACCEPTANCENUMBER",
    "MACRS_TABLE", "MOD", "EXP", "ROUND", "STDDEV", "VAR", "NPV", "IRR",
  ]);
  for (const token of tokens) {
    if (!skipWords.has(token.toUpperCase()) && !/^\d+$/.test(token) && token.length > 0) {
      const camel = toCamel(token.replace(/[^a-zA-Z0-9_]/g, "_"));
      if (camel.length > 0) vars.add(camel);
    }
  }
  return vars;
}

function inferCategory(name, formulas) {
  const fullText = (name + " " + formulas.map(f => f.varName + " " + f.expression).join(" ")).toLowerCase();
  if (/\b(dcf|irr|npv|roi|payback|wacc|discount|cash.flow|clv|cac|ltv|interest|finance)\b/.test(fullText)) return "finance";
  if (/\b(kwh|energy|elec|gaz|kömür|power|compressor|steam|hvac|reactive|pompa)\b/.test(fullText)) return "energy";
  if (/\b(scrap|defect|waste|waste|waste|muda|hurda|rework|error|loss)\b/.test(fullText)) return "scrap";
  if (/\b(oee|availability|performance|durma|downtime|ariza)\b/.test(fullText)) return "oee";
  if (/\b(cycle.time|takt|setup|changeover|smed|duration|lead.time|process.time)\b/.test(fullText)) return "time";
  if (/\b(route|distance|distance|transport|lojistik|nakliye|rota|navlun|freight|tasima)\b/.test(fullText)) return "route";
  if (/\b(carbon|co2|emission|karbon|environment|environment|su|water|atık)\b/.test(fullText)) return "carbon";
  if (/\b(calibrasyon|calibration|drift|tolerance|gage|grr)\b/.test(fullText)) return "calibration";
  if (/\b(learning|learning|kaizen|lean|muda|smv|sewing|dikis|hatti|denge)\b/.test(fullText)) return "lean";
  if (/\b(cpk|ppm|spc|sigma|control.chart|istatistik|sample|orneklem)\b/.test(fullText)) return "measurement";
  if (/\b(cost|cost.*unit|unit.*cost|price|price|margin|margin|cogs)\b/.test(fullText)) return "cost";
  if (/\b(supply|supplier|supply|inventory|inventory|eoq|rop)\b/.test(fullText)) return "benchmark";
  return "cost";
}

function inferSectorSlug(name, category) {
  const map = {
    finance: "financial-planning",
    energy: "energy-utilities",
    scrap: "heavy-industry",
    oee: "heavy-industry",
    time: "heavy-industry",
    route: "logistics-supply-chain",
    carbon: "environmental-services",
    calibration: "measurement-calibration",
    lean: "custom-manufacturing",
    measurement: "measurement-calibration",
    cost: "heavy-industry",
    benchmark: "management-consulting",
  };
  return map[category] || "heavy-industry";
}

function guessUnit(inputId, label) {
  const text = (inputId + " " + label).toLowerCase();
  if (/\b(percent|ratio|ratio|rate|yuzde|pct)\b/.test(text)) return "%";
  if (/\b(temperature|temperature|derece)/.test(text)) return "°C";
  if (/\b(kg|weight|weight|mass|ton)\b/.test(text)) return "kg";
  if (/\b(sqm|m2|m²|area|area|metrekare)\b/.test(text)) return "m²";
  if (/\b(m3|m³|volume|volume)\b/.test(text)) return "m³";
  if (/\b(kw|power|power)\b/.test(text)) return "kW";
  if (/\b(kwh|energy|energy|tuketim)\b/.test(text)) return "kWh";
  if (/\b(hours|hour|time|duration|saat|dakika|minute)\b/.test(text)) return "saat";
  if (/\b(day|daily|daily)\b/.test(text)) return "gün";
  if (/\b(kilometer|km|distance|distance)\b/.test(text)) return "km";
  if (/\b(count|unit|piece|count|sayi|quantity)\b/.test(text)) return "count";
  if (/\b(currency|\$|eur|try|usd)\b/.test(text)) return "currency";
  return "";
}

// Generate the 4 artifacts
function generateAll(slug, tool) {
  const constName = toPascal(slug.replace(/-/g, " ")).replace(/[^a-zA-Z0-9]/g, "_") + "_SCHEMA";
  const category = inferCategory(tool.toolName, tool.formulas);
  const sectorSlug = inferSectorSlug(tool.toolName, category);

  // Collect ALL unique variable names from all formulas
  const formulaOutputIds = new Map(); // varName -> camelCase outputId
  for (const f of tool.formulas) {
    formulaOutputIds.set(f.varName, toCamel(f.varName));
  }
  const formulaOutputIdsSet = new Set(formulaOutputIds.values());

  // Build pipeline steps
  const pipeline = tool.formulas.map((f, idx) => {
    const outputId = toCamel(f.varName);
    const vars = extractVars(f.expression);
    const inputMap = {};
    for (const v of vars) {
      // Include if it's a schema input or derived from previous formula output
      const isInput = tool.inputs.some(i => i.id === v);
      const isDerived = idx > 0 && tool.formulas.slice(0, idx).some(fPrev => toCamel(fPrev.varName) === v);
      if (isInput || isDerived) {
        inputMap[v] = v;
      }
    }
    return {
      formulaId: `user.${toSnake(slug.replace(/-/g, "_"))}_${idx}`,
      inputMap,
      outputId,
    };
  });

  const pipelineOutputIds = new Set(pipeline.map(p => p.outputId));

  // Schema inputs - with clean IDs for TypeScript
  const schemaInputs = tool.inputs.map(inp => {
    const isArray = inp.type === "array_number";
    const rawType = inp.type === "currency" ? "number" : (inp.type === "array_number" ? "number" : inp.type);
    const obj = {
      id: inp.id,
      label: inp.label,
      type: rawType,
      unit: guessUnit(inp.id.toLocaleLowerCase(), inp.label),
      required: true,
    };
    if (isArray) obj.array = true;
    if (obj.type === "number") {
      obj.validation = { min: 0 };
      obj.smartDefault = 0;
    }
    obj.helper = "";
    obj.expertMeaning = "";
    return obj;
  });

  // Schema outputs from pipeline
  const schemaOutputs = tool.formulas
    .filter(f => pipelineOutputIds.has(toCamel(f.varName)))
    .map(f => ({
      id: toCamel(f.varName),
      label: f.varName,
      unit: "",
      format: "number",
    }));

  // Assumption notes
  const assumptionNotes = tool.formulas.map(f => `${toCamel(f.varName)} = ${f.expression}`);

  // -- Schema .ts --
  const tsContent = `/**
 * ${slug} — generated premium schema
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const ${constName}: PremiumCalculatorSchema = {
  id: "${slug}",
  legacyPaidSlug: "${slug}",
  name: "${tool.toolName}",
  sectorSlug: "${sectorSlug}",
  category: "${category}",
  painStatement: "${tool.toolName} hesaplamalarini tek adimda yaparak kayiplari tespit edin ve correct kararlar alin.",
  inputs: ${JSON.stringify(schemaInputs, null, 2).replace(/"([^"]+)":/g, "$1:")},
  outputs: ${JSON.stringify(schemaOutputs, null, 2).replace(/"([^"]+)":/g, "$1:")},
  thresholds: [],
  formulaPipeline: ${JSON.stringify(pipeline, null, 2).replace(/"([^"]+)":/g, "$1:")},
  reportTemplate: { title: "${tool.toolName} Report", sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.1, volatilityPercent: 10, targetMarginPercent: 15, assumptionNotes: ${JSON.stringify(assumptionNotes)} },
};
`;

  // -- JSON schema --
  const jsonInputs = tool.inputs.map(inp => ({
    id: inp.id,
    label: inp.label,
    type: inp.type === "currency" ? "number" : (inp.type === "array_number" ? "number" : inp.type),
    unit: guessUnit(inp.id, inp.label),
    min: 0,
    default: 0,
    businessContext: "",
    label_i18n: { en: inp.label, tr: inp.label, de: "", fr: "", es: "", ar: "" },
    businessContext_i18n: { en: "", tr: "", de: "", fr: "", es: "", ar: "" },
  }));

  const jsonOutputs = tool.formulas
    .filter(f => pipelineOutputIds.has(toCamel(f.varName)))
    .map(f => ({
      id: toCamel(f.varName),
      label: f.varName,
      unit: "",
      format: "number",
      label_i18n: { en: f.varName, tr: f.varName, de: "", fr: "", es: "", ar: "" },
    }));

  const jsonData = {
    slug,
    name: tool.toolName,
    description: `${tool.toolName} premium calculation tool.`,
    premiumRequired: true,
    standardOptions: [],
    premiumFeatures: ["PDF export", "CSV export", "Trend analysis", "Verdict report"],
    inputs: jsonInputs,
    outputs: jsonOutputs,
    category,
  };

  // -- Calculator .ts --
  const inputTypeName = toPascal(slug.replace(/-/g, " ")).replace(/[^a-zA-Z0-9]/g, "_") + "Input";
  const fnName = "calculate" + toPascal(slug.replace(/-/g, " ")).replace(/[^a-zA-Z0-9]/g, "_");

  const zodFields = tool.inputs.map(inp =>
    `  ${inp.id}: z.number().min(0).default(0),`
  ).join("\n");

  const interfaceFields = tool.inputs.map(inp =>
    `  ${inp.id}: ${inp.type === "string" ? "string" : "number"};`
  ).join("\n");

  const evalBody = tool.formulas.map((f, idx) => {
    const outputId = toCamel(f.varName);
    const vars = extractVars(f.expression);
    const term = Array.from(vars).map(v => `input.${v}`).join(" * ");
    return `  try { const v = ${term || "0"}; results["${outputId}"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["${outputId}"] = Number.NaN; }`;
  }).join("\n");

  const calcContent = `// @ts-nocheck — premium calculator (use schema pipeline for actual calculation)
// Auto-generated premium calculator: ${slug}
import * as z from 'zod';

export interface ${inputTypeName} {
${interfaceFields}
}

export const ${inputTypeName}Schema = z.object({
${zodFields}
});

function toNumericFormulaValue(value) {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input) {
  const results = {};
${evalBody}
  return results;
}

export function ${fnName}(input) {
  return evaluateAllFormulas(input);
}
`;

  return { tsContent, jsonData, calcContent, constName };
}

function main() {
  fs.mkdirSync(SCHEMAS_DIR, { recursive: true });
  fs.mkdirSync(GENERATED_JSON_DIR, { recursive: true });

  const batchText = fs.readFileSync(BATCH_FILE, "utf-8");
  const lines = batchText.split("\n").filter(Boolean);

  let generatedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;
  const newRegistryImports = [];
  const newRegistryEntries = [];
  const existingSchemas = new Set(
    fs.readdirSync(SCHEMAS_DIR).filter(f => f.endsWith(".ts")).map(f => f.replace(/\.ts$/, ""))
  );
  const existingJson = new Set(
    fs.existsSync(GENERATED_JSON_DIR) ? fs.readdirSync(GENERATED_JSON_DIR).filter(f => f.endsWith(".json")).map(f => f.replace(/-schema\.json$/, "")) : []
  );

  for (const line of lines) {
    const tool = parseBatchLine(line);
    if (!tool) {
      skippedCount++;
      continue;
    }

    const slug = toSlug(tool.toolName);
    if (!slug || slug.length < 3) {
      errorCount++;
      continue;
    }

    try {
      const schemaTsExists = existingSchemas.has(slug);
      const jsonExists = existingJson.has(slug);

      // Always generate JSON
      const { tsContent, jsonData, calcContent, constName } = generateAll(slug, tool);
      const jsonFilename = `${slug}-schema.json`;
      fs.writeFileSync(path.join(GENERATED_JSON_DIR, jsonFilename), JSON.stringify(jsonData, null, 2), "utf-8");

      if (!schemaTsExists) {
        // Generate schema .ts
        fs.writeFileSync(path.join(SCHEMAS_DIR, `${slug}.ts`), tsContent, "utf-8");

        // Generate calculator .ts
        fs.writeFileSync(path.join("generated", `${slug}-calculator.ts`), calcContent, "utf-8");

        newRegistryImports.push(`import { ${constName} } from "@/lib/premium-schema/schemas/${slug}";`);
        newRegistryEntries.push(`  ${constName},`);
        console.log(`  OK: ${slug} (schema.ts + json + calc)`);
      } else if (!jsonExists) {
        console.log(`  JSON: ${slug} (schema.ts exists, generated json)`);
      } else {
        console.log(`  SKIP: ${slug} (all exist)`);
      }

      generatedCount++;
    } catch (e) {
      console.error(`  ERR: ${slug}: ${e.message}`);
      errorCount++;
    }
  }

  console.log(`\n=== Genel ===`);
  console.log(`  Olusturulan: ${generatedCount}`);
  console.log(`  Atlanan: ${skippedCount}`);
  console.log(`  Error: ${errorCount}`);

  // Patch schema-registry.ts
  if (newRegistryImports.length > 0) {
    let registryContent = fs.readFileSync(REGISTRY_FILE, "utf-8");

    // Add imports after last import line
    const lines = registryContent.split("\n");
    let lastImportIdx = -1;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim().startsWith("import ")) {
        lastImportIdx = i;
      }
    }
    if (lastImportIdx >= 0) {
      lines.splice(lastImportIdx + 1, 0, ...newRegistryImports);
    }

    // Find array close and add entries before it
    for (let i = lines.length - 1; i >= 0; i--) {
      if (lines[i].trim() === "];" && i > lastImportIdx + 5) {
        // Check this is closing PREMIUM_CALCULATOR_SCHEMAS
        let foundStart = false;
        for (let j = i; j >= Math.max(0, i - 30); j--) {
          if (lines[j].includes("PREMIUM_CALCULATOR_SCHEMAS")) {
            foundStart = true;
            break;
          }
        }
        if (foundStart) {
          lines.splice(i, 0, ...newRegistryEntries);
          break;
        }
      }
    }

    fs.writeFileSync(REGISTRY_FILE, lines.join("\n"), "utf-8");
    console.log(`\n  schema-registry.ts'e ${newRegistryImports.length} yeni import + entry eklendi`);
  }

  console.log(`\nBitti. Dosyalar:`);
  console.log(`  - ${SCHEMAS_DIR}/ (yeni .ts)`);
  console.log(`  - ${GENERATED_JSON_DIR}/ (tum .json)`);
  console.log(`  - generated/ (calculator .ts)`);
}

main();
