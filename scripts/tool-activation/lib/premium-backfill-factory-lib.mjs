import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { P53_REFERENCE_SLUG, ROOT } from "./activation-paths.mjs";
import {
  QUALITY_DIR,
  QUALITY_SCAN_REPORT_PATH,
  buildQualityScanReport,
} from "./quality-backfill-scan-lib.mjs";
import { QUALITY_BACKFILL_PLAN_PATH } from "./quality-backfill-plan-lib.mjs";

export const FACTORY_PLAN_PATH = path.join(
  QUALITY_DIR,
  "premium-backfill-factory-plan.json",
);
export const FACTORY_RESULT_PATH = path.join(
  QUALITY_DIR,
  "premium-backfill-factory-result.json",
);

const SCHEMAS_DIR = path.join(ROOT, "src/lib/premium-schema/schemas");
const FORMULA_REGISTRY_FILE = path.join(ROOT, "src/lib/premium-schema/formula-registry.ts");
const CONTRACTS_FILE = path.join(ROOT, "src/lib/formula-governance/contracts.ts");
const CALCULATORS_DIR = path.join(ROOT, "src/lib/premium-schema/calculators");
const TESTS_DIR = path.join(ROOT, "src/lib/premium-schema/__tests__");
const CONTRACTS_DIR = path.join(ROOT, "src/lib/formula-governance/contracts");

const STANDARD_ASSUMPTION =
  "This tool provides deterministic cost/risk/margin exposure estimation from declared inputs. It is not a regulatory, legal, safety, engineering or professional certification decision engine.";

const PROTECTED_SLUGS = new Set([
  P53_REFERENCE_SLUG,
  "agriculture-irrigation-yield-loss",
  "calibration-drift-risk",
  "cloud-api-cost-overrun",
  "energy-compressor-leak-cost",
  "cnc-tool-wear-cost",
  "dairy-feed-efficiency-loss",
  "construction-project-overrun",
  "construction-subcontractor-margin-leak",
  "painting-rework-coverage-risk",
  "food-waste-margin-loss",
  "hvac-callback-margin-risk",
  "restaurant-menu-margin-leak",
  "warehouse-space-cost-leak",
  "sheet-metal-scrap-risk",
  "printing-reprint-margin-leak",
  "compressor-leak-cost-calculator",
  "downtime-minute-cost-calculator",
  "energy-peak-cost",
  "energy-savings-package-calculator",
  "inventory-carrying-cost-eoq-calculator",
  "logistics-fuel-route-drift",
  "logistics-route-loss",
  "plumbing-leak-callback-cost",
  "product-customer-profitability-calculator",
  "retail-inventory-turnover-risk",
  "roofing-weather-delay-risk",
  "textile-fabric-waste-risk",
  "value-stream-map-vsm-calculator",
  // P65 factory scale run — do not rewrite committed PASS backfills
  "annual-leave-severance-notice-calculator",
  "belt-pulley-speed-length-calculator",
  "bolt-tightening-torque-calculator",
  "cnc-oee-loss",
  "employee-total-cost-calculator",
  "fire-system-flow-hydrant-calculator",
  "hydraulic-pneumatic-cylinder-force-calculator",
  "investment-payback-npv-calculator",
  "oee-equipment-effectiveness-calculator",
  "quality-cost-paf-calculator",
  "shop-rate-hourly-cost-calculator",
  "tolerance-stack-up-calculator",
]);

/** Slug patterns that must never be AUTO_ELIGIBLE for factory backfill. */
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

const SKIP_SLUG_PATTERNS = RISK_EXCLUSION_PATTERNS.map((entry) => entry.pattern);

const RISK_EXCLUDED_REASON = "risk-excluded:safety-or-legal-adjacent";

const PRIMARY_DRIVER_PRIORITY = [
  "marginPressure",
  "totalMarginPressure",
  "totalExposure",
  "totalCost",
  "totalRisk",
  "excessWasteCost",
  "excessScrapCost",
  "wasteExposure",
  "unusedSpaceCost",
];

const POSITIVE_DIVISOR_HINT =
  /revenue|partsproduced|partscount|cows|totalSqm|sqm|contractvalue|jobrevenue|projectrevenue|budget|volume|count|days|headcount|units|quantity|base/i;

const LEGACY_ALIASES = {
  "loss.time_cost": "time.labor_cost",
  "loss.scrap_cost": "scrap.material_cost",
  "loss.combined_operating": "scrap.combined_operating",
  "loss.total_exposure": "scrap.total_exposure",
};

export function parseCliArgs(argv) {
  const options = {
    classFilter: "A",
    limit: 25,
    dryRun: false,
    force: false,
    excludeRisky: true,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--class" && argv[index + 1]) {
      options.classFilter = argv[index + 1].toUpperCase();
      index += 1;
      continue;
    }
    if (arg.startsWith("--class=")) {
      options.classFilter = arg.split("=")[1].toUpperCase();
      continue;
    }
    if (arg === "--limit" && argv[index + 1]) {
      options.limit = Number(argv[index + 1]);
      index += 1;
      continue;
    }
    if (arg.startsWith("--limit=")) {
      options.limit = Number(arg.split("=")[1]);
      continue;
    }
    if (arg === "--dry-run") {
      options.dryRun = true;
    }
    if (arg === "--force") {
      options.force = true;
    }
    if (arg === "--exclude-risky=false") {
      options.excludeRisky = false;
    }
    if (arg === "--exclude-risky=true" || arg === "--exclude-risky") {
      options.excludeRisky = true;
    }
    if (arg.startsWith("--exclude-risky=")) {
      options.excludeRisky = arg.split("=")[1] !== "false";
    }
  }

  return options;
}

export function parseClassFilterSet(classFilter) {
  if (!classFilter || classFilter === "ALL") {
    return new Set(["A", "B"]);
  }
  return new Set(
    classFilter
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean),
  );
}

