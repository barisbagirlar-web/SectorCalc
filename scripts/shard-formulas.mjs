import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.join(__dirname, '..');

const INPUT_FILE = path.join(ROOT, 'src/lib/premium-schema/user-premium-formulas.ts');
const OUTPUT_DIR = path.join(ROOT, 'src/lib/premium-schema/formulas');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const content = fs.readFileSync(INPUT_FILE, 'utf-8');

// The file structure has a header (imports and helpers), then the array, then the metadata.
// Find where the array starts and ends.
const arrayStartMarker = 'export const USER_FORMULA_DEFINITIONS: readonly FormulaDefinition[] = [';
const arrayStartIdx = content.indexOf(arrayStartMarker);
if (arrayStartIdx === -1) {
  console.error("Could not find array start marker.");
  process.exit(1);
}

const arrayEndMarker = '];\n\nexport const USER_FORMULA_META_DETAILS';
const arrayEndIdx = content.indexOf(arrayEndMarker, arrayStartIdx);
if (arrayEndIdx === -1) {
  console.error("Could not find array end marker.");
  process.exit(1);
}

const header = content.substring(0, arrayStartIdx).trim();
const metadataSection = content.substring(arrayEndIdx + 2).trim();

const arrayContent = content.substring(arrayStartIdx + arrayStartMarker.length, arrayEndIdx).trim();

// We need to carefully split by the formula blocks.
// They look like:
//   {
//     id: "...",
//     ...
//   },
// We can split by regex `\n  },\n  {` but we have to be careful with trailing commas.
// Let's use a simpler heuristic: find all `  {\n    id: "user.` to locate the start of each formula.

const formulaStarts = [];
const startRegex = /^\s*\{\s*id:\s*"user\./gm;
let match;
while ((match = startRegex.exec(arrayContent)) !== null) {
  formulaStarts.push(match.index);
}

if (formulaStarts.length === 0) {
  console.error("Found 0 formulas!");
  process.exit(1);
}

console.log(`Found ${formulaStarts.length} formulas to shard.`);

const formulas = [];
for (let i = 0; i < formulaStarts.length; i++) {
  const start = formulaStarts[i];
  const end = i < formulaStarts.length - 1 ? formulaStarts[i + 1] : arrayContent.length;
  let formulaBlock = arrayContent.substring(start, end).trim();
  
  // Remove trailing comma from the last element if it exists so we can re-join safely
  if (formulaBlock.endsWith(',')) {
    formulaBlock = formulaBlock.substring(0, formulaBlock.length - 1);
  }
  formulas.push(formulaBlock);
}

// Group into chunks of 15 formulas each
const CHUNK_SIZE = 15;
const chunks = [];
for (let i = 0; i < formulas.length; i += CHUNK_SIZE) {
  chunks.push(formulas.slice(i, i + CHUNK_SIZE));
}

console.log(`Created ${chunks.length} chunks.`);

const chunkNames = [];

chunks.forEach((chunk, index) => {
  const chunkName = `chunk-${String(index + 1).padStart(2, '0')}`;
  chunkNames.push(chunkName);
  
  const chunkContent = `import type {
  FormulaDefinition,
  FormulaInputs,
} from "@/lib/premium-schema/formula-registry";

// Helper functions (mirrored from user-premium-formulas.ts)
function num(inputs: FormulaInputs, key: string, fallback = 0): number {
  const value = inputs[key];
  return Number.isFinite(typeof value === "number" ? value : Number(value))
    ? value
    : fallback;
}

function assertFinite(value: number, fallback = 0): number {
  return Number.isFinite(value) ? value : fallback;
}

function nonNegative(value: number): number {
  return assertFinite(Math.max(0, value));
}

function SUM<T>(_xs: T): number { return 0; }

function tVal(inputs: FormulaInputs, key: string, t: number, fallback = 0): number {
  const raw = inputs[key];
  if (Array.isArray(raw) && raw.length > t) {
    const v = Number(raw[t]);
    return Number.isFinite(v) ? v : fallback;
  }
  return typeof raw === "number" ? raw : fallback;
}

function normStd(x: number): number {
  const b0 = 0.2316419, b1 = 0.319381530, b2 = -0.356563782;
  const b3 = 1.781477937, b4 = -1.821255978, b5 = 1.330274429;
  const t = 1 / (1 + b0 * Math.abs(x));
  const poly = t * (b1 + t * (b2 + t * (b3 + t * (b4 + t * b5))));
  const cdf = 1 - poly * Math.exp(-x * x / 2);
  return x >= 0 ? cdf : 1 - cdf;
}

function normSInv(p: number): number {
  if (p <= 0) return -6;
  if (p >= 1) return 6;
  const a = [-3.969683028665376e+1, 2.209460984245205e+2,
    -2.759285104469687e+2, 1.383577518672690e+2,
    -3.066479806614716e+1, 2.506628277459239e+0];
  const b = [-5.447609879822406e+1, 1.615858368580409e+2,
    -1.556989798598866e+2, 6.680131188771972e+1,
    -1.328068155288572e+1];
  const c = [-7.784894002430293e-3, -3.223964580411365e-1,
    -2.400758277161838e+0, -2.549732539343734e+0,
    4.374664141464968e+0, 2.938163982698783e+0];
  const d = [7.784695709041462e-3, 3.224671290700398e-1,
    2.445134137142996e+0, 3.754408661907416e+0];
  
  const q = p - 0.5;
  if (Math.abs(q) <= 0.425) {
    const r = 0.180625 - q * q;
    return q * (((((a[5] * r + a[4]) * r + a[3]) * r + a[2]) * r + a[1]) * r + a[0]) /
      (((((b[4] * r + b[3]) * r + b[2]) * r + b[1]) * r + b[0]) * r + 1);
  }
  const r = q < 0 ? p : 1 - p;
  if (r <= 0) return q < 0 ? -6 : 6;
  const rSqrt = Math.sqrt(-2 * Math.log(r));
  const z = (((((c[5] * rSqrt + c[4]) * rSqrt + c[3]) * rSqrt + c[2]) * rSqrt + c[1]) * rSqrt + c[0]) /
    ((((d[3] * rSqrt + d[2]) * rSqrt + d[1]) * rSqrt + d[0]) * rSqrt + 1);
  return q < 0 ? -z : z;
}

// @ts-expect-error TS2590 - chunk to avoid OOM
export const ${chunkName.replace('-', '_').toUpperCase()}_DEFINITIONS: readonly FormulaDefinition[] = [
  ${chunk.join(',\n  ')}
];
`;
  fs.writeFileSync(path.join(OUTPUT_DIR, chunkName + '.ts'), chunkContent, 'utf-8');
});

// Now rewrite the main file to act as an index
const importStatements = chunkNames.map(name => {
  const varName = name.replace('-', '_').toUpperCase() + '_DEFINITIONS';
  return 'import { ' + varName + ' } from "./formulas/' + name + '";';
}).join('\n');

const spreadStatements = chunkNames.map(name => {
  return '  ...' + name.replace('-', '_').toUpperCase() + '_DEFINITIONS';
}).join(',\n');

const indexContent = header + '\n\n' +
  importStatements + '\n\n' +
  '// @ts-expect-error TS2590 - combined array\n' +
  'export const USER_FORMULA_DEFINITIONS: readonly FormulaDefinition[] = [\n' +
  spreadStatements + '\n' +
  '];\n\n' +
  metadataSection + '\n';

fs.writeFileSync(INPUT_FILE, indexContent, 'utf-8');

console.log("Sharding complete. Updated user-premium-formulas.ts to act as an index.");
