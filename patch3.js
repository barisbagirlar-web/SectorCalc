const fs = require('fs');
const file = 'scripts/tool-activation/lib/p24-tool-quality-lib.mjs';
let content = fs.readFileSync(file, 'utf8');

const replacement = `  const batch1Content = readText("src/lib/tools/roadmap-free-batch1-specs.generated.ts");
  if (batch1Content) {
    for (const match of batch1Content.matchAll(/^\\s+"([a-z0-9-]+)":\\s*\\{/gm)) {
      slugs.add(match[1]);
    }
  }
  const batch2Content = readText("src/lib/tools/roadmap-free-batch2-specs.generated.ts");
  if (batch2Content) {
    for (const match of batch2Content.matchAll(/^\\s+"([a-z0-9-]+)":\\s*\\{/gm)) {
      slugs.add(match[1]);
    }
  }`;

content = content.replace(
  `  const batch1Content = readText("src/lib/tools/roadmap-free-batch1-specs.generated.ts");
  if (batch1Content) {
    for (const match of batch1Content.matchAll(/^\\s+"([a-z0-9-]+)":\\s*\\{/gm)) {
      slugs.add(match[1]);
    }
  }`,
  replacement
);

fs.writeFileSync(file, content);
