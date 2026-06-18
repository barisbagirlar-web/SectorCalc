import { compileFormulaScriptFallback } from "@/lib/generated-tools/compile-formula-script";
import { isSafeCompiledFormulaExpression } from "@/lib/generated-tools/compile-formula-safety";
import { FormulaFailureAccumulator } from "@/lib/generated-tools/formula-failure-catalog";
import {
  categorizeCompileFailure,
  validateFormulaAst,
} from "@/lib/generated-tools/ast-formula-validator";

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function replaceInputIdentifier(
  expression: string,
  inputId: string,
  access: string,
): string {
  const pattern = new RegExp(
    `(?<!inputs\\.)(?<!input\\.)\\b${escapeRegExp(inputId)}\\b`,
    "g",
  );
  return expression.replace(pattern, access);
}

function substituteInputsObjectAccess(
  expression: string,
  options: {
    readonly inputIds: readonly string[];
    readonly inputToAccess: (inputId: string) => string;
  },
): string {
  let result = expression;
  for (const inputId of options.inputIds) {
    result = result.replace(
      new RegExp(`\\binputs\\.${escapeRegExp(inputId)}\\b`, "g"),
      options.inputToAccess(inputId),
    );
    result = result.replace(
      new RegExp(`inputs\\[['"]${escapeRegExp(inputId)}['"]\\]`, "g"),
      options.inputToAccess(inputId),
    );
  }
  return result.replace(/\binputs\b/g, "input");
}

export function replaceIdentifierExpression(
  expression: string,
  identifier: string,
  replacement: string,
): string {
  const pattern = new RegExp(`\\b${escapeRegExp(identifier)}\\b`, "g");
  return expression.replace(pattern, replacement);
}

function replaceBareMathCall(expression: string, name: string, replacement: string): string {
  const pattern = new RegExp(`(?<!Math\\.)\\b${escapeRegExp(name)}\\s*\\(`, "gi");
  return expression.replace(pattern, replacement);
}

function transformMathFunctions(expression: string): string {
  let result = expression;
  // CEILING before CEIL — both map to Math.ceil; lookbehind avoids Math.Math.ceil.
  result = replaceBareMathCall(result, "CEILING", "Math.ceil(");
  result = replaceBareMathCall(result, "CEIL", "Math.ceil(");
  result = replaceBareMathCall(result, "FLOOR", "Math.floor(");
  result = replaceBareMathCall(result, "EXP", "Math.exp(");
  result = replaceBareMathCall(result, "LN", "Math.log(");
  result = replaceBareMathCall(result, "LOG10", "Math.log10(");
  result = replaceBareMathCall(result, "LOG", "Math.log(");
  result = replaceBareMathCall(result, "MAX", "Math.max(");
  result = replaceBareMathCall(result, "MIN", "Math.min(");
  result = replaceBareMathCall(result, "ABS", "Math.abs(");
  result = replaceBareMathCall(result, "SQRT", "Math.sqrt(");
  result = replaceBareMathCall(result, "POW", "Math.pow(");
  result = result.replace(
    /(?<!Math\.)ROUND\s*\(\s*([^,]+?)\s*,\s*(\d+)\s*\)/gi,
    "(Math.round(($1) * 10**($2)) / 10**($2))",
  );
  result = result.replace(/(?<!Math\.)ROUND\s*\(\s*([^)]+?)\s*\)/gi, "Math.round($1)");
  return result;
}

function splitTopLevelArgs(rawArgs: string): readonly string[] {
  const args: string[] = [];
  let current = "";
  let depth = 0;
  for (let i = 0; i < rawArgs.length; i += 1) {
    const ch = rawArgs[i];
    if (ch === "(") depth += 1;
    if (ch === ")") depth = Math.max(0, depth - 1);
    if (ch === "," && depth === 0) {
      args.push(current.trim());
      current = "";
      continue;
    }
    current += ch;
  }
  if (current.trim().length > 0) {
    args.push(current.trim());
  }
  return args;
}

function transformIfFunction(expression: string): string {
  // Excel/Sheets-style IF(cond, then, else) → (cond ? then : else)
  // This is conservative: only rewrites well-formed top-level IF calls.
  return expression.replace(/\bIF\s*\(([^()]|\([^)]*\))*\)/gi, (match) => {
    const inner = match.replace(/^\s*IF\s*\(/i, "").replace(/\)\s*$/, "");
    const parts = splitTopLevelArgs(inner);
    if (parts.length !== 3) {
      return match;
    }
    const [cond, thenVal, elseVal] = parts;
    return `((${cond}) ? (${thenVal}) : (${elseVal}))`;
  });
}

