import fs from "fs";
import { globSync } from "glob";

const files = globSync("src/**/*.{ts,tsx,js,jsx}");
let fixed = 0;

for (const file of files) {
  const content = fs.readFileSync(file, "utf8");
  const hasUseClient = content.match(/^(?![\s]*\/\/).*["']use client["']/m);
  const hasUseServer = content.match(/^(?![\s]*\/\/).*["']use server["']/m);
  
  if (hasUseClient || hasUseServer) {
    const lines = content.split('\n');
    const firstLine = lines[0].trim();
    if (!firstLine.includes("use client") && !firstLine.includes("use server")) {
      // Find where it is and remove it
      const newLines = lines.filter(line => !line.includes('"use client"') && !line.includes("'use client'") && !line.includes('"use server"') && !line.includes("'use server'"));
      
      let directive = "";
      if (hasUseClient) directive = '"use client";\n';
      if (hasUseServer) directive = '"use server";\n';
      
      fs.writeFileSync(file, directive + newLines.join('\n'));
      fixed++;
    }
  }
}
console.log(`Fixed directives in ${fixed} files.`);
