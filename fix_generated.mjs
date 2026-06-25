import fs from 'fs';
import path from 'path';

const dir = 'src/tools/generated';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.ts') && f !== 'index.ts');

const validIds = new Set();
let deletedCount = 0;

for (const file of files) {
  const content = fs.readFileSync(path.join(dir, file), 'utf8');
  if (content.includes('result: 0,')) {
    fs.unlinkSync(path.join(dir, file));
    deletedCount++;
  } else {
    // Extract ID (e.g. from ID: PRO_003)
    const idMatch = content.match(/ID:\s*([A-Z0-9_]+)/);
    if (idMatch) {
      validIds.add(idMatch[1]);
    }
  }
}
console.log(`Deleted ${deletedCount} broken files. Kept ${validIds.size} valid files.`);

const indexPath = path.join(dir, 'index.ts');
const indexContent = fs.readFileSync(indexPath, 'utf8');

// The index file exports a `generatedTools` array.
// Let's parse it manually or just use string manipulation.
// It has `import { execute_PRO_xxx } from "./pro_xxx";` lines at the top.
const lines = indexContent.split('\n');
const newLines = [];
let inGeneratedTools = false;
let currentToolId = null;
let currentToolBuffer = [];
const finalToolsArray = [];

for (const line of lines) {
  if (line.startsWith('import { execute_')) {
    const importMatch = line.match(/import\s+{\s*execute_([A-Z0-9_]+)\s*}/);
    if (importMatch && !validIds.has(importMatch[1])) {
      continue; // Skip import for deleted tool
    }
    newLines.push(line);
  } else if (line.trim() === 'export const generatedTools = [') {
    inGeneratedTools = true;
    newLines.push(line);
  } else if (inGeneratedTools) {
    if (line.trim() === '];') {
      inGeneratedTools = false;
      // Write the remaining valid tools
      newLines.push(finalToolsArray.join(',\n'));
      newLines.push(line);
    } else {
      if (line.includes('{') && line.includes('id: "')) {
        const idMatch = line.match(/id:\s*"([A-Z0-9_]+)"/);
        if (idMatch) {
          if (currentToolBuffer.length > 0) {
            if (validIds.has(currentToolId)) {
              finalToolsArray.push(currentToolBuffer.join('\n'));
            }
            currentToolBuffer = [];
          }
          currentToolId = idMatch[1];
        }
      }
      currentToolBuffer.push(line);
    }
  } else {
    newLines.push(line);
  }
}

// Don't forget the last tool
if (currentToolBuffer.length > 0 && currentToolId && validIds.has(currentToolId)) {
  // Remove trailing comma from last tool if needed, or just let JS handle it
  // Wait, the original format separates by comma.
  // We'll join by ",\n" later
}

if (currentToolBuffer.length > 0 && currentToolId && validIds.has(currentToolId)) {
  let joined = currentToolBuffer.join('\n');
  if (joined.trim().endsWith(',')) {
    joined = joined.substring(0, joined.lastIndexOf(','));
  }
  finalToolsArray.push(joined);
}

fs.writeFileSync(indexPath, newLines.join('\n'), 'utf8');
console.log('index.ts updated.');

