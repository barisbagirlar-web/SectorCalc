#!/usr/bin/env node

/**
 * generate-premium-formulas.mjs
 *
 * Reads archive/migration-only/data/premium-formulas-batch.txt and generates TypeScript formula
 * definitions that can be added to src/lib/premium-schema/formula-registry.ts.
 *
 * Output: scripts/generated-premium/
 *   formula-definitions.ts  — FORMULA_DEFINITIONS entries
 *   formula-meta.ts         — FORMULA_META_DETAILS entries
 *   schema-pipelines.ts     — FormulaPipelineStep entries per tool
 *   summary.md              — Generation summary
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

// ───── Known input-key overrides for batch-formula variables ─────
// Maps raw Excel variable names → camelCase input keys that exist
// or should exist in the schema for that tool.
const VARIABLE_OVERRIDES = {
  // PI constant → not an input
  PI: null,
  pI: null,
  Pi: null,
  // Common aliases
  USD: null,
  EUR: null,
  TRY: null,
};

// ───── Excel → TypeScript function mappings ─────
const EXCEL_FUNCTIONS = {
  SUM:         (args, rawArgs) => args.join(" + "),
  SQRT:        (args) => `Math.sqrt(${args[0]})`,
  ABS:         (args) => `Math.abs(${args[0]})`,
  MAX:         (args) => `Math.max(${args.join(", ")})`,
  MIN:         (args) => `Math.min(${args.join(", ")})`,
  CEILING:     (args) => `Math.ceil(${args[0]})`,
  FLOOR:       (args) => `Math.floor(${args[0]})`,
  AVERAGE:     (args) => `((${args.join(" + ")}) / ${args.length})`,
  LOG10:       (args) => `Math.log10(${args[0]})`,
  LN:          (args) => `Math.log(${args[0]})`,
  LOG:         (args) => `Math.log(${args[0]})`,
  COS:         (args) => `Math.cos(${args[0]})`,
  SIN:         (args) => `Math.sin(${args[0]})`,
  TAN:         (args) => `Math.tan(${args[0]})`,
  ACOS:        (args) => `Math.acos(${args[0]})`,
  NORMSDIST:   (args) => `normStd(${args[0]})`,
  POWER:       (args) => `Math.pow(${args[0]}, ${args[1]})`,
};

// ───── Variable name normalization ─────

const CAMEL_OVERRIDES = {
  "t_(i)": "tIndex",
  "bookvalue_(t-1)": "bookValuePrev",
  "opcost_t": "opCostT",
  "maintcost_t": "maintCostT",
  "salvage_t": "salvageT",
  "cash_t": "cashT",
  "cashflow_t": "cashFlowT",
  "v_c": "cuttingSpeed",
  "v_f": "feedRate",
  "f_z": "feedPerTooth",
  "a_p": "depthOfCut",
  "d_tool": "toolDiameter",
  "t_total": "totalTime",
  "t_cut": "cuttingTime",
  "t_rapid": "rapidTime",
  "t_toolchange": "toolChangeTime",
  "t_target": "targetTime",
  "t_internal": "internalTime",
  "t_external": "externalTime",
  "t_avg": "avgTemperature",
  "t_out": "outsideTemp",
  "t_in": "insideTemp",
  "t_hot": "hotTemp",
  "t_cold": "coldTemp",
  "t_abs": "absTemp",
  "p_max": "maxPressure",
  "p_min": "minPressure",
  "p_static": "staticPressure",
  "p_residual": "residualPressure",
  "p_pitot": "pitotPressure",
  "p_line": "linePressure",
  "p_out": "outletPressure",
  "p_in": "inletPressure",
  "q_leak": "leakFlow",
  "q_flow": "flowRate",
  "delta_p": "deltaP",
  "delta_p_pipe": "pipePressureDrop",
  "delta_p_valve": "valvePressureDrop",
  "delta_p_dirty": "dirtyPressureDrop",
  "delta_p_clean": "cleanPressureDrop",
  "c_a": "corrosionAllowance",
  "z_bench": "zBench",
  "z_usl": "zUsl",
  "z_lsl": "zLsl",
  "p_usl": "pUsl",
  "p_lsl": "pLsl",
  "p_total": "pTotal",
  "r_bar": "avgRange",
  "s_bar": "avgStdDev",
  "x_bar_bar": "grandMean",
  "ucl_x": "uclX",
  "lcl_x": "lclX",
  "ucl_r": "uclR",
  "lcl_r": "lclR",
  "v_slab": "slabVolume",
  "v_footing": "footingVolume",
  "v_column": "columnVolume",
  "v_wall": "wallVolume",
  "r_foul": "foulingResistance",
  "u_clean": "uClean",
  "u_dirty": "uDirty",
  "dp_inc": "dpIncrease",
  "scope1": "scope1",
  "scope2_location": "scope2Location",
  "scope2_market": "scope2Market",
  "scope3_upstream": "scope3Upstream",
  "totalcarbon": "totalCarbon",
  "carbonintensity": "carbonIntensity",
  "financialrisk": "financialRisk",
  "dso": "dso",
  "dpo": "dpo",
  "dio": "dio",
  "ccc": "cashConversionCycle",
  "ltv": "ltv",
  "cac": "cac",
  "ltv_cac": "ltvCacRatio",
  "eoq": "eoq",
  "rop": "rop",
  "roi": "roi",
  "irr": "irr",
  "npv": "npv",
  "mirr": "mirr",
  "lcoe": "lcoe",
  "tco": "tco",
  "ebitda": "ebitda",
  "npv_nom": "npvNominal",
  "npv_real": "npvReal",
  "eac": "eac",
  "etc": "etc",
  "vac": "vac",
  "tcpi": "tcpi",
  "sv": "sv",
  "cv": "cv",
  "spi": "spi",
  "cpi": "cpi",
  "bep_units": "bepUnits",
  "bep_revenue": "bepRevenue",
  "cmr": "cmRatio",
  "copq": "coPQ",
  "paf_ratio": "pafRatio",
  "coq_ratio": "coqRatio",
  "sl_annual": "slAnnual",
  "db_rate": "dbRate",
  "taxshield": "taxShield",
  "ebq": "ebq",
  "dpmo": "dpmo",
  "pps": "pps",
  "ppm": "ppm",
  "pctgrr": "pctGRR",
  "grr": "grr",
  "opt_tol": "optimalTolerance",
  "atl": "atl",
  "ctl": "ctl",
  "tsb": "tsb",
  "cfm": "cfm",
  "ach": "ach",
  "eer": "eer",
  "lmt_d": "lmtd",
  "mawp": "mawp",
  "npsh": "npsh",
  "u_value": "uValue",
  "v_rapid": "rapidSpeed",
  "v_air": "airSpeed",
  "z_score": "zScore",
  "p_value": "pValue",
  "r_value": "rValue",
  "r_squared": "rSquared",
  "t_stat": "tStat",
  "f_stat": "fStat",
  "chi_square": "chiSquare",
  "adj_r2": "adjRSquared",
  "aic": "aic",
  "bic": "bic",
  "mse": "mse",
  "rmse": "rmse",
  "mae": "mae",
  "mape": "mape",
  "x_i": "xI",
  "y_i": "yI",
  "z_i": "zI",
  "w_i": "wI",
  "act_i": "actI",
  "cost_i": "costI",
  "item_i": "itemI",
  "unitprice_i": "unitPriceI",
  "quantity_i": "quantityI",
  "activitydata_i": "activityDataI",
  "emissionfactor_i": "emissionFactorI",
  "material_i": "materialI",
  "materialef_i": "materialEfI",
  "fuel_i": "fuelI",
  "fuelconsumption_i": "fuelConsumptionI",
  "receipts_t": "receiptsT",
  "payments_t": "paymentsT",
  "netcashflow_t": "netCashFlowT",
  "cumulativecashflow": "cumulativeCashFlow",
  "cashgap": "cashGap",
  "inflation_mat": "materialInflation",
  "inflation_lab": "laborInflation",
  "infl_mat": "materialInflationRate",
  "infl_lab": "laborInflationRate",
  "infl": "inflation",
  "nominal": "nominalRate",
  "real": "realRate",
  "pctchange_price": "priceChangePct",
  "pctchange_dem": "demandChangePct",
  "k": "kFactor",
  "p_atm": "atmosphericPressure",
  "p_flow": "flowPressure",
  "t_fill": "fillTime",
  "t_cycle": "cycleTime",
  "t_shift": "shiftTime",
  "t_available": "availableTime",
  "t_planned": "plannedTime",
  "t_operating": "operatingTime",
  "n": "sampleSize",
  "p_aql": "aqlDefectRate",
  "p_ltpd": "ltpdDefectRate",
  "stdev": "stdDev",
  "stddev": "stdDev",
  "alpha": "alphaRisk",
  "beta": "betaRisk",
  "k_factors": "kFactors",
  "m": "mFactor",
  "p_actual": "actualPressure",
  "v_total": "totalVolume",
  "v_tank": "tankVolume",
  "v_part": "partVolume",
  "v_item": "itemVolume",
  "t_diag": "diagnosisTime",
  "t_repair": "repairTime",
  "t_load": "loadTime",
  "t_unload": "unloadTime",
};

function toCamel(name) {
  const raw = name.replace(/[^a-zA-Z0-9_]/g, "_").replace(/^_|_$/g, "");
  if (CAMEL_OVERRIDES[raw]) return CAMEL_OVERRIDES[raw];

  // Lowercase but handle abbreviations
  const parts = raw.split("_").filter(Boolean);
  if (parts.length === 0) return raw.toLowerCase();
  const result = parts.map((p, i) => {
    if (i === 0) {
      // First word: lowercase
      if (p.length <= 2) return p.toLowerCase();
      // Check if all uppercase (abbreviation)
      if (/^[A-Z]+$/.test(p) && p.length > 2) return p.toLowerCase();
      return p.charAt(0).toLowerCase() + p.slice(1);
    }
    // Subsequent words: capitalize first letter
    if (p.length <= 2) return p.toUpperCase();
    return p.charAt(0).toUpperCase() + p.slice(1).toLowerCase();
  });
  return result.join("");
}

// ───── Tokenizer ─────

function tokenize(expr) {
  const tokens = [];
  let i = 0;
  while (i < expr.length) {
    const ch = expr[i];
    if (/\s/.test(ch)) { i++; continue; }

    // Multi-char operators
    let peek2 = expr.slice(i, i + 2);
    if (peek2 === "<=" || peek2 === ">=" || peek2 === "==" || peek2 === "!=" || peek2 === "&&" || peek2 === "||") {
      tokens.push(peek2); i += 2; continue;
    }

    // Single char operators
    if ("+-*/%^()=,<>!&|".includes(ch)) { tokens.push(ch); i++; continue; }

    // Number (including scientific notation)
    if (/[\d.]/.test(ch)) {
      let num = "";
      while (i < expr.length && /[\d.eE+-]/.test(expr[i])) {
        num += expr[i];
        if ((expr[i] === "e" || expr[i] === "E") && i + 1 < expr.length) {
          i++;
          num += expr[i]; // consume + or -
        }
        i++;
      }
      // Check if the last char is an operator that got absorbed
      const last = num[num.length - 1];
      if (last === "+" || last === "-") {
        tokens.push(num.slice(0, -1));
        tokens.push(last);
      } else {
        tokens.push(num);
        // DON'T advance i further — it's already past the last digit
      }
      continue;
    }

    // String literal
    if (ch === '"') {
      let str = ""; i++;
      while (i < expr.length && expr[i] !== '"') { str += expr[i]; i++; }
      i++; // skip closing "
      tokens.push(`"${str}"`);
      continue;
    }

    // Identifier (function name or variable) — no dots in identifiers
    if (/[a-zA-Z_]/.test(ch)) {
      let id = "";
      while (i < expr.length && /[a-zA-Z0-9_]/.test(expr[i])) { id += expr[i]; i++; }
      tokens.push(id);
      continue;
    }

    i++; // skip unknown
  }
  return tokens;
}

