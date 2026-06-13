#!/usr/bin/env node
/**
 * S2/6 — Low-Risk Activation Batch 1
 * Safe scaffold only: guide specs, smoke oracles, i18n keys.
 * No payment/formula gate unlock, no formula invention.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ROOT } from "./lib/activation-paths.mjs";
import { RISK_CLASS } from "./lib/p6a-premium-schema-fail-lib.mjs";
import { PROBLEM_SLUG } from "./lib/p25-control-plane-lib.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CACHE_DIR = path.join(ROOT, "scripts/.cache");
const MANIFEST_PATH = path.join(CACHE_DIR, "sprint-tool-activation-manifest.json");
const REPORT_PATH = path.join(CACHE_DIR, "s2-low-risk-activation-report.json");
const DOC_PATH = path.join(ROOT, "docs/s2-low-risk-activation-batch-1.md");
const TRUST_REPORT_PATH = path.join(CACHE_DIR, "runtime-trust-engine-report.json");
const CONTROL_PLANE_PATH = path.join(CACHE_DIR, "tool-quality-control-plane.json");

const GUIDE_SPECS_FILE = path.join(ROOT, "src/lib/tool-guides/s2-low-risk-activation-guide-specs.ts");
const GUIDE_REGISTRY_FILE = path.join(ROOT, "src/lib/tool-guides/premium-input-guide-specs.ts");
const SMOKE_TEST_FILE = path.join(
  ROOT,
  "src/lib/premium-schema/__tests__/s2-low-risk-activation-smoke.test.ts",
);
const MESSAGES_EN = path.join(ROOT, "messages/en.json");
const MESSAGES_TR = path.join(ROOT, "messages/tr.json");
const SCHEMAS_DIR = path.join(ROOT, "src/lib/premium-schema/schemas");
const TESTS_DIR = path.join(ROOT, "src/lib/premium-schema/__tests__");
const GUIDE_SPECS_INDEX_FILE = GUIDE_REGISTRY_FILE;

const BATCH_NAME = "S2_lowRiskActivationBatch1";

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

const RISK_EXCLUSION_PATTERNS = [
  { id: "auto-repair", pattern: /^auto-repair-/ },
  { id: "carbon-footprint-compliance", pattern: /carbon-footprint-compliance/i },
  { id: "legal", pattern: /^legal-/ },
  { id: "electrical", pattern: /^electrical-/ },
  { id: "pressure-vessel", pattern: /^pressure-vessel-/ },
  { id: "cbam", pattern: /^cbam-/ },
  { id: "ai-uyum-etik-act", pattern: /ai-uyum|etik|(^|-)act(-|$)/i },
  { id: "welded-bolted", pattern: /welded-bolted/ },
  { id: "safety-critical", pattern: /safety-critical/i },
  { id: "fire-system", pattern: /fire-system/i },
  { id: "hydrant", pattern: /hydrant/i },
  { id: "bolt-tightening", pattern: /bolt-tightening/i },
  { id: "hydraulic", pattern: /hydraulic/i },
  { id: "pneumatic", pattern: /pneumatic/i },
  { id: "severance", pattern: /severance/i },
  { id: "annual-leave", pattern: /annual-leave/i },
  { id: "notice", pattern: /notice/i },
  { id: "labor-law", pattern: /labor-law/i },
  { id: "tax-law", pattern: /tax-law/i },
  { id: "compliance", pattern: /compliance/i },
  { id: "regulatory", pattern: /regulatory/i },
  { id: "safety", pattern: /safety/i },
  { id: "certification", pattern: /certification/i },
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
        inputs.push({
          id,
          required: /required:\s*true/.test(block),
          type: block.match(/type:\s*"([^"]+)"/)?.[1] ?? "number",
        });
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

function hasGuideSpec(slug) {
  const escaped = slug.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`slug:\\s*"${escaped}"`);
  if (pattern.test(readText(GUIDE_SPECS_INDEX_FILE))) return true;
  if (pattern.test(readText(GUIDE_SPECS_FILE))) return true;
  return false;
}

function hasDedicatedTest(slug) {
  if (!fs.existsSync(TESTS_DIR)) return false;
  return fs.readdirSync(TESTS_DIR).some((file) => file.startsWith(`${slug}.test.`));
}

function hasFormulaContract(slug) {
  const contractsDir = path.join(ROOT, "src/lib/formula-governance/contracts");
  const pattern = new RegExp(`slug:\\s*"${slug.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"`);
  if (pattern.test(readText(path.join(ROOT, "src/lib/formula-governance/contracts.ts")))) {
    return true;
  }
  if (!fs.existsSync(contractsDir)) return false;
  return fs.readdirSync(contractsDir).some((file) => {
    if (!file.endsWith(".ts")) return false;
    return pattern.test(readText(path.join(contractsDir, file)));
  });
}

function classifySlug(slug, tool) {
  if (slug === PROBLEM_SLUG) {
    return { decision: "skipHighRisk", reason: "problem_slug_locked" };
  }
  if (HIGH_RISK_SLUGS.has(slug)) {
    return { decision: "skipHighRisk", reason: "high_risk_manual_only" };
  }
  if (HIGH_RISK_SLUG_PATTERNS.some((re) => re.test(slug))) {
    return { decision: "skipHighRisk", reason: "high_risk_pattern" };
  }
  const riskExclusion = RISK_EXCLUSION_PATTERNS.find((entry) => entry.pattern.test(slug));
  if (riskExclusion) {
    return { decision: "skipHighRisk", reason: `risk_exclusion:${riskExclusion.id}` };
  }
  if (RISK_CLASS.MEDIUM_RISK_ALIGNMENT.includes(slug)) {
    return { decision: "skipManualReview", reason: "medium_risk_alignment" };
  }
  if (MEDIUM_RISK_PATTERNS.some((re) => re.test(slug))) {
    return { decision: "skipManualReview", reason: "medium_risk_pattern" };
  }
  if (!tool) {
    return { decision: "skipMissingCore", reason: "not_in_control_plane" };
  }
  if (tool.recommendedAction === "manual_review" || tool.recommendedAction === "keep_safe") {
    return { decision: "skipManualReview", reason: tool.recommendedAction };
  }
  if (tool.routeStatus === "category_stub" || tool.routeStatus === "category-only") {
    return { decision: "skipUnknownPattern", reason: "category_only_route" };
  }
  const hasCore =
    tool.schema?.exists ||
    tool.formulaContract?.exists ||
    hasFormulaContract(slug) ||
    tool.validation?.exists;
  if (!hasCore) {
    return { decision: "skipMissingCore", reason: "missing_schema_contract_validation" };
  }
  return { decision: "applySafeScaffold", reason: "low_risk_scaffold_eligible" };
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
    titleKey: `inputGuide.s2Activation.tools.${camel}.title`,
    descriptionKey: DESCRIPTION_KEY_BY_GUIDE_TYPE[guideType],
    inputMap,
    quality: {
      allowGeneric: false,
      requiresInputMapping: true,
      requiresMobileCheck: true,
    },
  };
}

function renderGuideSpecsFile(specs) {
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
 * S2/6 low-risk activation guide specs — schema-derived input maps.
 * GENERATED by scripts/tool-activation/apply-s2-low-risk-activation-batch.mjs
 * Do not edit manually; re-run apply:s2-low-risk-activation to refresh.
 */
