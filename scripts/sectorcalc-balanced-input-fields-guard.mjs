import fs from "node:fs";

const failures = [];

function fail(message) {
  failures.push(message);
}

function read(file) {
  return fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "";
}

function hasNonEnglishVisibleLabelRisk(text) {
  const labels = ["KESİN", "GÜÇLÜ", "ORTA", "EKSİK VERİ"];
  for (const label of labels) {
    const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const re = new RegExp(
      `(^|[^A-Za-zÇĞİÖŞÜçğıöşü])${escaped}($|[^A-Za-zÇĞİÖŞÜçğıöşü])`,
      "u",
    );
    if (re.test(text)) {
      return true;
    }
  }
  return false;
}

const marker = "SECTORCALC_BALANCED_INPUT_FIELDS_V1";

const styleTargets = [
  "src/styles/premium-dynamic-tool-form.css",
  "src/styles/free-tool-form.css",
  "src/styles/pro-tool-form.css",
];

for (const file of styleTargets) {
  if (!fs.existsSync(file)) {
    fail(`MISSING_STYLE_TARGET:${file}`);
    continue;
  }

  const css = read(file);

  if (!css.includes(marker)) {
    fail(`MISSING_BALANCED_INPUT_MARKER:${file}`);
  }

  if (!css.includes("--sc-field-min-width: 320px")) {
    fail(`MISSING_FIELD_MIN_WIDTH_TOKEN:${file}`);
  }

  if (!css.includes("--sc-field-min-height: 56px")) {
    fail(`MISSING_FIELD_MIN_HEIGHT_TOKEN:${file}`);
  }

  if (!css.includes("grid-template-columns: repeat(auto-fit, minmax(min(100%, var(--sc-field-min-width)), 1fr))")) {
    fail(`MISSING_SYMMETRIC_AUTO_FIT_GRID:${file}`);
  }

  if (!css.includes("min-height: var(--sc-field-min-height)")) {
    fail(`MISSING_MIN_TOUCH_HEIGHT:${file}`);
  }

  if (!css.includes("width: 100%")) {
    fail(`MISSING_FULL_WIDTH_INPUT_RULE:${file}`);
  }

  if (!css.includes("SECTORCALC_SAFE_STANDARD_RUNTIME_LAYOUT_V1")) {
    fail(`MISSING_SAFE_STANDARD_RUNTIME_LAYOUT_MARKER:${file}`);
  }

  if (hasNonEnglishVisibleLabelRisk(css)) {
    fail(`VISIBLE_NON_ENGLISH_LABEL_RISK:${file}`);
  }
}

const component = read("src/components/tools/UniversalDynamicToolForm.tsx");
if (!component.includes("sc-universal-dtf-shell")) {
  fail("UNIVERSAL_RENDERER_SHELL_MISSING");
}

const generatedView = read("src/components/tools/GeneratedToolFormView.tsx");
if (!generatedView.includes("<UniversalDynamicToolForm")) {
  fail("GENERATED_VIEW_NOT_USING_UNIVERSAL_RENDERER");
}
if (generatedView.includes("<FreeToolForm")) {
  fail("GENERATED_VIEW_STILL_RENDERING_FREE_TOOL_FORM_DIRECTLY");
}

const pkg = JSON.parse(read("package.json") || "{}");

if (pkg.scripts?.["guard:universal-renderer"] !== "node scripts/sectorcalc-universal-renderer-guard.mjs") {
  fail("PACKAGE_MISSING_UNIVERSAL_RENDERER_GUARD_SCRIPT");
}

if (pkg.scripts?.["guard:balanced-input-fields"] !== "node scripts/sectorcalc-balanced-input-fields-guard.mjs") {
  fail("PACKAGE_MISSING_BALANCED_INPUT_FIELDS_GUARD_SCRIPT");
}

console.log("UNIVERSAL_DYNAMIC_TOOL_FORM_RENDERER_REQUIRED=YES");
console.log("BALANCED_INPUT_FIELDS_REQUIRED=YES");
console.log("SHORT_INPUT_FIELDS_ALLOWED=NO");
console.log("SYMMETRIC_GRID_REQUIRED=YES");
console.log("FIELD_MIN_WIDTH=320PX");
console.log("FIELD_MIN_HEIGHT=56PX");
console.log("FIELD_TOUCH_TARGET=FIELD_SAFE");
console.log("FREE_AND_PRO_SCOPE=YES");
console.log("VISIBLE_LANGUAGE=ENGLISH_ONLY");
console.log(`BALANCED_INPUT_FIELD_FAILURE_COUNT=${failures.length}`);

for (const failure of failures) {
  console.log(`BALANCED_INPUT_FIELD_FAILURE=${failure}`);
}

if (failures.length > 0) {
  process.exit(1);
}

console.log("BALANCED_INPUT_FIELDS_GUARD_PASS=YES");
