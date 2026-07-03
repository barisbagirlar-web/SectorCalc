import fs from "fs";
import path from "path";

const files = [
  "src/lib/infrastructure/i18n/free-tool-form-i18n.ts",
  "src/lib/infrastructure/i18n/free-tool-i18n.ts",
  "src/lib/infrastructure/i18n/smart-form-validation-i18n.ts",
  "src/lib/infrastructure/trace/trace-server-i18n.ts"
];

for (const f of files) {
  const p = path.join(process.cwd(), f);
  if (!fs.existsSync(p)) continue;
  
  let content = fs.readFileSync(p, "utf-8");
  
  // Replace ../../../ with ../../../../
  // Replace ../../data with ../../../data
  // Replace ../../messages with ../../../messages
  
  content = content.replace(/from "(\.\.\/\.\.\/\.\.\/data[^"]+)"/g, 'from "../$1"');
  content = content.replace(/from "(\.\.\/\.\.\/\.\.\/messages[^"]+)"/g, 'from "../$1"');
  content = content.replace(/from "(\.\.\/\.\.\/data[^"]+)"/g, 'from "../$1"');
  
  fs.writeFileSync(p, content, "utf-8");
  console.log("Fixed", f);
}