import {
  TOOL_GUIDE_QUALITY_DEFAULT,
  type ToolGuideSpec,
} from "@/lib/tool-guides/tool-guide-spec";

export const S2_LOW_RISK_ACTIVATION_GUIDE_SPECS: readonly ToolGuideSpec[] = [
${entries}
] as const;

export function getS2LowRiskActivationGuideSpec(slug: string): ToolGuideSpec | null {
  return S2_LOW_RISK_ACTIVATION_GUIDE_SPECS.find((spec) => spec.slug === slug) ?? null;
}
`;
}

function patchGuideRegistry() {
  let content = readText(GUIDE_REGISTRY_FILE);
  if (!content.includes("s2-low-risk-activation-guide-specs")) {
    content = content.replace(
      `} from "@/lib/tool-guides/tool-guide-spec";`,
      `} from "@/lib/tool-guides/tool-guide-spec";
import { S2_LOW_RISK_ACTIVATION_GUIDE_SPECS } from "@/lib/tool-guides/s2-low-risk-activation-guide-specs";`,
    );
  }
  if (!content.includes("S2_LOW_RISK_ACTIVATION_GUIDE_SPECS")) {
    content = content.replace(
      `  for (const slug of listShapeDimensionGuideSlugs()) {
    const shapeSpec = shapeGuideToSpec(slug);
    if (shapeSpec) {
      registry.set(slug, shapeSpec);
    }
  }

  return registry;`,
      `  for (const slug of listShapeDimensionGuideSlugs()) {
    const shapeSpec = shapeGuideToSpec(slug);
    if (shapeSpec) {
      registry.set(slug, shapeSpec);
    }
  }

  for (const spec of S2_LOW_RISK_ACTIVATION_GUIDE_SPECS) {
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
      (slug) => `describe("s2 activation smoke — ${slug}", () => {
  test("schema resolves with inputs and outputs", () => {
    const schema =
      getPremiumCalculatorSchema("${slug}") ?? getPremiumSchemaForPaidSlug("${slug}");
    expect(schema).not.toBeNull();
    expect(schema?.inputs.length).toBeGreaterThan(0);
    expect(schema?.outputs.length).toBeGreaterThan(0);
  });

  test("validation scaffold accepts default input shape (smoke only)", () => {
    const schema =
      getPremiumCalculatorSchema("${slug}") ?? getPremiumSchemaForPaidSlug("${slug}");
    if (!schema) throw new Error("schema missing");
    const inputs = buildDefaultSchemaInputs(schema);
    expect(Object.keys(inputs).length).toBe(schema.inputs.length);
  });

  test("engine returns finite outputs (smoke only — not accuracy oracle)", () => {
    const schema =
      getPremiumCalculatorSchema("${slug}") ?? getPremiumSchemaForPaidSlug("${slug}");
    if (!schema) throw new Error("schema missing");
    const inputs = buildDefaultSchemaInputs(schema);
    const result = runPremiumSchemaEngine(schema, inputs);
    expect(result.outputs.length).toBeGreaterThan(0);
    for (const output of result.outputs) {
      if (typeof output.raw === "number") {
        expect(Number.isFinite(output.raw)).toBe(true);
      }
    }
  });
});`,
    )
    .join("\n\n");

  return `/**
 * S2/6 low-risk activation smoke oracles — route/render/input smoke only.
 * GENERATED by scripts/tool-activation/apply-s2-low-risk-activation-batch.mjs
 */
import { describe, expect, test } from "vitest";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";
import {
  getPremiumCalculatorSchema,
  getPremiumSchemaForPaidSlug,
} from "@/lib/premium-schema/schema-registry";

const S2_SMOKE_SLUGS = [
${slugList}
] as const;

describe("s2 low-risk activation smoke registry", () => {
  test("registry contains patched slugs", () => {
    expect(S2_SMOKE_SLUGS.length).toBeGreaterThan(0);
  });
});

${describeBlocks}
`;
}

