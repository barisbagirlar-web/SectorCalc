// Guard: pro-v2 code must not import free tool code
import { readFileSync, readdirSync, statSync } from "fs";
import { resolve, dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

function findFiles(dir, ext) {
  const results = [];
  try {
    const entries = readdirSync(dir);
    for (const entry of entries) {
      const full = join(dir, entry);
      if (statSync(full).isDirectory()) {
        results.push(...findFiles(full, ext));
      } else if (entry.endsWith(ext)) {
        results.push(full);
      }
    }
  } catch { /* skip */ }
  return results;
}

const proV2Dir = resolve(root, "src/sectorcalc/pro-v2");
const freeFormDir = resolve(root, "src/sectorcalc/free-form");

const proV2Files = findFiles(proV2Dir, ".ts")
  .concat(findFiles(proV2Dir, ".tsx"))
  .map((f) => f.replace(root + "/", ""));

const freeFiles = findFiles(freeFormDir, ".ts")
  .concat(findFiles(freeFormDir, ".tsx"))
  .map((f) => f.replace(root + "/", ""));

// Free tool import patterns
const FORBIDDEN_IMPORTS = [
  "@/sectorcalc/free-form",
  "@/sectorcalc/pro-form/UniversalIndustrialDecisionForm",
  "@/sectorcalc/pro-form/ProToolSessionWrapper",
  "@/sectorcalc/runtime/free-schema-loader",
  "@/sectorcalc/public/public-tool-copy-adapter",
  "@/sectorcalc/pro-form/universal-industrial-decision-form",
  "@/sectorcalc/pro-form/index",
];

let hasError = false;

for (const file of proV2Files) {
  try {
    const content = readFileSync(resolve(root, file), "utf-8");
    for (const pattern of FORBIDDEN_IMPORTS) {
      if (content.includes(pattern)) {
        console.error(`GUARD FAIL: ${file} imports forbidden free/pro-form module: ${pattern}`);
        hasError = true;
      }
    }
  } catch {
    // skip
  }
}

// Also check that free tools don't import pro-v2
for (const file of freeFiles) {
  try {
    const content = readFileSync(resolve(root, file), "utf-8");
    if (content.includes("@/sectorcalc/pro-v2")) {
      console.error(`GUARD FAIL: Free file ${file} imports pro-v2`);
      hasError = true;
    }
  } catch {
    // skip
  }
}

if (hasError) {
  process.exit(1);
}

console.log("GUARD PASS: pro-v2 isolated from free form (no cross-imports)");
