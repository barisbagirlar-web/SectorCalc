// Guard: One Calculate click must produce at most one execute request.
// Searches for patterns that could cause double execution.
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const formFile = resolve(root, "src/sectorcalc/pro-v2/ProExecutionFormV2.tsx");
const content = readFileSync(formFile, "utf-8");

const checks = [
  { pattern: "runningRef.current", desc: "runningRef guard present" },
  { pattern: "if (runningRef.current)", desc: "double-click guard check" },
  { pattern: "runningRef.current = true", desc: "lock set before async" },
  { pattern: "runningRef.current = false", desc: "lock released in finally" },
];

let allPass = true;
for (const check of checks) {
  if (!content.includes(check.pattern)) {
    console.error(`GUARD FAIL: Missing pattern "${check.pattern}" (${check.desc})`);
    allPass = false;
  }
}

// Verify only one execute call site (not counting import)
const executeCallLines = content.split("\n").filter((l) => l.includes("executeWithUsageSession") && !l.includes("import "));
if (executeCallLines.length !== 1) {
  console.error(`GUARD FAIL: Expected 1 executeWithUsageSession call site, found ${executeCallLines.length}`);
  allPass = false;
}

// Verify only one session create call site (not counting import)
const sessionCallLines = content.split("\n").filter((l) => l.includes("createCreditSession") && !l.includes("import "));
if (sessionCallLines.length !== 1) {
  console.error(`GUARD FAIL: Expected 1 createCreditSession call site, found ${sessionCallLines.length}`);
  allPass = false;
}

if (allPass) {
  console.log("GUARD PASS: Single-submit pattern verified");
} else {
  process.exit(1);
}