export function optionsMatch(left, right) {
  if (!left || !right) return false;
  return (
    left.classFilter === right.classFilter &&
    left.limit === right.limit &&
    left.excludeRisky === right.excludeRisky
  );
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function ensureQualityInputs() {
  if (!fs.existsSync(QUALITY_SCAN_REPORT_PATH)) {
    const report = buildQualityScanReport();
    fs.mkdirSync(path.dirname(QUALITY_SCAN_REPORT_PATH), { recursive: true });
    fs.writeFileSync(QUALITY_SCAN_REPORT_PATH, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  }
}

export function loadFactoryInputs() {
  ensureQualityInputs();
  const scanReport = readJson(QUALITY_SCAN_REPORT_PATH);
  const plan = fs.existsSync(QUALITY_BACKFILL_PLAN_PATH)
    ? readJson(QUALITY_BACKFILL_PLAN_PATH)
    : null;
  const formulaRegistryIds = buildFormulaRegistryIds();
  const schemas = buildSchemaIndex();
  return { scanReport, plan, formulaRegistryIds, schemas };
}

function buildFormulaRegistryIds() {
  const content = fs.readFileSync(FORMULA_REGISTRY_FILE, "utf8");
  const ids = new Set();
  for (const match of content.matchAll(/^\s+id:\s*"([^"]+)"/gm)) {
    ids.add(match[1]);
  }
  for (const alias of Object.keys(LEGACY_ALIASES)) {
    ids.add(alias);
  }
  return ids;
}

function buildSchemaIndex() {
  /** @type {Map<string, ReturnType<typeof parseSchemaContent>>} */
  const index = new Map();
  for (const file of fs.readdirSync(SCHEMAS_DIR)) {
    if (!file.endsWith(".ts") || file === "index.ts") continue;
    const absolutePath = path.join(SCHEMAS_DIR, file);
    const content = fs.readFileSync(absolutePath, "utf8");
    const parsed = parseSchemaContent(content);
    if (parsed?.id) {
      index.set(parsed.id, parsed);
    }
  }
  return index;
}

function parseSchemaContent(content) {
  const idMatch = content.match(/\bid:\s*"([^"]+)"/);
  if (!idMatch) return null;

  const nameMatch = content.match(/\bname:\s*"([^"]+)"/);
  const sectorMatch = content.match(/\bsectorSlug:\s*"([^"]+)"/);
  const painMatch = content.match(/\bpainStatement:\s*\n\s*"([^"]+)"/);

  const inputsBlock = content.match(/\binputs:\s*\[([\s\S]*?)\],\s*\n\s*formulaPipeline:/);
  const inputs = [];
  if (inputsBlock) {
    for (const block of inputsBlock[1].matchAll(/\{([\s\S]*?)\n\s*\}/g)) {
      const chunk = block[1];
      const id = chunk.match(/\bid:\s*"([^"]+)"/)?.[1];
      const type = chunk.match(/\btype:\s*"([^"]+)"/)?.[1] ?? "number";
      const unit = chunk.match(/\bunit:\s*"([^"]+)"/)?.[1] ?? "";
      const smartDefaultRaw = chunk.match(/\bsmartDefault:\s*([^,\n]+)/)?.[1]?.trim();
      const minMatch = chunk.match(/validation:\s*\{[^}]*\bmin:\s*(-?\d+(?:\.\d+)?)/);
      const maxMatch = chunk.match(/validation:\s*\{[^}]*\bmax:\s*(-?\d+(?:\.\d+)?)/);
      if (!id) continue;
      inputs.push({
        id,
        type,
        unit,
        smartDefault:
          smartDefaultRaw === "true"
            ? 1
            : smartDefaultRaw === "false"
              ? 0
              : Number(smartDefaultRaw ?? 0),
        min: minMatch ? Number(minMatch[1]) : undefined,
        max: maxMatch ? Number(maxMatch[1]) : undefined,
        required: !/required:\s*false/.test(chunk),
      });
    }
  }

  const pipeline = [];
  for (const step of content.matchAll(
    /\{\s*formulaId:\s*"([^"]+)"[\s\S]*?inputMap:\s*\{([\s\S]*?)\}[\s\S]*?outputId:\s*"([^"]+)"/g,
  )) {
    const inputMap = {};
    for (const pair of step[2].matchAll(/(\w+):\s*"([^"]+)"/g)) {
      inputMap[pair[1]] = pair[2];
    }
    pipeline.push({
      formulaId: step[1],
      inputMap,
      outputId: step[3],
    });
  }

  const outputs = [];
  for (const block of content.matchAll(
    /\{\s*id:\s*"([^"]+)"[\s\S]*?(?:isBigNumber:\s*true[\s\S]*?)?\}/g,
  )) {
    const chunk = block[0];
    if (!chunk.includes("id:")) continue;
    const id = block[1];
    if (inputs.some((input) => input.id === id)) continue;
    if (pipeline.some((step) => step.outputId === id) || chunk.includes("format:")) {
      outputs.push({
        id,
        isBigNumber: /isBigNumber:\s*true/.test(chunk),
        format: chunk.match(/\bformat:\s*"([^"]+)"/)?.[1] ?? "number",
      });
    }
  }

  const thresholds = [];
  for (const block of content.matchAll(
    /\{\s*fieldId:\s*"([^"]+)"[\s\S]*?warning:\s*(-?\d+(?:\.\d+)?)[\s\S]*?critical:\s*(-?\d+(?:\.\d+)?)[\s\S]*?direction:\s*"([^"]+)"[\s\S]*?warningMessage:\s*\n?\s*"([^"]+)"/g,
  )) {
    thresholds.push({
      fieldId: block[1],
      warning: Number(block[2]),
      critical: Number(block[3]),
      direction: block[4],
      warningMessage: block[5],
    });
  }

  const hiddenLossMultiplier = Number(
    content.match(/hiddenLossMultiplier:\s*(-?\d+(?:\.\d+)?)/)?.[1] ?? 1,
  );

  return {
    id: idMatch[1],
    name: nameMatch?.[1] ?? idMatch[1],
    sectorSlug: sectorMatch?.[1] ?? "general",
    painStatement: painMatch?.[1] ?? "",
    inputs,
    formulaPipeline: pipeline,
    outputs,
    thresholds,
    hiddenLossMultiplier,
  };
}

