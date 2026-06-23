import fs from "node:fs";

const code = fs.readFileSync("scripts/generate-new-free-tools.mjs", "utf8");

let stack = [];
let state = "CODE"; // CODE, STRING_DOUBLE, STRING_SINGLE, STRING_TEMPLATE, COMMENT_LINE, COMMENT_BLOCK, REGEX
let currentStringChar = null;

let line = 1;
let col = 1;

for (let i = 0; i < code.length; i++) {
  const c = code[i];
  const next = i + 1 < code.length ? code[i + 1] : '';
  const prev = i > 0 ? code[i - 1] : '';

  if (c === '\n') {
    line++;
    col = 1;
  } else {
    col++;
  }

  if (state === "COMMENT_LINE") {
    if (c === '\n') state = "CODE";
    continue;
  }
  
  if (state === "COMMENT_BLOCK") {
    if (c === '*' && next === '/') {
      state = "CODE";
      i++; col++;
    }
    continue;
  }

  if (state === "STRING_DOUBLE" || state === "STRING_SINGLE" || state === "STRING_TEMPLATE") {
    if (c === '\\') {
      i++; col++; // skip escaped char
      continue;
    }
    
    if (state === "STRING_TEMPLATE" && c === '$' && next === '{') {
      stack.push({ char: '${', line, col });
      state = "CODE";
      i++; col++;
      continue;
    }
    
    if (c === currentStringChar) {
      state = "CODE";
    }
    continue;
  }

  if (state === "REGEX") {
    if (c === '\\') {
      i++; col++;
      continue;
    }
    if (c === '/') {
      state = "CODE";
    }
    continue;
  }

  if (state === "CODE") {
    if (c === '/' && next === '/') {
      state = "COMMENT_LINE";
      i++; col++;
      continue;
    }
    if (c === '/' && next === '*') {
      state = "COMMENT_BLOCK";
      i++; col++;
      continue;
    }
    if (c === '"' || c === "'" || c === '`') {
      state = c === '"' ? "STRING_DOUBLE" : c === "'" ? "STRING_SINGLE" : "STRING_TEMPLATE";
      currentStringChar = c;
      continue;
    }
    // Very basic regex detection (not perfect, but usually works for typical JS)
    if (c === '/' && prev !== '*' && prev !== '/') {
      // skip basic regexes
      const isRegex = /[\s=:(,;]\s*$/.test(code.substring(Math.max(0, i - 10), i));
      if (isRegex) {
        state = "REGEX";
        continue;
      }
    }

    if (c === '(' || c === '[' || c === '{') {
      stack.push({ char: c, line, col });
    } else if (c === ')' || c === ']' || c === '}') {
      if (stack.length === 0) {
        console.log(`Unmatched ${c} at line ${line}, col ${col}`);
      } else {
        const top = stack[stack.length - 1];
        if ((c === ')' && top.char === '(') ||
            (c === ']' && top.char === '[') ||
            (c === '}' && top.char === '{') ||
            (c === '}' && top.char === '${')) {
          stack.pop();
          if (top.char === '${') {
            state = "STRING_TEMPLATE";
            currentStringChar = '`';
          }
        } else {
          console.log(`Mismatched ${c} at line ${line}, col ${col}. Expected to close ${top.char} from line ${top.line}`);
          stack.pop();
        }
      }
    }
  }
}

if (state !== "CODE") {
  console.log(`Ended in state ${state}`);
}
if (stack.length > 0) {
  console.log(`Unclosed tokens remaining on stack:`);
  for (const item of stack) {
    console.log(`  ${item.char} at line ${item.line}, col ${item.col}`);
  }
} else {
  console.log(`All brackets matched perfectly!`);
}
