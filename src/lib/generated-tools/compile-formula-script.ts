import { toSafeVarName } from "@/lib/generated-tools/export-names";

type ScriptCompileOptions = {
  readonly inputIds: readonly string[];
  readonly inputToAccess: (inputId: string) => string;
  readonly formulaKeys: readonly string[];
  readonly selfKey?: string;
};

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function replaceIdentifierExpression(
  expression: string,
  identifier: string,
  replacement: string,
): string {
  const pattern = new RegExp(`\\b${escapeRegExp(identifier)}\\b`, "g");
  return expression.replace(pattern, replacement);
}

function isValidFormulaEvaluationExpression(expression: string): boolean {
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

function stripAssignmentPrefix(expression: string): string {
  return expression.replace(/^[\p{L}][\p{L}\p{N}_]*\s*=(?![=<>])\s*/u, "").trim();
}

function transformIfThenElseEnd(expression: string): string {
  const trimmed = expression.trim();
  const match = trimmed.match(/^IF\s+(.+?)\s+THEN\s+(.+?)\s+ELSE\s+(.+?)\s+END$/i);
  if (!match) {
    return expression;
  }
  return `((${match[1]!.trim()}) ? (${match[2]!.trim()}) : (${match[3]!.trim()}))`;
}

function transformMathErf(expression: string): string {
  return expression.replace(/\bMath\.erf\b/g, "erf");
}

function looksLikeScript(expression: string): boolean {
  const trimmed = expression.trim();
  if (!trimmed) {
    return false;
  }
  return (
    /^(const|let|var|function|return)\b/.test(trimmed) ||
    /;\s*(const|let|var|return)\b/.test(trimmed) ||
    /^\(?(inputs)\b/.test(trimmed) ||
    /^\(\(\)\s*=>/.test(trimmed) ||
    /^\([^)]*\)\s*=>/.test(trimmed) ||
    /^function\s*\(/.test(trimmed) ||
    /=>\s*\{/.test(trimmed) ||
    /\binputs\./.test(trimmed) ||
    /\binputs\[/.test(trimmed) ||
    /\bformulas\./.test(trimmed) ||
    /\breturn\b/.test(trimmed) ||
    /\{[a-zA-Z_][\w]*\}/.test(trimmed) ||
    /\bMath\.erf\b/.test(trimmed) ||
    /\bfor\s*\(/.test(trimmed) ||
    /\bCASE\s+WHEN\b/i.test(trimmed) ||
    /\bcase\s+[a-zA-Z_][\w]*\s+when\b/i.test(trimmed) ||
    /\bswitch\s*\(/i.test(trimmed) ||
    /\bif\s+[a-zA-Z_][\w]*\s*==/i.test(trimmed) ||
    /\bif\s+.+\s*:\s*.+;\s*else\s*:/i.test(trimmed) ||
    /\bIF\s+.+\s+THEN\b/.test(trimmed) ||
    /^\[/.test(trimmed) ||
    /\bsum_\{/i.test(trimmed)
  );
}

function transformLooseIfCall(expression: string): string {
  return expression.replace(
    /\bif\s*\(\s*([^,()]+(?:\([^)]*\)[^,()]*)*)\s*,\s*([^,]+)\s*,\s*([^)]+)\s*\)/gi,
    "(($1) ? ($2) : ($3))",
  );
}

function transformPythonConditional(expression: string): string {
  const trimmed = expression.trim();
  const match = trimmed.match(
    /^if\s+(.+?)\s*:\s*(.+?)\s*;\s*else\s*:\s*([\s\S]+)$/i,
  );
  if (!match) {
    return expression;
  }
  const [, cond, thenVal, elseVal] = match;
  return `((${cond!.trim()}) ? (${thenVal!.trim()}) : (${elseVal!.trim()}))`;
}

function transformSqlCaseWhenExpression(expression: string): string {
  const trimmed = expression.trim();
  if (!/^CASE\s+WHEN\b/i.test(trimmed)) {
    return expression;
  }

  let rest = trimmed.replace(/^CASE\s+/i, "").replace(/\s+END\s*$/i, "").trim();
  const clauses: Array<{ when: string; then: string }> = [];
  while (/^WHEN\s+/i.test(rest)) {
    rest = rest.replace(/^WHEN\s+/i, "");
    const thenIdx = rest.search(/\s+THEN\s+/i);
    if (thenIdx === -1) {
      break;
    }
    const whenVal = rest.slice(0, thenIdx).trim();
    rest = rest.slice(thenIdx).replace(/^\s+THEN\s+/i, "");
    const nextWhen = rest.search(/\s+WHEN\s+/i);
    const nextElse = rest.search(/\s+ELSE\s+/i);
    const stopIdx = (() => {
      if (nextWhen === -1 && nextElse === -1) {
        return -1;
      }
      if (nextWhen === -1) {
        return nextElse;
      }
      if (nextElse === -1) {
        return nextWhen;
      }
      return Math.min(nextWhen, nextElse);
    })();
    const thenVal = stopIdx === -1 ? rest.trim() : rest.slice(0, stopIdx).trim();
    rest = stopIdx === -1 ? "" : rest.slice(stopIdx).trim();
    clauses.push({ when: whenVal, then: thenVal });
  }

  if (clauses.length === 0) {
    return expression;
  }

  const elseVal = /^ELSE\s+/i.test(rest) ? rest.replace(/^ELSE\s+/i, "").trim() : "0";
  let chain = elseVal;
  for (let index = clauses.length - 1; index >= 0; index -= 1) {
    const clause = clauses[index]!;
    chain = `((${clause.when}) ? (${clause.then}) : (${chain}))`;
  }
  return chain;
}

function transformSqlCaseWhen(expression: string): string {
  const trimmed = expression.trim();
  const match = trimmed.match(
    /^case\s+([a-zA-Z_][\w]*)\s+when\s+([\s\S]+)$/i,
  );
  if (!match) {
    return expression;
  }

  const subject = match[1]!.trim();
  let rest = match[2]!.trim().replace(/\s+end\s*$/i, "");
  const clauses: Array<{ when: string; then: string }> = [];
  while (rest.length > 0) {
    const whenMatch = rest.match(/^'([^']*)'\s+then\s+/i) ?? rest.match(/^(\S+)\s+then\s+/i);
    if (!whenMatch) {
      break;
    }
    rest = rest.slice(whenMatch[0]!.length);
    const elseIdx = rest.search(/\s+when\s+'/i);
    const elseKeyword = rest.search(/\s+else\s+/i);
    const stopIdx = (() => {
      if (elseIdx === -1 && elseKeyword === -1) {
        return -1;
      }
      if (elseIdx === -1) {
        return elseKeyword;
      }
      if (elseKeyword === -1) {
        return elseIdx;
      }
      return Math.min(elseIdx, elseKeyword);
    })();
    const thenVal = stopIdx === -1 ? rest.trim() : rest.slice(0, stopIdx).trim();
    rest = stopIdx === -1 ? "" : rest.slice(stopIdx).trim();
    clauses.push({ when: whenMatch[1] ?? whenMatch[0], then: thenVal });
    if (/^when\s+/i.test(rest)) {
      rest = rest.replace(/^when\s+/i, "");
      continue;
    }
    if (/^else\s+/i.test(rest)) {
      const elseVal = rest.replace(/^else\s+/i, "").trim();
      let chain = elseVal;
      for (let index = clauses.length - 1; index >= 0; index -= 1) {
        const clause = clauses[index]!;
        chain = `(${subject} === ${JSON.stringify(clause.when)} ? ${clause.then} : ${chain})`;
      }
      return chain;
    }
  }
  return expression;
}

function transformSwitchLookup(expression: string): string {
  return expression.replace(
    /\bswitch\s*\(\s*([^,]+)\s*,\s*([^)]+)\s*\)/gi,
    (_match, subject, pairsRaw) => {
      const parts = String(pairsRaw)
        .split(",")
        .map((part) => part.trim())
        .filter(Boolean);
      if (parts.length < 2) {
        return _match;
      }
      let chain = parts[parts.length - 1]!;
      for (let index = parts.length - 3; index >= 0; index -= 2) {
        const key = parts[index]!;
        const value = parts[index + 1]!;
        chain = `(${subject} === ${JSON.stringify(key)} ? ${value} : ${chain})`;
      }
      return chain;
    },
  );
}

function transformBracePlaceholders(
  expression: string,
  options: ScriptCompileOptions,
): string {
  return expression.replace(/\{([a-zA-Z_][\w]*)\}/g, (_match, key: string) => {
    if (options.inputIds.includes(key)) {
      return options.inputToAccess(key);
    }
    if (options.formulaKeys.includes(key)) {
      return `(results[${JSON.stringify(key)}] ?? 0)`;
    }
    return _match;
  });
}

function substituteInputAccess(expression: string, options: ScriptCompileOptions): string {
  let result = expression;
  for (const inputId of options.inputIds) {
    const safe = toSafeVarName(inputId);
    const access = options.inputToAccess(inputId);
    result = result.replace(
      new RegExp(`\\binputs\\.${escapeRegExp(inputId)}\\b`, "g"),
      access,
    );
    result = result.replace(
      new RegExp(`inputs\\[['"]${escapeRegExp(inputId)}['"]\\]`, "g"),
      access,
    );
  }
  result = result.replace(/\binputs\b/g, "input");
  return result;
}

function substituteFormulaReferences(
  expression: string,
  options: ScriptCompileOptions,
): string {
  let result = expression;
  for (const key of options.formulaKeys) {
    if (key === options.selfKey) {
      continue;
    }
    result = result.replace(
      new RegExp(`\\bformulas\\.${escapeRegExp(key)}\\b`, "g"),
      `(results[${JSON.stringify(key)}] ?? 0)`,
    );
    result = result.replace(
      new RegExp(`\\b${escapeRegExp(key)}\\s*\\(\\s*\\)`, "g"),
      `(results[${JSON.stringify(key)}])`,
    );
  }
  return result;
}

function unwrapInputsArrowFunction(expression: string): string {
  const trimmed = expression.trim();
  const patterns = [
    /^\(inputs\)\s*=>\s*\{([\s\S]*)\}\s*$/,
    /^\(inputs\)\s*=>\s*\(([\s\S]*)\)\s*$/,
    /^function\s*\(\s*inputs\s*\)\s*\{([\s\S]*)\}\s*$/,
    /^function\s*\(\s*inputs\s*\)\s*\{([\s\S]*)\}\s*;?\s*$/,
  ];
  for (const pattern of patterns) {
    const match = trimmed.match(pattern);
    if (match?.[1]) {
      return match[1].trim();
    }
  }
  return expression;
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

function mapInvokeArgument(arg: string, options: ScriptCompileOptions): string {
  const trimmed = arg.trim();
  if (options.inputIds.includes(trimmed)) {
    return options.inputToAccess(trimmed);
  }
  if (options.formulaKeys.includes(trimmed)) {
    return `(results[${JSON.stringify(trimmed)}] ?? 0)`;
  }
  return trimmed;
}

function unwrapLeadingArrowFunction(
  expression: string,
  options: ScriptCompileOptions,
): string {
  const trimmed = expression.trim();
  const invokedMatch = trimmed.match(
    /^\(\(([^)]+)\)\s*=>\s*\{([\s\S]*)\}\)\s*\(([^)]*)\)\s*$/,
  );
  if (invokedMatch?.[1] && invokedMatch[2] && invokedMatch[3] !== undefined) {
    const params = invokedMatch[1]
      .split(",")
      .map((param) => param.trim())
      .filter(Boolean);
    const args = splitTopLevelArgs(invokedMatch[3]).map((arg) =>
      mapInvokeArgument(arg, options),
    );
    return `(((${params.join(", ")}) => { ${invokedMatch[2].trim()} })(${args.join(", ")}))`;
  }

  const patterns = [
    /^\(\(([^)]+)\)\s*=>\s*\{([\s\S]*)\}\)\s*$/,
    /^\(([^)]+)\)\s*=>\s*\{([\s\S]*)\}\s*$/,
    /^\(\(([^)]+)\)\s*=>\s*\(([\s\S]*)\)\)\s*$/,
  ];
  for (const pattern of patterns) {
    const match = trimmed.match(pattern);
    if (!match?.[1] || !match[2]) {
      continue;
    }
    const params = match[1]
      .split(",")
      .map((param) => param.trim())
      .filter(Boolean);
    const body = match[2].trim();
    const args = params.map((param) => {
      const inputId =
        options.inputIds.find(
          (id) => id === param || toSafeVarName(id) === param,
        ) ?? param;
      if (options.inputIds.includes(inputId)) {
        return options.inputToAccess(inputId);
      }
      if (options.formulaKeys.includes(param)) {
        return `(results[${JSON.stringify(param)}] ?? 0)`;
      }
      return param;
    });
    return `((${params.join(", ")}) => { return ${body}; })(${args.join(", ")})`;
  }
  return expression;
}

function transformEmbeddedLowercaseCaseWhen(expression: string): string {
  const trimmed = expression.trim();
  if (!/\bcase\s+when\b/i.test(trimmed)) {
    return expression;
  }

  const clauses: Array<{ when: string; then: string }> = [];
  let rest = trimmed.replace(/^\(?\s*/g, "").replace(/\)?\s*$/g, "");
  const firstCase = rest.search(/\bcase\s+when\b/i);
  if (firstCase > 0) {
    rest = rest.slice(firstCase);
  }

  while (/\bcase\s+when\b/i.test(rest)) {
    rest = rest.replace(/^\(?\s*case\s+when\s+/i, "");
    const thenIdx = rest.search(/\s+then\s+/i);
    if (thenIdx === -1) {
      break;
    }
    const whenVal = rest.slice(0, thenIdx).trim();
    rest = rest.slice(thenIdx).replace(/^\s+then\s+/i, "");
    const nextCase = rest.search(/\s+case\s+when\s+/i);
    const elseIdx = rest.search(/\s+else\s+/i);
    const stopIdx = (() => {
      if (nextCase === -1 && elseIdx === -1) {
        return -1;
      }
      if (nextCase === -1) {
        return elseIdx;
      }
      if (elseIdx === -1) {
        return nextCase;
      }
      return Math.min(nextCase, elseIdx);
    })();
    const thenVal = stopIdx === -1 ? rest.trim() : rest.slice(0, stopIdx).trim();
    rest = stopIdx === -1 ? "" : rest.slice(stopIdx).trim();
    clauses.push({ when: whenVal, then: thenVal });
  }

  if (clauses.length === 0) {
    return expression;
  }

  const elseVal = /^else\s+/i.test(rest) ? rest.replace(/^else\s+/i, "").trim() : "0";
  let chain = elseVal.replace(/\)+$/g, "").trim() || "0";
  for (let index = clauses.length - 1; index >= 0; index -= 1) {
    const clause = clauses[index]!;
    chain = `((${clause.when}) ? (${clause.then}) : (${chain}))`;
  }
  return chain;
}

function stripFormulaProse(expression: string): string {
  return expression
    .replace(/,\s*where\b.+$/i, "")
    .replace(/\.\s*Then\b.+$/i, "")
    .replace(/\s+for\s+(two-tailed|upper-tailed|lower-tailed).+$/i, "")
    .trim();
}

function unwrapParameterizedFunction(
  expression: string,
  options: ScriptCompileOptions,
): string {
  const trimmed = expression.trim();
  const match = trimmed.match(/^function\s*\(([^)]*)\)\s*\{([\s\S]*)\}\s*$/);
  if (!match?.[1] || !match[2]) {
    return expression;
  }
  const params = match[1]
    .split(",")
    .map((param) => param.trim())
    .filter(Boolean);
  if (params.length === 0) {
    return `(() => { ${match[2].trim()} })()`;
  }

  const args = params.map((param) => {
    const inputId =
      options.inputIds.find(
        (id) => id === param || toSafeVarName(id) === param,
      ) ?? param;
    if (options.inputIds.includes(inputId)) {
      return options.inputToAccess(inputId);
    }
    return param;
  });

  return `(function(${params.join(", ")}) { ${match[2].trim()} })(${args.join(", ")})`;
}

function wrapScriptBodyAsExpression(body: string): string {
  const trimmed = body.trim();
  if (!trimmed) {
    return trimmed;
  }
  if (/^\(\(\)\s*=>/.test(trimmed) || /^\(function/.test(trimmed)) {
    return trimmed;
  }
  if (/\breturn\b/.test(trimmed)) {
    return `(() => { ${trimmed} })()`;
  }
  if (/^(const|let|var)\b/.test(trimmed) || trimmed.includes(";")) {
    const statements = trimmed
      .split(";")
      .map((part) => part.trim())
      .filter(Boolean);
    if (statements.length === 0) {
      return trimmed;
    }
    const last = statements[statements.length - 1]!;
    const prefix = statements.slice(0, -1).join("; ");
    if (prefix.length > 0) {
      return `(() => { ${prefix}; return ${last}; })()`;
    }
    return last;
  }
  return trimmed;
}

function sanitizeDangerousPatterns(expression: string): string {
  const dangerous = [
    /__dirname/g,
    /__filename/g,
    /process\./g,
    /require\s*\(/g,
    /import\s*\(/g,
    /eval\s*\(/g,
    /Function\s*\(/g,
  ];
  let sanitized = expression;
  for (const pattern of dangerous) {
    sanitized = sanitized.replace(pattern, "");
  }
  return sanitized;
}

function replaceBareInputUsages(
  expression: string,
  options: ScriptCompileOptions,
): string {
  if (
    /^\(\(?function\s*\(/.test(expression.trim()) ||
    /=>\s*\{/.test(expression) ||
    /\bfunction\s+[A-Za-z_]\w*\s*\(/.test(expression)
  ) {
    return expression;
  }
  let result = expression;
  for (const inputId of options.inputIds) {
    const access = options.inputToAccess(inputId);
    result = result.replace(
      new RegExp(`(?<!input\\.)\\b${escapeRegExp(inputId)}\\b`, "g"),
      (match, offset, full) => {
        const before = full.slice(0, offset);
        if (/\b(?:const|let|var)\s+$/.test(before)) {
          return match;
        }
        return access;
      },
    );
  }
  return result;
}

export function compileFormulaScriptFallback(
  rawExpression: string,
  options: ScriptCompileOptions,
): string | null {
  let expression = rawExpression.trim();
  if (!expression) {
    return null;
  }

  if (!looksLikeScript(expression)) {
    return null;
  }
  expression = stripAssignmentPrefix(expression);
  expression = stripFormulaProse(expression);
  expression = transformIfThenElseEnd(expression);
  expression = unwrapInputsArrowFunction(expression);
  expression = transformPythonConditional(expression);
  expression = transformSqlCaseWhenExpression(expression);
  expression = transformSqlCaseWhen(expression);
  expression = transformEmbeddedLowercaseCaseWhen(expression);
  expression = transformSwitchLookup(expression);
  expression = transformLooseIfCall(expression);
  expression = transformBracePlaceholders(expression, options);
  expression = substituteInputAccess(expression, options);
  expression = substituteFormulaReferences(expression, options);
  expression = transformMathErf(expression);
  expression = unwrapLeadingArrowFunction(expression, options);
  expression = unwrapParameterizedFunction(expression, options);
  expression = replaceBareInputUsages(expression, options);
  expression = wrapScriptBodyAsExpression(expression);
  expression = sanitizeDangerousPatterns(expression);

  if (!expression || !isValidFormulaEvaluationExpression(expression)) {
    return null;
  }
  return expression;
}
