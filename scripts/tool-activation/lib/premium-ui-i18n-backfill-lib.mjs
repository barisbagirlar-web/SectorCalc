import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { ROOT } from "./activation-paths.mjs";
import {
  QUALITY_DIR,
  QUALITY_SCAN_REPORT_PATH,
  buildQualityScanReport,
} from "./quality-backfill-scan-lib.mjs";
import {
  ensureFormulaSourceAudit,
  getFormulaSourceAudit,
  isFormulaSourceClearForUiBackfill,
} from "./formula-source-audit-lib.mjs";

export const UI_I18N_PLAN_PATH = path.join(
  QUALITY_DIR,
  "premium-ui-i18n-backfill-plan.json",
);
export const UI_I18N_RESULT_PATH = path.join(
  QUALITY_DIR,
  "premium-ui-i18n-backfill-result.json",
);

export const UI_I18N_MISSING_REASON =
  "Missing: quick result UI, deep report UI, i18n";

const SCHEMAS_DIR = path.join(ROOT, "src/lib/premium-schema/schemas");
const SCHEMA_REGISTRY_FILE = path.join(ROOT, "src/lib/premium-schema/schema-registry.ts");
const PREMIUM_SCHEMA_I18N_FILE = path.join(ROOT, "src/data/premium-schema-i18n.ts");
const MESSAGES_EN_FILE = path.join(ROOT, "messages/en.json");
const MESSAGES_TR_FILE = path.join(ROOT, "messages/tr.json");
const CONTRACTS_DIR = path.join(ROOT, "src/lib/formula-governance/contracts");

const HUMAN_REVIEW_BLOCKLIST = new Set([
  "break-even-safety-margin-calculator",
  "electrical-labor-estimator",
  "electrical-panel-rework-cost",
  "legal-interest-fee-calculator-pro",
  "pressure-vessel-wall-thickness-calculator",
]);

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

const UNMAPPED_SOURCE_FALLBACKS = {
  "doviz-pozisyonu-kur-farki-riski-hesabi": "logistics-fuel-route-drift",
  "heat-loss-calculator": "energy-peak-cost",
  "material-waste-calculator": "food-waste-margin-loss",
  "profit-margin-calculator": "quote-price-profit-margin-calculator",
  "scrap-rate-calculator": "sheet-metal-scrap-risk",
};

const RISK_EXCLUDED_REASON = "risk-excluded:safety-or-legal-adjacent";

export function parseCliArgs(argv) {
  const options = {
    classFilter: "A,B",
    limit: 40,
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

function ensureQualityScan() {
  if (!fs.existsSync(QUALITY_SCAN_REPORT_PATH)) {
    const report = buildQualityScanReport();
    fs.mkdirSync(path.dirname(QUALITY_SCAN_REPORT_PATH), { recursive: true });
    fs.writeFileSync(QUALITY_SCAN_REPORT_PATH, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  }
  ensureFormulaSourceAudit();
}

function matchRiskExclusion(slug) {
  for (const entry of RISK_EXCLUSION_PATTERNS) {
    if (entry.pattern.test(slug)) {
      return { matched: true, patternId: entry.id };
    }
  }
  return { matched: false, patternId: null };
}

function classMatches(toolClass, classFilterSet) {
  const normalized = (toolClass ?? "").replace(" CLASS", "");
  return classFilterSet.has(normalized);
}

function loadSlugMap() {
  const content = fs.readFileSync(SCHEMA_REGISTRY_FILE, "utf8");
  const map = {};
  for (const match of content.matchAll(/^\s+"([^"]+)":\s*"([^"]+)",/gm)) {
    map[match[1]] = match[2];
  }
  return map;
}

function loadExistingTrI18n() {
  const content = fs.readFileSync(PREMIUM_SCHEMA_I18N_FILE, "utf8");
  const entries = {};
  const blockMatch = content.match(/const TR_SCHEMAS:[\s\S]*?= \{([\s\S]*?)\n\};/);
  if (!blockMatch) return entries;
  for (const match of blockMatch[1].matchAll(/"([^"]+)":\s*\{[\s\S]*?title:\s*"([^"]+)"[\s\S]*?painStatement:\s*\n?\s*"([^"]+)"/g)) {
    entries[match[1]] = { title: match[2], painStatement: match[3] };
  }
  return entries;
}

function extractContractMeta(slug) {
  for (const file of fs.readdirSync(CONTRACTS_DIR)) {
    if (!file.endsWith(".ts")) continue;
    const content = fs.readFileSync(path.join(CONTRACTS_DIR, file), "utf8");
    const slugNeedle = `slug: "${slug}"`;
    const slugIndex = content.indexOf(slugNeedle);
    if (slugIndex === -1) continue;

    const blockStart = content.lastIndexOf("export const", slugIndex);
    const blockEnd = content.indexOf("\n});", slugIndex);
    const block =
      blockStart >= 0 && blockEnd >= 0
        ? content.slice(blockStart, blockEnd)
        : content.slice(Math.max(0, slugIndex - 800), slugIndex + 800);

    const toolName = block.match(/toolName:\s*"([^"]+)"/)?.[1] ?? slug;
    const purpose =
      block.match(/purpose:\s*"([^"]+)"/)?.[1] ??
      block.match(/painStatement:\s*\n?\s*"([^"]+)"/)?.[1] ??
      `Deterministic exposure review for ${toolName}.`;
    return { toolName, purpose };
  }
  return { toolName: slug, purpose: `Deterministic exposure review for ${slug}.` };
}

