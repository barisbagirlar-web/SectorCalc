function isValidJavaScriptExpression(expression: string): boolean {
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
