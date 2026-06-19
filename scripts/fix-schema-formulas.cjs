#!/usr/bin/env node
// Fix schema formulas: Math.xxx → uppercase, ** → compatible
const fs = require('fs');

const MATH_FUNCTIONS = [
  ['Math.exp', 'EXP'], ['Math.sqrt', 'SQRT'], ['Math.log', 'LOG'],
  ['Math.log10', 'LOG10'], ['Math.log2', 'LOG2'], ['Math.sin', 'SIN'],
  ['Math.cos', 'COS'], ['Math.tan', 'TAN'], ['Math.asin', 'ASIN'],
  ['Math.acos', 'ACOS'], ['Math.atan', 'ATAN'], ['Math.atan2', 'ATAN2'],
  ['Math.sinh', 'SINH'], ['Math.cosh', 'COSH'], ['Math.tanh', 'TANH'],
  ['Math.asinh', 'ASINH'], ['Math.acosh', 'ACOSH'], ['Math.atanh', 'ATANH'],
  ['Math.ceil', 'CEIL'], ['Math.floor', 'FLOOR'], ['Math.round', 'ROUND'],
  ['Math.abs', 'ABS'], ['Math.pow', 'POW'], ['Math.max', 'MAX'],
  ['Math.min', 'MIN'], ['Math.cbrt', 'CBRT'], ['Math.hypot', 'HYPOT'],
  ['Math.sign', 'SIGN'], ['Math.trunc', 'TRUNC'], ['Math.expm1', 'EXPM1'],
  ['Math.log1p', 'LOG1P'], ['Math.fround', 'FROUND'], ['Math.clz32', 'CLZ32'],
  ['Math.imul', 'IMUL'], ['Math.random', 'RANDOM'],
];
const MATH_CONSTANTS = [
  ['Math.PI', 'PI'], ['Math.E', 'E'], ['Math.LN2', 'LN2'],
  ['Math.LN10', 'LN10'], ['Math.LOG2E', 'LOG2E'], ['Math.LOG10E', 'LOG10E'],
  ['Math.SQRT1_2', 'SQRT1_2'], ['Math.SQRT2', 'SQRT2'],
];

function esc(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

function fixFormula(expr) {
  let r = expr;
  for (const [math, bare] of MATH_FUNCTIONS) {
    r = r.replace(new RegExp(esc(math) + '\\s*\\(', 'g'), bare + '(');
  }
  for (const [math, bare] of MATH_CONSTANTS) {
    r = r.replace(new RegExp(esc(math), 'g'), bare);
  }
  r = r.replace(/\b([a-zA-Z_]\w*)\s*\*\*\s*2\b/g, '$1 * $1');
  r = r.replace(/\(([^()]+)\)\s*\*\*\s*2\b/g, '($1) * ($1)');
  r = r.replace(/\b([a-zA-Z_]\w*)\s*\*\*\s*(\d+(?:\.\d+)?)/g, 'POW($1, $2)');
  r = r.replace(/\(([^()]+)\)\s*\*\*\s*(\d+(?:\.\d+)?)/g, 'POW($1, $2)');
  r = r.replace(/\s*\*\*\s*/g, ' * ');
  return r;
}

const files = fs.readdirSync('generated/schemas').filter(f => f.endsWith('-schema.json'));
let totalFixed = 0, fileFixed = 0;

for (const f of files) {
  const content = fs.readFileSync('generated/schemas/' + f, 'utf8');
  const schema = JSON.parse(content);
  const formulas = schema.formulas;
  if (!formulas || typeof formulas !== 'object') continue;
  let changed = false;
  for (const key of Object.keys(formulas)) {
    const expr = formulas[key];
    if (typeof expr !== 'string' || !/Math\.|\*\*/.test(expr)) continue;
    const fixed = fixFormula(expr);
    if (fixed !== expr) { formulas[key] = fixed; changed = true; totalFixed++; }
  }
  if (changed) {
    fs.writeFileSync('generated/schemas/' + f, JSON.stringify(schema, null, 2) + '\n', 'utf8');
    fileFixed++;
  }
}

console.log('Fixed ' + totalFixed + ' formulas across ' + fileFixed + ' schemas');
