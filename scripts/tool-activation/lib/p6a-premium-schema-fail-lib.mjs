import fs from "node:fs";
import path from "node:path";
import { ROOT } from "./activation-paths.mjs";
import {
  P24_REPORT_PATH,
  buildIndexes,
  buildP24ToolQualityReport,
} from "./p24-tool-quality-lib.mjs";
import {
  CONTROL_PLANE_REPORT_PATH,
  FORMULA_KNOWLEDGE_GRAPH_PATH,
  RUNTIME_TRUST_REPORT_PATH,
  PROBLEM_SLUG,
} from "./p25-control-plane-lib.mjs";

export const P6A_REPORT_PATH = path.join(
  ROOT,
  "scripts/.cache/p6a-premium-schema-fail-manual-audit.json",
);
export const P5B_REPORT_PATH = path.join(
  ROOT,
  "scripts/.cache/deepseek/p5b-full-tool-scan-report.json",
);

export const P6_CANDIDATES = [
  "cleaning-cost-estimator",
  "cnc-minimum-safe-quote-analyzer",
  "machine-hour-estimator",
  "project-cost-estimator",
  "return-rate-profit-erosion-tool",
  "pressure-vessel-wall-thickness-calculator",
  "welded-bolted-connection-calculator",
  "profit-margin-calculator",
  "doviz-pozisyonu-kur-farki-riski-hesabi",
  "heat-loss-calculator",
  "material-waste-calculator",
  "scrap-rate-calculator",
];

export const RISK_CLASS = {
  HIGH_RISK_MANUAL_ONLY: [
    "pressure-vessel-wall-thickness-calculator",
    "welded-bolted-connection-calculator",
    "doviz-pozisyonu-kur-farki-riski-hesabi",
  ],
  MEDIUM_RISK_ALIGNMENT: [
    "profit-margin-calculator",
    "heat-loss-calculator",
    "material-waste-calculator",
    "scrap-rate-calculator",
  ],
  LOW_RISK_ESTIMATOR_ALIGNMENT: [
    "cleaning-cost-estimator",
    "cnc-minimum-safe-quote-analyzer",
    "machine-hour-estimator",
    "project-cost-estimator",
    "return-rate-profit-erosion-tool",
  ],
};

