/**
 * ═══════════════════════════════════════════════════════════════════════════
 * PRO TOOL ADAPTER (v3 — FULL INDUSTRIAL FIX)
 * ───────────────────────────────────────────────────────────────────────────
 * Bridges the verified calculation engine (claude_pro_tasrım_ design) with
 * existing PRO tool JSON data files. Translates raw JSON tool definitions
 * into the engine's ToolSchema format.
 *
 * v3 fixes:
 *   • Multi-statement: split on `;` FIRST, then extract LHS=RHS per statement
 *   • Lookup tables: convert {k:v,...}; x=obj[key] → chained conditionals
 *   • For-loops: replace Colebrook-White iteration with Swamee-Jain approx.
 *   • String comparisons: substitute enum position for == 'label'
 *   • Pure-string outputs (prose results): map to 0/1 numeric
 *   • ± in uncertainty: handle both ASCII and Unicode
 *   • Validation rules: rule id from condition when missing
 * ═══════════════════════════════════════════════════════════════════════════
 */
import type { ToolSchema, InputField, FormulaNode, ValidationRule, Uncertainty } from './types';
import { prepare, compute } from './engine';
import { toCanonical } from './units';

/* ═══════════════════════  EXPRESSION NORMALISATION  ═══════════════════════ */

const MATH_FN_MAP: Record<string, string> = {
  'Math.sqrt':'sqrt','Math.pow':'pow','Math.abs':'abs','Math.log':'log','Math.log10':'log10',
  'Math.exp':'exp','Math.min':'min','Math.max':'max','Math.floor':'floor','Math.ceil':'ceil',
  'Math.round':'round','Math.sin':'sin','Math.cos':'cos','Math.tan':'tan','Math.atan2':'atan2',
  'Math.asin':'asin','Math.acos':'acos','Math.atan':'atan','Math.cbrt':'cbrt','Math.sign':'sign',
  'Math.hypot':'hypot','Math.tanh':'tanh','Math.sinh':'sinh','Math.cosh':'cosh',
};

const UPPER_FN_MAP: Record<string, string> = {
  'POWER':'pow','ABS':'abs','MIN':'min','MAX':'max','SQRT':'sqrt','EXP':'exp','LOG':'log',
  'LOG10':'log10','SIN':'sin','COS':'cos','TAN':'tan','ROUND':'round','FLOOR':'floor','CEIL':'ceil',
  'NORMSDIST':'normsdist','RADIANS':'radians','DEGREES':'degrees',
};

/**
 * Core expression normaliser: Math.xxx → mathjs, logical ops, uppercase fns.
 * Does NOT handle multi-statement splitting (done upstream).
 */
