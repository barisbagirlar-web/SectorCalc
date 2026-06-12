import fs from "node:fs";
import path from "node:path";
import { ROOT } from "./activation-paths.mjs";

const CONTRACTS_DIR = path.join(ROOT, "src/lib/formula-governance/contracts");
const LOCATOR_FILE = path.join(
  ROOT,
  "src/lib/formula-governance/oracle/production-formula-locator.ts",
);
const INDEX_FILE = path.join(ROOT, "public/ai-tool-index.json");

export function readToolIndex() {
  return JSON.parse(fs.readFileSync(INDEX_FILE, "utf8"));
}

export function hasFormulaContract(slug) {
  if (!fs.existsSync(CONTRACTS_DIR)) return false;

  const pattern = new RegExp(`slug:\\s*"${slug.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"`);
  for (const file of fs.readdirSync(CONTRACTS_DIR)) {
    if (!file.endsWith(".ts")) continue;
    const text = fs.readFileSync(path.join(CONTRACTS_DIR, file), "utf8");
    if (pattern.test(text)) return true;
  }

  return false;
}

export function hasExistingFormulaExpression(slug) {
  if (!fs.existsSync(LOCATOR_FILE)) return false;
  const text = fs.readFileSync(LOCATOR_FILE, "utf8");
  return text.includes(`slug: "${slug}"`) && text.includes("productionEntry:");
}

export function inferRiskLevel(slug, tool) {
  if (/pressure|safety|electrical|medical|tax|legal|regulated/i.test(slug)) {
    return "regulated";
  }

  if (/safety-critical|pressure-vessel|fall-protection/i.test(slug)) {
    return "safety-critical";
  }

  if (tool?.tier === "premium" || tool?.tier === "premium-schema") {
    return "medium";
  }

  return "low";
}

export function buildScanRecords(tools) {
  return tools.map((tool) => ({
    slug: tool.slug,
    routeStatus: tool.routeStatus,
    tier: tool.tier,
    hasFormulaContract: hasFormulaContract(tool.slug),
    hasExistingFormulaExpression: hasExistingFormulaExpression(tool.slug),
    riskLevel: inferRiskLevel(tool.slug, tool),
  }));
}

import { P53_REFERENCE_SLUG } from "./activation-paths.mjs";

export function resolveReferenceSelection(records) {
  const requestedReferenceSlug =
    process.env.TOOL_ACTIVATION_REFERENCE_SLUG || P53_REFERENCE_SLUG;

  const requestedReferenceTool = records.find((tool) => tool.slug === requestedReferenceSlug);

  if (!requestedReferenceTool) {
    throw new Error(
      `P53 reference slug not found in tool activation scan: ${requestedReferenceSlug}`,
    );
  }

  return {
    slug: requestedReferenceTool.slug,
    reason: [
      "P53 hard-locked reference tool selected.",
      `slug=${requestedReferenceTool.slug}`,
      `routeStatus=${requestedReferenceTool.routeStatus}`,
      `tier=${requestedReferenceTool.tier}`,
      `hasFormulaContract=${requestedReferenceTool.hasFormulaContract}`,
      `hasExistingFormulaExpression=${requestedReferenceTool.hasExistingFormulaExpression}`,
      `riskLevel=${requestedReferenceTool.riskLevel}`,
    ].join(" "),
    referenceHasActiveRoute: requestedReferenceTool.routeStatus === "active-route",
    referenceHasFormulaContract: Boolean(requestedReferenceTool.hasFormulaContract),
    referenceFormulaPreserved: Boolean(requestedReferenceTool.hasExistingFormulaExpression),
    record: requestedReferenceTool,
  };
}
