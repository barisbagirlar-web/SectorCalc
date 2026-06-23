import fs from "node:fs";

const content = fs.readFileSync("scripts/generate-new-free-tools.mjs", "utf8");
const lines = content.split("\n");

const targetLines = [2524, 2525, 2526, 2527, 2576, 2577, 2578, 2579, 2624, 2625, 2626, 2627];

for (const lineNum of targetLines) {
  const line = lines[lineNum - 1];
  console.log(`Line ${lineNum}: [${line}]`);
  const chars = [];
  for (let i = 0; i < line.length; i++) {
    chars.push(`${line[i]}:${line.charCodeAt(i)}`);
  }
  console.log(`  Chars: ${chars.join("  ")}`);
}
