#!/usr/bin/env node
// SectorCalc Guard: FREE / PRO / Assisted Mode Split Correctness
// Verifies that the form renderer correctly distinguishes between modes.
import fs from "node:fs";
import path from "node:path";
const ROOT = process.cwd();
const failures = [];

// 1. UniversalIndustrialDecisionForm must have accessTier prop and FREE/PRO split
const formFile = path.join(ROOT, "src/sectorcalc/pro-form/UniversalIndustrialDecisionForm.tsx");
const formContent = fs.readFileSync(formFile, "utf8");

if (!formContent.includes('accessTier?: "FREE" | "PRO"')) {
  failures.push("Form must declare accessTier prop as FREE | PRO");
}
if (!formContent.includes('effectiveAccessTier')) {
  failures.push("Form must compute effectiveAccessTier");
}
if (!formContent.includes('isFreeTier')) {
  failures.push("Form must define isFreeTier flag");
}
if (!formContent.includes('"FREE"')) {
  failures.push("Form must reference FREE mode string");
}
if (!formContent.includes('"PRO"')) {
  failures.push("Form must reference PRO mode string");
}

// 2. FREE mode must not show BLOCKED status or evidence controls or reference strips
const freeModeBlockers = [
  "basePreview: isFree ? null :",
  "referenceSource: isFree ? null :",
  "tolerancePct: isFree ? null :",
  "referenceStrip: isFree ? [] :",
  "isFreeTier",
];
for (const blocker of freeModeBlockers) {
  if (!formContent.includes(blocker)) {
    failures.push(`FREE mode guard missing: ${blocker}`);
  }
}

// 3. Pro tool page must differentiate BLOCKED_SOURCE_REQUIRED (assisted) vs BLOCKED_RUNTIME (assisted) vs normal PRO
const proPageFile = path.join(ROOT, "src/app/tools/pro/[slug]/page.tsx");
const proPageContent = fs.readFileSync(proPageFile, "utf8");
if (!proPageContent.includes("ProToolAssistedDossier")) {
  failures.push("PRO page must use ProToolAssistedDossier for blocked tools");
}
if (!proPageContent.includes("ProToolPaywallGate")) {
  failures.push("PRO page must use ProToolPaywallGate for paywall");
}
if (!proPageContent.includes("ProToolSessionWrapper")) {
  failures.push("PRO page must use ProToolSessionWrapper for session management");
}

// 4. Free tool page must NOT have paywall or credit gating
const freePageFile = path.join(ROOT, "src/app/tools/free/[slug]/page.tsx");
const freePageContent = fs.readFileSync(freePageFile, "utf8");
if (freePageContent.includes("ProToolPaywallGate")) {
  failures.push("FREE page must NOT use ProToolPaywallGate");
}

// 5. CSS must have FREE/PRO data attribute targeting
const cssFile = path.join(ROOT, "src/sectorcalc/pro-form/universal-industrial-decision-form.css");
const cssContent = fs.readFileSync(cssFile, "utf8");
if (!cssContent.includes('data-access-tier="FREE"')) {
  failures.push("CSS must target [data-access-tier=\"FREE\"]");
}

if (failures.length > 0) {
  console.error("FORM_MODE_SPLIT=FAIL\n" + failures.join("\n"));
  process.exit(1);
}
console.log("FORM_MODE_SPLIT=PASS");
