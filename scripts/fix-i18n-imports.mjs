import fs from "fs";
import { globSync } from "glob";

const files = globSync("src/**/*.{ts,tsx,js,jsx}");
let fixed = 0;

for (const file of files) {
  let content = fs.readFileSync(file, "utf8");
  if (!content.includes("@/i18n/routing")) continue;

  const lines = content.split('\n');
  const newLines = [];
  let modified = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes("@/i18n/routing")) {
      modified = true;
      // Extract what's being imported
      const match = line.match(/import\s+{([^}]+)}\s+from\s+['"]@\/i18n\/routing['"]/);
      if (match) {
        const imports = match[1].split(',').map(s => s.trim()).filter(Boolean);
        const navImports = [];
        let hasLink = false;
        
        for (const imp of imports) {
          if (imp === "Link") hasLink = true;
          else if (imp === "Link as I18nLink") newLines.push('import I18nLink from "next/link";');
          else if (imp === "usePathname" || imp === "useRouter" || imp === "redirect") navImports.push(imp);
        }
        
        if (hasLink) newLines.push('import Link from "next/link";');
        if (navImports.length > 0) newLines.push(`import { ${navImports.join(", ")} } from "next/navigation";`);
        
        // Let's just ignore AppLocale, locales, routing, stripLocalePrefix. They are already handled or unused.
      } else {
        // If it doesn't match the regex (e.g. multi-line), just skip it and hope for the best, or log it
        console.log(`Manual check needed: ${file} -> ${line}`);
      }
    } else {
      newLines.push(line);
    }
  }

  if (modified) {
    fs.writeFileSync(file, newLines.join('\n'));
    fixed++;
  }
}
console.log(`Fixed i18n imports in ${fixed} files.`);