const SCHEMAS_DIR = path.join(ROOT, "src/lib/premium-schema/schemas");
const VALIDATION_DIR = path.join(ROOT, "src/lib/premium-schema/calculators");
const CALCULATORS_DIR = path.join(ROOT, "src/lib/calculators");
const P24_TEST_ROOTS = [
  path.join(ROOT, "src/lib/premium-schema/__tests__"),
  path.join(ROOT, "src/lib/formula-governance/__tests__"),
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

function loadPremiumSchemaSlugMap() {
  const content = readText("src/lib/premium-schema/schema-registry.ts");
  const map = {};
  for (const match of content.matchAll(/"([^"]+)":\s*"([^"]+)"/g)) {
    if (match[1].includes("-") && match[2].includes("-")) {
      map[match[1]] = match[2];
    }
  }
  return map;
}

function resolveSchemaId(slug, slugMap) {
  if (fs.existsSync(path.join(SCHEMAS_DIR, `${slug}.ts`))) return slug;
  if (slugMap[slug]) return slugMap[slug];
  const aliases = {
    "return-rate-profit-erosion-tool": "return-profit-erosion-tool",
    "quote-price-profit-margin-calculator": "profit-margin-calculator",
  };
  if (aliases[slug] && fs.existsSync(path.join(SCHEMAS_DIR, `${aliases[slug]}.ts`))) {
    return aliases[slug];
  }
  return null;
}

function extractSchemaInputs(schemaId) {
  const filePath = path.join(SCHEMAS_DIR, `${schemaId}.ts`);
  if (!fs.existsSync(filePath)) {
    return { path: null, required: [], optional: [], all: [] };
  }
  const content = fs.readFileSync(filePath, "utf8");
  const inputsBlock = content.match(/inputs:\s*\[([\s\S]*?)\]\s*,\s*(?:formulaPipeline|outputs)/);
  const required = [];
  const optional = [];
  const all = [];
  if (inputsBlock) {
    for (const block of inputsBlock[1].split(/\{\s*\n/).slice(1)) {
      const id = block.match(/id:\s*"([^"]+)"/)?.[1];
      if (!id) continue;
      all.push(id);
      if (/required:\s*true/.test(block)) required.push(id);
      else if (/required:\s*false/.test(block)) optional.push(id);
    }
  }
  return {
    path: path.relative(ROOT, filePath),
    required,
    optional,
    all,
  };
}

function extractValidationInputs(slug, schemaId) {
  const candidates = [
    path.join(VALIDATION_DIR, `${slug}-validation.ts`),
    path.join(VALIDATION_DIR, `${schemaId}-validation.ts`),
  ];
  for (const filePath of candidates) {
    if (!fs.existsSync(filePath)) continue;
    const content = fs.readFileSync(filePath, "utf8");
    const keysMatch =
      content.match(/INPUT_KEYS[^=]*=\s*\[([\s\S]*?)\]/) ??
      content.match(/REQUIRED_NUMERIC_KEYS[^=]*=\s*([^;]+);/);
    const keys = [];
    if (keysMatch) {
      for (const m of keysMatch[1].matchAll(/"([^"]+)"/g)) keys.push(m[1]);
    }
    const typeFields = [...content.matchAll(/^\s+(\w+):\s*number/gm)].map((m) => m[1]);
    return {
      path: path.relative(ROOT, filePath),
      keys: keys.length > 0 ? keys : [...new Set(typeFields)],
    };
  }
  return { path: null, keys: [] };
}

function findContractForSlug(slug, contractIndex) {
  if (contractIndex.has(slug)) return contractIndex.get(slug);
  const slugMap = {
    "cleaning-cost-estimator": "cleaning-cost-calculator",
    "return-rate-profit-erosion-tool": "return-profit-erosion-tool",
  };
  const alias = slugMap[slug];
  if (alias && contractIndex.has(alias)) {
    return { ...contractIndex.get(alias), aliasSlug: alias };
  }
  return null;
}

function findCalculatorModule(slug) {
  const direct = path.join(CALCULATORS_DIR, `${slug}.ts`);
  if (fs.existsSync(direct)) return path.relative(ROOT, direct);
  const registry = readText("src/lib/calculators/registry.ts");
  if (registry.includes(`"${slug}"`)) return "src/lib/calculators/registry.ts (registered)";
  return null;
}

function walkFiles(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walkFiles(full));
    else out.push(full);
  }
  return out;
}

function findResultRenderer(slug) {
  const patterns = [
    `src/components/tools/results/${slug}.tsx`,
    `src/components/calculators/${slug}-result.tsx`,
  ];
  for (const rel of patterns) {
    if (fs.existsSync(path.join(ROOT, rel))) return rel;
  }
  for (const root of ["src/components/tools", "src/components/calculators", "src/app"]) {
    const abs = path.join(ROOT, root);
    if (!fs.existsSync(abs)) continue;
    for (const file of walkFiles(abs)) {
      if (!file.endsWith(".tsx") && !file.endsWith(".ts")) continue;
      const content = fs.readFileSync(file, "utf8");
      if (content.includes(slug) && /Result|Renderer|renderResult/i.test(content)) {
        return path.relative(ROOT, file);
      }
    }
  }
  return null;
}

function findOracleTests(slug) {
  const found = [];
  for (const testRoot of P24_TEST_ROOTS) {
    if (!fs.existsSync(testRoot)) continue;
    for (const file of fs.readdirSync(testRoot)) {
      if (!file.endsWith(".test.ts")) continue;
      const rel = path.relative(ROOT, path.join(testRoot, file));
      const content = fs.readFileSync(path.join(ROOT, rel), "utf8");
      if (content.includes(slug)) found.push(rel);
    }
  }
  return found;
}

function findRoute(slug, p24Tool) {
  if (p24Tool?.routePath) return p24Tool.routePath;
  const pageFile = path.join(ROOT, "src/app/[locale]/tools/[tier]/[slug]/page.tsx");
  if (fs.existsSync(pageFile)) {
    const content = fs.readFileSync(pageFile, "utf8");
    if (content.includes(`slug: "${slug}"`)) {
      const tierMatch = content.match(
        new RegExp(
          `tier:\\s*"([^"]+)"[^\\n]*slug:\\s*"${slug.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"`,
        ),
      );
      const tier = tierMatch?.[1] ?? "premium";
      return `/tools/${tier}/${slug}`;
    }
  }
  return null;
}

