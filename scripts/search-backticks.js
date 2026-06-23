import fs from "node:fs";

const content = fs.readFileSync("scripts/generate-new-free-tools.mjs", "utf8");
const lines = content.split("\n");

for (let lineIdx = 2520; lineIdx < 2640; lineIdx++) {
  const line = lines[lineIdx];
  if (line.includes("`")) {
    console.log(`Line ${lineIdx + 1}: ${line}`);
  }
}