function patchMessagesLocale(filePath, locale, titlesByCamel) {
  const messages = readJson(filePath);
  if (!messages.inputGuide) messages.inputGuide = {};
  if (!messages.inputGuide.s2Activation) messages.inputGuide.s2Activation = {};
  if (!messages.inputGuide.s2Activation.tools) messages.inputGuide.s2Activation.tools = {};

  for (const [camel, title] of Object.entries(titlesByCamel)) {
    if (!messages.inputGuide.s2Activation.tools[camel]) {
      messages.inputGuide.s2Activation.tools[camel] = { title };
    } else if (!messages.inputGuide.s2Activation.tools[camel].title) {
      messages.inputGuide.s2Activation.tools[camel].title = title;
    }
  }

  writeText(filePath, `${JSON.stringify(messages, null, 2)}\n`);
}

function loadPaymentGuards() {
  const trust = readJson(TRUST_REPORT_PATH);
  const freePayment = (trust?.items ?? []).filter(
    (item) => item.paymentEligible && item.tier === "free",
  ).length;
  const problem = (trust?.items ?? []).find((item) => item.slug === PROBLEM_SLUG);
  return {
    paymentEligible: trust?.paymentEligible ?? null,
    formulaGateEligible: trust?.formulaGateEligible ?? null,
    freePaymentEligible: freePayment,
    problemSlugLocked: !(problem?.paymentEligible || problem?.formulaGateEligible),
  };
}

