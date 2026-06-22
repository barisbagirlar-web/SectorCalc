import fs from "node:fs";
import path from "node:path";
import { ROOT } from "./activation-paths.mjs";
import { hasFormulaContract, inferRiskLevel } from "./activation-scan-lib.mjs";

export const P24_REPORT_PATH = path.join(ROOT, "scripts/.cache/p24-tool-quality-report.json");

const INDEX_FILE = path.join(ROOT, "public/ai-tool-index.json");
const SCHEMAS_DIR = path.join(ROOT, "src/lib/premium-schema/schemas");
const CONTRACTS_DIR = path.join(ROOT, "src/lib/formula-governance/contracts");
const FORMULA_REGISTRY_FILE = path.join(ROOT, "src/lib/premium-schema/formula-registry.ts");
const PREMIUM_SCHEMA_I18N_FILE = path.join(ROOT, "src/lib/premium-schema/premium-schema-i18n.ts");
const FREE_TRAFFIC_CALC_FILE = path.join(ROOT, "src/lib/tools/free-traffic-calculators.ts");
const REGISTRY_FILE = path.join(ROOT, "src/lib/calculators/registry.ts");
const REVENUE_FILES = [
  path.join(ROOT, "src/lib/tools/revenue-tools.ts"),
  path.join(ROOT, "src/lib/tools/revenue-tools-phase2.ts"),
  path.join(ROOT, "src/lib/tools/revenue-tools-additional.ts"),
];
const SCENARIO_HANDLER_FILES = fs
  .readdirSync(path.join(ROOT, "src/lib/formula-governance"))
  .filter((name) => name.startsWith("scenario-handlers") && name.endsWith(".ts"))
  .map((name) => path.join(ROOT, "src/lib/formula-governance", name));
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
];
const LOCALE_FILES = {
  en: path.join(ROOT, "messages/en.json"),
  tr: path.join(ROOT, "messages/tr.json"),
  de: path.join(ROOT, "messages/de.json"),
  fr: path.join(ROOT, "messages/fr.json"),
  es: path.join(ROOT, "messages/es.json"),
  ar: path.join(ROOT, "messages/ar.json"),
};

const LONG_LABEL_THRESHOLD = 45;
const STANDARD_UNITS = new Set([
  "USD",
  "EUR",
  "TRY",
  "hours",
  "hour",
  "minutes",
  "minute",
  "days",
  "day",
  "m²",
  "m2",
  "ft²",
  "ft2",
  "kg",
  "lb",
  "lbs",
  "kWh",
  "kwh",
  "kW",
  "kw",
  "bar",
  "Pa",
  "MPa",
  "percent",
  "%",
  "USD/hour",
  "value",
  "ratio",
  "units",
  "unit",
  "hours/year",
  "m³",
  "m3",
  "L",
  "gal",
  "tonnes",
  "tCO2e",
  "pieces",
  "qty",
  "count",
  "hectare",
]);

const CHECK_IDS = [
  "purposeClear",
  "requiredInputs",
  "optionalInputs",
  "inputTypes",
  "unitMapping",
  "canonicalUnit",
  "formulaContractAlignment",
  "resultSchema",
  "resultCard",
  "validation",
  "boundaryTests",
  "scenarioTests",
  "oracleTests",
  "globalSanityTests",
  "sectorRealityTests",
  "localeKeys",
  "mobile375",
  "longLabels",
  "arRtl",
  "freePremiumSplit",
];

function textValue(value) {
  if (typeof value === "string") return value;
  if (value && typeof value === "object") {
    return value.en ?? value.tr ?? Object.values(value).find((entry) => typeof entry === "string") ?? "";
  }
  return "";
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function readText(relativePath) {
  const absolute = path.join(ROOT, relativePath);
  if (!fs.existsSync(absolute)) return "";
  return fs.readFileSync(absolute, "utf8");
}

function buildSchemaIndex() {
  /** @type {Map<string, { path: string, inputs: object[], outputs: object[], painStatement: string }>} */
  const index = new Map();
  if (!fs.existsSync(SCHEMAS_DIR)) return index;

  for (const file of fs.readdirSync(SCHEMAS_DIR)) {
    if (!file.endsWith(".ts")) continue;
    const absolutePath = path.join(SCHEMAS_DIR, file);
    const content = fs.readFileSync(absolutePath, "utf8");
    const idMatch = content.match(/\bid:\s*"([^"]+)"/);
    if (!idMatch) continue;

    const slug = idMatch[1];
    const inputsBlock = content.match(/inputs:\s*\[([\s\S]*?)\]\s*,\s*outputs:/);
    const outputsBlock = content.match(/outputs:\s*\[([\s\S]*?)\]\s*,/);
    const painMatch = content.match(/painStatement:\s*\n?\s*"([^"]+)"/);

    const inputs = [];
    if (inputsBlock) {
      for (const block of inputsBlock[1].split(/\{\s*\n/).slice(1)) {
        const id = block.match(/id:\s*"([^"]+)"/)?.[1];
        if (!id) continue;
        inputs.push({
          id,
          label: block.match(/label:\s*"([^"]+)"/)?.[1] ?? "",
          type: block.match(/type:\s*"([^"]+)"/)?.[1] ?? "unknown",
          unit: block.match(/unit:\s*"([^"]+)"/)?.[1] ?? "",
          required: /required:\s*true/.test(block),
          optional: /required:\s*false/.test(block),
          helper: block.match(/helper:\s*"([^"]+)"/)?.[1] ?? "",
        });
      }
    }

    const outputs = [];
    if (outputsBlock) {
      for (const id of outputsBlock[1].matchAll(/id:\s*"([^"]+)"/g)) {
        outputs.push({ id: id[1] });
      }
    }

    index.set(slug, {
      path: path.relative(ROOT, absolutePath),
      inputs,
      outputs,
      painStatement: painMatch?.[1] ?? "",
    });
  }

  return index;
}

