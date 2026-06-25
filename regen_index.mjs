import fs from 'fs';
import path from 'path';

const dir = 'src/tools/generated';
const files = fs.readdirSync(dir).filter(f => f.startsWith('fin_') && f.endsWith('.ts'));

let imports = '';
let arrayItems = '';

files.sort().forEach(f => {
  const baseName = f.replace('.ts', '');
  imports += `import { execute_${baseName} } from './${baseName}';\n`;
  arrayItems += `  execute_${baseName},\n`;
});

const content = `${imports}\nexport const generatedTools = [\n${arrayItems}];\n`;

fs.writeFileSync(path.join(dir, 'index.ts'), content, 'utf8');
console.log(`Generated index.ts with ${files.length} tools`);