// ───── Recursive descent expression parser ─────

/**
 * Parse a tokenized expression into a TypeScript expression string.
 * Variables are replaced with `num(inputs, "varName")` calls.
 * Returns { expr: string, idx: number }.
 */
function parseExpr(tokens, idx) {
  return parseConditional(tokens, idx);
}

function parseConditional(tokens, idx) {
  let { expr: left, idx: idx2 } = parseLogicalOr(tokens, idx);
  if (idx2 < tokens.length && tokens[idx2] === "?") {
    const { expr: trueE, idx: idx3 } = parseConditional(tokens, idx2 + 1);
    if (idx3 < tokens.length && tokens[idx3] === ":") {
      const { expr: falseE, idx: idx4 } = parseConditional(tokens, idx3 + 1);
      return { expr: `(${left} ? ${trueE} : ${falseE})`, idx: idx4 };
    }
    return { expr: left, idx: idx2 };
  }
  return { expr: left, idx: idx2 };
}

function parseLogicalOr(tokens, idx) {
  let { expr: left, idx: idx2 } = parseLogicalAnd(tokens, idx);
  while (idx2 < tokens.length && (tokens[idx2] === "||" || tokens[idx2] === "OR")) {
    idx2++;
    const { expr: right, idx: idx3 } = parseLogicalAnd(tokens, idx2);
    left = `(${left} || ${right})`;
    idx2 = idx3;
  }
  return { expr: left, idx: idx2 };
}

