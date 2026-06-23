import fs from "node:fs";

const content = fs.readFileSync("scripts/generate-new-free-tools.mjs", "utf8");

let inString = null; // ' or " or `
let braces = []; // positions of {
let brackets = []; // positions of [
let parens = []; // positions of (
let lines = content.split("\n");

for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
  const line = lines[lineIdx];
  for (let charIdx = 0; charIdx < line.length; charIdx++) {
    const char = line[charIdx];
    const prevChar = charIdx > 0 ? line[charIdx - 1] : '';

    if (prevChar === '\\') {
      continue; // Skip escaped characters
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
      braces.push({ line: lineIdx + 1, col: charIdx + 1 });
    } else if (char === '}') {
      if (braces.length === 0) {
        console.log(`Unmatched } at line ${lineIdx + 1}, col ${charIdx + 1}`);
      } else {
        braces.pop();
      }
    } else if (char === '[') {
      brackets.push({ line: lineIdx + 1, col: charIdx + 1 });
    } else if (char === ']') {
      if (brackets.length === 0) {
        console.log(`Unmatched ] at line ${lineIdx + 1}, col ${charIdx + 1}`);
      } else {
        brackets.pop();
      }
    } else if (char === '(') {
      parens.push({ line: lineIdx + 1, col: charIdx + 1 });
    } else if (char === ')') {
      if (parens.length === 0) {
        console.log(`Unmatched ) at line ${lineIdx + 1}, col ${charIdx + 1}`);
      } else {
        parens.pop();
      }
    }
  }
}

if (inString) {
  console.log(`Unclosed string/template literal of type: ${inString}`);
}
if (braces.length > 0) {
  console.log(`Unclosed { count: ${braces.length}. First unclosed { is at line ${braces[0].line}, col ${braces[0].col}`);
}
if (brackets.length > 0) {
  console.log(`Unclosed [ count: ${brackets.length}. First unclosed [ is at line ${brackets[0].line}, col ${brackets[0].col}`);
}
if (parens.length > 0) {
  console.log(`Unclosed ( count: ${parens.length}. First unclosed ( is at line ${parens[0].line}, col ${parens[0].col}`);
}
