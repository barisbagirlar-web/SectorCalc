#!/usr/bin/env node
/**
 * INDUSTRIAL-GRADE Premium Tool Generator v2
 *
 * Extracts formula variable names from batch file AND uses them
 * as input IDs so the formula compiler can match variables to inputs.
 *
 * Flow:
 *   1. Parse each tool: formulas + input descriptions
 *   2. Collect ALL variable names from ALL formula expressions
 *   3. For each variable: if it's NOT a previous formula output → it's an input
 *   4. Use the variable name (camelCase) as the input ID
 *   5. Generate JSON with matching IDs
 *
 * Usage: node scripts/generate-premium-from-batch.mjs
 * Then:  npm run generate:all
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const BATCH_FILE = "data/premium-formulas-batch.txt";
const GENERATED_JSON_DIR = "generated/schemas";

// ── Turkish char normalization ──
const TR_MAP = { ğ: "g", Ğ: "G", ü: "u", Ü: "U", ş: "s", Ş: "S", ı: "i", İ: "I", ö: "o", Ö: "O", ç: "c", Ç: "C" };
function normalizeTr(str) {
  return str.replace(/[ğĞüÜşŞıİöÖçÇ]/g, (c) => TR_MAP[c] ?? c);
}

function toSlug(name) {
  let s = normalizeTr(name.toLowerCase());
  s = s.replace(/[^a-z0-9\s-]/g, "");
  s = s.replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
  if (!s || s.length < 3) s = "tool-" + Math.random().toString(36).slice(2, 8);
  return s;
}

function toCamel(str) {
  let s = normalizeTr(str);
  s = s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  s = s.replace(/[^a-zA-Z0-9_\s]/g, "");
  s = s.replace(/[_\s]+(\w)/g, (_, c) => c.toUpperCase());
  s = s.replace(/^[A-Z]/, (c) => c.toLowerCase());
  return s || "result";
}

// ── Extract variable names from formula expressions ──
const SOLVER_PATTERNS = /SUBJECT TO|where\s+NPV|where\s+.*is\s+(MINIMUM|MAXIMUM|MIN|MAX)|MIN\(.*\)\s+SUBJECT/i;
const SKIP_WORDS = new Set([
  "IF", "AND", "OR", "NOT", "TRUE", "FALSE", "SUM", "SQRT", "MAX", "MIN", "ABS",
  "PI", "STDEV", "AVERAGE", "LOG", "LN", "LOG10", "CEILING", "FLOOR", "POWER",
  "COS", "SIN", "TAN", "ACOS", "NORMSDIST", "NORMSINV", "BINOMDIST", "MOD", "EXP",
  "ROUND", "INT", "SIGN", "LOOKUPCODELETTER", "SAMPLESIZE", "ACCEPTANCENUMBER",
  "MACRS_TABLE", "NPV", "IRR", "PPMT", "IPMT", "PV", "FV", "PMT", "RATE", "NPER",
  "INDEX", "MATCH", "VLOOKUP", "HLOOKUP", "XLOOKUP", "OFFSET", "INDIRECT",
  "SUMPRODUCT", "SUBTOTAL", "AGGREGATE", "ARRAYFORMULA",
  "STDEV", "STDEVP", "STDEV_S", "STDEV_P", "VAR", "VARP", "VAR_S", "VAR_P",
  "CORREL", "COVAR", "RSQ", "SLOPE", "INTERCEPT", "TREND", "FORECAST",
  "MODE", "MEDIAN", "QUARTILE", "PERCENTILE", "RANK", "LARGE", "SMALL",
  "NOW", "TODAY", "DATE", "TIME", "YEAR", "MONTH", "DAY", "HOUR", "MINUTE", "SECOND",
  "ISNUMBER", "ISTEXT", "ISBLANK", "ISERROR", "ISNA", "ISLOGICAL",
  "ERROR", "TYPE", "NA", "COLUMN", "ROW", "ADDRESS",
  "LookupArea", "SORT", "MACRS_Table", "BookValue_", "f",
]);

function extractVars(expr) {
  const vars = new Set();
  const tokens = expr.match(/\b([a-zA-Z_]\w*)\b/g) || [];
  for (const t of tokens) {
    if (SKIP_WORDS.has(t) || SKIP_WORDS.has(t.toUpperCase())) continue;
    if (/^\d+(\.\d+)?$/.test(t)) continue;
    if (t.length < 1) continue;
    vars.add(t);
  }
  return vars;
}

/**
 * Parse a batch line.
 * Returns: { toolName, formulas: [{varName, expr}], labels: [{formulaVar, personaLabel}] }
 */
