import fs from "node:fs";
import path from "node:path";
import { ROOT } from "./activation-paths.mjs";
import {
  P24_REPORT_PATH,
  buildIndexes,
  buildP24ToolQualityReport,
} from "./p24-tool-quality-lib.mjs";
import { hasFormulaContract, inferRiskLevel } from "./activation-scan-lib.mjs";
import { LEGACY_CONFLICT_REPORT_PATH } from "./legacy-conflict-audit-lib.mjs";

export const CONTROL_PLANE_REPORT_PATH = path.join(
  ROOT,
  "scripts/.cache/tool-quality-control-plane.json",
);
export const FORMULA_KNOWLEDGE_GRAPH_PATH = path.join(
  ROOT,
  "scripts/.cache/formula-knowledge-graph.json",
);
export const RUNTIME_TRUST_REPORT_PATH = path.join(
  ROOT,
  "scripts/.cache/runtime-trust-engine-report.json",
);
export const DEEPSEEK_TOOL_CONTEXT_PATH = path.join(
  ROOT,
  "scripts/.cache/deepseek/tool-context-for-repair.json",
);
export const DEEPSEEK_FORMULA_AUDIT_PATH = path.join(
  ROOT,
  "scripts/.cache/deepseek/formula-audit-suggestions.json",
);

export const PROBLEM_SLUG = "abonelik-yazilim-cloud-yillik-maliyet-hesabi";

const LOCALE_FILES = {
  en: path.join(ROOT, "messages/en.json"),
};

const GENERIC_LABEL_PATTERNS = [
  /^input\s*\d*$/i,
  /^value\s*\d*$/i,
  /^amount$/i,
  /^field\s*\d*$/i,
  /^parameter$/i,
];

const FORBIDDEN_DEEPSEEK_TASKS = [
  "formula_gate_final_decision",
  "payment_decision",
  "deploy_decision",
  "legal_certification_approval",
  "untested_auto_patch",
];

const ALLOWED_DEEPSEEK_TASKS = [
  "schema_draft",
  "validation_suggestion",
  "result_renderer_plan",
  "i18n_fix_suggestion",
  "unit_canonical_suggestion",
  "guide_spec_suggestion",
  "repair_plan",
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

function normalizeRouteStatus(routeStatus) {
  if (routeStatus === "active-route") return "active";
  if (routeStatus === "category-only") return "category_stub";
  if (!routeStatus || routeStatus === "unknown") return "unknown";
  return routeStatus;
}

function buildGuideSpecIndex() {
  const content = readText("src/lib/tool-guides/premium-input-guide-specs.ts");
  const slugs = new Set();
  for (const match of content.matchAll(/slug:\s*"([^"]+)"/g)) {
    slugs.add(match[1]);
  }
  return slugs;
}

function buildRevenuePaidSlugs() {
  const slugs = new Set();
  const files = [
    "src/lib/tools/revenue-tools.ts",
    "src/lib/tools/revenue-tools-phase2.ts",
    "src/lib/tools/revenue-tools-additional.ts",
  ];
  for (const relativePath of files) {
    const content = readText(relativePath);
    for (const match of content.matchAll(/paidSlug:\s*"([^"]+)"/g)) {
      slugs.add(match[1]);
    }
  }
  return slugs;
}

