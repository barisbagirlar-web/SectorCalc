import fs from "node:fs";
import path from "node:path";
import { ROOT, P53_REFERENCE_SLUG, SCAN_REPORT_PATH } from "./activation-paths.mjs";

export const QUALITY_DIR = path.join(ROOT, ".sectorcalc", "tool-quality");
export const QUALITY_SCAN_REPORT_PATH = path.join(QUALITY_DIR, "quality-scan-report.json");
export const REFERENCE_SLUG = P53_REFERENCE_SLUG;

const SCHEMAS_DIR = path.join(ROOT, "src/lib/premium-schema/schemas");
const FORMULA_REGISTRY_FILE = path.join(ROOT, "src/lib/premium-schema/formula-registry.ts");
const CONTRACTS_DIR = path.join(ROOT, "src/lib/formula-governance/contracts");
const LOCATOR_FILES = [
  path.join(ROOT, "src/lib/formula-governance/oracle/production-formula-locator.ts"),
  path.join(
    ROOT,
    "src/lib/formula-governance/oracle/premium-schema-extended-production-locators.ts",
  ),
];
const ORACLE_FILES = [
  path.join(ROOT, "src/lib/formula-governance/oracle/production-formula-locator.ts"),
  path.join(ROOT, "src/lib/formula-governance/oracle/premium-schema-extended-oracles.ts"),
  path.join(ROOT, "src/lib/formula-governance/oracle/compare-production-oracle.ts"),
];
const PREMIUM_SCHEMA_I18N_REL = "src/data/premium-schema-i18n.ts";
const REFERENCE_I18N_REL = "src/lib/i18n/seven-muda-rev5-labels.ts";
const REFERENCE_VALIDATION_REL = "src/lib/premium-schema/calculators/seven-muda-waste-validation.ts";
const REFERENCE_TEST_REL = "src/lib/premium-schema/__tests__/seven-muda-waste-cost-calculator.test.ts";
const PREMIUM_SCHEMA_I18N_FILE = path.join(ROOT, PREMIUM_SCHEMA_I18N_REL);
const REFERENCE_I18N_FILE = path.join(ROOT, REFERENCE_I18N_REL);
const REFERENCE_VALIDATION_FILE = path.join(ROOT, REFERENCE_VALIDATION_REL);
const REFERENCE_TEST_FILE = path.join(ROOT, REFERENCE_TEST_REL);
const INDEX_FILE = path.join(ROOT, "public/ai-tool-index.json");

const A_CLASS_KEYWORDS =
  /margin|risk|leak|waste|muda|overrun|callback|quote|bid|loss|exposure|verdict|decision|profit|pricing|scrap|rework|comeback|drift|turnover|compliance|yield-loss|analyzer|parasal|marj|teklif|israf|kayip|riski/i;

const B_TECH_SCHEMA_SLUGS =
  /torque|belt-pulley|bolt-tightening|cbam-unit|npv|payback|oee|pressure|hydraulic|stack-up|welded-joint|fire-system|severance-notice|annual-leave|employee-total|shop-rate|hourly-cost|effectiveness|cylinder-force|paf-calculator/i;

const UPGRADE_GAP_ORDER = [
  "FormulaContract",
  "validation",
  "tests",
  "quick result UI",
  "deep report UI",
  "i18n",
  "route",
];

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildSchemaIndex() {
  /** @type {Map<string, { path: string, formulaIds: string[] }>} */
  const index = new Map();

  if (!fs.existsSync(SCHEMAS_DIR)) {
    return index;
  }

  for (const file of fs.readdirSync(SCHEMAS_DIR)) {
    if (!file.endsWith(".ts")) continue;
    const absolutePath = path.join(SCHEMAS_DIR, file);
    const content = fs.readFileSync(absolutePath, "utf8");
    const idMatch = content.match(/\bid:\s*"([^"]+)"/);
    if (!idMatch) continue;
    const slug = idMatch[1];
    const formulaIds = [...content.matchAll(/formulaId:\s*"([^"]+)"/g)].map((match) => match[1]);
    index.set(slug, {
      path: path.relative(ROOT, absolutePath),
      formulaIds,
    });
  }

  return index;
}