function renderDoc(report) {
  const lines = [
    "# S2 Low-Risk Activation Batch 1",
    "",
    `Generated: ${report.generatedAt}`,
    "",
    "## Summary",
    "",
    `- Batch: \`${report.batch}\``,
    `- Input count: ${report.inputCount}`,
    `- Patched: ${report.patched.length}`,
    `- Skipped: ${report.skipped.length}`,
    "",
    "## Patched slugs",
    "",
    ...report.patched.map(
      (entry) =>
        `- \`${entry.slug}\` — ${entry.patchTypes.join(", ")}`,
    ),
    "",
    "## Skipped slugs",
    "",
    ...report.skipped.map((entry) => `- \`${entry.slug}\` — ${entry.reason}`),
    "",
    "## Missing core",
    "",
    ...(report.missingCore.length
      ? report.missingCore.map((entry) => `- \`${entry.slug}\` — ${entry.reason}`)
      : ["- none"]),
    "",
    "## Manual review",
    "",
    ...(report.manualReview.length
      ? report.manualReview.map((entry) => `- \`${entry.slug}\` — ${entry.reason}`)
      : ["- none"]),
    "",
    "## High risk skipped",
    "",
    ...(report.highRiskSkipped.length
      ? report.highRiskSkipped.map((entry) => `- \`${entry.slug}\` — ${entry.reason}`)
      : ["- none"]),
    "",
    "## Unknown pattern skipped",
    "",
    ...(report.unknownPatternSkipped.length
      ? report.unknownPatternSkipped.map((entry) => `- \`${entry.slug}\` — ${entry.reason}`)
      : ["- none"]),
    "",
    "## Patch types applied",
    "",
    "- `guide_scaffold` — schema-derived input guide specs",
    "- `smoke_oracle` — vitest smoke tests (no accuracy claims)",
    "- `i18n_guide_keys` — TR/EN title keys under `inputGuide.s2Activation.tools`",
    "",
    "## Files touched",
    "",
    ...report.filesTouched.map((file) => `- \`${file}\``),
    "",
    "## Revenue / payment / formula gate safety",
    "",
    `- paymentEligible: ${report.guards.paymentEligibleBefore} → ${report.guards.paymentEligibleAfter}`,
    `- formulaGateEligible: ${report.guards.formulaGateEligibleBefore} → ${report.guards.formulaGateEligibleAfter}`,
    `- free paymentEligible: ${report.guards.freePaymentEligible}`,
    `- problem slug locked: ${report.guards.problemSlugLocked}`,
    "",
    "## S3 handoff candidates",
    "",
    ...report.skipped
      .filter((entry) => entry.reason.includes("medium_risk"))
      .map((entry) => `- \`${entry.slug}\``),
    "",
    "## Rollback",
    "",
    "```bash",
    "git restore src/lib/tool-guides/s2-low-risk-activation-guide-specs.ts \\",
    "  src/lib/tool-guides/premium-input-guide-specs.ts \\",
    "  src/lib/premium-schema/__tests__/s2-low-risk-activation-smoke.test.ts \\",
    "  messages/en.json messages/tr.json \\",
    "  docs/s2-low-risk-activation-batch-1.md \\",
    "  scripts/tool-activation/apply-s2-low-risk-activation-batch.mjs \\",
    "  package.json",
    "```",
    "",
  ];
  writeText(DOC_PATH, lines.join("\n"));
}

