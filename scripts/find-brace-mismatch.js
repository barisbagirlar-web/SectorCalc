import fs from "node:fs";

const content = fs.readFileSync("scripts/generate-new-free-tools.mjs", "utf8");
const lines = content.split("\n");

let currentBlockStartLine = -1;
let currentBlockId = -1;
let openBraces = 0;
let inString = null;

for (let lineIdx = 1336; lineIdx < 2630; lineIdx++) {
  const line = lines[lineIdx];
  
  // Detect start of a block
  const match = line.match(/else if\s*\(\s*id\s*===\s*(\d+)\s*\)/) || line.match(/if\s*\(\s*id\s*===\s*(\d+)\s*\)/);
  if (match) {
    if (currentBlockId !== -1) {
      console.log(`Block ${currentBlockId} (line ${currentBlockStartLine}) ended. Final brace balance: ${openBraces}`);
    }
    currentBlockId = parseInt(match[1], 10);
    currentBlockStartLine = lineIdx + 1;
    openBraces = 0;
  }

  for (let charIdx = 0; charIdx < line.length; charIdx++) {
    const char = line[charIdx];
    const prevChar = charIdx > 0 ? line[charIdx - 1] : '';

    if (prevChar === '\\') {
      continue;
    }

    if (inString) {
      if (char === inString) {
        inString = null;
      }
      continue;
    }

    if (char === "'" || char === '"' || char === '`') {
      inString = char;
      continue;
    }

    if (char === '{') {
      openBraces++;
    } else if (char === '}') {
      openBraces--;
    }
  }
}
if (currentBlockId !== -1) {
  console.log(`Block ${currentBlockId} (line ${currentBlockStartLine}) ended. Final brace balance: ${openBraces}`);
}
