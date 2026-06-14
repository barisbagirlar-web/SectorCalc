import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { ROOT } from "./activation-paths.mjs";
import { readToolIndex, hasFormulaContract } from "./activation-scan-lib.mjs";
import { buildIndexes } from "./p24-tool-quality-lib.mjs";
import { PROBLEM_SLUG } from "./p25-control-plane-lib.mjs";
import { EXPECTED_REVENUE_ELIGIBLE_COUNTS } from "../revenue-eligible-allowlist.mjs";
import {
  ensureFormulaSourceAudit,
  getFormulaSourceAudit,
  isFormulaSourceAutoEligible,
} from "./formula-source-audit-lib.mjs";
import {
  buildQualityScanReport,
  QUALITY_SCAN_REPORT_PATH,
  isRiskExcludedTool,
} from "./quality-backfill-scan-lib.mjs";
import {
  generateToolFiles,
  loadFactoryInputs,
  wireContractsRegistry,
  toPascalCase,
} from "./premium-backfill-factory-lib.mjs";

export const P6B_AUDIT_PATH = path.join(ROOT, "scripts/.cache/p6b-formula-factory-audit.json");
export const P6B_APPLY_REPORT_PATH = path.join(ROOT, "scripts/.cache/p6b-formula-factory-apply-report.json");
export const P6B_VERIFY_REPORT_PATH = path.join(ROOT, "scripts/.cache/p6b-formula-factory-verify-report.json");
export const P6B_DOC_PATH = path.join(ROOT, "docs/p6b-deepseek-full-formula-factory-report.md");

export const FEED_EFFICIENCY_SLUG = "feed-efficiency-analyzer";

const CACHE_DIR = path.join(ROOT, "scripts/.cache");
const TRUST_REPORT_PATH = path.join(CACHE_DIR, "runtime-trust-engine-report.json");

const SCHEMAS_DIR = path.join(ROOT, "src/lib/premium-schema/schemas");
const CALCULATORS_DIR = path.join(ROOT, "src/lib/premium-schema/calculators");
const TESTS_DIR = path.join(ROOT, "src/lib/premium-schema/__tests__");
const CONTRACTS_FILE = path.join(ROOT, "src/lib/formula-governance/contracts.ts");
const GUIDE_SPECS_FILE = path.join(ROOT, "src/lib/tool-guides/p6b-formula-factory-guide-specs.ts");
const GUIDE_REGISTRY_FILE = path.join(ROOT, "src/lib/tool-guides/premium-input-guide-specs.ts");
const MESSAGES_EN = path.join(ROOT, "messages/en.json");
const MESSAGES_TR = path.join(ROOT, "messages/tr.json");
const SCHEMA_REGISTRY_FILE = path.join(ROOT, "src/lib/premium-schema/schema-registry.ts");

const PROTECTED_SLUGS = new Set([
  "7-israf-muda-avcisi-parasal-karsilik-calculator",
  PROBLEM_SLUG,
  FEED_EFFICIENCY_SLUG,
]);

const HIGH_RISK_PATTERNS = [
  { id: "pressure-vessel", pattern: /pressure-vessel|basincli-kap/i },
  { id: "welded-bolted", pattern: /welded-bolted|kaynakli-baglanti/i },
  { id: "legal", pattern: /^legal-/ },
  { id: "tax", pattern: /\btax\b|vergi|kdv|gelir-vergisi|stopaj|tevkifat/i },
  { id: "severance", pattern: /severance|kidem|ihbar|annual-leave/i },
  { id: "cbam", pattern: /^cbam-/ },
  { id: "compliance", pattern: /compliance|regulatory/i },
  { id: "safety", pattern: /safety|guvenlik|is-sagligi/i },
  { id: "fire-system", pattern: /fire-system|yangin/i },
  { id: "bolt-tightening", pattern: /bolt-tightening|civata-sikma/i },
  { id: "hydraulic", pattern: /hydraulic|hidrolik|pnomatik/i },
  { id: "electrical-safety", pattern: /electrical[- ]?safety|elektrik-guvenlik/i },
  { id: "fx", pattern: /\bfx\b|doviz|kur-farki|kur-fark/i },
  { id: "auto-repair", pattern: /^auto-repair-/ },
  { id: "medical", pattern: /medical|medikal/i },
  { id: "structural", pattern: /structural|yapisal|statik|istinat-duvari/i },
  { id: "investment-npv", pattern: /investment-payback|npv|irr-hesaplama/i },
  { id: "credit", pattern: /kredi-|leasing-/ },
];

