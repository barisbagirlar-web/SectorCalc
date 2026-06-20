import jsep from "jsep";

export type AstValidationIssue = {
  readonly severity: "ERROR" | "WARN";
  readonly category:
    | "PARSE_FAILURE"
    | "UNBALANCED_PARENS"
    | "UNKNOWN_IDENTIFIER"
    | "INVALID_SEQUENCE"
    | "DIVISION_BY_ZERO_RISK"
    | "TYPE_MISMATCH"
    | "MALFORMED_CONDITIONAL"
    | "DOUBLE_MATH_PREFIX"
    | "STUB_SUM";
  readonly message: string;
  readonly token?: string;
  readonly position?: number;
};

export type AstValidationResult = {
  readonly valid: boolean;
  readonly issues: readonly AstValidationIssue[];
  readonly errorCount: number;
  readonly warnCount: number;
};

const MATH_FUNCTIONS = new Set([
  "Math.abs",
  "Math.acos",
  "Math.acosh",
  "Math.asin",
  "Math.asinh",
  "Math.atan",
  "Math.atan2",
  "Math.atanh",
  "Math.cbrt",
  "Math.ceil",
  "Math.clz32",
  "Math.cos",
  "Math.cosh",
  "Math.exp",
  "Math.expm1",
  "Math.floor",
  "Math.fround",
  "Math.hypot",
  "Math.imul",
  "Math.log",
  "Math.log10",
  "Math.log1p",
  "Math.log2",
  "Math.max",
  "Math.min",
  "Math.pow",
  "Math.random",
  "Math.round",
  "Math.sign",
  "Math.sin",
  "Math.sinh",
  "Math.sqrt",
  "Math.tan",
  "Math.tanh",
  "Math.trunc",
]);

const ALLOWED_IDENTIFIERS = new Set([
  "input",
  "results",
  "Number",
  "true",
  "false",
  "null",
  "undefined",
  "NaN",
  "Infinity",
  "toNumericFormulaValue",
  "erf",
  "parseFloat",
  "parseInt",
  "isFinite",
  "sample_mean",
  "effective_mean",
  "effective_stddev",
  "z_critical",
  "sigma",
  "delta",
  "eta",
]);

/**
 * Check if a string is an allowed identifier or an input access pattern.
 */
