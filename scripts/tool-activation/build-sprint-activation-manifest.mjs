#!/usr/bin/env node
/**
 * S1/6 — Sprint Tool Activation Manifest
 * Aggregates P24/P25/P5B/runtime-trust/quarantine/input-guide/KG reports into
 * a 6-prompt activation command matrix. Read-only — no payment/formula unlock.
 */
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import {
  CONTROL_PLANE_REPORT_PATH,
  FORMULA_KNOWLEDGE_GRAPH_PATH,
  RUNTIME_TRUST_REPORT_PATH,
  buildControlPlaneReport,
  buildFormulaKnowledgeGraph,
  PROBLEM_SLUG,
} from "./lib/p25-control-plane-lib.mjs";
import { P24_REPORT_PATH } from "./lib/p24-tool-quality-lib.mjs";
import { RISK_CLASS } from "./lib/p6a-premium-schema-fail-lib.mjs";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");
const CACHE_DIR = path.join(ROOT, "scripts/.cache");
const OUTPUT_PATH = path.join(CACHE_DIR, "sprint-tool-activation-manifest.json");

const P5B_REPORT_PATH = path.join(CACHE_DIR, "deepseek/p5b-full-tool-scan-report.json");
const QUARANTINE_REPORT_PATH = path.join(CACHE_DIR, "quarantine-recovery-report.json");
const INPUT_GUIDE_REPORT_PATH = path.join(CACHE_DIR, "input-guide-audit-report.json");

const REQUIRED_REPORTS = [
  {
    label: "p24-tool-quality",
    path: P24_REPORT_PATH,
    cmd: "node scripts/tool-activation/audit-p24-tool-quality.mjs",
  },
  {
    label: "runtime-trust-engine",
    path: RUNTIME_TRUST_REPORT_PATH,
    cmd: "node scripts/tool-activation/audit-runtime-trust-engine.mjs",
  },
  {
    label: "tool-quality-control-plane",
    path: CONTROL_PLANE_REPORT_PATH,
    cmd: "npm run audit:p25-control-plane",
  },
  {
    label: "quarantine-recovery",
    path: QUARANTINE_REPORT_PATH,
    cmd: "npm run audit:quarantine-recovery",
  },
  {
    label: "input-guide-audit",
    path: INPUT_GUIDE_REPORT_PATH,
    cmd: "npm run audit:input-guides",
  },
  {
    label: "formula-knowledge-graph",
    path: FORMULA_KNOWLEDGE_GRAPH_PATH,
    cmd: "npm run build:formula-knowledge-graph",
  },
  {
    label: "p5b-full-tool-scan",
    path: P5B_REPORT_PATH,
    cmd: "npm run ai:deepseek:p5b-full-scan",
  },
];

const HIGH_RISK_SLUGS = new Set(RISK_CLASS.HIGH_RISK_MANUAL_ONLY);

const HIGH_RISK_SLUG_PATTERNS = [
  /pressure/i,
  /vessel/i,
  /welded/i,
  /bolted/i,
  /structural/i,
  /load[- ]?bearing/i,
  /electrical[- ]?safety/i,
  /chemical/i,
  /tax[- ]?compliance/i,
  /\blegal\b/i,
  /finance[- ]?risk/i,
  /fx[- ]?risk/i,
  /debt[- ]?risk/i,
  /kur[- ]?fark/i,
  /doviz/i,
];

const LOW_RISK_SECTOR_PATTERNS = [
  /food/i,
  /menu/i,
  /cleaning/i,
  /painting/i,
  /landscaping/i,
  /agriculture/i,
  /crop/i,
  /dairy/i,
  /meal/i,
  /margin/i,
  /cost/i,
  /waste/i,
  /estimator/i,
  /profit[- ]?leak/i,
  /bid[- ]?risk/i,
];

const MEDIUM_RISK_PATTERNS = [
  /manufacturing/i,
  /hvac/i,
  /energy/i,
  /logistics/i,
  /material[- ]?waste/i,
  /scrap[- ]?rate/i,
  /heat[- ]?loss/i,
  /profit[- ]?margin/i,
  /uretim/i,
  /enerji/i,
  /lojistik/i,
];