function parseLogicalAnd(tokens, idx) {
  let { expr: left, idx: idx2 } = parseComparison(tokens, idx);
  while (idx2 < tokens.length && (tokens[idx2] === "&&" || tokens[idx2] === "AND")) {
    idx2++;
    const { expr: right, idx: idx3 } = parseComparison(tokens, idx2);
    left = `(${left} && ${right})`;
    idx2 = idx3;
  }
  return { expr: left, idx: idx2 };
}

function parseComparison(tokens, idx) {
  let { expr: left, idx: idx2 } = parseAddSub(tokens, idx);
  const comparators = ["<=", ">=", "==", "!=", "<", ">"];
  while (idx2 < tokens.length && comparators.includes(tokens[idx2])) {
    const op = tokens[idx2];
    idx2++;
    const { expr: right, idx: idx3 } = parseAddSub(tokens, idx2);
    left = `(${left} ${op} ${right})`;
    idx2 = idx3;
  }
  return { expr: left, idx: idx2 };
}

function parseAddSub(tokens, idx) {
  let { expr: left, idx: idx2 } = parseMulDiv(tokens, idx);
  while (idx2 < tokens.length && (tokens[idx2] === "+" || tokens[idx2] === "-")) {
    const op = tokens[idx2];
    idx2++;
    const { expr: right, idx: idx3 } = parseMulDiv(tokens, idx2);
    left = `(${left} ${op} ${right})`;
    idx2 = idx3;
  }
  return { expr: left, idx: idx2 };
}

function parseMulDiv(tokens, idx) {
  let { expr: left, idx: idx2 } = parseUnary(tokens, idx);
  while (idx2 < tokens.length && (tokens[idx2] === "*" || tokens[idx2] === "/")) {
    const op = tokens[idx2];
    idx2++;
    const { expr: right, idx: idx3 } = parseUnary(tokens, idx2);
    left = `(${left} ${op} ${right})`;
    idx2 = idx3;
  }
  // Handle power operator ^
  while (idx2 < tokens.length && tokens[idx2] === "^") {
    idx2++;
    const { expr: right, idx: idx3 } = parseUnary(tokens, idx2);
    left = `Math.pow(${left}, ${right})`;
    idx2 = idx3;
  }
  return { expr: left, idx: idx2 };
}

function parseUnary(tokens, idx) {
  if (idx >= tokens.length) return { expr: "0", idx };
  if (tokens[idx] === "+") {
    const { expr, idx: idx2 } = parsePrimary(tokens, idx + 1);
    return { expr, idx: idx2 };
  }
  if (tokens[idx] === "-") {
    const { expr, idx: idx2 } = parsePrimary(tokens, idx + 1);
    return { expr: `(-(${expr}))`, idx: idx2 };
  }
  if (tokens[idx] === "!") {
    const { expr, idx: idx2 } = parsePrimary(tokens, idx + 1);
    return { expr: `(!(${expr}))`, idx: idx2 };
  }
  return parsePrimary(tokens, idx);
}