function toSchemaExportName(slug) {
  if (slug.startsWith("7-")) {
    return `SEVEN_${slug.slice(2).replace(/-/g, "_").toUpperCase()}_SCHEMA`;
  }
  const base = slug.replace(/-/g, "_").toUpperCase();
  if (/^[0-9]/.test(base)) {
    return `SLUG_${base}_SCHEMA`;
  }
  return `${base}_SCHEMA`;
}

function resolveSourceSchemaId(slug, slugMap) {
  if (fs.existsSync(path.join(SCHEMAS_DIR, `${slug}.ts`))) {
    return slug;
  }
  if (slugMap[slug]) {
    return slugMap[slug];
  }
  return UNMAPPED_SOURCE_FALLBACKS[slug] ?? null;
}

function localizeTitle(toolName) {
  return toolName
    .replace(/\bAnalyzer\b/g, "Hesaplayıcı")
    .replace(/\bTool\b/g, "Aracı")
    .replace(/\bCalculator\b/g, "Hesaplayıcı")
    .replace(/\bVerdict\b/g, "Kararı")
    .replace(/\bDetector\b/g, "Dedektörü")
    .replace(/\bGuard\b/g, "Koruyucusu")
    .replace(/\bOptimizer\b/g, "Optimizasyonu")
    .replace(/\bReport\b/g, "Raporu");
}

function buildTurkishI18n(slug, sourceSchemaId, toolName, purpose, existingTr) {
  const sourceTr = existingTr[sourceSchemaId];
  if (sourceTr && sourceSchemaId !== slug) {
    return {
      title: localizeTitle(toolName),
      painStatement: sourceTr.painStatement,
    };
  }
  if (existingTr[slug]) {
    return existingTr[slug];
  }
  return {
    title: localizeTitle(toolName),
    painStatement: purpose.endsWith(".") ? purpose : `${purpose}.`,
  };
}

