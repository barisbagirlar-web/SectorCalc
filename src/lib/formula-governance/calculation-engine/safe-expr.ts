/**
 * ═══════════════════════════════════════════════════════════════════════════
 * SAFE EXPRESSION CORE (v4 — Full Industrial + All PRO Tool Patterns)
 * ═══════════════════════════════════════════════════════════════════════════
 * No eval(). No `new Function()`. Uses mathjs AST whitelist for safe
 * expression evaluation. Recursively validates EVERY node against an
 * allow-list.
 *
 * v4 additions:
 *   • ** → ^ normalization
 *   • !x → not(x) normalization
 *   • AccessorNode (obj[key]) — object must be known var, index simple
 *   • ObjectNode ({a:1, b:2}) — for inline lookup tables
 *   • ArrayNode ([1,2,3]) — for constant arrays
 *   • normal_cdf → allowed (alias for mathjs erf-based CDF)
 *   • binomial_coefficient → allowed
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { create, all, type MathNode } from 'mathjs';

const math = create(all, {});
math.import(
  {
    import: function () { throw new Error('disabled'); },
    createUnit: function () { throw new Error('disabled'); },
    normsdist: function (x: number): number {
      return 0.5 * (1 + (math as any).erf(x / Math.sqrt(2)));
    },
    normal_cdf: function (x: number): number {
      return 0.5 * (1 + (math as any).erf(x / Math.sqrt(2)));
    },
    binomial_coefficient: function (n: number, k: number): number {
      if (k < 0 || k > n) return 0;
      if (k === 0 || k === n) return 1;
      let res = 1;
      for (let i = 1; i <= Math.min(k, n - k); i++) {
        res = res * (n - i + 1) / i;
      }
      return res;
    },
    binomial_cdf: function (k: number, n: number, p: number): number {
      if (k < 0) return 0;
      if (k >= n) return 1;
      let sum = 0;
      const bc = (n1: number, k1: number) => {
        if (k1 < 0 || k1 > n1) return 0;
        if (k1 === 0 || k1 === n1) return 1;
        let r = 1;
        for (let i = 1; i <= Math.min(k1, n1 - k1); i++) r = r * (n1 - i + 1) / i;
        return r;
      };
      for (let i = 0; i <= Math.floor(k); i++) {
        sum += bc(n, i) * Math.pow(p, i) * Math.pow(1 - p, n - i);
      }
      return sum;
    },
    parseFloat: function (x: number): number {
      return Number(x) || 0;
    },
    parsefloat: function (x: number): number {
      return Number(x) || 0;
    },
    iif: function (cond: boolean, trueVal: number, falseVal: number): number {
      return cond ? trueVal : falseVal;
    },
    radians: function (x: number): number {
      return x * Math.PI / 180;
    },
    degrees: function (x: number): number {
      return x * 180 / Math.PI;
    },
    // ── REAL NEWTON‑RAPHSON IRR ────────────────────────────────────────
    // Computes Internal Rate of Return via Newton‑Raphson iteration.
    // Called as: _irr(investment, annual_cf, escalation_pct, years, salvage)
    _irr: function (
      investment: number,
      annualCf: number,
      escalationPct: number,
      years: number,
      salvage: number
    ): number {
      if (investment <= 0 || years <= 0) return 0;
      let irr = 0.10;
      const g = escalationPct / 100;
      for (let i = 0; i < 1000; i++) {
        let f = -investment;
        let df = 0;
        for (let t = 1; t <= years; t++) {
          const cf = annualCf * Math.pow(1 + g, t - 1);
          f += cf / Math.pow(1 + irr, t);
          df -= t * cf / Math.pow(1 + irr, t + 1);
          if (t === years) f += salvage / Math.pow(1 + irr, years);
        }
        const di = f / df;
        irr -= di;
        if (Math.abs(di) < 1e-8) break;
      }
      return irr * 100;
    },
    // ── REAL PASQUILL‑GIFFORD DISPERSION DISTANCE ──────────────────────
    // Computes downwind distance where concentration drops below IDLH.
    // Called as: _dispersion_idlh(stability_class, release_rate, wind_speed, release_height, mol_weight, idlh_ppm)
    _dispersion_idlh: function (
      stabilityClass: number,
      releaseRateKgS: number,
      windSpeedMs: number,
      releaseHeightM: number,
      molWeightGMol: number,
      idlhPpm: number
    ): number {
      if (releaseRateKgS <= 0 || windSpeedMs <= 0 || idlhPpm <= 0) return 5000;
      // Pasquill-Gifford coefficients [sy_a, sy_b, sz_a, sz_b]
      const pg: Record<number, number[]> = {
        0: [0.22, 0.0001, 0.20, 0],
        1: [0.16, 0.0001, 0.12, 0],
        2: [0.11, 0.0002, 0.08, 0.0002],
        3: [0.08, 0.0015, 0.06, 0.0015],
        4: [0.06, 0.0015, 0.03, 0.0003],
        5: [0.04, 0.0015, 0.016, 0.0003],
      };
      const c = pg[Math.floor(stabilityClass)] || pg[3];
      const convFactor = 1e6 / (molWeightGMol / 22400) * 1000;
      let D = 50;
      for (let i = 0; i < 200; i++) {
        const sy = c[0] * D * Math.pow(1 + c[1] * D, -0.5);
        const sz = c[2] * D * Math.pow(1 + c[3] * D, -0.5);
        const C = releaseRateKgS / (Math.PI * sy * sz * windSpeedMs) *
          Math.exp(-0.5 * Math.pow(releaseHeightM / sz, 2)) * convFactor;
        if (C < idlhPpm) break;
        D += 25;
      }
      return D;
    },
  },
  { override: true }
);

export const ALLOWED_FUNCTIONS = new Set([
  'sqrt', 'cbrt', 'abs', 'min', 'max', 'pow', 'exp',
  'log', 'log10', 'log2', 'sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'atan2',
  'sinh', 'cosh', 'tanh',
  'floor', 'ceil', 'round', 'sign', 'hypot', 'mod',
  'erf', 'normsdist', 'normal_cdf',
  'binomial_coefficient', 'binomial_cdf',
  'parsefloat', 'not', 'iif', 'radians', 'degrees',
  '_irr', '_dispersion_idlh',
]);

export const ALLOWED_CONSTANTS = new Set(['pi', 'e', 'tau', 'true', 'false']);

export interface ValidationContext {
  knownVars: Set<string>;
}

/**
 * Pre‑normalize expression text before mathjs parsing.
 * Order matters — more specific patterns first.
 */
