import fs from 'fs';
import path from 'path';

const dir = 'src/tools/generated';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.ts') && f !== 'index.ts');

let oneInputCount = 0;
for (const file of files) {
  const content = fs.readFileSync(path.join(dir, file), 'utf8');
  if (!content.includes('result: 0,')) {
    // It's a valid tool. Now check inputs.
    // Inputs are in the index.ts, not here, but we can check the Zod schema in the file!
    const zMatch = content.match(/z\.object\(\{([\s\S]*?)\}\);/);
    if (zMatch) {
      const fields = zMatch[1].split('z.').length - 1;
      if (fields <= 1) {
        oneInputCount++;
        console.log(`${file} has ${fields} inputs.`);
      }
    }
  }
}
console.log(`Valid tools with <= 1 input: ${oneInputCount}`);