function computeMismatch(schemaInputs, validationKeys, contractInputs) {
  const schemaSet = new Set(
    schemaInputs.required.length > 0 ? schemaInputs.required : schemaInputs.all,
  );
  const validationSet = new Set(validationKeys);
  const contractSet = new Set(contractInputs);
  const mismatchFields = [];
  const schemaOnly = [...schemaSet].filter((k) => contractSet.size > 0 && !contractSet.has(k));
  const contractOnly = [...contractSet].filter((k) => schemaSet.size > 0 && !schemaSet.has(k));
  const validationOnly = [...validationSet].filter((k) => schemaSet.size > 0 && !schemaSet.has(k));
  const schemaMissingValidation = [...schemaSet].filter(
    (k) => validationSet.size > 0 && !validationSet.has(k),
  );
  if (schemaOnly.length) mismatchFields.push({ kind: "schema_not_in_contract", fields: schemaOnly });
  if (contractOnly.length) mismatchFields.push({ kind: "contract_not_in_schema", fields: contractOnly });
  if (validationOnly.length) {
    mismatchFields.push({ kind: "validation_not_in_schema", fields: validationOnly });
  }
  if (schemaMissingValidation.length) {
    mismatchFields.push({ kind: "schema_not_in_validation", fields: schemaMissingValidation });
  }
  return mismatchFields;
}

function getRiskClass(slug) {
  if (RISK_CLASS.HIGH_RISK_MANUAL_ONLY.includes(slug)) return "HIGH_RISK_MANUAL_ONLY";
  if (RISK_CLASS.MEDIUM_RISK_ALIGNMENT.includes(slug)) return "MEDIUM_RISK_ALIGNMENT";
  if (RISK_CLASS.LOW_RISK_ESTIMATOR_ALIGNMENT.includes(slug)) return "LOW_RISK_ESTIMATOR_ALIGNMENT";
  return "UNKNOWN";
}

function recommendFixType(slug, riskClass, mismatchFields, schemaExists, contractExists) {
  if (riskClass === "HIGH_RISK_MANUAL_ONLY") return "manual_formula_review_only";
  if (!schemaExists && !contractExists) return "contract_and_schema_plan";
  if (!schemaExists && contractExists) return "schema_or_slug_alias";
  if (schemaExists && !contractExists) return "formula_contract_alignment";
  if (
    mismatchFields.some(
      (m) => m.kind === "schema_not_in_contract" || m.kind === "contract_not_in_schema",
    )
  ) {
    return "contract_schema_reconcile";
  }
  if (mismatchFields.some((m) => m.kind === "schema_not_in_validation")) return "validation_scaffold";
  return "metadata_alignment";
}

function evaluateAutoPatch(slug, riskClass, mismatchFields, schemaExists, contractExists, validationPath) {
  if (riskClass === "HIGH_RISK_MANUAL_ONLY") {
    return { allowed: false, reason: "high_risk_manual_only" };
  }
  if (!contractExists || !schemaExists) {
    return { allowed: false, reason: "missing_schema_or_contract" };
  }
  const structural = mismatchFields.filter(
    (m) => m.kind === "schema_not_in_contract" || m.kind === "contract_not_in_schema",
  );
  if (structural.length > 0) {
    return { allowed: false, reason: "formula_semantics_mismatch_not_field_rename" };
  }
  if (!validationPath && mismatchFields.some((m) => m.kind === "schema_not_in_validation")) {
    return {
      allowed: riskClass === "LOW_RISK_ESTIMATOR_ALIGNMENT",
      reason: "validation_scaffold_needed",
    };
  }
  const renameOnly =
    mismatchFields.length > 0 &&
    mismatchFields.every(
      (m) => m.kind === "schema_not_in_validation" || m.kind === "validation_not_in_schema",
    );
  if (renameOnly && riskClass === "LOW_RISK_ESTIMATOR_ALIGNMENT") {
    return { allowed: true, reason: "field_name_alignment_only" };
  }
  return { allowed: false, reason: "manual_review_default" };
}