/** Known constant identifiers that should NOT be treated as inputs. */
const NON_INPUT_IDENTIFIERS = new Set([
  "PI", "E", "TRUE", "FALSE", "true", "false",
]);

function parsePrimary(tokens, idx) {
  if (idx >= tokens.length) return { expr: "0", idx };

  const token = tokens[idx];

  // Number literal
  if (/^-?[\d.]+(e[\d+-]+)?$/i.test(token)) {
    return { expr: token, idx: idx + 1 };
  }

  // String literal
  if (token.startsWith('"') && token.endsWith('"')) {
    return { expr: token, idx: idx + 1 };
  }

  // TRUE / FALSE (Excel constants)
  if (token.toUpperCase() === "TRUE") return { expr: "true", idx: idx + 1 };
  if (token.toUpperCase() === "FALSE") return { expr: "false", idx: idx + 1 };

  // PI constant (standalone)
  if (token === "PI" || token === "Pi" || token === "pI") {
    return { expr: "Math.PI", idx: idx + 1 };
  }

  // Function call: IDENTIFIER ( ... )
  if (idx + 1 < tokens.length && tokens[idx + 1] === "(") {
    const funcName = token.toUpperCase();

    // Excel's PI() function
    if (funcName === "PI") {
      let idx2 = idx + 2;
      let depth = 1;
      while (idx2 < tokens.length && depth > 0) {
        if (tokens[idx2] === "(") depth++;
        else if (tokens[idx2] === ")") depth--;
        idx2++;
      }
      return { expr: "Math.PI", idx: idx2 };
    }

    // STDEV / STDEV.S
    if (funcName === "STDEV" || funcName === "STDEV_S" || funcName === "STDEVP") {
      const { args, idx: idx2 } = parseArgList(tokens, idx + 1);
      return { expr: `stdev([${args.join(", ")}])`, idx: idx2 };
    }

    // SORT
    if (funcName === "SORT") {
      const { args, idx: idx2 } = parseArgList(tokens, idx + 1);
      return { expr: `[...[${args.join(", ")}]].sort((a,b) => b - a)`, idx: idx2 };
    }

    // IF function (special handling for string results → convert to 1/0)
    if (funcName === "IF") {
      const { args, idx: idx2 } = parseArgList(tokens, idx + 1);
      if (args.length >= 3) {
        const cond = args[0], trueVal = args[1], falseVal = args[2];
        // If the true/false values are strings, convert to number (1/0)
        const isStrTrue = /^"/.test(trueVal);
        const isStrFalse = /^"/.test(falseVal);
        if (isStrTrue || isStrFalse) {
          return { expr: `(${cond} ? 1 : 0)`, idx: idx2 };
        }
        return { expr: `(${cond} ? ${trueVal} : ${falseVal})`, idx: idx2 };
      }
      return { expr: "0", idx: idx2 };
    }

    // Known Excel functions (no special arg handling needed)
    if (EXCEL_FUNCTIONS[funcName]) {
      const { args, idx: idx2 } = parseArgList(tokens, idx + 1);
      return { expr: EXCEL_FUNCTIONS[funcName](args), idx: idx2 };
    }

    // Logic analyzer functions: IF(cond, value, else) — also handle nested lookups
    // BINOMDIST — normal approximation via NORMSDIST
    if (funcName === "BINOMDIST" || funcName === "BINOMDIST_S" || funcName === "BINOMDIST_RANGE") {
      const { args, idx: idx2 } = parseArgList(tokens, idx + 1);
      // BINOMDIST(successes, trials, prob, cumulative) → normal approximation
      if (args.length >= 3) {
        const trials = args[1], prob = args[2];
        return { expr: `normStd(((${trials} * ${prob}) - (${trials} * 0.5)) / Math.sqrt(${trials} * ${prob} * (1 - ${prob})))`, idx: idx2 };
      }
      return { expr: "0.5 /* BINOMDIST stub */", idx: idx2 };
    }

    // NORMSINV — rational approximation
    if (funcName === "NORMSINV") {
      const { args, idx: idx2 } = parseArgList(tokens, idx + 1);
      return { expr: `normsInv(${args[0]})`, idx: idx2 };
    }

    // MACRS / lookup functions → return 0 with comment
    if (funcName === "LOOKUPCODE" || funcName === "SAMPLESIZE" || funcName === "ACCEPTANCENUMBER"
        || funcName === "MACRS_TABLE" || funcName.startsWith("LOOKUP") || funcName.startsWith("VLOOKUP")
        || funcName === "F") {
      const { args, idx: idx2 } = parseArgList(tokens, idx + 1);
      return { expr: `0 /* ${funcName} → manual implementation needed */`, idx: idx2 };
    }

    // Unknown function → 0 stub
    const { args, idx: idx2 } = parseArgList(tokens, idx + 1);
    return { expr: `0 /* ${funcName} stub */`, idx: idx2 };
  }

  // Parenthesized expression
  if (token === "(") {
    const { expr, idx: idx2 } = parseExpr(tokens, idx + 1);
    if (idx2 < tokens.length && tokens[idx2] === ")") {
      return { expr: `(${expr})`, idx: idx2 + 1 };
    }
    return { expr, idx: idx2 };
  }

  // Variable identifier (not PI, TRUE, FALSE, etc.)
  if (/^[a-zA-Z_]/.test(token)) {
    const upper = token.toUpperCase();
    if (NON_INPUT_IDENTIFIERS.has(upper)) {
      // Should not happen since we handled PI/TRUE/FALSE above
      return { expr: upper, idx: idx + 1 };
    }
    // Special: if starts with underscore, clean it
    const cleanKey = toCamel(token);
    return { expr: `num(inputs, "${cleanKey}")`, idx: idx + 1 };
  }

  return { expr: "0", idx: idx + 1 };
}

