const fs = require('fs');
const path = require('path');

const filesToFix = [
  'src/lib/i18n/locale-glossary.ts',
  'src/lib/locale-center/locale-config.ts',
  'src/lib/locale-center/unit-currency-center.ts',
  'src/lib/regional/regions.ts',
  'src/lib/units/locale-unit-defaults.ts',
  'src/lib/seo/global-seo-config.ts',
  'src/lib/i18n/seven-muda-rev5-labels.ts',
  'src/lib/premium-schema/premium-report-export.ts',
  'src/lib/tools/runtime-readiness.ts'
];

for (const file of filesToFix) {
  const filePath = path.join(process.cwd(), file);
  if (!fs.existsSync(filePath)) continue;
  
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Remove tr:, de:, fr:, es:, ar: lines from objects
  content = content.replace(/^\s*(tr|de|fr|es|ar):\s*.*,?\r?\n/gm, '');
  
  // Remove string literal unions like | "tr" | "de"
  content = content.replace(/\|\s*["'](?:tr|de|fr|es|ar)["']/g, '');
  
  // Remove equality checks like locale === 'tr' (replace with false to keep syntax valid)
  content = content.replace(/locale\s*===\s*['"](?:tr|de|fr|es|ar)['"]/g, 'false');

  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`Stripped locales from ${file}`);
}