function buildContractIndex() {
  /** @type {Map<string, { path: string, requiredInputs: string[], scenarioSpecs: string[], scenarioTests: string[] }>} */
  const index = new Map();
  const sources = [];

  if (fs.existsSync(CONTRACTS_DIR)) {
    for (const file of fs.readdirSync(CONTRACTS_DIR)) {
      if (file.endsWith(".ts")) sources.push(path.join(CONTRACTS_DIR, file));
    }
  }
  const rootContract = path.join(ROOT, "src/lib/formula-governance/contracts.ts");
  if (fs.existsSync(rootContract)) sources.push(rootContract);

  for (const filePath of sources) {
    const content = fs.readFileSync(filePath, "utf8");
    const relativePath = path.relative(ROOT, filePath);

    for (const slugMatch of content.matchAll(/slug:\s*"([^"]+)"/g)) {
      const slug = slugMatch[1];
      if (index.has(slug)) continue;

      const slugIdx = content.indexOf(`slug: "${slug}"`);
      const slice = content.slice(slugIdx, slugIdx + 6000);
      const requiredInputs = [
        ...slice.matchAll(/requiredInputs:\s*\[([\s\S]*?)\]/g),
      ].flatMap((match) => [...match[1].matchAll(/"([^"]+)"/g)].map((m) => m[1]));
      const criticalInputs = [
        ...slice.matchAll(/criticalInputs:\s*\[([\s\S]*?)\]/g),
      ].flatMap((match) => [...match[1].matchAll(/"([^"]+)"/g)].map((m) => m[1]));
      const scenarioSpecs = [...slice.matchAll(/scenarioSpecs:\s*\[([\s\S]*?)\]/g)].flatMap(
        (match) => [...match[1].matchAll(/id:\s*"([^"]+)"/g)].map((m) => m[1]),
      );
      const scenarioTests = [...slice.matchAll(/scenarioTests:\s*\[([\s\S]*?)\]/g)].flatMap(
        (match) => [...match[1].matchAll(/id:\s*"([^"]+)"/g)].map((m) => m[1]),
      );

      index.set(slug, {
        path: relativePath,
        requiredInputs: [...new Set([...requiredInputs, ...criticalInputs])],
        scenarioSpecs,
        scenarioTests,
      });
    }
  }

  return index;
}

function buildSlugSetFromFiles(files, pattern) {
  const slugs = new Set();
  for (const filePath of files) {
    if (!fs.existsSync(filePath)) continue;
    const content = fs.readFileSync(filePath, "utf8");
    for (const match of content.matchAll(pattern)) {
      slugs.add(match[1]);
    }
  }
  return slugs;
}

function buildScenarioHandlerIndex() {
  /** @type {Set<string>} */
  const slugs = new Set();
  for (const filePath of SCENARIO_HANDLER_FILES) {
    const content = fs.readFileSync(filePath, "utf8");
    for (const match of content.matchAll(/^\s+"([a-z0-9][a-z0-9-]+)":\s*\{/gm)) {
      slugs.add(match[1]);
    }
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
      for (const match of content.matchAll(/"([a-z0-9][a-z0-9-]{2,})"/g)) {
        const slug = match[1];
        if (!slug.includes("-")) continue;
        const existing = index.get(slug) ?? [];
        if (!existing.includes(relativePath)) {
          existing.push(relativePath);
          index.set(slug, existing);
        }
      }
    }
  }
  return index;
}

function buildRevenuePairs() {
  /** @type {Map<string, string>} */
  const freeToPaid = new Map();
  /** @type {Map<string, string>} */
  const paidToFree = new Map();

  for (const filePath of REVENUE_FILES) {
    const content = fs.readFileSync(filePath, "utf8");
    for (const block of content.split(/(?=freeSlug:\s*")/)) {
      const freeSlug = block.match(/freeSlug:\s*"([^"]+)"/)?.[1];
      const paidSlug = block.match(/paidSlug:\s*"([^"]+)"/)?.[1];
      if (freeSlug && paidSlug) {
        freeToPaid.set(freeSlug, paidSlug);
        paidToFree.set(paidSlug, freeSlug);
      }
    }
  }

  return { freeToPaid, paidToFree };
}

function buildLegacyCalculatorSlugs() {
  const content = readText("src/lib/calculators/registry.ts");
  const slugs = new Set();
  for (const match of content.matchAll(/case\s+"([a-z0-9-]+)":/g)) {
    slugs.add(match[1]);
  }
  return slugs;
}

function buildFreeCalculatorSlugs() {
  const slugs = new Set();
  const files = [
    "src/lib/tools/free-traffic-calculators.ts",
    "src/lib/tools/p77-batch-b-free-calculators.ts",
    "src/lib/tools/free-sector-calculations.ts",
  ];
  for (const relativePath of files) {
    const content = readText(relativePath);
    for (const match of content.matchAll(/case\s+"([a-z0-9-]+)"/g)) {
      slugs.add(match[1]);
    }
    for (const match of content.matchAll(/^\s+"([a-z0-9-]+)":\s*\(/gm)) {
      slugs.add(match[1]);
    }
  }
  const batch1Content = readText("src/lib/tools/roadmap-free-batch1-specs.generated.ts");
  if (batch1Content) {
    for (const match of batch1Content.matchAll(/^\s+"([a-z0-9-]+)":\s*\{/gm)) {
      slugs.add(match[1]);
    }
  }
  return slugs;
}

function buildPremiumSchemaI18nSlugs() {
  const content = readText("src/data/premium-schema-i18n.ts");
  const slugs = new Set();
  for (const match of content.matchAll(/^\s+"([^"]+)":\s*\{/gm)) {
    slugs.add(match[1]);
  }
  return slugs;
}

function buildLocalePremiumKeys() {
  /** @type {Record<string, Set<string>>} */
  const byLocale = {};
  for (const [locale, filePath] of Object.entries(LOCALE_FILES)) {
    if (!fs.existsSync(filePath)) {
      byLocale[locale] = new Set();
      continue;
    }
    const payload = readJson(filePath);
    const inputs = payload?.freeToolInputs ?? {};
    byLocale[locale] = new Set(Object.keys(inputs));
  }
  return byLocale;
}

function loadPremiumSchemaSlugMap() {
  const content = readText("src/lib/premium-schema/schema-registry.ts");
  if (!content) {
    return {};
  }

  const blockMatch = content.match(
    /PREMIUM_SCHEMA_SLUG_MAP[^=]*=\s*\{([\s\S]*?)\}\s*(?:as const|satisfies|;)/,
  );
  if (!blockMatch) {
    return {};
  }

  /** @type {Record<string, string>} */
  const map = {};
  for (const match of blockMatch[1].matchAll(/"([^"]+)":\s*"([^"]+)"/g)) {
    map[match[1]] = match[2];
  }
  return map;
}

function resolveValidationSlug(slug) {
  const map = loadPremiumSchemaSlugMap();
  return map[slug] ?? slug;
}

function buildValidationIndex() {
  /** @type {Set<string>} */
  const slugs = new Set();
  const dir = path.join(ROOT, "src/lib/premium-schema/calculators");
  if (!fs.existsSync(dir)) return slugs;

  const aliasSlugs = {
    "seven-muda-waste-validation.ts": "7-israf-muda-avcisi-parasal-karsilik-calculator",
  };

  for (const file of fs.readdirSync(dir)) {
    const match = file.match(/^(.+)-validation\.ts$/);
    if (!match) continue;
    if (aliasSlugs[file]) {
      slugs.add(aliasSlugs[file]);
      continue;
    }
    slugs.add(match[1]);
  }

  for (const [paidSlug, schemaId] of Object.entries(loadPremiumSchemaSlugMap())) {
    if (slugs.has(schemaId)) {
      slugs.add(paidSlug);
    }
  }

  return slugs;
}

function resolveValidationFile(slug) {
  const canonical = resolveValidationSlug(slug);
  const candidates = [
    `src/lib/premium-schema/calculators/${canonical}-validation.ts`,
    `src/lib/premium-schema/calculators/${slug}-validation.ts`,
  ];
  for (const relativePath of candidates) {
    if (readText(relativePath)) {
      return relativePath;
    }
  }
  if (slug === "7-israf-muda-avcisi-parasal-karsilik-calculator") {
    return "src/lib/premium-schema/calculators/seven-muda-waste-validation.ts";
  }
  return candidates[0];
}

function readValidationInputKeys(slug) {
  const relativePath = resolveValidationFile(slug);
  const content = readText(relativePath);
  if (!content) return [];
  const keys = new Set();
  for (const match of content.matchAll(/[A-Z0-9_]*INPUT_KEYS[^=]*=\s*\[([\s\S]*?)\]\s*(?:as\s*const)?;/g)) {
    for (const keyMatch of match[1].matchAll(/"([^"]+)"/g)) {
      keys.add(keyMatch[1]);
    }
  }
  return [...keys];
}

function buildGlobalUxSignals() {
  const designCraft = readText("src/styles/design-craft.css");
  const localeLayout = readText("src/components/layout/LocaleDocumentLayout.tsx");
  return {
    mobileFormFirstCss: designCraft.includes("P80: calculator form UX"),
    fixedSubmitBarCss:
      designCraft.includes("position: fixed") &&
      designCraft.includes("sc-industrial-form-actions"),
    overflowGuardCss: localeLayout.includes("overflow-x-hidden"),
    rtlLayoutFile: fs.existsSync(path.join(ROOT, "src/components/layout/LocaleDocumentLayout.tsx")),
    rtlDirSupport: localeLayout.includes("dir={") || localeLayout.includes('dir="rtl"'),
  };
}

function collectInventory(index) {
  const payload = readJson(INDEX_FILE);
  /** @type {Map<string, object>} */
  const byKey = new Map();

  for (const tool of payload.tools ?? []) {
    const key = `${tool.tier}:${tool.slug}`;
    byKey.set(key, {
      slug: tool.slug,
      tier: tool.tier ?? "unknown",
      family: normalizeFamily(tool.tier, tool.routeStatus),
      routeStatus: tool.routeStatus ?? "unknown",
      routePath: tool.routePath ?? "",
      title:
        typeof tool.title === "object"
          ? tool.title.en ?? tool.title.tr ?? tool.slug
          : tool.title ?? tool.slug,
      description: textValue(tool.summary ?? tool.description),
      category: tool.categorySlug ?? tool.sector ?? "",
      source: "ai-tool-index",
    });
  }

  for (const slug of index.legacyCalculatorSlugs) {
    const key = `legacy:${slug}`;
    if (byKey.has(key)) continue;
    byKey.set(key, {
      slug,
      tier: "legacy",
      family: "legacy",
      routeStatus: "active-route",
      routePath: `/tools/free/${slug}`,
      title: slug,
      description: "",
      category: "legacy-calculator",
      source: "calculator-registry",
    });
  }

  return [...byKey.values()].sort((a, b) =>
    `${a.tier}:${a.slug}`.localeCompare(`${b.tier}:${b.slug}`),
  );
}

function normalizeFamily(tier, routeStatus) {
  if (tier === "premium-schema") return "premium-schema";
  if (tier === "premium") return "premium";
  if (tier === "free") return "free";
  if (tier === "legacy") return "legacy";
  if (routeStatus === "category-only") return "catalog-stub";
  return tier ?? "unknown";
}

function addFinding(findings, checkId, severity, message, evidence = {}) {
  findings.push({ checkId, severity, message, evidence });
}

function isActiveTool(tool) {
  return tool.routeStatus === "active-route";
}

function hasCalculatorImplementation(slug, index) {
  if (index.freeTrafficCalculatorSlugs.has(slug)) return true;
  if (index.revenuePairs.freeToPaid.has(slug)) return true;
  if (index.legacyCalculatorSlugs.has(slug)) return true;
  if (slug.endsWith("-check") && index.freeTrafficCalculatorSlugs.has(slug.replace(/-check$/, "-calculator"))) {
    return true;
  }
  if (slug.endsWith("-cost-check") && index.freeTrafficCalculatorSlugs.has(slug.replace(/-cost-check$/, "-calculator"))) {
    return true;
  }
  if (slug.endsWith("-m2") && index.freeTrafficCalculatorSlugs.has(`${slug}-calculator`)) {
    return true;
  }
  return false;
}

function auditTool(tool, index) {
  const findings = [];
  const schema = index.schemaIndex.get(tool.slug);
  const contract = index.contractIndex.get(tool.slug);
  const hasContract = hasFormulaContract(tool.slug) || Boolean(contract);
  const hasValidation = index.validationSlugs.has(tool.slug);
  const hasOracle =
    index.oracleSlugs.has(tool.slug) ||
    index.locatorSlugs.has(tool.slug) ||
    hasContract;
  const hasScenarioHandlers = index.scenarioHandlerSlugs.has(tool.slug);
  const dedicatedTests = index.dedicatedTestIndex.get(tool.slug) ?? [];
  const backing =
    Boolean(schema) ||
    hasContract ||
    index.locatorSlugs.has(tool.slug) ||
    hasCalculatorImplementation(tool.slug, index) ||
    index.legacyCalculatorSlugs.has(tool.slug);

  if (!isActiveTool(tool)) {
    addFinding(findings, "purposeClear", "quarantine", "No active route — catalog stub only.", {
      routeStatus: tool.routeStatus,
    });
    return finalizeTool(tool, findings, { schema, contract, backing });
  }

  if (isActiveTool(tool) && !backing) {
    addFinding(
      findings,
      "formulaContractAlignment",
      "quarantine",
      "Active route without schema, contract, locator, or calculator backing.",
    );
  }

  const purposeText = (textValue(tool.description) || schema?.painStatement || "").trim();
  if (purposeText.length < 24) {
    addFinding(findings, "purposeClear", "warn", "Tool purpose/description is missing or too short.");
  } else {
    addFinding(findings, "purposeClear", "pass", "Purpose/description present.");
  }

  if (schema) {
    const required = schema.inputs.filter((input) => input.required);
    if (required.length === 0) {
      addFinding(findings, "requiredInputs", "fail", "Premium-schema schema has no required inputs.");
    } else {
      addFinding(findings, "requiredInputs", "pass", `${required.length} required input(s) defined.`);
    }

    const optional = schema.inputs.filter((input) => input.optional || !input.required);
    const optionalWithoutHelper = optional.filter((input) => !input.helper);
    if (optionalWithoutHelper.length > 2) {
      addFinding(
        findings,
        "optionalInputs",
        "warn",
        `${optionalWithoutHelper.length} optional inputs lack helper text.`,
      );
    } else {
      addFinding(findings, "optionalInputs", "pass", "Optional inputs appear documented.");
    }

    const badTypes = schema.inputs.filter((input) => !["number", "select", "text"].includes(input.type));
    if (badTypes.length > 0) {
      addFinding(findings, "inputTypes", "warn", `Non-standard input types: ${badTypes.map((i) => i.id).join(", ")}`);
    } else {
      addFinding(findings, "inputTypes", "pass", "Input types use standard schema types.");
    }

    const missingUnits = schema.inputs.filter(
      (input) => input.type === "number" && !input.unit && input.id !== "coats",
    );
    if (missingUnits.length > 0) {
      addFinding(
        findings,
        "unitMapping",
        "warn",
        `Numeric inputs without unit metadata: ${missingUnits.map((i) => i.id).join(", ")}`,
      );
    } else {
      addFinding(findings, "unitMapping", "pass", "Unit metadata present on numeric inputs.");
    }

    const nonStandardUnits = schema.inputs.filter(
      (input) => input.unit && !STANDARD_UNITS.has(input.unit) && !input.unit.includes("/"),
    );
    if (nonStandardUnits.length > 0) {
      addFinding(
        findings,
        "canonicalUnit",
        "warn",
        `Non-catalog unit strings: ${nonStandardUnits.map((i) => `${i.id}:${i.unit}`).join(", ")}`,
      );
    } else {
      addFinding(findings, "canonicalUnit", "pass", "Units align with catalog unit vocabulary.");
    }

    if (schema.outputs.length === 0) {
      addFinding(findings, "resultSchema", "fail", "Premium-schema schema defines no outputs.");
    } else {
      addFinding(findings, "resultSchema", "pass", `${schema.outputs.length} output(s) defined.`);
    }

    const schemaFile = readText(schema.path);
    if (
      schema.outputs.length > 0 ||
      schemaFile.includes("bigNumber") ||
      schemaFile.includes("primaryMetric")
    ) {
      addFinding(findings, "resultCard", "pass", "Primary result card/output definition detected.");
    } else {
      addFinding(findings, "resultCard", "warn", "Schema may lack primary result card field.");
    }

    const longLabels = schema.inputs.filter((input) => input.label.length > LONG_LABEL_THRESHOLD);
    if (longLabels.length > 0) {
      addFinding(
        findings,
        "longLabels",
        "warn",
        `Long labels (> ${LONG_LABEL_THRESHOLD} chars): ${longLabels.map((i) => i.id).join(", ")}`,
      );
    } else {
      addFinding(findings, "longLabels", "pass", "Input labels within compact length budget.");
    }
  } else if (tool.tier === "free") {
    const hasCalc = hasCalculatorImplementation(tool.slug, index);
    if (!hasCalc) {
      addFinding(findings, "requiredInputs", "fail", "Active free tool has no calculator implementation detected.");
    } else {
      addFinding(findings, "requiredInputs", "pass", "Free calculator implementation detected.");
    }
    addFinding(findings, "optionalInputs", "pass", "Not applicable — non-schema free tool.");
    addFinding(findings, "inputTypes", "pass", "Not applicable — non-schema free tool.");
    addFinding(findings, "unitMapping", "pass", "Not applicable — non-schema free tool.");
    addFinding(findings, "canonicalUnit", "pass", "Not applicable — non-schema free tool.");
    addFinding(findings, "resultSchema", "pass", "Not applicable — non-schema free tool.");
    addFinding(findings, "resultCard", "pass", "Not applicable — non-schema free tool.");
    addFinding(findings, "longLabels", "pass", "Not applicable — non-schema free tool.");
  } else {
    addFinding(findings, "requiredInputs", "warn", "No schema file — input audit limited to catalog metadata.");
    addFinding(findings, "optionalInputs", "pass", "Not applicable.");
    addFinding(findings, "inputTypes", "pass", "Not applicable.");
    addFinding(findings, "unitMapping", "pass", "Not applicable.");
    addFinding(findings, "canonicalUnit", "pass", "Not applicable.");
    addFinding(findings, "resultSchema", "pass", "Not applicable.");
    addFinding(findings, "resultCard", "pass", "Not applicable.");
    addFinding(findings, "longLabels", "pass", "Not applicable.");
  }

  if (tool.tier === "premium-schema" && isActiveTool(tool)) {
    if (!hasContract) {
      addFinding(findings, "formulaContractAlignment", "fail", "Active premium-schema tool missing FormulaContract.");
    } else if (schema) {
      const schemaRequired = schema.inputs.filter((input) => input.required).map((input) => input.id);
      const validationKeys = readValidationInputKeys(tool.slug);
      const contractRequired = contract?.requiredInputs?.length ? contract.requiredInputs : validationKeys;
      const referenceKeys = validationKeys.length > 0 ? validationKeys : contractRequired;
      const missingInReference = schemaRequired.filter((id) => !referenceKeys.includes(id));
      if (missingInReference.length > 0 && referenceKeys.length > 0) {
        addFinding(
          findings,
          "formulaContractAlignment",
          "fail",
          `Validation/contract missing required schema inputs: ${missingInReference.join(", ")}`,
        );
      } else {
        addFinding(findings, "formulaContractAlignment", "pass", "FormulaContract/validation inputs align with schema.");
      }
    } else {
      addFinding(findings, "formulaContractAlignment", "pass", "FormulaContract present.");
    }

    if (!hasValidation) {
      addFinding(findings, "validation", "fail", "Missing premium-schema validation module.");
    } else {
      addFinding(findings, "validation", "pass", "Validation module present.");
    }

    if (!hasOracle) {
      addFinding(findings, "oracleTests", "fail", "Missing oracle/locator backing for premium-schema tool.");
    } else {
      addFinding(findings, "oracleTests", "pass", "Oracle/locator backing detected.");
    }
  } else if (hasContract) {
    addFinding(findings, "formulaContractAlignment", "pass", "FormulaContract present.");
    addFinding(findings, "validation", "pass", "Contract-backed validation path.");
    addFinding(findings, "oracleTests", hasOracle ? "pass" : "warn", hasOracle ? "Oracle backing detected." : "Oracle backing not detected.");
  } else if (tool.tier === "free" && isActiveTool(tool)) {
    addFinding(
      findings,
      "formulaContractAlignment",
      hasContract ? "pass" : "warn",
      hasContract ? "FormulaContract present." : "Free tool lacks FormulaContract (C-class acceptable).",
    );
    addFinding(findings, "validation", "warn", "Free tool relies on inline calculator validation.");
    addFinding(findings, "oracleTests", hasOracle ? "pass" : "warn", hasOracle ? "Oracle backing detected." : "No oracle backing.");
  } else {
    addFinding(findings, "formulaContractAlignment", "warn", "No FormulaContract detected.");
    addFinding(findings, "validation", "warn", "Validation path not verified.");
    addFinding(findings, "oracleTests", "warn", "Oracle path not verified.");
  }

  const scenarioIds = [
    ...(contract?.scenarioSpecs ?? []),
    ...(contract?.scenarioTests ?? []),
  ];
  const hasBoundary = scenarioIds.some((id) => /boundary|edge|zero|min|max|divisor/i.test(id));
  const hasScenario = scenarioIds.length > 0 || hasScenarioHandlers;

  addFinding(
    findings,
    "boundaryTests",
    hasBoundary || !hasContract ? (hasBoundary ? "pass" : hasContract ? "warn" : "pass") : "warn",
    hasBoundary
      ? "Boundary/edge scenario coverage detected."
      : hasContract
        ? "Contract exists but no explicit boundary scenario id."
        : "Boundary tests not applicable.",
  );

  addFinding(
    findings,
    "scenarioTests",
    hasScenario ? "pass" : hasContract ? "warn" : dedicatedTests.length > 0 ? "pass" : "warn",
    hasScenario
      ? "Scenario specs/handlers present."
      : dedicatedTests.length > 0
        ? "Dedicated test file present."
        : "Scenario test coverage not detected.",
  );

  addFinding(
    findings,
    "globalSanityTests",
    dedicatedTests.length > 0 || hasScenarioHandlers ? "pass" : isActiveTool(tool) ? "warn" : "pass",
    dedicatedTests.length > 0
      ? `Dedicated tests: ${dedicatedTests.length}`
      : hasScenarioHandlers
        ? "Scenario handlers registered."
        : "No dedicated global sanity test file detected.",
  );

  const risk = inferRiskLevel(tool.slug, tool);
  addFinding(
    findings,
    "sectorRealityTests",
    risk === "regulated" || risk === "safety-critical" ? "warn" : "pass",
    risk === "regulated" || risk === "safety-critical"
      ? "Regulated/safety domain — requires human review before trust expansion."
      : "Sector risk within standard automated gate.",
  );

  if (tool.tier === "premium-schema" && isActiveTool(tool)) {
    const i18nSlug = index.premiumSchemaI18nSlugs.has(tool.slug);
    const localeMissing = Object.entries(index.localePremiumKeys)
      .filter(([, keys]) => !keys.has(tool.slug))
      .map(([locale]) => locale);
    addFinding(
      findings,
      "localeKeys",
      localeMissing.length === 0 && i18nSlug ? "pass" : "warn",
      localeMissing.length === 0 && i18nSlug
        ? "Premium-schema i18n keys present."
        : `Missing locale/i18n coverage: ${!i18nSlug ? "premium-schema-i18n" : ""}${localeMissing.length ? ` messages[${localeMissing.join(",")}]` : ""}`.trim(),
    );
    addFinding(
      findings,
      "arRtl",
      index.localePremiumKeys.ar?.has(tool.slug) ? "pass" : "warn",
      index.localePremiumKeys.ar?.has(tool.slug)
        ? "AR locale keys present for premium-schema inputs."
        : "AR locale keys missing — RTL label audit required manually.",
    );
  } else {
    addFinding(findings, "localeKeys", "pass", "Not applicable for non premium-schema tier.");
    addFinding(findings, "arRtl", "pass", "Not applicable for non premium-schema tier.");
  }

  if (isActiveTool(tool) && (tool.tier === "free" || tool.tier === "premium-schema")) {
    const ux = index.globalUxSignals;
    if (ux.mobileFormFirstCss && ux.fixedSubmitBarCss && ux.overflowGuardCss) {
      addFinding(findings, "mobile375", "pass", "Global P80 mobile form/submit CSS markers present.");
    } else {
      addFinding(findings, "mobile375", "warn", "Global mobile layout CSS markers incomplete.");
    }
  } else {
    addFinding(findings, "mobile375", "pass", "Not applicable.");
  }

  if (tool.tier === "free" && index.revenuePairs.freeToPaid.has(tool.slug)) {
    addFinding(findings, "freePremiumSplit", "pass", "Revenue free tool mapped to paid slug.");
  } else if (tool.tier === "premium" && index.revenuePairs.paidToFree.has(tool.slug)) {
    addFinding(findings, "freePremiumSplit", "pass", "Revenue premium tool mapped to free slug.");
  } else if (tool.tier === "premium-schema" && schema?.path) {
    const legacyPaid = readText(schema.path).match(/legacyPaidSlug:\s*"([^"]+)"/)?.[1];
    addFinding(
      findings,
      "freePremiumSplit",
      legacyPaid ? "pass" : "warn",
      legacyPaid ? `Legacy paid bridge: ${legacyPaid}` : "No legacy paid bridge declared.",
    );
  } else if (tool.tier === "free" && isActiveTool(tool)) {
    addFinding(findings, "freePremiumSplit", "warn", "Active free tool has no revenue paid pair.");
  } else {
    addFinding(findings, "freePremiumSplit", "pass", "Not applicable.");
  }

  return finalizeTool(tool, findings, { schema, contract, backing, dedicatedTests, risk });
}

