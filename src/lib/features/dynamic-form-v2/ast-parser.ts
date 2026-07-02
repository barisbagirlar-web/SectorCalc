/**
 * Safe AST expression engine - no eval, no Function constructor.
 * Tokenizes → Pratt-parses → evaluates against a scope object.
 *
 * CRITICAL FIX: Preprocesses Math constants (Math.PI, Math.E, etc.) into
 * numeric literals before tokenization because the tokenizer treats '.' as
 * part of identifier names, making "Math.PI" a single unresolvable token.
 * Also converts ** and ^ (engineering exponentiation) to Math.pow() calls.
 */

type Token =
  | { t: "num"; v: number }
  | { t: "str"; v: string }
  | { t: "id"; v: string }
  | { t: "op"; v: string }
  | { t: "eof" };

type ASTNode =
  | { k: "num"; v: number }
  | { k: "str"; v: string }
  | { k: "id"; v: string }
  | { k: "neg"; e: ASTNode }
  | { k: "not"; e: ASTNode }
  | { k: "call"; c: string; a: ASTNode[] }
  | { k: "bin"; op: string; l: ASTNode; r: ASTNode }
  | { k: "tern"; cond: ASTNode; t: ASTNode; f: ASTNode };

/**
 * Preprocess expression string before tokenization:
 * 1. Replace Math constants with numeric literals
 * 2. Convert ** and ^ exponentiation to Math.pow() calls
 */
const MATH_CONSTS: Record<string, string> = {
  "Math.PI":     "3.141592653589793",
  "Math.E":      "2.718281828459045",
  "Math.SQRT2":  "1.4142135623730951",
  "Math.SQRT1_2":"0.7071067811865476",
  "Math.LN2":    "0.6931471805599453",
  "Math.LN10":   "2.302585092994046",
  "Math.LOG2E":  "1.4426950408889634",
  "Math.LOG10E": "0.4342944819032518",
};

function preprocess(src: string): string {
  let result = src;
  // 1. Replace Math constants with literal numeric values
  for (const [key, val] of Object.entries(MATH_CONSTS)) {
    // Match key NOT followed by a letter/digit/dot/underscore (i.e. not part of a longer identifier)
    const re = new RegExp(
      key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "(?![A-Za-z0-9_.$])",
      "g",
    );
    result = result.replace(re, val);
  }
  // 2. Convert (expr) ** N  →  Math.pow((expr), N)  (parenthesized left operand)
  //    Must run before the simpler pattern below to avoid `)**2` → `Math.pow(), 2)` corruption.
  result = result.replace(
    /\(([^()]+)\)\s*\*\*\s*(\w+|-?\d+\.?\d*)/g,
    (_, expr, power) => `Math.pow((${expr}), ${power})`,
  );
  // 3. Convert a ** b  →  Math.pow(a, b)  (simple identifier/close-paren left)
  result = result.replace(
    /(\w+|[)])\s*\*\*\s*(\w+|-?\d+\.?\d*)/g,
    (_, left, right) => {
      const l = left === ")" ? left : left;
      return `Math.pow(${l}, ${right})`;
    },
  );
  // 4. Convert (expr) ^ N  →  Math.pow((expr), N)  (parenthesized left operand)
  result = result.replace(
    /\(([^()]+)\)\s*\^\s*(\w+|-?\d+\.?\d*)/g,
    (_, expr, power) => `Math.pow((${expr}), ${power})`,
  );
  // 5. Convert a ^ b  →  Math.pow(a, b)  (simple identifier/close-paren left)
  //    Must not be confused with bitwise XOR (rare in engineering calc)
  result = result.replace(
    /(\w+|[)])\s*\^\s*(\w+|-?\d+\.?\d*)/g,
    (_, left, right) => {
      const l = left === ")" ? left : left;
      return `Math.pow(${l}, ${right})`;
    },
  );
  return result;
}

function tokenize(src: string): Token[] {
  const t: Token[] = [];
  let i = 0;
  const ops = [
    "===", "!==", "<=", ">=", "&&", "||", "+", "-", "*", "/", "%",
    "(", ")", ",", "?", ":", "<", ">", "!",
  ];
  while (i < src.length) {
    const c = src[i];
    if (/\s/.test(c)) { i++; continue; }
    if (c === "'") {
      let j = i + 1, s = "";
      while (j < src.length && src[j] !== "'") s += src[j++];
      t.push({ t: "str", v: s });
      i = j + 1;
      continue;
    }
    if (/[0-9.]/.test(c)) {
      let j = i, s = "";
      while (j < src.length && (/[0-9.eE]/.test(src[j]) || ((src[j] === "+" || src[j] === "-") && /[eE]/.test(src[j - 1]))))
        s += src[j++];
      t.push({ t: "num", v: parseFloat(s) });
      i = j;
      continue;
    }
    if (/[A-Za-z_$]/.test(c)) {
      let j = i, s = "";
      while (j < src.length && /[A-Za-z0-9_$.]/.test(src[j])) s += src[j++];
      t.push({ t: "id", v: s });
      i = j;
      continue;
    }
    const m = ops.find((o) => src.startsWith(o, i));
    if (m) {
      t.push({ t: "op", v: m });
      i += m.length;
      continue;
    }
    throw new Error("Unexpected character: " + c);
  }
  t.push({ t: "eof" });
  return t;
}