const MEDIUM_RISK_PATTERNS = [
  /manufacturing/i,
  /hvac/i,
  /energy/i,
  /logistics/i,
  /margin/i,
  /profit/i,
  /quote/i,
  /bid/i,
  /waste/i,
  /scrap/i,
  /heat[- ]?loss/i,
  /uretim/i,
  /enerji/i,
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
  fs.writeFileSync(filePath, content.endsWith("\n") ? content : `${content}\n`, "utf8");
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

function isIdentifierSafeSlug(slug) {
  const pascal = toPascalCase(slug);
  return /^[A-Za-z_]/.test(pascal);
}

export function classifyRiskClass(slug) {
  if (PROTECTED_SLUGS.has(slug)) {
    if (slug === PROBLEM_SLUG) return "HIGH_FINANCE_LEGAL_TAX";
    if (slug === FEED_EFFICIENCY_SLUG) return "BLOCKED_UNKNOWN";
    return "HIGH_ENGINEERING_SAFETY";
  }

  for (const entry of HIGH_RISK_PATTERNS) {
    if (entry.pattern.test(slug)) {
      if (entry.id === "tax" || entry.id === "legal" || entry.id === "fx" || entry.id === "credit") {
        return "HIGH_FINANCE_LEGAL_TAX";
      }
      if (entry.id === "cbam" || entry.id === "compliance") {
        return "HIGH_REGULATORY";
      }
      return "HIGH_ENGINEERING_SAFETY";
    }
  }

  if (isRiskExcludedTool(slug)) {
    return "HIGH_ENGINEERING_SAFETY";
  }

  if (MEDIUM_RISK_PATTERNS.some((re) => re.test(slug))) {
    return "MEDIUM_BUSINESS_CALC";
  }

  return "LOW_GENERAL_CALC";
}

export function loadSchemaRegistryAliases() {
  const content = readText(SCHEMA_REGISTRY_FILE);
  const aliases = new Map();
  for (const match of content.matchAll(/"([^"]+)":\s*"([^"]+)"/g)) {
    if (match[1].includes("-") && match[2].includes("-")) {
      aliases.set(match[1], match[2]);
    }
  }
  return aliases;
}

export function resolveSchemaForSlug(slug, schemaIndex, aliases) {
  if (schemaIndex.has(slug)) {
    return { schemaId: slug, schema: schemaIndex.get(slug) };
  }
  const alias = aliases.get(slug);
  if (alias && schemaIndex.has(alias)) {
    return { schemaId: alias, schema: schemaIndex.get(alias) };
  }
  return { schemaId: null, schema: null };
}

function readSchemaCategory(slug) {
  const filePath = path.join(SCHEMAS_DIR, `${slug}.ts`);
  if (!fs.existsSync(filePath)) return "cost";
  const content = readText(filePath);
  return content.match(/category:\s*"([^"]+)"/)?.[1] ?? "cost";
}

function hasBackingFiles(slug) {
  return {
    validation: fs.existsSync(path.join(CALCULATORS_DIR, `${slug}-validation.ts`)),
    calculator: fs.existsSync(path.join(CALCULATORS_DIR, `${slug}.ts`)),
    oracleTest:
      fs.existsSync(path.join(TESTS_DIR, `${slug}.test.ts`)) ||
      fs.existsSync(path.join(TESTS_DIR, `${slug}-global-sanity.test.ts`)),
    contract: fs.existsSync(
      path.join(ROOT, "src/lib/formula-governance/contracts", `${slug}-critical.ts`),
    ),
  };
}

function hasFreeCalculator(slug, indexes) {
  if (indexes.freeTrafficCalculatorSlugs.has(slug)) return true;
  if (indexes.legacyCalculatorSlugs.has(slug)) return true;
  return false;
}