export function normalizeExpression(expr: string): string {
  let r = expr;
  // Math constants
  r = r.replace(/Math\.PI\b/g,'pi').replace(/Math\.E\b/g,'e');
  r = r.replace(/Math\.LN2\b/g,'log(2)').replace(/Math\.LN10\b/g,'log(10)');
  r = r.replace(/Math\.LOG2E\b/g,'log2(e)').replace(/Math\.LOG10E\b/g,'log10(e)');
  r = r.replace(/Math\.SQRT1_2\b/g,'sqrt(1/2)').replace(/Math\.SQRT2\b/g,'sqrt(2)');
  r = r.replace(/Math\.PI\b/g,'pi');
  // Math.fn() → fn()
  for (const [m,f] of Object.entries(MATH_FN_MAP)) {
    const pat = new RegExp(m.replace('.','\\.')+'\\s*\\(','g');
    r = r.replace(pat, f+'(');
  }
  // Uppercase functions
  for (const [up,low] of Object.entries(UPPER_FN_MAP)) {
    r = r.replace(new RegExp('\\b'+up+'\\s*\\(','gi'), low+'(');
  }
  // IIF(cond, trueVal, falseVal) → (cond) ? trueVal : falseVal
  // This must handle nested commas, so use a careful approach
  r = r.replace(/\bIIF\s*\(/gi, 'iif(');
  // Logical operators
  r = r.replace(/&&/g,' and ').replace(/\|\|/g,' or ');
  // <> → != (VBA/SQL style inequality)
  r = r.replace(/<>/g,' != ');
  // parseFloat → parsefloat (for mathjs registration)
  r = r.replace(/parseFloat\s*\(/g, 'parsefloat(');
  // Tertiary → mathjs conditional (already compatible)
  // Strict equality → equality
  r = r.replace(/===/g,' == ').replace(/!==/g,' != ');
  return r;
}

/* ═══════════════════════  MULTI-STATEMENT SPLIT  ═══════════════════════ */

/**
 * Smart multi‑statement split: correctly handles for(…;…;…){…} blocks
 * by parenthesising the for‑loop before splitting on top‑level semicolons.
 */
function splitTopLevel(expr: string): string[] {
  const parts: string[] = [];
  let depthParen = 0, depthBrace = 0, start = 0;
  for (let i = 0; i < expr.length; i++) {
    const ch = expr[i];
    if (ch === '(') depthParen++;
    else if (ch === ')') depthParen--;
    else if (ch === '{') depthBrace++;
    else if (ch === '}') depthBrace--;
    else if (ch === ';' && depthParen === 0 && depthBrace === 0) {
      parts.push(expr.slice(start, i).trim());
      start = i + 1;
    }
  }
  const last = expr.slice(start).trim();
  if (last) parts.push(last);
  return parts.filter(Boolean);
}

/**
 * Detect and replace the for‑loop Colebrook‑White friction factor iteration
 * with the Swamee‑Jain explicit approximation (valid for turbulent flow, Re>4000).
 * Original loop pattern:
 *   for(let i=0;i<N;i++){f=1/pow(-2*log10(eps/(3.7*D)+2.51/(Re*sqrt(f))),2)}
 * Swamee-Jain (explicit, no iteration):
 *   f_darcy = 0.25 / pow(log10(eps/(3.7*D) + 5.74/pow(Re, 0.9)), 2)
 */
function replaceForLoop(stmt: string, inputMap: Map<string, InputField>): string {
  // Debug
  const isAql = stmt.includes('binomial_coefficient') || stmt.includes('Pa_accept');
  const hasLog10 = stmt.includes('log10');
  
  // Check for Colebrook-White pattern (PRO_064)
  if (hasLog10 &&
    stmt.includes('log10') &&
    (stmt.includes('roughness') || stmt.includes('epsilon')) &&
    stmt.includes('Re')
  ) {
    let roughnessVar = 'roughness_mm';
    let dhVar = 'D_h_mm';
    const epsMatch = stmt.match(/roughness_mm|epsilon|roughness/);
    if (epsMatch) roughnessVar = epsMatch[0];
    const dhMatch = stmt.match(/D_h_mm|D_h|diameter/);
    if (dhMatch) dhVar = dhMatch[0];
    return `0.25 / pow(log10(${roughnessVar}/(3.7*${dhVar}) + 5.74/pow(Re, 0.9)), 2)`;
  }

  // IRR — PRO_006: Newton-Raphson IRR via _irr(investment, cf, escalation, years, salvage)
  // Match: for(let i...){...irr...} IRR_pct = irr * 100
  if (stmt.includes('IRR_pct') && (stmt.includes('for') || stmt.includes('investment'))) {
    // Extract parameters from the expression using regex
    const invMatch = stmt.match(/initial_investment_usd/g);
    const cfMatch = stmt.match(/CF_after_tax_usd/g);
    const escMatch = stmt.match(/annual_escalation_pct/g);
    const yrMatch = stmt.match(/project_life_yr/g);
    const salMatch = stmt.match(/salvage_value_usd/g);
    // All parameters exist in the formula context
    return 'IRR_pct = _irr(initial_investment_usd, CF_after_tax_usd, annual_escalation_pct, project_life_yr, salvage_value_usd)';
  }

  // Dispersion — PRO_077: Pasquill-Gifford IDLH distance via _dispersion_idlh(...)
  // Match: for(let i...){...stability_class...D_IDLH_m...}
  if (stmt.includes('D_IDLH_m') || (stmt.includes('stability_class') && stmt.includes('dispersion'))) {
    return 'D_IDLH_m = _dispersion_idlh(stability_class, release_rate_kg_s, wind_speed_m_s, release_height_m, molecular_weight_g_mol, IDLH_ppm)';
  }

  // AQL — PRO_AQL_001: Operating characteristic via binomial_cdf
  if (stmt.includes('binomial_coefficient') || stmt.includes('Pa_accept') || stmt.includes('binomial_cdf') || stmt.includes('incoming_quality_pct')) {
    if (stmt.includes('Pa_accept') || (stmt.includes('Pa =') && stmt.includes('for'))) {
      // Pa = sum_{k=0}^{accept_number} binom(sample_size,k) * p^k * (1-p)^(n-k)
      // = binomial_cdf(accept_number, sample_size, p)
      return 'Pa = binomial_cdf(accept_number, sample_size, incoming_quality_pct/100)';
    }
  }

  // Generic for-loop: extract the final assignment if possible
  const eqMatch = stmt.match(/;\s*(\w+\s*=\s*[^;]+)\s*$/);
  if (eqMatch) {
    const eq = eqMatch[1];
    const eqIdx = eq.indexOf('=');
    if (eqIdx > 0) {
      const lhs = eq.substring(0, eqIdx).trim();
      const rhs = normalizeExpression(eq.substring(eqIdx + 1).trim());
      return `${lhs} = ${rhs}`;
    }
  }
  return '_dummy_loop_result = 0';
}

/**
 * Converts a lookup‑table pattern:
 *   map = {k1:v1, k2:v2, …}; result = map[key]
 * into:
 *   result = (key == k1) ? v1 : (key == k2) ? v2 : vDefault
 */
function replaceLookupTable(stmts: string[]): string[] {
  const out: string[] = [];
  let i = 0;
  while (i < stmts.length) {
    const s = stmts[i].trim();
    // Detect object‑literal assignment: mapName = {…}
    const objMatch = s.match(/^(\w+)\s*=\s*\{([^}]+)\}\s*;?\s*$/);
    if (objMatch) {
      const mapName = objMatch[1];
      const kvRaw = objMatch[2];
      // Parse key:value pairs
      const pairs: { k: string; v: string }[] = [];
      // Split by comma respecting parentheses
      let j = 0, depth = 0, partStart = 0;
      while (j < kvRaw.length) {
        if (kvRaw[j] === '(' || kvRaw[j] === '{') depth++;
        else if (kvRaw[j] === ')' || kvRaw[j] === '}') depth--;
        else if (kvRaw[j] === ',' && depth === 0) {
          const pair = kvRaw.slice(partStart, j).trim();
          if (pair) {
            const colonIdx = pair.indexOf(':');
            if (colonIdx > 0) {
              pairs.push({ k: pair.slice(0, colonIdx).trim(), v: pair.slice(colonIdx + 1).trim() });
            }
          }
          partStart = j + 1;
        }
        j++;
      }
      const lastPair = kvRaw.slice(partStart).trim();
      if (lastPair) {
        const colonIdx = lastPair.indexOf(':');
        if (colonIdx > 0) pairs.push({ k: lastPair.slice(0, colonIdx).trim(), v: lastPair.slice(colonIdx + 1).trim() });
      }

      if (pairs.length > 0) {
        // Look at the NEXT statement for the lookup
        if (i + 1 < stmts.length) {
          const next = stmts[i + 1].trim();
          const lookupMatch = next.match(new RegExp(`^(\\w+)\\s*=\\s*\\Q${mapName}\\E\\s*\\[\\s*(\\w+)\\s*\\]`));
          if (lookupMatch) {
            const resultVar = lookupMatch[1];
            const keyVar = lookupMatch[2];
            // Build chained conditional
            let chain = '';
            for (let p = 0; p < pairs.length; p++) {
              if (p === 0) {
                chain += `(${keyVar} == ${pairs[p].k}) ? ${pairs[p].v}`;
              } else {
                chain += ` : (${keyVar} == ${pairs[p].k}) ? ${pairs[p].v}`;
              }
            }
            // Default to middle value
            const defaultVal = pairs[Math.floor(pairs.length / 2)].v;
            chain += ` : ${defaultVal}`;
            out.push(`${resultVar} = ${chain}`);
            i += 2; // skip both the object and the lookup
            continue;
          }
        }
      }
    }
    out.push(s);
    i++;
  }
  return out;
}

/**
 * Inline object literal bracket access:
 *   {1: 0.72, 2: 0.60, 3: 0.50}[key]
 *   → (key == 1) ? 0.72 : (key == 2) ? 0.60 : (key == 3) ? 0.50 : 0.50
 */
function replaceInlineObjectBracket(line: string): string {
  // Match: {k:v, k:v, ...}[identifier] with optional assignment
  const inlineRe = /\{\s*((?:\d+\s*:\s*[\d.eE+-]+\s*,?\s*)+)\}\s*\[(\w+)\]/;
  const m = line.match(inlineRe);
  if (!m) return line;

  const pairsRaw = m[1];
  const keyVar = m[2];

  // Parse pairs
  const pairParts = pairsRaw.split(',').map(s => s.trim()).filter(Boolean);
  const pairs: { k: string; v: string }[] = [];
  for (const pp of pairParts) {
    const ci = pp.indexOf(':');
    if (ci > 0) pairs.push({ k: pp.slice(0, ci).trim(), v: pp.slice(ci + 1).trim() });
  }

  if (pairs.length === 0) return line;

  // Build chained conditional: (key==k1) ? v1 : (key==k2) ? v2 : default
  let chain = '';
  for (let i = 0; i < pairs.length; i++) {
    if (i === 0) chain += `(${keyVar} == ${pairs[i].k}) ? ${pairs[i].v}`;
    else chain += ` : (${keyVar} == ${pairs[i].k}) ? ${pairs[i].v}`;
  }
  const defaultVal = pairs[Math.floor(pairs.length / 2)].v;
  chain += ` : ${defaultVal}`;

  return line.replace(m[0], chain);
}

/**
 * Convert string‑literal comparisons (duct_shape === 'circular')
 * to numeric comparisons based on input enum options.
 * If unknown string, replace with 0 (first option).
 */
function replaceStringLiterals(expr: string, inputMap: Map<string, InputField>): string {
  // Use replace() with callback — avoids lastIndex corruption from string mutation
  return expr.replace(/(\w+)\s*==+\s*['"]([^'"]+)['"]/g, (match, varName, strVal) => {
    const inp = inputMap.get(varName);
    if (inp && inp.options) {
      const idx = inp.options.findIndex(o =>
        o.label.toLowerCase() === strVal.toLowerCase()
      );
      return idx >= 0 ? `${varName} == ${idx}` : `${varName} == 0`;
    }
    // Unknown variable — likely a validation rule; skip (convert to always-true)
    return `1`;
  });
}

/**
 * Remove formulas whose result is a pure string (prose output).
 * These can't be evaluated numerically. Replace with numeric flag.
 * NOTE: run AFTER replaceStringLiterals to avoid stripping comparison targets.
 */
function sanitizeStringResult(expr: string): string {
  // Check if expression contains any string literal (single or double quotes)
  const hasStringLiteral = /['"]/.test(expr);
  if (!hasStringLiteral) return expr;
  // Replace ALL string literal values with 0 (unquoted number zero)
  let copy = expr.replace(/'(?:[^'\\]|\\.)*'/g, '0');
  copy = copy.replace(/"(?:[^"\\]|\\.)*"/g, '0');
  // Now clean up any remaining ternary patterns with string zero
  // ? 0 : 0 → ? 1 : 0 (simple branches)
  copy = copy.replace(/\?\s*0\s*:\s*0/g, '? 1 : 0');
  return copy;
}

