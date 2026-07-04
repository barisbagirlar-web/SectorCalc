import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const SCAN_DIRS = ["src", "scripts", "public", "data"];
const IGNORED_DIRS = new Set([".git", ".next", "node_modules", "out", "dist", "coverage", ".firebase"]);

let violations = 0;

// Matches actual imports, requires, readFileSync, readdirSync targeting archive/migration-only
const importReadPattern = /(?:import\s+.*?\s+from\s+['"]|require\(['"]|readFileSync\(['"]|readdirSync\(['"]|from\s+['"])\.?\.?\/archive\/migration-only/i;

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!IGNORED_DIRS.has(entry.name)) {
        walk(fullPath);
      }
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (ext === ".ts" || ext === ".tsx" || ext === ".js" || ext === ".mjs" || ext === ".json") {
        // Skip scanning the guard script itself
        if (entry.name === "guard-no-archive-imports.mjs") {
          continue;
        }
        
        const content = fs.readFileSync(fullPath, "utf-8");
        
        // Test for imports or read calls
        if (importReadPattern.test(content)) {
          // Allow migration script to import it since it is run once offline
          if (entry.name === "migrate-active-schemas-to-english-only.mjs") {
            continue;
          }
          console.error(`❌ VIOLATION: File ${path.relative(ROOT, fullPath)} imports or reads from archive/migration-only/`);
          violations++;
        }
      }
    }
  }
}

console.log("🔍 Running guard-no-archive-imports...");
for (const dir of SCAN_DIRS) {
  const dirPath = path.join(ROOT, dir);
  if (fs.existsSync(dirPath)) {
    walk(dirPath);
  }
}

if (violations > 0) {
  console.error(`❌ NO ARCHIVE IMPORTS GUARD FAILED: ${violations} violation(s) found.`);
  process.exit(1);
} else {
  console.log("✅ PASS: No active files import or read from the archive/migration-only directory.");
  process.exit(0);
}