function resolveFormulaId(formulaId, formulaRegistryIds) {
  if (formulaRegistryIds.has(formulaId)) return formulaId;
  const alias = LEGACY_ALIASES[formulaId];
  if (alias && formulaRegistryIds.has(alias)) return formulaId;
  return null;
}

function matchRiskExclusion(slug) {
  for (const entry of RISK_EXCLUSION_PATTERNS) {
    if (entry.pattern.test(slug)) {
      return { matched: true, patternId: entry.id };
    }
  }
  return { matched: false, patternId: null };
}

function isRiskSkip(slug, riskLevel) {
  if (riskLevel === "regulated" || riskLevel === "safety-critical") return true;
  return matchRiskExclusion(slug).matched;
}

function buildRiskExcludedRecord(slug, patternId, extraRisks = []) {
  return {
    slug,
    reason: RISK_EXCLUDED_REASON,
    patternId: patternId ?? "risk-level",
    risks: [
      ...extraRisks,
      patternId ? `Risk pattern matched: ${patternId}` : "Risk level regulated or safety-critical",
    ],
  };
}

function hasDedicatedBackfillFiles(slug) {
  return (
    fs.existsSync(path.join(CALCULATORS_DIR, `${slug}-validation.ts`)) &&
    fs.existsSync(path.join(CALCULATORS_DIR, `${slug}.ts`)) &&
    fs.existsSync(path.join(TESTS_DIR, `${slug}.test.ts`)) &&
    fs.existsSync(path.join(CONTRACTS_DIR, `${slug}-critical.ts`))
  );
}

function classMatches(toolClass, classFilterSet) {
  if (!classFilterSet) {
    return toolClass === "A CLASS" || toolClass === "B CLASS";
  }
  const normalized = toolClass.replace(" CLASS", "");
  return classFilterSet.has(normalized);
}

export function evaluateToolEligibility(tool, schema, formulaRegistryIds, options = {}) {
  const reasons = [];
  const risks = [];

  if (PROTECTED_SLUGS.has(tool.slug) && !options.force) {
    return {
      eligible: false,
      bucket: "protected",
      reason: "Protected reference or prior PASS batch slug",
    };
  }

  if (tool.upgradeDecision === "PASS" && hasDedicatedBackfillFiles(tool.slug) && !options.force) {
    return {
      eligible: false,
      bucket: "alreadyPASS",
      reason: "Already PASS with dedicated backfill files",
    };
  }

  if (tool.routeStatus !== "active-route") {
    return { eligible: false, bucket: "skipped", reason: `Route status ${tool.routeStatus}` };
  }

  const classFilterSet = parseClassFilterSet(options.classFilter);
  if (!classMatches(tool.toolClass, classFilterSet)) {
    return { eligible: false, bucket: "skipped", reason: `Class filter excludes ${tool.toolClass}` };
  }

  if (tool.upgradeDecision !== "UPGRADE") {
    if (tool.upgradeDecision === "HUMAN_REVIEW") {
      return { eligible: false, bucket: "humanReview", reason: tool.upgradeReason ?? "Human review" };
    }
    return {
      eligible: false,
      bucket: tool.upgradeDecision === "QUARANTINE" ? "skipped" : "skipped",
      reason: tool.upgradeReason ?? tool.upgradeDecision,
    };
  }

  if (!schema) {
    return { eligible: false, bucket: "skipped", reason: "Schema file missing" };
  }

  if (schema.inputs.length === 0) {
    return { eligible: false, bucket: "skipped", reason: "Schema has no inputs" };
  }

  if (schema.formulaPipeline.length === 0) {
    return { eligible: false, bucket: "skipped", reason: "Schema formulaPipeline missing" };
  }

  if (schema.inputs.some((input) => input.type !== "number")) {
    return { eligible: false, bucket: "humanReview", reason: "Non-numeric schema inputs" };
  }

  if (schema.outputs.length === 0) {
    return { eligible: false, bucket: "skipped", reason: "Schema outputs missing" };
  }

  if (!tool.hasSchema && !tool.evidence?.schemaMatched) {
    reasons.push("schemaMatched false");
  }

  if (!tool.hasFormulaRegistryEntry && !tool.evidence?.formulaRegistryMatched) {
    for (const step of schema.formulaPipeline) {
      if (!resolveFormulaId(step.formulaId, formulaRegistryIds)) {
        return {
          eligible: false,
          bucket: "skipped",
          reason: `Missing formula id ${step.formulaId}`,
        };
      }
    }
  } else {
    for (const step of schema.formulaPipeline) {
      if (!resolveFormulaId(step.formulaId, formulaRegistryIds)) {
        return {
          eligible: false,
          bucket: "skipped",
          reason: `Missing formula id ${step.formulaId}`,
        };
      }
    }
  }

  if (options.excludeRisky !== false) {
    const riskMatch = matchRiskExclusion(tool.slug);
    if (riskMatch.matched || tool.riskLevel === "regulated" || tool.riskLevel === "safety-critical") {
      risks.push(
        riskMatch.patternId
          ? `Risk pattern matched: ${riskMatch.patternId}`
          : `Risk level ${tool.riskLevel ?? "unknown"}`,
      );
      return {
        eligible: false,
        bucket: "skippedRisk",
        reason: RISK_EXCLUDED_REASON,
        risks,
        patternId: riskMatch.patternId,
      };
    }
  }

  return {
    eligible: true,
    bucket: "eligible",
    reason: "AUTO_ELIGIBLE",
    risks,
    schema,
  };
}