function buildFormulaRegistryIds() {
  const content = fs.readFileSync(FORMULA_REGISTRY_FILE, "utf8");
  const ids = new Set();

  for (const match of content.matchAll(/^\s+id:\s*"([^"]+)"/gm)) {
    ids.add(match[1]);
  }

  return ids;
}

function buildContractIndex() {
  /** @type {Map<string, string>} */
  const index = new Map();

  if (!fs.existsSync(CONTRACTS_DIR)) {
    return index;
  }

  for (const file of fs.readdirSync(CONTRACTS_DIR)) {
    if (!file.endsWith(".ts")) continue;
    const relativePath = path.join("src/lib/formula-governance/contracts", file);
    const content = fs.readFileSync(path.join(ROOT, relativePath), "utf8");

    for (const match of content.matchAll(/slug:\s*"([^"]+)"/g)) {
      if (!index.has(match[1])) {
        index.set(match[1], relativePath);
      }
    }
  }

  return index;
}

function buildLocatorIndex() {
  /** @type {Map<string, string>} */
  const index = new Map();

  for (const filePath of LOCATOR_FILES) {
    if (!fs.existsSync(filePath)) continue;
    const relativePath = path.relative(ROOT, filePath);
    const content = fs.readFileSync(filePath, "utf8");

    for (const match of content.matchAll(/slug:\s*"([^"]+)"/g)) {
      const slug = match[1];
      if (content.includes(`slug: "${slug}"`) && content.includes("productionEntry:")) {
        index.set(slug, relativePath);
      }
    }
  }

  return index;
}

function buildOracleIndex() {
  /** @type {Map<string, string>} */
  const index = new Map();

  for (const filePath of ORACLE_FILES) {
    if (!fs.existsSync(filePath)) continue;
    const relativePath = path.relative(ROOT, filePath);
    const content = fs.readFileSync(filePath, "utf8");

    for (const match of content.matchAll(/slug:\s*"([^"]+)"/g)) {
      if (!index.has(match[1])) {
        index.set(match[1], relativePath);
      }
    }
  }

  return index;
}

function buildPremiumSchemaI18nSlugs() {
  if (!fs.existsSync(PREMIUM_SCHEMA_I18N_FILE)) {
    return new Set();
  }

  const content = fs.readFileSync(PREMIUM_SCHEMA_I18N_FILE, "utf8");
  const slugs = new Set();

  for (const match of content.matchAll(/^\s+"([^"]+)":\s*\{/gm)) {
    slugs.add(match[1]);
  }

  return slugs;
}

function buildDedicatedTestIndex() {
  /** @type {Map<string, string[]>} */
  const index = new Map();
  const testRoots = [
    path.join(ROOT, "src/lib/premium-schema/__tests__"),
    path.join(ROOT, "src/lib/formula-governance/__tests__"),
  ];

  for (const testRoot of testRoots) {
    if (!fs.existsSync(testRoot)) continue;

    for (const file of fs.readdirSync(testRoot)) {
      if (!file.endsWith(".test.ts")) continue;
      const relativePath = path.relative(ROOT, path.join(testRoot, file));
      const content = fs.readFileSync(path.join(ROOT, relativePath), "utf8");
      const slugPattern = /"([a-z0-9][a-z0-9-]{2,})"/g;

      for (const match of content.matchAll(slugPattern)) {
        const slug = match[1];
        if (!slug.includes("-")) continue;
        const slugRegex = new RegExp(`["\`]${escapeRegExp(slug)}["\`]`);
        if (!slugRegex.test(content)) continue;
        const existing = index.get(slug) ?? [];
        if (!existing.includes(relativePath)) {
          existing.push(relativePath);
          index.set(slug, existing.sort());
        }
      }
    }
  }

  return index;
}

function buildToolMetaIndex() {
  /** @type {Map<string, { title: string, category: string }>} */
  const index = new Map();

  if (!fs.existsSync(INDEX_FILE)) {
    return index;
  }

  const payload = readJson(INDEX_FILE);

  for (const tool of payload.tools ?? []) {
    const title =
      typeof tool.title === "object"
        ? tool.title.en ?? tool.title.tr ?? tool.slug
        : tool.title ?? tool.slug;
    index.set(tool.slug, {
      title,
      category: tool.category ?? tool.sector ?? "",
    });
  }

  return index;
}

