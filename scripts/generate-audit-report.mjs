import fs from 'fs';
import path from 'path';

const schemasDir = './src/lib/features/premium-schema/schemas';
const files = fs.readdirSync(schemasDir).filter(f => f.endsWith('.ts') && f !== 'index.ts');

const arrayIssues = [];
const unusedIssues = [];

for (const file of files) {
  const filePath = path.join(schemasDir, file);
  const content = fs.readFileSync(filePath, 'utf-8');

  // Find all inputs and note if they are arrays
  const inputMap = new Map();
  // We'll use a better regex or parsing.
  // Match each input block: `{ id: "...", ... }`
  const inputsBlockMatch = content.match(/inputs:\s*\[([\s\S]*?)\]\s*,?\s*(outputs|formulaPipeline|thresholds):/);
  if (inputsBlockMatch) {
     const inputsBlock = inputsBlockMatch[1];
     // Naive block splitting by '{ id:'
     const blocks = inputsBlock.split('{ id:').slice(1);
     for (const block of blocks) {
       const idMatch = block.match(/^\s*"([^"]+)"/);
       if (idMatch) {
         const id = idMatch[1];
         const isArray = block.includes('array: true');
         inputMap.set(id, isArray);
       }
     }
  }

  // Find formulas inputMap mappings
  const mappedInputs = new Set();
  const pipelineMatch = content.match(/formulaPipeline:\s*\[([\s\S]*?)\]/);
  if (pipelineMatch) {
    const pipelineStr = pipelineMatch[1];
    const mappingMatches = pipelineStr.matchAll(/:\s*"([^"]+)"/g);
    for (const match of mappingMatches) {
      mappedInputs.add(match[1]);
    }
  }
  
  const thresholdMatch = content.match(/thresholds:\s*\[([\s\S]*?)\]/);
  if (thresholdMatch) {
     const thresholdStr = thresholdMatch[1];
     const fieldMatches = thresholdStr.matchAll(/fieldId:\s*"([^"]+)"/g);
     for (const m of fieldMatches) {
       mappedInputs.add(m[1]);
     }
  }

  const unmapped = [];
  const arrayInputs = [];

  for (const [id, isArray] of inputMap.entries()) {
    if (!mappedInputs.has(id)) {
      unmapped.push(id);
    }
    if (isArray) {
      arrayInputs.push(id);
    }
  }

  if (arrayInputs.length > 0) {
     arrayIssues.push({ file, arrays: arrayInputs });
  }

  if (unmapped.length > 0) {
     unusedIssues.push({ file, unmapped });
  }
}

fs.writeFileSync('scripts/audit_results.json', JSON.stringify({ arrayIssues, unusedIssues }, null, 2));