export function auditP6Candidate(slug, context) {
  const { indexes, p24Tool, p25Tool, runtimeItem, graphTool, p5bItem, slugMap } = context;
  const schemaId = resolveSchemaId(slug, slugMap);
  const schemaInputs = schemaId
    ? extractSchemaInputs(schemaId)
    : { path: null, required: [], optional: [], all: [] };
  const validation = extractValidationInputs(slug, schemaId ?? slug);
  const contract = findContractForSlug(slug, indexes.contractIndex);
  const contractInputs = contract?.requiredInputs ?? [];
  const mismatchFields = computeMismatch(schemaInputs, validation.keys, contractInputs);
  const missingFiles = [];
  if (!schemaInputs.path) missingFiles.push("schema");
  if (!validation.path) missingFiles.push("validation");
  if (!contract) missingFiles.push("formulaContract");
  if (!findCalculatorModule(slug)) missingFiles.push("calculatorModule");
  if (!findResultRenderer(slug)) missingFiles.push("resultRenderer");
  if (graphTool?.missingLinks?.includes("submitHandler")) missingFiles.push("submitHandler");
  if (graphTool?.missingLinks?.includes("oracle")) missingFiles.push("oracle");
  const riskClass = getRiskClass(slug);
  const highRiskFormula =
    riskClass === "HIGH_RISK_MANUAL_ONLY" ||
    /pressure|welded|regulated|safety|kur|fx|doviz/i.test(slug) ||
    p24Tool?.findings?.some((f) => String(f).includes("sectorRealityTests"));
  const autoPatch = evaluateAutoPatch(
    slug,
    riskClass,
    mismatchFields,
    Boolean(schemaInputs.path),
    Boolean(contract),
    validation.path,
  );
  const recommendedFixType = recommendFixType(
    slug,
    riskClass,
    mismatchFields,
    Boolean(schemaInputs.path),
    Boolean(contract),
  );
  return {
    slug,
    family: p24Tool?.family ?? p25Tool?.tier ?? "unknown",
    tier: p25Tool?.tier ?? p24Tool?.tier ?? "unknown",
    riskClass,
    currentVerdict: p25Tool?.qualityStatus ?? p24Tool?.verdict ?? "unknown",
    p24Findings: p24Tool?.findings ?? [],
    p25RecommendedAction: p25Tool?.recommendedAction ?? "",
    runtimeTrustStatus: runtimeItem?.status ?? p25Tool?.runtimeStatus ?? "unknown",
    formulaKnowledgeGraphMissing: graphTool?.missingLinks ?? [],
    schemaId,
    schemaInputs: schemaInputs.required.length > 0 ? schemaInputs.required : schemaInputs.all,
    validationInputs: validation.keys,
    contractRequiredInputs: contractInputs,
    contractAliasSlug: contract?.aliasSlug ?? null,
    mismatchFields,
    files: {
      schema: schemaInputs.path,
      validation: validation.path,
      formulaContract: contract?.path ?? null,
      calculatorModule: findCalculatorModule(slug),
      resultRenderer: findResultRenderer(slug),
      route: findRoute(slug, p24Tool),
      oracleTests: findOracleTests(slug),
    },
    missingFiles,
    highRiskFormula,
    canAutoPatchSafely: autoPatch.allowed,
    autoPatchReason: autoPatch.reason,
    manualReviewRequired: highRiskFormula || !autoPatch.allowed,
    recommendedFixType,
    nextPatchScope: highRiskFormula
      ? "P6C manual engineering review — no formula patch"
      : autoPatch.allowed
        ? "P6B safe validation/schema field alignment"
        : recommendedFixType === "validation_scaffold"
          ? "P6B validation scaffold from schema keys"
          : "P6B contract/schema reconcile plan",
    p5bSegment: p5bItem?.segment ?? null,
    p5bNextAction: p5bItem?.nextAction ?? null,
  };
}

