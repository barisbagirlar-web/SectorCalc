import { validateFormulaAst } from "@/lib/generated-tools/ast-formula-validator";

/**
 * Validates that `expression` is a syntactically valid single-expression formula.
 * Uses jsep AST parser instead of `new Function()` for safety.
 */
function isValidJavaScriptExpression(expression: string): boolean {
  const trimmed = expression.trim();
  if (!trimmed) {
    return false;
  }
  try {
    const result = validateFormulaAst(trimmed, [], []);
    if (!result.valid) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

function containsUnresolvedBareIdentifiers(expression: string): boolean {
  const withoutStrings = expression.replace(/'[^']*'|"[^"]*"|`[^`]*`/g, "0");
  const withoutMemberAccess = withoutStrings
    .replace(/\b(input|results|Math|Number)\.[A-Za-z_$][\w$]*/g, "0")
    .replace(/results\[[^\]]+\]/g, "0");
  const tokenPattern = /\b([A-Za-z_][A-Za-z0-9_]*)\b/g;
  const allowed = new Set([
    "Math",
    "Number",
    "input",
    "results",
    "true",
    "false",
    "null",
    "undefined",
    "NaN",
    "Infinity",
    "let",
    "const",
    "var",
    "return",
    "asFormulaNumber",
  ]);
  for (const match of withoutMemberAccess.matchAll(tokenPattern)) {
    if (!allowed.has(match[1])) {
      return true;
    }
  }
  return false;
}

function containsUnresolvedFunctionCalls(expression: string): boolean {
  const withoutStrings = expression.replace(/'[^']*'|"[^"]*"|`[^`]*`/g, "0");
  const callPattern = /\b([A-Za-z_][A-Za-z0-9_]*)\s*\(/g;
  const allowed = new Set([
    "Math",
    "Number",
    "parseFloat",
    "parseInt",
    "isFinite",
    "erf",
    "asFormulaNumber",
  ]);
  for (const match of withoutStrings.matchAll(callPattern)) {
    if (!allowed.has(match[1])) {
      return true;
    }
  }
  return false;
}

function containsStringTernary(expression: string): boolean {
  return /\?\s*['"`][^'"`]*['"`]\s*:/.test(expression);
}

function containsUnsupportedArrayLiterals(expression: string): boolean {
  const withoutResultsAccess = expression.replace(/results\[[^\]]+\]/g, "0");
  return /\[[^\]]*\]/.test(withoutResultsAccess);
}

export function isSafeCompiledFormulaExpression(expression: string): boolean {
  return (
    isValidJavaScriptExpression(expression) &&
    !containsUnresolvedBareIdentifiers(expression) &&
    !containsUnresolvedFunctionCalls(expression) &&
    !containsUnsupportedArrayLiterals(expression) &&
    !containsStringTernary(expression)
  );
}