/**
 * Parse a comma-separated argument list inside parentheses.
 * tokens[idx] should be the opening "(".
 * Returns { args: string[], idx: number } where idx points past ")".
 */
function parseArgList(tokens, idx) {
  const args = [];
  if (idx >= tokens.length) return { args, idx };

  // Skip opening "("
  if (tokens[idx] === "(") idx++;

  let depth = 0;
  let currentStart = idx;

  function extractCurrent() {
    if (currentStart < idx) {
      const sub = tokens.slice(currentStart, idx);
      // Try to parse as a single argument
      try {
        const { expr } = parseExpr(sub, 0);
        args.push(expr);
      } catch {
        args.push(sub.join(" "));
      }
    }
  }

  while (idx < tokens.length) {
    if (tokens[idx] === "(") { depth++; idx++; continue; }
    if (tokens[idx] === ")") {
      if (depth === 0) {
        extractCurrent();
        return { args, idx: idx + 1 };
      }
      depth--;
      idx++;
      continue;
    }
    if (tokens[idx] === "," && depth === 0) {
      extractCurrent();
      currentStart = idx + 1;
      idx++;
      continue;
    }
    idx++;
  }

  // Fallback: treat everything as one arg
  extractCurrent();
  return { args, idx };
}

// ───── Parse single tool line ─────

function parseToolLine(line) {
  line = line.trim();
  if (!line) return null;

  const formulasIdx = line.indexOf(" FORMULAS: ");
  const inputsIdx = line.indexOf(" INPUTS: ");

  if (formulasIdx === -1 || inputsIdx === -1) return null;

  const toolName = line.slice(0, formulasIdx).trim();
  const formulasSection = line.slice(formulasIdx + " FORMULAS: ".length, inputsIdx).trim();
  const inputsSection = line.slice(inputsIdx + " INPUTS: ".length).trim();

  const formulas = parseFormulasSection(formulasSection);
  const inputs = parseInputsSection(inputsSection);

  return { toolName, formulas, inputs };
}

function parseFormulasSection(section) {
  const parts = [];
  let current = "";
  let depth = 0;
  let inString = false;
  for (const ch of section) {
    if (ch === '"') inString = !inString;
    if (!inString) {
      if (ch === "(") depth++;
      else if (ch === ")") depth--;
    }
    if (ch === ";" && depth === 0 && !inString) {
      parts.push(current.trim());
      current = "";
    } else {
      current += ch;
    }
  }
  if (current.trim()) parts.push(current.trim());

  const result = [];
  for (const part of parts) {
    // Find first "=" that is not inside parens
    let eqIdx = -1;
    let d = 0;
    for (let i = 0; i < part.length; i++) {
      if (part[i] === "(") d++;
      else if (part[i] === ")") d--;
      else if (part[i] === "=" && d === 0) { eqIdx = i; break; }
    }
    if (eqIdx === -1) continue;
    const varName = part.slice(0, eqIdx).trim();
    const expression = part.slice(eqIdx + 1).trim();
    result.push({ varName, expression });
  }
  return result;
}

function parseInputsSection(section) {
  const inputs = [];
  // Split on "; " but not inside parentheses
  const personas = [];
  let current = "";
  let depth = 0;
  for (const ch of section) {
    if (ch === "(") depth++;
    else if (ch === ")") depth--;
    if (ch === ";" && depth === 0) {
      personas.push(current.trim());
      current = "";
    } else {
      current += ch;
    }
  }
  if (current.trim()) personas.push(current.trim());

  for (const personaBlock of personas) {
    const colonIdx = personaBlock.indexOf(":");
    if (colonIdx === -1) continue;
    const persona = personaBlock.slice(0, colonIdx).trim();
    const inputPart = personaBlock.slice(colonIdx + 1).trim();
    // Split by commas, respecting parentheses
    const inputItems = splitByCommaOutsideParens(inputPart);
    for (const item of inputItems) {
      const trimmed = item.trim();
      if (!trimmed) continue;
      const typeMatch = trimmed.match(/\(([^)]+)\)$/);
      if (!typeMatch) {
        inputs.push({ name: trimmed, type: "number", persona });
        continue;
      }
      const name = trimmed.slice(0, typeMatch.index).trim();
      const type = typeMatch[1].toLowerCase();
      inputs.push({ name, type, persona });
    }
  }
  return inputs;
}

function splitByCommaOutsideParens(str) {
  const parts = [];
  let current = "";
  let depth = 0;
  for (const ch of str) {
    if (ch === "(") depth++;
    else if (ch === ")") depth--;
    if (ch === "," && depth === 0) {
      parts.push(current);
      current = "";
    } else {
      current += ch;
    }
  }
  if (current.trim()) parts.push(current.trim());
  return parts;
}

// ───── Tool name → slug and ID helpers ─────

function toolNameToSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, "-")
    .replace(/^-|-$/g, "");
}

function toolNameToIdPrefix(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, "_")
    .replace(/^_|_$/g, "");
}

function formulaVarToId(toolPrefix, varName) {
  const cleanVar = varName
    .replace(/[^a-zA-Z0-9]/g, "_")
    .replace(/_+/g, "_")
    .toLowerCase();
  return `${toolPrefix}.${cleanVar}`;
}

// ───── Guess formula family ─────

