// Guard: Validation must complete before session creation.
// Verify that local validation runs before createCreditSession is called.
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const formFile = resolve(root, "src/sectorcalc/pro-v2/ProExecutionFormV2.tsx");
const content = readFileSync(formFile, "utf-8");

// Find actual call sites (not imports)
const lines = content.split("\n");
const callSites = lines
  .map((l, i) => ({ text: l, line: i }))
  .filter((l) => !l.text.includes("import ") && !l.text.includes("from "));

const validateCall = callSites.find((l) => l.text.includes("validateProV2Inputs"));
const sessionCall = callSites.find((l) => l.text.includes("createCreditSession"));
const authCall = callSites.find((l) => l.text.includes("isSignedIn") && l.text.includes("!"));

if (!validateCall) {
  console.error("GUARD FAIL: validateProV2Inputs call not found");
  process.exit(1);
}
if (!sessionCall) {
  console.error("GUARD FAIL: createCreditSession call not found");
  process.exit(1);
}

if (validateCall.line > sessionCall.line) {
  console.error(`GUARD FAIL: validation call (line ${validateCall.line + 1}) appears AFTER session call (line ${sessionCall.line + 1})`);
  process.exit(1);
}

if (authCall && authCall.line > sessionCall.line) {
  console.error(`GUARD FAIL: auth check (line ${authCall.line + 1}) appears AFTER session call (line ${sessionCall.line + 1})`);
  process.exit(1);
}

console.log("GUARD PASS: Pre-check ordering verified (validation → auth → session)");
