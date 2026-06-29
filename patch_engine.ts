import fs from 'fs';

const filePath = 'src/lib/premium-schema/premium-schema-engine.ts';
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace(
  /export { runPremiumSchemaEngine };/g,
  'export { runPremiumSchemaEngine, type SchemaInputValues };'
);

fs.writeFileSync(filePath, content);
