import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const localeDir = path.join(process.cwd(), "src/app/");
const targetDir = path.join(process.cwd(), "src/app");

// 1. Move all folders
const items = fs.readdirSync(localeDir);
for (const item of items) {
  if (item === "layout.tsx") {
    // Merge or rename layout? Let's rename to (localized)-layout.tsx for manual merge
    fs.renameSync(path.join(localeDir, item), path.join(targetDir, "localized-layout.tsx"));
  } else if (item === "not-found.tsx") {
    fs.renameSync(path.join(localeDir, item), path.join(targetDir, "localized-not-found.tsx"));
  } else {
    fs.renameSync(path.join(localeDir, item), path.join(targetDir, item));
  }
}

// 2. Remove empty 
fs.rmdirSync(localeDir);
console.log("Moved files out of ");

// 3. Regex replacements across all page.tsx and layout.tsx
function traverseAndReplace(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      traverseAndReplace(fullPath);
    } else if (file === "page.tsx" || file === "layout.tsx" || file === "route.ts") {
      let content = fs.readFileSync(fullPath, "utf8");
      
      // Fix types: remove `locale: string;`
      content = content.replace(/locale:\s*string;?\n?/g, "");
      
      // Fix destructuring: { slug, locale } -> { slug }
      content = content.replace(/const\s+\{\s*([^}]*?)(,\s*)?locale(,\s*)?([^}]*?)\s*\}\s*=\s*await\s*params;/g, (match, before, c1, c2, after) => {
        const remaining = [before, after].filter(Boolean).map(s => s.trim()).join(", ");
        if (remaining) return `const { ${remaining} } = await params;\n  const locale = "en";`;
        return `const locale = "en";`;
      });
      
      // Fix destructuring without params object: const { locale } = await params;
      content = content.replace(/const\s+\{\s*locale\s*\}\s*=\s*await\s*params;/g, 'const locale = "en";');

      // Fix Next 14 destructuring (sync params)
      content = content.replace(/const\s+\{\s*([^}]*?)(,\s*)?locale(,\s*)?([^}]*?)\s*\}\s*=\s*params;/g, (match, before, c1, c2, after) => {
        const remaining = [before, after].filter(Boolean).map(s => s.trim()).join(", ");
        if (remaining) return `const { ${remaining} } = params;\n  const locale = "en";`;
        return `const locale = "en";`;
      });
      content = content.replace(/const\s+\{\s*locale\s*\}\s*=\s*params;/g, 'const locale = "en";');

      // Force any leftover explicit `locale: "en"` hardcoding
      
      fs.writeFileSync(fullPath, content, "utf8");
    }
  }
}

traverseAndReplace(targetDir);
console.log("Regex transformations complete.");