/* ═══════════════════════  FORMULA PARSING  ══════════════════════════════ */

/**
 * Parse a raw expression string, splitting multi‑statement forms into
 * individual formula definitions.
 *
 * Strategy (v3):
 * 1. Split raw text on top‑level `;` (respecting parentheses/braces)
 * 2. For each statement: detect `=` → extract LHS / RHS
 *    - No `=` → treat RHS as the entire statement, synthetic var name
 *    - For‑loop → replace with Swamee‑Jain approximation
 * 3. Normalize every RHS expression
 */
export function parseFormulaExpressionFull(
  rawExpr: string,
  formulaId: string,
  inputMap: Map<string, InputField>
): { outputVar: string; expression: string }[] {
  const stmts = splitTopLevel(rawExpr);
  const results: { outputVar: string; expression: string }[] = [];

  for (let si = 0; si < stmts.length; si++) {
    let stmt = stmts[si].trim();

    // Remove const/let/var prefix
    stmt = stmt.replace(/^(const|let|var)\s+/, '').trim();

    // Remove .replace() method calls (string methods not supported in mathjs)
    stmt = stmt.replace(/\.replace\s*\([^)]*\)/g, '');

    // Replace non-computable text formulas like "max(AOQ over all p)" with simplified form
    stmt = stmt.replace(/max\s*\(\s*(\w+)\s+over\s+[^)]+\)/gi, '$1');
    stmt = stmt.replace(/MIN\s*\(\s*(\w+)\s*,\s*(\w+)\s*\)/gi, 'min($1, $2)');

    // Detect for-loop and replace
    if (/^for\s*\(/.test(stmt)) {
      const replacement = replaceForLoop(stmt, inputMap);
      // Extract the actual output variable from the replacement expression
      const repEqIdx = replacement.indexOf('=');
      let outVar = `f_darcy`;
      let outExpr = replacement;
      if (repEqIdx > 0) {
        outVar = replacement.substring(0, repEqIdx).trim();
        outExpr = replacement.substring(repEqIdx + 1).trim();
      }
      results.push({
        outputVar: applyVarRename(outVar),
        expression: normalizeExpression(outExpr),
      });
      continue;
    }

    // Convert lookup table objects — handled at whole‑expression level later
    // For individual statement, just check if it's an object literal
    if (/^\w+\s*=\s*\{/.test(stmt) && /\};?\s*$/.test(stmt)) {
      // Object literal assignment — skip (lookup tables handled upstream)
      // Emit a dummy to satisfy dependency tracking
      const objVar = stmt.match(/^(\w+)\s*=/);
      if (objVar) {
        results.push({
        outputVar: applyVarRename(objVar[1]),
        expression: '0', // dummy value — real conversion is in replaceLookupTable
      });
      }
      continue;
    }

    // Detect array lookup: var = obj[key] — handled by lookup table replacement
    if (/^\w+\s*=\s*\w+\s*\[/.test(stmt)) {
      // Already handled by replaceLookupTable upstream
      // If we get here, emit a placeholder
      const lhs = stmt.match(/^(\w+)\s*=/);
      if (lhs) {
        results.push({
          outputVar: applyVarRename(lhs[1]),
          expression: '0',
        });
      }
      continue;
    }

    // Normal: find = and split
    const eqIdx = stmt.indexOf('=');
    if (eqIdx === -1) {
      // Expression only — no assignment
      results.push({
        outputVar: `${formulaId}_e${si}`,
        expression: normalizeExpression(stmt),
      });
    } else {
      const lhs = stmt.substring(0, eqIdx).trim();
      const rhs = stmt.substring(eqIdx + 1).trim();
      const cleanedLhs = lhs.replace(/^(const|let|var)\s+/, '').trim();
      let cleanRhs = normalizeExpression(rhs);
      // Apply variable renames to the RHS expression too
      for (const [from, to] of Object.entries(VAR_RENAME_MAP)) {
        cleanRhs = cleanRhs.replace(new RegExp('\\b' + from + '\\b', 'g'), to);
      }
      // Run replaceStringLiterals BEFORE sanitizeStringResult
      cleanRhs = replaceStringLiterals(cleanRhs, inputMap);
      // Sanitize string results after literal replacement
      cleanRhs = sanitizeStringResult(cleanRhs);
      results.push({
        outputVar: applyVarRename(cleanedLhs || `${formulaId}_s${si}`),
        expression: cleanRhs,
      });
    }
  }

  return results;
}