function parseLine(line) {
  const trimmed = line.trim();
  if (!trimmed) return null;

  const m = trimmed.match(/^(.*?)\s+FORMULAS:\s*(.*?)\s+INPUTS:\s*(.*)$/);
  if (!m) return null;

  const toolName = m[1].trim();
  const formulasText = m[2].trim();
  const inputsText = m[3].trim();

  // Parse formulas
  const formulas = [];
  for (const part of formulasText.split(";").map(s => s.trim()).filter(Boolean)) {
    const eq = part.match(/^(\w[\w\d_]*)\s*=\s*(.+)$/);
    if (eq) {
      formulas.push({ varName: eq[1], expr: eq[2].trim() });
    }
  }

  // Parse input descriptions (persona: label1 (type), label2 (type))
  // These are for display only — IDs come from formula variables
  const labels = new Map(); // camelCase formula var -> human label
  for (const pPart of inputsText.split(";").map(s => s.trim()).filter(Boolean)) {
    const pm = pPart.match(/^([^:]+?):\s*(.+)$/);
    if (!pm) continue;
    const inputsStr = pm[2].trim();
    let depth = 0, cur = "";
    for (const ch of inputsStr) {
      if (ch === "(") depth++;
      if (ch === ")") depth--;
      if (ch === "," && depth === 0) {
        if (cur.trim()) addLabel(cur.trim(), labels);
        cur = "";
      } else cur += ch;
    }
    if (cur.trim()) addLabel(cur.trim(), labels);
  }

  return { toolName, formulas, labels };
}

function addLabel(text, labels) {
  const t = text.match(/^(.*?)\s*\(([^)]+)\)\s*$/);
  let label, rawType;
  if (t) {
    label = t[1].trim();
    rawType = t[2].trim();
  } else {
    label = text.trim();
    rawType = "number";
  }

  // The label in the input section may have different casing than the formula var.
  // Map it with a heuristic: remove spaces, lowercase
  const labelKey = toCamel(label);
  if (!labels.has(labelKey)) {
    labels.set(labelKey, { label, type: mapType(rawType) });
  }
}

function mapType(rawType) {
  const t = rawType.toLowerCase();
  if (/currency|money/.test(t)) return "number";
  if (/enum|select|choice|tier|level|tip|class|method|mod/.test(t)) return "select";
  if (/bool|boolean/.test(t)) return "boolean";
  return "number";
}

/** Common English words that appear in formula descriptions but aren't real input variables. */
const STOP_WORDS = new Set([
  "a", "an", "the", "is", "are", "was", "were", "be", "been", "being",
  "have", "has", "had", "do", "does", "did", "will", "would", "could",
  "should", "may", "might", "shall", "can", "need", "dare", "ought",
  "used", "to", "of", "in", "for", "on", "with", "at", "by", "from",
  "as", "into", "through", "during", "before", "after", "above", "below",
  "between", "out", "off", "over", "under", "again", "further", "then",
  "once", "here", "there", "when", "where", "why", "how", "all", "each",
  "every", "both", "few", "more", "most", "other", "some", "such", "no",
  "nor", "not", "only", "own", "same", "so", "than", "too", "very",
  "just", "because", "but", "and", "or", "if", "while", "that", "this",
  "these", "those", "it", "its", "rate", "year", "full", "recovery",
  "new", "old", "high", "low", "true", "false", "min", "max", "sum",
  "avg", "total", "SUBJECT", "TO", "where", "NPV", "IRR", "MIN",
  "MINIMUM", "MAXIMUM", "is", "are", "smallest", "largest",
  "Fail", "PASS", "Proceed", "Reevaluate",
  "DESC", "HIGH", "LOW",
]);

/**
 * Derive input IDs from formula variables.
 * For each formula (in order), extract variables.
 * If a variable matches a previous formula's output or is a stop word → skip.
 * Otherwise → it's an input.
 */
function deriveInputs(formulas) {
  const outputs = new Set();
  const inputVars = new Map();

  // First pass: collect all formula output names
  for (const f of formulas) {
    outputs.add(f.varName);
  }

  // Second pass: for each formula, extract variables not from previous outputs
  for (let i = 0; i < formulas.length; i++) {
    const vars = extractVars(formulas[i].expr);
    for (const v of vars) {
      // Skip formula outputs
      if (outputs.has(v)) continue;
      // Skip stop words / common English words (case-sensitive for single letters)
      if (STOP_WORDS.has(v)) continue;
      // Allow single-letter engineering variables (P, R, D, L, t, etc.)
      if (v.length < 1) continue;
      if (!inputVars.has(v)) {
        inputVars.set(v, { id: v });
      }
    }
  }

  return inputVars;
}

