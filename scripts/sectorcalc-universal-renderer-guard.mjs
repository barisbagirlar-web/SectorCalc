import fs from "node:fs";

const failures = [];

function fail(message) {
  failures.push(message);
}

function read(file) {
  return fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "";
}

const componentFile = "src/components/tools/UniversalDynamicToolForm.tsx";
const generatedViewFile = "src/components/tools/GeneratedToolFormView.tsx";
const dynamicFormFile = "src/components/tools/DynamicToolForm.tsx";
const premiumLayoutFile = "src/components/tools/PremiumDynamicToolFormLayout.tsx";
const premiumFieldFile = "src/components/tools/PremiumDynamicToolFormField.tsx";
const resultPanelFile = "src/components/tools/ResultPanel.tsx";

for (const file of [
  dynamicFormFile,
  premiumLayoutFile,
  premiumFieldFile,
  resultPanelFile,
  generatedViewFile,
]) {
  if (!fs.existsSync(file)) {
    fail(`MISSING_REQUIRED_RENDERER_FILE:${file}`);
  }
}

if (!fs.existsSync(componentFile)) {
  fail("MISSING_UNIVERSAL_DYNAMIC_TOOL_FORM_COMPONENT");
} else {
  const component = read(componentFile);
  if (!component.includes("DynamicToolForm")) {
    fail("UNIVERSAL_COMPONENT_DOES_NOT_BRIDGE_DYNAMIC_TOOL_FORM");
  }
  if (!component.includes("sc-universal-dtf-shell")) {
    fail("UNIVERSAL_COMPONENT_MISSING_STANDARD_SHELL_CLASS");
  }

  if (!component.includes('const resolvedLayout = layout === "standard" ? "standard" : "premium";')) {
    fail("UNIVERSAL_COMPONENT_DOES_NOT_FORCE_SHARED_PREMIUM_LAYOUT");
  }
  if (component.includes("layout={layout}")) {
    fail("UNIVERSAL_COMPONENT_STILL_DELEGATES_TO_AUTO_LEGACY_LAYOUT");
  }
  if (!component.includes("layout={resolvedLayout}")) {
    fail("UNIVERSAL_COMPONENT_DOES_NOT_PASS_RESOLVED_LAYOUT");
  }
  if (!component.includes("data-universal-layout={resolvedLayout}")) {
    fail("UNIVERSAL_COMPONENT_MISSING_LAYOUT_TRACE_ATTRIBUTE");
  }
  if (/KESİN|GÜÇLÜ|ORTA|EKSİK VERİ|varsayım|karar|maliyet|denetim/i.test(component)) {
    fail("UNIVERSAL_COMPONENT_CONTAINS_NON_ENGLISH_VISIBLE_LABEL_RISK");
  }
}

const generatedView = read(generatedViewFile);

if (!generatedView.includes('import { UniversalDynamicToolForm } from "@/components/tools/UniversalDynamicToolForm";')) {
  fail("GENERATED_VIEW_DOES_NOT_IMPORT_UNIVERSAL_DYNAMIC_TOOL_FORM");
}

if (/import\s+\{\s*FreeToolForm\s*\}\s+from\s+["']@\/components\/tools\/FreeToolForm["'];/.test(generatedView)) {
  fail("GENERATED_VIEW_STILL_IMPORTS_FREE_TOOL_FORM_DIRECTLY");
}

if (!generatedView.includes("<UniversalDynamicToolForm")) {
  fail("GENERATED_VIEW_DOES_NOT_RENDER_UNIVERSAL_DYNAMIC_TOOL_FORM");
}

if (generatedView.includes("<FreeToolForm")) {
  fail("GENERATED_VIEW_STILL_RENDERS_FREE_TOOL_FORM_DIRECTLY");
}

for (const file of [
  "src/styles/premium-dynamic-tool-form.css",
  "src/styles/free-tool-form.css",
  "src/styles/pro-tool-form.css",
]) {
  if (!fs.existsSync(file)) {
    fail(`MISSING_STYLE_TARGET:${file}`);
    continue;
  }
  const css = read(file);
  if (!css.includes("SECTORCALC_UNIVERSAL_DYNAMIC_TOOL_FORM_V1")) {
    fail(`MISSING_UNIVERSAL_STYLE_MARKER:${file}`);
  }
}

const packageJson = JSON.parse(read("package.json"));
if (packageJson.scripts?.["guard:universal-renderer"] !== "node scripts/sectorcalc-universal-renderer-guard.mjs") {
  fail("PACKAGE_MISSING_UNIVERSAL_RENDERER_GUARD_SCRIPT");
}

console.log("UNIVERSAL_DYNAMIC_TOOL_FORM_RENDERER_REQUIRED=YES");
console.log("FREE_AND_PRO_SHARED_RENDERER=YES");
console.log("SCHEMA_DRIVEN_INPUTS=YES");
console.log("FORMULA_ENGINE_MODE=KEEP_EXISTING_ENGINES_AND_BRIDGE_UI");
console.log("RAW_HTML_DIRECT_APPLY=NO");
console.log("DEMO_TOOL_REGISTRY_COPY=NO");
console.log("INLINE_SCRIPT_COPY=NO");
console.log("VISIBLE_LANGUAGE=ENGLISH_ONLY");
console.log(`UNIVERSAL_RENDERER_FAILURE_COUNT=${failures.length}`);

for (const failure of failures) {
  console.log(`UNIVERSAL_RENDERER_FAILURE=${failure}`);
}

if (failures.length > 0) {
  process.exit(1);
}

console.log("UNIVERSAL_RENDERER_GUARD_PASS=YES");
