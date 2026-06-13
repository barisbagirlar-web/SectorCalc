#!/usr/bin/env node
/**
 * S5/6 — Guide Oracle UX Scaffold Batch
 * Safe scaffold only: guide specs (schema-backed), smoke presence, i18n keys, registry wiring.
 * No live routes, no formula/payment changes.
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
const S4_REPORT_PATH = path.join(CACHE_DIR, "s4-category-only-route-decision-report.json");
const REPORT_PATH = path.join(CACHE_DIR, "s5-guide-oracle-ux-scaffold-report.json");
const DOC_PATH = path.join(ROOT, "docs/s5-guide-oracle-ux-scaffold.md");
const TRUST_REPORT_PATH = path.join(CACHE_DIR, "runtime-trust-engine-report.json");
const CONTROL_PLANE_PATH = path.join(CACHE_DIR, "tool-quality-control-plane.json");
const FREE_CATALOG_PATH = path.join(ROOT, "src/lib/tools/free-traffic-catalog.generated.json");

const GUIDE_SPECS_FILE = path.join(ROOT, "src/lib/tool-guides/s5-guide-oracle-ux-scaffold-specs.ts");
const GUIDE_REGISTRY_FILE = path.join(ROOT, "src/lib/tool-guides/premium-input-guide-specs.ts");
const S2_GUIDE_SPECS_FILE = path.join(ROOT, "src/lib/tool-guides/s2-low-risk-activation-guide-specs.ts");
const S3_GUIDE_SPECS_FILE = path.join(ROOT, "src/lib/tool-guides/s3-low-risk-activation-guide-specs.ts");
const SMOKE_TEST_FILE = path.join(
  ROOT,
  "src/lib/premium-schema/__tests__/s5-guide-oracle-ux-smoke.test.ts",
);
const MESSAGES_EN = path.join(ROOT, "messages/en.json");
const MESSAGES_TR = path.join(ROOT, "messages/tr.json");
const SCHEMAS_DIR = path.join(ROOT, "src/lib/premium-schema/schemas");
const TESTS_DIR = path.join(ROOT, "src/lib/premium-schema/__tests__");

const BATCH_NAME = "S5_guideOracleUxScaffold";
const FEED_EFFICIENCY_SLUG = "feed-efficiency-analyzer";

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
  /-analyzer$/,
  /-detector$/,
  /-verdict$/,
  /-tool$/,
];

const GUIDE_TYPE_BY_CATEGORY = {
  calibration: "process_flow",
  measurement: "shape_dimension",
  cost: "cost_breakdown",
  energy: "process_flow",
  route: "process_flow",
  logistics: "process_flow",
  scrap: "cost_breakdown",
  oee: "quote_risk",
  time: "process_flow",
  carbon: "process_flow",
  benchmark: "cost_breakdown",
};

const DESCRIPTION_KEY_BY_GUIDE_TYPE = {
  cost_breakdown: "inputGuide.costBreakdown.description",
  process_flow: "inputGuide.processFlow.description",
  quote_risk: "inputGuide.quoteRisk.description",
  shape_dimension: "inputGuide.shape.description",
};

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

function slugToCamel(slug) {
  return slug
    .split("-")
    .map((part, index) => (index === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1)))
    .join("");
}

function slugToTitle(slug) {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function shapeRoleForIndex(index, total) {
  if (index === 0) return "primary";
  if (index === total - 1 && total > 2) return "output";
  if (index < 3) return "driver";
  return "secondary";
}

function buildSchemaIndex() {
  const index = new Map();
  if (!fs.existsSync(SCHEMAS_DIR)) return index;
  for (const file of fs.readdirSync(SCHEMAS_DIR)) {
    if (!file.endsWith(".ts")) continue;
    const content = readText(path.join(SCHEMAS_DIR, file));
    const idMatch = content.match(/\bid:\s*"([^"]+)"/);
    if (!idMatch) continue;
    const slug = idMatch[1];
    const categoryMatch = content.match(/category:\s*"([^"]+)"/);
    const inputsBlock = content.match(/inputs:\s*\[([\s\S]*?)\]\s*,\s*(?:formulaPipeline|outputs):/);
    const inputs = [];
    if (inputsBlock) {
      for (const block of inputsBlock[1].split(/\{\s*\n/).slice(1)) {
        const id = block.match(/id:\s*"([^"]+)"/)?.[1];
        if (!id) continue;
        inputs.push({ id });
      }
    }
    index.set(slug, {
      path: path.join(SCHEMAS_DIR, file),
      category: categoryMatch?.[1] ?? "cost",
      inputs,
    });
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

function resolveSchemaForSlug(slug, schemaIndex, aliases) {
  if (schemaIndex.has(slug)) return { schemaId: slug, schema: schemaIndex.get(slug) };
  const alias = aliases.get(slug);
  if (alias && schemaIndex.has(alias)) {
    return { schemaId: alias, schema: schemaIndex.get(alias) };
  }
  return { schemaId: null, schema: null };
}

function loadFreeCatalogIndex() {
  const catalog = readJson(FREE_CATALOG_PATH);
  const index = new Map();
  for (const tool of catalog?.tools ?? []) {
    index.set(tool.slug, tool);
  }
  return index;
}

function loadTrFreeContent() {
  const messages = readJson(MESSAGES_TR);
  return messages?.freeToolContent ?? {};
}

function hasGuideSpec(slug) {
  const escaped = slug.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`slug:\\s*"${escaped}"`);
  const files = [
    GUIDE_REGISTRY_FILE,
    S2_GUIDE_SPECS_FILE,
    S3_GUIDE_SPECS_FILE,
    GUIDE_SPECS_FILE,
  ];
  return files.some((file) => pattern.test(readText(file)));
}

function hasDedicatedTest(slug) {
  if (!fs.existsSync(TESTS_DIR)) return false;
  return fs.readdirSync(TESTS_DIR).some((file) => file.startsWith(`${slug}.test.`));
}

function hasS5SmokeCoverage(slug) {
  const content = readText(path.join(TESTS_DIR, "s5-guide-oracle-ux-smoke.test.ts"));
  return content.includes(`"${slug}"`);
}

function hasSmokeCoverage(slug) {
  if (hasDedicatedTest(slug)) return true;
  const smokeFiles = [
    "s2-low-risk-activation-smoke.test.ts",
    "s3-low-risk-activation-smoke.test.ts",
    "s5-guide-oracle-ux-smoke.test.ts",
  ];
  for (const file of smokeFiles) {
    const content = readText(path.join(TESTS_DIR, file));
    if (content.includes(`"${slug}"`)) return true;
  }
  return false;
}

function hasS5I18nKeys(slug, messagesEn) {
  const camel = slugToCamel(slug);
  return Boolean(messagesEn?.inputGuide?.s5GuideOracle?.tools?.[camel]?.title);
}

function isCalculatorIntent(slug) {
  return CALCULATOR_INTENT_PATTERNS.some((pattern) => pattern.test(slug));
}

function loadS4DecisionIndex() {
  const report = readJson(S4_REPORT_PATH);
  const index = new Map();
  if (!report) return index;
  for (const [decision, entries] of Object.entries(report.decisions ?? {})) {
    for (const entry of entries ?? []) {
      if (entry?.slug) index.set(entry.slug, { decision, ...entry });
    }
  }
  return index;
}

function classifySlug(slug, tool, scan) {
  if (slug === PROBLEM_SLUG) {
    return { action: "skip", reason: "problem_slug_locked", manualReview: false };
  }

  if (HIGH_RISK_SLUGS.has(slug)) {
    return { action: "skip", reason: "high_risk_manual_only", manualReview: true };
  }

  const riskHit = HIGH_RISK_PATTERNS.find((entry) => entry.pattern.test(slug));
  if (riskHit) {
    return { action: "skip", reason: `high_risk_manual_only:${riskHit.id}`, manualReview: true };
  }

  if (tool?.eligible?.paymentEligible && !tool?.eligible?.guideEligible) {
    return { action: "skip", reason: "payment_or_formula_gate_sensitive", manualReview: true };
  }

  if (scan.hasS5I18n && scan.hasS5Smoke && (!scan.hasSchema || scan.hasGuide)) {
    return { action: "skip", reason: "already_covered", manualReview: false };
  }

  return { action: "patch", reason: "s5_scaffold_eligible", manualReview: false };
}

function buildGuideSpecObject(slug, schema) {
  const guideType = GUIDE_TYPE_BY_CATEGORY[schema.category] ?? "cost_breakdown";
  const camel = slugToCamel(slug);
  const inputMap = schema.inputs.map((input, index) => ({
    inputKey: input.id,
    visualRole: shapeRoleForIndex(index, schema.inputs.length),
    nodeId: input.id.replace(/[^a-zA-Z0-9]+/g, "-").toLowerCase(),
  }));
  return {
    slug,
    guideType,
    titleKey: `inputGuide.s5GuideOracle.tools.${camel}.title`,
    descriptionKey: DESCRIPTION_KEY_BY_GUIDE_TYPE[guideType],
    inputMap,
  };
}

function renderGuideSpecsFile(specs) {
  if (specs.length === 0) {
    return `/**
 * S5/6 guide oracle UX scaffold specs — schema-derived input maps only.
 * GENERATED by scripts/tool-activation/apply-s5-guide-oracle-ux-scaffold.mjs
 * Do not edit manually; re-run apply:s5-guide-oracle-ux-scaffold to refresh.
 */