function inferToolClass(slug, tier, schemaMatched) {
  if (tier === "premium-schema" || schemaMatched) {
    return B_TECH_SCHEMA_SLUGS.test(slug) ? "B CLASS" : "A CLASS";
  }
  if (tier === "premium" && A_CLASS_KEYWORDS.test(slug)) {
    return "A CLASS";
  }
  if (tier === "premium") {
    return "B CLASS";
  }
  if (tier === "free") {
    return "C CLASS";
  }
  return "Unknown";
}

function hasFormulaRegistryMatch(schemaEntry, formulaRegistryIds, locatorMatched) {
  if (locatorMatched) {
    return true;
  }
  if (!schemaEntry || schemaEntry.formulaIds.length === 0) {
    return false;
  }
  return schemaEntry.formulaIds.every((formulaId) => formulaRegistryIds.has(formulaId));
}

function resolvePremiumSchemaValidationPath(slug) {
  const relativePath = path.join(
    "src/lib/premium-schema/calculators",
    `${slug}-validation.ts`,
  );
  if (fs.existsSync(path.join(ROOT, relativePath))) {
    return relativePath;
  }
  return null;
}

function resolveValidation(slug, schemaMatched, contractMatched, contractPath) {
  const premiumSchemaValidationPath = resolvePremiumSchemaValidationPath(slug);
  if (premiumSchemaValidationPath) {
    return { matched: true, path: premiumSchemaValidationPath };
  }

  if (slug === REFERENCE_SLUG && fs.existsSync(REFERENCE_VALIDATION_FILE)) {
    return {
      matched: true,
      path: REFERENCE_VALIDATION_REL,
    };
  }

  if (schemaMatched && contractMatched) {
    return { matched: true, path: contractPath };
  }
  if (schemaMatched) {
    return { matched: false, path: null };
  }
  if (contractMatched) {
    return { matched: true, path: contractPath };
  }
  return { matched: false, path: null };
}

function resolveTests(slug, schemaMatched, contractMatched, dedicatedTestIndex) {
  if (slug === REFERENCE_SLUG) {
    return {
      matched: fs.existsSync(REFERENCE_TEST_FILE),
      paths: fs.existsSync(REFERENCE_TEST_FILE) ? [REFERENCE_TEST_REL] : [],
    };
  }
  if (schemaMatched) {
    const paths = (dedicatedTestIndex.get(slug) ?? []).filter((filePath) =>
      filePath.includes(slug),
    );
    if (paths.length > 0) {
      return { matched: true, paths };
    }
    if (contractMatched) {
      return {
        matched: true,
        paths: dedicatedTestIndex.get(slug) ?? [],
      };
    }
    return { matched: false, paths: [] };
  }
  if (contractMatched) {
    return {
      matched: true,
      paths: dedicatedTestIndex.get(slug) ?? [],
    };
  }
  return { matched: false, paths: [] };
}

function resolveI18n(slug, schemaMatched) {
  if (slug === REFERENCE_SLUG) {
    const referenceLabels = fs.existsSync(REFERENCE_I18N_FILE);
    return {
      matched: referenceLabels,
      path: referenceLabels ? REFERENCE_I18N_REL : null,
    };
  }
  if (schemaMatched) {
    const premiumSchemaI18n = buildPremiumSchemaI18nSlugs();
    return {
      matched: premiumSchemaI18n.has(slug),
      path: premiumSchemaI18n.has(slug) ? PREMIUM_SCHEMA_I18N_REL : null,
    };
  }
  return { matched: false, path: null };
}

function resolveQuickDeep(schemaMatched, tier) {
  if (schemaMatched) {
    return { quick: true, deep: true };
  }
  if (tier === "free") {
    return { quick: true, deep: false };
  }
  return { quick: false, deep: false };
}

function hasRoute(routeStatus) {
  return routeStatus === "active-route";
}

function isFakeActive(routeStatus, backing) {
  return routeStatus === "active-route" && !backing;
}

function needsHumanReview(_slug, riskLevel) {
  return riskLevel === "regulated" || riskLevel === "safety-critical";
}

