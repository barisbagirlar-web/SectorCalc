import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { ROOT } from "./activation-paths.mjs";
import {
  QUALITY_DIR,
  QUALITY_SCAN_REPORT_PATH,
  buildQualityScanReport,
  getRiskExclusionReason,
  isRiskExcludedTool,
} from "./quality-backfill-scan-lib.mjs";

export const FORMULA_SOURCE_AUDIT_PATH = path.join(
  QUALITY_DIR,
  "premium-formula-source-audit.json",
);

const SCHEMAS_DIR = path.join(ROOT, "src/lib/premium-schema/schemas");
const FORMULA_REGISTRY_FILE = path.join(ROOT, "src/lib/premium-schema/formula-registry.ts");

const LEGACY_ALIASES = {
  "loss.time_cost": "time.labor_cost",
  "loss.scrap_cost": "scrap.material_cost",
  "loss.combined_operating": "scrap.combined_operating",
  "loss.total_exposure": "scrap.total_exposure",
};

const FORMULA_BLOCKERS = new Set([
  "missing-formula-pipeline",
  "missing-formula-registry",
  "engine-parity-source-failed",
]);

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function ensureQualityScan() {
  if (!fs.existsSync(QUALITY_SCAN_REPORT_PATH)) {
    const report = buildQualityScanReport();
    fs.mkdirSync(path.dirname(QUALITY_SCAN_REPORT_PATH), { recursive: true });
    fs.writeFileSync(QUALITY_SCAN_REPORT_PATH, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  }
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

function parseSchemaContent(content) {
  const idMatch = content.match(/\bid:\s*"([^"]+)"/);
  if (!idMatch) return null;

  const inputsBlock = content.match(/\binputs:\s*\[([\s\S]*?)\],\s*\n\s*formulaPipeline:/);
  const inputs = [];
  if (inputsBlock) {
    for (const block of inputsBlock[1].matchAll(/\{([\s\S]*?)\n\s*\}/g)) {
      const chunk = block[1];
      const id = chunk.match(/\bid:\s*"([^"]+)"/)?.[1];
      const type = chunk.match(/\btype:\s*"([^"]+)"/)?.[1] ?? "number";
      const smartDefaultRaw = chunk.match(/\bsmartDefault:\s*([^,\n]+)/)?.[1]?.trim();
      const minMatch = chunk.match(/validation:\s*\{[^}]*\bmin:\s*(-?\d+(?:\.\d+)?)/);
      if (!id) continue;
      inputs.push({
        id,
        type,
        smartDefault:
          smartDefaultRaw === "true"
            ? 1
            : smartDefaultRaw === "false"
              ? 0
              : Number(smartDefaultRaw ?? 0),
        min: minMatch ? Number(minMatch[1]) : undefined,
        required: !/required:\s*false/.test(chunk),
      });
    }
  }

  const pipeline = [];
  for (const step of content.matchAll(
    /\{\s*formulaId:\s*"([^"]+)"[\s\S]*?inputMap:\s*\{([\s\S]*?)\}[\s\S]*?outputId:\s*"([^"]+)"/g,
  )) {
    pipeline.push({ formulaId: step[1] });
  }

  return {
    id: idMatch[1],
    inputs,
    formulaPipeline: pipeline,
  };
}

function buildSchemaIndex() {
  /** @type {Map<string, ReturnType<typeof parseSchemaContent>>} */
  const index = new Map();
  if (!fs.existsSync(SCHEMAS_DIR)) {
    return index;
  }
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

function resolveFormulaId(formulaId, formulaRegistryIds) {
  if (formulaRegistryIds.has(formulaId)) return formulaId;
  const alias = LEGACY_ALIASES[formulaId];
  if (alias && formulaRegistryIds.has(alias)) return formulaId;
  return null;
}

function hasDefaultInputs(schema) {
  if (schema.inputs.length === 0) return false;
  return schema.inputs.every((input) => {
    if (input.smartDefault !== undefined && input.smartDefault !== null) {
      return true;
    }
    if (input.min !== undefined) {
      return true;
    }
    return input.type === "number";
  });
}

function runEngineBatch(slugs) {
  if (slugs.length === 0) {
    return {};
  }

  const probeScript = `
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const slugs = JSON.parse(process.argv[2] ?? "[]");
const results = {};

for (const slug of slugs) {
  try {
    const schema = getPremiumCalculatorSchema(slug);
    if (!schema) {
      results[slug] = { ok: false, error: "schema-not-in-registry" };
      continue;
    }
    const inputs = buildDefaultSchemaInputs(schema);
    const result = runPremiumSchemaEngine(schema, inputs);
    results[slug] = {
      ok: true,
      primaryOutputs: result.outputs
        .filter((output) => typeof output.raw === "number" && Number.isFinite(output.raw))
        .map((output) => ({ id: output.id, raw: output.raw })),
    };
  } catch (error) {
    results[slug] = {
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

process.stdout.write(JSON.stringify(results));
`;

  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "sectorcalc-engine-probe-"));
  const tempScript = path.join(tempDir, "premium-engine-probe.ts");

  try {
    fs.writeFileSync(tempScript, probeScript, "utf8");
    const stdout = execFileSync("npx", ["tsx", tempScript, JSON.stringify(slugs)], {
      cwd: ROOT,
      encoding: "utf8",
      stdio: ["pipe", "pipe", "pipe"],
      maxBuffer: 64 * 1024 * 1024,
    });
    return JSON.parse(stdout.trim() || "{}");
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const fallback = {};
    for (const slug of slugs) {
      fallback[slug] = { ok: false, error: message };
    }
    return fallback;
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
}