function finalizeTool(tool, findings, meta) {
  const verdict = decideVerdict(findings);
  const failCount = findings.filter((f) => f.severity === "fail").length;
  const warnCount = findings.filter((f) => f.severity === "warn").length;
  const passCount = findings.filter((f) => f.severity === "pass").length;

  return {
    slug: tool.slug,
    tier: tool.tier,
    family: tool.family,
    routeStatus: tool.routeStatus,
    routePath: tool.routePath,
    title: tool.title,
    category: tool.category,
    source: tool.source,
    verdict,
    failCount,
    warnCount,
    passCount,
    riskLevel: meta.risk ?? inferRiskLevel(tool.slug, tool),
    backing: meta.backing ?? false,
    evidence: {
      schemaPath: meta.schema?.path ?? null,
      contractPath: meta.contract?.path ?? null,
      dedicatedTests: meta.dedicatedTests ?? [],
    },
    findings,
  };
}

function decideVerdict(findings) {
  if (findings.some((finding) => finding.severity === "quarantine")) return "QUARANTINE";
  if (findings.some((finding) => finding.severity === "fail")) return "FAIL";
  if (findings.some((finding) => finding.severity === "warn")) return "WARN";
  return "PASS";
}

function buildRepairBatches(tools) {
  const batches = [
    {
      id: "batch-quarantine-routes",
      priority: 1,
      slugs: tools.filter((t) => t.verdict === "QUARANTINE").map((t) => t.slug),
      focus: "Category-only / missing backing routes — hide or wire schema+contract before live calc.",
    },
    {
      id: "batch-fail-premium-schema",
      priority: 2,
      slugs: tools
        .filter((t) => t.verdict === "FAIL" && t.tier === "premium-schema")
        .map((t) => t.slug),
      focus: "Premium-schema FAIL — contract, validation, oracle alignment.",
    },
    {
      id: "batch-fail-free-active",
      priority: 3,
      slugs: tools.filter((t) => t.verdict === "FAIL" && t.tier === "free").map((t) => t.slug),
      focus: "Active free tools missing calculator/contract backing.",
    },
    {
      id: "batch-warn-i18n-mobile",
      priority: 4,
      slugs: tools
        .filter((t) =>
          t.verdict === "WARN" &&
          t.findings.some((f) => ["localeKeys", "arRtl", "longLabels", "mobile375"].includes(f.checkId)),
        )
        .map((t) => t.slug),
      focus: "Locale, RTL, long label, and mobile UX warnings.",
    },
    {
      id: "batch-warn-scenario-coverage",
      priority: 5,
      slugs: tools
        .filter((t) =>
          t.verdict === "WARN" &&
          t.findings.some((f) =>
            ["boundaryTests", "scenarioTests", "globalSanityTests", "oracleTests"].includes(f.checkId),
          ),
        )
        .map((t) => t.slug),
      focus: "Scenario, boundary, oracle, and dedicated test gaps.",
    },
  ];

  return batches.map((batch) => ({
    ...batch,
    count: batch.slugs.length,
    sample: batch.slugs.slice(0, 8),
  }));
}