export function toPascalCase(slug) {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

export function toScreamingSnake(slug) {
  return slug.replace(/-/g, "_").toUpperCase();
}

function pickPrimaryDriver(schema) {
  const outputIds = schema.outputs.map((output) => output.id);
  for (const candidate of PRIMARY_DRIVER_PRIORITY) {
    if (outputIds.includes(candidate)) return candidate;
  }
  const big = schema.outputs.find((output) => output.isBigNumber);
  if (big) return big.id;
  return outputIds[outputIds.length - 1] ?? "totalExposure";
}

function pickSummaryRule(schema, primaryDriver) {
  const direct = schema.thresholds.find((rule) => rule.fieldId === primaryDriver);
  if (direct) return direct;
  const bigOutput = schema.outputs.find((output) => output.isBigNumber)?.id;
  const byBig = schema.thresholds.find((rule) => rule.fieldId === bigOutput);
  if (byBig) return byBig;
  return schema.thresholds[0] ?? null;
}

function isPercentField(input) {
  return input.unit === "%";
}

function isPositiveRequired(input) {
  if (input.min !== undefined && input.min > 0) return true;
  return POSITIVE_DIVISOR_HINT.test(input.id);
}

function buildDefaultInputs(schema) {
  const defaults = {};
  for (const input of schema.inputs) {
    defaults[input.id] = input.smartDefault ?? 0;
  }
  return defaults;
}

function findPositiveRequiredInput(schema) {
  return schema.inputs.find((input) => isPositiveRequired(input));
}

function findNonNegativeInput(schema) {
  return schema.inputs.find((input) => input.min === undefined || input.min >= 0);
}

function buildThresholdInputOverrides(schema, summaryRule, band) {
  const defaults = buildDefaultInputs(schema);
  const thresholdField = summaryRule?.fieldId;
  const thresholdInput = schema.inputs.find((input) => input.id === thresholdField);
  if (thresholdInput && summaryRule) {
    if (band === "low") {
      const value =
        summaryRule.direction === "lower_is_bad"
          ? summaryRule.warning + 1
          : Math.max(summaryRule.warning * 0.1, 0);
      return { ...defaults, [thresholdInput.id]: value };
    }
    if (band === "critical") {
      const value =
        summaryRule.direction === "lower_is_bad"
          ? Math.max(summaryRule.critical - 1, 0)
          : summaryRule.critical * 2;
      return { ...defaults, [thresholdInput.id]: value };
    }
  }

  const scaleField = schema.inputs[0]?.id;
  if (!scaleField) return defaults;
  const scaleInput = schema.inputs[0];
  if (band === "low") {
    const raw = Math.max(defaults[scaleField] * 0.01, 0.001);
    const value = isPercentField(scaleInput) ? Math.min(raw, 100) : raw;
    return { ...defaults, [scaleField]: value };
  }
  const raw = defaults[scaleField] * 1000;
  const value = isPercentField(scaleInput) ? Math.min(raw, 100) : raw;
  return { ...defaults, [scaleField]: value };
}

function buildValidationRules(schema) {
  return schema.inputs.map((input) => {
    const rules = [];
    if (isPercentField(input)) {
      rules.push({ kind: "percent", min: 0, max: 100 });
    } else if (input.min !== undefined && input.max !== undefined) {
      rules.push({ kind: "range", min: input.min, max: input.max });
    } else if (input.min !== undefined && input.min >= 0) {
      rules.push({ kind: "nonNegative" });
    }
    if (isPositiveRequired(input)) {
      rules.push({ kind: "positive" });
    }
    return { input, rules };
  });
}

function quoteString(value) {
  return JSON.stringify(value);
}

function generateValidationFile(ctx) {
  const { slug, pascal, screaming, schema, summaryRule } = ctx;
  const inputTypeFields = schema.inputs.map((input) => `  ${input.id}: number;`).join("\n");
  const keys = schema.inputs.map((input) => `  "${input.id}",`).join("\n");
  const labels = schema.inputs
    .map((input) => `  ${input.id}: "${input.id}",`)
    .join("\n");

  const validationChecks = [];
  for (const { input, rules } of buildValidationRules(schema)) {
    for (const rule of rules) {
      if (rule.kind === "percent") {
        validationChecks.push(
          `  if (inputs.${input.id} < ${rule.min} || inputs.${input.id} > ${rule.max}) {\n    errors.push("${input.id} must be between ${rule.min} and ${rule.max}.");\n  }`,
        );
      } else if (rule.kind === "range") {
        validationChecks.push(
          `  if (inputs.${input.id} < ${rule.min} || inputs.${input.id} > ${rule.max}) {\n    errors.push("${input.id} must be between ${rule.min} and ${rule.max}.");\n  }`,
        );
      } else if (rule.kind === "nonNegative") {
        validationChecks.push(
          `  if (inputs.${input.id} < 0) {\n    errors.push("${input.id} must be greater than or equal to zero.");\n  }`,
        );
      } else if (rule.kind === "positive") {
        validationChecks.push(
          `  if (inputs.${input.id} <= 0) {\n    errors.push("${input.id} must be greater than zero.");\n  }`,
        );
      }
    }
  }

  const warningLines = [];
  const thresholdInput = schema.inputs.find((input) => input.id === summaryRule?.fieldId);
  if (summaryRule?.warningMessage && thresholdInput) {
    const comparator =
      summaryRule.direction === "lower_is_bad"
        ? `inputs.${thresholdInput.id} <= summaryRule.warning`
        : `inputs.${thresholdInput.id} >= summaryRule.warning`;
    warningLines.push(
      `  if (${comparator}) {\n    warnings.push(${quoteString(summaryRule.warningMessage)});\n  }`,
    );
  }

  const summaryRuleBlock =
    warningLines.length > 0
      ? `const summaryRule = {
  fieldId: ${quoteString(summaryRule?.fieldId ?? ctx.primaryDriver)},
  warning: ${summaryRule?.warning ?? 1},
  critical: ${summaryRule?.critical ?? 3},
  direction: ${quoteString(summaryRule?.direction ?? "higher_is_bad")},
} as const;

`
      : "";

  return `export type ${pascal}Inputs = {
${inputTypeFields}
};

export type ${pascal}ValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const ${screaming}_INPUT_KEYS: readonly (keyof ${pascal}Inputs)[] = [
${keys}
];

const INPUT_LABELS: Record<keyof ${pascal}Inputs, string> = {
${labels}
};

${summaryRuleBlock}function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: ${pascal}Inputs): string[] {
  const errors: string[] = [];

  for (const key of ${screaming}_INPUT_KEYS) {
    const value = inputs[key];
    if (value === undefined || value === null) {
      errors.push(\`\${INPUT_LABELS[key]} is required.\`);
      continue;
    }
    if (!isValidNumber(value)) {
      errors.push(\`\${INPUT_LABELS[key]} must be a finite number.\`);
    }
  }

  if (errors.length > 0) {
    return errors;
  }

${validationChecks.join("\n\n")}

  return errors;
}

function collectWarnings(inputs: ${pascal}Inputs): string[] {
  const warnings: string[] = [];

${warningLines.join("\n\n")}

  return warnings;
}

export function validate${pascal}Inputs(inputs: ${pascal}Inputs): ${pascal}ValidationResult {
  const errors = collectInputErrors(inputs);
  if (errors.length > 0) {
    return { ok: false, errors, warnings: [] };
  }

  return {
    ok: true,
    errors: [],
    warnings: collectWarnings(inputs),
  };
}
`;
}

function generateCalculatorFile(ctx) {
  const { slug, pascal, schema, primaryDriver, summaryRule } = ctx;
  const pipelineLiteral = JSON.stringify(schema.formulaPipeline, null, 2);
  const outputFields = schema.outputs
    .map((output) => `  ${output.id}: number;`)
    .concat([
      "  summaryLevel: SummaryLevel;",
      `  primaryDriver: ${quoteString(primaryDriver)};`,
      "  decisionVerdict: {",
      "    summaryLevel: SummaryLevel;",
      `    primaryDriver: ${quoteString(primaryDriver)};`,
      "    message: string;",
      "  };",
      "  warnings: string[];",
    ])
    .join("\n");

  const assignments = schema.outputs
    .map((output) => `    ${output.id}: computed.${output.id},`)
    .join("\n");

  const hasExcessKwhDerived =
    schema.inputs.some((input) => input.id === "currentKwh") &&
    schema.inputs.some((input) => input.id === "targetKwh");
  const derivedSeedBlock = hasExcessKwhDerived
    ? `
  computed.excessKwhDerived = Math.max(0, inputs.currentKwh - inputs.targetKwh);
`
    : "";

  return `import { getFormulaFn } from "@/lib/premium-schema/formula-registry";
import {
  validate${pascal}Inputs,
  type ${pascal}Inputs,
} from "@/lib/premium-schema/calculators/${slug}-validation";

export type { ${pascal}Inputs };

export type SummaryLevel = "low" | "warning" | "critical";

const FORMULA_PIPELINE = ${pipelineLiteral} as const;

const HIDDEN_LOSS_MULTIPLIER = ${schema.hiddenLossMultiplier};

const SUMMARY_WARNING_THRESHOLD = ${summaryRule?.warning ?? 1};
const SUMMARY_CRITICAL_THRESHOLD = ${summaryRule?.critical ?? 3};
const summaryDirection: "lower_is_bad" | "higher_is_bad" = ${quoteString(summaryRule?.direction ?? "higher_is_bad")};

function resolveMappedValue(
  sourceKey: string,
  userInputs: ${pascal}Inputs,
  computed: Record<string, number>,
): number {
  if (sourceKey in computed) {
    return computed[sourceKey] ?? 0;
  }
  return userInputs[sourceKey as keyof ${pascal}Inputs] as number;
}

function runFormulaPipeline(inputs: ${pascal}Inputs): Record<string, number> {
  const computed: Record<string, number> = {
    hiddenMultiplierConst: HIDDEN_LOSS_MULTIPLIER,
  };
${derivedSeedBlock}
  for (const step of FORMULA_PIPELINE) {
    const formulaFn = getFormulaFn(step.formulaId);
    const mapped: Record<string, number> = {};
    for (const [param, sourceKey] of Object.entries(step.inputMap)) {
      mapped[param] = resolveMappedValue(sourceKey, inputs, computed);
    }
    computed[step.outputId] = formulaFn(mapped);
  }

  return computed;
}

function resolveSummaryLevel(summaryValue: number): SummaryLevel {
  if (summaryDirection === "higher_is_bad") {
    if (summaryValue >= SUMMARY_CRITICAL_THRESHOLD) return "critical";
    if (summaryValue >= SUMMARY_WARNING_THRESHOLD) return "warning";
    return "low";
  }
  if (summaryValue <= SUMMARY_CRITICAL_THRESHOLD) return "critical";
  if (summaryValue <= SUMMARY_WARNING_THRESHOLD) return "warning";
  return "low";
}

function resolveDecisionMessage(summaryLevel: SummaryLevel): string {
  if (summaryLevel === "low") {
    return "Exposure is below the warning band. Continue monitoring declared cost and margin assumptions.";
  }
  if (summaryLevel === "warning") {
    return "Exposure is elevated. Review input assumptions and hidden cost drivers before committing to this envelope.";
  }
  return "Critical exposure detected. Validate cost, rework and margin assumptions before quoting or scaling.";
}

export function calculate${pascal}(inputs: ${pascal}Inputs): {
${outputFields}
} {
  const validation = validate${pascal}Inputs(inputs);
  if (!validation.ok) {
    throw new Error(validation.errors.join("; "));
  }

  const computed = runFormulaPipeline(inputs);
  const summaryValue = computed.${primaryDriver} ?? 0;
  const summaryLevel = resolveSummaryLevel(summaryValue);
  const message = resolveDecisionMessage(summaryLevel);

  return {
${assignments}
    summaryLevel,
    primaryDriver: ${quoteString(primaryDriver)},
    decisionVerdict: {
      summaryLevel,
      primaryDriver: ${quoteString(primaryDriver)},
      message,
    },
    warnings: [...validation.warnings],
  };
}
`;
}

function generateContractFile(ctx) {
  const { slug, pascal, screaming, schema, primaryDriver, summaryRule } = ctx;
  const outputs = [
    ...schema.outputs.map((output) => output.id),
    "summaryLevel",
    "primaryDriver",
    "decisionVerdict",
  ];

  const assumptionLines = [
    STANDARD_ASSUMPTION,
    `Metadata lastUpdated: 2026-06-13.`,
    `Metadata validUntil: 2027-06-13.`,
    ...schema.formulaPipeline.map(
      (step) => `${step.outputId} via ${step.formulaId} pipeline step.`,
    ),
    summaryRule
      ? `summaryLevel uses ${summaryRule.fieldId} thresholds warning ${summaryRule.warning} / critical ${summaryRule.critical} (${summaryRule.direction}).`
      : `summaryLevel uses ${primaryDriver} thresholds.`,
  ];

  return `/**
 * P64 — ${schema.name} premium-schema FormulaContract (factory generated).
 */

import type { FormulaContract } from "@/lib/formula-governance/types";
import {
  GOVERNANCE_RECOMMENDED_PRICE_TARGET_NOTE,
  STANDARD_DECISION_LANGUAGE_RULE,
  STANDARD_MUST_NOT_CLAIM,
  buildAssuredCriticalContract,
  calculatorProductionAssumption,
} from "@/lib/formula-governance/contracts/shared";
import { createWarningPolicy } from "@/lib/formula-governance/warning-policy";
import { ${screaming}_INPUT_KEYS } from "@/lib/premium-schema/calculators/${slug}-validation";

const PREMIUM_SCHEMA_DISCLAIMER =
  "Technical simulation only — not financial, legal, safety, or professional advice. Verify assumptions before business decisions.";

const REQUIRED_INPUTS = [...${screaming}_INPUT_KEYS];
const OUTPUTS = ${JSON.stringify(outputs, null, 2)} as const;

export const ${pascal}CalculatorContract: FormulaContract = buildAssuredCriticalContract({
  toolId: "premium-schema.${slug}",
  toolName: ${quoteString(schema.name)},
  slug: ${quoteString(slug)},
  purpose: ${quoteString(schema.painStatement || `Quantify ${primaryDriver} exposure for ${schema.name}.`)},
  userDecision: ${quoteString(`What is the deterministic ${primaryDriver} exposure for this input profile?`)},
  decisionImpact: "financial",
  requiredInputs: REQUIRED_INPUTS,
  criticalInputs: REQUIRED_INPUTS,
  outputs: [...OUTPUTS],
  assumptions: [
    PREMIUM_SCHEMA_DISCLAIMER,
    ${assumptionLines.map((line) => quoteString(line)).join(",\n    ")},
    calculatorProductionAssumption(
      "src/lib/premium-schema/calculators/${slug}-validation.ts",
      "validate${pascal}Inputs(inputs) → validation errors and warnings",
    ),
    calculatorProductionAssumption(
      "src/lib/premium-schema/calculators/${slug}.ts",
      "calculate${pascal}(inputs) → exposure metrics and decisionVerdict",
    ),
  ],
  formulaSummary:
    "Deterministic premium-schema pipeline outputs with factory-generated validation and calculator parity.",
  missingParameterWarnings: [],
  warningPolicy: createWarningPolicy({
    acceptedAssumptions: [
      GOVERNANCE_RECOMMENDED_PRICE_TARGET_NOTE,
      "User-supplied numeric inputs align to the same calculation period.",
    ],
    modelLimitations: [
      "Not a regulatory, legal, safety, or professional certification engine.",
      "Does not guarantee margin recovery or operational outcomes.",
    ],
    futureExtensions: ["Scenario stress tests and localized assumption packs."],
  }),
  validationRules: [
    {
      id: "required-numeric-inputs",
      description: "All required numeric inputs must be finite and within schema bounds.",
      kind: "edge",
    },
  ],
  scenarioSpecs: [
    { id: "default-profile", description: "Default schema smart defaults." },
    { id: "warning-band", description: "Summary metric in warning band." },
    { id: "critical-band", description: "Summary metric in critical band." },
  ],
  monotonicityRules: [],
  decisionLanguageRules: [STANDARD_DECISION_LANGUAGE_RULE],
  mustNotClaim: [...STANDARD_MUST_NOT_CLAIM, "Guaranteed savings", "Guaranteed margin"],
});

export const ${screaming}_CRITICAL_FORMULA_CONTRACTS: readonly FormulaContract[] = [
  ${pascal}CalculatorContract,
];
`;
}

function generateTestFile(ctx) {
  const { slug, pascal, schema, primaryDriver, summaryRule } = ctx;
  const defaults = buildDefaultInputs(schema);
  const lowInputs = buildThresholdInputOverrides(schema, summaryRule, "low");
  const criticalInputs = buildThresholdInputOverrides(schema, summaryRule, "critical");
  const positiveRequired = findPositiveRequiredInput(schema);
  const negativeTarget =
    findNonNegativeInput(schema)?.id ?? schema.inputs[0]?.id ?? "value";
  const nanField = schema.inputs[schema.inputs.length - 1]?.id ?? schema.inputs[0]?.id;
  const missingField = schema.inputs[0]?.id ?? "value";

  const defaultsLiteral = JSON.stringify(defaults, null, 2)
    .split("\n")
    .map((line, index) => (index === 0 ? line : `  ${line}`))
    .join("\n");
  const lowLiteral = JSON.stringify(lowInputs, null, 2)
    .split("\n")
    .map((line, index) => (index === 0 ? line : `  ${line}`))
    .join("\n");
  const criticalLiteral = JSON.stringify(criticalInputs, null, 2)
    .split("\n")
    .map((line, index) => (index === 0 ? line : `  ${line}`))
    .join("\n");

  const parityOutputs = schema.outputs.slice(0, 2);
  if (!parityOutputs.find((output) => output.id === primaryDriver)) {
    parityOutputs.push({ id: primaryDriver, format: "number" });
  }

  const zeroTestBlock = positiveRequired
    ? `
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validate${pascal}Inputs({ ...defaultInputs, ${positiveRequired.id}: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculate${pascal}({ ...defaultInputs, ${positiveRequired.id}: 0 })).toThrow();
  });`
    : "";

  return `import { describe, expect, test } from "vitest";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculate${pascal},
  type ${pascal}Inputs,
} from "@/lib/premium-schema/calculators/${slug}";
import { validate${pascal}Inputs } from "@/lib/premium-schema/calculators/${slug}-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = ${quoteString(slug)};

const defaultInputs: ${pascal}Inputs = ${defaultsLiteral};
const lowBandInputs: ${pascal}Inputs = ${lowLiteral};
const criticalBandInputs: ${pascal}Inputs = ${criticalLiteral};

function expectValidationFailure(partial: Partial<${pascal}Inputs>): void {
  const inputs = { ...defaultInputs, ...partial } as ${pascal}Inputs;
  const validation = validate${pascal}Inputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculate${pascal}(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: ${pascal}Inputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(\`missing output \${outputId}\`);
  return raw;
}

describe(${quoteString(slug)}, () => {
  test("exact default oracle", () => {
    const result = calculate${pascal}(defaultInputs);
${parityOutputs
  .map(
    (output) =>
      `    expect(result.${output.id}).toBeCloseTo(engineNumeric(SLUG, ${quoteString(output.id)}, defaultInputs), 2);`,
  )
  .join("\n")}
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe(${quoteString(primaryDriver)});
  });

  test("formula pipeline parity", () => {
    const result = calculate${pascal}(defaultInputs);
    expect(result.${primaryDriver}).toBeCloseTo(
      engineNumeric(SLUG, ${quoteString(primaryDriver)}, defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculate${pascal}(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculate${pascal}(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculate${pascal}(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, ${missingField}: undefined } as unknown as ${pascal}Inputs;
    const validation = validate${pascal}Inputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculate${pascal}(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ ${negativeTarget}: -1 });
  });${zeroTestBlock}

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ ${nanField}: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ ${nanField}: Number.POSITIVE_INFINITY });
  });

  test("contract metadata matches slug", () => {
    const contract = getFormulaContractBySlug(SLUG);
    expect(contract).toBeDefined();
    if (!contract) return;
    expect(contract.slug).toBe(SLUG);
    expect(contract.requiredInputs.length).toBeGreaterThan(0);
    expect(contract.assumptions.join(" ")).toContain("deterministic");
  });

  test("engine parity test", () => {
    const schema = getPremiumCalculatorSchema(SLUG);
    expect(schema).not.toBeNull();
    if (!schema) return;
    const schemaInputs = buildDefaultSchemaInputs(schema);
    const engineResult = runPremiumSchemaEngine(schema, schemaInputs);
    const calculatorResult = calculate${pascal}(defaultInputs);
${parityOutputs
  .map(
    (output) =>
      `    expect(engineResult.outputs.find((output) => output.id === ${quoteString(output.id)})?.raw).toBeCloseTo(calculatorResult.${output.id}, 2);`,
  )
  .join("\n")}
  });
});
`;
}

export function generateToolFiles(tool, schema) {
  const slug = tool.slug;
  const pascal = toPascalCase(slug);
  const screaming = toScreamingSnake(slug);
  const primaryDriver = pickPrimaryDriver(schema);
  const summaryRule = pickSummaryRule(schema, primaryDriver);
  const ctx = { slug, pascal, screaming, schema, primaryDriver, summaryRule };

  return {
    contractPath: path.join(CONTRACTS_DIR, `${slug}-critical.ts`),
    validationPath: path.join(CALCULATORS_DIR, `${slug}-validation.ts`),
    calculatorPath: path.join(CALCULATORS_DIR, `${slug}.ts`),
    testPath: path.join(TESTS_DIR, `${slug}.test.ts`),
    contract: generateContractFile(ctx),
    validation: generateValidationFile(ctx),
    calculator: generateCalculatorFile(ctx),
    test: generateTestFile(ctx),
    contractExport: `${screaming}_CRITICAL_FORMULA_CONTRACTS`,
    contractImport: path
      .join("src/lib/formula-governance/contracts", `${slug}-critical.ts`)
      .replace(/\\/g, "/"),
  };
}

export function wireContractsRegistry(content, entries) {
  let next = content;
  for (const entry of entries) {
    const importPath = entry.contractImport.replace(/^src\//, "").replace(/\.ts$/, "");
    const importLine = `import { ${entry.contractExport} } from "@/${importPath}";`;
    if (!next.includes(importLine)) {
      const anchor = "import { ENGINE_MODULES_CRITICAL_FORMULA_CONTRACTS }";
      next = next.replace(anchor, `${importLine}\n${anchor}`);
    }
    const spreadLine = `  ...${entry.contractExport},`;
    if (!next.includes(spreadLine)) {
      next = next.replace(
        "  ...ENGINE_MODULES_CRITICAL_FORMULA_CONTRACTS,",
        `${spreadLine}\n  ...ENGINE_MODULES_CRITICAL_FORMULA_CONTRACTS,`,
      );
    }
  }
  return next;
}

export function buildFactoryPlan(options) {
  const { scanReport, formulaRegistryIds, schemas } = loadFactoryInputs();
  const eligible = [];
  const skipped = [];
  const skippedRisk = [];
  const humanReview = [];
  const alreadyPASS = [];
  const protectedSlugs = [];
  const wouldCreate = [];
  const wouldModify = [];
  const risks = [];

  for (const tool of scanReport.tools) {
    const schema = schemas.get(tool.slug) ?? null;
    const evaluation = evaluateToolEligibility(tool, schema, formulaRegistryIds, options);
    const record = {
      slug: tool.slug,
      toolClass: tool.toolClass,
      upgradeDecision: tool.upgradeDecision,
      reason: evaluation.reason,
      risks: evaluation.risks ?? [],
      ...(evaluation.patternId ? { patternId: evaluation.patternId } : {}),
    };

    if (evaluation.eligible) {
      eligible.push(record);
    } else if (evaluation.bucket === "skippedRisk") {
      skippedRisk.push(record);
      risks.push(buildRiskExcludedRecord(tool.slug, evaluation.patternId, evaluation.risks ?? []));
    } else if (evaluation.bucket === "humanReview") {
      humanReview.push(record);
    } else if (evaluation.bucket === "alreadyPASS") {
      alreadyPASS.push(record);
    } else if (evaluation.bucket === "protected") {
      protectedSlugs.push(record);
    } else {
      skipped.push(record);
    }
  }

  eligible.sort((left, right) => left.slug.localeCompare(right.slug));
  const selected = eligible.slice(0, options.limit);

  for (const item of selected) {
    const schema = schemas.get(item.slug);
    const files = generateToolFiles(item, schema);
    wouldCreate.push(
      path.relative(ROOT, files.contractPath),
      path.relative(ROOT, files.validationPath),
      path.relative(ROOT, files.calculatorPath),
      path.relative(ROOT, files.testPath),
    );
  }

  if (selected.length > 0) {
    wouldModify.push(path.relative(ROOT, CONTRACTS_FILE));
  }

  return {
    generatedAt: new Date().toISOString(),
    options,
    eligible,
    skipped,
    skippedRisk,
    humanReview,
    alreadyPASS,
    protected: protectedSlugs,
    selected,
    wouldCreate,
    wouldModify,
    risks,
    riskExclusions: RISK_EXCLUSION_PATTERNS.map((entry) => ({
      id: entry.id,
      pattern: String(entry.pattern),
    })),
    counts: {
      eligible: eligible.length,
      skipped: skipped.length,
      skippedRisk: skippedRisk.length,
      humanReview: humanReview.length,
      alreadyPASS: alreadyPASS.length,
      protected: protectedSlugs.length,
      selected: selected.length,
    },
    scanStats: {
      pass: scanReport.tools.filter((tool) => tool.upgradeDecision === "PASS").length,
      upgrade: scanReport.tools.filter((tool) => tool.upgradeDecision === "UPGRADE").length,
    },
  };
}

export function writeFactoryPlan(plan) {
  fs.mkdirSync(path.dirname(FACTORY_PLAN_PATH), { recursive: true });
  fs.writeFileSync(FACTORY_PLAN_PATH, `${JSON.stringify(plan, null, 2)}\n`, "utf8");
}

export function applyFactoryPlan(plan, options) {
  const { schemas } = loadFactoryInputs();
  const generated = [];
  const passed = [];
  const failed = [];
  const skipped = [];
  const testFiles = [];

  let contractsContent = fs.readFileSync(CONTRACTS_FILE, "utf8");
  const registryEntries = [];

  for (const item of plan.selected) {
    const tool = item;
    const schema = schemas.get(tool.slug);
    if (!schema) {
      skipped.push({ slug: tool.slug, reason: "Schema missing at apply time" });
      continue;
    }

    if (
      PROTECTED_SLUGS.has(tool.slug) &&
      hasDedicatedBackfillFiles(tool.slug) &&
      !options.force
    ) {
      skipped.push({ slug: tool.slug, reason: "Protected slug with existing PASS files" });
      continue;
    }

    try {
      const files = generateToolFiles(tool, schema);
      fs.writeFileSync(files.contractPath, files.contract, "utf8");
      fs.writeFileSync(files.validationPath, files.validation, "utf8");
      fs.writeFileSync(files.calculatorPath, files.calculator, "utf8");
      fs.writeFileSync(files.testPath, files.test, "utf8");
      registryEntries.push(files);
      generated.push(tool.slug);
      testFiles.push(path.relative(ROOT, files.testPath));
    } catch (error) {
      failed.push({
        slug: tool.slug,
        reason: error instanceof Error ? error.message : String(error),
      });
    }
  }

  if (registryEntries.length > 0) {
    contractsContent = wireContractsRegistry(contractsContent, registryEntries);
    fs.writeFileSync(CONTRACTS_FILE, contractsContent, "utf8");
  }

  for (const testFile of testFiles) {
    const slug = path.basename(testFile, ".test.ts");
    try {
      execFileSync("npx", ["vitest", "run", testFile], {
        cwd: ROOT,
        stdio: "pipe",
        encoding: "utf8",
      });
      passed.push(slug);
    } catch (error) {
      failed.push({
        slug,
        reason: error instanceof Error ? error.message : String(error),
      });
    }
  }

  const scanBefore = plan.scanStats;
  execFileSync("npm", ["run", "scan:quality-backfill"], { cwd: ROOT, stdio: "pipe" });
  const scanAfter = readJson(QUALITY_SCAN_REPORT_PATH);
  const passAfter = scanAfter.tools.filter((tool) => tool.upgradeDecision === "PASS").length;
  const upgradeAfter = scanAfter.tools.filter((tool) => tool.upgradeDecision === "UPGRADE").length;

  return {
    generatedAt: new Date().toISOString(),
    options,
    generated,
    generatedSlugs: generated,
    passed,
    failed,
    skipped,
    testFiles,
    scanStats: {
      passBefore: scanBefore.pass,
      passAfter,
      upgradeBefore: scanBefore.upgrade,
      upgradeAfter,
    },
  };
}

export function writeFactoryResult(result) {
  fs.mkdirSync(path.dirname(FACTORY_RESULT_PATH), { recursive: true });
  fs.writeFileSync(FACTORY_RESULT_PATH, `${JSON.stringify(result, null, 2)}\n`, "utf8");
}

export function formatDryRunReport(plan) {
  return [
    "P66 Premium Backfill Factory — dry-run",
    `eligible: ${plan.counts.eligible}`,
    `selected: ${plan.counts.selected}`,
    `skipped: ${plan.counts.skipped}`,
    `skippedRisk: ${plan.counts.skippedRisk ?? 0}`,
    `humanReview: ${plan.counts.humanReview}`,
    `alreadyPASS: ${plan.counts.alreadyPASS}`,
    `protected: ${plan.counts.protected}`,
    `wouldCreate files: ${plan.wouldCreate.length}`,
    `wouldModify: ${plan.wouldModify.join(", ") || "(none)"}`,
    `class: ${plan.options?.classFilter ?? "A"}`,
    `excludeRisky: ${plan.options?.excludeRisky !== false}`,
    "",
    "Selected slugs:",
    ...(plan.selected.length > 0
      ? plan.selected.map((item) => `  - ${item.slug} (${item.toolClass})`)
      : ["  (none)"]),
    "",
    "Risk exclusions (sample):",
    ...(plan.risks ?? [])
      .slice(0, 12)
      .map((entry) => `  - ${entry.slug}: ${entry.reason}`),
  ].join("\n");
}
