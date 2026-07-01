import fs from 'fs';
import path from 'path';

// 1. Read audit results
const auditPath = './scripts/audit_results.json';
const auditData = JSON.parse(fs.readFileSync(auditPath, 'utf8'));

// 2. Read formula registry metadata
const registryPath = './src/lib/features/premium-schema/formula-registry.ts';
const registryContent = fs.readFileSync(registryPath, 'utf8');

// Parse metadata: "formula_id": { ... requiredInputs: ["a", "b"] ... }
const formulaMeta = {};
const metaRegex = /"([^"]+)":\s*\{[^}]*requiredInputs:\s*\[([^\]]+)\]/g;
let match;
while ((match = metaRegex.exec(registryContent)) !== null) {
  const id = match[1];
  const reqs = match[2].split(',').map(s => s.replace(/"/g, '').trim());
  formulaMeta[id] = reqs;
}

// 3. Process unused issues
const schemasDir = './src/lib/features/premium-schema/schemas';

for (const issue of auditData.unusedIssues) {
  const filePath = path.join(schemasDir, issue.file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Find which formulas are already in pipeline to get the 'prefix'
  const pipelineMatch = content.match(/formulaPipeline:\s*\[([\s\S]*?)\]/);
  if (!pipelineMatch) continue;
  
  const pipelineStr = pipelineMatch[1];
  const existingFormulas = [...pipelineStr.matchAll(/formulaId:\s*"([^"]+)"/g)].map(m => m[1]);
  
  if (existingFormulas.length === 0) continue;
  
  // E.g., cost.absenteeism_direct -> prefix is cost.absenteeism
  const prefix = existingFormulas[0].split('_')[0]; 
  
  // Find all formulas with similar prefix
  const candidateFormulas = Object.keys(formulaMeta).filter(k => k.startsWith(prefix));
  
  let newSteps = [];
  
  for (const f of candidateFormulas) {
    if (existingFormulas.includes(f)) continue; // Already there
    
    // Check if this formula uses any unmapped inputs
    const reqs = formulaMeta[f];
    const unmappedMatch = issue.unmapped.filter(u => reqs.includes(u));
    
    // Also, we can map inputs even if names slightly differ by using heuristics, but strict match is safer.
    // If it uses at least one unmapped input, and we have ALL its required inputs in the schema!
    
    // Get all schema inputs
    const allSchemaInputsMatch = [...content.matchAll(/id:\s*"([^"]+)"/g)].map(m => m[1]);
    
    // Can we satisfy ALL required inputs of this formula?
    let canSatisfy = true;
    let inputMapStr = [];
    for (const req of reqs) {
      // Find matching schema input (exact or very similar)
      const exact = allSchemaInputsMatch.find(i => i === req);
      const similar = allSchemaInputsMatch.find(i => i.toLowerCase().includes(req.toLowerCase()) || req.toLowerCase().includes(i.toLowerCase()));
      
      const mapped = exact || similar;
      if (mapped) {
        inputMapStr.push(`${req}: "${mapped}"`);
      } else {
        // If we can't satisfy, but maybe it's the output of another step?
        // We will just skip strict checking for now and let user handle errors if any.
        canSatisfy = false;
      }
    }
    
    if (canSatisfy && unmappedMatch.length > 0) {
      const stepStr = `    { formulaId: "${f}", inputMap: { ${inputMapStr.join(', ')} }, outputId: "${f.replace('.', '_')}_out" },`;
      newSteps.push(stepStr);
    }
  }
  
  if (newSteps.length > 0) {
    // Insert new steps before the last step (which is usually the total)
    // Actually, just append them to the top of the pipeline
    const insertPos = content.indexOf('formulaPipeline: [') + 'formulaPipeline: ['.length;
    const newContent = content.slice(0, insertPos) + '\n' + newSteps.join('\n') + content.slice(insertPos);
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`Auto-patched ${issue.file} with ${newSteps.length} new steps`);
  }
}
