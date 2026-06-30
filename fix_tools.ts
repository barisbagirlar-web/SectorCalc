import fs from 'fs';
import path from 'path';

const formulaRegistryPath = path.join(process.cwd(), 'src/lib/features/premium-schema/formula-registry.ts');
const schemasDirPath = path.join(process.cwd(), 'src/lib/features/premium-schema/schemas');

const registryContent = fs.readFileSync(formulaRegistryPath, 'utf8');

const requiredInputsMap: Record<string, string[]> = {};
const regex = /"([a-zA-Z0-9_.-]+)":\s*\{\s*description:.*?,.*?(?:requiredInputs|inputs):\s*\[(.*?)\]/gs;

let match;
while ((match = regex.exec(registryContent)) !== null) {
  const formulaId = match[1];
  const inputsStr = match[2];
  const inputs = inputsStr.split(',').map(s => s.replace(/"/g, '').replace(/'/g, '').trim()).filter(s => s);
  requiredInputsMap[formulaId] = inputs;
}

const files = fs.readdirSync(schemasDirPath).filter(f => f.endsWith('.ts') && f !== 'index.ts' && f !== 'industrial-formulas-schemas.ts');

for (const file of files) {
  const filePath = path.join(schemasDirPath, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Extract all schema inputs
  const inputsRegex = /inputs:\s*\[([\s\S]*?)\],\s*outputs:/g;
  const inputsMatch = inputsRegex.exec(content);
  let schemaInputs: string[] = [];
  if (inputsMatch) {
    const idsMatch = [...inputsMatch[1].matchAll(/id:\s*"([^"]+)"/g)];
    schemaInputs = idsMatch.map(m => m[1]);
  }

  // Extract all schema outputs
  const outputsRegex = /outputs:\s*\[([\s\S]*?)\],\s*(?:thresholds|formulaPipeline):/g;
  const outputsMatch = outputsRegex.exec(content);
  let schemaOutputs: string[] = [];
  if (outputsMatch) {
    const idsMatch = [...outputsMatch[1].matchAll(/id:\s*"([^"]+)"/g)];
    schemaOutputs = idsMatch.map(m => m[1]);
  }
  
  const allAvailable = [...schemaInputs, ...schemaOutputs];

  const pipelineRegex = /formulaPipeline:\s*\[([\s\S]*?)\]\s*,(\s*reportTemplate)/g;
  const pipelineMatch = pipelineRegex.exec(content);
  
  if (pipelineMatch) {
    const pipelineStr = pipelineMatch[1];
    let newPipelineStr = pipelineStr;
    
    const stepRegex = /\{\s*formulaId:\s*"([^"]+)",\s*inputMap:\s*\{([^}]+)\}/g;
    let stepMatch;
    
    while ((stepMatch = stepRegex.exec(pipelineStr)) !== null) {
      const fullStep = stepMatch[0];
      const formulaId = stepMatch[1];
      const inputMapStr = stepMatch[2];
      
      const mappedKeys = [];
      const mappedValues = [];
      const kvRegex = /([a-zA-Z0-9_]+)\s*:\s*"([^"]+)"/g;
      let kvMatch;
      while ((kvMatch = kvRegex.exec(inputMapStr)) !== null) {
        mappedKeys.push(kvMatch[1]);
        mappedValues.push(kvMatch[2]);
      }
      
      const requiredInputs = requiredInputsMap[formulaId] || [];
      const missing = requiredInputs.filter(req => !mappedKeys.includes(req));
      
      let newInputMapStr = inputMapStr;
      
      for (const req of missing) {
        // Try to find a matching input in schema
        let bestMatch = '';
        if (allAvailable.includes(req)) bestMatch = req;
        else if (allAvailable.includes(req + 'Input')) bestMatch = req + 'Input';
        else {
           // check if any available input contains the required string or vice versa
           for (const a of allAvailable) {
              if (a.toLowerCase() === req.toLowerCase()) { bestMatch = a; break; }
           }
        }
        
        if (bestMatch) {
          // Add to input map
          if (newInputMapStr.trim().endsWith(',')) {
             newInputMapStr += `\n        ${req}: "${bestMatch}",`;
          } else {
             newInputMapStr += `,\n        ${req}: "${bestMatch}"`;
          }
        } else {
          // If we can't find a matching schema input, just inject the same name so the registry can handle it with fallbacks
          if (newInputMapStr.trim().endsWith(',')) {
             newInputMapStr += `\n        ${req}: "${req}",`;
          } else {
             newInputMapStr += `,\n        ${req}: "${req}"`;
          }
        }
      }
      
      const newFullStep = fullStep.replace(inputMapStr, newInputMapStr);
      newPipelineStr = newPipelineStr.replace(fullStep, newFullStep);
    }
    
    if (newPipelineStr !== pipelineStr) {
      content = content.replace(pipelineStr, newPipelineStr);
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated ${file}`);
    }
  }
}
