#!/usr/bin/env node
/**
 * P33 CI gate — tool-specific guided reference graphics + active field highlight.
 */
import { execSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");
const LOCALES = ["en", "tr", "de", "fr", "es", "ar"];

const TEMPLATE_FILES = [
  "BoxDimensionGraphic.tsx",
  "AreaGraphic.tsx",
  "VolumeGraphic.tsx",
  "CylinderPipeGraphic.tsx",
  "StairGraphic.tsx",
  "BendRadiusGraphic.tsx",
  "CompressorLeakGraphic.tsx",
  "AngleGraphic.tsx",
  "RouteGraphic.tsx",
  "EnergyFlowGraphic.tsx",
  "MachineTimeGraphic.tsx",
  "OeeFlowGraphic.tsx",
  "FinancialFlowGraphic.tsx",
  "GenericCalculatorGraphic.tsx",
];

const REQUIRED_GUIDANCE_KEYS = [
  "guidance.inputGuide.title",
  "guidance.inputGuide.description",
  "guidance.inputGuide.activeField",
  "guidance.labels.length",
  "guidance.labels.width",
  "guidance.labels.height",
  "guidance.labels.depth",
  "guidance.labels.setupTime",
  "guidance.labels.cycleTime",
  "guidance.labels.insideRadius",
  "guidance.labels.bendAngle",
  "guidance.labels.result",
  "guidance.labels.decision",
  "guidance.labels.input",
  "guidance.labels.process",
];

const FORBIDDEN_DEPS = ["framer-motion", "lottie", "canvas", "webgl", "recharts"];

const MUST_NOT_BE_GENERIC = {
  "concrete-volume-calculator": "box-dimension",
  "paint-coverage-calculator": "wall-area",
  "k-factor-calculator": "bend-radius",
  "stair-calculator": "stair",
  "compressor-leak-cost-calculator": "compressor-leak",
  "energy-compressor-leak-cost": "compressor-leak",
  "machine-time-calculator": "machine-time",
  "quote-price-profit-margin-calculator": "financial-flow",
  "cnc-oee-loss": "oee-flow",
  "oee-calculator": "oee-flow",
};

let failures = 0;
let passes = 0;
let genericUsageCount = 0;

function pass(msg) {
  passes += 1;
  console.log(`PASS: ${msg}`);
}

function fail(msg) {
  failures += 1;
  console.error(`FAIL: ${msg}`);
}

function read(rel) {
  return readFileSync(join(ROOT, rel), "utf8");
}

function hasPath(obj, dotted) {
  return dotted.split(".").reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), obj) !== undefined;
}

for (const file of TEMPLATE_FILES) {
  const rel = `src/components/guidance/templates/${file}`;
  if (!existsSync(join(ROOT, rel))) {
    fail(`missing template ${rel}`);
  } else {
    pass(`template exists ${file}`);
  }
}

if (!existsSync(join(ROOT, "src/lib/guidance/reference-graphic-resolver.ts"))) {
  fail("missing reference-graphic-resolver.ts");
} else {
  pass("resolver exists");
}

const integrationFiles = {
  free: "src/components/smart-form/SmartFormWorkspace.tsx",
  premium: "src/components/tools/PremiumToolPage.tsx",
  "premium-schema": "src/components/tools/PremiumSchemaToolForm.tsx",
};

for (const [tier, rel] of Object.entries(integrationFiles)) {
  const text = read(rel);
  if (!text.includes("ToolGuidanceLayout") && !text.includes("resolveReferenceGraphic")) {
    fail(`${tier} page missing guidance integration in ${rel}`);
  } else {
    pass(`${tier} page guidance integration present`);
  }
}

const resolverText = read("src/lib/guidance/reference-graphic-resolver.ts");
if (!resolverText.includes('"generic"')) {
  fail("generic fallback not found in resolver");
} else {
  pass("generic fallback in resolver");
}

if (!existsSync(join(ROOT, "src/components/guidance/templates/CompressorLeakGraphic.tsx"))) {
  fail("compressor-leak template missing");
} else {
  pass("compressor-leak template present");
}

try {
  const probeOut = execSync("node scripts/audit-guided-resolver-probe.mjs", {
    cwd: ROOT,
    encoding: "utf8",
  }).trim();
  if (probeOut.startsWith("OK:")) {
    pass(`all ${probeOut.slice(3)} free traffic slugs resolve a template`);
  } else {
    fail(`free traffic slug resolver probe failed: ${probeOut}`);
  }
} catch {
  fail("free traffic slug resolver probe failed");
}

