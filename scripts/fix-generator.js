import fs from "node:fs";

const filepath = "scripts/generate-new-free-tools.mjs";
let content = fs.readFileSync(filepath, "utf8");

// We want to replace "\${t.titleTr}" with "${t.titleTr}" inside the explanation string
// In the source file, it is written as: explanation: \`\${t.titleTr} ...
// We change it to: explanation: \`${t.titleTr} ...
content = content.replace("explanation: \\`\\\\\\${t.titleTr}", "explanation: \\`\\${t.titleTr}");

fs.writeFileSync(filepath, content, "utf8");
console.log("Fixed generate-new-free-tools.mjs successfully.");
