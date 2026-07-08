#!/usr/bin/env node
/**
 * scripts/smoke-pro-tools-form-render.mjs
 *
 * Static analysis: verifies Pro tool form structure is correct.
 * Checks that the renderer produces premium Pro calculator output.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const failures = [];

// ── Check 1: Pro tool page uses proper gating ──
const proPageFile = path.join(ROOT, "src/app/tools/pro/[slug]/page.tsx");
const proPageContent = fs.readFileSync(proPageFile, "utf8");

if (!proPageContent.includes("ProToolPaywallGate")) {
  failures.push("PRO page must use ProToolPaywallGate");
}
if (!proPageContent.includes("ProToolSessionWrapper")) {
  failures.push("PRO page must use ProToolSessionWrapper");
}
if (!proPageContent.includes("ProToolAssistedDossier")) {
  failures.push("PRO page must reference ProToolAssistedDossier for blocked tools");
}

// ── Check 2: Form has entitlement/credit state for PRO ──
const formFile = path.join(ROOT, "src/sectorcalc/pro-form/UniversalIndustrialDecisionForm.tsx");
const formContent = fs.readFileSync(formFile, "utf8");

if (!formContent.includes("hasSession")) {
  failures.push("Form must track hasSession for PRO entitlement");
}
if (!formContent.includes("remainingRuns")) {
  failures.push("Form must track remainingRuns for PRO");
}
if (!formContent.includes("creditSessionLoading")) {
  failures.push("Form must track creditSessionLoading for PRO");
}
if (!formContent.includes("onRequestCreditSession")) {
  failures.push("Form must support onRequestCreditSession for PRO");
}

// ── Check 3: PRO has desktop cockpit layout ──
if (!formContent.includes("sc-v531-pro-cockpit")) {
  failures.push("PRO must have desktop cockpit layout");
}
if (!formContent.includes("sc-v531-cockpit-panel")) {
  failures.push("PRO must have cockpit panel");
}

// ── Check 4: PRO has Decision Summary, Primary Results, Intelligence sections ──
if (!formContent.includes("Decision Summary")) {
  failures.push("PRO must have Decision Summary section");
}
if (!formContent.includes("Primary Results")) {
  failures.push("PRO must have Primary Results section");
}

// ── Check 5: PRO has evidence controls ──
if (!formContent.includes("onEvidenceChange")) {
  failures.push("PRO must support evidence controls");
}
if (!formContent.includes("evidenceRequired")) {
  failures.push("PRO must track evidence requirement");
}

// ── Check 6: PRO has reference strips and tolerance ──
if (!formContent.includes("referenceStrip")) {
  failures.push("PRO must show reference strip per field");
}
if (!formContent.includes("tolerancePct")) {
  failures.push("PRO must show tolerance percentage");
}

// ── Check 7: PRO has Advanced details (audit trail, export) ──
if (!formContent.includes("ProAuditTrailSection")) {
  failures.push("PRO must have audit trail section");
}
if (!formContent.includes("ProExportSection")) {
  failures.push("PRO must have export section");
}

// ── Check 8: PRO desktop uses sticky cockpit right panel ──
const cssFile = path.join(ROOT, "src/sectorcalc/pro-form/universal-industrial-decision-form.css");
const cssContent = fs.readFileSync(cssFile, "utf8");
if (!cssContent.includes(".sc-v531-pro-cockpit-right")) {
  failures.push("CSS must have .sc-v531-pro-cockpit-right for sticky panel");
}
if (!cssContent.includes("position: sticky")) {
  failures.push("CSS cockpit-right must be sticky");
}

if (failures.length > 0) {
  console.error("PRO_TOOLS_FORM_RENDER=FAIL");
  failures.forEach(f => console.error(`  - ${f}`));
  process.exit(1);
}
console.log("PRO_TOOLS_FORM_RENDER=PASS");