function listMissingRequirements(row) {
  const missing = [];

  if (row.toolClass === "A CLASS" || row.toolClass === "B CLASS" || row.toolClass === "C CLASS") {
    if (!row.hasFormulaContract && row.toolClass === "A CLASS") {
      missing.push("FormulaContract");
    }
    if (!row.hasFormulaContract && row.toolClass === "B CLASS") {
      missing.push("FormulaContract");
    }
    if (!row.hasFormulaContract && row.toolClass === "C CLASS") {
      missing.push("FormulaContract");
    }
    if (!row.hasValidation && row.toolClass !== "C CLASS") {
      missing.push("validation");
    }
    if (!row.hasTests && row.toolClass !== "C CLASS") {
      missing.push("tests");
    }
    if (!row.hasQuickResult && row.toolClass === "A CLASS") {
      missing.push("quick result UI");
    }
    if (!row.hasDeepReport && row.toolClass === "A CLASS") {
      missing.push("deep report UI");
    }
    if (!row.hasI18n && row.toolClass === "A CLASS") {
      missing.push("i18n");
    }
    if (!row.hasRoute) {
      missing.push("route");
    }
  }

  return missing.sort(
    (left, right) => UPGRADE_GAP_ORDER.indexOf(left) - UPGRADE_GAP_ORDER.indexOf(right),
  );
}

function meetsClassMinimum(row) {
  if (row.toolClass === "A CLASS") {
    return (
      row.hasFormulaContract &&
      row.hasValidation &&
      row.hasTests &&
      row.hasQuickResult &&
      row.hasDeepReport &&
      row.hasI18n &&
      row.hasRoute
    );
  }
  if (row.toolClass === "B CLASS") {
    return row.hasFormulaContract && row.hasValidation && row.hasTests && row.hasRoute;
  }
  if (row.toolClass === "C CLASS") {
    return row.hasFormulaContract && row.hasRoute;
  }
  return false;
}

function decideUpgrade(row) {
  const missing = listMissingRequirements(row);
  return {
    upgradeDecision: "UPGRADE",
    upgradeReason: missing.length > 0 ? `Missing: ${missing.join(", ")}` : "Below class quality bar",
  };
}

