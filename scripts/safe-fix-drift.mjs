import { readFileSync, writeFileSync } from 'fs';

const logFile = readFileSync('build_errors.log', 'utf8');
const lines = logFile.split('\n');

const driftErrors = lines.filter(line => line.includes('UNUSED_DECLARED_INPUT') || line.includes('DECLARED_UNUSED_OUTPUT'));

const fileModifications = {};

for (const line of driftErrors) {
  const match = line.match(/Input=([^ ]+).*File=(.*\.ts)$/);
  const matchOutput = line.match(/Output=([^ ]+).*File=(.*\.ts)$/);
  
  if (match && line.includes('UNUSED_DECLARED_INPUT')) {
    const inputId = match[1];
    const filePath = match[2];
    if (!fileModifications[filePath]) fileModifications[filePath] = { inputs: [], outputs: [] };
    fileModifications[filePath].inputs.push(inputId);
  } else if (matchOutput && line.includes('DECLARED_UNUSED_OUTPUT')) {
    const outputId = matchOutput[1];
    const filePath = matchOutput[2];
    if (!fileModifications[filePath]) fileModifications[filePath] = { inputs: [], outputs: [] };
    fileModifications[filePath].outputs.push(outputId);
  }
}

let fixedFiles = 0;

for (const [filePath, mods] of Object.entries(fileModifications)) {
  const fileContent = readFileSync(filePath, 'utf8');
  const fileLines = fileContent.split('\n');
  const newLines = [];
  
  for (const line of fileLines) {
    let shouldSkip = false;
    for (const inputId of mods.inputs) {
      if (line.includes(`id: "${inputId}"`) && line.includes('{')) {
        shouldSkip = true;
        break;
      }
    }
    for (const outputId of mods.outputs) {
      if (line.includes(`id: "${outputId}"`) && line.includes('{')) {
        shouldSkip = true;
        break;
      }
    }
    
    if (!shouldSkip) {
      newLines.push(line);
    }
  }
  
  writeFileSync(filePath, newLines.join('\n'), 'utf8');
  fixedFiles++;
}

console.log(`Safely removed unused fields in ${fixedFiles} files by deleting lines.`);
