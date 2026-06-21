#!/usr/bin/env node
// Generate JSON schemas for the 18 existing premium .ts schema files

import fs from "node:fs";
import path from "node:path";

const SCHEMAS_DIR = "src/lib/premium-schema/schemas";
const JSON_DIR = "generated/schemas";

const TARGET_SLUGS = [
  "irr-investment-analyzer",
  "npv-risk-analyzer",
  "lease-vs-buy-analyzer",
  "dcf-enterprise-valuator",
  "oee-six-big-losses-analyzer",
  "line-balancing-analyzer",
  "standard-time-work-study-calculator",
  "learning-curve-calculator",
  "lmtd-heat-exchanger-calculator",
  "spring-design-calculator",
  "darcy-weisbach-pipe-flow-calculator",
  "carbon-footprint-calculator",
  "regression-analyzer",
  "sample-size-calculator",
  "anova-analyzer",
  "roi-analyzer",
  "belt-pulley-gear-calculator",
  "hydraulic-cylinder-calculator",
];

// Simple schema .ts parser - extracts key-value pairs
function extractSchemaInfo(filePath) {
  const content = fs.readFileSync(filePath, "utf-8");

  const result = {
    id: extractValue(content, "id:"),
    name: extractValue(content, "name:"),
    category: extractValue(content, "category:"),
    sectorSlug: extractValue(content, "sectorSlug:"),
    painStatement: extractValue(content, "painStatement:"),
    inputs: extractArray(content, "inputs:"),
    outputs: extractArray(content, "outputs:"),
  };

  return result;
}

function extractValue(content, key) {
  const regex = new RegExp(
    key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") +
      '\\s*"((?:[^"\\\\]|\\\\.)*)"'
  );
  const match = content.match(regex);
  return match ? match[1] : "";
}

function extractArray(content, arrayKey) {
  // Find the array start
  const startIdx = content.indexOf(arrayKey);
  if (startIdx === -1) return [];

  // Build a simplified extractor - get array elements as raw text
  const bracketStart = content.indexOf("[", startIdx);
  if (bracketStart === -1) return [];

  let depth = 0;
  let inString = false;
  let endIdx = bracketStart;
  for (let i = bracketStart; i < content.length; i++) {
    const ch = content[i];
    if (ch === '"' && (i === 0 || content[i - 1] !== "\\")) inString = !inString;
    if (!inString) {
      if (ch === "[") depth++;
      if (ch === "]") {
        depth--;
        if (depth === 0) {
          endIdx = i + 1;
          break;
        }
      }
    }
  }

  const rawArray = content.slice(bracketStart, endIdx);
  return rawArray;
}

function extractPropsFromObjects(rawArray) {
  // Extract all "id" and "label" values from objects
  const idRegex = /id:\s*"((?:[^"\\]|\\.)*)"/g;
  const labelRegex = /label:\s*"((?:[^"\\]|\\.)*)"/g;
  const typeRegex = /type:\s*"((?:[^"\\]|\\.)*)"/g;
  const unitRegex = /unit:\s*"((?:[^"\\]|\\.)*)"/g;
  const formatRegex = /format:\s*"((?:[^"\\]|\\.)*)"/g;
  const arrayRegex = /array:\s*true/g;

  const ids = [...rawArray.matchAll(idRegex)].map(m => m[1]);
  const labels = [...rawArray.matchAll(labelRegex)].map(m => m[1]);
  const types = [...rawArray.matchAll(typeRegex)].map(m => m[1]);
  const units = [...rawArray.matchAll(unitRegex)].map(m => m[1]);
  const formats = [...rawArray.matchAll(formatRegex)].map(m => m[1]);
  const arrays = new Set();
  let match;
  let pos = 0;
  while ((match = arrayRegex.exec(rawArray)) !== null) {
    // Find which object this belongs to - count commas before
    const before = rawArray.slice(0, match.index);
    const braceCount = (before.match(/{/g) || []).length - (before.match(/}/g) || []).length;
    // Simple: if array: true is found, the corresponding id field follows
    const idBefore = before.lastIndexOf("id:");
    const segmentBefore = before.slice(0, idBefore);
    const objStart = segmentBefore.lastIndexOf("{");
    const objText = before.slice(objStart);
    const idMatch = objText.match(/id:\s*"((?:[^"\\]|\\.)*)"/);
    if (idMatch) arrays.add(idMatch[1]);
  }

  return ids.map((id, i) => ({
    id,
    label: labels[i] || id,
    type: types[i] || "number",
    unit: units[i] || "",
    format: formats[i] || (types[i] === "percentage" ? "percentage" : "number"),
    isArray: arrays.has(id),
  }));
}

fs.mkdirSync(JSON_DIR, { recursive: true });

let count = 0;
for (const slug of TARGET_SLUGS) {
  const tsFile = path.join(SCHEMAS_DIR, `${slug}.ts`);
  const jsonFile = path.join(JSON_DIR, `${slug}-schema.json`);

  if (!fs.existsSync(tsFile)) {
    console.log(`  SKIP: ${slug} (no .ts file)`);
    continue;
  }

  if (fs.existsSync(jsonFile)) {
    console.log(`  EXISTS: ${slug}`);
    continue;
  }

  const info = extractSchemaInfo(tsFile);
  if (!info.id) {
    console.log(`  ERR: ${slug} (could not parse)`);
    continue;
  }

  const inputs = extractPropsFromObjects(info.inputs);
  const outputs = extractPropsFromObjects(info.outputs);

  const jsonData = {
    slug: info.id,
    name: info.name,
    description: info.painStatement || `${info.name} premium calculation tool.`,
    premiumRequired: true,
    standardOptions: [],
    premiumFeatures: ["PDF export", "CSV export", "Trend analysis", "Verdict report"],
    inputs: inputs.map(inp => ({
      id: inp.id,
      label: inp.label,
      type: inp.type,
      unit: inp.unit,
      min: 0,
      default: 0,
      businessContext: "",
      label_i18n: { en: inp.label, tr: inp.label, de: "", fr: "", es: "", ar: "" },
      businessContext_i18n: { en: "", tr: "", de: "", fr: "", es: "", ar: "" },
    })),
    outputs: outputs.map(out => ({
      id: out.id,
      label: out.label,
      unit: out.unit,
      format: out.format === "percentage" ? "percentage" : "number",
      label_i18n: { en: out.label, tr: out.label, de: "", fr: "", es: "", ar: "" },
    })),
    category: info.category,
  };

  fs.writeFileSync(jsonFile, JSON.stringify(jsonData, null, 2), "utf-8");
  console.log(`  JSON: ${slug}`);
  count++;
}

console.log(`\nDone: ${count} JSON files generated for existing schemas`);
