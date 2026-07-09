// Guard: Verify unit registry contains all required unit families.
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const registryFile = resolve(root, "src/sectorcalc/pro-v2/proUnitRegistry.ts");
const content = readFileSync(registryFile, "utf-8");

// Required unit families
const requiredFamilies = [
  "length",
  "small_length",
  "area",
  "volume",
  "mass",
  "time",
  "speed",
  "flow",
  "pressure",
  "temperature",
  "force",
  "torque",
  "power",
  "energy",
  "energy_per_period",
  "energy_price",
  "currency",
  "labor_rate",
  "shop_rate",
  "material_cost",
  "cost_per_unit",
  "percentage",
  "factor",
  "density",
  "emissions",
  "production_rate",
  "finance_period",
  "interest_rate",
  "margin_rate",
];

// Extract registry block
const registryStart = content.indexOf("UNIT_REGISTRY:");
const registryEnd = content.indexOf("};", registryStart);
const registryBlock = content.slice(registryStart, registryEnd + 2);

// Validate each required family
let allPass = true;
const missing = [];

for (const family of requiredFamilies) {
  // Match either `family,` or `family: ` in the registry block
  const familyRegex = new RegExp(`\\b${family}\\b\\s*(,|:)`);
  const inRegistry = familyRegex.test(registryBlock);
  
  if (!inRegistry) {
    missing.push(family);
    allPass = false;
  }
}

if (missing.length > 0) {
  console.error(`GUARD FAIL: Missing unit families: ${missing.join(", ")}`);
  process.exit(1);
}

// Verify count
const registryLines = registryBlock.split("\n").filter(l => {
  const t = l.trim();
  return t && !t.startsWith("//") && !t.startsWith("export") && t !== "{" && t !== "}";
});
if (registryLines.length < 28) {
  console.error(`GUARD FAIL: Only ${registryLines.length} unit families in registry (expected >= 28)`);
  allPass = false;
}

if (allPass) {
  console.log(`GUARD PASS: Unit registry complete (${registryLines.length} families, all ${requiredFamilies.length} required present)`);
} else {
  process.exit(1);
}