function buildTopFindings(tools, limit = 20) {
  const scored = [];

  for (const tool of tools) {
    for (const finding of tool.findings) {
      if (finding.severity === "pass") continue;
      let weight =
        finding.severity === "quarantine" ? 30 : finding.severity === "fail" ? 90 : 45;
      if (tool.routeStatus === "active-route") weight += 20;
      if (tool.tier === "premium-schema") weight += 10;
      if (finding.severity === "quarantine" && finding.checkId === "purposeClear") {
        weight = 5;
      }
      scored.push({
        slug: tool.slug,
        tier: tool.tier,
        routeStatus: tool.routeStatus,
        verdict: tool.verdict,
        checkId: finding.checkId,
        severity: finding.severity,
        message: finding.message,
        score: weight,
      });
    }
  }

  return scored.sort((a, b) => b.score - a.score || a.slug.localeCompare(b.slug)).slice(0, limit);
}

function summarize(tools) {
  const byVerdict = { PASS: 0, WARN: 0, FAIL: 0, QUARANTINE: 0 };
  const byFamily = {};
  const byTier = {};

  for (const tool of tools) {
    byVerdict[tool.verdict] += 1;
    byFamily[tool.family] = (byFamily[tool.family] ?? 0) + 1;
    byTier[tool.tier] = (byTier[tool.tier] ?? 0) + 1;
  }

  return {
    totalTools: tools.length,
    byVerdict,
    byFamily,
    byTier,
    activeRoutes: tools.filter((t) => t.routeStatus === "active-route").length,
    categoryOnly: tools.filter((t) => t.routeStatus === "category-only").length,
  };
}

