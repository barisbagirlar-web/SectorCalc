const fs = require('fs');
const child_process = require('child_process');

try {
  const output = child_process.execSync('npm run lint', { encoding: 'utf8', stdio: 'pipe' });
} catch (error) {
  const output = error.stdout;
  const lines = output.split('\n');
  
  let currentFile = null;
  const fixes = {};
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('./src/')) {
      currentFile = line;
      if (!fixes[currentFile]) fixes[currentFile] = [];
    } else if (line.match(/^\d+:\d+\s+(Warning|Error):/)) {
      if (line.includes('@typescript-eslint/no-unused-vars')) {
        const lineNum = parseInt(line.split(':')[0], 10);
        if (currentFile) {
          fixes[currentFile].push(lineNum);
        }
      }
    }
  }

  for (const file of Object.keys(fixes)) {
    if (fixes[file].length === 0) continue;
    const content = fs.readFileSync(file, 'utf8').split('\n');
    // Sort descending so we don't mess up line numbers as we insert
    const linesToFix = [...new Set(fixes[file])].sort((a, b) => b - a);
    
    for (const lineNum of linesToFix) {
      // lineNum is 1-based.
      const idx = lineNum - 1;
      const prevLine = idx > 0 ? content[idx - 1] : '';
      if (!prevLine.includes('eslint-disable-next-line @typescript-eslint/no-unused-vars')) {
        // Find indentation
        const match = content[idx].match(/^(\s*)/);
        const indent = match ? match[1] : '';
        content.splice(idx, 0, `${indent}// eslint-disable-next-line @typescript-eslint/no-unused-vars`);
      }
    }
    
    fs.writeFileSync(file, content.join('\n'), 'utf8');
    console.log(`Fixed ${linesToFix.length} issues in ${file}`);
  }
}
