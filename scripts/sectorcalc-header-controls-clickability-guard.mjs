import fs from "node:fs";

const failures = [];

function fail(message) {
  failures.push(message);
}

function read(file) {
  return fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "";
}

const styleTargets = [
  "src/styles/premium-dynamic-tool-form.css",
  "src/styles/free-tool-form.css",
  "src/styles/pro-tool-form.css",
];

for (const file of styleTargets) {
  const css = read(file);

  if (!css.includes("SECTORCALC_HEADER_CONTROL_CLICK_TARGETS_V1")) {
    fail(`MISSING_HEADER_CLICK_TARGET_MARKER:${file}`);
  }

  if (!css.includes(".sc-mode-switch button")) {
    fail(`MISSING_MODE_SWITCH_BUTTON_CLICK_RULE:${file}`);
  }

  if (!css.includes("pointer-events: auto")) {
    fail(`MISSING_POINTER_EVENTS_AUTO:${file}`);
  }

  if (!css.includes("pointer-events: none")) {
    fail(`MISSING_PSEUDO_LAYER_POINTER_EVENTS_NONE:${file}`);
  }

  if (!css.includes("z-index: 41")) {
    fail(`MISSING_HEADER_CONTROL_Z_INDEX:${file}`);
  }

  if (css.includes('form[data-calculation-form="true"] .grid')) {
    fail(`BROAD_FORM_GRID_RULE_CAN_BLOCK_HEADER_CONTROLS:${file}`);
  }

  if (!css.includes("SECTORCALC_SAFE_STANDARD_RUNTIME_LAYOUT_V1")) {
    fail(`MISSING_SAFE_STANDARD_RUNTIME_LAYOUT_MARKER:${file}`);
  }
}

const component = read("src/components/tools/UniversalDynamicToolForm.tsx");

if (!component.includes('resolvedTier === "free" ? "standard" : "premium"')) {
  fail("UNIVERSAL_RENDERER_SAFE_RUNTIME_POLICY_MISSING");
}

if (component.includes("layout={layout}")) {
  fail("UNIVERSAL_RENDERER_STILL_DELEGATES_UNSAFE_LAYOUT");
}

const pkg = JSON.parse(read("package.json") || "{}");

if (pkg.scripts?.["guard:header-clickability"] !== "node scripts/sectorcalc-header-controls-clickability-guard.mjs") {
  fail("PACKAGE_MISSING_HEADER_CLICKABILITY_GUARD_SCRIPT");
}

console.log("HEADER_SELECTION_BUTTON_CLICK_TARGETS_REQUIRED=YES");
console.log("HEADER_Z_INDEX_LOCK_REQUIRED=YES");
console.log("POINTER_EVENTS_AUTO_REQUIRED=YES");
console.log("PSEUDO_LAYER_POINTER_EVENTS_NONE_REQUIRED=YES");
console.log("BROAD_FORM_GRID_RULE_ALLOWED=NO");
console.log(`HEADER_CLICKABILITY_FAILURE_COUNT=${failures.length}`);

for (const failure of failures) {
  console.log(`HEADER_CLICKABILITY_FAILURE=${failure}`);
}

if (failures.length > 0) {
  process.exit(1);
}

console.log("HEADER_CLICKABILITY_GUARD_PASS=YES");