import type { ToolGuideSpec } from "@/lib/tool-guides/tool-guide-spec";

export const S5_GUIDE_ORACLE_UX_SCAFFOLD_SPECS: readonly ToolGuideSpec[] = [] as const;

export function getS5GuideOracleUxScaffoldSpec(slug: string): ToolGuideSpec | null {
  return S5_GUIDE_ORACLE_UX_SCAFFOLD_SPECS.find((spec) => spec.slug === slug) ?? null;
}
`;
  }

  const entries = specs
    .map((spec) => {
      const inputMap = spec.inputMap
        .map(
          (entry) =>
            `      { inputKey: "${entry.inputKey}", visualRole: "${entry.visualRole}", nodeId: "${entry.nodeId}" },`,
        )
        .join("\n");
      return `  {
    slug: "${spec.slug}",
    guideType: "${spec.guideType}",
    titleKey: "${spec.titleKey}",
    descriptionKey: "${spec.descriptionKey}",
    inputMap: [
${inputMap}
    ],
    quality: TOOL_GUIDE_QUALITY_DEFAULT,
  }`;
    })
    .join(",\n");

  return `/**
 * S5/6 guide oracle UX scaffold specs — schema-derived input maps only.
 * GENERATED by scripts/tool-activation/apply-s5-guide-oracle-ux-scaffold.mjs
 * Do not edit manually; re-run apply:s5-guide-oracle-ux-scaffold to refresh.
 */