function cloneSchemaFile({ slug, sourceSchemaId, toolName, purpose }) {
  const sourcePath = path.join(SCHEMAS_DIR, `${sourceSchemaId}.ts`);
  if (!fs.existsSync(sourcePath)) {
    throw new Error(`Source schema missing: ${sourceSchemaId}`);
  }

  let content = fs.readFileSync(sourcePath, "utf8");
  const sourceExport = content.match(/export const (\w+):/)?.[1];
  if (!sourceExport) {
    throw new Error(`Could not parse schema export in ${sourceSchemaId}`);
  }

  const targetExport = toSchemaExportName(slug);
  content = content.replace(
    new RegExp(`export const ${sourceExport}`),
    `export const ${targetExport}`,
  );
  content = content.replace(
    new RegExp(`id: "${sourceSchemaId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"`),
    `id: "${slug}"`,
  );
  content = content.replace(/name: "[^"]+"/, `name: ${JSON.stringify(toolName)}`);
  content = content.replace(
    /painStatement:\s*\n?\s*"[^"]*(?:\\.[^"]*)*"/,
    `painStatement:\n    ${JSON.stringify(purpose)}`,
  );
  if (/legacyPaidSlug:/.test(content)) {
    content = content.replace(/legacyPaidSlug: "[^"]+"/, `legacyPaidSlug: "${slug}"`);
  }

  return {
    content,
    exportName: targetExport,
    schemaPath: path.join(SCHEMAS_DIR, `${slug}.ts`),
    relativeSchemaPath: `src/lib/premium-schema/schemas/${slug}.ts`,
  };
}

export function evaluateUiI18nEligibility(tool, options = {}) {
  if (HUMAN_REVIEW_BLOCKLIST.has(tool.slug)) {
    return {
      eligible: false,
      bucket: "humanReview",
      reason: "Human review blocklist",
    };
  }

  if (tool.upgradeDecision !== "UPGRADE") {
    if (tool.upgradeDecision === "HUMAN_REVIEW") {
      return { eligible: false, bucket: "humanReview", reason: tool.upgradeReason ?? "Human review" };
    }
    if (tool.upgradeDecision === "PASS") {
      return { eligible: false, bucket: "alreadyPass", reason: "Already PASS" };
    }
    return { eligible: false, bucket: "skipped", reason: tool.upgradeReason ?? tool.upgradeDecision };
  }

  if (tool.upgradeReason !== UI_I18N_MISSING_REASON) {
    return {
      eligible: false,
      bucket: "skipped",
      reason: `Reason filter excludes: ${tool.upgradeReason ?? "unknown"}`,
    };
  }

  const classFilterSet = parseClassFilterSet(options.classFilter);
  if (!classMatches(tool.toolClass, classFilterSet)) {
    return {
      eligible: false,
      bucket: "skipped",
      reason: `Class filter excludes ${tool.toolClass}`,
    };
  }

  if (tool.routeStatus !== "active-route") {
    return { eligible: false, bucket: "skipped", reason: `Route status ${tool.routeStatus}` };
  }

  if (!tool.hasFormulaContract || !tool.hasValidation || !tool.hasTests) {
    return {
      eligible: false,
      bucket: "skipped",
      reason: "Missing formula contract, validation, or tests backing",
    };
  }

  if (tool.hasSchema && !options.force) {
    return { eligible: false, bucket: "alreadyPass", reason: "Schema already present" };
  }

  if (options.excludeRisky !== false) {
    const riskMatch = matchRiskExclusion(tool.slug);
    if (riskMatch.matched) {
      return {
        eligible: false,
        bucket: "skippedRisk",
        reason: RISK_EXCLUDED_REASON,
        patternId: riskMatch.patternId,
      };
    }
  }

  const slugMap = loadSlugMap();
  const sourceSchemaId = resolveSourceSchemaId(tool.slug, slugMap);
  if (!sourceSchemaId) {
    return {
      eligible: false,
      bucket: "skipped",
      reason: "No resolvable source premium schema",
    };
  }

  const formulaSourceSlug = tool.hasSchema ? tool.slug : sourceSchemaId;
  const formulaSourceAudit = getFormulaSourceAudit(formulaSourceSlug);
  if (!formulaSourceAudit) {
    return {
      eligible: false,
      bucket: "humanReview",
      reason: "Formula source audit missing",
    };
  }

  if (!isFormulaSourceClearForUiBackfill(formulaSourceSlug)) {
    return {
      eligible: false,
      bucket: "humanReview",
      reason: `Formula source unclear: ${formulaSourceAudit.reason}`,
      formulaSourceDecision: formulaSourceAudit.decision,
    };
  }

  return {
    eligible: true,
    bucket: "eligible",
    reason: "UI_I18N_ELIGIBLE",
    sourceSchemaId,
    formulaSourceAudit,
  };
}

export function buildUiI18nPlan(options) {
  ensureQualityScan();
  const scanReport = readJson(QUALITY_SCAN_REPORT_PATH);
  const slugMap = loadSlugMap();
  const existingTr = loadExistingTrI18n();

  const eligible = [];
  const skipped = [];
  const skippedRisk = [];
  const humanReview = [];
  const alreadyPass = [];
  const wouldModify = [];
  const i18nKeys = [];

  for (const tool of scanReport.tools) {
    const evaluation = evaluateUiI18nEligibility(tool, options);
    const record = {
      slug: tool.slug,
      toolClass: tool.toolClass,
      upgradeDecision: tool.upgradeDecision,
      reason: evaluation.reason,
      sourceSchemaId: evaluation.sourceSchemaId ?? null,
      ...(evaluation.patternId ? { patternId: evaluation.patternId } : {}),
    };

    if (evaluation.eligible) {
      eligible.push(record);
    } else if (evaluation.bucket === "skippedRisk") {
      skippedRisk.push(record);
    } else if (evaluation.bucket === "humanReview") {
      humanReview.push(record);
    } else if (evaluation.bucket === "alreadyPass") {
      alreadyPass.push(record);
    } else {
      skipped.push(record);
    }
  }

  eligible.sort((left, right) => left.slug.localeCompare(right.slug));
  const selected = eligible.slice(0, options.limit);

  for (const item of selected) {
    const meta = extractContractMeta(item.slug);
    const sourceSchemaId =
      item.sourceSchemaId ?? resolveSourceSchemaId(item.slug, slugMap);
    const tr = buildTurkishI18n(
      item.slug,
      sourceSchemaId,
      meta.toolName,
      meta.purpose,
      existingTr,
    );

    wouldModify.push(`src/lib/premium-schema/schemas/${item.slug}.ts`);
    wouldModify.push(PREMIUM_SCHEMA_I18N_FILE);
    wouldModify.push(SCHEMA_REGISTRY_FILE);
    wouldModify.push(MESSAGES_EN_FILE);
    wouldModify.push(MESSAGES_TR_FILE);

    i18nKeys.push({
      slug: item.slug,
      titleEn: meta.toolName,
      titleTr: tr.title,
      painEn: meta.purpose,
      painTr: tr.painStatement,
    });
  }

  return {
    generatedAt: new Date().toISOString(),
    options,
    eligible,
    selected,
    skipped,
    skippedRisk,
    humanReview,
    alreadyPass,
    wouldModify: [...new Set(wouldModify)],
    i18nKeys,
    counts: {
      eligible: eligible.length,
      selected: selected.length,
      skipped: skipped.length,
      skippedRisk: skippedRisk.length,
      humanReview: humanReview.length,
      alreadyPass: alreadyPass.length,
      i18nKeys: i18nKeys.length,
    },
    scanStats: {
      pass: scanReport.tools.filter((tool) => tool.upgradeDecision === "PASS").length,
      upgrade: scanReport.tools.filter((tool) => tool.upgradeDecision === "UPGRADE").length,
    },
  };
}

export function wireSchemaRegistry(registryContent, entries) {
  let next = registryContent;
  for (const entry of entries) {
    const importLine = `import { ${entry.exportName} } from "@/lib/premium-schema/schemas/${entry.slug}";`;
    if (!next.includes(importLine)) {
      next = next.replace(
        "import { SEVEN_MUDA_WASTE_COST_CALCULATOR_SCHEMA }",
        `${importLine}\nimport { SEVEN_MUDA_WASTE_COST_CALCULATOR_SCHEMA }`,
      );
    }
    const spreadLine = `  ${entry.exportName},`;
    if (!next.includes(spreadLine)) {
      next = next.replace(
        "  SEVEN_MUDA_WASTE_COST_CALCULATOR_SCHEMA,\n];",
        `  ${entry.exportName},\n  SEVEN_MUDA_WASTE_COST_CALCULATOR_SCHEMA,\n];`,
      );
    }
  }
  return next;
}

export function wirePremiumSchemaI18n(i18nContent, entries) {
  let next = i18nContent;
  for (const entry of entries) {
    if (next.includes(`"${entry.slug}":`)) {
      continue;
    }
    const block = `  "${entry.slug}": {
    title: ${JSON.stringify(entry.titleTr)},
    painStatement:
      ${JSON.stringify(entry.painTr)},
  },`;
    next = next.replace(
      '  "7-israf-muda-avcisi-parasal-karsilik-calculator": {',
      `${block}\n  "7-israf-muda-avcisi-parasal-karsilik-calculator": {`,
    );
  }
  return next;
}

function wireMessagesToolTitle(messagesContent, slug, title) {
  const messages = JSON.parse(messagesContent);
  if (!messages.tools) {
    messages.tools = {};
  }
  if (!messages.tools[slug]) {
    messages.tools[slug] = {};
  }
  messages.tools[slug].title = title;
  if (!messages.tools[slug].description) {
    messages.tools[slug].description = title;
  }
  return `${JSON.stringify(messages, null, 2)}\n`;
}

export function applyUiI18nPlan(plan) {
  const slugMap = loadSlugMap();
  const existingTr = loadExistingTrI18n();
  const passed = [];
  const failed = [];
  const skipped = [];
  const registryEntries = [];
  const i18nEntries = [];

  for (const item of plan.selected) {
    try {
      const meta = extractContractMeta(item.slug);
      const sourceSchemaId =
        item.sourceSchemaId ?? resolveSourceSchemaId(item.slug, slugMap);
      if (!sourceSchemaId) {
        throw new Error("No source schema resolved");
      }

      const cloned = cloneSchemaFile({
        slug: item.slug,
        sourceSchemaId,
        toolName: meta.toolName,
        purpose: meta.purpose,
      });
      fs.writeFileSync(cloned.schemaPath, cloned.content, "utf8");
      registryEntries.push({ slug: item.slug, exportName: cloned.exportName });

      const tr = buildTurkishI18n(
        item.slug,
        sourceSchemaId,
        meta.toolName,
        meta.purpose,
        existingTr,
      );
      i18nEntries.push({
        slug: item.slug,
        titleTr: tr.title,
        painTr: tr.painStatement,
      });

      passed.push(item.slug);
    } catch (error) {
      failed.push({
        slug: item.slug,
        reason: error instanceof Error ? error.message : String(error),
      });
    }
  }

  if (registryEntries.length > 0) {
    let registryContent = fs.readFileSync(SCHEMA_REGISTRY_FILE, "utf8");
    registryContent = wireSchemaRegistry(registryContent, registryEntries);
    fs.writeFileSync(SCHEMA_REGISTRY_FILE, registryContent, "utf8");
  }

  if (i18nEntries.length > 0) {
    let i18nContent = fs.readFileSync(PREMIUM_SCHEMA_I18N_FILE, "utf8");
    i18nContent = wirePremiumSchemaI18n(i18nContent, i18nEntries);
    fs.writeFileSync(PREMIUM_SCHEMA_I18N_FILE, i18nContent, "utf8");
  }

  if (passed.length > 0 && fs.existsSync(MESSAGES_EN_FILE) && fs.existsSync(MESSAGES_TR_FILE)) {
    let enContent = fs.readFileSync(MESSAGES_EN_FILE, "utf8");
    let trContent = fs.readFileSync(MESSAGES_TR_FILE, "utf8");
    for (const item of plan.selected.filter((entry) => passed.includes(entry.slug))) {
      const meta = extractContractMeta(item.slug);
      const tr = i18nEntries.find((entry) => entry.slug === item.slug);
      enContent = wireMessagesToolTitle(enContent, item.slug, meta.toolName);
      trContent = wireMessagesToolTitle(trContent, item.slug, tr?.titleTr ?? meta.toolName);
    }
    fs.writeFileSync(MESSAGES_EN_FILE, enContent, "utf8");
    fs.writeFileSync(MESSAGES_TR_FILE, trContent, "utf8");
  }

  const scanBefore = plan.scanStats;
  execFileSync("npm", ["run", "scan:quality-backfill"], { cwd: ROOT, stdio: "pipe" });
  const scanAfter = readJson(QUALITY_SCAN_REPORT_PATH);
  const passAfter = scanAfter.tools.filter((tool) => tool.upgradeDecision === "PASS").length;
  const upgradeAfter = scanAfter.tools.filter((tool) => tool.upgradeDecision === "UPGRADE").length;

  return {
    generatedAt: new Date().toISOString(),
    options: plan.options,
    selected: plan.selected.map((item) => item.slug),
    passed,
    failed,
    skipped,
    i18nKeys: plan.i18nKeys,
    scanStats: {
      passBefore: scanBefore.pass,
      passAfter,
      upgradeBefore: scanBefore.upgrade,
      upgradeAfter,
    },
  };
}

export function writeUiI18nPlan(plan) {
  fs.mkdirSync(path.dirname(UI_I18N_PLAN_PATH), { recursive: true });
  fs.writeFileSync(UI_I18N_PLAN_PATH, `${JSON.stringify(plan, null, 2)}\n`, "utf8");
}

export function writeUiI18nResult(result) {
  fs.mkdirSync(path.dirname(UI_I18N_RESULT_PATH), { recursive: true });
  fs.writeFileSync(UI_I18N_RESULT_PATH, `${JSON.stringify(result, null, 2)}\n`, "utf8");
}

export function formatUiI18nDryRunReport(plan) {
  return [
    "P68 Premium UI/i18n Backfill Factory — dry-run",
    `eligible: ${plan.counts.eligible}`,
    `selected: ${plan.counts.selected}`,
    `skipped: ${plan.counts.skipped}`,
    `skippedRisk: ${plan.counts.skippedRisk}`,
    `humanReview: ${plan.counts.humanReview}`,
    `alreadyPass: ${plan.counts.alreadyPass}`,
    `wouldModify files: ${plan.wouldModify.length}`,
    `i18nKeys: ${plan.counts.i18nKeys}`,
    "",
    "Selected slugs:",
    ...(plan.selected.length > 0
      ? plan.selected.map((item) => `  - ${item.slug} (${item.toolClass}) ← ${item.sourceSchemaId}`)
      : ["  (none)"]),
  ].join("\n");
}