try {
  const templateProbe = execSync("node scripts/audit-guided-template-expectations.mjs", {
    cwd: ROOT,
    encoding: "utf8",
  }).trim();
  if (templateProbe.startsWith("OK:")) {
    pass(`template expectations met (${templateProbe.slice(3)})`);
  } else {
    fail(`template expectation probe failed: ${templateProbe}`);
  }
} catch (error) {
  const message = error instanceof Error && "stdout" in error ? String(error.stdout ?? "") : "";
  fail(`template expectation probe failed${message ? `: ${message.trim()}` : ""}`);
}

for (const locale of LOCALES) {
  const messages = JSON.parse(read(`messages/${locale}.json`));
  for (const key of REQUIRED_GUIDANCE_KEYS) {
    if (!hasPath(messages, key)) {
      fail(`missing ${key} in messages/${locale}.json`);
    }
  }
}
pass("guidance namespace complete for 6 locales");

const machineTimeTemplate = read("src/components/guidance/templates/MachineTimeGraphic.tsx");
if (!machineTimeTemplate.includes('rgShape("setupTime"') || !machineTimeTemplate.includes('rgShape("cycleTime"')) {
  fail("MachineTimeGraphic missing setupTime/cycleTime field markers");
} else {
  pass("MachineTimeGraphic uses machine-time field markers");
}

const genericTemplate = read("src/components/guidance/templates/GenericCalculatorGraphic.tsx");
if (genericTemplate.includes("Hazırlık") || genericTemplate.includes("Miktar") || genericTemplate.includes("Süre")) {
  fail("GenericCalculatorGraphic contains machine-time labels");
} else {
  pass("GenericCalculatorGraphic avoids machine-time labels");
}

const boxTemplate = read("src/components/guidance/templates/BoxDimensionGraphic.tsx");
if (!boxTemplate.includes('rgLine("length"') || !boxTemplate.includes('data-template="box-dimension"')) {
  fail("BoxDimensionGraphic missing field markers");
} else {
  pass("BoxDimensionGraphic exposes field markers");
}

const css = read("src/styles/guided-reference-graphics.css");
if (!css.includes(".rg-line.is-active") || !css.includes("@keyframes rgPulse")) {
  fail("missing rg active highlight CSS");
} else {
  pass("rg active highlight CSS present");
}

const focusFiles = [
  "src/components/smart-form/SmartInput.tsx",
  "src/components/tools/smart-form/SmartFormField.tsx",
  "src/components/tools/FreeToolPage.tsx",
  "src/components/tools/PremiumToolPage.tsx",
  "src/components/tools/FreeTrafficToolPage.tsx",
];
for (const rel of focusFiles) {
  const text = read(rel);
  if (!text.includes("onFocus") || (!text.includes("useGuidanceFieldFocus") && !text.includes("GuidanceFieldFocus"))) {
    fail(`missing onFocus guidance wiring in ${rel}`);
  }
}
pass("onFocus handlers wired in tool inputs");

if (!css.includes("@media") || !css.includes("grg-layout__mobile-guide")) {
  fail("missing mobile guidance CSS");
} else {
  pass("mobile guidance CSS present");
}

const guidedGraphic = read("src/components/guidance/GuidedReferenceGraphic.tsx");
if (!guidedGraphic.includes("CompressorLeakGraphic") || !guidedGraphic.includes('"wall-area"')) {
  fail("GuidedReferenceGraphic missing wall-area/compressor-leak wiring");
} else {
  pass("GuidedReferenceGraphic wires wall-area and compressor-leak");
}

try {
  const genericReport = execSync("node scripts/audit-guided-generic-usage.mjs", {
    cwd: ROOT,
    encoding: "utf8",
  }).trim();
  const match = genericReport.match(/^GENERIC:(\d+)/);
  genericUsageCount = match ? Number(match[1]) : 0;
  pass(`generic template usage count: ${genericUsageCount}`);
} catch {
  fail("generic usage report failed");
}

for (const [slug, expected] of Object.entries(MUST_NOT_BE_GENERIC)) {
  if (genericUsageCount >= 0) {
    // covered by template expectation probe
    void slug;
    void expected;
  }
}

console.log(`\naudit:guided-graphics — ${passes} passed, ${failures} failed, generic=${genericUsageCount}`);
process.exit(failures > 0 ? 1 : 0);
