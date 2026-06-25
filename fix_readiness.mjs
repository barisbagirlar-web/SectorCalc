import fs from 'fs';

const p = 'src/lib/tools/runtime-readiness.ts';
let content = fs.readFileSync(p, 'utf8');

if (!content.includes('import { generatedTools }')) {
  content = content.replace(
    'import { normalizeLocale } from "@/lib/format/localization";',
    'import { normalizeLocale } from "@/lib/format/localization";\nimport { generatedTools } from "@/tools/generated";'
  );
}

content = content.replace(
  'function hasFormulaContract(slug: string): boolean {',
  `function hasFormulaContract(slug: string): boolean {\n  if (generatedTools.some(t => t.freeSlug === slug || t.paidSlug === slug)) return true;`
);

fs.writeFileSync(p, content, 'utf8');
console.log('Fixed runtime-readiness.ts');