function stripBracketCitations(expression: string): string {
  // e.g. "... [ISO 2859-1 Table]" or "... [CBAM Exposition]"
  // Keep bracketed math out by requiring at least one ASCII letter inside.
  return expression.replace(/\[[^\]]*[A-Za-z][^\]]*\]/g, "").trim();
}

function stripNullChecks(expression: string): string {
  return expression
    .replace(/\bIS\s+NOT\s+NULL\b/gi, "!= null")
    .replace(/\bIS\s+NULL\b/gi, "== null");
}

function findKeywordAtTopLevel(expression: string, keyword: string): number | null {
  const needle = keyword.toUpperCase();
  let depth = 0;
  let inSingleQuote = false;

  for (let i = 0; i < expression.length; i += 1) {
    const ch = expression[i]!;
    if (ch === "'" && expression[i - 1] !== "\\") {
      inSingleQuote = !inSingleQuote;
      continue;
    }
    if (inSingleQuote) continue;

    if (ch === "(") depth += 1;
    if (ch === ")") depth = Math.max(0, depth - 1);
    if (depth !== 0) continue;

    const slice = expression.slice(i, i + keyword.length);
    if (slice.toUpperCase() !== needle) continue;
    const prev = i === 0 ? "" : expression[i - 1]!;
    const next = i + keyword.length >= expression.length ? "" : expression[i + keyword.length]!;
    if (/[A-Za-z0-9_]/.test(prev) || /[A-Za-z0-9_]/.test(next)) continue;
    return i;
  }

  return null;
}

function transformIfThenElseKeywordExpression(expression: string): string {
  const trimmed = expression.trim();
  if (!/^IF\s+/i.test(trimmed)) {
    return expression;
  }

  // Parse only top-level IF/THEN/ELSE chains.
  const afterIf = trimmed.replace(/^IF\s+/i, "").trim();

  const thenIdx = findKeywordAtTopLevel(afterIf, "THEN");
  if (thenIdx === null) return expression;

  const cond = afterIf.slice(0, thenIdx).trim();
  const afterThen = afterIf.slice(thenIdx + "THEN".length).trim();

  const elseIdx = findKeywordAtTopLevel(afterThen, "ELSE");
  if (elseIdx === null) return expression;

  const thenVal = afterThen.slice(0, elseIdx).trim();
  const elseValRaw = afterThen.slice(elseIdx + "ELSE".length).trim();
  const elseVal =
    /^IF\s+/i.test(elseValRaw) ? transformIfThenElseKeywordExpression(elseValRaw) : elseValRaw;

  return `((${cond}) ? (${thenVal}) : (${elseVal}))`;
}

function transformIfColonAssignments(
  expression: string,
  targetVar: string | undefined,
): string {
  if (!targetVar) return expression;

  // Pseudo-code form:
  // If cond: target = rhs1, other = ... . If cond2: target = rhs2, ...
  // Convert into nested ternary selecting only targetVar assignment.
  const clauseStarts: Array<{ start: number; end: number; cond: string }> = [];

  // eslint-disable-next-line no-regex-spaces
  const clauseRe = /\bIf\s+([^:]+?)\s*:\s*/gi;
  let m: RegExpExecArray | null = null;
  while ((m = clauseRe.exec(expression)) !== null) {
    const cond = (m[1] ?? "").trim();
    clauseStarts.push({ start: m.index, end: clauseRe.lastIndex, cond });
  }

  if (clauseStarts.length === 0) return expression;

  const rhsForTarget = (body: string): string => {
    const targetRe = new RegExp(`\\b${escapeRegExp(targetVar)}\\b\\s*=\\s*`, "i");
    const mm = targetRe.exec(body);
    if (!mm || mm.index === undefined) return "0";
    const rhsStart = mm.index + mm[0]!.length;
    const commaIdx = body.indexOf(",", rhsStart);
    const dotIdx = body.indexOf(".", rhsStart);
    const ends = [commaIdx, dotIdx].filter((x) => x !== -1);
    const rhsEnd = ends.length > 0 ? Math.min(...ends) : body.length;
    return body
      .slice(rhsStart, rhsEnd)
      .trim()
      .replace(/[.]+$/, "")
      .trim() || "0";
  };

  const clauses = clauseStarts.map((c, i) => {
    const bodyStart = c.end;
    const bodyEnd = i + 1 < clauseStarts.length ? clauseStarts[i + 1]!.start : expression.length;
    const body = expression.slice(bodyStart, bodyEnd).trim().replace(/^\./, "").trim();
    return { cond: c.cond, body };
  });

  let chain = "0";
  for (let i = clauses.length - 1; i >= 0; i -= 1) {
    const { cond, body } = clauses[i]!;
    const rhs = rhsForTarget(body);
    chain = `((${cond}) ? (${rhs}) : (${chain}))`;
  }

  return chain;
}