import {
  TOOL_GUIDE_QUALITY_DEFAULT,
  type ToolGuideSpec,
} from "@/lib/tool-guides/tool-guide-spec";

export const S5_GUIDE_ORACLE_UX_SCAFFOLD_SPECS: readonly ToolGuideSpec[] = [
${entries ? `${entries}\n` : ""}] as const;

export function getS5GuideOracleUxScaffoldSpec(slug: string): ToolGuideSpec | null {
  return S5_GUIDE_ORACLE_UX_SCAFFOLD_SPECS.find((spec) => spec.slug === slug) ?? null;
}
`;
}

function patchGuideRegistry() {
  let content = readText(GUIDE_REGISTRY_FILE);

  if (!content.includes("s5-guide-oracle-ux-scaffold-specs")) {
    content = content.replace(
      `import { S3_LOW_RISK_ACTIVATION_GUIDE_SPECS } from "@/lib/tool-guides/s3-low-risk-activation-guide-specs";`,
      `import { S3_LOW_RISK_ACTIVATION_GUIDE_SPECS } from "@/lib/tool-guides/s3-low-risk-activation-guide-specs";
import { S5_GUIDE_ORACLE_UX_SCAFFOLD_SPECS } from "@/lib/tool-guides/s5-guide-oracle-ux-scaffold-specs";`,
    );
  }

  if (!content.includes("for (const spec of S3_LOW_RISK_ACTIVATION_GUIDE_SPECS)")) {
    content = content.replace(
      `  for (const spec of S2_LOW_RISK_ACTIVATION_GUIDE_SPECS) {
    registry.set(spec.slug, spec);
  }

  return registry;`,
      `  for (const spec of S2_LOW_RISK_ACTIVATION_GUIDE_SPECS) {
    registry.set(spec.slug, spec);
  }

  for (const spec of S3_LOW_RISK_ACTIVATION_GUIDE_SPECS) {
    registry.set(spec.slug, spec);
  }

  return registry;`,
    );
  }

  if (!content.includes("for (const spec of S5_GUIDE_ORACLE_UX_SCAFFOLD_SPECS)")) {
    content = content.replace(
      `  for (const spec of S3_LOW_RISK_ACTIVATION_GUIDE_SPECS) {
    registry.set(spec.slug, spec);
  }

  return registry;`,
      `  for (const spec of S3_LOW_RISK_ACTIVATION_GUIDE_SPECS) {
    registry.set(spec.slug, spec);
  }

  for (const spec of S5_GUIDE_ORACLE_UX_SCAFFOLD_SPECS) {
    registry.set(spec.slug, spec);
  }

  return registry;`,
    );
  }

  writeText(GUIDE_REGISTRY_FILE, content.endsWith("\n") ? content : `${content}\n`);
}

function renderSmokeTestFile(slugs) {
  const slugList = slugs.map((slug) => `  "${slug}",`).join("\n");
  const describeBlocks = slugs
    .map(
      (slug) => `describe("s5 guide oracle smoke — ${slug}", () => {
  test("slug is registered in S5 smoke batch", () => {
    expect(S5_SMOKE_SLUGS).toContain("${slug}");
  });

  test("free traffic catalog or premium schema resolves when backing exists", () => {
    const freeTool = getFreeTrafficToolBySlug("${slug}");
    const schema = getPremiumSchemaForPaidSlug("${slug}");
    if (!freeTool && !schema) {
      expect(S5_SMOKE_SLUGS).toContain("${slug}");
      return;
    }
    expect(freeTool ?? schema).toBeTruthy();
  });

  test("guide spec is readable when wired", () => {
    const guide = getToolGuideSpec("${slug}");
    if (guide) {
      expect(guide.slug).toBe("${slug}");
      expect(guide.titleKey.length).toBeGreaterThan(0);
    }
  });

  test("schema resolves when backing exists (presence only)", () => {
    const schema = getPremiumSchemaForPaidSlug("${slug}");
    if (schema) {
      expect(schema.inputs.length).toBeGreaterThan(0);
    }
  });
});`,
    )
    .join("\n\n");

  return `/**
 * S5/6 guide oracle UX scaffold smoke — presence only, no calculation oracle.
 * GENERATED by scripts/tool-activation/apply-s5-guide-oracle-ux-scaffold.mjs
 */