function buildToolRecord(scanTool, indexes) {
  const schemaEntry = indexes.schemaIndex.get(scanTool.slug);
  const schemaMatched = Boolean(schemaEntry);
  const contractPath = indexes.contractIndex.get(scanTool.slug) ?? null;
  const formulaContractMatched =
    scanTool.hasFormulaContract === true || contractPath !== null;
  const locatorMatched =
    scanTool.hasExistingFormulaExpression || indexes.locatorIndex.has(scanTool.slug);
  const locatorPath = indexes.locatorIndex.get(scanTool.slug) ?? null;
  const oracleMatched =
    indexes.oracleIndex.has(scanTool.slug) ||
    locatorMatched ||
    formulaContractMatched;
  const oraclePath = indexes.oracleIndex.get(scanTool.slug) ?? locatorPath ?? contractPath;
  const formulaRegistryMatched = hasFormulaRegistryMatch(
    schemaEntry,
    indexes.formulaRegistryIds,
    locatorMatched,
  );
  const validation = resolveValidation(
    scanTool.slug,
    schemaMatched,
    formulaContractMatched,
    contractPath,
  );
  const tests = resolveTests(
    scanTool.slug,
    schemaMatched,
    formulaContractMatched,
    indexes.dedicatedTestIndex,
  );
  const i18n = resolveI18n(scanTool.slug, schemaMatched);
  const quickDeep = resolveQuickDeep(schemaMatched, scanTool.tier);
  const meta = indexes.toolMeta.get(scanTool.slug) ?? { title: scanTool.slug, category: "" };
  const toolClass = inferToolClass(scanTool.slug, scanTool.tier, schemaMatched);
  const backing =
    schemaMatched ||
    formulaContractMatched ||
    locatorMatched ||
    formulaRegistryMatched;

  const row = {
    slug: scanTool.slug,
    title: meta.title,
    category: meta.category,
    tier: scanTool.tier,
    routeStatus: scanTool.routeStatus,
    toolClass,
    hasSchema: schemaMatched,
    hasFormulaRegistryEntry: formulaRegistryMatched,
    hasFormulaContract: formulaContractMatched,
    hasValidation: validation.matched,
    hasTests: tests.matched,
    hasOracle: oracleMatched,
    hasLocator: locatorMatched,
    hasQuickResult: quickDeep.quick,
    hasDeepReport: quickDeep.deep,
    hasI18n: i18n.matched,
    hasRoute: hasRoute(scanTool.routeStatus),
    hasExistingFormulaExpression: scanTool.hasExistingFormulaExpression,
    riskLevel: scanTool.riskLevel,
    evidence: {
      fromScanReport: true,
      schemaMatched,
      formulaRegistryMatched,
      formulaContractMatched,
      validationMatched: validation.matched,
      testsMatched: tests.matched,
      oracleMatched,
      locatorMatched,
      quickResultMatched: quickDeep.quick,
      deepReportMatched: quickDeep.deep,
      i18nMatched: i18n.matched,
    },
    evidencePaths: {},
  };

  if (schemaEntry?.path) {
    row.evidencePaths.schema = schemaEntry.path;
  }
  if (contractPath) {
    row.evidencePaths.contract = contractPath;
  }
  if (locatorMatched && locatorPath) {
    row.evidencePaths.locator = locatorPath;
  }
  if (oraclePath) {
    row.evidencePaths.oracle = oraclePath;
  }
  if (validation.path) {
    row.evidencePaths.validation = validation.path;
  }
  if (tests.paths.length > 0) {
    row.evidencePaths.tests = [...tests.paths].sort();
  }
  if (i18n.path) {
    row.evidencePaths.i18n = i18n.path;
  }

  if (
    scanTool.routeStatus === "category-only" ||
    scanTool.routeStatus === "missing-route"
  ) {
    row.upgradeDecision = "QUARANTINE";
    row.upgradeReason = "No active route (category-only or missing-route)";
    return row;
  }

  if (isFakeActive(scanTool.routeStatus, backing)) {
    row.upgradeDecision = "QUARANTINE";
    row.upgradeReason =
      "Active route without schema, FormulaContract, locator, or formula registry backing";
    return row;
  }

  if (needsHumanReview(scanTool.slug, scanTool.riskLevel)) {
    row.upgradeDecision = "HUMAN_REVIEW";
    row.upgradeReason = "Regulated or high-interpretation domain requires manual formula review";
    return row;
  }

  if (meetsClassMinimum(row)) {
    row.upgradeDecision = "PASS";
    row.upgradeReason = `Meets ${toolClass} minimum quality bar`;
    return row;
  }

  const upgrade = decideUpgrade(row);
  row.upgradeDecision = upgrade.upgradeDecision;
  row.upgradeReason = upgrade.upgradeReason;
  return row;
}

function summarizeTools(tools) {
  const toolClass = { A: 0, B: 0, C: 0, unknown: 0 };
  const upgradeDecision = { PASS: 0, UPGRADE: 0, HUMAN_REVIEW: 0, QUARANTINE: 0 };

  for (const tool of tools) {
    if (tool.toolClass === "A CLASS") toolClass.A += 1;
    else if (tool.toolClass === "B CLASS") toolClass.B += 1;
    else if (tool.toolClass === "C CLASS") toolClass.C += 1;
    else toolClass.unknown += 1;

    upgradeDecision[tool.upgradeDecision] += 1;
  }

  return {
    totalTools: tools.length,
    toolClass,
    upgradeDecision,
  };
}

function compareUpgradePriority(left, right) {
  if (left.hasFormulaContract !== right.hasFormulaContract) {
    return left.hasFormulaContract ? 1 : -1;
  }
  const leftMissing = listMissingRequirements(left).length;
  const rightMissing = listMissingRequirements(right).length;
  if (leftMissing !== rightMissing) {
    return leftMissing - rightMissing;
  }
  return left.slug.localeCompare(right.slug);
}

function buildTopLists(tools) {
  const upgradeCandidates = tools
    .filter((tool) => tool.toolClass === "A CLASS" && tool.upgradeDecision === "UPGRADE")
    .sort(compareUpgradePriority)
    .slice(0, 10)
    .map((tool) => tool.slug);

  const quarantineCandidates = tools
    .filter((tool) => tool.upgradeDecision === "QUARANTINE")
    .sort((left, right) => left.slug.localeCompare(right.slug))
    .slice(0, 10)
    .map((tool) => tool.slug);

  const humanReviewCandidates = tools
    .filter((tool) => tool.upgradeDecision === "HUMAN_REVIEW")
    .sort((left, right) => left.slug.localeCompare(right.slug))
    .slice(0, 10)
    .map((tool) => tool.slug);

  return {
    upgradeCandidates,
    quarantineCandidates,
    humanReviewCandidates,
  };
}