function stripAssignmentPrefix(expression: string): string {
  return expression.replace(/^[\p{L}][\p{L}\p{N}_]*\s*=(?![=<>])\s*/u, "").trim();
}

function stripFormulaProse(expression: string): string {
  return expression
    .replace(/\s+for\s+(two-tailed|upper-tailed|lower-tailed).+$/i, "")
    .replace(/\s+such\s+that\s+.+$/i, "")
    .trim();
}

function extractSemicolonEquation(expression: string, selfKey?: string): string {
  if (!expression.includes(";")) {
    return expression;
  }
  const parts = expression.split(";").map((part) => part.trim()).filter(Boolean);
  if (selfKey) {
    for (const part of parts) {
      const match = part.match(/^([\p{L}][\p{L}\p{N}_]*)\s*=(?![=<>])/u);
      if (match?.[1] === selfKey) {
        return part;
      }
    }
  }
  return parts[parts.length - 1] ?? expression;
}

/** SUM_{t=1}^{n} (cash / (1 + rate)^t) for uniform cash flows (geometric series). */
function transformUniformSumDiscount(expression: string): string {
  return expression.replace(
    /SUM_\{t=1\}\^\{([^}]+)\}\s*\(\s*([^/]+?)\s*\/\s*\(1\s*\+\s*([^)]+?)\)\^t\s*\)/gi,
    (_match, periodVar, cashVar, rateExpr) => {
      const rate = `(${rateExpr.trim()})`;
      const periods = `(${periodVar.trim()})`;
      const cash = cashVar.trim();
      return `((${rate}) === 0 ? (${cash}) * ${periods} : (${cash}) * (Math.pow(1 + ${rate}, ${periods}) - 1) / ((${rate}) * Math.pow(1 + ${rate}, ${periods})))`;
    },
  );
}

function normalizeGreekFormulaAliases(expression: string): string {
  const aliases: Readonly<Record<string, string>> = {
    "x̄": "sample_mean",
    xbar: "sample_mean",
    "μ_eff": "effective_mean",
    mu_eff: "effective_mean",
    "σ_eff": "effective_stddev",
    sigma_eff: "effective_stddev",
    Z_crit: "z_critical",
  };
  let result = expression;
  for (const [from, to] of Object.entries(aliases)) {
    result = replaceIdentifierExpression(result, from, to);
  }
  return result;
}

function transformPowerNotation(expression: string): string {
  return expression
    .replace(/([A-Za-z0-9_\])]+)\*\*t\b/g, "$1**1")
    .replace(/([A-Za-z0-9_\])]+)\^(\d+)/g, "$1**$2");
}

function transformCaseWhenExpression(expression: string): string {
  const trimmed = expression.trim();
  if (!/^CASE\s+/i.test(trimmed) || !/\sEND\s*$/i.test(trimmed)) {
    return expression;
  }

  let inner = trimmed.replace(/^CASE\s+/i, "").replace(/\sEND\s*$/i, "");
  const firstWhen = inner.search(/\sWHEN\s/i);
  if (firstWhen === -1) {
    return expression;
  }

  const subject = inner.slice(0, firstWhen).trim();
  inner = inner.slice(firstWhen).trim();

  const clauses: Array<{ when: string; then: string }> = [];
  while (/^WHEN\s/i.test(inner)) {
    inner = inner.replace(/^WHEN\s+/i, "");
    const thenIdx = inner.search(/\s+THEN\s+/i);
    if (thenIdx === -1) {
      break;
    }
    const whenVal = inner.slice(0, thenIdx).trim();
    inner = inner.slice(thenIdx).replace(/^\s+THEN\s+/i, "");
    const nextWhen = inner.search(/\s+WHEN\s+/i);
    const nextElse = inner.search(/\s+ELSE\s+/i);
    const stopIdx = (() => {
      if (nextWhen === -1 && nextElse === -1) return -1;
      if (nextWhen === -1) return nextElse;
      if (nextElse === -1) return nextWhen;
      return Math.min(nextWhen, nextElse);
    })();
    const thenVal = stopIdx === -1 ? inner.trim() : inner.slice(0, stopIdx).trim();
    inner = stopIdx === -1 ? "" : inner.slice(stopIdx).trim();
    clauses.push({ when: whenVal, then: thenVal });
  }

  if (clauses.length === 0) {
    return expression;
  }

  const elseMatch = inner.match(/^ELSE\s+/i);
  const elseVal = elseMatch ? inner.replace(/^ELSE\s+/i, "").trim() : "0";

  let chain = elseVal;
  for (let index = clauses.length - 1; index >= 0; index -= 1) {
    const clause = clauses[index];
    if (subject.length === 0) {
      chain = `((${clause.when}) ? (${clause.then}) : (${chain}))`;
    } else {
      chain = `(${subject} === ${clause.when} ? ${clause.then} : ${chain})`;
    }
  }
  return chain;
}

