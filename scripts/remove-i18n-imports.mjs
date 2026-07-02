import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const ROOT = path.join(process.cwd(), "src");

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith(".ts") || file.endsWith(".tsx")) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk(ROOT);

files.forEach(file => {
  let content = fs.readFileSync(file, "utf8");
  let modified = false;

  if (content.includes("@/i18n/routing") || content.includes("@/i18n/locales")) {
    content = content.replace(/import\s+type\s+\{\s*AppLocale\s*\}\s+from\s+["']@\/i18n\/(routing|locales)["'];?/g, "");
    content = content.replace(/import\s+\{\s*AppLocale\s*\}\s+from\s+["']@\/i18n\/(routing|locales)["'];?/g, "");
    content = content.replace(/import\s+\{\s*stripLocalePrefix\s*\}\s+from\s+["']@\/i18n\/routing["'];?/g, "");
    content = content.replace(/import\s+[^;]+from\s+["']@\/i18n\/(routing|locales)["'];?/g, "");
    
    // Replace AppLocale usages with string
    content = content.replace(/: AppLocale/g, ': "en"');
    content = content.replace(/<AppLocale>/g, '<"en">');
    content = content.replace(/AppLocale/g, '"en"');
    
    // Fix stripLocalePrefix
    content = content.replace(/stripLocalePrefix\(([^)]+)\)/g, "$1");
    
    modified = true;
  }
  
  if (content.includes("locales_legacy")) {
    content = content.replace(/locales_legacy/g, "locales");
    modified = true;
  }
  
  if (content.includes("languages_legacy")) {
    content = content.replace(/languages_legacy/g, "languages");
    modified = true;
  }

  // Handle the Object key indexing error seen in the logs:
  // src/lib/infrastructure/seo/entity-graph.ts(294,19): error TS7053: Element implicitly has an 'any' type because expression of type 'AppLocale' can't be used to index type '{ readonly en: ... }'.
  // We can just find those objects and ensure they only return `.en` if we know it's english now.
  // Actually, we changed `AppLocale` to `"en"`, so TypeScript might complain if we use it as an index without `as const`. But `"en"` should be fine.
  
  if (modified) {
    fs.writeFileSync(file, content, "utf8");
    console.log(`Updated ${file}`);
  }
});