function guessFamily(varName, expression) {
  const expr = expression.toLowerCase();
  const vn = varName.toLowerCase();

  if (/carbon|certificate|emission|scope1|scope2|ghg|carbonprice/i.test(expr)) return "carbon";
  if (/carbon|emission|carbonintensity|scope1|scope2|ghg/i.test(vn)) return "carbon";

  if (/kwh|energy|elec|power|demandcharge|reactivepenalty|pf_power|powerfactor/i.test(vn)) return "energy";
  if (/kwh|energy|elec|power|btu|therm/i.test(expr)) return "energy";

  if (/^npv$|^irr$|^mirr$|^roi$|^payback$|^lcoe$|^wacc$|^annuity$|^pi_profit/i.test(vn)) return "finance";
  if (/npv|irr|mirr|payback|annuity|wacc|discount/i.test(expr) && !/cost/i.test(vn)) return "finance";

  if (/dpmo|sigma|cpk|z_bench|z_usl|z_lsl|quotevariance|deviation_/i.test(vn)) return "measurement";
  if (/stdev|cpk|dpmo|sigma|normsdist|normsinv/i.test(expr)) return "measurement";

  if (/oee|availability|performance|teep|bottleneck|throughput|takt|utilization/i.test(vn)) return "oee";
  if (/oee|teep|takt/i.test(expr)) return "oee";

  if (/laborcost|downtime|recovery|overtime|setup|changeover|setupcost/i.test(vn)) return "time";
  if (/overtime|setup|changeover/i.test(expr)) return "time";

  if (/scrap|copq|qualityloss|defect|comeback|rework|scraprate/i.test(vn)) return "scrap";
  if (/scrap|rework|defect/i.test(expr) && !/defectrate/i.test(vn)) return "scrap";

  if (/route|freight|transport|distance|fuelwaste|deadhead|driftcost|navlun|rota/i.test(vn)) return "route";
  if (/freight|navlun/i.test(expr)) return "route";

  if (/muda|kaizen|smed|lineeff|balance|smoothness|balanceloss/i.test(vn)) return "lean";
  if (/muda|kaizen|smed|balanceloss/i.test(expr)) return "lean";

  if (/pressure|flow|vessel|hydraulic|tank|pump|pipe|valve|heat|exchanger|steam|resource|weld/i.test(vn)) return "fluid";
  if (/pressure|vessel|hydraulic|heat|steam/i.test(expr) && !/inflation|tax|budget/i.test(expr)) return "fluid";

  if (/cost|total|tco|margin|price|budget|estimate|investment|fee|penalty|savings|leakage|overrun|revenue/i.test(vn)) return "cost";
  if (/cost|price|margin|tco/i.test(expr) && !/emission|energy|tax/i.test(expr)) return "cost";

  if (/score|index|compliance|risk|variance|gap_|efficiency/i.test(vn)) return "benchmark";
  if (/yield|loss|waste|muda/i.test(vn)) return "scrap";

  return "cost";
}

function guessOutputHint(varName, expression) {
  const vn = varName.toLowerCase();
  const expr = expression.toLowerCase();

  if (/pct|percent|rate$|ratio|yield|efficiency|margin$|taxrate|utilization|oee|cpi|spi/i.test(vn)) return "percentage";
  if (/dollar|eur|try|usd|cost|price|fee|penalty|savings|revenue|budget|income|expense|tco|investment|premium|fine/i.test(vn)) return "currency";
  if (/score|index|risk|rating|level|class|grade/i.test(vn)) return "score";
  if (/time|hour|minute|duration|period|leadtime|cycle|hafta|ay|year|year|month|week|day|duration/i.test(vn)) return "duration";
  if (/^n$|^k$|count|number|volume|area|quantity|size|weight|mass|distance|count|quantity/i.test(vn)) return "number";
  if (/ppm|dpmo|cpk/i.test(vn)) return "number";
  if (/compliance/i.test(vn) && /score|index/i.test(vn)) return "score";

  if (/\/\s*100\b/.test(expr) && !vn.includes("cost") && !vn.includes("price")) return "percentage";
  if (/\*\s*(1\s*\+\s*|1\s*-\s*)/.test(expr) && vn.includes("cost")) return "currency";
  if (/cost|price|fee|penalty|savings|total/i.test(vn)) return "currency";
  if (/score|index|risk/i.test(vn)) return "score";

  return "number";
}

// ───── Generate formula definition ─────

/**
 * Generate a single formula definition by parsing the expression.
 * Extracts variable names, builds the TypeScript body.
 */
function generateDefinition(toolPrefix, varName, expression) {
  const formulaId = formulaVarToId(toolPrefix, varName);
  const family = guessFamily(varName, expression);
  const label = varName;

  const tokens = tokenize(expression);
  let { expr: tsExpr } = parseExpr(tokens, 0);

  // Make duration we have reasonable wrapping
  const outputHint = guessOutputHint(varName, expression);
  if (outputHint === "currency" || outputHint === "number") {
    tsExpr = `nonNegative(${tsExpr})`;
  } else {
    tsExpr = `assertFinite(${tsExpr})`;
  }

  const fnBody = `(inputs) => ${tsExpr}`;

  // Extract input keys from the expression
  const inputKeys = [];
  const keyPattern = /num\(inputs,\s*"([^"]+)"\)/g;
  let match;
  while ((match = keyPattern.exec(tsExpr)) !== null) {
    if (!inputKeys.includes(match[1])) inputKeys.push(match[1]);
  }

  return {
    formulaId,
    entry: `  {
    id: "${formulaId}",
    family: "${family}",
    label: "${label}",
    fn: ${fnBody},
  },`,
    metaDetail: `${JSON.stringify(formulaId)}: { description: "${label} formula.", requiredInputs: [${inputKeys.map(k => JSON.stringify(k)).join(", ")}], outputHint: "${outputHint}" },`,
    outputId: toCamel(varName),
    inputMap: Object.fromEntries(inputKeys.map(k => [k, k])),
    inputKeys,
  };
}