// ── Guess unit from label ──
function guessUnit(text) {
  const t = text.toLowerCase();
  if (/\b(percent|ratio|oran|rate|yuzde|pct|yüzde)\b/.test(t)) return "%";
  if (/currency|\$|eur|try|usd|tl\b/.test(t)) return "USD";
  if (/\b(kg|weight|agirlik|kutle|kütle|ton)\b/.test(t)) return "kg";
  if (/\b(kw|power|guc|güç)\b/.test(t)) return "kW";
  if (/\b(kwh|energy|enerji|tuketim|tüketim)\b/.test(t)) return "kWh";
  if (/\b(hours|hour|time|sure|süre|saat|dakika)\b/.test(t)) return "hour";
  if (/\b(day|daily|gunluk|günlük)\b/.test(t)) return "day";
  if (/\b(km|kilometer|distance|mesafe)\b/.test(t)) return "km";
  if (/\b(adet|unit|piece|count|sayi|sayı|miktar)\b/.test(t)) return "unit";
  return "";
}

// ── Infer category ──
function inferCategory(name, formulas) {
  const txt = (name + " " + formulas.map(f => f.varName + " " + f.expr).join(" ")).toLowerCase();
  if (/\b(dcf|irr|npv|roi|payback|wacc|discount|cash.flow|clv|cac|ltv|faiz|finans)\b/.test(txt)) return "finance";
  if (/\b(kwh|energy|elec|power|compressor|steam|hvac|reactive)\b/.test(txt)) return "energy";
  if (/\b(scrap|defect|waste|fire|israf|muda|hurda|rework|hata|kayip)\b/.test(txt)) return "scrap";
  if (/\b(oee|availability|performance|downtime|ariza)\b/.test(txt)) return "oee";
  if (/\b(cycle|takt|setup|changeover|smed|sure|lead.time|process.time)\b/.test(txt)) return "time";
  if (/\b(route|mesafe|distance|transport|lojistik|rota|navlun|freight|tasima)\b/.test(txt)) return "route";
  if (/\b(carbon|co2|emission|karbon|cevre|environment|su|water|atik)\b/.test(txt)) return "carbon";
  if (/\b(calibrasyon|calibration|drift|tolerance|gage)\b/.test(txt)) return "calibration";
  if (/\b(ogrenme|learning|kaizen|lean|smv|sewing|dikis|hatti)\b/.test(txt)) return "lean";
  if (/\b(cpk|ppm|spc|sigma|control.chart|istatistik|sample)\b/.test(txt)) return "measurement";
  if (/\b(maliyet|cost|price|margin|marj|cogs)\b/.test(txt)) return "cost";
  if (/\b(tedarik|supplier|stok|inventory|eoq|rop)\b/.test(txt)) return "benchmark";
  return "cost";
}

