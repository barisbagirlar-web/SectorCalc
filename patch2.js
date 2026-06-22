const fs = require('fs');
const file = 'scripts/tool-activation/lib/p24-tool-quality-lib.mjs';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(
  "  const batch1Content = readText(\"src/lib/tools/roadmap-free-batch1-specs.generated.ts\");\n  if (batch1Content) {\n    for (const match of batch1Content.matchAll(/^\\s+\"([a-z0-9-]+)\":\\s*\\{/gm)) {\n      slugs.add(match[1]);\n    }\n  }",
  `  const batch1Content = readText("src/lib/tools/roadmap-free-batch1-specs.generated.ts");
  if (batch1Content) {
    for (const match of batch1Content.matchAll(/^\\s+"([a-z0-9-]+)":\\s*\\{/gm)) {
      slugs.add(match[1]);
    }
  }`
);
fs.writeFileSync(file, content);
