import fs from "node:fs";

const content = fs.readFileSync("scripts/generate-new-free-tools.mjs", "utf8");
const lines = content.split("\n");

let count = 0;
let lastBacktickLine = -1;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  let pos = line.indexOf("`");
  while (pos !== -1) {
    // Check if escaped
    let isEscaped = false;
    let p = pos - 1;
    while (p >= 0 && line[p] === "\\") {
      isEscaped = !isEscaped;
      p--;
    }
    if (!isEscaped) {
      count++;
      console.log(`Backtick #${count} at line ${i + 1}, col ${pos + 1}: ${line.substring(Math.max(0, pos - 10), Math.min(line.length, pos + 20))}`);
      lastBacktickLine = i + 1;
    }
    pos = line.indexOf("`", pos + 1);
  }
}

console.log(`Total unescaped backticks: ${count}`);
if (count % 2 !== 0) {
  console.log(`Warning: Odd number of backticks! Last backtick was on line ${lastBacktickLine}`);
} else {
  console.log(`Even number of backticks. All good here.`);
}