function transformEmbeddedCaseWhenBlocks(expression: string): string {
  // Replace CASE / case blocks even when embedded (e.g. "... * case when ... end").
  const startRe = /\bcase\b/gi;
  let match: RegExpExecArray | null = null;
  let result = expression;

  // eslint-disable-next-line no-cond-assign
  while ((match = startRe.exec(expression)) !== null) {
    const startIdx = match.index;

    // Find matching END at top level (paren depth + string literals).
    let depth = 0;
    let inSingleQuote = false;
    let endIdx: number | null = null;

    for (let i = startIdx; i < expression.length; i += 1) {
      const ch = expression[i]!;
      if (ch === "'" && expression[i - 1] !== "\\") {
        inSingleQuote = !inSingleQuote;
        continue;
      }
      if (inSingleQuote) continue;
      if (ch === "(") depth += 1;
      if (ch === ")") depth = Math.max(0, depth - 1);
      if (depth !== 0) continue;

      if (
        expression.slice(i, i + 3).toUpperCase() === "END" &&
        (i === 0 || !/[A-Za-z0-9_]/.test(expression[i - 1]!)) &&
        (i + 3 >= expression.length || !/[A-Za-z0-9_]/.test(expression[i + 3]!))
      ) {
        endIdx = i + 3;
        break;
      }
    }

    if (endIdx === null) break;

    const block = expression.slice(startIdx, endIdx).trim();
    const transformed = transformCaseWhenExpression(block);
    result = result.replace(block, transformed);

    // Move regex cursor to after this replaced block.
    startRe.lastIndex = endIdx;
  }

  return result;
}

function stripNonAsciiOperators(expression: string): string {
  return expression
    .replace(/π/g, "Math.PI")
    .replace(/σ/g, "sigma")
    .replace(/δ/g, "delta")
    .replace(/η/g, "eta")
    .replace(/→/g, "->")
    .replace(/±/g, "+");
}

export function isValidJavaScriptExpression(expression: string): boolean {
  const trimmed = expression.trim();
  if (!trimmed) {
    return false;
  }
  try {
    // eslint-disable-next-line no-new-func
    new Function(`return (${trimmed});`);
    return true;
  } catch {
    return isValidFormulaEvaluationExpression(trimmed);
  }
}

export function isValidFormulaEvaluationExpression(expression: string): boolean {
  const trimmed = expression.trim();
  if (!trimmed) {
    return false;
  }
  const erfShim =
    "const erf=(x)=>{const a1=0.254829592,a2=-0.284496736,a3=1.421413741,a4=-1.453152027,a5=1.061405429,p=0.3275911;const sign=x<0?-1:1;x=Math.abs(x);const t=1/(1+p*x);const y=1-(((((a5*t+a4)*t+a3)*t+a2)*t+a1)*t)*Math.exp(-x*x);return sign*y;};";
  try {
    // eslint-disable-next-line no-new-func
    new Function("input", "results", `${erfShim} return (${trimmed});`);
    return true;
  } catch {
    return false;
  }
}

function transformBooleanMultiplyOne(expression: string): string {
  const trimmed = expression.trim();
  const multiplyOneMatch = trimmed.match(/^([\s\S]+?)\s*\*\s*1\s*$/);
  if (!multiplyOneMatch) {
    return expression;
  }
  const inner = multiplyOneMatch[1]!.trim();
  if (/===|!==|&&|\|\||\?\s*[^:]+:/.test(inner)) {
    return `(${inner} ? 1 : 0)`;
  }
  return expression;
}

