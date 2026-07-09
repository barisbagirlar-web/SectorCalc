// Guard: pro-v2 must not contain client-side formula calculation logic.
// Formula execution is server-only. Client should only assemble inputs for the server.
import { readFileSync, readdirSync, statSync } from "fs";
import { resolve, dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

function findFilesV2(dir) {
  const results = [];
  try {
    const entries = readdirSync(dir);
    for (const entry of entries) {
      const full = join(dir, entry);
      if (statSync(full).isDirectory()) results.push(...findFilesV2(full));
      else if (entry.endsWith(".ts") || entry.endsWith(".tsx")) results.push(full);
    }
  } catch { /* skip */ }
  return results;
}
const proV2Files = findFilesV2(resolve(root, "src/sectorcalc/pro-v2"))
  .map((f) => f.replace(root + "/", ""));

// Patterns that indicate client-side formula calculation
const FORBIDDEN_PATTERNS = [
  { pattern: "weld_cost_floor *=", desc: "client-side weld cost multiplication" },
  { pattern: "const totalCost", desc: "client-side total cost calculation" },
  { pattern: "outputMap[", desc: "client-side output reading (allowed in ProExecutionFormV2.tsx)" },
];

// Only check non-form files (insight engine may read outputs, that's OK)
const filesToCheck = proV2Files.filter(
  (f) => !f.includes("proInsightEngine") && !f.includes("ProExecutionFormV2") && !f.includes("proUnitRegistry")
);

let hasError = false;

for (const file of filesToCheck) {
  try {
    const content = readFileSync(resolve(root, file), "utf-8");

    // Check for mathematical formula patterns that shouldn't be in client code
    // These are indicators of copied server-side logic
    const suspiciousPatterns = [
      /\bweld_length\s*\*/.source,
      /\bweld_throat\s*\*/.source,
      /\bdeposition_efficiency\s*[/*]/.source,
      /\barc_time\s*\*/.source,
      /\blabor_rate\s*\*/.source,
    ];

    for (const sp of suspiciousPatterns) {
      const regex = new RegExp(sp, "i");
      if (regex.test(content)) {
        console.error(`GUARD FAIL: ${file} contains suspicious formula pattern matching "${sp}"`);
        hasError = true;
      }
    }
  } catch {
    // skip
  }
}

// Check that ProExecutionFormV2 doesn't do calculations
const formContent = readFileSync(
  resolve(root, "src/sectorcalc/pro-v2/ProExecutionFormV2.tsx"),
  "utf-8"
);

// The form should only call the execute API, not calculate locally
const localCalcPatterns = [
  "weld_cost_floor =",
  "cost_per_meter =",
  "wire_mass =",
];
for (const pat of localCalcPatterns) {
  if (formContent.includes(pat)) {
    console.error(`GUARD FAIL: ProExecutionFormV2.tsx contains local formula: ${pat}`);
    hasError = true;
  }
}

if (hasError) {
  process.exit(1);
}

console.log("GUARD PASS: No client-side formula logic detected in pro-v2");
