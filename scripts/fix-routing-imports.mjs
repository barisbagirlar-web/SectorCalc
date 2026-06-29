import fs from 'fs';
import path from 'path';

function fixImports(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      fixImports(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let changed = false;

      // Match import { ... } from "@/i18n/routing";
      const importRegex = /import\s+\{([^}]+)\}\s+from\s+['"]@\/i18n\/routing['"];/g;
      
      content = content.replace(importRegex, (match, p1) => {
        const tokens = p1.split(',').map(t => t.trim()).filter(Boolean);
        const nextNav = [];
        const routingOnly = [];

        for (const token of tokens) {
          if (token === 'usePathname' || token === 'useRouter' || token === 'redirect') {
            nextNav.push(token);
          } else {
            routingOnly.push(token);
          }
        }

        if (nextNav.length === 0) return match;

        changed = true;
        
        let newImports = `import { ${nextNav.join(', ')} } from "next/navigation";\n`;
        if (routingOnly.length > 0) {
          newImports += `import { ${routingOnly.join(', ')} } from "@/i18n/routing";`;
        }
        return newImports.trim();
      });

      if (changed) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Fixed imports in ${fullPath}`);
      }
    }
  }
}

fixImports('src');