function main() {
  const manifest = readJson(MANIFEST_PATH);
  if (!manifest?.batches?.[BATCH_NAME]) {
    console.error("BLOCKER: sprint manifest or S2 batch missing.");
    console.error(`Expected: ${MANIFEST_PATH}`);
    process.exit(1);
  }

  const batch = manifest.batches[BATCH_NAME];
  const controlPlane = readJson(CONTROL_PLANE_PATH);
  const toolsBySlug = new Map((controlPlane?.tools ?? []).map((tool) => [tool.slug, tool]));
  const guardsBefore = loadPaymentGuards();

  const schemaIndex = buildSchemaIndex();
  const aliases = loadSchemaRegistryAliases();

  const patched = [];
  const skipped = [];
  const manualReview = [];
  const missingCore = [];
  const highRiskSkipped = [];
  const unknownPatternSkipped = [];
  const filesTouched = new Set();
  const guideSpecs = [];
  const smokeSlugs = [];
  const titlesEn = {};
  const titlesTr = {};

  for (const entry of batch) {
    const slug = entry.slug;
    const tool = toolsBySlug.get(slug) ?? null;
    const classification = classifySlug(slug, tool);

    if (classification.decision !== "applySafeScaffold") {
      const skipEntry = { slug, reason: classification.reason, decision: classification.decision };
      skipped.push(skipEntry);
      if (classification.decision === "skipManualReview") manualReview.push(skipEntry);
      if (classification.decision === "skipMissingCore") missingCore.push(skipEntry);
      if (classification.decision === "skipHighRisk") highRiskSkipped.push(skipEntry);
      if (classification.decision === "skipUnknownPattern") unknownPatternSkipped.push(skipEntry);
      continue;
    }

    const { schema } = resolveSchemaForSlug(slug, schemaIndex, aliases);
    const patchTypes = [];

    if (schema && schema.inputs.length > 0 && !hasGuideSpec(slug)) {
      const guideSpec = buildGuideSpecObject(slug, schema);
      guideSpecs.push(guideSpec);
      patchTypes.push("guide_scaffold");
      const camel = slugToCamel(slug);
      titlesEn[camel] = `${slugToTitle(slug)} input map`;
      titlesTr[camel] = `${slugToTitle(slug)} girdi haritası`;
      patchTypes.push("i18n_guide_keys");
    }

    if (!hasDedicatedTest(slug)) {
      smokeSlugs.push(slug);
      patchTypes.push("smoke_oracle");
    }

    if (patchTypes.length === 0) {
      skipped.push({ slug, reason: "no_safe_scaffold_gap", decision: "skipped" });
      continue;
    }

    patched.push({ slug, patchTypes, reason: classification.reason });
  }

  if (guideSpecs.length > 0) {
    writeText(GUIDE_SPECS_FILE, renderGuideSpecsFile(guideSpecs));
    filesTouched.add(path.relative(ROOT, GUIDE_SPECS_FILE));
    patchGuideRegistry();
    filesTouched.add(path.relative(ROOT, GUIDE_REGISTRY_FILE));
  }

  if (smokeSlugs.length > 0) {
    writeText(SMOKE_TEST_FILE, renderSmokeTestFile(smokeSlugs));
    filesTouched.add(path.relative(ROOT, SMOKE_TEST_FILE));
  }

  if (Object.keys(titlesEn).length > 0) {
    patchMessagesLocale(MESSAGES_EN, "en", titlesEn);
    patchMessagesLocale(MESSAGES_TR, "tr", titlesTr);
    filesTouched.add("messages/en.json");
    filesTouched.add("messages/tr.json");
  }

  const guardsAfter = loadPaymentGuards();

  const report = {
    generatedAt: new Date().toISOString(),
    batch: BATCH_NAME,
    inputCount: batch.length,
    patched,
    skipped,
    manualReview,
    missingCore,
    highRiskSkipped,
    unknownPatternSkipped,
    filesTouched: [...filesTouched].sort(),
    guards: {
      paymentEligibleBefore: guardsBefore.paymentEligible,
      paymentEligibleAfter: guardsAfter.paymentEligible,
      formulaGateEligibleBefore: guardsBefore.formulaGateEligible,
      formulaGateEligibleAfter: guardsAfter.formulaGateEligible,
      freePaymentEligible: guardsAfter.freePaymentEligible,
      problemSlugLocked: guardsAfter.problemSlugLocked,
    },
  };

  fs.mkdirSync(CACHE_DIR, { recursive: true });
  writeText(REPORT_PATH, `${JSON.stringify(report, null, 2)}\n`);
  renderDoc(report);

  console.log("\n=== S2 low-risk activation batch ===");
  console.log(`input: ${report.inputCount}`);
  console.log(`patched: ${patched.length}`);
  console.log(`skipped: ${skipped.length}`);
  console.log(`highRiskSkipped: ${highRiskSkipped.length}`);
  console.log(`manualReview: ${manualReview.length}`);
  console.log(`filesTouched: ${report.filesTouched.length}`);
  console.log(`report: ${path.relative(ROOT, REPORT_PATH)}`);
  console.log(`doc: ${path.relative(ROOT, DOC_PATH)}`);

  if (
    guardsAfter.paymentEligible !== guardsBefore.paymentEligible ||
    guardsAfter.formulaGateEligible !== guardsBefore.formulaGateEligible ||
    guardsAfter.freePaymentEligible > 0 ||
    !guardsAfter.problemSlugLocked
  ) {
    console.error("BLOCKER: payment/formula guards changed after apply.");
    process.exit(1);
  }
}

main();
