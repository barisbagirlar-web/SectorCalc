import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---------- Yardımcı fonksiyonlar (güvenli) ----------
function toSafeVarName(str: string): string {
  if (typeof str !== 'string') return 'unknown';
  return str.replace(/[^a-zA-Z0-9]/g, '_').replace(/^(\d)/, '_$1');
}

function toSafePascalCase(str: string): string {
  const safe = toSafeVarName(str);
  return safe.charAt(0).toUpperCase() + safe.slice(1);
}

function normalizeAscii(str: any): string {
  if (typeof str !== 'string') return '';
  const map: Record<string, string> = {
    ğ: 'g', Ğ: 'G', ü: 'u', Ü: 'U', ş: 's', Ş: 'S',
    ı: 'i', İ: 'I', ö: 'o', Ö: 'O', ç: 'c', Ç: 'C',
  };
  return str.replace(/[ğĞüÜşŞıİöÖçÇ]/g, (ch) => map[ch] ?? ch);
}

function ensureString(val: any, defaultValue: string = ''): string {
  if (typeof val === 'string') return val;
  if (val && typeof val === 'object') {
    // Önce 'en' dilini dene, yoksa ilk değeri al
    if (val.en) return val.en;
    const firstKey = Object.keys(val)[0];
    return firstKey ? String(val[firstKey]) : defaultValue;
  }
  return defaultValue;
}

function extractPrimaryFormulaKey(schema: any): string {
  const primary = schema.outputs?.primary;
  if (typeof primary === 'string') {
    const match = primary.match(/^([A-Za-z0-9_]+)/);
    return match ? match[1] : 'total';
  }
  return 'total';
}

// ---------- Zod şeması üret ----------
function generateZodSchema(inputs: any[]): string {
  const shape: string[] = [];
  for (const input of inputs) {
    const id = input.id;
    const safeId = toSafeVarName(id);
    const type = input.type;
    if (type === 'number') {
      let zod = `z.number()`;
      if (typeof input.min === 'number') zod += `.min(${input.min})`;
      if (typeof input.max === 'number') zod += `.max(${input.max})`;
      if (input.default !== undefined && typeof input.default === 'number') zod += `.default(${input.default})`;
      shape.push(`  ${safeId}: ${zod},`);
    } else if (type === 'select' && Array.isArray(input.options)) {
      let zod = `z.enum([${input.options.map((o: string) => `'${o.replace(/'/g, "\\'")}'`).join(', ')}])`;
      if (input.default !== undefined) zod += `.default('${input.default}')`;
      shape.push(`  ${safeId}: ${zod},`);
    } else if (type === 'boolean') {
      let zod = `z.boolean()`;
      if (input.default !== undefined) zod += `.default(${input.default})`;
      shape.push(`  ${safeId}: ${zod},`);
    } else {
      // bilinmeyen tip -> string
      shape.push(`  ${safeId}: z.string().default(''),`);
    }
  }
  return `z.object({\n${shape.join('\n')}\n})`;
}

// ---------- TypeScript interface ----------
function generateTypeInterface(inputs: any[], toolName: string): string {
  const fields: string[] = [];
  for (const input of inputs) {
    const id = toSafeVarName(input.id);
    let tsType = 'any';
    const type = input.type;
    if (type === 'number') tsType = 'number';
    else if (type === 'select') tsType = 'string';
    else if (type === 'boolean') tsType = 'boolean';
    else tsType = 'string';
    fields.push(`  ${id}: ${tsType};`);
  }
  return `export interface ${toSafePascalCase(toolName)}Input {\n${fields.join('\n')}\n}`;
}

// ---------- Output interface ----------
function generateOutputType(schema: any, toolName: string): string {
  const breakdownKeys = Object.keys(schema.outputs?.breakdown || {});
  const hiddenDrivers = schema.outputs?.hiddenLossDrivers ? 'string[]' : 'string[]';
  const suggestedActions = schema.outputs?.suggestedActions ? 'string[]' : 'string[]';
  return `
export interface ${toSafePascalCase(toolName)}Output {
  totalWasteCost: number;
  breakdown: { ${breakdownKeys.map(k => `${k}: number`).join('; ')} };
  hiddenLossDrivers: ${hiddenDrivers};
  suggestedActions: ${suggestedActions};
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}`;
}