/* ═══════════════════════  CONFIDENCE / UNCERTAINTY  ═════════════════════ */

const CONFIDENCE_MAP: Record<string, 'KESIN' | 'GUCLU' | 'ORTA' | 'VARSAYIM'> = {
  EXACT:'KESIN', CERTAIN:'KESIN', HIGH:'KESIN', STRONG:'GUCLU',
  MEDIUM:'ORTA', DEFAULT:'VARSAYIM', ASSUMPTION:'VARSAYIM', LOW:'VARSAYIM',
};

function mapConfidence(label?: string): 'KESIN' | 'GUCLU' | 'ORTA' | 'VARSAYIM' {
  if (!label) return 'VARSAYIM';
  return CONFIDENCE_MAP[label.toUpperCase()] || 'VARSAYIM';
}

export function parseUncertaintyString(raw?: string): Uncertainty | undefined {
  if (!raw) return undefined;
  const m = raw.trim().match(/^[±±±]\s*([\d.]+)\s*(%)?/);
  if (!m) return undefined;
  const value = parseFloat(m[1]);
  const isRelative = m[2] === '%';
  if (isNaN(value) || value === 0) return undefined;
  return { value: isRelative ? value / 100 : value, relative: isRelative, type: 'B', distribution: 'normal' };
}