export { isSafeCompiledFormulaExpression } from "@/lib/generated-tools/compile-formula-safety";

export function compileFormulaExpression(
  rawExpression: string,
  options: {
    readonly inputIds: readonly string[];
    readonly inputToAccess: (inputId: string) => string;
    readonly formulaKeys: readonly string[];
    readonly selfKey?: string;
    readonly failureAccumulator?: FormulaFailureAccumulator;
    readonly schemaSlugForLog?: string;
  },
): string | null {
  let expression = rawExpression.trim();
  expression = extractSemicolonEquation(expression, options.selfKey);
  expression = stripAssignmentPrefix(expression);
  expression = stripFormulaProse(expression);
  expression = stripBracketCitations(expression);
  expression = stripNullChecks(expression);
  expression = stripNonAsciiOperators(expression);
  expression = normalizeGreekFormulaAliases(expression);
  expression = transformUniformSumDiscount(expression);
  if (!expression) {
    logCompileFailure("PARSE_FAILURE", rawExpression, "Expression empty after stripping", options);
    return null;
  }

  if (
    /\bsolve\s+(for\b|smallest)/i.test(expression) ||
    /\bsolve\s*\(/i.test(expression) ||
    /\([^)]*straight_line[^)]*\)/i.test(expression) ||
    /\bΦ\s*\(/i.test(expression) ||
    /\bIRR\s*=\s*r\s+such\b/i.test(expression)
  ) {
    logCompileFailure("UNSUPPORTED", rawExpression, "Unsupported formula construct", options);
    return null;
  }

  expression = transformEmbeddedCaseWhenBlocks(expression);
  expression = transformCaseWhenExpression(expression);
  expression = transformIfThenElseKeywordExpression(expression);
  expression = transformIfColonAssignments(expression, options.selfKey);
  expression = transformIfFunction(expression);
  expression = expression.replace(
    /\bif\s*\(\s*([^,()]+(?:\([^)]*\)[^,()]*)*)\s*,\s*([^,]+)\s*,\s*([^)]+)\s*\)/gi,
    "(($1) ? ($2) : ($3))",
  );
  expression = transformMathFunctions(expression);
  expression = transformPowerNotation(expression);
  // Avoid producing Math.Math.PI when schema already used Math.PI.
  expression = expression.replace(/(?<!Math\.)\bPI\b/g, "Math.PI");
  expression = substituteInputsObjectAccess(expression, options);

  for (const inputId of options.inputIds) {
    expression = replaceInputIdentifier(
      expression,
      inputId,
      options.inputToAccess(inputId),
    );
  }

  for (const formulaKey of options.formulaKeys) {
    if (formulaKey === options.selfKey || options.inputIds.includes(formulaKey)) {
      continue;
    }
    expression = replaceIdentifierExpression(
      expression,
      formulaKey,
      `(asFormulaNumber(results[${JSON.stringify(formulaKey)}]))`,
    );
  }

  expression = transformBooleanMultiplyOne(expression);

  // AST validation on the compiled expression
  const astResult = validateFormulaAst(expression, options.inputIds, options.formulaKeys);
  if (!astResult.valid) {
    const firstError = astResult.issues.find((i) => i.severity === "ERROR");
    if (firstError) {
      logCompileFailure(
        firstError.category as Parameters<typeof logCompileFailure>[0],
        rawExpression,
        `${firstError.category}: ${firstError.message}`,
        options,
      );
      return null;
    }
  }

  if (isSafeCompiledFormulaExpression(expression)) {
    return expression;
  }

  // Primary compilation failed; try script fallback
  const fallbackResult = compileFormulaScriptFallback(rawExpression, {
    ...options,
    failureAccumulator: options.failureAccumulator,
  });

  if (!fallbackResult) {
    logCompileFailure(
      "PARSE_FAILURE",
      rawExpression,
      "Both primary and fallback compilation failed",
      options,
    );
  }

  return fallbackResult;
}

/**
 * Internal helper to log compilation failures to the accumulator when available.
 */
function logCompileFailure(
  category: string,
  rawExpression: string,
  detail: string,
  options: {
    readonly failureAccumulator?: FormulaFailureAccumulator;
    readonly schemaSlugForLog?: string;
    readonly selfKey?: string;
  },
): void {
  if (options.failureAccumulator) {
    options.failureAccumulator.add(
      options.schemaSlugForLog ?? "unknown",
      options.selfKey ?? "unknown",
      category as never,
      rawExpression,
      detail,
    );
  }
}
