#!/usr/bin/env node
/**
 * S4/6 — Category-Only Route Decision Batch
 * Decision matrix only: no live routes, no formula/payment changes.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ROOT } from "./lib/activation-paths.mjs";
import { hasFormulaContract } from "./lib/activation-scan-lib.mjs";
import { RISK_CLASS } from "./lib/p6a-premium-schema-fail-lib.mjs";
import { PROBLEM_SLUG } from "./lib/p25-control-plane-lib.mjs";
import { EXPECTED_REVENUE_ELIGIBLE_COUNTS } from "./revenue-eligible-allowlist.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CACHE_DIR = path.join(ROOT, "scripts/.cache");
const MANIFEST_PATH = path.join(CACHE_DIR, "sprint-tool-activation-manifest.json");
const REPORT_PATH = path.join(CACHE_DIR, "s4-category-only-route-decision-report.json");
const DOC_PATH = path.join(ROOT, "docs/s4-category-only-route-decision.md");
const CONTROL_PLANE_PATH = path.join(CACHE_DIR, "tool-quality-control-plane.json");
const TRUST_REPORT_PATH = path.join(CACHE_DIR, "runtime-trust-engine-report.json");
const LEGACY_CONFLICT_PATH = path.join(CACHE_DIR, "legacy-conflict-report.json");

const BATCH_KEYS = ["S4_categoryOnlyRouteDecisionAndScaffold", "S4_categoryOnlyRouteDecision"];
const BATCH_NAME = "S4_categoryOnlyRouteDecision";
const MAX_TOOLS = 80;

const SCHEMAS_DIR = path.join(ROOT, "src/lib/premium-schema/schemas");
const CALCULATORS_DIR = path.join(ROOT, "src/lib/premium-schema/calculators");
const TESTS_DIR = path.join(ROOT, "src/lib/premium-schema/__tests__");
const GUIDE_REGISTRY_FILE = path.join(ROOT, "src/lib/tool-guides/premium-input-guide-specs.ts");
const MESSAGES_EN = path.join(ROOT, "messages/en.json");
const APP_TOOLS_DIR = path.join(ROOT, "src/app");

const HIGH_RISK_SLUGS = new Set(RISK_CLASS.HIGH_RISK_MANUAL_ONLY);

const HIGH_RISK_PATTERNS = [
  { id: "pressure", pattern: /pressure/i },
  { id: "vessel", pattern: /vessel/i },
  { id: "boiler", pattern: /boiler/i },
  { id: "legal", pattern: /\blegal\b|legal-/i },
  { id: "interest", pattern: /interest/i },
  { id: "tax", pattern: /\btax\b|tax-|vergi|kdv|gelir-vergisi/i },
  { id: "severance", pattern: /severance|kidem|ihbar/i },
  { id: "payroll", pattern: /payroll|bordro|maas/i },
  { id: "cbam", pattern: /cbam|carbon-compliance/i },
  { id: "hydraulic", pattern: /hydraulic|hidrolik/i },
  { id: "fire-system", pattern: /fire-system|yangin/i },
  { id: "bolt-tightening", pattern: /bolt-tightening|tork|torque/i },
  { id: "electrical-safety", pattern: /electrical[- ]?safety|elektrik-guvenlik/i },
  { id: "fx", pattern: /\bfx\b|currency-risk|doviz|kur-farki|kur-fark/i },
  { id: "medical", pattern: /medical|medikal|saglik-guvenlik/i },
  { id: "food-safety", pattern: /food[- ]?safety|gida-guvenlik/i },
  { id: "structural", pattern: /structural|yapisal|statik/i },
  { id: "load", pattern: /\bload\b|load[- ]?bearing|yuk-tasima|lifting|kaldirma/i },
  { id: "aml-kyc", pattern: /aml-kyc|yaptirim-tarama/i },
  { id: "eu-ai-act", pattern: /eu-ai-act|ai-uyum|etik-denetim/i },
];

const CALCULATOR_INTENT_PATTERNS = [
  /-calculator$/,
  /maliyet/,
  /hesap/,
  /hesabi/,
  /roi/,
  /optimizasyon/,
  /basabas/,
  /geri-donus/,
  /verimlilik-kaybi/,
  /kar-zarar/,
  /fiyatlandirma/,
];

const GUIDE_ONLY_PATTERNS = [
  /checklist/,
  /rehber/,
  /-guide$/,
  /benchmark-matrix/,
  /denetim-skoru/,
  /uyum-kontrol/,
  /matris$/,
  /skala$/,
];

const LOW_RISK_SECTOR_PATTERNS = [
  /ambalaj/,
  /andon/,
  /agv-amr/,
  /5s-denetim/,
  /aql-kabul/,
  /moq/,
  /parti-optimizasyon/,
  /destek-yapisi/,
  /post-proses/,
  /nakliye-hacim/,
  /malzeme-degisimi/,
];

const SLUG_SUFFIX_STRIP = /-(calculator|check|analyzer|tool|verdict|detector|optimizer|guard|estimator)$/;

function readJson(filePath) {
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function readText(filePath) {
  if (!fs.existsSync(filePath)) return "";
  return fs.readFileSync(filePath, "utf8");
}

function writeText(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, "utf8");
}

function loadManifestBatch(manifest) {
  for (const key of BATCH_KEYS) {
    if (Array.isArray(manifest?.batches?.[key]) && manifest.batches[key].length > 0) {
      return manifest.batches[key];
    }
  }
  return null;
}

function buildSchemaIndex() {
  const index = new Map();
  if (!fs.existsSync(SCHEMAS_DIR)) return index;
  for (const file of fs.readdirSync(SCHEMAS_DIR)) {
    if (!file.endsWith(".ts")) continue;
    const content = readText(path.join(SCHEMAS_DIR, file));
    const idMatch = content.match(/\bid:\s*"([^"]+)"/);
    if (idMatch) index.set(idMatch[1], file);
  }
  return index;
}

function loadSchemaRegistryAliases() {
  const content = readText(path.join(ROOT, "src/lib/premium-schema/schema-registry.ts"));
  const aliases = new Map();
  for (const match of content.matchAll(/"([^"]+)":\s*"([^"]+)"/g)) {
    if (match[1].includes("-") && match[2].includes("-")) {
      aliases.set(match[1], match[2]);
    }
  }
  return aliases;
}

function hasCalculatorModule(slug) {
  if (!fs.existsSync(CALCULATORS_DIR)) return false;
  const candidates = [
    `${slug}.ts`,
    `${slug}-validation.ts`,
    `${slug.replace(/-calculator$/, "")}.ts`,
  ];
  return candidates.some((file) => fs.existsSync(path.join(CALCULATORS_DIR, file)));
}

function hasValidationModule(slug, tool) {
  if (tool?.validation?.exists) return true;
  if (!fs.existsSync(CALCULATORS_DIR)) return false;
  return fs.existsSync(path.join(CALCULATORS_DIR, `${slug}-validation.ts`));
}

function hasSchema(slug, schemaIndex, aliases, tool) {
  if (tool?.schema?.exists) return true;
  if (schemaIndex.has(slug)) return true;
  const alias = aliases.get(slug);
  return Boolean(alias && schemaIndex.has(alias));
}

function hasGuideSpec(slug) {
  const escaped = slug.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`slug:\\s*"${escaped}"`);
  return pattern.test(readText(GUIDE_REGISTRY_FILE));
}

function hasSmokeOrOracle(slug, tool) {
  if (tool?.goldenOracle?.coverage === "complete" && (tool.goldenOracle.caseCount ?? 0) > 0) {
    return true;
  }
  if (!fs.existsSync(TESTS_DIR)) return false;
  return fs.readdirSync(TESTS_DIR).some((file) => file.startsWith(`${slug}.test.`));
}

function hasI18nTitle(slug, tool) {
  if (tool?.i18n?.complete) return true;
  const messages = readJson(MESSAGES_EN);
  if (!messages) return false;
  const camel = slug
    .split("-")
    .map((part, index) => (index === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1)))
    .join("");
  const toolMessages = messages.tools?.[slug] ?? messages.tools?.[camel];
  return Boolean(toolMessages?.title || toolMessages?.name);
}

function hasActiveRoute(slug, tool) {
  if (tool?.routeStatus === "active" || tool?.routeStatus === "active-route") return true;
  const routeDirs = [
    path.join(APP_TOOLS_DIR, slug),
    path.join(APP_TOOLS_DIR, "[locale]", slug),
    path.join(APP_TOOLS_DIR, "tools", slug),
  ];
  return routeDirs.some((dir) => fs.existsSync(path.join(dir, "page.tsx")));
}

function isCategoryOnly(tool) {
  if (!tool) return true;
  return (
    tool.routeStatus === "category_stub" ||
    tool.routeStatus === "category-only" ||
    tool.qualityStatus === "QUARANTINE" ||
    tool.runtimeStatus === "quarantine"
  );
}

function slugBase(slug) {
  return slug.replace(SLUG_SUFFIX_STRIP, "");
}

function buildDuplicateIndex(controlPlaneTools) {
  const byBase = new Map();
  for (const tool of controlPlaneTools) {
    const base = slugBase(tool.slug);
    if (!byBase.has(base)) byBase.set(base, []);
    byBase.get(base).push(tool);
  }
  return byBase;
}

function loadLegacyDuplicateHints() {
  const report = readJson(LEGACY_CONFLICT_PATH);
  const hints = new Map();
  for (const item of report?.duplicateSlugAlias ?? []) {
    if (!item.slug || !item.relatedSlug) continue;
    if (!hints.has(item.slug)) hints.set(item.slug, []);
    hints.get(item.slug).push({
      relatedSlug: item.relatedSlug,
      note: item.note ?? item.id ?? "legacy_conflict",
    });
  }
  return hints;
}

function findDuplicateCandidate(slug, tool, byBase, aliases, schemaIndex) {
  const candidates = [];

  const aliasTarget = aliases.get(slug);
  if (aliasTarget && aliasTarget !== slug) {
    candidates.push({
      relatedSlug: aliasTarget,
      reason: "schema_registry_alias",
    });
  }

  for (const [base, tools] of byBase.entries()) {
    if (base !== slugBase(slug)) continue;
    for (const other of tools) {
      if (other.slug === slug) continue;
      const otherHasBacking =
        other.schema?.exists ||
        other.formulaContract?.exists ||
        other.validation?.exists ||
        hasActiveRoute(other.slug, other);
      if (otherHasBacking || hasActiveRoute(other.slug, other)) {
        candidates.push({
          relatedSlug: other.slug,
          reason: "shared_slug_base_with_active_or_backed_tool",
        });
      }
    }
  }

  if (schemaIndex.has(slug)) {
    for (const [aliasSlug, target] of aliases.entries()) {
      if (target === slug && aliasSlug !== slug) {
        candidates.push({
          relatedSlug: aliasSlug,
          reason: "alias_points_to_this_schema",
        });
      }
    }
  }

  if (tool?.legacyConflicts?.length) {
    for (const conflict of tool.legacyConflicts) {
      if (typeof conflict === "string") {
        candidates.push({ relatedSlug: conflict, reason: "legacy_conflict" });
      } else if (conflict?.slug) {
        candidates.push({
          relatedSlug: conflict.slug,
          reason: conflict.id ?? "legacy_conflict",
        });
      }
    }
  }

  const unique = [];
  const seen = new Set();
  for (const entry of candidates) {
    const key = `${entry.relatedSlug}:${entry.reason}`;
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(entry);
  }
  return unique;
}

function matchesHighRisk(slug) {
  if (slug === PROBLEM_SLUG) return { matched: true, pattern: "problem_slug" };
  if (HIGH_RISK_SLUGS.has(slug)) return { matched: true, pattern: "high_risk_manual_only" };
  for (const entry of HIGH_RISK_PATTERNS) {
    if (entry.pattern.test(slug)) {
      return { matched: true, pattern: entry.id };
    }
  }
  return { matched: false, pattern: null };
}

function hasCalculatorIntent(slug) {
  return CALCULATOR_INTENT_PATTERNS.some((pattern) => pattern.test(slug));
}

function looksGuideOnly(slug, manifestEntry) {
  if (manifestEntry?.guideFirst && !hasCalculatorIntent(slug)) return true;
  return GUIDE_ONLY_PATTERNS.some((pattern) => pattern.test(slug));
}

function hasAnyBacking(scan) {
  return (
    scan.hasSchema ||
    scan.hasCalculatorModule ||
    scan.hasFormulaContract ||
    scan.hasValidation ||
    scan.hasActiveRoute
  );
}

function scanSlug(slug, tool, manifestEntry, schemaIndex, aliases, byBase, legacyDuplicateHints) {
  const highRisk = matchesHighRisk(slug);
  const duplicateCandidates = findDuplicateCandidate(slug, tool, byBase, aliases, schemaIndex);
  for (const hint of legacyDuplicateHints.get(slug) ?? []) {
    duplicateCandidates.push(hint);
  }

  return {
    slug,
    controlPlaneExists: Boolean(tool),
    hasActiveRoute: hasActiveRoute(slug, tool),
    tier: tool?.tier ?? "unknown",
    categoryOnly: isCategoryOnly(tool),
    hasSchema: hasSchema(slug, schemaIndex, aliases, tool),
    hasCalculatorModule: hasCalculatorModule(slug),
    hasFormulaContract: Boolean(tool?.formulaContract?.exists) || hasFormulaContract(slug),
    hasValidation: hasValidationModule(slug, tool),
    hasGuideSpec: hasGuideSpec(slug) || Boolean(tool?.guide?.hasSpec),
    hasOracleOrSmoke: hasSmokeOrOracle(slug, tool),
    hasI18n: hasI18nTitle(slug, tool),
    highRisk,
    duplicateCandidates,
    recommendedAction: tool?.recommendedAction ?? "unknown",
    repairDifficulty: tool?.repairDifficulty ?? "unknown",
    qualityStatus: tool?.qualityStatus ?? "unknown",
    manifestGuideFirst: manifestEntry?.guideFirst ?? false,
    manifestResultRendererNeeded: manifestEntry?.resultRendererNeeded ?? false,
  };
}

function nextPhaseForDecision(decision) {
  switch (decision) {
    case "manual_expert_review_required":
      return "Expert review queue";
    case "duplicate_or_alias_candidate":
      return "Catalog merge review";
    case "guide_only_candidate":
      return "S5 guide scaffold";
    case "schema_contract_required":
      return "Manual engineering backlog";
    case "safe_future_activation_candidate":
      return "S6+ activation when backing ready";
    default:
      return "Remain quarantined — S5+ engineering backlog";
  }
}

function classifyDecision(slug, scan, manifestEntry) {
  if (scan.highRisk.matched) {
    return {
      decision: "manual_expert_review_required",
      reason: `High-risk pattern: ${scan.highRisk.pattern}`,
    };
  }

  if (scan.duplicateCandidates.length > 0) {
    const related = scan.duplicateCandidates.map((entry) => entry.relatedSlug).join(", ");
    return {
      decision: "duplicate_or_alias_candidate",
      reason: `Possible alias/duplicate of: ${related}`,
    };
  }

  const backing = hasAnyBacking(scan);
  const lowRisk =
    LOW_RISK_SECTOR_PATTERNS.some((pattern) => pattern.test(slug)) ||
    scan.repairDifficulty === "low";

  if (
    backing &&
    lowRisk &&
    (scan.recommendedAction === "route_wiring" || scan.recommendedAction === "auto_repair")
  ) {
    return {
      decision: "safe_future_activation_candidate",
      reason: "Partial backing present; low-risk sector; route wiring candidate when schema/contract complete",
    };
  }

  if (looksGuideOnly(slug, manifestEntry) && !hasCalculatorIntent(slug)) {
    return {
      decision: "guide_only_candidate",
      reason: "Informational/guide-first pattern; no calculator intent detected",
    };
  }

  if (hasCalculatorIntent(slug) && !backing) {
    return {
      decision: "schema_contract_required",
      reason: "Calculator intent slug missing schema, contract, validation, and calculator module",
    };
  }

  if (!backing) {
    return {
      decision: "keep_quarantined_missing_backing",
      reason: "Category-only stub with no schema, calculator, formula contract, or validation backing",
    };
  }

  if (backing && scan.recommendedAction === "route_wiring") {
    return {
      decision: "safe_future_activation_candidate",
      reason: "Partial backing with route_wiring recommendation; defer live route until S6 readiness",
    };
  }

  return {
    decision: "keep_quarantined_missing_backing",
    reason: "Insufficient backing for safe activation; remain category-only quarantine",
  };
}

function loadPaymentGuards() {
  const trust = readJson(TRUST_REPORT_PATH);
  const freePayment = (trust?.items ?? []).filter(
    (item) => item.paymentEligible && item.tier === "free",
  ).length;
  const problem = (trust?.items ?? []).find((item) => item.slug === PROBLEM_SLUG);
  const feedEfficiency = (trust?.items ?? []).find((item) => item.slug === "feed-efficiency-analyzer");
  return {
    paymentEligible: trust?.paymentEligible ?? null,
    formulaGateEligible: trust?.formulaGateEligible ?? null,
    freePaymentEligible: freePayment,
    problemSlugLocked: !(problem?.paymentEligible || problem?.formulaGateEligible),
    feedEfficiencyEligible: Boolean(feedEfficiency?.paymentEligible || feedEfficiency?.formulaGateEligible),
    revenueAllowlistEnforced:
      trust?.paymentEligible === EXPECTED_REVENUE_ELIGIBLE_COUNTS.paymentEligible &&
      trust?.formulaGateEligible === EXPECTED_REVENUE_ELIGIBLE_COUNTS.formulaGateEligible &&
      freePayment === EXPECTED_REVENUE_ELIGIBLE_COUNTS.freePaymentEligible,
  };
}

function renderDoc(report, rows) {
  const lines = [
    "# S4 Category-Only Route Decision",
    "",
    "## Summary",
    "",
    `- Input count: ${report.inputCount}`,
    `- Processed: ${report.processedCount}`,
    `- Live route created: no`,
    `- Payment/formulaGate changed: no`,
    `- Revenue allowlist enforced: ${report.guards.revenueAllowlistEnforced ? "yes" : "no"}`,
    "",
    "## Decision Table",
    "",
    "| Slug | Decision | Reason | Next Phase |",
    "| --- | --- | --- | --- |",
  ];

  for (const row of rows) {
    const reason = row.reason.replace(/\|/g, "\\|");
    lines.push(`| \`${row.slug}\` | ${row.decision} | ${reason} | ${row.nextPhase} |`);
  }

  const listSection = (title, key) => {
    lines.push("", `## ${title}`, "");
    const items = report.decisions[key] ?? [];
    if (items.length === 0) {
      lines.push("- none");
      return;
    }
    for (const item of items) {
      lines.push(`- \`${item.slug}\` — ${item.reason}`);
    }
  };

  listSection("S5 Guide Candidates", "guide_only_candidate");
  listSection("Manual Expert Review", "manual_expert_review_required");
  listSection("Schema/Contract Required", "schema_contract_required");
  listSection("Duplicate/Alias Candidates", "duplicate_or_alias_candidate");

  lines.push(
    "",
    "## Guard Results",
    "",
    `- paymentEligible: ${report.guards.paymentEligible}`,
    `- formulaGateEligible: ${report.guards.formulaGateEligible}`,
    `- free paymentEligible: ${report.guards.freePaymentEligible}`,
    `- problem slug: ${report.guards.problemSlugLocked ? "locked" : "UNLOCKED"}`,
    `- allowlist: ${report.guards.revenueAllowlistEnforced ? "enforced" : "FAILED"}`,
    "",
    "## S5 Recommended Input",
    "",
    "Run S5 guide/oracle scaffold only for `guide_only_candidate` slugs after expert review clears high-risk overlaps.",
    "Engineering backlog (`schema_contract_required`, `keep_quarantined_missing_backing`) requires schema + FormulaContract before any route wiring.",
    "",
  );

  writeText(DOC_PATH, lines.join("\n"));
}

function main() {
  const manifest = readJson(MANIFEST_PATH);
  const batch = loadManifestBatch(manifest);
  if (!batch) {
    console.error("BLOCKER: sprint manifest or S4 batch missing.");
    console.error(`Expected one of: ${BATCH_KEYS.join(", ")}`);
    process.exit(1);
  }

  const workQueue = batch.slice(0, MAX_TOOLS);
  const controlPlane = readJson(CONTROL_PLANE_PATH);
  const controlPlaneTools = controlPlane?.tools ?? [];
  const toolsBySlug = new Map(controlPlaneTools.map((tool) => [tool.slug, tool]));
  const schemaIndex = buildSchemaIndex();
  const aliases = loadSchemaRegistryAliases();
  const byBase = buildDuplicateIndex(controlPlaneTools);
  const legacyDuplicateHints = loadLegacyDuplicateHints();
  const guards = loadPaymentGuards();

  const decisions = {
    keep_quarantined_missing_backing: [],
    guide_only_candidate: [],
    schema_contract_required: [],
    manual_expert_review_required: [],
    duplicate_or_alias_candidate: [],
    safe_future_activation_candidate: [],
  };

  const rows = [];

  for (const entry of workQueue) {
    const slug = typeof entry === "string" ? entry : entry.slug;
    const tool = toolsBySlug.get(slug) ?? null;
    const scan = scanSlug(
      slug,
      tool,
      typeof entry === "object" ? entry : null,
      schemaIndex,
      aliases,
      byBase,
      legacyDuplicateHints,
    );
    const { decision, reason } = classifyDecision(slug, scan, typeof entry === "object" ? entry : null);
    const nextPhase = nextPhaseForDecision(decision);
    const record = { slug, decision, reason, nextPhase, scan };
    decisions[decision].push({ slug, reason, nextPhase, scan });
    rows.push({ slug, decision, reason, nextPhase });
  }

  const report = {
    generatedAt: new Date().toISOString(),
    batch: BATCH_NAME,
    inputCount: batch.length,
    processedCount: workQueue.length,
    decisions: Object.fromEntries(
      Object.entries(decisions).map(([key, items]) => [
        key,
        items.map(({ slug, reason, nextPhase }) => ({ slug, reason, nextPhase })),
      ]),
    ),
    summary: {
      categoryOnlyStillQuarantined: decisions.keep_quarantined_missing_backing.length,
      guideOnlyCandidates: decisions.guide_only_candidate.length,
      schemaContractRequired: decisions.schema_contract_required.length,
      manualExpertReviewRequired: decisions.manual_expert_review_required.length,
      duplicateOrAliasCandidates: decisions.duplicate_or_alias_candidate.length,
      safeFutureActivationCandidates: decisions.safe_future_activation_candidate.length,
    },
    guards: {
      paymentEligible: guards.paymentEligible,
      formulaGateEligible: guards.formulaGateEligible,
      freePaymentEligible: guards.freePaymentEligible,
      problemSlugLocked: guards.problemSlugLocked,
      revenueAllowlistEnforced: guards.revenueAllowlistEnforced,
    },
    noLiveRoutesCreated: true,
    noFormulaContractsChanged: true,
    noPaymentFilesTouched: true,
  };

  writeText(REPORT_PATH, `${JSON.stringify(report, null, 2)}\n`);
  renderDoc(report, rows);

  console.log("\n=== S4 category-only route decision ===");
  console.log(`input: ${report.inputCount}`);
  console.log(`processed: ${report.processedCount}`);
  console.log(`keep_quarantined_missing_backing: ${report.summary.categoryOnlyStillQuarantined}`);
  console.log(`guide_only_candidate: ${report.summary.guideOnlyCandidates}`);
  console.log(`schema_contract_required: ${report.summary.schemaContractRequired}`);
  console.log(`manual_expert_review_required: ${report.summary.manualExpertReviewRequired}`);
  console.log(`duplicate_or_alias_candidate: ${report.summary.duplicateOrAliasCandidates}`);
  console.log(`safe_future_activation_candidate: ${report.summary.safeFutureActivationCandidates}`);
  console.log(`report: ${path.relative(ROOT, REPORT_PATH)}`);
  console.log(`doc: ${path.relative(ROOT, DOC_PATH)}`);

  if (
    guards.paymentEligible !== EXPECTED_REVENUE_ELIGIBLE_COUNTS.paymentEligible ||
    guards.formulaGateEligible !== EXPECTED_REVENUE_ELIGIBLE_COUNTS.formulaGateEligible ||
    guards.freePaymentEligible !== EXPECTED_REVENUE_ELIGIBLE_COUNTS.freePaymentEligible ||
    !guards.problemSlugLocked ||
    guards.feedEfficiencyEligible
  ) {
    console.error("BLOCKER: revenue guard mismatch detected during S4 decision run.");
    process.exit(1);
  }

  if (report.processedCount !== MAX_TOOLS) {
    console.error(`BLOCKER: expected ${MAX_TOOLS} processed, got ${report.processedCount}`);
    process.exit(1);
  }
}

main();
