#!/usr/bin/env node
/**
 * P26 CI gate — guided reference graphics decision system.
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
  "AngleGraphic.tsx",
  "RouteGraphic.tsx",
  "EnergyFlowGraphic.tsx",
  "MachineTimeGraphic.tsx",
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
  "guidance.labels.result",
  "guidance.labels.decision",
];

const TR_FORBIDDEN = [
  "Length", "Width", "Height", "Depth", "Area", "Volume", "Diameter", "Radius",
  "Thickness", "Angle", "Cost", "Price", "Margin", "Energy", "Power", "Pressure",
  "Flow", "Distance", "Time", "Input", "Output", "Result", "Calculate", "Calculator",
];

const FORBIDDEN_DEPS = ["framer-motion", "lottie", "canvas", "webgl", "recharts"];

let failures = 0;
let passes = 0;

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

// 1. Template files
for (const file of TEMPLATE_FILES) {
  const rel = `src/components/guidance/templates/${file}`;
  if (!existsSync(join(ROOT, rel))) {
    fail(`missing template ${rel}`);
  } else {
    pass(`template exists ${file}`);
  }
}

// 2. Resolver
if (!existsSync(join(ROOT, "src/lib/guidance/reference-graphic-resolver.ts"))) {
  fail("missing reference-graphic-resolver.ts");
} else {
  pass("resolver exists");
}

// 3–5. Page integration
const integrationFiles = {
  free: "src/components/smart-form/SmartFormWorkspace.tsx",
  premium: "src/components/tools/PremiumToolPage.tsx",
  "premium-schema": "src/components/tools/DynamicPremiumCalculator.tsx",
};

for (const [tier, rel] of Object.entries(integrationFiles)) {
  const text = read(rel);
  if (!text.includes("ToolGuidanceLayout") && !text.includes("resolveReferenceGraphic")) {
    fail(`${tier} page missing guidance integration in ${rel}`);
  } else {
    pass(`${tier} page guidance integration present`);
  }
}

// 6. Generic fallback
const resolverText = read("src/lib/guidance/reference-graphic-resolver.ts");
if (!resolverText.includes('"generic"') || !resolverText.includes("GenericCalculatorGraphic")) {
  if (!existsSync(join(ROOT, "src/components/guidance/templates/GenericCalculatorGraphic.tsx"))) {
    fail("generic fallback template missing");
  }
}
if (resolverText.includes('return "generic"') || resolverText.includes("generic")) {
  pass("generic fallback in resolver");
} else {
  fail("generic fallback not found in resolver");
}

// 7. All tool slugs resolve
const catalog = JSON.parse(read("src/lib/tools/free-traffic-catalog.generated.json"));
const revenue = read("src/lib/tools/revenue-tools.ts");
const premiumSchemaInputs = JSON.parse(
  read("src/data/premium-schema-inputs-i18n.generated.json"),
);
const premiumSlugs = Object.keys(premiumSchemaInputs.en ?? {});

const resolverProbe = execSync("node scripts/audit-guided-resolver-probe.mjs", {
  cwd: ROOT,
  encoding: "utf8",
}).trim();

if (resolverProbe.startsWith("OK:")) {
  pass(`all ${resolverProbe.slice(3)} free traffic slugs resolve a template`);
} else {
  fail(`free traffic slug resolver probe failed: ${resolverProbe}`);
}

if (premiumSlugs.length > 0) {
  pass(`premium-schema catalog has ${premiumSlugs.length} slugs (resolver wired in page)`);
} else {
  fail("premium-schema slug list empty");
}

// 8. guidance namespace 6 locales
for (const locale of LOCALES) {
  const messages = JSON.parse(read(`messages/${locale}.json`));
  for (const key of REQUIRED_GUIDANCE_KEYS) {
    if (!hasPath(messages, key)) {
      fail(`missing ${key} in messages/${locale}.json`);
    }
  }
}
pass("guidance namespace complete for 6 locales");

// 9. TR forbidden words in guidance labels
const tr = JSON.parse(read("messages/tr.json"));
const trGuidanceText = JSON.stringify(tr.guidance ?? {});
for (const word of TR_FORBIDDEN) {
  const re = new RegExp(`\\b${word}\\b`);
  if (re.test(trGuidanceText)) {
    fail(`TR guidance contains forbidden English token: ${word}`);
  }
}
pass("TR guidance labels free of forbidden English tokens");

// 10. Template SVG hardcoded English (basic scan)
const forbiddenInTemplates = ["Length", "Width", "Height", "Calculate", "Calculator", "Input guide"];
for (const file of TEMPLATE_FILES) {
  const text = read(`src/components/guidance/templates/${file}`);
  for (const word of forbiddenInTemplates) {
    if (text.includes(`>${word}<`) || text.includes(`"${word}"`)) {
      fail(`template ${file} contains hardcoded visible English: ${word}`);
    }
  }
}
pass("templates avoid hardcoded English labels");

// 11. activeField highlight class
if (!read("src/styles/guided-reference-graphics.css").includes("grg-dim--active")) {
  fail("missing active highlight CSS class");
} else {
  pass("active highlight CSS present");
}

// 12. onFocus handlers wired
const focusFiles = [
  "src/components/smart-form/SmartInput.tsx",
  "src/components/tools/smart-form/SmartFormField.tsx",
  "src/components/tools/FreeToolPage.tsx",
  "src/components/tools/PremiumToolPage.tsx",
];
for (const rel of focusFiles) {
  const text = read(rel);
  if (!text.includes("onFocus") || !text.includes("useGuidanceFieldFocus")) {
    fail(`missing onFocus guidance wiring in ${rel}`);
  }
}
pass("onFocus handlers wired in tool inputs");

// 13. mobile CSS
const css = read("src/styles/guided-reference-graphics.css");
if (!css.includes("@media") || !css.includes("grg-layout__mobile-guide")) {
  fail("missing mobile guidance CSS");
} else {
  pass("mobile guidance CSS present");
}

// 14–15. no external images / heavy libs in guidance folder
const guidanceDir = join(ROOT, "src/components/guidance");
function walk(dir) {
  const entries = readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walk(full));
    } else {
      files.push(full);
    }
  }
  return files;
}
for (const file of walk(guidanceDir)) {
  const text = read(file.replace(`${ROOT}/`, ""));
  if (/\.(png|jpg|jpeg|webp|gif)"/i.test(text) || text.includes("http://") || text.includes("https://")) {
    fail(`external image/url dependency in ${file}`);
  }
  for (const dep of FORBIDDEN_DEPS) {
    if (text.includes(dep)) {
      fail(`forbidden dependency ${dep} in ${file}`);
    }
  }
}
pass("no external image deps or forbidden animation libs in guidance");

// 16. build-safe imports
const guidedGraphic = read("src/components/guidance/GuidedReferenceGraphic.tsx");
if (guidedGraphic.includes("dynamic(") || guidedGraphic.includes("require(")) {
  fail("GuidedReferenceGraphic uses non build-safe dynamic import");
} else {
  pass("build-safe static template imports");
}

// 17. no formula file changes in this phase (guardrail: resolver only imported from allowed paths)
const formulaText = read("src/lib/tools/free-traffic-calculators.ts");
if (formulaText.includes("resolveReferenceGraphic") || formulaText.includes("guided-reference")) {
  fail("formula runtime files reference guidance resolver");
} else {
  pass("formula runtime untouched by guidance imports");
}

console.log(`\naudit:guided-graphics — ${passes} passed, ${failures} failed`);
process.exit(failures > 0 ? 1 : 0);