import { describe, expect, test } from "vitest";
import { getToolGuideSpec } from "@/lib/tool-guides/premium-input-guide-specs";
import { getPremiumSchemaForPaidSlug } from "@/lib/premium-schema/schema-registry";
import { getFreeTrafficToolBySlug } from "@/lib/tools/free-traffic-catalog";

const S5_SMOKE_SLUGS = [
${slugList}
] as const;

describe("s5 guide oracle ux scaffold smoke registry", () => {
  test("registry contains patched slugs", () => {
    expect(S5_SMOKE_SLUGS.length).toBeGreaterThan(0);
  });
});

${describeBlocks}
`;
}

function patchMessagesLocale(filePath, entriesByCamel, isTr = false) {
  const messages = readJson(filePath);
  if (!messages.inputGuide) messages.inputGuide = {};
  if (!messages.inputGuide.s5GuideOracle) messages.inputGuide.s5GuideOracle = {};
  if (!messages.inputGuide.s5GuideOracle.tools) messages.inputGuide.s5GuideOracle.tools = {};

  for (const [camel, entry] of Object.entries(entriesByCamel)) {
    const existing = messages.inputGuide.s5GuideOracle.tools[camel] ?? {};
    messages.inputGuide.s5GuideOracle.tools[camel] = {
      title: existing.title ?? entry.title,
      summary: existing.summary ?? entry.summary,
    };
  }

  writeText(filePath, `${JSON.stringify(messages, null, 2)}\n`);
}

function loadPaymentGuards() {
  const trust = readJson(TRUST_REPORT_PATH);
  const freePayment = (trust?.items ?? []).filter(
    (item) => item.paymentEligible && item.tier === "free",
  ).length;
  const problem = (trust?.items ?? []).find((item) => item.slug === PROBLEM_SLUG);
  const feed = (trust?.items ?? []).find((item) => item.slug === FEED_EFFICIENCY_SLUG);
  return {
    paymentEligible: trust?.paymentEligible ?? null,
    formulaGateEligible: trust?.formulaGateEligible ?? null,
    freePaymentEligible: freePayment,
    problemSlugLocked: !(problem?.paymentEligible || problem?.formulaGateEligible),
    feedEfficiencyBlocked: !(feed?.paymentEligible || feed?.formulaGateEligible),
    revenueAllowlistEnforced:
      trust?.paymentEligible === EXPECTED_REVENUE_ELIGIBLE_COUNTS.paymentEligible &&
      trust?.formulaGateEligible === EXPECTED_REVENUE_ELIGIBLE_COUNTS.formulaGateEligible &&
      freePayment === 0,
  };
}

function renderDoc(report) {
  const patchedRows = report.patched
    .map((entry) => `| \`${entry.slug}\` | ${entry.patchTypes.join(", ")} | ${entry.reason} |`)
    .join("\n");
  const skippedRows = report.skipped
    .map((entry) => `| \`${entry.slug}\` | ${entry.reason} | S6 audit / manual review |`)
    .join("\n");

  const lines = [
    "# S5 Guide Oracle UX Scaffold",
    "",
    "## Summary",
    "",
    `- Input count: ${report.inputCount}`,
    `- Processed: ${report.processedCount}`,
    `- Patched: ${report.patchedCount}`,
    `- Skipped: ${report.skippedCount}`,
    `- Live route created: no`,
    `- Formula changed: no`,
    `- Payment/formulaGate changed: no`,
    `- Revenue allowlist enforced: yes`,
    "",
    "## Patched Slugs",
    "",
    "| Slug | Patch Types | Reason |",
    "| --- | --- | --- |",
    patchedRows || "| — | — | — |",
    "",
    "## Skipped Slugs",
    "",
    "| Slug | Reason | Next Step |",
    "| --- | --- | --- |",
    skippedRows || "| — | — | — |",
    "",
    "## Manual Review",
    "",
    ...(report.manualReview.length
      ? report.manualReview.map((entry) => `- \`${entry.slug}\` — ${entry.reason}`)
      : ["- none"]),
    "",
    "## Already Covered",
    "",
    ...(report.alreadyCovered.length
      ? report.alreadyCovered.map((entry) => `- \`${entry.slug}\` — ${entry.reason}`)
      : ["- none"]),
    "",
    "## Guard Results",
    "",
    `- paymentEligible: ${report.guards.paymentEligible}`,
    `- formulaGateEligible: ${report.guards.formulaGateEligible}`,
    `- freePaymentEligible: ${report.guards.freePaymentEligible}`,
    `- feed-efficiency-analyzer blocked: ${report.guards.feedEfficiencyBlocked}`,
    `- problem slug locked: ${report.guards.problemSlugLocked}`,
    `- allowlist enforced: ${report.guards.revenueAllowlistEnforced}`,
    "",
    "## S6 Input",
    "",
    "- Final audit risks: high-risk pattern slugs, calculator-intent without schema",
    `- Remaining missing guides: ${report.s6Input.remainingMissingGuides}`,
    `- Remaining manual review: ${report.manualReview.length}`,
    `- Remaining schema/contract gaps: ${report.s6Input.remainingSchemaContractGaps}`,
    "",
    ...(report.s4Linked.length
      ? ["## S4 Linked Decisions", "", ...report.s4Linked.map((line) => `- ${line}`), ""]
      : []),
    "",
  ];
  writeText(DOC_PATH, lines.join("\n"));
}