const CAT_TO_SECTOR = {
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
function sectorSlug(cat) { return CAT_TO_SECTOR[cat] || "heavy-industry"; }

/**
 * Try to find a human-readable label for a formula variable.
 * Checks: exact match, camelCase match, case-insensitive match.
 */
function findLabel(varName, labels) {
  // Exact match
  if (labels.has(varName)) return labels.get(varName);

  // Try lowercased match
  const lc = varName.toLowerCase();
  for (const [key, val] of labels) {
    if (key.toLowerCase() === lc) return val;
  }

  // Try splitting camelCase and matching
  const parts = varName.split(/(?=[A-Z])/).map(s => s.toLowerCase());
  for (const [key, val] of labels) {
    const keyParts = key.split(/(?=[A-Z])/).map(s => s.toLowerCase());
    if (parts.length === keyParts.length &&
        parts.every((p, i) => p === keyParts[i])) {
      return val;
    }
  }

  return null;
}

// ── Generate JSON schema ──
function generateJson(slug, tool) {
  const cat = inferCategory(tool.toolName, tool.formulas);
  const sector = sectorSlug(cat);

  // Pre-process formulas: detect and stub solver/optimizer patterns
  // BEFORE deriving inputs, so solver description text doesn't pollute input list
  for (const f of tool.formulas) {
    if (SOLVER_PATTERNS.test(f.expr)) {
      console.warn(`  WARN ${slug}/${f.varName}: solver pattern detected, stubbing`);
      f.expr = "0.0"; // stub solver formulas
    }
    // Replace SUM(v1, v2, ...) with v1 + v2 + ...
    // The formula compiler can't handle SUM() with array-like args
    // Note: SUM over a single variable is OK (just returns the var)
    if (/^SUM\s*\(/.test(f.expr) && f.expr.includes(",")) {
      const inner = f.expr.replace(/^SUM\s*\(/, "").replace(/\)\s*$/, "");
      const parts = inner.split(",").map(s => s.trim()).filter(Boolean);
      if (parts.length > 1) {
        f.expr = parts.join(" + ");
        console.warn(`  WARN ${slug}/${f.varName}: SUM() expanded to + chain`);
      }
    }
  }

  // Derive inputs from formula variables
  const inputVars = deriveInputs(tool.formulas);

  // Build inputs array with proper IDs (matching formula variables)
  const jsonInputs = [];
  for (const [varName, _info] of inputVars) {
    // Find display label
    const labelInfo = findLabel(varName, tool.labels) || tool.labels.get(varName.toLowerCase());
    const label = labelInfo ? labelInfo.label : varName;
    const type = labelInfo ? labelInfo.type : "number";

    jsonInputs.push({
      id: varName,
      label,
      type,
      unit: guessUnit(label),
      min: type === "number" ? 0 : undefined,
      default: type === "number" ? 0 : undefined,
      businessContext: "",
      label_i18n: { en: label, tr: label, de: "", fr: "", es: "", ar: "" },
      businessContext_i18n: { en: "", tr: "", de: "", fr: "", es: "", ar: "" },
    });
  }

  // Build formulas map: outputId -> raw expression
  const formulas = {};
  for (const f of tool.formulas) {
    const outputId = f.varName;
    formulas[outputId] = f.expr;
  }

  const outputIds = Object.keys(formulas);
  const primary = outputIds[outputIds.length - 1] || "total";
  const breakdown = {};
  for (const k of outputIds) {
    breakdown[k] = k;
  }

  const json = {
    slug,
    toolName: tool.toolName,
    name: tool.toolName,
    description: `${tool.toolName} premium hesaplama araci.`,
    premiumRequired: true,
    standardOptions: [],
    premiumFeatures: ["PDF export", "CSV export", "Trend analysis", "Verdict report", "Action plan"],
    inputs: jsonInputs,
    formulas,
    outputs: {
      primary,
      unit: "USD",
      breakdown,
      hiddenLossDrivers: ["Verify assumptions with real data", "Cross-check with industry benchmarks"],
      suggestedActions: ["Run sensitivity analysis", "Review assumptions with domain expert"],
    },
    categorySlug: cat,
    sectorSlug: sector,
    category: cat,
    sector: sector,
    profession: "engineer",
    about: {
      description: {
        short: `${tool.toolName} premium araci ile kayiplari tespit edin.`,
        long: `${tool.toolName} premium hesaplama araci. Endustriyel formuller ile hizli ve dogru hesaplama.`,
      },
    },
  };

  return json;
}

// ── Main ──
function main() {
  mkdirSync(GENERATED_JSON_DIR, { recursive: true });

  const text = readFileSync(BATCH_FILE, "utf-8");
  const lines = text.split("\n").filter(Boolean);

  let ok = 0, skip = 0, err = 0;

  for (const line of lines) {
    const tool = parseLine(line);
    if (!tool) { skip++; continue; }

    const slug = toSlug(tool.toolName);
    if (!slug) { err++; continue; }

    try {
      const json = generateJson(slug, tool);
      writeFileSync(join(GENERATED_JSON_DIR, `${slug}-schema.json`), JSON.stringify(json, null, 2), "utf-8");
      const fc = Object.keys(json.formulas).length;
      const ic = json.inputs.length;
      console.log(`  OK  [${fc}F/${ic}I] ${slug.padEnd(40)} ${tool.toolName}`);
      ok++;
    } catch (e) {
      console.error(`  ERR ${slug}: ${e.message}`);
      err++;
    }
  }

  console.log(`\n=== ISTATISTIK ===`);
  console.log(`  Toplam: ${ok + skip + err}`);
  console.log(`  OK:     ${ok}`);
  console.log(`  Skip:   ${skip}`);
  console.log(`  Hata:   ${err}`);
  console.log(`\nSonraki adim: npm run generate:all`);
}

main();