/**
 * @param {string} slug
 * @param {ReturnType<typeof parseSchemaContent> | null | undefined} schema
 * @param {Set<string>} formulaRegistryIds
 * @param {{ riskLevel?: string }} metadata
 * @param {{ ok?: boolean, primaryOutputs?: Array<{ id: string, raw: number }>, error?: string } | undefined} engineResult
 */
export function auditToolFormulaSource(slug, schema, formulaRegistryIds, metadata = {}, engineResult) {
  const formulaIds = schema?.formulaPipeline?.map((step) => step.formulaId) ?? [];
  const missingFormulaIds = formulaIds.filter(
    (formulaId) => !resolveFormulaId(formulaId, formulaRegistryIds),
  );

  const base = {
    slug,
    hasSchema: Boolean(schema),
    hasInputs: Boolean(schema && schema.inputs.length > 0),
    hasDefaultInputs: Boolean(schema && hasDefaultInputs(schema)),
    hasFormulaPipeline: Boolean(schema && schema.formulaPipeline.length > 0),
    formulaIds,
    missingFormulaIds,
    engineRuns: false,
    primaryOutputs: [],
    eligibleForAutoBackfill: false,
    decision: "QUARANTINE",
    reason: "missing-schema",
  };

  if (isRiskExcludedTool(slug, metadata)) {
    return {
      ...base,
      decision: "HUMAN_REVIEW",
      reason: getRiskExclusionReason(slug, metadata),
      eligibleForAutoBackfill: false,
    };
  }

  if (!schema) {
    return {
      ...base,
      decision: "QUARANTINE",
      reason: "missing-schema",
    };
  }

  if (schema.inputs.length === 0) {
    return {
      ...base,
      decision: "QUARANTINE",
      reason: "missing-inputs",
    };
  }

  if (!hasDefaultInputs(schema)) {
    return {
      ...base,
      decision: "HUMAN_REVIEW",
      reason: "missing-default-inputs",
    };
  }

  if (schema.formulaPipeline.length === 0) {
    return {
      ...base,
      decision: "HUMAN_REVIEW",
      reason: "missing-formula-pipeline",
    };
  }

  if (missingFormulaIds.length > 0) {
    return {
      ...base,
      decision: "HUMAN_REVIEW",
      reason: "missing-formula-registry",
    };
  }

  const resolvedEngine = engineResult ?? { ok: false, error: "engine-not-run" };
  if (!resolvedEngine.ok) {
    return {
      ...base,
      engineRuns: false,
      primaryOutputs: [],
      decision: "HUMAN_REVIEW",
      reason: "engine-parity-source-failed",
      engineError: resolvedEngine.error ?? "engine failed",
    };
  }

  return {
    ...base,
    engineRuns: true,
    primaryOutputs: resolvedEngine.primaryOutputs ?? [],
    eligibleForAutoBackfill: true,
    decision: "AUTO_ELIGIBLE",
    reason: "schema-formula-registry-engine-parity-ready",
  };
}

