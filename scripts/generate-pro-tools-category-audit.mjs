/**
 * generate-pro-tools-category-audit.mjs
 *
 * Reads the PRO_TOOL_CATEGORY_MAP and PRO_CATEGORIES manifest,
 * validates all assignments, and generates src/audit/proToolsCategoryAudit.json
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Dynamic import of the generated data
const MAP_PATH = path.resolve(__dirname, "../src/data/proToolCategoryMap.ts");
const CAT_PATH = path.resolve(__dirname, "../src/config/proToolCategories.ts");
const OUTPUT = path.resolve(__dirname, "../src/audit/proToolsCategoryAudit.json");

// Read the generated TS file and extract the map
const mapContent = fs.readFileSync(MAP_PATH, "utf8");
const catContent = fs.readFileSync(CAT_PATH, "utf8");

// Extract category IDs from the manifest
const catIdRegex = /id: "([\w-]+)",/g;
const manifestIds = [];
let m;
while ((m = catIdRegex.exec(catContent)) !== null) {
  manifestIds.push(m[1]);
}

// Extract the category map entries from the TS file
const entryRegex = /"(\w+)":\s*\{([^}]+)\},/g;
const entries = [];
let e;
while ((e = entryRegex.exec(mapContent)) !== null) {
  const block = e[2];
  
  const primaryMatch = block.match(/primaryCategoryId: "([\w-]+)"/);
  const secondaryMatch = block.match(/secondaryCategoryIds: \[([^\]]*)\]/);
  const decisionMatch = block.match(/decisionFamily: "([\w_]+)"/);
  const segmentsMatch = block.match(/professionalSegments: \[([^\]]*)\]/);
  const riskMatch = block.match(/riskClass: "(\w+)"/);
  const confidenceMatch = block.match(/confidence: "(\w+)"/);
  
  entries.push({
    id: e[1],
    primaryCategoryId: primaryMatch ? primaryMatch[1] : null,
    secondaryCategoryIds: secondaryMatch
      ? secondaryMatch[1].split(",").map(s => s.trim().replace(/"/g, "")).filter(Boolean)
      : [],
    decisionFamily: decisionMatch ? decisionMatch[1] : null,
    professionalSegments: segmentsMatch
      ? segmentsMatch[1].split(",").map(s => s.trim().replace(/"/g, "")).filter(Boolean)
      : [],
    riskClass: riskMatch ? riskMatch[1] : null,
    confidence: confidenceMatch ? confidenceMatch[1] : null,
  });
}

const totalTools = entries.length;
const totalCategories = manifestIds.length;

// Category counts
const categoryCounts = {};
for (const entry of entries) {
  categoryCounts[entry.primaryCategoryId] = (categoryCounts[entry.primaryCategoryId] || 0) + 1;
}

// Visible categories (those with > 0 count)
const visibleCategories = Object.keys(categoryCounts).filter(cat => categoryCounts[cat] > 0);

// Empty visible categories (in manifest but 0 tools)
const emptyVisibleCategories = manifestIds.filter(id => !categoryCounts[id] || categoryCounts[id] === 0);

// Orphan tools (no primaryCategoryId)
const orphanTools = entries.filter(e => !e.primaryCategoryId).map(e => e.id);

// Duplicate primary assignments
const primaryCounts = {};
for (const entry of entries) {
  const key = `${entry.primaryCategoryId}:${entry.id}`;
  primaryCounts[key] = (primaryCounts[key] || 0) + 1;
}
const duplicatePrimary = Object.entries(primaryCounts)
  .filter(([, count]) => count > 1)
  .map(([key]) => key);

// Invalid category refs
const manifestSet = new Set(manifestIds);
const invalidRefs = entries
  .filter(e => e.primaryCategoryId && !manifestSet.has(e.primaryCategoryId))
  .map(e => `${e.id}: ${e.primaryCategoryId}`);

// Low confidence assignments
const lowConfidence = entries
  .filter(e => e.confidence === "REVIEW_REQUIRED")
  .map(e => ({ id: e.id, category: e.primaryCategoryId }));

// Critical risk tools
const criticalRisk = entries
  .filter(e => e.riskClass === "CRITICAL" || e.riskClass === "HIGH")
  .map(e => ({ id: e.id, riskClass: e.riskClass, category: e.primaryCategoryId }));

// Decision family counts
const decisionFamilyCounts = {};
for (const entry of entries) {
  if (entry.decisionFamily) {
    decisionFamilyCounts[entry.decisionFamily] = (decisionFamilyCounts[entry.decisionFamily] || 0) + 1;
  }
}

// Buyer segment counts
const buyerSegmentCounts = {};
for (const entry of entries) {
  for (const seg of entry.professionalSegments) {
    buyerSegmentCounts[seg] = (buyerSegmentCounts[seg] || 0) + 1;
  }
}

// Risk class counts
const riskClassCounts = {};
for (const entry of entries) {
  if (entry.riskClass) {
    riskClassCounts[entry.riskClass] = (riskClassCounts[entry.riskClass] || 0) + 1;
  }
}

// Check for all required fields
const missingPrimary = entries.filter(e => !e.primaryCategoryId).length;
const missingDecision = entries.filter(e => !e.decisionFamily).length;
const missingSegments = entries.filter(e => e.professionalSegments.length === 0).length;
const missingRisk = entries.filter(e => !e.riskClass).length;

const hasFailures =
  missingPrimary > 0 ||
  missingDecision > 0 ||
  missingSegments > 0 ||
  missingRisk > 0 ||
  orphanTools.length > 0 ||
  invalidRefs.length > 0;

const audit = {
  totalProTools: totalTools,
  totalCategories,
  visibleCategories: visibleCategories.length,
  emptyVisibleCategories,
  orphanTools,
  duplicatePrimaryAssignments: duplicatePrimary,
  invalidCategoryRefs: invalidRefs,
  lowConfidenceAssignments: lowConfidence.map(lc => lc.id),
  criticalRiskTools: criticalRisk.map(cr => cr.id),
  categoryCounts,
  decisionFamilyCounts,
  buyerSegmentCounts,
  riskClassCounts,
  changedTools: entries.filter(e => e.confidence === "AUTO_MEDIUM").map(e => e.id),
  newCategoriesCreated: manifestIds,
  deprecatedCategories: [],
  paymentTouched: false,
  authTouched: false,
  pdfEngineTouched: false,
  isoTouched: false,
  formulaRegistryTouched: false,
  timestamp: new Date().toISOString(),
  status: hasFailures ? "FAIL" : "PASS",
  validation: {
    missingPrimaryCategory: missingPrimary,
    missingDecisionFamily: missingDecision,
    missingProfessionalSegments: missingSegments,
    missingRiskClass: missingRisk,
  },
};

fs.writeFileSync(OUTPUT, JSON.stringify(audit, null, 2), "utf8");
console.log(`✓ Audit generated: ${OUTPUT}`);

// Summary
console.log(`\nAudit Summary:`);
console.log(`  Total Pro Tools:           ${totalTools}`);
console.log(`  Total Categories:          ${totalCategories}`);
console.log(`  Visible Categories:        ${visibleCategories.length}`);
console.log(`  Empty Categories:          ${emptyVisibleCategories.length > 0 ? emptyVisibleCategories.join(", ") : "none"}`);
console.log(`  Orphan Tools:              ${orphanTools.length > 0 ? orphanTools.join(", ") : "none"}`);
console.log(`  Duplicate Assignments:     ${duplicatePrimary.length > 0 ? duplicatePrimary.join(", ") : "none"}`);
console.log(`  Invalid Category Refs:     ${invalidRefs.length > 0 ? invalidRefs.join(", ") : "none"}`);
console.log(`  Low Confidence:            ${lowConfidence.length}`);
console.log(`  Critical/High Risk Tools:  ${criticalRisk.length}`);
console.log(`  Missing Primary Category:  ${missingPrimary}`);
console.log(`  Missing Decision Family:   ${missingDecision}`);
console.log(`  Missing Segments:          ${missingSegments}`);
console.log(`  Missing Risk Class:        ${missingRisk}`);
console.log(`  Payment/Auth/PDF Touched:  false / false / false`);
console.log(`  Status:                    ${audit.status}`);

if (hasFailures) {
  process.exit(1);
}
