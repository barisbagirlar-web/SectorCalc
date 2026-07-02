import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");
const registryPath = join(ROOT, "src/lib/features/premium-schema/formula-registry.ts");
const content = readFileSync(registryPath, "utf8");

// Find the start of the FORMULA_DEFINITIONS array.
const startIdx = content.indexOf("const FORMULA_DEFINITIONS");
if (startIdx === -1) {
  console.error("Could not find const FORMULA_DEFINITIONS in registry.");
  process.exit(1);
}

// Find the equal sign after const FORMULA_DEFINITIONS
const equalIdx = content.indexOf("=", startIdx);
if (equalIdx === -1) {
  console.error("Could not find = after const FORMULA_DEFINITIONS.");
  process.exit(1);
}

// Find the opening bracket "[" after the equal sign
const bracketOpenIdx = content.indexOf("[", equalIdx);
if (bracketOpenIdx === -1) {
  console.error("Could not find opening bracket [ after equal sign.");
  process.exit(1);
}

// Bracket matching to find the end of the array
let bracketCount = 1;
let currentPos = bracketOpenIdx + 1;
while (bracketCount > 0 && currentPos < content.length) {
  const char = content[currentPos];
  if (char === "[") bracketCount++;
  else if (char === "]") bracketCount--;
  currentPos++;
}

const formulasBlock = content.slice(bracketOpenIdx, currentPos);

// Parse formula objects within the array.
let pos = 0;
const parsedFormulas: Array<{ id: string; body: string }> = [];

while (true) {
  const nextOpen = formulasBlock.indexOf("{", pos);
  if (nextOpen === -1) break;
  
  // Find matching close brace
  let braceCount = 1;
  let bracePos = nextOpen + 1;
  while (braceCount > 0 && bracePos < formulasBlock.length) {
    const char = formulasBlock[bracePos];
    if (char === "{") braceCount++;
    else if (char === "}") braceCount--;
    bracePos++;
  }
  
  const body = formulasBlock.slice(nextOpen, bracePos);
  const idMatch = body.match(/id:\s*"([^"]+)"/);
  if (idMatch) {
    parsedFormulas.push({ id: idMatch[1], body });
  }
  
  pos = bracePos;
}

console.log(`Parsed ${parsedFormulas.length} formula definitions from FORMULA_DEFINITIONS.`);

const formulaParams = new Map<string, string[]>();

// Now let's extract all num(..., "parameterName") calls from the body of each formula.
for (const formula of parsedFormulas) {
  const params: string[] = [];
  
  const numCallRegex = /num\(\s*\w+\s*,\s*["']([^"']+)["']\s*\)/g;
  let numMatch;
  while ((numMatch = numCallRegex.exec(formula.body)) !== null) {
    if (!params.includes(numMatch[1])) {
      params.push(numMatch[1]);
    }
  }
  
  const numsCallRegex = /nums\(\s*\w+\s*,\s*["']([^"']+)["']\s*\)/g;
  let numsMatch;
  while ((numsMatch = numsCallRegex.exec(formula.body)) !== null) {
    if (!params.includes(numsMatch[1])) {
      params.push(numsMatch[1]);
    }
  }

  formulaParams.set(formula.id, params);
}

// Let's update the FORMULA_META_DETAILS or USER_FORMULA_META_DETAILS block.
let updatedContent = content;
let changeCount = 0;

for (const [id, params] of formulaParams.entries()) {
  const escapedId = id.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  
  // Robust regex: matches "id": { any_chars_excluding_close_brace requiredInputs: [...] }
  const requiredInputsRegex = new RegExp(`("${escapedId}"|'${escapedId}')\\s*:\\s*\\{\\s*[^}]*?requiredInputs:\\s*\\[.*?\\]`);
  
  const match = updatedContent.match(requiredInputsRegex);
  if (match) {
    const newRequiredInputsStr = `requiredInputs: [${params.map(p => `"${p}"`).join(", ")}]`;
    
    // Find the exact block in updatedContent
    const matchStart = match.index!;
    const matchEnd = matchStart + match[0].length;
    const blockContent = updatedContent.slice(matchStart, matchEnd);
    
    // Check if the requiredInputs is different
    const oldRequiredInputsMatch = blockContent.match(/requiredInputs:\s*\[(.*?)\]/);
    const oldRequiredInputsStr = oldRequiredInputsMatch ? oldRequiredInputsMatch[0] : "";
    
    if (oldRequiredInputsStr !== newRequiredInputsStr) {
      const replacedBlock = blockContent.replace(/requiredInputs:\s*\[.*?\]/, newRequiredInputsStr);
      updatedContent = updatedContent.slice(0, matchStart) + replacedBlock + updatedContent.slice(matchEnd);
      changeCount++;
    }
  }
}

writeFileSync(registryPath, updatedContent, "utf8");
console.log(`Formula registry metadata successfully aligned. Updated ${changeCount} formulas.`);