export function buildFormulaSourceAuditReport(options = {}) {
  ensureQualityScan();
  const scanReport = readJson(QUALITY_SCAN_REPORT_PATH);
  const formulaRegistryIds = buildFormulaRegistryIds();
  const schemas = buildSchemaIndex();

  const premiumTools = (scanReport.tools ?? []).filter(
    (tool) => tool.tier === "premium" || tool.tier === "premium-schema",
  );
  const engineCandidates = premiumTools
    .map((tool) => tool.slug)
    .filter((slug) => {
      const schema = schemas.get(slug);
      if (!schema || schema.formulaPipeline.length === 0) return false;
      const missing = schema.formulaPipeline
        .map((step) => step.formulaId)
        .filter((formulaId) => !resolveFormulaId(formulaId, formulaRegistryIds));
      return missing.length === 0;
    });

  const engineResults = options.skipEngine
    ? {}
    : runEngineBatch(engineCandidates);

  const tools = [];
  const autoEligible = [];
  const humanReview = [];
  const quarantine = [];
  const riskExcluded = [];
  const missingFormulaIds = [];
  const engineFailures = [];

  for (const tool of premiumTools) {
    const schema = schemas.get(tool.slug) ?? null;
    const engineResult = engineResults[tool.slug];
    const audit = auditToolFormulaSource(
      tool.slug,
      schema,
      formulaRegistryIds,
      { riskLevel: tool.riskLevel },
      engineResult,
    );
    tools.push(audit);

    if (audit.decision === "AUTO_ELIGIBLE") {
      autoEligible.push(audit);
    } else if (isRiskExcludedTool(tool.slug, { riskLevel: tool.riskLevel })) {
      riskExcluded.push(audit);
      humanReview.push(audit);
    } else if (audit.decision === "HUMAN_REVIEW") {
      humanReview.push(audit);
    } else {
      quarantine.push(audit);
    }

    for (const formulaId of audit.missingFormulaIds) {
      missingFormulaIds.push({ slug: tool.slug, formulaId });
    }
    if (audit.reason === "engine-parity-source-failed") {
      engineFailures.push({
        slug: tool.slug,
        error: audit.engineError ?? "engine failed",
      });
    }
  }

  return {
    generatedAt: new Date().toISOString(),
    sourceQualityScan: path.relative(ROOT, QUALITY_SCAN_REPORT_PATH),
    total: tools.length,
    tools,
    autoEligible,
    humanReview,
    quarantine,
    riskExcluded,
    missingFormulaIds,
    engineFailures,
    counts: {
      autoEligible: autoEligible.length,
      humanReview: humanReview.length,
      quarantine: quarantine.length,
      riskExcluded: riskExcluded.length,
      missingFormulaIds: missingFormulaIds.length,
      engineFailures: engineFailures.length,
    },
  };
}

export function writeFormulaSourceAuditReport(report) {
  fs.mkdirSync(path.dirname(FORMULA_SOURCE_AUDIT_PATH), { recursive: true });
  fs.writeFileSync(FORMULA_SOURCE_AUDIT_PATH, `${JSON.stringify(report, null, 2)}\n`, "utf8");
}

export function ensureFormulaSourceAudit(options = {}) {
  if (!options.refresh && fs.existsSync(FORMULA_SOURCE_AUDIT_PATH)) {
    return readJson(FORMULA_SOURCE_AUDIT_PATH);
  }
  const report = buildFormulaSourceAuditReport(options);
  writeFormulaSourceAuditReport(report);
  return report;
}

export function loadFormulaSourceAuditMap(options = {}) {
  const report = ensureFormulaSourceAudit(options);
  const map = new Map();
  for (const tool of report.tools ?? []) {
    map.set(tool.slug, tool);
  }
  return map;
}

export function getFormulaSourceAudit(slug, options = {}) {
  const map = loadFormulaSourceAuditMap(options);
  return map.get(slug) ?? null;
}

export function isFormulaSourceAutoEligible(slug, options = {}) {
  const audit = getFormulaSourceAudit(slug, options);
  return audit?.decision === "AUTO_ELIGIBLE";
}

export function isFormulaSourceClearForUiBackfill(slug, options = {}) {
  const audit = getFormulaSourceAudit(slug, options);
  if (!audit) return false;
  if (audit.decision === "QUARANTINE") return false;
  if (audit.decision === "AUTO_ELIGIBLE") return true;
  if (FORMULA_BLOCKERS.has(audit.reason)) return false;
  return audit.hasFormulaPipeline && audit.missingFormulaIds.length === 0;
}

export function formatFormulaSourceAuditStdout(report) {
  return [
    "P73A Premium Formula Source Audit",
    `total: ${report.total}`,
    `autoEligible: ${report.counts.autoEligible}`,
    `humanReview: ${report.counts.humanReview}`,
    `quarantine: ${report.counts.quarantine}`,
    `riskExcluded: ${report.counts.riskExcluded}`,
    `missingFormulaIds: ${report.counts.missingFormulaIds}`,
    `engineFailures: ${report.counts.engineFailures}`,
    "",
    "Sample AUTO_ELIGIBLE:",
    ...(report.autoEligible.slice(0, 10).map((entry) => `  - ${entry.slug}`)),
    "",
    "Sample HUMAN_REVIEW:",
    ...(report.humanReview.slice(0, 10).map((entry) => `  - ${entry.slug}: ${entry.reason}`)),
    "",
    "Sample QUARANTINE:",
    ...(report.quarantine.slice(0, 10).map((entry) => `  - ${entry.slug}: ${entry.reason}`)),
  ].join("\n");
}