function buildReferenceCheck(referenceTool) {
  if (!referenceTool) {
    return {
      slug: REFERENCE_SLUG,
      upgradeDecision: "FAIL",
      hasFormulaContract: false,
      hasValidation: false,
      hasTests: false,
      hasQuickResult: false,
      hasDeepReport: false,
      hasI18n: false,
      passed: false,
      reason: "Reference tool missing from scan report",
    };
  }

  const passed =
    referenceTool.upgradeDecision === "PASS" &&
    referenceTool.hasFormulaContract &&
    referenceTool.hasValidation &&
    referenceTool.hasTests &&
    referenceTool.hasQuickResult &&
    referenceTool.hasDeepReport &&
    referenceTool.hasI18n;

  return {
    slug: referenceTool.slug,
    upgradeDecision: referenceTool.upgradeDecision,
    hasFormulaContract: referenceTool.hasFormulaContract,
    hasValidation: referenceTool.hasValidation,
    hasTests: referenceTool.hasTests,
    hasQuickResult: referenceTool.hasQuickResult,
    hasDeepReport: referenceTool.hasDeepReport,
    hasI18n: referenceTool.hasI18n,
    passed,
    reason: passed
      ? "P54 REV5 reference meets quality gate"
      : `Reference gate failed: ${referenceTool.upgradeReason}`,
  };
}

export function buildQualityScanReport() {
  if (!fs.existsSync(SCAN_REPORT_PATH)) {
    throw new Error(
      `Scan report missing. Run npm run scan:tool-activation first: ${SCAN_REPORT_PATH}`,
    );
  }

  const scanReport = readJson(SCAN_REPORT_PATH);
  const indexes = {
    schemaIndex: buildSchemaIndex(),
    formulaRegistryIds: buildFormulaRegistryIds(),
    contractIndex: buildContractIndex(),
    locatorIndex: buildLocatorIndex(),
    oracleIndex: buildOracleIndex(),
    dedicatedTestIndex: buildDedicatedTestIndex(),
    toolMeta: buildToolMetaIndex(),
  };

  const tools = (scanReport.tools ?? [])
    .map((scanTool) => buildToolRecord(scanTool, indexes))
    .sort((left, right) => left.slug.localeCompare(right.slug));

  const summary = summarizeTools(tools);
  const topLists = buildTopLists(tools);
  const referenceTool = tools.find((tool) => tool.slug === REFERENCE_SLUG) ?? null;
  const referenceCheck = buildReferenceCheck(referenceTool);

  return {
    generatedAt: new Date().toISOString(),
    sourceScanReport: path.relative(ROOT, SCAN_REPORT_PATH),
    selectedReferenceSlug: scanReport.selectedReferenceSlug ?? REFERENCE_SLUG,
    summary,
    referenceCheck,
    topLists,
    tools,
  };
}

export function formatQualityScanStdout(report) {
  return [
    "P55 quality backfill scan complete",
    `reference: ${report.referenceCheck.slug} → ${report.referenceCheck.upgradeDecision}`,
    `totalTools: ${report.summary.totalTools}`,
    `A/B/C: ${report.summary.toolClass.A}/${report.summary.toolClass.B}/${report.summary.toolClass.C}`,
    `PASS/UPGRADE/HUMAN_REVIEW/QUARANTINE: ${report.summary.upgradeDecision.PASS}/${report.summary.upgradeDecision.UPGRADE}/${report.summary.upgradeDecision.HUMAN_REVIEW}/${report.summary.upgradeDecision.QUARANTINE}`,
    `output: ${path.relative(ROOT, QUALITY_SCAN_REPORT_PATH)}`,
  ].join("\n");
}

export function assertReferenceGate(report) {
  if (!report.referenceCheck.passed) {
    throw new Error(report.referenceCheck.reason);
  }
}
