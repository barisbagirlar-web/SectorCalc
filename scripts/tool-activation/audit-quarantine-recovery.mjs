#!/usr/bin/env node
/**
 * P3 — Quarantine Recovery Engine.
 * Classifies QUARANTINE tools and recommends recovery actions.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ROOT } from "./lib/activation-paths.mjs";
import {
  CONTROL_PLANE_REPORT_PATH,
  FORMULA_KNOWLEDGE_GRAPH_PATH,
  RUNTIME_TRUST_REPORT_PATH,
  buildControlPlaneReport,
  buildFormulaKnowledgeGraph,
} from "./lib/p25-control-plane-lib.mjs";
import { P24_REPORT_PATH, buildP24ToolQualityReport } from "./lib/p24-tool-quality-lib.mjs";
import { hasFormulaContract, inferRiskLevel } from "./lib/activation-scan-lib.mjs";

const REPORT_PATH = path.join(ROOT, "scripts/.cache/quarantine-recovery-report.json");
const PROBLEM_SLUG = "abonelik-yazilim-cloud-yillik-maliyet-hesabi";

const ALLOWED_DEEPSEEK_TASKS = [
  "schema_draft",
  "validation_suggestion",
  "result_renderer_plan",
  "i18n_fix_suggestion",
  "unit_canonical_suggestion",
  "guide_spec_suggestion",
  "repair_plan",
];

const FORBIDDEN_DEEPSEEK_TASKS = [
  "formula_gate_final_decision",
  "payment_decision",
  "deploy_decision",
  "legal_certification_approval",
  "untested_auto_patch",
];

function readJson(filePath) {
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function readText(relativePath) {
  const absolute = path.join(ROOT, relativePath);
  if (!fs.existsSync(absolute)) return "";
  return fs.readFileSync(absolute, "utf8");
}

function buildGuideSpecIndex() {
  const content = readText("src/lib/tool-guides/premium-input-guide-specs.ts");
  const slugs = new Set();
  for (const match of content.matchAll(/slug:\s*"([^"]+)"/g)) {
    slugs.add(match[1]);
  }
  return slugs;
}

function normalizeRouteStatus(routeStatus) {
  if (routeStatus === "active-route") return "active";
  if (routeStatus === "category-only") return "category_stub";
  return routeStatus ?? "unknown";
}

function classifyRecoveryClass(tool, flags) {
  if (tool.routeStatus === "category-only" || tool.routeStatus === "category_stub") {
    return "category_stub";
  }
  if (
    flags.riskLevel === "safety-critical" ||
    flags.riskLevel === "regulated" ||
    flags.formulaAlignmentFail
  ) {
    return "manual_formula_review";
  }
  if (!flags.backing && tool.verdict === "QUARANTINE") {
    return "keep_safe_state";
  }
  if (tool.routeStatus === "active" || tool.routeStatus === "active-route") {
    if (!flags.hasSchema) return "schema_needed";
    if (!flags.hasValidation) return "validation_needed";
    if (!flags.hasResultRenderer) return "result_needed";
    if (!flags.hasFormulaContract) return "contract_needed";
    if (!flags.hasSubmitHandler) return "route_wiring";
    if (flags.missingLinks.length <= 1 && flags.missingLinks.length > 0) {
      return "ready_candidate";
    }
    if (flags.missingLinks.length === 0) return "ready_candidate";
    return "route_wiring";
  }
  if (!flags.hasSchema && !flags.hasCalculator) {
    return "category_stub";
  }
  if (!flags.hasSchema) return "schema_needed";
  if (!flags.hasValidation) return "validation_needed";
  if (!flags.hasResultRenderer) return "result_needed";
  if (!flags.hasFormulaContract) return "contract_needed";
  return "keep_safe_state";
}

function computeRepairDifficulty(recoveryClass, riskLevel, slug) {
  if (slug === PROBLEM_SLUG || riskLevel === "safety-critical" || riskLevel === "regulated") {
    return "critical";
  }
  if (recoveryClass === "manual_formula_review") return "critical";
  if (recoveryClass === "keep_safe_state") return "high";
  if (recoveryClass === "category_stub") return "low";
  if (recoveryClass === "ready_candidate") return "low";
  if (recoveryClass === "route_wiring") return "medium";
  if (recoveryClass === "schema_needed") return "high";
  return "medium";
}

function computeRevenuePotential(tool) {
  if (tool.tier === "premium" || tool.tier === "premium-schema") return "high";
  if (tool.tier === "free" && (tool.routeStatus === "active" || tool.routeStatus === "active-route")) {
    return "medium";
  }
  return "low";
}

function computeRecommendedAction(recoveryClass, repairDifficulty, slug) {
  if (slug === PROBLEM_SLUG) return "keep_quarantine";
  if (recoveryClass === "category_stub") return "category_only";
  if (recoveryClass === "manual_formula_review" || repairDifficulty === "critical") {
    return "manual_review";
  }
  if (recoveryClass === "keep_safe_state") return "keep_quarantine";
  if (recoveryClass === "ready_candidate" && repairDifficulty === "low") {
    return "recover_now";
  }
  if (
    ["schema_needed", "validation_needed", "result_needed", "contract_needed", "route_wiring"].includes(
      recoveryClass,
    ) &&
    repairDifficulty !== "critical"
  ) {
    return "send_to_batch";
  }
  return "manual_review";
}

function buildRequiredFiles(tool, recoveryClass, graphEntry) {
  const files = [];
  if (recoveryClass === "schema_needed" && !graphEntry?.schemaFile) {
    files.push(`src/lib/premium-schema/schemas/${tool.slug}.ts`);
  }
  if (recoveryClass === "validation_needed") {
    files.push(`src/lib/premium-schema/calculators/${tool.slug}-validation.ts`);
  }
  if (recoveryClass === "contract_needed") {
    files.push(`src/lib/formula-governance/contracts/${tool.slug}.ts`);
  }
  if (recoveryClass === "result_needed" && graphEntry?.schemaFile) {
    files.push(graphEntry.schemaFile);
  }
  return files;
}

function buildDeepSeekTasks(recoveryClass, recommendedAction) {
  if (recommendedAction === "keep_quarantine" || recommendedAction === "category_only") {
    return { allowed: [], forbidden: [...FORBIDDEN_DEEPSEEK_TASKS] };
  }
  if (recoveryClass === "manual_formula_review") {
    return { allowed: ["repair_plan"], forbidden: [...FORBIDDEN_DEEPSEEK_TASKS, "schema_draft"] };
  }

  const allowed = [...ALLOWED_DEEPSEEK_TASKS];
  if (recoveryClass === "schema_needed") {
    return { allowed: ["schema_draft", "repair_plan"], forbidden: FORBIDDEN_DEEPSEEK_TASKS };
  }
  if (recoveryClass === "validation_needed") {
    return { allowed: ["validation_suggestion", "repair_plan"], forbidden: FORBIDDEN_DEEPSEEK_TASKS };
  }
  if (recoveryClass === "result_needed") {
    return { allowed: ["result_renderer_plan", "repair_plan"], forbidden: FORBIDDEN_DEEPSEEK_TASKS };
  }
  return { allowed, forbidden: FORBIDDEN_DEEPSEEK_TASKS };
}

function buildQuarantineReasons(tool, p24Tool, trustItem, legacyConflicts) {
  const reasons = [];
  if (p24Tool?.verdict === "QUARANTINE") {
    reasons.push(`p24:${p24Tool.verdict}`);
  }
  for (const finding of p24Tool?.findings ?? []) {
    if (finding.severity === "fail" || finding.severity === "warn") {
      reasons.push(`${finding.checkId}:${finding.message ?? ""}`);
    }
  }
  if (trustItem?.status && trustItem.status !== "ready") {
    reasons.push(`ert:${trustItem.status}`);
  }
  for (const conflict of legacyConflicts) {
    reasons.push(`legacy:${conflict.id ?? conflict.note ?? "conflict"}`);
  }
  if (!p24Tool?.backing) {
    reasons.push("insufficient_backing_logic");
  }
  return [...new Set(reasons)];
}

function main() {
  const p24Report = readJson(P24_REPORT_PATH) ?? buildP24ToolQualityReport();
  const controlPlane =
    readJson(CONTROL_PLANE_REPORT_PATH) ??
    buildControlPlaneReport({ p24Report });
  const knowledgeGraph =
    readJson(FORMULA_KNOWLEDGE_GRAPH_PATH) ?? buildFormulaKnowledgeGraph();
  const trustReport = readJson(RUNTIME_TRUST_REPORT_PATH);
  const legacyReport = readJson(
    path.join(ROOT, "scripts/.cache/legacy-conflict-audit-report.json"),
  );

  const trustBySlug = new Map((trustReport?.items ?? []).map((item) => [item.slug, item]));
  const graphBySlug = new Map((knowledgeGraph?.tools ?? []).map((item) => [item.slug, item]));
  const controlBySlug = new Map((controlPlane?.tools ?? []).map((item) => [item.slug, item]));
  const legacyBySlug = new Map();

  for (const finding of legacyReport?.findings ?? legacyReport?.items ?? []) {
    const slug = finding.slug ?? finding.toolSlug;
    if (!slug) continue;
    const list = legacyBySlug.get(slug) ?? [];
    list.push(finding);
    legacyBySlug.set(slug, list);
  }

  const quarantineTools = (p24Report.tools ?? []).filter((tool) => tool.verdict === "QUARANTINE");
  const items = [];

  for (const p24Tool of quarantineTools) {
    const tool = {
      slug: p24Tool.slug,
      tier: p24Tool.tier,
      routeStatus: normalizeRouteStatus(p24Tool.routeStatus),
    };
    const graphEntry = graphBySlug.get(tool.slug);
    const controlEntry = controlBySlug.get(tool.slug);
    const trustItem = trustBySlug.get(tool.slug);
    const legacyConflicts = legacyBySlug.get(tool.slug) ?? [];
    const riskLevel = inferRiskLevel(tool.slug, p24Tool);

    const flags = {
      hasSchema: Boolean(graphEntry?.schemaFile),
      hasValidation: Boolean(graphEntry?.validationFile),
      hasFormulaContract: Boolean(graphEntry?.formulaContractSlug) || hasFormulaContract(tool.slug),
      hasResultRenderer: Boolean(graphEntry?.resultRenderer),
      hasSubmitHandler: Boolean(graphEntry?.submitHandler),
      hasCalculator: p24Tool.backing === true,
      backing: p24Tool.backing === true,
      missingLinks: graphEntry?.missingLinks ?? [],
      formulaAlignmentFail: (p24Tool.findings ?? []).some(
        (f) => f.checkId === "formulaContractAlignment" && f.severity === "fail",
      ),
      riskLevel,
    };

    const recoveryClass = classifyRecoveryClass(
      { ...tool, verdict: p24Tool.verdict },
      flags,
    );
    const repairDifficulty = computeRepairDifficulty(recoveryClass, riskLevel, tool.slug);
    const revenuePotential = computeRevenuePotential(tool);
    const recommendedAction = computeRecommendedAction(
      recoveryClass,
      repairDifficulty,
      tool.slug,
    );
    const deepSeek = buildDeepSeekTasks(recoveryClass, recommendedAction);

    items.push({
      slug: tool.slug,
      tier: tool.tier,
      routeStatus: tool.routeStatus,
      quarantineReason: buildQuarantineReasons(tool, p24Tool, trustItem, legacyConflicts),
      recoveryClass,
      repairDifficulty,
      revenuePotential,
      recommendedAction,
      requiredFiles: buildRequiredFiles(tool, recoveryClass, graphEntry),
      missingLinks: graphEntry?.missingLinks ?? controlEntry?.missingLinks ?? [],
      deepSeekAllowedTasks: deepSeek.allowed,
      deepSeekForbiddenTasks: deepSeek.forbidden,
    });
  }

  const summary = {
    totalQuarantine: items.length,
    recoverNow: items.filter((item) => item.recommendedAction === "recover_now").length,
    sendToBatch: items.filter((item) => item.recommendedAction === "send_to_batch").length,
    manualReview: items.filter((item) => item.recommendedAction === "manual_review").length,
    keepQuarantine: items.filter((item) => item.recommendedAction === "keep_quarantine").length,
    categoryOnly: items.filter((item) => item.recommendedAction === "category_only").length,
    byRecoveryClass: Object.fromEntries(
      [...new Set(items.map((item) => item.recoveryClass))].map((key) => [
        key,
        items.filter((item) => item.recoveryClass === key).length,
      ]),
    ),
  };

  const report = {
    generatedAt: new Date().toISOString(),
    problemSlug: PROBLEM_SLUG,
    summary,
    items,
  };

  fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
  fs.writeFileSync(REPORT_PATH, `${JSON.stringify(report, null, 2)}\n`, "utf8");

  console.log("audit:quarantine-recovery PASS");
  console.log(`totalQuarantine: ${summary.totalQuarantine}`);
  console.log(`recoverNow: ${summary.recoverNow}`);
  console.log(`sendToBatch: ${summary.sendToBatch}`);
  console.log(`manualReview: ${summary.manualReview}`);
  console.log(`keepQuarantine: ${summary.keepQuarantine}`);
  console.log(`categoryOnly: ${summary.categoryOnly}`);
  console.log(`output: ${path.relative(ROOT, REPORT_PATH)}`);
}

main();