export function buildP6aAuditReport() {
  const p5b = readJson(P5B_REPORT_PATH);
  const p24Report = readJson(P24_REPORT_PATH) ?? buildP24ToolQualityReport();
  const controlPlane = readJson(CONTROL_PLANE_REPORT_PATH);
  const knowledgeGraph = readJson(FORMULA_KNOWLEDGE_GRAPH_PATH);
  const runtimeTrust = readJson(RUNTIME_TRUST_REPORT_PATH);
  const indexes = buildIndexes();
  const slugMap = loadPremiumSchemaSlugMap();
  const p5bBySlug = new Map((p5b?.items ?? []).map((i) => [i.slug, i]));
  const p24BySlug = new Map(p24Report.tools.map((t) => [t.slug, t]));
  const p25BySlug = new Map((controlPlane?.tools ?? []).map((t) => [t.slug, t]));
  const graphBySlug = new Map((knowledgeGraph?.tools ?? []).map((t) => [t.slug, t]));
  const runtimeBySlug = new Map((runtimeTrust?.items ?? []).map((t) => [t.slug, t]));
  const candidates = P6_CANDIDATES.map((slug) =>
    auditP6Candidate(slug, {
      indexes,
      p24Tool: p24BySlug.get(slug),
      p25Tool: p25BySlug.get(slug),
      runtimeItem: runtimeBySlug.get(slug),
      graphTool: graphBySlug.get(slug),
      p5bItem: p5bBySlug.get(slug),
      slugMap,
    }),
  );
  const summary = {
    candidateCount: candidates.length,
    highRiskManualOnly: candidates.filter((c) => c.riskClass === "HIGH_RISK_MANUAL_ONLY").length,
    mediumRiskAlignment: candidates.filter((c) => c.riskClass === "MEDIUM_RISK_ALIGNMENT").length,
    lowRiskEstimatorAlignment: candidates.filter((c) => c.riskClass === "LOW_RISK_ESTIMATOR_ALIGNMENT").length,
    canAutoPatchSafely: candidates.filter((c) => c.canAutoPatchSafely).length,
    manualReviewRequired: candidates.filter((c) => c.manualReviewRequired).length,
    missingValidation: candidates.filter((c) => c.missingFiles.includes("validation")).length,
    missingFormulaContract: candidates.filter((c) => c.missingFiles.includes("formulaContract")).length,
    structuralMismatch: candidates.filter((c) =>
      c.mismatchFields.some(
        (m) => m.kind === "schema_not_in_contract" || m.kind === "contract_not_in_schema",
      ),
    ).length,
  };
  const p6bPatchCandidates = candidates
    .filter((c) => c.canAutoPatchSafely || c.nextPatchScope.startsWith("P6B"))
    .sort((a, b) => {
      if (a.canAutoPatchSafely && !b.canAutoPatchSafely) return -1;
      if (!a.canAutoPatchSafely && b.canAutoPatchSafely) return 1;
      return a.slug.localeCompare(b.slug);
    })
    .slice(0, 5);
  const problemSlugTool = p25BySlug.get(PROBLEM_SLUG);
  return {
    generatedAt: new Date().toISOString(),
    phase: "P6A",
    applySafeAlignmentEnabled: process.env.P6A_APPLY_SAFE_ALIGNMENT === "1",
    candidates,
    summary,
    p6bRecommendedPatches: p6bPatchCandidates.map((c) => ({
      slug: c.slug,
      nextPatchScope: c.nextPatchScope,
      recommendedFixType: c.recommendedFixType,
      canAutoPatchSafely: c.canAutoPatchSafely,
      files: c.files,
      mismatchFields: c.mismatchFields,
    })),
    p6cHighRiskNotes: candidates
      .filter((c) => c.riskClass === "HIGH_RISK_MANUAL_ONLY")
      .map((c) => ({
        slug: c.slug,
        note: "Engineering manual review only — no automated formula patch in P6A/P6B.",
        missingFiles: c.missingFiles,
        mismatchFields: c.mismatchFields,
      })),
    paymentSafety: {
      paymentEligible: controlPlane?.summary?.paymentEligible ?? null,
      formulaGateEligible: controlPlane?.summary?.formulaGateEligible ?? null,
      freePaymentEligible: controlPlane?.summary?.freePaymentEligible ?? null,
      problemSlug: {
        slug: PROBLEM_SLUG,
        paymentEligible: problemSlugTool?.eligible?.paymentEligible ?? false,
        formulaGateEligible: problemSlugTool?.eligible?.formulaGateEligible ?? false,
      },
    },
    sources: {
      p5b: path.relative(ROOT, P5B_REPORT_PATH),
      p24: path.relative(ROOT, P24_REPORT_PATH),
      controlPlane: path.relative(ROOT, CONTROL_PLANE_REPORT_PATH),
      knowledgeGraph: path.relative(ROOT, FORMULA_KNOWLEDGE_GRAPH_PATH),
      runtimeTrust: path.relative(ROOT, RUNTIME_TRUST_REPORT_PATH),
    },
  };
}

