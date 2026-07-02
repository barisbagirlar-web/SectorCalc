const fs = require('fs');
const path = require('path');

const contractsFile = 'src/lib/features/formula-governance/contracts.ts';
let content = fs.readFileSync(contractsFile, 'utf8');

const lines = content.split('\n');
const existingFiles = fs.readdirSync('src/lib/features/formula-governance/contracts').map(f => f.replace('.ts', ''));

const validLines = [];
const removedVars = new Set();

for (const line of lines) {
  let skip = false;
  
  if (line.includes('import {') && line.includes('} from "') && line.includes('contracts/')) {
    const match = line.match(/contracts\/([^"]+)"/);
    if (match) {
      const fileBase = match[1];
      if (!existingFiles.includes(fileBase)) {
        console.log('Removing import for missing file:', fileBase);
        
        // Extract variable name
        const varMatch = line.match(/import \{ ([A-Z0-9_]+) \}/);
        if (varMatch) {
           removedVars.add(varMatch[1]);
        }
        skip = true;
      }
    }
  }
  
  if (!skip) {
    validLines.push(line);
  }
}

const finalLines = [];
for (const line of validLines) {
  let skip = false;
  if (line.trim().startsWith('...')) {
    const match = line.match(/\.\.\.([A-Z0-9_]+)/);
    if (match) {
      const varName = match[1];
      if (removedVars.has(varName)) {
         console.log('Removing spread for removed variable:', varName);
         skip = true;
      }
    }
  }
  if (!skip) {
    finalLines.push(line);
  }
}

fs.writeFileSync(contractsFile, finalLines.join('\n'));