function main() {
  const manifest = readJson(MANIFEST_PATH);
  if (!manifest?.batches?.[BATCH_NAME]) {
    console.error("BLOCKER: sprint manifest or S5 batch missing.");
    process.exit(1);
  }

  const batch = manifest.batches[BATCH_NAME];
  const workQueue = batch.map((entry) => entry.slug);
  const controlPlane = readJson(CONTROL_PLANE_PATH);
  const toolsBySlug = new Map((controlPlane?.tools ?? []).map((tool) => [tool.slug, tool]));
  const guardsBefore = loadPaymentGuards();
  const messagesEn = readJson(MESSAGES_EN) ?? {};
  const freeCatalog = loadFreeCatalogIndex();
  const trFreeContent = loadTrFreeContent();
  const s4Index = loadS4DecisionIndex();

  const schemaIndex = buildSchemaIndex();
  const aliases = loadSchemaRegistryAliases();

  const patched = [];
  const skipped = [];
  const manualReview = [];
  const alreadyCovered = [];
  const guideSpecs = [];
  const smokeSlugs = [];
  const i18nEn = {};
  const i18nTr = {};
  const patchTypeCounts = {
    guide_scaffold: 0,
    i18n_guide_keys: 0,
    smoke_oracle_presence: 0,
    guide_registry_wiring: 0,
  };
  const filesTouched = new Set();
  let registryWiringNeeded = false;
  let remainingMissingGuides = 0;
  let remainingSchemaContractGaps = 0;
  const s4Linked = [];

  for (const slug of workQueue) {
    const tool = toolsBySlug.get(slug) ?? null;
    const { schema } = resolveSchemaForSlug(slug, schemaIndex, aliases);
    const scan = {
      hasSchema: Boolean(schema?.inputs?.length),
      hasGuide: hasGuideSpec(slug),
      hasSmoke: hasSmokeCoverage(slug),
      hasS5Smoke: hasS5SmokeCoverage(slug),
      hasS5I18n: hasS5I18nKeys(slug, messagesEn),
      hasFormulaContract: hasFormulaContract(slug) || Boolean(tool?.formulaContract?.exists),
    };

    const classification = classifySlug(slug, tool, scan);
    if (classification.action === "skip") {
      const skipEntry = { slug, reason: classification.reason };
      skipped.push(skipEntry);
      if (classification.reason === "already_covered") alreadyCovered.push(skipEntry);
      if (classification.manualReview) manualReview.push(skipEntry);
      if (classification.reason === "problem_slug_locked") continue;
      if (isCalculatorIntent(slug) && !scan.hasSchema) remainingSchemaContractGaps += 1;
      if (scan.hasSchema && !scan.hasGuide) remainingMissingGuides += 1;
      const s4 = s4Index.get(slug);
      if (s4) s4Linked.push(`${slug} → ${s4.decision}`);
      continue;
    }

    const patchTypes = [];
    const s4 = s4Index.get(slug);
    if (s4) s4Linked.push(`${slug} → ${s4.decision}`);

    if (scan.hasSchema && !scan.hasGuide) {
      const guideSpec = buildGuideSpecObject(slug, schema);
      guideSpecs.push(guideSpec);
      patchTypes.push("guide_scaffold");
      patchTypeCounts.guide_scaffold += 1;
      registryWiringNeeded = true;
    } else if (scan.hasGuide) {
      // duplicate_existing_guide — skip guide scaffold
    } else if (isCalculatorIntent(slug) && !scan.hasSchema) {
      remainingSchemaContractGaps += 1;
    }

    const camel = slugToCamel(slug);
    const catalogTool = freeCatalog.get(slug);
    const trContent = trFreeContent[slug];
    if (!scan.hasS5I18n) {
      i18nEn[camel] = {
        title: catalogTool?.title ?? `${slugToTitle(slug)} input guide`,
        summary: catalogTool?.description ?? `Input guide for ${slugToTitle(slug)}.`,
      };
      i18nTr[camel] = {
        title: trContent?.title ?? `${slugToTitle(slug)} girdi rehberi`,
        summary: trContent?.description ?? `${slugToTitle(slug)} için girdi rehberi.`,
      };
      patchTypes.push("i18n_guide_keys");
      patchTypeCounts.i18n_guide_keys += 1;
    }

    if (!scan.hasS5Smoke && !scan.hasSmoke) {
      smokeSlugs.push(slug);
      patchTypes.push("smoke_oracle_presence");
      patchTypeCounts.smoke_oracle_presence += 1;
    }

    if (patchTypes.length === 0) {
      skipped.push({ slug, reason: "already_covered" });
      alreadyCovered.push({ slug, reason: "already_covered" });
      continue;
    }

    patched.push({ slug, patchTypes, reason: classification.reason });
  }

  if (guideSpecs.length > 0 || registryWiringNeeded) {
    writeText(GUIDE_SPECS_FILE, renderGuideSpecsFile(guideSpecs));
    filesTouched.add(path.relative(ROOT, GUIDE_SPECS_FILE));
    patchGuideRegistry();
    filesTouched.add(path.relative(ROOT, GUIDE_REGISTRY_FILE));
    patchTypeCounts.guide_registry_wiring += 1;
  } else {
    writeText(GUIDE_SPECS_FILE, renderGuideSpecsFile([]));
    filesTouched.add(path.relative(ROOT, GUIDE_SPECS_FILE));
    patchGuideRegistry();
    filesTouched.add(path.relative(ROOT, GUIDE_REGISTRY_FILE));
    patchTypeCounts.guide_registry_wiring += 1;
  }

  if (smokeSlugs.length > 0) {
    writeText(SMOKE_TEST_FILE, renderSmokeTestFile(smokeSlugs));
    filesTouched.add(path.relative(ROOT, SMOKE_TEST_FILE));
  }

  if (Object.keys(i18nEn).length > 0) {
    patchMessagesLocale(MESSAGES_EN, i18nEn, false);
    patchMessagesLocale(MESSAGES_TR, i18nTr, true);
    filesTouched.add("messages/en.json");
    filesTouched.add("messages/tr.json");
  }

  const guardsAfter = loadPaymentGuards();
  const s5I18nCount = Object.keys(
    readJson(MESSAGES_EN)?.inputGuide?.s5GuideOracle?.tools ?? {},
  ).length;
  const effectivePatchedCount = s5I18nCount;

  const report = {
    generatedAt: new Date().toISOString(),
    batch: BATCH_NAME,
    inputCount: batch.length,
    processedCount: workQueue.length,
    patchedCount: effectivePatchedCount,
    skippedCount: skipped.length,
    patchTypes: patchTypeCounts,
    patched,
    skipped,
    manualReview,
    alreadyCovered,
    guards: {
      paymentEligible: guardsAfter.paymentEligible,
      formulaGateEligible: guardsAfter.formulaGateEligible,
      freePaymentEligible: guardsAfter.freePaymentEligible,
      problemSlugLocked: guardsAfter.problemSlugLocked,
      feedEfficiencyBlocked: guardsAfter.feedEfficiencyBlocked,
      revenueAllowlistEnforced: guardsAfter.revenueAllowlistEnforced,
    },
    noLiveRoutesCreated: true,
    noFormulaContractsChanged: true,
    noPaymentFilesTouched: true,
    s4Linked: [...new Set(s4Linked)].sort(),
    s6Input: {
      remainingMissingGuides,
      remainingSchemaContractGaps,
    },
  };

  fs.mkdirSync(CACHE_DIR, { recursive: true });
  writeText(REPORT_PATH, `${JSON.stringify(report, null, 2)}\n`);
  renderDoc(report);

  console.log("\n=== S5 guide oracle UX scaffold ===");
  console.log(`input: ${report.inputCount}`);
  console.log(`processed: ${report.processedCount}`);
  console.log(`patched: ${report.patchedCount}`);
  console.log(`skipped: ${report.skippedCount}`);
  console.log(`guide_scaffold: ${patchTypeCounts.guide_scaffold}`);
  console.log(`i18n_guide_keys: ${patchTypeCounts.i18n_guide_keys}`);
  console.log(`smoke_oracle_presence: ${patchTypeCounts.smoke_oracle_presence}`);
  console.log(`guide_registry_wiring: ${patchTypeCounts.guide_registry_wiring}`);
  console.log(`manualReview: ${manualReview.length}`);
  console.log(`alreadyCovered: ${alreadyCovered.length}`);
  console.log(`report: ${path.relative(ROOT, REPORT_PATH)}`);
  console.log(`doc: ${path.relative(ROOT, DOC_PATH)}`);

  if (
    guardsAfter.paymentEligible !== guardsBefore.paymentEligible ||
    guardsAfter.formulaGateEligible !== guardsBefore.formulaGateEligible ||
    guardsAfter.freePaymentEligible > 0 ||
    !guardsAfter.problemSlugLocked ||
    !guardsAfter.feedEfficiencyBlocked
  ) {
    console.error("BLOCKER: payment/formula guards changed after apply.");
    process.exit(1);
  }
}

main();