// ───── Detect array-like inputs (for STDEV, AVERAGE) ─────

function detectArrayInputs(expression, allInputs) {
  // Look for instances of STDEV(X) or AVERAGE(X) where X is a single variable
  // that represents an array (like QuoteAmounts)
  const arrayPattern = /(STDEV|AVERAGE)\(([A-Za-z_][A-Za-z0-9_]*)\)/g;
  const arrayVarHints = [];
  let m;
  while ((m = arrayPattern.exec(expression)) !== null) {
    const varName = m[2];
    const camel = toCamel(varName);
    arrayVarHints.push({ rawVar: varName, camelVar: camel, func: m[1] });
  }
  return arrayVarHints;
}

// ───── Main ─────

async function main() {
  const batchPath = path.join(ROOT, "data", "premium-formulas-batch.txt");
  const outDir = path.join(__dirname, "generated-premium");

  if (!fs.existsSync(batchPath)) {
    console.error(`ERROR: Batch file not found at ${batchPath}`);
    process.exit(1);
  }

  const content = fs.readFileSync(batchPath, "utf-8").trim();
  const lines = content.split("\n").filter(l => l.trim());

  console.log(`Read ${lines.length} lines from batch file`);

  // Parse all tools
  const tools = [];
  let parseErrors = 0;
  let errorLines = [];
  for (let li = 0; li < lines.length; li++) {
    const parsed = parseToolLine(lines[li]);
    if (!parsed) {
      parseErrors++;
      errorLines.push(li + 1);
      // Still try to capture the tool name
      const fnIdx = lines[li].indexOf(" FORMULAS: ");
      const name = fnIdx !== -1 ? lines[li].slice(0, fnIdx).trim() : `Line ${li + 1}`;
      console.warn(`  ⚠ Warning: Could not parse line ${li + 1}: "${name}"`);
      continue;
    }
    tools.push(parsed);
  }

  console.log(`Parsed ${tools.length} tools, ${parseErrors} parse errors`);

  // Generate code for each tool
  const allDefs = [];
  const allMetaDetails = [];
  const allPipelineEntries = [];
  const stubsList = [];
  const warnings = [];

  for (const tool of tools) {
    const { toolName, formulas, inputs: detectedInputs } = tool;
    const toolPrefix = toolNameToIdPrefix(toolName);
    const toolSlug = toolNameToSlug(toolName);

    // Build known input keys from detected inputs
    const knownInputKeys = new Set();
    for (const inp of detectedInputs) {
      knownInputKeys.add(toCamel(inp.name));
    }

    const definitions = [];
    for (const formula of formulas) {
      const { varName, expression } = formula;
      const def = generateDefinition(toolPrefix, varName, expression);
      definitions.push(def);

      // Check for array input patterns
      const arrayHints = detectArrayInputs(expression, detectedInputs);
      for (const hint of arrayHints) {
        if (!knownInputKeys.has(hint.camelVar)) {
          warnings.push(`  ⚡ ${def.formulaId}: "${hint.rawVar}" is an array variable (${hint.func}). Expect separate inputs like "${hint.camelVar}1, ${hint.camelVar}2, ..."`);
        }
      }

      // Check if formula uses a stub
      if (def.entry.includes("manual implementation") || def.entry.includes("stub")) {
        stubsList.push(def.formulaId);
      }
    }

    allDefs.push(...definitions);
    allMetaDetails.push(...definitions.map(d => d.metaDetail));

    allPipelineEntries.push({
      toolName,
      toolSlug,
      toolPrefix,
      steps: definitions.map(d => ({
        formulaId: d.formulaId,
        outputId: d.outputId,
        inputMap: d.inputMap,
      })),
    });
  }

  // ───── Write output files ─────
  fs.mkdirSync(outDir, { recursive: true });

  // 1. Formula definitions
  let defsContent = `// Auto-generated by scripts/generate-premium-formulas.mjs
// Do not edit manually. Source: archive/migration-only/data/premium-formulas-batch.txt
// Generated: ${new Date().toISOString()}

import { num, nonNegative, assertFinite, safeDivide, normStd } from "@/lib/premium-schema/formula-registry";

// ───── Helpers ─────

/** Rational approximation for NORMSINV (Abramowitz & Stegun 26.2.23). */
function normsInv(p: number): number {
  if (p <= 0) return -Infinity;
  if (p >= 1) return Infinity;
  const t = Math.sqrt(-2 * Math.log(1 - p));
  return t - (2.515517 + 0.802853 * t + 0.010328 * t * t) /
            (1 + 1.432788 * t + 0.189269 * t * t + 0.001308 * t * t * t);
}

/** Sample standard deviation of an array. */
function stdev(values: number[]): number {
  const n = values.length;
  if (n < 2) return 0;
  const mean = values.reduce((a, b) => a + b, 0) / n;
  return Math.sqrt(values.reduce((sum, v) => sum + (v - mean) ** 2, 0) / (n - 1));
}

// ─── Generated formula definitions ───────────────────────────────────────
// Add these to FORMULA_DEFINITIONS in formula-registry.ts

export const PREMIUM_FORMULA_DEFINITIONS: readonly {
  id: string;
  family: string;
  label: string;
  fn: (inputs: Record<string, number>) => number;
}[] = [
`;

  for (const def of allDefs) {
    defsContent += def.entry + "\n";
  }

  defsContent += `];
`;
  fs.writeFileSync(path.join(outDir, "formula-definitions.ts"), defsContent);

  // 2. Formula meta details
  let metaContent = `// Auto-generated by scripts/generate-premium-formulas.mjs
// Source: archive/migration-only/data/premium-formulas-batch.txt
// Generated: ${new Date().toISOString()}

export const BATCH_FORMULA_META_DETAILS: Record<
  string,
  { description: string; requiredInputs: readonly string[]; outputHint: string }
> = {
${allMetaDetails.join("\n")}
};
`;
  fs.writeFileSync(path.join(outDir, "formula-meta.ts"), metaContent);

  // 3. Schema pipelines
  let pipelineContent = `// Auto-generated by scripts/generate-premium-formulas.mjs
// Source: archive/migration-only/data/premium-formulas-batch.txt
// Generated: ${new Date().toISOString()}

import type { FormulaPipelineStep, PremiumInputSchema } from "@/lib/premium-schema/premium-calculator-schema";

export interface ToolPipeline {
  toolName: string;
  toolSlug: string;
  toolPrefix: string;
  steps: FormulaPipelineStep[];
  inputs: PremiumInputSchema[];
}

export const TOOL_PIPELINES: ToolPipeline[] = [
`;

  for (const entry of allPipelineEntries) {
    pipelineContent += `  {
    toolName: ${JSON.stringify(entry.toolName)},
    toolSlug: ${JSON.stringify(entry.toolSlug)},
    toolPrefix: ${JSON.stringify(entry.toolPrefix)},
    steps: [\n`;
    for (const step of entry.steps) {
      const mapStr = Object.keys(step.inputMap).length > 0
        ? JSON.stringify(step.inputMap)
        : "{}";
      pipelineContent += `      { formulaId: ${JSON.stringify(step.formulaId)}, outputId: ${JSON.stringify(step.outputId)}, inputMap: ${mapStr} },\n`;
    }
    pipelineContent += `    ],
    inputs: [],
  },
`;
  }

  pipelineContent += `];

// ─── Individual tool pipeline exports ────────────────────────────────────
`;
  for (const entry of allPipelineEntries) {
    const constName = entry.toolPrefix.replace(/[^a-zA-Z0-9_]/g, "_") + "_PIPELINE";
    const stepsCode = entry.steps
      .map(s => {
        const mapStr = JSON.stringify(s.inputMap);
        return `  { formulaId: ${JSON.stringify(s.formulaId)}, outputId: ${JSON.stringify(s.outputId)}, inputMap: ${mapStr} }`;
      })
      .join(",\n");

    pipelineContent += `
export const ${constName}: FormulaPipelineStep[] = [
${stepsCode},
];
`;
  }

  fs.writeFileSync(path.join(outDir, "schema-pipelines.ts"), pipelineContent);

  // 4. Summary
  const totalFormulas = allDefs.length;
  const familyCounts = {};
  for (const def of allDefs) {
    const fam = def.entry.match(/family: "(\w+)"/)?.[1] || "unknown";
    familyCounts[fam] = (familyCounts[fam] || 0) + 1;
  }

  let summary = `# Premium Formula Generation Summary
Generated: ${new Date().toISOString()}
Source: archive/migration-only/data/premium-formulas-batch.txt

## Tools: ${tools.length}
## Total Formulas: ${totalFormulas}

## Family Distribution
| Family | Count |
|--------|-------|
`;
  const sortedFamilies = Object.entries(familyCounts).sort((a, b) => b[1] - a[1]);
  for (const [fam, count] of sortedFamilies) {
    summary += `| ${fam} | ${count} |\n`;
  }

  summary += `\n## Tools Generated
| # | Tool Name | Slug | Formulas |
|---|-----------|------|----------|
`;
  let toolIdx = 1;
  for (const entry of allPipelineEntries) {
    summary += `| ${toolIdx++} | ${entry.toolName} | ${entry.toolSlug} | ${entry.steps.length} |\n`;
  }

  // Stubs section
  if (stubsList.length > 0) {
    summary += `\n## ⚠️ Stub Formulas (need manual implementation)
The following ${stubsList.length} formulas use lookup tables or complex functions:
`;
    for (const sf of stubsList) {
      summary += `- \`${sf}\`\n`;
    }
  }

  // Warnings section
  if (warnings.length > 0) {
    summary += `\n## ⚡ Array Variable Warnings
The following formulas reference array variables that need individual input fields:
`;
    for (const w of warnings) {
      summary += `- ${w}\n`;
    }
  }

  summary += `\n## Output Files
- \`formula-definitions.ts\` — ${totalFormulas} formula definitions
- \`formula-meta.ts\` — BATCH_FORMULA_META_DETAILS with ${totalFormulas} entries
- \`schema-pipelines.ts\` — ${allPipelineEntries.length} tool pipeline arrays
`;

  fs.writeFileSync(path.join(outDir, "summary.md"), summary);

  // Console summary
  console.log(`\n✅ Generation complete!
  Output: ${outDir}
  Tools: ${tools.length}
  Formulas: ${totalFormulas}
  Stubs: ${stubsList.length}
  Array variable warnings: ${warnings.length}
  Parse errors: ${parseErrors}

  Files written:
    - formula-definitions.ts (${(defsContent.length / 1024).toFixed(0)} KB)
    - formula-meta.ts
    - schema-pipelines.ts
    - summary.md
`);
}

main().catch(console.error);