// ---------- Formül değerlendirici ----------
function generateFormulaEvaluator(formulas: Record<string, string>, inputs: any[]): string {
  const formulaLines: string[] = [];
  for (const [key, expr] of Object.entries(formulas)) {
    let jsExpr = expr;
    for (const inp of inputs) {
      const oldId = inp.id;
      const newId = toSafeVarName(oldId);
      const regex = new RegExp(`\\b${oldId}\\b`, 'g');
      jsExpr = jsExpr.replace(regex, `input.${newId}`);
    }
    // güvenlik: try-catch ile sar
    formulaLines.push(`  ${key}: (input: any) => {
    try { return ${jsExpr}; } catch { return 0; }
  },`);
  }
  return `const formulas = {\n${formulaLines.join('\n')}\n};`;
}

// ---------- Ana hesaplama fonksiyonu ----------
function generateCalculateFunction(schema: any, toolName: string): string {
  const primaryKey = extractPrimaryFormulaKey(schema);
  const breakdownKeys = Object.keys(schema.outputs?.breakdown || {});
  const hiddenDrivers = schema.outputs?.hiddenLossDrivers || [];
  const suggestedActions = schema.outputs?.suggestedActions || [];
  return `
export function calculate${toSafePascalCase(toolName)}(input: ${toSafePascalCase(toolName)}Input): ${toSafePascalCase(toolName)}Output {
  const values = formulas;
  const totalWasteCost = values.${primaryKey} ? values.${primaryKey}(input) : 0;
  const breakdown = {
    ${breakdownKeys.map(k => `${k}: values.${k} ? values.${k}(input) : 0`).join(',\n    ')}
  };
  const hiddenLossDrivers: string[] = ${JSON.stringify(hiddenDrivers)};
  const suggestedActions: string[] = ${JSON.stringify(suggestedActions)};
  const dataConfidenceAdjusted = input.dataConfidence ? totalWasteCost * (input.dataConfidence / 100) : totalWasteCost;
  return {
    totalWasteCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: ${schema.premiumRequired === true},
    premiumFeatures: ${JSON.stringify(schema.premiumFeatures || [])},
  };
}`;
}

// ---------- Ana işlem ----------
export function generateFromSchemaFile(schemaPath: string, outPath: string) {
  const raw = fs.readFileSync(schemaPath, 'utf-8');
  const schema = JSON.parse(raw);
  const toolName = schema.toolName || path.basename(schemaPath, '-schema.json');
  const inputs = schema.inputs || [];

  // Inputlardaki string alanları normalize et
  for (const inp of inputs) {
    inp.label = ensureString(inp.label, inp.id);
    inp.businessContext = ensureString(inp.businessContext, '');
    if (inp.unit && typeof inp.unit !== 'string') inp.unit = '';
  }

  const content = `// Auto-generated from ${path.basename(schemaPath)}
import * as z from 'zod';

${generateTypeInterface(inputs, toolName)}

export const ${toSafePascalCase(toolName)}InputSchema = ${generateZodSchema(inputs)};

${generateFormulaEvaluator(schema.formulas || {}, inputs)}

${generateCalculateFunction(schema, toolName)}

${generateOutputType(schema, toolName)}
`;
  fs.writeFileSync(outPath, content);
  console.log(`✅ Generated ${outPath}`);
}

// ---------- CLI desteği ----------
function main() {
  const args = process.argv.slice(2);
  const schemaPathArg = args.find(a => a.startsWith('--schema='));
  if (!schemaPathArg) {
    console.error('Usage: npm run generate:tool -- --schema=<path-to-schema.json>');
    process.exit(1);
  }
  const schemaPath = schemaPathArg.split('=')[1];
  if (!fs.existsSync(schemaPath)) {
    console.error(`Schema not found: ${schemaPath}`);
    process.exit(1);
  }
  const toolName = path.basename(schemaPath, '-schema.json');
  const outDir = path.join(process.cwd(), 'generated');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, `${toolName}.ts`);
  generateFromSchemaFile(schemaPath, outPath);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
