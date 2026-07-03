import fs from "fs";
import path from "path";

const files = [
  "src/lib/features/tools/revenue-tools.ts"
];

for (const f of files) {
  const p = path.join(process.cwd(), f);
  if (!fs.existsSync(p)) continue;
  
  let content = fs.readFileSync(p, "utf-8");
  
  // Replace ../../../data with ../../../../data
  content = content.replace(/from "(\.\.\/\.\.\/\.\.\/data[^"]+)"/g, 'from "../$1"');
  // Replace ../../../premium-slugs.json with ../../../../premium-slugs.json
  content = content.replace(/from "(\.\.\/\.\.\/\.\.\/premium-slugs\.json)"/g, 'from "../$1"');
  
  fs.writeFileSync(p, content, "utf-8");
  console.log("Fixed", f);
}
