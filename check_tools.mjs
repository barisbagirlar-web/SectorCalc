import fs from 'fs';
import path from 'path';

const dir = 'src/tools/generated';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.ts') && f !== 'index.ts');

let zeroResultCount = 0;

for (const file of files) {
  const content = fs.readFileSync(path.join(dir, file), 'utf8');
  if (content.includes('result: 0,')) {
    zeroResultCount++;
  }
}
console.log(`Tools with result: 0 -> ${zeroResultCount}`);
