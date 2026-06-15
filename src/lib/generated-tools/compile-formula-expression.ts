function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function replaceIdentifierExpression(
  expression: string,
  identifier: string,
  replacement: string,
): string {
  const pattern = new RegExp(`\\b${escapeRegExp(identifier)}\\b`, "g");
  return expression.replace(pattern, replacement);
}

function transformMathFunctions(expression: string): string {
  return expression
    .replace(/\bMAX\s*\(/gi, "Math.max(")
    .replace(/\bMIN\s*\(/gi, "Math.min(")
    .replace(/\bABS\s*\(/gi, "Math.abs(")
    .replace(/\bSQRT\s*\(/gi, "Math.sqrt(")
    .replace(/\bPOW\s*\(/gi, "Math.pow(")
    .replace(/\bROUND\s*\(\s*([^,]+?)\s*,\s*(\d+)\s*\)/gi, "(Math.round(($1) * 10**($2)) / 10**($2))")
    .replace(/\bROUND\s*\(\s*([^)]+?)\s*\)/gi, "Math.round($1)");
}

function stripAssignmentPrefix(expression: string): string {
  return expression.replace(/^[A-Za-z_][A-Za-z0-9_]*\s*=\s*/, "").trim();
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
    const thenVal = nextWhen === -1 ? inner.trim() : inner.slice(0, nextWhen).trim();
    inner = nextWhen === -1 ? "" : inner.slice(nextWhen).trim();
    clauses.push({ when: whenVal, then: thenVal });
  }

  if (clauses.length === 0) {
    return expression;
  }

  let chain = "0";
  for (let index = clauses.length - 1; index >= 0; index -= 1) {
    const clause = clauses[index];
    chain = `(${subject} === ${clause.when} ? ${clause.then} : ${chain})`;
  }
  return chain;
}

function stripNonAsciiOperators(expression: string): string {
  return expression
    .replace(/σ/g, "sigma")
    .replace(/δ/g, "delta")
    .replace(/η/g, "eta")
    .replace(/→/g, "->");
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
    return false;
  }
}

export function compileFormulaExpression(
  rawExpression: string,
  options: {
    readonly inputIds: readonly string[];
    readonly inputToAccess: (inputId: string) => string;
    readonly formulaKeys: readonly string[];
    readonly selfKey?: string;
  },
): string | null {
  let expression = stripNonAsciiOperators(stripAssignmentPrefix(rawExpression.trim()));
  if (!expression) {
    return null;
  }

  if (/\bsolve\s*\(/i.test(expression) || /\([^)]*straight_line[^)]*\)/i.test(expression)) {
    return null;
  }

  expression = transformCaseWhenExpression(expression);
  expression = transformMathFunctions(expression);
  expression = transformPowerNotation(expression);

  for (const inputId of options.inputIds) {
    expression = replaceIdentifierExpression(
      expression,
      inputId,
      options.inputToAccess(inputId),
    );
  }

  for (const formulaKey of options.formulaKeys) {
    if (formulaKey === options.selfKey) {
      continue;
    }
    expression = replaceIdentifierExpression(
      expression,
      formulaKey,
      `(results[${JSON.stringify(formulaKey)}] ?? 0)`,
    );
  }

  return isValidJavaScriptExpression(expression) ? expression : null;
}
