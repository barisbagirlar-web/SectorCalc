import fs from "node:fs";
const p = "scripts/generate-generated-schema-inputs-i18n.mjs";
let c = fs.readFileSync(p, "utf8");
c = c.replace('import { globSync } from "glob";\n  const files', 'const files');
c = 'import { globSync } from "glob";\n' + c;
fs.writeFileSync(p, c);