export function preNormalize(expr: string): string {
  let s = expr;
  // 1. Equality/inequality (before ! negation)
  s = s.replace(/===/g, ' == ');
  s = s.replace(/!==/g, ' != ');
  // 2. Logical operators
  s = s.replace(/&&/g, ' and ');
  s = s.replace(/\|\|/g, ' or ');
  // 2b. Uppercase AND/OR → lowercase (for mathjs compatibility)
  s = s.replace(/\bAND\b/g, ' and ');
  s = s.replace(/\bOR\b/g, ' or ');
  // 3. Power operator ** → ^ (mathjs ** is valid but ** without space fails)
  s = s.replace(/\*\*/g, '^');
  // 4. Unary NOT: !x → not(x) — but NOT inside words like !=
  s = s.replace(/(?<![=<>!])!([a-zA-Z_]\w*)/g, 'not($1)');
  // 4b. NOT with parentheses: !(expr) → not(expr) 
  s = s.replace(/(?<![=<>!])!\(/g, 'not(');
  // 5. Uppercase fn names → lowercase (for known mathjs functions)
  const UPPER_FN = /([A-Z][A-Z0-9_]*)\s*\(/g;
  const known = new Set([
    'abs','min','max','pow','sqrt','cbrt','exp','log',
    'log10','log2','sin','cos','tan','asin','acos','atan','atan2',
    'sinh','cosh','tanh','floor','ceil','round','sign','hypot','mod',
    'erf','normsdist','normal_cdf','binomial_coefficient',
    'not','iif','radians','degrees','parsefloat',
  ]);
  s = s.replace(UPPER_FN, (match: string, fnName: string) => {
    const lower = fnName.toLowerCase();
    return known.has(lower) ? lower + '(' : match;
  });
  return s;
}

function assertSafeNode(node: MathNode, ctx: ValidationContext): void {
  switch (node.type) {
    case 'ConstantNode':
      return;

    case 'BlockNode': {
      const blocks = (node as any).blocks;
      if (Array.isArray(blocks)) {
        for (const block of blocks) {
          if (block.expr) assertSafeNode(block.expr, ctx);
        }
      }
      return;
    }

    case 'AssignmentNode': {
      const an = node as any;
      assertSafeNode(an.value, ctx);
      return;
    }

    case 'FunctionAssignmentNode':
      throw new Error('Function definition not allowed');

    case 'ParenthesisNode':
      assertSafeNode((node as any).content, ctx);
      return;

    case 'OperatorNode': {
      (node as any).args.forEach((a: MathNode) => assertSafeNode(a, ctx));
      return;
    }

    case 'ConditionalNode': {
      const n = node as any;
      assertSafeNode(n.condition, ctx);
      assertSafeNode(n.trueExpr, ctx);
      assertSafeNode(n.falseExpr, ctx);
      return;
    }

    case 'SymbolNode': {
      const name = (node as any).name;
      if (ALLOWED_CONSTANTS.has(name)) return;
      if (ctx.knownVars.has(name)) return;
      throw new Error(`Unknown or disallowed symbol: "${name}"`);
    }

    case 'FunctionNode': {
      const n = node as any;
      const fnName = n.fn && n.fn.name ? n.fn.name : String(n.fn);
      if (!ALLOWED_FUNCTIONS.has(fnName.toLowerCase())) {
        throw new Error(`Disallowed function: "${fnName}"`);
      }
      n.args.forEach((a: MathNode) => assertSafeNode(a, ctx));
      return;
    }

    case 'AccessorNode': {
      // obj[key] — allow if object is known var and index is safe
      const an = node as any;
      assertSafeNode(an.object, ctx);
      if (an.index) {
        const index = an.index as any;
        // Simple index (single value)
        if (index.dimensions) {
          index.dimensions.forEach((d: MathNode) => assertSafeNode(d, ctx));
        }
      }
      return;
    }

    case 'ObjectNode': {
      // {key: value, ...} — inline object literal (lookup tables)
      const on = node as any;
      if (on.properties) {
        for (const key of Object.keys(on.properties)) {
          assertSafeNode(on.properties[key], ctx);
        }
      }
      return;
    }

    case 'ArrayNode': {
      // [item1, item2, ...] — constant arrays
      const arr = node as any;
      if (arr.items) {
        arr.items.forEach((item: MathNode) => assertSafeNode(item, ctx));
      }
      return;
    }

    case 'RelationalNode': {
      // a == b, a != b, a < b, a <= b, a > b, a >= b — allowed
      const rn = node as any;
      const params = (rn as any).params || [];
      params.forEach((p: MathNode) => assertSafeNode(p, ctx));
      return;
    }

    default:
      throw new Error(`Disallowed expression construct: ${node.type}`);
  }
}

export function compileSafe(expr: string, ctx: ValidationContext) {
  const normalized = preNormalize(expr);
  let ast: MathNode;
  try {
    ast = math.parse(normalized);
  } catch (e: any) {
    throw new Error(`Parse error in "${expr}": ${e.message}`);
  }
  assertSafeNode(ast, ctx);
  const code = ast.compile();
  return {
    eval(scope: Record<string, number>): number {
      const v = code.evaluate(scope);
      if (typeof v === 'boolean') return v ? 1 : 0;
      if (typeof v === 'object' && v !== null && !Array.isArray(v)) {
        // ObjectNode result — extract first numeric value
        const vals = Object.values(v).filter((x): x is number => typeof x === 'number' && isFinite(x));
        return vals.length > 0 ? vals[0] : 0;
      }
      if (Array.isArray(v)) {
        // ArrayNode result — extract first element
        const first = v[0];
        if (typeof first === 'number' && isFinite(first)) return first;
        return 0;
      }
      if (typeof v !== 'number' || !isFinite(v)) {
        throw new Error(`Non-finite result from "${expr}"`);
      }
      return v;
    },
    evalBool(scope: Record<string, number>): boolean {
      const v = code.evaluate(scope);
      return !!v;
    },
    ast,
  };
}

export function dependencies(expr: string, ctx: ValidationContext): string[] {
  const normalized = preNormalize(expr);
  const ast = math.parse(normalized);
  const deps = new Set<string>();
  ast.traverse((n: any) => {
    if (n.type === 'SymbolNode') {
      const name = n.name;
      if (!ALLOWED_CONSTANTS.has(name) && ctx.knownVars.has(name)) deps.add(name);
    }
  });
  return [...deps];
}

export { math };