function isAllowedBareIdentifier(name: string): boolean {
  if (ALLOWED_IDENTIFIERS.has(name)) return true;
  if (name.startsWith("input.")) return true;
  if (/^input\[/.test(name)) return true;
  return false;
}

/**
 * Pre-validate a formula expression by attempting to parse it as JavaScript AST.
 * Provides categorized error messages instead of silent failure.
 */
export function validateFormulaAst(
  expression: string,
  inputIds: readonly string[],
  formulaKeys: readonly string[],
): AstValidationResult {
  const issues: AstValidationIssue[] = [];
  const trimmed = expression.trim();

  if (!trimmed) {
    return {
      valid: false,
      issues: [
        {
          severity: "ERROR",
          category: "PARSE_FAILURE",
          message: "Empty expression",
        },
      ],
      errorCount: 1,
      warnCount: 0,
    };
  }

  // Check for Math.Math double prefix (common LLM artifact)
  if (trimmed.includes("Math.Math")) {
    issues.push({
      severity: "ERROR",
      category: "DOUBLE_MATH_PREFIX",
      message: `Double Math.Math prefix detected: "${truncateForMessage(trimmed, 80)}"`,
    });
  }

  // Check for unbalanced parentheses
  let parenDepth = 0;
  for (let i = 0; i < trimmed.length; i++) {
    const ch = trimmed[i];
    if (ch === "(") parenDepth++;
    if (ch === ")") parenDepth--;
    if (parenDepth < 0) {
      issues.push({
        severity: "ERROR",
        category: "UNBALANCED_PARENS",
        message: `Unbalanced closing parenthesis at position ${i}`,
        position: i,
      });
      break;
    }
  }
  if (parenDepth > 0) {
    issues.push({
      severity: "ERROR",
      category: "UNBALANCED_PARENS",
      message: `Unbalanced opening parenthesis (${parenDepth} unclosed)`,
    });
  }

  // Attempt to parse with jsep
  try {
    jsep(trimmed);
  } catch (parseErr: unknown) {
    const parseMessage =
      parseErr instanceof Error ? parseErr.message : String(parseErr);
    issues.push({
      severity: "ERROR",
      category: "PARSE_FAILURE",
      message: `AST parse error: ${parseMessage}`,
      token: extractTokenFromParseError(parseMessage),
    });
  }

  // Check for bare identifiers that are not inputs, formulas, or built-ins
  const bareIdentPattern = /\b([A-Za-z_]\w*)\b/g;
  let bareMatch: RegExpExecArray | null;
  while ((bareMatch = bareIdentPattern.exec(trimmed)) !== null) {
    const name = bareMatch[1];
    if (name === undefined) continue;

    // Skip numbers
    if (/^\d+$/.test(name)) continue;

    // Skip allowed built-ins
    if (isAllowedBareIdentifier(name)) continue;

    // Skip input ids
    if (inputIds.includes(name)) continue;

    // Skip formula keys
    if (formulaKeys.includes(name)) continue;

    // Skip property access chains (input.x, results[y])
    const before = trimmed.slice(Math.max(0, bareMatch.index - 6), bareMatch.index);
    if (/input\.|results\[|Math\.|Number\./.test(before)) continue;

    issues.push({
      severity: "WARN",
      category: "UNKNOWN_IDENTIFIER",
      message: `Unresolved identifier "${name}" at position ${bareMatch.index}`,
      token: name,
      position: bareMatch.index,
    });
  }

  // Check for unresolved function calls (not Math.*)
  const funcCallPattern = /\b([A-Za-z_]\w*)\s*\(/g;
  let funcMatch: RegExpExecArray | null;
  while ((funcMatch = funcCallPattern.exec(trimmed)) !== null) {
    const name = funcMatch[1];
    if (name === undefined) continue;
    if (name === "Math") continue;
    if (name === "erf") continue;
    if (name === "toNumericFormulaValue") continue;

    // Check if this call is already properly prefixed with Math.
    const charBefore = trimmed[Math.max(0, funcMatch.index - 5)];
    const alreadyMathPrefixed = trimmed.slice(Math.max(0, funcMatch.index - 5), funcMatch.index).endsWith('Math.');
    if (alreadyMathPrefixed) continue;

    // If it's Math.Name, skip (full prefixed)
    if (MATH_FUNCTIONS.has(name) && charBefore === '.') continue;

    // Check if this is a known math function used bare (without Math. prefix)
    const mathStandaloneLower = new Set([
      "abs", "acos", "acosh", "asin", "asinh", "atan", "atan2",
      "atanh", "cbrt", "ceil", "cos", "cosh", "exp", "floor",
      "log", "max", "min", "pow", "round", "sin", "sinh", "sqrt",
      "tan", "tanh", "trunc",
    ]);
    if (mathStandaloneLower.has(name.toLowerCase())) {
      issues.push({
        severity: "ERROR",
        category: "MALFORMED_CONDITIONAL",
        message: `Bare math function "${name}()" should be "Math.${name}()" at position ${funcMatch.index}`,
        token: name,
        position: funcMatch.index,
      });
      continue;
    }

    // Check if it's actually an identifier followed by paren (e.g. conditional)
    if (!formulaKeys.includes(name) && !inputIds.includes(name)) {
      issues.push({
        severity: "WARN",
        category: "TYPE_MISMATCH",
        message: `Unresolved function call "${name}()" at position ${funcMatch.index}`,
        token: name,
        position: funcMatch.index,
      });
    }
  }

  // Check for risk of division by zero
  const divByZeroPattern = /\/(\s*0\s*[^.\d]|\(\s*0\s*\))/g;
  if (divByZeroPattern.test(trimmed)) {
    issues.push({
      severity: "WARN",
      category: "DIVISION_BY_ZERO_RISK",
      message: "Literal division by zero detected in expression",
    });
  }

  const errorCount = issues.filter((i) => i.severity === "ERROR").length;
  const warnCount = issues.filter((i) => i.severity === "WARN").length;

  return {
    valid: errorCount === 0,
    issues,
    errorCount,
    warnCount,
  };
}

/**
 * Categorize a compilation failure into a structured reason.
 */
export function categorizeCompileFailure(
  expression: string,
  astResult?: AstValidationResult,
): string {
  if (astResult && astResult.issues.length > 0) {
    const errorIssues = astResult.issues.filter((i) => i.severity === "ERROR");
    if (errorIssues.length > 0) {
      const primary = errorIssues[0];
      return `${primary.category}: ${primary.message}`;
    }
    const primary = astResult.issues[0];
    return `${primary.category}: ${primary.message}`;
  }

  // Heuristic categorization without AST
  if (/Math\.Math/.test(expression)) return "DOUBLE_MATH_PREFIX: Math.Math artifact";
  if (/^\s*$/.test(expression)) return "PARSE_FAILURE: Empty expression";
  if (/\bsolve\b/i.test(expression)) return "UNSUPPORTED: solve() not supported";
  if (/\bΦ\s*\(/i.test(expression)) return "UNSUPPORTED: Φ() not supported";
  if (/\bIRR\b/i.test(expression)) return "UNSUPPORTED: IRR not supported";
  if (/(?<![.(])\b[a-zA-Z]\s*\([^)]*\)/.test(expression) && !/\bMath\./.test(expression))
    return "MALFORMED_FUNCTION: Possible bare function call";

  return "PARSE_FAILURE: Unknown compilation error";
}

function truncateForMessage(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen - 3) + "...";
}

function extractTokenFromParseError(message: string): string | undefined {
  const tokenMatch = message.match(/'(.*?)'/);
  return tokenMatch?.[1] ?? undefined;
}

export const FORMULA_FAILURE_CATEGORIES = [
  "DOUBLE_MATH_PREFIX",
  "UNBALANCED_PARENS",
  "PARSE_FAILURE",
  "MALFORMED_FUNCTION",
  "UNSUPPORTED",
  "UNKNOWN_IDENTIFIER",
  "STUB_SUM",
  "MALFORMED_CONDITIONAL",
  "TYPE_MISMATCH",
  "DIVISION_BY_ZERO_RISK",
] as const;

export type FormulaFailureCategory = (typeof FORMULA_FAILURE_CATEGORIES)[number];