export function buildIndexes() {
  return {
    schemaIndex: buildSchemaIndex(),
    contractIndex: buildContractIndex(),
    locatorSlugs: buildSlugSetFromFiles(LOCATOR_FILES, /slug:\s*"([^"]+)"/g),
    oracleSlugs: buildSlugSetFromFiles(ORACLE_FILES, /slug:\s*"([^"]+)"/g),
    scenarioHandlerSlugs: buildScenarioHandlerIndex(),
    dedicatedTestIndex: buildDedicatedTestIndex(),
    revenuePairs: buildRevenuePairs(),
    legacyCalculatorSlugs: buildLegacyCalculatorSlugs(),
    freeTrafficCalculatorSlugs: buildFreeCalculatorSlugs(),
    premiumSchemaI18nSlugs: buildPremiumSchemaI18nSlugs(),
    localePremiumKeys: buildLocalePremiumKeys(),
    validationSlugs: buildValidationIndex(),
    globalUxSignals: buildGlobalUxSignals(),
  };
}

export function buildP24ToolQualityReport() {
  const indexes = buildIndexes();
  const inventory = collectInventory(indexes);
  const tools = inventory.map((tool) => auditTool(tool, indexes));
  const summary = summarize(tools);

  return {
    generatedAt: new Date().toISOString(),
    auditId: "P2.4-full-tool-inventory-quality",
    checkIds: CHECK_IDS,
    summary,
    topFindings: buildTopFindings(tools, 20),
    repairBatches: buildRepairBatches(tools),
    tools,
  };
}

export function formatP24Stdout(report) {
  const { summary, topFindings, repairBatches } = report;
  const lines = [
    "audit:p24-tool-quality PASS",
    `totalTools: ${summary.totalTools}`,
    `activeRoutes: ${summary.activeRoutes}`,
    `categoryOnly: ${summary.categoryOnly}`,
    `PASS/WARN/FAIL/QUARANTINE: ${summary.byVerdict.PASS}/${summary.byVerdict.WARN}/${summary.byVerdict.FAIL}/${summary.byVerdict.QUARANTINE}`,
    `families: ${Object.entries(summary.byFamily)
      .map(([key, count]) => `${key}=${count}`)
      .join(", ")}`,
    `output: ${path.relative(ROOT, P24_REPORT_PATH)}`,
    "",
    "Top findings:",
  ];

  for (const finding of topFindings.slice(0, 10)) {
    lines.push(` - [${finding.severity}] ${finding.slug} (${finding.tier}) ${finding.checkId}: ${finding.message}`);
  }

  lines.push("", "Repair batches:");
  for (const batch of repairBatches.filter((entry) => entry.count > 0)) {
    lines.push(` - ${batch.id} (${batch.count}): ${batch.focus}`);
  }

  return lines.join("\n");
}