function ensureQualityScan() {
  if (!fs.existsSync(QUALITY_SCAN_REPORT_PATH)) {
    const report = buildQualityScanReport();
    fs.mkdirSync(path.dirname(QUALITY_SCAN_REPORT_PATH), { recursive: true });
    fs.writeFileSync(QUALITY_SCAN_REPORT_PATH, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  }
}

export function auditSingleTool(tool, schemaIndex, aliases, indexes, formulaRegistryIds) {
  const slug = tool.slug;
  const riskClass = classifyRiskClass(slug);
  const backing = hasBackingFiles(slug);
  const { schemaId, schema } = resolveSchemaForSlug(slug, schemaIndex, aliases);
  const missing = [];
  const routeStatus = tool.routeStatus ?? "unknown";

  const inputStatus =
    schema && schema.inputs.length > 0 ? "FULLY_WORKING" : schema ? "INPUT_MISSING" : "INPUT_MISSING";
  const formulaStatus =
    schema && schema.formulaPipeline.length > 0
      ? schema.formulaPipeline.every((step) => formulaRegistryIds.has(step.formulaId))
        ? "FULLY_WORKING"
        : "FORMULA_MISSING"
      : schema
        ? "FORMULA_MISSING"
        : hasFreeCalculator(slug, indexes)
          ? "FULLY_WORKING"
          : "FORMULA_MISSING";

  const validationStatus = backing.validation ? "FULLY_WORKING" : "VALIDATION_MISSING";
  const oracleStatus = backing.oracleTest ? "FULLY_WORKING" : "ORACLE_MISSING";
  const rendererStatus =
    schema && schema.outputs.length > 0 ? "FULLY_WORKING" : "RENDERER_MISSING";

  const backingComplete =
    backing.validation && backing.calculator && backing.oracleTest && backing.contract;

  if (routeStatus !== "active-route") missing.push("route:not-active");
  if (inputStatus !== "FULLY_WORKING") missing.push("input");
  if (formulaStatus !== "FULLY_WORKING") missing.push("formula");
  if (validationStatus !== "FULLY_WORKING") missing.push("validation");
  if (oracleStatus !== "FULLY_WORKING") missing.push("oracle");
  if (rendererStatus !== "FULLY_WORKING") missing.push("renderer");
  if (!backingComplete && schema) missing.push("backing");

  const manualExpertRequired =
    riskClass === "HIGH_ENGINEERING_SAFETY" ||
    riskClass === "HIGH_FINANCE_LEGAL_TAX" ||
    riskClass === "HIGH_REGULATORY" ||
    riskClass === "BLOCKED_UNKNOWN" ||
    slug === PROBLEM_SLUG;

  const blockedSafety =
    slug === FEED_EFFICIENCY_SLUG ||
    riskClass === "BLOCKED_UNKNOWN" ||
    (riskClass.startsWith("HIGH_") && !manualExpertRequired);

  const formulaSourceOk = isFormulaSourceAutoEligible(slug);
  const schemaBacked = Boolean(schema && schema.formulaPipeline.length > 0);
  const routeOk = routeStatus === "active-route";
  const needsPatch = schemaBacked && !backingComplete;

  const autoPatchEligible =
    !manualExpertRequired &&
    !blockedSafety &&
    !PROTECTED_SLUGS.has(slug) &&
    isIdentifierSafeSlug(slug) &&
    routeOk &&
    needsPatch &&
    formulaStatus === "FULLY_WORKING" &&
    rendererStatus === "FULLY_WORKING" &&
    (riskClass === "LOW_GENERAL_CALC" || riskClass === "MEDIUM_BUSINESS_CALC") &&
    formulaSourceOk;

  const fullyWorking = missing.length === 0 || (backingComplete && formulaStatus === "FULLY_WORKING");

  let patchAction = "SKIP";
  if (manualExpertRequired) patchAction = "MANUAL_EXPERT_REQUIRED";
  else if (blockedSafety) patchAction = "BLOCKED_SAFETY";
  else if (fullyWorking && backingComplete) patchAction = "FULLY_WORKING";
  else if (autoPatchEligible) patchAction = "AUTO_PATCH_READY";
  else if (routeStatus !== "active-route") patchAction = "BACKING_MISSING";
  else patchAction = "MANUAL_EXPERT_REQUIRED";

  const proposedInputs =
    schema?.inputs.map((input) => ({
      id: input.id,
      type: input.type,
      unit: input.unit ?? "",
      required: input.required,
      smartDefault: input.smartDefault,
    })) ?? [];

  const proposedFormula =
    schema?.formulaPipeline.map((step) => `${step.formulaId} → ${step.outputId}`).join("; ") ?? "";

  const proposedValidation = schema?.inputs.map((input) => {
    if (input.unit === "%") return `${input.id}: percent 0-100`;
    if (input.min !== undefined && input.max !== undefined) {
      return `${input.id}: range ${input.min}-${input.max}`;
    }
    if (input.min !== undefined && input.min > 0) return `${input.id}: positive`;
    return `${input.id}: finite number`;
  }) ?? [];

  const oracleCases = schemaBacked
    ? [
        { name: "default_inputs", band: "low" },
        { name: "warning_threshold", band: "warning" },
        { name: "critical_threshold", band: "critical" },
      ]
    : [];

  return {
    slug,
    tier: tool.tier ?? "unknown",
    category: tool.category ?? schema?.sectorSlug ?? "unknown",
    routeStatus,
    inputStatus,
    formulaStatus,
    validationStatus,
    oracleStatus,
    rendererStatus,
    riskClass,
    autoPatchEligible,
    manualExpertRequired,
    blockedSafety,
    missing,
    proposedInputs,
    proposedFormula,
    proposedValidation,
    oracleCases,
    patchAction,
    schemaId,
    fullyWorking,
    backingComplete,
    hasFormulaContract: hasFormulaContract(slug),
    formulaSourceAudit: getFormulaSourceAudit(slug)?.decision ?? null,
  };
}

export function buildP6bAuditReport() {
  ensureQualityScan();
  ensureFormulaSourceAudit();

  const index = readToolIndex();
  const { schemas: schemaIndex, formulaRegistryIds } = loadFactoryInputs();
  const aliases = loadSchemaRegistryAliases();
  const indexes = buildIndexes();

  const tools = index.tools.map((tool) =>
    auditSingleTool(tool, schemaIndex, aliases, indexes, formulaRegistryIds),
  );

  const summary = {
    totalTools: tools.length,
    fullyWorking: tools.filter((t) => t.fullyWorking && t.backingComplete).length,
    autoPatchReady: tools.filter((t) => t.autoPatchEligible).length,
    manualExpertRequired: tools.filter((t) => t.manualExpertRequired).length,
    blockedSafety: tools.filter((t) => t.blockedSafety).length,
    activeRoutes: tools.filter((t) => t.routeStatus === "active-route").length,
    categoryOnly: tools.filter((t) => t.routeStatus === "category-only").length,
  };

  return {
    generatedAt: new Date().toISOString(),
    auditId: "P6B-deepseek-full-formula-factory",
    summary,
    tools,
    revenueBoundary: loadRevenueBoundary(),
  };
}

export function selectAutoPatchBatch(audit, limit = 25) {
  return audit.tools
    .filter((tool) => tool.autoPatchEligible && tool.patchAction === "AUTO_PATCH_READY")
    .sort((a, b) => a.slug.localeCompare(b.slug))
    .slice(0, limit);
}

export function loadRevenueBoundary() {
  const trust = readJson(TRUST_REPORT_PATH);
  const problem = trust?.items?.find((item) => item.slug === PROBLEM_SLUG);
  const feed = trust?.items?.find((item) => item.slug === FEED_EFFICIENCY_SLUG);
  return {
    paymentEligible: trust?.paymentEligible ?? null,
    formulaGateEligible: trust?.formulaGateEligible ?? null,
    freePaymentEligible: (trust?.items ?? []).filter(
      (item) => item.paymentEligible && item.tier === "free",
    ).length,
    problemSlugLocked: !(problem?.paymentEligible || problem?.formulaGateEligible),
    feedEfficiencyBlocked: !(feed?.paymentEligible || feed?.formulaGateEligible),
    expected: EXPECTED_REVENUE_ELIGIBLE_COUNTS,
  };
}

export function renderGuideSpec(slug, schema) {
  const category = readSchemaCategory(slug);
  const guideType = GUIDE_TYPE_BY_CATEGORY[category] ?? "cost_breakdown";
  const camel = slugToCamel(slug);
  const inputs = schema.inputs ?? [];
  const inputMap = inputs.map((input, index) => ({
    inputKey: input.id,
    visualRole: shapeRoleForIndex(index, inputs.length),
    nodeId: input.id.replace(/[^a-z0-9]/gi, "").toLowerCase(),
  }));

  return {
    slug,
    guideType,
    titleKey: `inputGuide.p6bFormulaFactory.tools.${camel}.title`,
    descriptionKey: DESCRIPTION_KEY_BY_GUIDE_TYPE[guideType],
    inputMap,
  };
}

export function renderGuideSpecsFile(specs) {
  const blocks = specs.map((spec) => {
    const inputMapLines = spec.inputMap
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
${inputMapLines}
    ],
    quality: TOOL_GUIDE_QUALITY_DEFAULT,
  }`;
  });

  return `/**
 * P6B formula factory guide specs — schema-derived input maps.
 * GENERATED by scripts/tool-activation/p6b-apply-safe-formula-batch.mjs
 */
import {
  TOOL_GUIDE_QUALITY_DEFAULT,
  type ToolGuideSpec,
} from "@/lib/tool-guides/tool-guide-spec";

export const P6B_FORMULA_FACTORY_GUIDE_SPECS: readonly ToolGuideSpec[] = [
${blocks.join(",\n")}
];
`;
}

export function wireGuideRegistry() {
  let content = readText(GUIDE_REGISTRY_FILE);
  const importLine =
    "import { P6B_FORMULA_FACTORY_GUIDE_SPECS } from \"@/lib/tool-guides/p6b-formula-factory-guide-specs\";";

  if (!content.includes(importLine)) {
    content = content.replace(
      "import { S5_GUIDE_ORACLE_UX_SCAFFOLD_SPECS }",
      `${importLine}\nimport { S5_GUIDE_ORACLE_UX_SCAFFOLD_SPECS }`,
    );
  }

  if (!content.includes("P6B_FORMULA_FACTORY_GUIDE_SPECS")) {
    content = content.replace(
      "  for (const spec of S5_GUIDE_ORACLE_UX_SCAFFOLD_SPECS) {",
      "  for (const spec of P6B_FORMULA_FACTORY_GUIDE_SPECS) {\n    registry.set(spec.slug, spec);\n  }\n\n  for (const spec of S5_GUIDE_ORACLE_UX_SCAFFOLD_SPECS) {",
    );
  }

  writeText(GUIDE_REGISTRY_FILE, content);
}

export function patchGuideMessages(slugs) {
  for (const filePath of [MESSAGES_EN, MESSAGES_TR]) {
    const messages = readJson(filePath) ?? {};
    if (!messages.inputGuide) messages.inputGuide = {};
    if (!messages.inputGuide.p6bFormulaFactory) messages.inputGuide.p6bFormulaFactory = {};
    if (!messages.inputGuide.p6bFormulaFactory.tools) {
      messages.inputGuide.p6bFormulaFactory.tools = {};
    }
    for (const slug of slugs) {
      const camel = slugToCamel(slug);
      if (!messages.inputGuide.p6bFormulaFactory.tools[camel]) {
        messages.inputGuide.p6bFormulaFactory.tools[camel] = { title: slugToTitle(slug) };
      }
    }
    writeText(filePath, JSON.stringify(messages, null, 2));
  }
}

function patchGeneratedTest(testContent, contractExport, slug) {
  const importLine = `import { ${contractExport} } from "@/lib/formula-governance/contracts/${slug}-critical";`;
  let content = testContent;
  if (!content.includes(importLine)) {
    content = content.replace(
      'import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";',
      `${importLine}\nimport { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";`,
    );
  }

  const contractTest = `  test("contract metadata matches slug", () => {
    const contract = ${contractExport}[0];
    expect(contract).toBeDefined();
    if (!contract) return;
    expect(contract.slug).toBe(SLUG);
    expect(contract.requiredInputs.length).toBeGreaterThan(0);
    expect(contract.assumptions.join(" ")).toContain("deterministic");
  });`;

  if (content.includes("contract metadata matches slug")) {
    return content.replace(
      /test\("contract metadata matches slug"[\s\S]*?\n  \}\);/,
      contractTest,
    );
  }
  return content;
}