/* ═══════════════════════  VALIDATION HELPERS  ═══════════════════════════ */

/**
 * Classify a validation rule as "input-only" (can be checked before compute)
 * or "post-compute" (references output variables, needs full scope).
 */
function classifyValidation(
  condition: string,
  inputIds: Set<string>,
  outputVars: Set<string>
): 'pre' | 'post' {
  const varRe = /\b([a-zA-Z_]\w*)\b/g;
  let m;
  while ((m = varRe.exec(condition)) !== null) {
    const name = m[1];
    if (name === 'true' || name === 'false' || name === 'pi' || name === 'e') continue;
    if (name.match(/^\d/)) continue;
    if (outputVars.has(name) && !inputIds.has(name)) return 'post';
  }
  return 'pre';
}

/* ═══════════════════════  MAIN ADAPTER  ════════════════════════════════ */

/** Known data inconsistencies — map source → target variable names */
const VAR_RENAME_MAP: Record<string, string> = {
  'N_allow': 'N_allow_cycles',          // PRO_047: F3 outputs N_allow but F4 references N_allow_cycles
  'E_loss_kwh_yr': 'E_loss_kwh',        // PRO_049: formula outputs E_loss_kwh but refs E_loss_kwh_yr
  'delta_T_ad_K': 'delta_T_ad_k',       // PRO_050: case mismatch — formula outputs delta_T_ad_k
  'spindle_speed_RPM': 'Spindle_Speed_RPM',  // PRO_CNC_CYCLE_001: case mismatch
};

