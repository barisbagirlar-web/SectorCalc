import fs from 'fs';
import path from 'path';

const schemasDir = './src/lib/features/premium-schema/schemas';
const files = fs.readdirSync(schemasDir).filter(f => f.endsWith('.ts') && f !== 'index.ts');

console.log(`Auditing ${files.length} premium schemas...`);

let issues = 0;

for (const file of files) {
  const filePath = path.join(schemasDir, file);
  const content = fs.readFileSync(filePath, 'utf-8');

  // We can do a quick AST check or just regex if it's simple enough.
  // Actually, better to use node to import them, but we are in ESM/TS.
  // Let's just find the `inputs:` and `formulaPipeline:` strings.
}