function buildPremiumDecisionContractSlugs() {
  const content = readText("src/lib/tools/premium-tool-contracts.ts");
  const slugs = new Set();
  for (const match of content.matchAll(/"([a-z0-9][a-z0-9-]+)":\s*\{/g)) {
    slugs.add(match[1]);
  }
  return slugs;
}

function hasCalculatorImplementation(slug, indexes) {
  if (indexes.freeTrafficCalculatorSlugs.has(slug)) return true;
  if (indexes.revenuePairs.freeToPaid.has(slug)) return true;
  if (indexes.legacyCalculatorSlugs.has(slug)) return true;
  if (slug.endsWith("-check") && indexes.freeTrafficCalculatorSlugs.has(slug.replace(/-check$/, "-calculator"))) {
    return true;
  }
  if (slug.endsWith("-cost-check") && indexes.freeTrafficCalculatorSlugs.has(slug.replace(/-cost-check$/, "-calculator"))) {
    return true;
  }
  if (slug.endsWith("-m2") && indexes.freeTrafficCalculatorSlugs.has(`${slug}-calculator`)) {
    return true;
  }
  return false;
}

function detectSubmitHandler(slug, indexes, schema, contract) {
  if (schema) {
    return { exists: true, handler: "premium-schema-engine", path: schema.path };
  }
  if (indexes.validationSlugs.has(slug)) {
    return { exists: true, handler: "premium-schema-validation", path: `calculators/${slug}-validation.ts` };
  }
  if (indexes.premiumDecisionContracts.has(slug)) {
    return { exists: true, handler: "premium-decision-engine", path: "premium-tool-contracts" };
  }
  if (indexes.revenuePaidSlugs.has(slug)) {
    return { exists: true, handler: "premium-tool-results", path: "premium-tool-results.ts" };
  }
  if (hasCalculatorImplementation(slug, indexes)) {
    return { exists: true, handler: "free-calculator", path: "free-traffic-calculators" };
  }
  if (contract) {
    return { exists: true, handler: "formula-contract", path: contract.path };
  }
  return { exists: false, handler: null, path: null };
}

function detectResultRenderer(slug, schema, indexes) {
  if (schema) {
    const content = readText(schema.path);
    const outputIds = schema.outputs.map((o) => o.id);
    const hasBigNumber = content.includes("bigNumber") || content.includes("primaryMetric");
    const placeholderOnly = outputIds.length > 0 && !hasBigNumber && !content.includes("reportSections");
    const missingOutputs = outputIds.length === 0 ? ["primary-output"] : [];
    return {
      exists: outputIds.length > 0 || hasBigNumber,
      placeholderOnly,
      renderer: schema.path,
      missingOutputs,
    };
  }
  if (indexes.premiumDecisionContracts.has(slug) || indexes.revenuePaidSlugs.has(slug)) {
    return {
      exists: true,
      placeholderOnly: false,
      renderer: "premium-tool-results",
      missingOutputs: [],
    };
  }
  if (hasCalculatorImplementation(slug, indexes)) {
    return {
      exists: true,
      placeholderOnly: false,
      renderer: "free-tool-result",
      missingOutputs: [],
    };
  }
  return { exists: false, placeholderOnly: false, renderer: null, missingOutputs: ["result"] };
}

function auditI18n(slug, indexes) {
  const missingLocales = [];
  const suspiciousKeys = [];
  let mixedLabel = false;
  let rtlSafe = true;

  for (const [locale, filePath] of Object.entries(LOCALE_FILES)) {
    if (!fs.existsSync(filePath)) {
      missingLocales.push(locale);
      continue;
    }
    const payload = JSON.parse(fs.readFileSync(filePath, "utf8"));
    const inputs = payload?.freeToolInputs?.[slug];
    if (!inputs && indexes.premiumSchemaI18nSlugs.has(slug)) {
      missingLocales.push(locale);
    }
    if (inputs && typeof inputs === "object") {
      for (const value of Object.values(inputs)) {
        if (typeof value === "string" && /[çğıöşüÇĞİÖŞÜ]/.test(value) && locale !== "tr") {
          mixedLabel = true;
        }
      }
    }
  }

  if (!indexes.localePremiumKeys.ar?.has(slug) && indexes.premiumSchemaI18nSlugs.has(slug)) {
    rtlSafe = false;
  }

  const complete =
    indexes.premiumSchemaI18nSlugs.has(slug) &&
    missingLocales.length === 0;

  return { complete, rtlSafe, mixedLabel, missingLocales, suspiciousKeys };
}

function auditGuide(slug, guideSpecSlugs, legacyFindings) {
  const hasSpec = guideSpecSlugs.has(slug);
  const genericFindings = legacyFindings.filter((f) =>
    /generic|input-guide|Girdi rehberi/i.test(f.message ?? f.note ?? ""),
  );
  return {
    eligible: hasSpec,
    hasSpec,
    genericGuideBlocked: genericFindings.length > 0 || !hasSpec,
    findings: genericFindings.map((f) => f.message ?? f.note ?? f.id ?? "generic-guide"),
  };
}

function countOracleCases(contract, indexes, slug) {
  const scenarioIds = [
    ...(contract?.scenarioSpecs ?? []),
    ...(contract?.scenarioTests ?? []),
  ];
  const dedicated = indexes.dedicatedTestIndex.get(slug) ?? [];
  const caseCount = scenarioIds.length + dedicated.length;
  let coverage = "none";
  if (caseCount >= 3) coverage = "complete";
  else if (caseCount > 0) coverage = "partial";
  return { coverage, caseCount };
}

function computeSeverityScore(tool, p24Tool, trustItem, legacyConflicts, flags) {
  let score = 0;
  const findings = p24Tool?.findings ?? [];

  if (p24Tool?.verdict === "FAIL") score += 30;
  if (p24Tool?.verdict === "WARN") score += 10;
  if (p24Tool?.verdict === "QUARANTINE") score += 40;

  for (const finding of findings) {
    if (finding.severity === "fail") score += 0;
    if (/safety|certification|verified|legal/i.test(finding.message ?? "")) score += 50;
    if (/Formula Gate/i.test(finding.message ?? "")) score += 80;
  }

  if (!flags.hasFormulaContract) score += 20;
  if (!flags.hasValidation) score += 15;
  if (!flags.hasResultRenderer) score += 15;
  if (!flags.hasSubmitHandler) score += 15;
  if (!flags.hasSchema) score += 20;
  if (flags.genericLabels) score += 10;
  if (flags.mixedLocale) score += 10;
  if (flags.premiumFreeMismatch) score += 20;

  if (trustItem?.paymentEligible && tool.tier === "free") score += 50;
  if (trustItem?.paymentEligible && tool.slug === PROBLEM_SLUG) score += 100;
  if (trustItem?.formulaGateEligible && tool.slug === PROBLEM_SLUG) score += 100;

  for (const conflict of legacyConflicts) {
    if (conflict.severity === "high" || conflict.severity === "critical") score += 50;
    if (/certification|verified|Formula Gate/i.test(conflict.note ?? conflict.id ?? "")) score += 50;
  }

  return score;
}

function computeRepairDifficulty(tool, flags, riskLevel) {
  if (riskLevel === "safety-critical" || riskLevel === "regulated") return "critical";
  if (flags.paymentMismatch || tool.slug === PROBLEM_SLUG) return "critical";
  if (!flags.hasSchema && tool.routeStatus === "active-route") return "high";
  if (!flags.hasFormulaContract && tool.tier === "premium-schema") return "high";
  if (!flags.hasSubmitHandler || !flags.hasResultRenderer) return "medium";
  if (flags.genericLabels || flags.mixedLocale) return "low";
  return "medium";
}

function computeRevenuePotential(tool) {
  if (tool.tier === "premium" || tool.tier === "premium-schema") return "high";
  if (tool.tier === "free" && tool.routeStatus === "active-route") return "medium";
  if (tool.routeStatus === "category-only") return "low";
  return "low";
}

function computeDeepSeekRepairConfidence(p24Tool, severityScore, repairDifficulty) {
  if (repairDifficulty === "critical") return "low";
  if (p24Tool?.verdict === "QUARANTINE") return "low";
  if (severityScore > 60) return "low";
  if (p24Tool?.verdict === "PASS" && severityScore < 20) return "high";
  if (p24Tool?.verdict === "WARN" && severityScore < 40) return "medium";
  if (p24Tool?.verdict === "FAIL") return "medium";
  return "unknown";
}

function computeRecommendedAction(p24Tool, trustItem, flags, repairDifficulty) {
  if (
    p24Tool?.verdict === "PASS" &&
    (trustItem?.status === "ready" || !trustItem) &&
    !flags.blockers
  ) {
    return "ready";
  }
  if (toolNeedsRouteWiring(toolFromFlags(flags))) {
    return "route_wiring";
  }
  if (repairDifficulty === "critical" || flags.riskLevel === "safety-critical") {
    return "manual_review";
  }
  if (!flags.backing && p24Tool?.verdict === "QUARANTINE") {
    return "keep_safe";
  }
  if (repairDifficulty === "low" || repairDifficulty === "medium") {
    return "auto_repair";
  }
  return "manual_review";
}

function toolFromFlags(flags) {
  return { routeStatus: flags.routeStatus, tier: flags.tier };
}

function toolNeedsRouteWiring(tool) {
  return tool.routeStatus === "category-only" || tool.routeStatus === "category_stub";
}

function mapRuntimeStatus(p24Tool, trustItem) {
  if (p24Tool?.verdict === "QUARANTINE") return "quarantine";
  if (!trustItem) {
    if (p24Tool?.verdict === "FAIL") return "blocked";
    if (p24Tool?.verdict === "WARN") return "review";
    return "ready";
  }
  if (trustItem.status === "blocked") return "blocked";
  if (trustItem.status === "review") return "review";
  if (trustItem.status === "ready") return "ready";
  return trustItem.status ?? "review";
}

function dedupeP24Tools(p24Tools) {
  const tierRank = { "premium-schema": 4, premium: 3, free: 2, legacy: 1, unknown: 0 };
  const bySlug = new Map();

  for (const tool of p24Tools) {
    const existing = bySlug.get(tool.slug);
    if (!existing) {
      bySlug.set(tool.slug, tool);
      continue;
    }
    const existingRank = tierRank[existing.tier] ?? 0;
    const nextRank = tierRank[tool.tier] ?? 0;
    if (nextRank > existingRank) {
      bySlug.set(tool.slug, tool);
    }
  }

  return [...bySlug.values()].sort((a, b) => a.slug.localeCompare(b.slug));
}

function detectGenericLabels(schema) {
  if (!schema) return false;
  return schema.inputs.some((input) =>
    GENERIC_LABEL_PATTERNS.some((re) => re.test(input.label)) ||
    input.label.length < 3,
  );
}

function detectSuspiciousLabels(schema) {
  if (!schema) return [];
  return schema.inputs
    .filter((input) => GENERIC_LABEL_PATTERNS.some((re) => re.test(input.label)))
    .map((input) => input.id);
}

function buildExtendedIndexes() {
  const base = buildIndexes();
  return {
    ...base,
    guideSpecSlugs: buildGuideSpecIndex(),
    revenuePaidSlugs: buildRevenuePaidSlugs(),
    premiumDecisionContracts: buildPremiumDecisionContractSlugs(),
  };
}

export function buildFormulaKnowledgeGraph() {
  const indexes = buildExtendedIndexes();
  const inventory = dedupeP24Tools(buildP24ToolQualityReport().tools).map((t) => ({
    slug: t.slug,
    tier: t.tier,
    family: t.family,
    routeStatus: t.routeStatus,
    routePath: t.routePath,
  }));

  const tools = [];
  let withRoutes = 0;
  let withSchemas = 0;
  let withFormulaContracts = 0;
  let withValidation = 0;
  let withResultRenderer = 0;
  let withSubmitHandler = 0;
  let withI18nCoverage = 0;
  let withGuideSpec = 0;
  let withOracle = 0;

  for (const tool of inventory) {
    const schema = indexes.schemaIndex.get(tool.slug);
    const contract = indexes.contractIndex.get(tool.slug);
    const submit = detectSubmitHandler(tool.slug, indexes, schema, contract);
    const result = detectResultRenderer(tool.slug, schema, indexes);
    const i18n = auditI18n(tool.slug, indexes);
    const oracle = countOracleCases(contract, indexes, tool.slug);
    const hasContract = hasFormulaContract(tool.slug) || Boolean(contract);
    const missingLinks = [];

    if (tool.routeStatus === "active-route") withRoutes += 1;
    if (schema) withSchemas += 1;
    else if (tool.routeStatus === "active-route" && tool.tier === "premium-schema") {
      missingLinks.push("schema");
    }

    if (hasContract) withFormulaContracts += 1;
    else if (tool.tier === "premium-schema") missingLinks.push("formulaContract");

    if (indexes.validationSlugs.has(tool.slug)) withValidation += 1;
    else if (tool.tier === "premium-schema") missingLinks.push("validation");

    if (result.exists) withResultRenderer += 1;
    else missingLinks.push("resultRenderer");

    if (submit.exists) withSubmitHandler += 1;
    else missingLinks.push("submitHandler");

    if (i18n.complete) withI18nCoverage += 1;
    else if (tool.tier === "premium-schema") missingLinks.push("i18n");

    if (indexes.guideSpecSlugs.has(tool.slug)) withGuideSpec += 1;

    if (oracle.caseCount > 0) withOracle += 1;
    else if (hasContract) missingLinks.push("oracle");

    const messagesKeys = [];
    if (indexes.premiumSchemaI18nSlugs.has(tool.slug)) {
      messagesKeys.push(`premium-schema-i18n:${tool.slug}`);
    }
    for (const locale of Object.keys(LOCALE_FILES)) {
      if (indexes.localePremiumKeys[locale]?.has(tool.slug)) {
        messagesKeys.push(`messages.${locale}.freeToolInputs.${tool.slug}`);
      }
    }

    const dependencies = [];
    if (schema) dependencies.push(schema.path);
    if (contract) dependencies.push(contract.path);
    if (submit.path) dependencies.push(submit.path);
    if (result.renderer) dependencies.push(result.renderer);

    tools.push({
      slug: tool.slug,
      tier: tool.tier,
      route: tool.routePath ?? "",
      schemaFile: schema?.path ?? "",
      validationFile: indexes.validationSlugs.has(tool.slug)
        ? `src/lib/premium-schema/calculators/${tool.slug}-validation.ts`
        : "",
      formulaContractSlug: hasContract ? tool.slug : "",
      resultRenderer: result.renderer ?? "",
      submitHandler: submit.handler ?? "",
      messagesKeys,
      guideSpec: indexes.guideSpecSlugs.has(tool.slug) ? tool.slug : "",
      oracleCases: oracle.caseCount > 0 ? [`cases:${oracle.caseCount}`] : [],
      dependencies,
      missingLinks,
    });
  }

  return {
    generatedAt: new Date().toISOString(),
    summary: {
      totalTools: tools.length,
      withRoutes,
      withSchemas,
      withFormulaContracts,
      withValidation,
      withResultRenderer,
      withSubmitHandler,
      withI18nCoverage,
      withGuideSpec,
      withOracle,
    },
    tools,
  };
}

export function buildControlPlaneReport(options = {}) {
  const p24Report = options.p24Report ?? readJson(P24_REPORT_PATH) ?? buildP24ToolQualityReport();
  const trustReport = readJson(RUNTIME_TRUST_REPORT_PATH);
  const legacyReport = readJson(LEGACY_CONFLICT_REPORT_PATH);
  const indexes = buildExtendedIndexes();

  const trustBySlug = new Map((trustReport?.items ?? []).map((item) => [item.slug, item]));
  const p24BySlug = new Map((p24Report.tools ?? []).map((tool) => [tool.slug, tool]));
  const legacyBySlug = new Map();

  for (const finding of legacyReport?.findings ?? legacyReport?.items ?? []) {
    const slug = finding.slug ?? finding.toolSlug;
    if (!slug) continue;
    const list = legacyBySlug.get(slug) ?? [];
    list.push(finding);
    legacyBySlug.set(slug, list);
  }

  const tools = [];
  for (const p24Tool of dedupeP24Tools(p24Report.tools ?? [])) {
    const tool = {
      slug: p24Tool.slug,
      tier: p24Tool.tier,
      routeStatus: p24Tool.routeStatus,
      routePath: p24Tool.routePath,
    };
    const schema = indexes.schemaIndex.get(tool.slug);
    const contract = indexes.contractIndex.get(tool.slug);
    const trustItem = trustBySlug.get(tool.slug);
    const legacyConflicts = legacyBySlug.get(tool.slug) ?? [];
    const submit = detectSubmitHandler(tool.slug, indexes, schema, contract);
    const result = detectResultRenderer(tool.slug, schema, indexes);
    const i18n = auditI18n(tool.slug, indexes);
    const guide = auditGuide(tool.slug, indexes.guideSpecSlugs, legacyConflicts);
    const oracle = countOracleCases(contract, indexes, tool.slug);
    const hasContract = hasFormulaContract(tool.slug) || Boolean(contract);
    const genericLabels = detectGenericLabels(schema);
    const riskLevel = inferRiskLevel(tool.slug, tool);

    const schemaRequired = schema?.inputs?.filter((i) => i.required).map((i) => i.id) ?? [];
    const contractRequired = contract?.requiredInputs ?? [];
    const missingContractInputs = schemaRequired.filter((id) => contractRequired.length > 0 && !contractRequired.includes(id));

    const effectiveTier = trustItem?.tier ?? tool.tier;

    const flags = {
      hasFormulaContract: hasContract,
      hasValidation: indexes.validationSlugs.has(tool.slug),
      hasResultRenderer: result.exists,
      hasSubmitHandler: submit.exists,
      hasSchema: Boolean(schema),
      genericLabels,
      mixedLocale: i18n.mixedLabel,
      premiumFreeMismatch: p24Tool.findings?.some((f) => f.checkId === "freePremiumSplit" && f.severity === "warn"),
      paymentMismatch: trustItem?.paymentEligible && effectiveTier === "free",
      backing: p24Tool.backing,
      blockers: p24Tool.verdict === "FAIL" || p24Tool.verdict === "QUARANTINE",
      routeStatus: tool.routeStatus,
      tier: tool.tier,
      effectiveTier,
      riskLevel,
    };

    const severityScore = computeSeverityScore(tool, p24Tool, trustItem, legacyConflicts, flags);
    const repairDifficulty = computeRepairDifficulty(tool, flags, riskLevel);
    const revenuePotential = computeRevenuePotential(tool);
    const deepSeekRepairConfidence = computeDeepSeekRepairConfidence(p24Tool, severityScore, repairDifficulty);
    const qualityStatus = p24Tool.verdict ?? "FAIL";
    const runtimeStatus = mapRuntimeStatus(p24Tool, trustItem);

    const paymentEligible =
      Boolean(trustItem?.paymentEligible) && effectiveTier !== "free";
    const formulaGateEligible =
      Boolean(trustItem?.formulaGateEligible) && effectiveTier !== "free";

    const eligible = {
      calculationEligible: trustItem?.calculationEligible ?? (qualityStatus === "PASS" && flags.backing),
      formulaGateEligible,
      paymentEligible,
      guideEligible: guide.hasSpec && !guide.genericGuideBlocked,
      seoEligible: tool.routeStatus === "active-route",
      pdfEligible: paymentEligible,
      repairEligible:
        repairDifficulty !== "critical" &&
        tool.slug !== PROBLEM_SLUG &&
        qualityStatus !== "QUARANTINE",
    };

    const recommendedAction = computeRecommendedAction(p24Tool, trustItem, flags, repairDifficulty);

    const findings = (p24Tool.findings ?? [])
      .filter((f) => f.severity !== "pass")
      .map((f) => `${f.checkId}: ${f.message}`);

    tools.push({
      slug: tool.slug,
      tier: tool.tier,
      route: tool.routePath ?? "",
      routeStatus: normalizeRouteStatus(tool.routeStatus),
      qualityStatus,
      runtimeStatus,
      severityScore,
      repairDifficulty,
      revenuePotential,
      deepSeekRepairConfidence,
      eligible,
      formulaContract: {
        exists: hasContract,
        aligned: missingContractInputs.length === 0,
        missingInputs: missingContractInputs,
        unitIssues: schema
          ? schema.inputs.filter((i) => i.unit && !i.unit.includes("/")).map((i) => `${i.id}:${i.unit}`)
          : [],
      },
      schema: {
        exists: Boolean(schema),
        requiredInputsAligned: missingContractInputs.length === 0,
        missingInputs: missingContractInputs,
        suspiciousLabels: detectSuspiciousLabels(schema),
      },
      validation: {
        exists: indexes.validationSlugs.has(tool.slug),
        boundaryCoverage: (contract?.scenarioSpecs ?? []).some((id) => /boundary|edge|zero/i.test(id)),
        missingRules: indexes.validationSlugs.has(tool.slug) ? [] : (tool.tier === "premium-schema" ? ["validation-module"] : []),
      },
      resultRenderer: {
        exists: result.exists,
        placeholderOnly: result.placeholderOnly,
        missingOutputs: result.missingOutputs,
      },
      i18n: i18n,
      guide,
      goldenOracle: oracle,
      legacyConflicts: legacyConflicts.map((c) => c.id ?? c.note ?? String(c)),
      findings,
      recommendedAction,
    });
  }

  const summary = {
    totalTools: tools.length,
    byQuality: { PASS: 0, WARN: 0, FAIL: 0, QUARANTINE: 0 },
    byRuntime: { ready: 0, review: 0, blocked: 0, quarantine: 0, repairing: 0, manual_formula_review: 0 },
    autoRepairCandidates: tools.filter((t) => t.recommendedAction === "auto_repair").length,
    manualReviewCandidates: tools.filter((t) => t.recommendedAction === "manual_review").length,
    routeWiringCandidates: tools.filter((t) => t.recommendedAction === "route_wiring").length,
    paymentEligible: tools.filter((t) => t.eligible.paymentEligible).length,
    formulaGateEligible: tools.filter((t) => t.eligible.formulaGateEligible).length,
    freePaymentEligible: tools.filter((t) => {
      const trustTier = trustBySlug.get(t.slug)?.tier;
      const effectiveTier = trustTier ?? t.tier;
      return effectiveTier === "free" && t.eligible.paymentEligible;
    }).length,
    problemSlug: tools.find((t) => t.slug === PROBLEM_SLUG) ?? null,
  };

  for (const tool of tools) {
    summary.byQuality[tool.qualityStatus] = (summary.byQuality[tool.qualityStatus] ?? 0) + 1;
    summary.byRuntime[tool.runtimeStatus] = (summary.byRuntime[tool.runtimeStatus] ?? 0) + 1;
  }

  const topHighSeverity = [...tools]
    .sort((a, b) => b.severityScore - a.severityScore || a.slug.localeCompare(b.slug))
    .slice(0, 20)
    .map((t) => ({ slug: t.slug, severityScore: t.severityScore, qualityStatus: t.qualityStatus }));

  const topFastRepair = tools
    .filter((t) => t.recommendedAction === "auto_repair" && t.repairDifficulty === "low")
    .sort((a, b) => a.severityScore - b.severityScore || a.slug.localeCompare(b.slug))
    .slice(0, 20)
    .map((t) => ({ slug: t.slug, severityScore: t.severityScore, repairDifficulty: t.repairDifficulty }));

  return {
    generatedAt: new Date().toISOString(),
    auditId: "P2.5-enterprise-control-plane",
    sources: {
      p24: path.relative(ROOT, P24_REPORT_PATH),
      runtimeTrust: trustReport ? path.relative(ROOT, RUNTIME_TRUST_REPORT_PATH) : null,
      legacyConflicts: legacyReport ? path.relative(ROOT, LEGACY_CONFLICT_REPORT_PATH) : null,
    },
    summary,
    topHighSeverity,
    topFastRepair,
    tools,
  };
}

export function formatControlPlaneStdout(report) {
  const s = report.summary;
  const lines = [
    "audit:p25-control-plane PASS",
    `totalTools: ${s.totalTools}`,
    `PASS/WARN/FAIL/QUARANTINE: ${s.byQuality.PASS}/${s.byQuality.WARN}/${s.byQuality.FAIL}/${s.byQuality.QUARANTINE}`,
    `ready/review/blocked/quarantine: ${s.byRuntime.ready}/${s.byRuntime.review}/${s.byRuntime.blocked}/${s.byRuntime.quarantine}`,
    `autoRepair candidates: ${s.autoRepairCandidates}`,
    `manualReview candidates: ${s.manualReviewCandidates}`,
    `routeWiring candidates: ${s.routeWiringCandidates}`,
    `paymentEligible: ${s.paymentEligible}`,
    `formulaGateEligible: ${s.formulaGateEligible}`,
    `free paymentEligible: ${s.freePaymentEligible}`,
    `problem slug: ${PROBLEM_SLUG} payment=${s.problemSlug?.eligible?.paymentEligible ?? "missing"} formulaGate=${s.problemSlug?.eligible?.formulaGateEligible ?? "missing"}`,
    `output: ${path.relative(ROOT, CONTROL_PLANE_REPORT_PATH)}`,
    "",
    "Top 20 high severity:",
  ];

  for (const item of report.topHighSeverity) {
    lines.push(` - ${item.slug} (${item.severityScore}) ${item.qualityStatus}`);
  }

  lines.push("", "Top 20 fast repair:");
  for (const item of report.topFastRepair) {
    lines.push(` - ${item.slug} (${item.severityScore}) ${item.repairDifficulty}`);
  }

  return lines.join("\n");
}

export function formatKnowledgeGraphStdout(graph) {
  const s = graph.summary;
  const disconnected = graph.tools
    .filter((t) => t.missingLinks.length >= 3)
    .sort((a, b) => b.missingLinks.length - a.missingLinks.length)
    .slice(0, 15);

  const lines = [
    "build:formula-knowledge-graph PASS",
    `total graph tools: ${s.totalTools}`,
    `missing schema: ${s.totalTools - s.withSchemas}`,
    `missing validation: ${s.totalTools - s.withValidation}`,
    `missing formula contract: ${s.totalTools - s.withFormulaContracts}`,
    `missing result renderer: ${s.totalTools - s.withResultRenderer}`,
    `missing submit handler: ${s.totalTools - s.withSubmitHandler}`,
    `missing i18n: ${s.totalTools - s.withI18nCoverage}`,
    `missing guide spec: ${s.totalTools - s.withGuideSpec}`,
    `missing oracle: ${s.totalTools - s.withOracle}`,
    `output: ${path.relative(ROOT, FORMULA_KNOWLEDGE_GRAPH_PATH)}`,
    "",
    "Top disconnected tools:",
  ];

  for (const tool of disconnected) {
    lines.push(` - ${tool.slug} (${tool.missingLinks.join(", ")})`);
  }

  return lines.join("\n");
}

export function buildDeepSeekToolContext(controlPlane, knowledgeGraph) {
  const graphBySlug = new Map((knowledgeGraph?.tools ?? []).map((t) => [t.slug, t]));

  const tools = (controlPlane.tools ?? []).map((tool) => ({
    slug: tool.slug,
    tier: tool.tier,
    qualityStatus: tool.qualityStatus,
    runtimeStatus: tool.runtimeStatus,
    severityScore: tool.severityScore,
    repairDifficulty: tool.repairDifficulty,
    revenuePotential: tool.revenuePotential,
    deepSeekRepairConfidence: tool.deepSeekRepairConfidence,
    findings: tool.findings,
    missingLinks: graphBySlug.get(tool.slug)?.missingLinks ?? [],
    recommendedAction: tool.recommendedAction,
    allowedDeepSeekTasks: ALLOWED_DEEPSEEK_TASKS,
    forbiddenDeepSeekTasks: FORBIDDEN_DEEPSEEK_TASKS,
  }));

  return {
    generatedAt: new Date().toISOString(),
    source: "sectorcalc-p25-control-plane",
    tools,
  };
}

export function formatDeepSeekExportStdout(payload, redactionApplied) {
  return [
    "ai:deepseek:export-tool-context PASS",
    `exported tool count: ${payload.tools.length}`,
    `redaction status: ${redactionApplied ? "applied" : "skipped"}`,
    "forbidden task policy included: true",
    `cache output path: ${path.relative(ROOT, DEEPSEEK_TOOL_CONTEXT_PATH)}`,
  ].join("\n");
}