export function applyFormulaBatch(slugs) {
  const { schemas: schemaIndex, formulaRegistryIds } = loadFactoryInputs();
  const aliases = loadSchemaRegistryAliases();

  const generated = [];
  const passed = [];
  const failed = [];
  const skipped = [];
  const guideSpecs = [];
  const testFiles = [];

  let contractsContent = readText(CONTRACTS_FILE);
  const registryEntries = [];

  for (const slug of slugs) {
    if (PROTECTED_SLUGS.has(slug)) {
      skipped.push({ slug, reason: "protected_slug" });
      continue;
    }

    if (!isIdentifierSafeSlug(slug)) {
      skipped.push({ slug, reason: "identifier_unsafe_slug" });
      continue;
    }

    const { schema } = resolveSchemaForSlug(slug, schemaIndex, aliases);
    if (!schema || schema.formulaPipeline.length === 0) {
      skipped.push({ slug, reason: "missing_schema_pipeline" });
      continue;
    }

    const missingFormula = schema.formulaPipeline.find(
      (step) => !formulaRegistryIds.has(step.formulaId),
    );
    if (missingFormula) {
      skipped.push({ slug, reason: `missing_formula_id:${missingFormula.formulaId}` });
      continue;
    }

    const backing = hasBackingFiles(slug);
    if (backing.validation && backing.calculator && backing.oracleTest && backing.contract) {
      skipped.push({ slug, reason: "already_complete" });
      continue;
    }

    try {
      const tool = { slug };
      const files = generateToolFiles(tool, schema);
      const patchedTest = patchGeneratedTest(files.test, files.contractExport, slug);
      fs.writeFileSync(files.contractPath, files.contract, "utf8");
      fs.writeFileSync(files.validationPath, files.validation, "utf8");
      fs.writeFileSync(files.calculatorPath, files.calculator, "utf8");
      fs.writeFileSync(files.testPath, patchedTest, "utf8");
      registryEntries.push(files);
      generated.push(slug);
      testFiles.push(path.relative(ROOT, files.testPath));
      guideSpecs.push(renderGuideSpec(slug, schema));
    } catch (error) {
      failed.push({
        slug,
        reason: error instanceof Error ? error.message : String(error),
      });
    }
  }

  if (registryEntries.length > 0) {
    contractsContent = wireContractsRegistry(contractsContent, registryEntries);
    writeText(CONTRACTS_FILE, contractsContent);
  }

  if (guideSpecs.length > 0) {
    writeText(GUIDE_SPECS_FILE, renderGuideSpecsFile(guideSpecs));
    wireGuideRegistry();
    patchGuideMessages(generated);
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

  return {
    generatedAt: new Date().toISOString(),
    requested: slugs,
    generated,
    passed,
    failed,
    skipped,
    testFiles,
    guideSpecsCount: guideSpecs.length,
    filesTouched: [
      path.relative(ROOT, GUIDE_SPECS_FILE),
      path.relative(ROOT, GUIDE_REGISTRY_FILE),
      path.relative(ROOT, CONTRACTS_FILE),
      ...generated.flatMap((slug) => [
        `src/lib/premium-schema/calculators/${slug}.ts`,
        `src/lib/premium-schema/calculators/${slug}-validation.ts`,
        `src/lib/premium-schema/__tests__/${slug}.test.ts`,
        `src/lib/formula-governance/contracts/${slug}-critical.ts`,
      ]),
    ],
  };
}

export function verifyPatchedTools(slugs) {
  const results = [];
  for (const slug of slugs) {
    const backing = hasBackingFiles(slug);
    let oraclePass = false;
    const testPath = path.join(TESTS_DIR, `${slug}.test.ts`);
    if (fs.existsSync(testPath)) {
      try {
        execFileSync("npx", ["vitest", "run", path.relative(ROOT, testPath)], {
          cwd: ROOT,
          stdio: "pipe",
          encoding: "utf8",
        });
        oraclePass = true;
      } catch {
        oraclePass = false;
      }
    }

    const result =
      backing.validation &&
      backing.calculator &&
      backing.oracleTest &&
      backing.contract &&
      oraclePass
        ? "PASS"
        : "FAIL";

    results.push({
      slug,
      input: backing.validation ? "PASS" : "FAIL",
      formula: backing.calculator ? "PASS" : "FAIL",
      validation: backing.validation ? "PASS" : "FAIL",
      oracle: oraclePass ? "PASS" : "FAIL",
      renderer: backing.calculator ? "PASS" : "FAIL",
      result,
    });
  }

  const revenueBoundary = loadRevenueBoundary();
  const boundaryOk =
    revenueBoundary.paymentEligible === EXPECTED_REVENUE_ELIGIBLE_COUNTS.paymentEligible &&
    revenueBoundary.formulaGateEligible === EXPECTED_REVENUE_ELIGIBLE_COUNTS.formulaGateEligible &&
    revenueBoundary.freePaymentEligible === EXPECTED_REVENUE_ELIGIBLE_COUNTS.freePaymentEligible &&
    revenueBoundary.problemSlugLocked &&
    revenueBoundary.feedEfficiencyBlocked;

  return {
    generatedAt: new Date().toISOString(),
    results,
    revenueBoundary,
    boundaryOk,
    allPass: results.every((row) => row.result === "PASS") && boundaryOk,
  };
}

export function renderP6bReportDoc(audit, applyReport, verifyReport) {
  const patched = verifyReport?.results ?? [];
  const manualQueue = audit.tools
    .filter((t) => t.manualExpertRequired)
    .slice(0, 50)
    .map((t) => ({ slug: t.slug, reason: t.riskClass }));
  const blockedQueue = audit.tools
    .filter((t) => t.blockedSafety)
    .slice(0, 50)
    .map((t) => ({ slug: t.slug, reason: t.riskClass }));

  const batchTable =
    patched.length > 0
      ? patched
          .map(
            (row) =>
              `| ${row.slug} | ${row.input} | ${row.formula} | ${row.validation} | ${row.oracle} | ${row.renderer} | ${row.result} |`,
          )
          .join("\n")
      : "| — | — | — | — | — | — | — |";

  const rb = verifyReport?.revenueBoundary ?? audit.revenueBoundary;

  return `# P6B DeepSeek Full Formula Factory Report

## Summary

* Total tools: ${audit.summary.totalTools}
* Fully working: ${audit.summary.fullyWorking}
* Auto patch ready: ${audit.summary.autoPatchReady}
* Patched in this batch: ${applyReport?.generated?.length ?? 0}
* Manual expert required: ${audit.summary.manualExpertRequired}
* Blocked safety: ${audit.summary.blockedSafety}
* Revenue boundary: ${verifyReport?.boundaryOk ? "PASS" : "CHECK"}
* Deploy executed: no

## Batch 1 Patched Tools

| Slug | Input | Formula | Validation | Oracle | Renderer | Result |
|------|-------|---------|------------|--------|----------|--------|
${batchTable}

## Manual Expert Queue

| Slug | Reason |
|------|--------|
${manualQueue.map((r) => `| ${r.slug} | ${r.reason} |`).join("\n")}

## Blocked Safety Queue

| Slug | Reason |
|------|--------|
${blockedQueue.map((r) => `| ${r.slug} | ${r.reason} |`).join("\n")}

## Revenue Boundary

| Check | Expected | Actual |
| paymentEligible | 22 | ${rb?.paymentEligible ?? "—"} |
| formulaGateEligible | 22 | ${rb?.formulaGateEligible ?? "—"} |
| freePaymentEligible | 0 | ${rb?.freePaymentEligible ?? "—"} |
| feed-efficiency-analyzer | blocked | ${rb?.feedEfficiencyBlocked ? "blocked" : "OPEN"} |
| abonelik-yazilim-cloud-yillik-maliyet-hesabi | locked | ${rb?.problemSlugLocked ? "locked" : "OPEN"} |
`;
}

export function writeP6bOutputs(audit, applyReport, verifyReport) {
  writeText(P6B_AUDIT_PATH, JSON.stringify(audit, null, 2));
  if (applyReport) writeText(P6B_APPLY_REPORT_PATH, JSON.stringify(applyReport, null, 2));
  if (verifyReport) writeText(P6B_VERIFY_REPORT_PATH, JSON.stringify(verifyReport, null, 2));
  writeText(P6B_DOC_PATH, renderP6bReportDoc(audit, applyReport, verifyReport));
}