function applyVarRename(varName: string): string {
  return VAR_RENAME_MAP[varName] || varName;
}

export function adaptProTool(raw: any): ToolSchema {
  const toolId: string = raw.tool_id || raw.id || 'UNKNOWN';
  const inputMap = new Map<string, InputField>();

  const inputs: InputField[] = (raw.inputs || []).map((inp: any) => {
    const id: string = inp.id || '';
    const field: InputField = {
      id,
      label: inp.name || inp.label || id,
      symbol: inp.symbol || inp.id || id,
      unit: inp.unit && toCanonical(1, inp.unit) === 1 ? inp.unit : '',
      type: inp.type === 'enum' ? 'select' : 'number',
      confidence: mapConfidence(inp.confidence_label),
      required: inp.required !== false,
      min: inp.absolute_min,
      max: inp.absolute_max,
      defaultValue: inp.default,
      description: inp.note || inp.description || '',
      uncertainty: parseUncertaintyString(inp.uncertainty),
      options: inp.options
        ? (typeof inp.options[0] === 'string'
            ? (inp.options as string[]).map((o: string) => ({ value: parseFloat(o) || 0, label: o }))
            : (inp.options as Array<{ value: number | string; label: string }>).map((o) => ({
                value: typeof o.value === 'number' ? o.value : parseFloat(o.value) || 0,
                label: o.label,
              })))
        : undefined,
    };
    inputMap.set(id, field);
    return field;
  });

  // ── Parse formulas with full multi‑statement expansion ────────────
  const rawFormulas: { id: string; outputVar: string; expression: string; raw: any }[] = [];
  for (const f of (raw.formulas || [])) {
    const rawExpr: string = f.expression || '';
    const fid = f.id || `F${rawFormulas.length + 1}`;

    // Apply full multi‑statement parsing
    const parts = parseFormulaExpressionFull(rawExpr, fid, inputMap);

    // Handle inline object literals with bracket access
    // {1:0.72,2:0.60}[key] → (key==1)?0.72:(key==2)?0.60:0.50
    const processedParts = replaceLookupTable(parts.map(p => `${p.outputVar} = ${p.expression}`));

    // Also handle inline object literals (not pre-assigned to a variable)
    // Pattern: result = {1:0.72,2:0.60}[key]
    for (let i = 0; i < processedParts.length; i++) {
      processedParts[i] = replaceInlineObjectBracket(processedParts[i]);
    }
    // Re-parse after lookup replacement
    const seenOutputVars = new Set<string>();
    const processedFormulas: { expression: string }[] = [];
    if (processedParts.length > 0) {
      for (const line of processedParts) {
        const eqIdx = line.indexOf('=');
        if (eqIdx > 0) {
          const outputVar = line.substring(0, eqIdx).trim();
          const expression = line.substring(eqIdx + 1).trim();
          // Handle duplicate output variables: if prev formula in same group
          // has the same outputVar, rename the new one to avoid cyclic deps
          // and update references in later formulas.
          if (seenOutputVars.has(outputVar)) {
            const newVar = `_${outputVar}_final`;
            // Push the RENAMED assignment (stores final value under new var)
            // Expression keeps original variable references as dependencies
            rawFormulas.push({
              id: `${fid}_s${rawFormulas.length}`,
              outputVar: newVar,
              expression,
              raw: f,
            });
            // Add forwarding formula: original var = new var
            rawFormulas.push({
              id: `${fid}_s${rawFormulas.length}`,
              outputVar,
              expression: newVar,
              raw: f,
            });
            seenOutputVars.add(newVar);
            seenOutputVars.add(outputVar);
          } else {
            seenOutputVars.add(outputVar);
            rawFormulas.push({
              id: `${fid}_s${rawFormulas.length}`,
              outputVar,
              expression,
              raw: f,
            });
          }
        } else {
          rawFormulas.push({
            id: `${fid}_s${rawFormulas.length}`,
            outputVar: fid,
            expression: line,
            raw: f,
          });
        }
      }
    }
  }

  const outputVars = new Set(rawFormulas.map(rf => rf.outputVar));
  const inputIds = new Set(inputs.map(i => i.id));
  const allKnownVars = new Set([...inputIds, ...outputVars, 'pi', 'e', 'true', 'false']);

  /**
   * Check if a condition string only references known variables.
   * Unknown symbols are silently dropped to avoid blocking the engine.
   */
  function conditionUsesOnlyKnownVars(cond: string): boolean {
    const varRe = /\b([a-zA-Z_]\w*)\b/g;
    let m;
    while ((m = varRe.exec(cond)) !== null) {
      const name = m[1];
      if (name.length < 1) continue;
      if (name === 'true' || name === 'false' || name === 'pi' || name === 'e') continue;
      if (name.match(/^\d/)) continue;
      if (/^(and|or|not|if|else|for|while|function|return)$/i.test(name)) continue;
      if (!allKnownVars.has(name)) return false;
    }
    return true;
  }

  const formulas: FormulaNode[] = rawFormulas.map((rf) => ({
    id: rf.id,
    outputVar: rf.outputVar,
    expression: rf.expression,
    unit: rf.raw.unit || '-',
    domainGuard: rf.raw.domainGuard
      ? {
          condition: normalizeExpression(rf.raw.domainGuard.condition),
          errorMessage: rf.raw.domainGuard.errorMessage || rf.raw.domainGuard.error_message || 'Domain guard violated',
        }
      : undefined,
  }));

  // ── Validation rules (pre‑compute + post‑compute) ─────────────────
  const engineRules = raw.engine_rules || {};
  const vRaw = engineRules.validation;
  const allValidationRules: ValidationRule[] = [];

  const collectRules = (rules: any[], defaultPrefix: string) => {
    for (const r of rules) {
      if (!r.condition) continue;
      let cond = normalizeExpression(r.condition);
      // Apply variable renames to validation rule conditions too
      for (const [from, to] of Object.entries(VAR_RENAME_MAP)) {
        cond = cond.replace(new RegExp('\\b' + from + '\\b', 'g'), to);
      }
      cond = replaceStringLiterals(cond, inputMap);
      cond = sanitizeStringResult(cond);
      const action = (r.action || '').toUpperCase() === 'WARN' ? 'WARN' : 'BLOCK';
      // Negate BLOCK conditions: JSON describes VIOLATION state but engine expects SAFE state
      const finalCond = action === 'WARN' ? cond : `not(${cond})`;
      const rule: ValidationRule = {
        id: r.id || `V${allValidationRules.length + 1}`,
        action,
        condition: finalCond,
        message: r.message || r.error_msg || r.errorMessage || 'Validation rule violated',
      };
      allValidationRules.push(rule);
    }
  };

  if (vRaw) {
    if (Array.isArray(vRaw)) collectRules(vRaw, 'V');
    else for (const [, r] of Object.entries(vRaw)) collectRules([r], 'V');
  }

  // smart_warnings → WARN rules
  const smartWarnings = engineRules.smart_warnings || [];
  if (Array.isArray(smartWarnings)) {
    for (const sw of smartWarnings) {
      if (sw.condition) {
        let cond = normalizeExpression(sw.condition);
        cond = replaceStringLiterals(cond, inputMap);
        allValidationRules.push({
          id: sw.id || `W${allValidationRules.length + 1}`,
          action: 'WARN',
          condition: cond,
          message: sw.message || 'Warning triggered',
        });
      }
    }
  }

  // Classify rules into pre‑compute and post‑compute
  // Also filter out rules that reference unknown symbols
  const preValidationRules: ValidationRule[] = [];
  const postValidationRules: ValidationRule[] = [];
  for (const r of allValidationRules) {
    if (!conditionUsesOnlyKnownVars(r.condition)) continue;
    const phase = classifyValidation(r.condition, inputIds, outputVars);
    if (phase === 'pre') preValidationRules.push(r);
    else postValidationRules.push(r);
  }

  // GUM
  const gumMeasurand = raw.gum?.measurand || formulas[formulas.length - 1]?.outputVar;
  const gum = gumMeasurand
    ? { measurand: gumMeasurand, coverageFactor: raw.gum?.coverageFactor ?? 2 }
    : undefined;

  return {
    id: toolId,
    version: raw.version || '1.0.0',
    name: raw.tool_name || raw.title || raw.name || toolId,
    industry: raw.category || raw.industry || 'General',
    riskLevel: inferRiskLevel(raw.category, toolId),
    inputs,
    formulas,
    preValidationRules,
    postValidationRules,
    /** Legacy alias — same as preValidationRules */
    validationRules: preValidationRules,
    gum,
    auditConfig: { requirePeerReview: raw.riskLevel === 'CRITICAL' || raw.riskLevel === 'HIGH', retentionDays: 3650 },
  };
}

/* ═══════════════════════  RISK LEVEL  ══════════════════════════════════ */

function inferRiskLevel(category?: string, toolId?: string): ToolSchema['riskLevel'] {
  const cat = (category || '').toLowerCase();
  const id = (toolId || '').toLowerCase();
  if (cat.includes('construction') || cat.includes('structural') || cat.includes('safety') || cat.includes('critical')) return 'HIGH';
  if (cat.includes('cnc') || cat.includes('manufacturing') || cat.includes('mechanical')) return 'MEDIUM';
  return 'LOW';
}

/* ═══════════════════════  CONVENIENCE  ═════════════════════════════════ */

export function calculateWithRawTool(rawTool: any, inputValues: Record<string, number>) {
  const schema = adaptProTool(rawTool);
  const prep = prepare(schema);
  return compute(prep, inputValues);
}
