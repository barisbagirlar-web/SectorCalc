import fs from "node:fs";

const filepath = "scripts/generate-new-free-tools.mjs";
let content = fs.readFileSync(filepath, "utf8");

// The exact string in generate-new-free-tools.mjs is:
// explanation: \`\${t.titleTr}
// We want to replace it with:
// explanation: \`${t.titleTr}
content = content.replace("explanation: \\`\\${t.titleTr}", "explanation: \\`${t.titleTr}");

fs.writeFileSync(filepath, content, "utf8");
console.log("Successfully replaced t.titleTr reference.");
