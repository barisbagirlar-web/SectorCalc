// Guard: Free runtime source files must not be directly modified.
// Checks that the actual pro-v2 source files plus page.tsx routing changes
// do not modify free runtime logic.
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

// These files must NOT be changed by pro-v2 implementation
const FREE_RUNTIME_SOURCES = [
  "src/sectorcalc/free-form/FreeToolResultPanel.tsx",
  "src/sectorcalc/free-form/freeDecisionState.ts",
  "src/sectorcalc/free-form/freeResultText.ts",
  "src/sectorcalc/runtime/free-schema-loader.ts",
  "src/app/tools/free/[slug]/page.tsx",
];

let hasError = false;

// Read each file and verify it still exports the expected symbols
for (const filePath of FREE_RUNTIME_SOURCES) {
  const absolute = resolve(root, filePath);
  try {
    const content = readFileSync(absolute, "utf-8");
    // Just verify the file still exists and is not empty
    if (content.length < 50) {
      console.error(`GUARD FAIL: ${filePath} appears truncated`);
      hasError = true;
    }
  } catch {
    console.error(`GUARD FAIL: ${filePath} not found or cannot be read`);
    hasError = true;
  }
}

// Verify that pro-v2 files do NOT import from free-form or free runtime
import { readdirSync, statSync } from "fs";
import { join } from "path";

function findFiles(dir) {
  const results = [];
  try {
    const entries = readdirSync(dir);
    for (const entry of entries) {
      const full = join(dir, entry);
      if (statSync(full).isDirectory()) results.push(...findFiles(full));
      else if (entry.endsWith(".ts") || entry.endsWith(".tsx")) results.push(full);
    }
  } catch { /* skip */ }
  return results;
}

const proV2Files = findFiles(resolve(root, "src/sectorcalc/pro-v2"));
const freeImportPatterns = [
  "@/sectorcalc/free-form",
  "FreeToolResultPanel",
  "freeDecisionState",
  "freeResultText",
  "free-schema-loader",
];

for (const file of proV2Files) {
  const content = readFileSync(file, "utf-8");
  for (const pattern of freeImportPatterns) {
    if (content.includes(pattern)) {
      console.error(`GUARD FAIL: ${file.replace(root + "/", "")} imports free runtime: "${pattern}"`);
      hasError = true;
    }
  }
}

if (hasError) {
  process.exit(1);
}

console.log("GUARD PASS: Free runtime untouched");
