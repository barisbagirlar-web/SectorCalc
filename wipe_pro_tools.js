const fs = require('fs');
const path = require('path');

const schemasDir = path.join(__dirname, 'src/lib/premium-schema/schemas');
const calculatorsDir = path.join(__dirname, 'src/lib/premium-schema/calculators');

function emptySchemas() {
  if (!fs.existsSync(schemasDir)) return;
  const files = fs.readdirSync(schemasDir).filter(f => f.endsWith('.ts'));
  let count = 0;
  for (const file of files) {
    const filePath = path.join(schemasDir, file);
    let content = fs.readFileSync(filePath, 'utf-8');
    
    // Replace inputs array content with empty array
    content = content.replace(/inputs:\s*\[[\s\S]*?\],(?=\s*(outputs|rules|charts|ui|painStatement|id|name|sectorSlug|category))/g, 'inputs: [],');
    // For cases where inputs is the last property or followed by something else
    content = content.replace(/inputs:\s*\[[\s\S]*?\]/g, 'inputs: []');
    
    // Replace outputs array
    content = content.replace(/outputs:\s*\[[\s\S]*?\]/g, 'outputs: []');
    
    // Replace rules array
    content = content.replace(/rules:\s*\[[\s\S]*?\]/g, 'rules: []');
    
    // Replace charts array
    content = content.replace(/charts:\s*\[[\s\S]*?\]/g, 'charts: []');
    
    fs.writeFileSync(filePath, content, 'utf-8');
    count++;
  }
  console.log(`Emptied inputs/outputs/rules/charts for ${count} schemas.`);
}

function emptyCalculators() {
  if (!fs.existsSync(calculatorsDir)) return;
  const files = fs.readdirSync(calculatorsDir).filter(f => f.endsWith('.ts'));
  let count = 0;
  for (const file of files) {
    const filePath = path.join(calculatorsDir, file);
    let content = fs.readFileSync(filePath, 'utf-8');
    
    // Replace the body of the calculator function with returning empty output objects
    // It usually looks like:
    // export const calculateSomething = (inputs: any): any => { ... }
    // Or export function calculateSomething(inputs: any) { ... }
    // We will just try to wipe out the implementations or replace the whole file with a dummy stub
    
    // A simpler way: we just read the exported function name, and replace the file content.
    const match = content.match(/export\s+(const|function)\s+([a-zA-Z0-9_]+)/);
    if (match) {
        const funcName = match[2];
        const dummyContent = `// Implementation removed for rewrite\nexport const ${funcName} = (inputs: any) => {\n  return {\n    outputs: {},\n    rules: [],\n    charts: []\n  };\n};\n`;
        fs.writeFileSync(filePath, dummyContent, 'utf-8');
        count++;
    }
  }
  console.log(`Emptied formulas/calculations for ${count} calculators.`);
}

emptySchemas();
emptyCalculators();
