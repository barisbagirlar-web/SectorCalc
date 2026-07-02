const fs = require('fs');
const path = require('path');

const contractsFile = 'src/lib/features/formula-governance/contracts.ts';
let content = fs.readFileSync(contractsFile, 'utf8');

const lines = content.split('\n');
const existingFiles = fs.readdirSync('src/lib/features/formula-governance/contracts').map(f => f.replace('.ts', ''));

const newLines = lines.filter(line => {
  if (line.includes('import {') && line.includes('} from "') && line.includes('contracts/')) {
    const match = line.match(/contracts\/([^"]+)"/);
    if (match) {
      const fileBase = match[1];
      if (!existingFiles.includes(fileBase)) {
        console.log('Removing import for missing file:', fileBase);
        return false;
      }
    }
  }
  
  // also remove the ...SPREAD_CONTRACTS line if the import is missing
  if (line.trim().startsWith('...')) {
    const match = line.match(/\.\.\.([A-Z0-9_]+)/);
    if (match) {
      const varName = match[1];
      // Check if varName is imported
      const isImported = newLines.some(l => l.includes(`import { ${varName} }`) || l.includes(`import { ${varName},`));
      // But wait, newLines doesn't have the current line yet. 
      // Let's just do a naive check if the variable is defined anywhere in the file.
      // Better to check the whole content.
      const varIsImportedOrDefined = lines.some(l => l.includes(`import { ${varName}`) || l.includes(`const ${varName}`));
      
      // wait, actually if we removed the import, it won't be defined.
      // I'll just check if the variable is in the remaining imports.
    }
  }
  return true;
});

// Second pass to remove ...SPREAD if not imported
const finalLines = newLines.filter(line => {
  if (line.trim().startsWith('...')) {
    const match = line.match(/\.\.\.([A-Z0-9_]+)/);
    if (match) {
      const varName = match[1];
      const isImported = newLines.some(l => l.includes(`import { ${varName}`));
      if (!isImported && varName !== 'TOP_CRITICAL_FORMULA_CONTRACTS') {
         console.log('Removing spread for missing import:', varName);
         return false;
      }
    }
  }
  return true;
});

fs.writeFileSync(contractsFile, finalLines.join('\n'));