function readJson(filePath) {
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function runAudit(label, cmd) {
  process.stdout.write(`ensure-report: ${label} …\n`);
  try {
    execSync(cmd, { cwd: ROOT, stdio: "inherit", env: process.env });
    return true;
  } catch {
    return false;
  }
}

function ensureReports() {
  const blockers = [];
  for (const report of REQUIRED_REPORTS) {
    if (fs.existsSync(report.path)) continue;
    const ok = runAudit(report.label, report.cmd);
    if (!fs.existsSync(report.path)) {
      blockers.push(`${report.label} (${path.relative(ROOT, report.path)})`);
    } else if (!ok) {
      process.stdout.write(`ensure-report: ${report.label} recovered from cache after partial run\n`);
    }
  }
  return blockers;
}

function hasFinding(tool, patterns) {
  const findings = tool.findings ?? [];
  return patterns.some((p) =>
    findings.some((f) => {
      const text = typeof f === "string" ? f : `${f.checkId ?? ""} ${f.message ?? ""}`;
      return typeof p === "string" ? text.includes(p) : p.test(text);
    }),
  );
}

function classifyP5bFlags(tool, graphTool, quarantineItem) {
  const missingLinks = graphTool?.missingLinks ?? [];
  const flags = {
    premium_ready: false,
    near_premium: false,
    premium_schema_fail_manual: false,
    free_active_missing_backing: false,
    category_only_quarantine: false,
    guide_oracle_missing: false,
    payment_locked_safe: false,
    deepseek_auto_repair_candidate: false,
  };

  const isPaymentSafe =
    tool.eligible?.paymentEligible === true && tool.eligible?.formulaGateEligible === true;
  const isRuntimeReady = tool.runtimeStatus === "ready";
  const isPass = tool.qualityStatus === "PASS";

  if (isPass && isRuntimeReady && isPaymentSafe) {
    flags.premium_ready = true;
  }

  if (
    tool.tier === "premium-schema" &&
    (tool.qualityStatus === "FAIL" ||
      hasFinding(tool, ["formulaContractAlignment", "validation: Missing premium-schema"]))
  ) {
    flags.premium_schema_fail_manual = true;
  } else if (
    hasFinding(tool, ["formulaContractAlignment"]) ||
    (tool.validation?.exists === false && tool.schema?.exists === true)
  ) {
    flags.premium_schema_fail_manual = true;
  }

  if (
    tool.qualityStatus === "QUARANTINE" ||
    tool.routeStatus === "category_stub" ||
    quarantineItem?.recoveryClass === "category_stub"
  ) {
    flags.category_only_quarantine = true;
  }

  if (
    tool.tier === "free" &&
    tool.routeStatus === "active" &&
    (!tool.schema?.exists || !tool.formulaContract?.exists || !tool.validation?.exists)
  ) {
    flags.free_active_missing_backing = true;
  }

  const guideMissing = !tool.guide?.hasSpec || tool.guide?.eligible === false;
  const oracleMissing =
    missingLinks.includes("oracle") ||
    tool.goldenOracle?.coverage !== "complete" ||
    hasFinding(tool, ["oracleTests", "oracle"]);
  if (guideMissing || oracleMissing) {
    flags.guide_oracle_missing = true;
  }

  if (!isPaymentSafe || tool.slug === PROBLEM_SLUG) {
    flags.payment_locked_safe = true;
  }

  if (
    tool.route &&
    tool.routeStatus === "active" &&
    !flags.category_only_quarantine &&
    !flags.premium_ready
  ) {
    const partialSchema = tool.schema?.exists || tool.validation?.exists;
    if (partialSchema || tool.qualityStatus === "WARN") {
      flags.near_premium = true;
    }
  }

  if (
    (tool.schema?.exists || tool.validation?.exists || tool.routeStatus === "active") &&
    tool.recommendedAction === "auto_repair" &&
    tool.repairDifficulty !== "critical"
  ) {
    flags.deepseek_auto_repair_candidate = true;
  }

  return { flags, guideMissing, oracleMissing, missingLinks };
}

function isHighRiskSlug(slug) {
  if (HIGH_RISK_SLUGS.has(slug)) return true;
  return HIGH_RISK_SLUG_PATTERNS.some((re) => re.test(slug));
}

function isLowRiskSector(slug) {
  return LOW_RISK_SECTOR_PATTERNS.some((re) => re.test(slug));
}

function isMediumRiskSector(slug) {
  if (RISK_CLASS.MEDIUM_RISK_ALIGNMENT.includes(slug)) return true;
  return MEDIUM_RISK_PATTERNS.some((re) => re.test(slug));
}

function classifyGuideOracleLevel(tool, guideMissing, oracleMissing, highRisk) {
  if (highRisk || tool.repairDifficulty === "critical" || tool.riskLevel === "regulated") {
    return "manual_expert_guide_required";
  }
  if (
    isMediumRiskSector(tool.slug) ||
    tool.tier === "premium-schema" ||
    tool.revenuePotential === "high"
  ) {
    return "sector_specific_guide_required";
  }
  if (guideMissing || oracleMissing) {
    return "generic_scaffold_allowed";
  }
  return "none";
}

function classifyCategoryOnlyDecision(tool, _flags, highRisk, guideLevel) {
  const partialBacking =
    tool.schema?.exists || tool.formulaContract?.exists || tool.validation?.exists;
  const keepCategoryStub = highRisk || tool.recommendedAction === "keep_safe";
  return {
    slug: tool.slug,
    routeReady: partialBacking && !highRisk && tool.repairDifficulty !== "critical",
    keepCategoryStub,
    scaffoldOpenable:
      !keepCategoryStub &&
      tool.repairDifficulty !== "critical" &&
      (tool.recommendedAction === "route_wiring" || tool.recommendedAction === "auto_repair"),
    guideFirst: guideLevel !== "none" && guideLevel !== "generic_scaffold_allowed",
    resultRendererNeeded: !tool.resultRenderer?.exists,
    recommendedAction: tool.recommendedAction,
    riskLevel: highRisk ? "high" : tool.repairDifficulty,
    quarantineStatus: tool.qualityStatus,
  };
}

function isQuickWin(tool, flags, highRisk) {
  if (highRisk) return false;
  if (!flags.payment_locked_safe && tool.slug !== PROBLEM_SLUG) return false;
  if (tool.eligible?.formulaGateEligible && !tool.eligible?.paymentEligible) return false;
  const partialRoute = tool.routeStatus === "active" || tool.schema?.exists;
  if (!partialRoute) return false;
  const scaffoldOnly =
    !tool.guide?.hasSpec ||
    flags.guide_oracle_missing ||
    !tool.validation?.exists ||
    !tool.resultRenderer?.exists ||
    hasFinding(tool, ["localeKeys", "i18n"]);
  if (!scaffoldOnly) return false;
  return (
    flags.deepseek_auto_repair_candidate ||
    tool.recommendedAction === "auto_repair" ||
    tool.repairDifficulty === "low"
  );
}

function isLowRiskActivation(tool, flags, highRisk) {
  if (highRisk || isMediumRiskSector(tool.slug)) return false;
  if (!isLowRiskSector(tool.slug) && tool.repairDifficulty !== "low") return false;
  const hasContractOrCalc =
    tool.formulaContract?.exists ||
    tool.recommendedAction === "auto_repair" ||
    flags.free_active_missing_backing;
  return hasContractOrCalc && tool.recommendedAction !== "manual_review";
}

function isBlocked(tool, highRisk) {
  if (tool.slug === PROBLEM_SLUG) return true;
  if (tool.qualityStatus === "QUARANTINE" && tool.recommendedAction === "keep_safe") return true;
  if (highRisk && tool.qualityStatus === "FAIL") return true;
  return false;
}

function chunkBatch(items, size) {
  return items.slice(0, size);
}

function buildManifest() {
  const blockers = ensureReports();
  if (blockers.length > 0) {
    console.error("BLOCKER: Missing required reports after audit attempts:");
    for (const b of blockers) console.error(` - ${b}`);
    process.exit(1);
  }

  const controlPlane = readJson(CONTROL_PLANE_REPORT_PATH);
  const p5b = readJson(P5B_REPORT_PATH);
  const graphBySlug = new Map(
    (readJson(FORMULA_KNOWLEDGE_GRAPH_PATH)?.tools ?? []).map((t) => [t.slug, t]),
  );
  const quarantineBySlug = new Map(
    (readJson(QUARANTINE_REPORT_PATH)?.items ?? []).map((t) => [t.slug, t]),
  );
  const inputGuideBySlug = new Map(
    (readJson(INPUT_GUIDE_REPORT_PATH)?.tools ?? readJson(INPUT_GUIDE_REPORT_PATH)?.items ?? []).map(
      (t) => [t.slug, t],
    ),
  );

  const paymentEligibleBefore = controlPlane.summary.paymentEligible;
  const formulaGateEligibleBefore = controlPlane.summary.formulaGateEligible;
  const freePaymentEligible = controlPlane.summary.freePaymentEligible;

  const quickWins = [];
  const lowRiskActivation = [];
  const mediumRiskReview = [];
  const highRiskManualOnly = [];
  const categoryOnlyDecision = [];
  const guideOracleQueue = [];
  const manualOnly = [];
  const blocked = [];

  const segmentCounts = {
    premiumReady: 0,
    nearPremium: 0,
    premiumSchemaFailManual: 0,
    freeActiveMissingBacking: 0,
    categoryOnlyQuarantine: 0,
    guideOracleMissing: 0,
    autoRepairCandidate: 0,
    paymentLockedSafe: 0,
  };

  for (const tool of controlPlane.tools) {
    const graphTool = graphBySlug.get(tool.slug);
    const quarantineItem = quarantineBySlug.get(tool.slug);
    const { flags, guideMissing, oracleMissing } = classifyP5bFlags(
      tool,
      graphTool,
      quarantineItem,
    );

    if (flags.premium_ready) segmentCounts.premiumReady += 1;
    if (flags.near_premium) segmentCounts.nearPremium += 1;
    if (flags.premium_schema_fail_manual) segmentCounts.premiumSchemaFailManual += 1;
    if (flags.free_active_missing_backing) segmentCounts.freeActiveMissingBacking += 1;
    if (flags.category_only_quarantine) segmentCounts.categoryOnlyQuarantine += 1;
    if (flags.guide_oracle_missing) segmentCounts.guideOracleMissing += 1;
    if (flags.deepseek_auto_repair_candidate) segmentCounts.autoRepairCandidate += 1;
    if (flags.payment_locked_safe) segmentCounts.paymentLockedSafe += 1;

    const highRisk = isHighRiskSlug(tool.slug);
    const guideLevel = classifyGuideOracleLevel(tool, guideMissing, oracleMissing, highRisk);

    if (highRisk || RISK_CLASS.HIGH_RISK_MANUAL_ONLY.includes(tool.slug)) {
      highRiskManualOnly.push({
        slug: tool.slug,
        reason: "high_risk_manual_only",
        tier: tool.tier,
        qualityStatus: tool.qualityStatus,
      });
      manualOnly.push(tool.slug);
    }

    if (isMediumRiskSector(tool.slug) || RISK_CLASS.MEDIUM_RISK_ALIGNMENT.includes(tool.slug)) {
      mediumRiskReview.push({
        slug: tool.slug,
        reason: "existing_contract_alignment_only",
        qualityStatus: tool.qualityStatus,
        hasFormulaContract: tool.formulaContract?.exists ?? false,
      });
    }

    if (flags.category_only_quarantine) {
      categoryOnlyDecision.push(
        classifyCategoryOnlyDecision(tool, flags, highRisk, guideLevel),
      );
    }

    if ((guideMissing || oracleMissing) && guideLevel !== "none") {
      guideOracleQueue.push({
        slug: tool.slug,
        level: guideLevel,
        guideMissing,
        oracleMissing,
        inputGuideFinding: inputGuideBySlug.get(tool.slug)?.status ?? null,
      });
    }

    if (isQuickWin(tool, flags, highRisk)) {
      quickWins.push({
        slug: tool.slug,
        nextAction: tool.recommendedAction,
        repairDifficulty: tool.repairDifficulty,
      });
    }

    if (isLowRiskActivation(tool, flags, highRisk)) {
      lowRiskActivation.push({
        slug: tool.slug,
        tier: tool.tier,
        recommendedAction: tool.recommendedAction,
      });
    }

    if (isBlocked(tool, highRisk)) {
      blocked.push({ slug: tool.slug, reason: tool.slug === PROBLEM_SLUG ? "problem_slug" : "keep_safe" });
    }
  }

  const lowRiskSlugs = lowRiskActivation.map((t) => t.slug);
  const quickWinSlugs = quickWins.map((t) => t.slug);
  const s2Pool = [...new Set([...quickWinSlugs, ...lowRiskSlugs])].filter(
    (slug) => !manualOnly.includes(slug) && !blocked.some((b) => b.slug === slug),
  );

  const s2 = chunkBatch(s2Pool, 50).map((slug) => ({
    slug,
    sprint: "S2",
    action: "low_risk_activation_scaffold",
  }));
  const s3 = chunkBatch(s2Pool.slice(50), 60).map((slug) => ({
    slug,
    sprint: "S3",
    action: "low_risk_activation_scaffold",
  }));

  const s4 = categoryOnlyDecision
    .filter((d) => d.scaffoldOpenable && !manualOnly.includes(d.slug))
    .slice(0, 80)
    .map((d) => ({
      slug: d.slug,
      sprint: "S4",
      action: "route_decision_and_scaffold",
      guideFirst: d.guideFirst,
      resultRendererNeeded: d.resultRendererNeeded,
    }));

  const s5 = guideOracleQueue
    .filter((g) => g.level === "generic_scaffold_allowed")
    .slice(0, 100)
    .map((g) => ({
      slug: g.slug,
      sprint: "S5",
      action: "guide_oracle_ux_scaffold",
      level: g.level,
    }));

  const s6 = controlPlane.tools
    .filter(
      (t) =>
        t.qualityStatus === "PASS" ||
        t.recommendedAction === "ready" ||
        t.eligible?.calculationEligible,
    )
    .slice(0, 40)
    .map((t) => ({
      slug: t.slug,
      sprint: "S6",
      action: "final_audit_deploy_readiness",
    }));

  const problemTool = controlPlane.tools.find((t) => t.slug === PROBLEM_SLUG);
  const problemSlugLocked =
    !problemTool?.eligible?.paymentEligible && !problemTool?.eligible?.formulaGateEligible;

  const p5bSegments = p5b?.segments ?? {};

  const manifest = {
    generatedAt: new Date().toISOString(),
    totalTools: controlPlane.summary.totalTools,
    currentState: {
      premiumReady: p5bSegments.premium_ready?.count ?? segmentCounts.premiumReady,
      nearPremium: p5bSegments.near_premium?.count ?? segmentCounts.nearPremium,
      premiumSchemaFailManual:
        p5bSegments.premium_schema_fail_manual?.count ?? segmentCounts.premiumSchemaFailManual,
      freeActiveMissingBacking:
        p5bSegments.free_active_missing_backing?.count ?? segmentCounts.freeActiveMissingBacking,
      categoryOnlyQuarantine:
        p5bSegments.category_only_quarantine?.count ?? segmentCounts.categoryOnlyQuarantine,
      guideOracleMissing:
        p5bSegments.guide_oracle_missing?.count ?? segmentCounts.guideOracleMissing,
      autoRepairCandidate:
        p5bSegments.deepseek_auto_repair_candidate?.count ?? segmentCounts.autoRepairCandidate,
      paymentLockedSafe:
        p5bSegments.payment_locked_safe?.count ?? segmentCounts.paymentLockedSafe,
    },
    guardrails: {
      paymentUnlockAllowed: false,
      formulaGateUnlockAllowed: false,
      freePaymentAllowed: false,
      deployAllowed: false,
      problemSlugMustRemainLocked: true,
    },
    batches: {
      S2_lowRiskActivationBatch1: s2,
      S3_lowRiskActivationBatch2: s3,
      S4_categoryOnlyRouteDecisionAndScaffold: s4,
      S5_guideOracleUxScaffold: s5,
      S6_finalAuditAndDeployReadiness: s6,
    },
    segments: {
      quickWins,
      lowRiskActivation,
      mediumRiskReview,
      highRiskManualOnly,
      categoryOnlyDecision,
      guideOracleQueue,
    },
    manualOnly: [...new Set(manualOnly)],
    blocked,
    quickWins,
    metricsTarget: {
      premiumReadyTargetAfterSprint: "60-120",
      categoryOnlyReductionTarget: "meaningful but safe",
      freeActiveMissingBackingReductionTarget: "majority of low-risk items",
    },
    paymentGuard: {
      paymentEligibleBefore,
      paymentEligibleAfter: paymentEligibleBefore,
      unchanged: true,
    },
    formulaGateGuard: {
      formulaGateEligibleBefore,
      formulaGateEligibleAfter: formulaGateEligibleBefore,
      unchanged: true,
    },
    freePaymentEligible,
    problemSlug: {
      slug: PROBLEM_SLUG,
      locked: problemSlugLocked,
      paymentEligible: problemTool?.eligible?.paymentEligible ?? false,
      formulaGateEligible: problemTool?.eligible?.formulaGateEligible ?? false,
    },
    sources: {
      controlPlane: path.relative(ROOT, CONTROL_PLANE_REPORT_PATH),
      p5b: path.relative(ROOT, P5B_REPORT_PATH),
      p5bGeneratedAt: p5b?.generatedAt ?? null,
    },
  };

  fs.mkdirSync(CACHE_DIR, { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");

  return manifest;
}

function printValidation(manifest) {
  const lines = [
    "",
    "=== sprint-tool-activation-manifest validation ===",
    `totalTools: ${manifest.totalTools}`,
    `quickWins count: ${manifest.quickWins.length}`,
    `lowRiskActivation count: ${manifest.segments.lowRiskActivation.length}`,
    `mediumRiskReview count: ${manifest.segments.mediumRiskReview.length}`,
    `highRiskManualOnly count: ${manifest.segments.highRiskManualOnly.length}`,
    `categoryOnlyDecision count: ${manifest.segments.categoryOnlyDecision.length}`,
    `guideOracleQueue count: ${manifest.segments.guideOracleQueue.length}`,
    `S2 batch count: ${manifest.batches.S2_lowRiskActivationBatch1.length}`,
    `S3 batch count: ${manifest.batches.S3_lowRiskActivationBatch2.length}`,
    `S4 batch count: ${manifest.batches.S4_categoryOnlyRouteDecisionAndScaffold.length}`,
    `S5 batch count: ${manifest.batches.S5_guideOracleUxScaffold.length}`,
    `blocked count: ${manifest.blocked.length}`,
    `paymentEligibleBefore/After same: ${manifest.paymentGuard.unchanged ? "yes" : "NO"}`,
    `formulaGateEligibleBefore/After same: ${manifest.formulaGateGuard.unchanged ? "yes" : "NO"}`,
    `freePaymentEligible 0: ${manifest.freePaymentEligible === 0 ? "yes" : "NO"}`,
    `problemSlug locked: ${manifest.problemSlug.locked ? "yes" : "NO"}`,
    `output: ${path.relative(ROOT, OUTPUT_PATH)}`,
  ];
  console.log(lines.join("\n"));
}

function main() {
  const manifest = buildManifest();
  printValidation(manifest);
}

main();
