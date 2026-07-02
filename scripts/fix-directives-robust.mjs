import fs from "fs";
import { globSync } from "glob";

const files = globSync("src/**/*.{ts,tsx,js,jsx}");
let fixed = 0;

for (const file of files) {
  const content = fs.readFileSync(file, "utf8");
  const hasUseClient = /["']use client["']/g.test(content);
  const hasUseServer = /["']use server["']/g.test(content);
  
  if (hasUseClient || hasUseServer) {
    const lines = content.split('\n');
    const firstLine = lines[0].trim();
    
    // If the directive is not literally the very first thing
    if (!firstLine.startsWith('"use client"') && !firstLine.startsWith("'use client'") && !firstLine.startsWith('"use server"') && !firstLine.startsWith("'use server'")) {
      const newLines = lines.filter(line => !line.match(/["']use client["']/i) && !line.match(/["']use server["']/i));
      
      let directive = "";
      if (hasUseClient) directive = '"use client";\n';
      if (hasUseServer) directive = '"use server";\n';
      
      fs.writeFileSync(file, directive + newLines.join('\n'));
      fixed++;
    }
  }
}
console.log(`Fixed directives in ${fixed} files.`);