export function formatP6aStdout(report) {
  const s = report.summary;
  return [
    "audit:p6a-premium-schema-fail PASS",
    `candidates: ${s.candidateCount}`,
    `HIGH_RISK_MANUAL_ONLY: ${s.highRiskManualOnly}`,
    `LOW_RISK safe alignment: ${s.canAutoPatchSafely}`,
    `manualReviewRequired: ${s.manualReviewRequired}`,
    `structuralMismatch: ${s.structuralMismatch}`,
    `applySafeAlignment: ${report.applySafeAlignmentEnabled ? "enabled" : "disabled"}`,
    `output: ${path.relative(ROOT, P6A_REPORT_PATH)}`,
  ].join("\n");
}

export function buildP6aMarkdownDoc(report) {
  const lines = [
    "# P6A — Premium Schema FAIL Manual Formula Alignment Audit",
    "",
    `Generated: ${report.generatedAt}`,
    "",
    "## Summary",
    "",
    `- Candidates: ${report.summary.candidateCount}`,
    `- HIGH_RISK manual only: ${report.summary.highRiskManualOnly}`,
    `- MEDIUM risk alignment: ${report.summary.mediumRiskAlignment}`,
    `- LOW risk estimator alignment: ${report.summary.lowRiskEstimatorAlignment}`,
    `- Can auto-patch safely: ${report.summary.canAutoPatchSafely}`,
    `- Manual review required: ${report.summary.manualReviewRequired}`,
    `- Structural schema/contract mismatch: ${report.summary.structuralMismatch}`,
    `- P6A apply mode: ${report.applySafeAlignmentEnabled ? "APPLY" : "audit only"}`,
    "",
    "## Candidate table",
    "",
    "| Slug | Risk | Verdict | Schema | Validation | Contract | Auto patch |",
    "|------|------|---------|--------|------------|----------|------------|",
  ];
  for (const c of report.candidates) {
    lines.push(
      `| ${c.slug} | ${c.riskClass} | ${c.currentVerdict} | ${c.files.schema ? "yes" : "no"} | ${c.files.validation ? "yes" : "no"} | ${c.files.formulaContract ? "yes" : "no"} | ${c.canAutoPatchSafely ? "yes" : "no"} |`,
    );
  }
  lines.push("", "## HIGH_RISK manual only (P6C)", "");
  for (const item of report.p6cHighRiskNotes) {
    lines.push(`- **${item.slug}**: ${item.note}`);
    if (item.mismatchFields.length) {
      lines.push(`  - mismatches: ${JSON.stringify(item.mismatchFields)}`);
    }
  }
  lines.push("", "## LOW_RISK safe alignment candidates", "");
  for (const c of report.candidates.filter((x) => x.riskClass === "LOW_RISK_ESTIMATOR_ALIGNMENT")) {
    lines.push(
      `- ${c.slug}: autoPatch=${c.canAutoPatchSafely} (${c.autoPatchReason}) — ${c.nextPatchScope}`,
    );
  }
  lines.push("", "## Missing files by candidate", "");
  for (const c of report.candidates) {
    if (c.missingFiles.length === 0) continue;
    lines.push(`- ${c.slug}: ${c.missingFiles.join(", ")}`);
  }
  lines.push("", "## Field mismatches", "");
  for (const c of report.candidates) {
    if (c.mismatchFields.length === 0) continue;
    lines.push(`- **${c.slug}**`);
    for (const m of c.mismatchFields) {
      lines.push(`  - ${m.kind}: ${m.fields.join(", ")}`);
    }
  }
  lines.push("", "## P6B recommended first 5 patches", "");
  for (const p of report.p6bRecommendedPatches) {
    lines.push(`- ${p.slug}: ${p.recommendedFixType} — ${p.nextPatchScope}`);
  }
  lines.push("", "## Payment / Formula Gate safety", "");
  lines.push(`- paymentEligible: ${report.paymentSafety.paymentEligible}`);
  lines.push(`- formulaGateEligible: ${report.paymentSafety.formulaGateEligible}`);
  lines.push(`- free paymentEligible: ${report.paymentSafety.freePaymentEligible}`);
  lines.push(
    `- problem slug ${report.paymentSafety.problemSlug.slug}: payment=${report.paymentSafety.problemSlug.paymentEligible}, formulaGate=${report.paymentSafety.problemSlug.formulaGateEligible}`,
  );
  lines.push("");
  return lines.join("\n");
}