const BP: Record<string, number> = {
  "?": 2, "||": 3, "&&": 4, "===": 5, "!==": 5,
  "<": 6, ">": 6, "<=": 6, ">=": 6,
  "+": 7, "-": 7, "*": 8, "/": 8, "%": 8,
};

function parse(toks: Token[]): ASTNode {
  let p = 0;
  const peek = () => toks[p];
  const next = () => toks[p++];

  function nud(tk: Token): ASTNode {
    if (tk.t === "num") return { k: "num", v: tk.v };
    if (tk.t === "str") return { k: "str", v: tk.v };
    if (tk.t === "id") {
      const p0 = peek();
      if (p0.t === "op" && (p0 as { t: "op"; v: string }).v === "(") {
        next();
        const a: ASTNode[] = [];
        const p1 = peek();
        if (!(p1.t === "op" && (p1 as { t: "op"; v: string }).v === ")")) {
          a.push(expr(0));
          let p2 = peek();
          while (p2.t === "op" && (p2 as { t: "op"; v: string }).v === ",") {
            next();
            a.push(expr(0));
            p2 = peek();
          }
        }
        next();
        return { k: "call", c: tk.v, a };
      }
      return { k: "id", v: tk.v };
    }
    if (tk.t === "op" && (tk as { t: "op"; v: string }).v === "(") {
      const e = expr(0);
      next();
      return e;
    }
    if (tk.t === "op" && (tk as { t: "op"; v: string }).v === "-") return { k: "neg", e: expr(9) };
    if (tk.t === "op" && (tk as { t: "op"; v: string }).v === "!") return { k: "not", e: expr(9) };
    throw new Error("Parse error at: " + JSON.stringify(tk));
  }

  function expr(rbp: number): ASTNode {
    let left = nud(next());
    while (true) {
      const t = peek();
      if (t.t !== "op") break;
      const bp = BP[t.v];
      if (bp === undefined || bp <= rbp) break;
      next();
      if (t.v === "?") {
        const c = expr(0);
        next();
        const a = expr(1);
        left = { k: "tern", cond: left, t: c, f: a };
      } else {
        left = { k: "bin", op: t.v, l: left, r: expr(bp) };
      }
    }
    return left;
  }

  return expr(0);
}

const GLOBALS = new Set([
  "Math", "Number", "isFinite", "isNaN", "parseInt", "parseFloat",
  "Array", "String", "Boolean", "Object", "Date", "JSON", "Map", "Set",
  "Infinity", "NaN", "undefined",
]);

function ev(n: ASTNode, s: Record<string, unknown>): unknown {
  switch (n.k) {
    case "num":
      return n.v;
    case "str":
      return n.v;
    case "id": {
      if (n.v === "null") return null;
      if (n.v === "true") return true;
      if (n.v === "false") return false;
      return s[n.v];
    }
    case "neg":
      return -(ev(n.e, s) as number);
    case "not":
      return !ev(n.e, s);
    case "tern":
      return ev(n.cond, s) ? ev(n.t, s) : ev(n.f, s);
    case "call": {
      const parts = n.c.split(".");
      let fn: unknown = parts[0] === "Math" ? Math : (GLOBALS.has(parts[0]) ? (globalThis as any)[parts[0]] : undefined);
      for (let k = 1; k < parts.length; k++) {
        fn = (fn as any)[parts[k]];
      }
      if (typeof fn !== "function") {
        throw new Error(`Unknown function: ${n.c}`);
      }
      return fn(...n.a.map((x) => ev(x, s)));
    }
    case "bin": {
      const op = n.op;
      if (op === "&&") {
        const a = ev(n.l, s);
        return a ? ev(n.r, s) : a;
      }
      if (op === "||") {
        const a = ev(n.l, s);
        return a ? a : ev(n.r, s);
      }
      const l = ev(n.l, s) as number;
      const r = ev(n.r, s) as number;
      switch (op) {
        case "+": return l + r;
        case "-": return l - r;
        case "*": return l * r;
        case "/": return l / r;
        case "%": return l % r;
        case "===": return l === r;
        case "!==": return l !== r;
        case "<": return l < r;
        case ">": return l > r;
        case "<=": return l <= r;
        case ">=": return l >= r;
        default: throw new Error(`Unknown operator: ${op}`);
      }
    }
  }
}

export type CompiledExpression = {
  (scope: Record<string, unknown>): unknown;
  src: string;
};

export function compile(src: string): CompiledExpression {
  const processed = preprocess(src);
  const ast = parse(tokenize(processed));
  const fn = (scope: Record<string, unknown>): unknown => ev(ast, scope);
  fn.src = src;
  return fn;
}

export function safeEval(
  fn: CompiledExpression,
  scope: Record<string, unknown>,
): unknown {
  try {
    return fn(scope);
  } catch {
    return undefined;
  }
}
