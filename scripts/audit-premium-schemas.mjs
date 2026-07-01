import fs from 'fs';
import path from 'path';

const schemasDir = './src/lib/features/premium-schema/schemas';
const files = fs.readdirSync(schemasDir).filter(f => f.endsWith('.ts') && f !== 'index.ts');

console.log(`Auditing ${files.length} premium schemas for disconnected inputs...`);

let disconnectedCount = 0;

for (const file of files) {
  const filePath = path.join(schemasDir, file);
  const content = fs.readFileSync(filePath, 'utf-8');

  // Find all inputs
  const inputIds = [];
  const inputMatches = content.matchAll(/id:\s*"([^"]+)"/g);
  for (const match of inputMatches) {
    inputIds.push(match[1]);
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
    
    // Also thresholds might use inputs directly
    const thresholdMatch = content.match(/thresholds:\s*\[([\s\S]*?)\]/);
    if (thresholdMatch) {
       const thresholdStr = thresholdMatch[1];
       const fieldMatches = thresholdStr.matchAll(/fieldId:\s*"([^"]+)"/g);
       for (const m of fieldMatches) {
         mappedInputs.add(m[1]);
       }
    }

    const unmapped = [];
    // Only check first 20 inputs as outputs etc also have ids
    // Let's accurately parse inputs block
    const inputsBlockMatch = content.match(/inputs:\s*\[([\s\S]*?)\]\s*,?\s*outputs:/);
    if (inputsBlockMatch) {
       const inputsBlock = inputsBlockMatch[1];
       const blockInputIds = [];
       const idRegex = /id:\s*"([^"]+)"/g;
       let m;
       while ((m = idRegex.exec(inputsBlock)) !== null) {
         blockInputIds.push(m[1]);
       }
       
       for (const id of blockInputIds) {
         if (!mappedInputs.has(id)) {
           unmapped.push(id);
         }
       }

       if (unmapped.length > 0) {
         console.log(`[DISCONNECTED] ${file}: ${unmapped.join(', ')}`);
         disconnectedCount++;
       }
    }
  }
}

console.log(`\nFound ${disconnectedCount} schemas with disconnected form inputs.`);
