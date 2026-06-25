import fs from 'fs';

let pSchema = fs.readFileSync('src/data/premium-schema-i18n.ts', 'utf8');
pSchema = pSchema.replace(/const TR_SCHEMAS: Record<string, LocalizedPremiumSchema> = \{[\s\S]*?\};/, 'const TR_SCHEMAS: Record<string, LocalizedPremiumSchema> = {};');
fs.writeFileSync('src/data/premium-schema-i18n.ts', pSchema, 'utf8');

let revTools = fs.readFileSync('src/data/revenue-tools-i18n.ts', 'utf8');
revTools = revTools.replace(/const TR_PAID_TITLES: Record<string, string> = \{[\s\S]*?\};/, 'const TR_PAID_TITLES: Record<string, string> = {};');
fs.writeFileSync('src/data/revenue-tools-i18n.ts', revTools, 'utf8');

console.log('Cleared TR schemas from overrides.');
