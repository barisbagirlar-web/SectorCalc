/**
 * P7 Domain Prompt Dispatcher (mjs mirror for night-factory scripts).
 * Keep in sync with src/lib/ai/deepseek/domain-prompt-dispatcher.ts
 */

import {
  DOMAIN_PROMPT_IDS,
  P7_DOMAIN_PROMPT_PACKS,
} from "./p7-domain-prompt-packs.mjs";

export { DOMAIN_PROMPT_IDS, P7_DOMAIN_PROMPT_PACKS };

const HIGH_RISK_DOMAIN_ID = "FINANCE_LEGAL_TAX_REGULATORY_HIGH_RISK";

const HIGH_RISK_RISK_CLASSES = new Set([
  "HIGH_FINANCE_LEGAL_TAX",
  "HIGH_REGULATORY",
  "HIGH_ENGINEERING_SAFETY",
  "BLOCKED_UNKNOWN",
]);

const DOMAIN_MATCH_RULES = [
  {
    id: HIGH_RISK_DOMAIN_ID,
    priority: 100,
    keywords: [
      "tax",
      "legal",
      "aml",
      "kyb",
      "cbam",
      "ai-act",
      "fx",
      "hedge",
      "credit",
      "loan",
      "severance",
      "pressure-vessel",
      "bolted",
      "safety-critical",
      "vergi",
      "kdv",
      "doviz",
      "kredi",
      "tazminat",
      "kidem",
      "ihbar",
      "basincli-kap",
      "regulatory",
      "compliance",
    ],
  },
  {
    id: "MAINTENANCE_AND_DOWNTIME",
    priority: 90,
    keywords: [
      "maintenance",
      "machine-failure",
      "machine failure",
      "mtbf",
      "mttr",
      "repair",
      "preventive-maintenance",
      "bakim",
      "ariza",
    ],
  },
  {
    id: "LEAN_WASTE_AND_OEE",
    priority: 80,
    keywords: [
      "muda",
      "waste",
      "oee",
      "lean",
      "scrap",
      "rework",
      "defects",
      "downtime",
      "changeover",
      "israf",
      "fire",
    ],
  },
  {
    id: "MANUFACTURING_AND_MACHINING",
    priority: 70,
    keywords: [
      "manufacturing",
      "machining",
      "cnc",
      "welding",
      "sheet-metal",
      "3d-print",
      "millwork",
      "cabinet",
      "panel-shop",
      "imalat",
      "torna",
      "freze",
    ],
  },
  {
    id: "FOOD_AGRI_AND_PROCESS",
    priority: 65,
    keywords: [
      "crop",
      "dairy",
      "recipe",
      "menu",
      "food",
      "agriculture",
      "yield",
      "tarim",
      "gida",
      "yem",
      "sut",
    ],
  },
  {
    id: "CONSTRUCTION_AND_FIELD_SERVICE",
    priority: 60,
    keywords: [
      "roofing",
      "plumbing",
      "hvac",
      "painting",
      "landscaping",
      "cleaning",
      "field-service",
      "insaat",
      "tesisat",
      "boya",
    ],
  },
  {
    id: "ENERGY_AND_UTILITIES",
    priority: 55,
    keywords: [
      "energy",
      "kwh",
      "power",
      "electricity",
      "tariff",
      "heat-loss",
      "cooling",
      "carbon",
      "enerji",
      "elektrik",
      "isitma",
    ],
  },
  {
    id: "LOGISTICS_AND_TRANSPORT",
    priority: 50,
    keywords: [
      "route",
      "delivery",
      "freight",
      "shipment",
      "fuel",
      "transport",
      "warehouse",
      "handling",
      "lojistik",
      "nakliye",
      "sevkiyat",
    ],
  },
  {
    id: "INVENTORY_AND_STOCK",
    priority: 45,
    keywords: [
      "inventory",
      "stock",
      "holding",
      "obsolescence",
      "reorder",
      "warehouse-space",
      "stok",
      "envanter",
    ],
  },
  {
    id: "COSTING_MARGIN_AND_PRICING",
    priority: 40,
    keywords: [
      "margin",
      "quote",
      "pricing",
      "profit",
      "bid",
      "revenue",
      "contract",
      "job-cost",
      "cost",
      "maliyet",
      "fiyat",
      "teklif",
      "kar",
    ],
  },
];

const FALLBACK_DOMAIN_ID = "GENERAL_INDUSTRIAL_COST_ANALYTICS";

const DOMAIN_OUTPUT_RULES =
  "Return only valid JSON. Generic formula, generic input, weak assumptions, missing oracle, missing unit, missing validation = FAIL.";

function buildDomainPrompt(domainId) {
  return [`DOMAIN: ${domainId}`, P7_DOMAIN_PROMPT_PACKS[domainId], DOMAIN_OUTPUT_RULES].join("\n\n");
}

const DOMAIN_PROMPTS = Object.fromEntries(
  DOMAIN_PROMPT_IDS.map((domainId) => [domainId, buildDomainPrompt(domainId)]),
);

const EXPERT_CHECKLIST_APPENDIX = [
  "HIGH-RISK SIGNAL ACTIVE:",
  "- Do not generate or approve a production calculator.",
  "- Return expertChecklist with: requiredInputs, requiredSources, jurisdictionNotes, validationPlan, oraclePlan, humanReviewSteps.",
  "- Set canGenerateCalculator=false and overallDecision=REJECTED unless checklist-only draft is requested.",
].join("\n");

function normalizeMatchText(input) {
  const parts = [
    input.slug,
    input.title ?? "",
    input.category ?? "",
    input.description ?? "",
    input.sectorSlug ?? "",
    ...(input.tags ?? []),
  ];
  return parts.join(" ").toLowerCase().replace(/[_/]+/g, "-");
}

function keywordMatches(haystack, keyword) {
  const normalizedKeyword = keyword.toLowerCase().replace(/[_/]+/g, "-");
  if (normalizedKeyword.includes("-")) {
    return haystack.includes(normalizedKeyword);
  }
  const re = new RegExp(`\\b${normalizedKeyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`);
  return re.test(haystack);
}

function isHighRiskSignal(input) {
  if (input.riskClass && HIGH_RISK_RISK_CLASSES.has(input.riskClass)) {
    return true;
  }
  const haystack = normalizeMatchText(input);
  const highRiskRule = DOMAIN_MATCH_RULES.find((rule) => rule.id === HIGH_RISK_DOMAIN_ID);
  if (!highRiskRule) return false;
  return highRiskRule.keywords.some((keyword) => keywordMatches(haystack, keyword));
}

export function matchDomainPrompt(input) {
  const haystack = normalizeMatchText(input);
  const highRisk = isHighRiskSignal(input);

  if (highRisk) {
    const highRiskRule = DOMAIN_MATCH_RULES.find((rule) => rule.id === HIGH_RISK_DOMAIN_ID);
    const matchedKeywords =
      highRiskRule?.keywords.filter((keyword) => keywordMatches(haystack, keyword)) ?? [];
    return {
      domainId: HIGH_RISK_DOMAIN_ID,
      matchedKeywords,
      matchSource: "high_risk_override",
      isHighRisk: true,
      requiresExpertChecklist: true,
    };
  }

  const sortedRules = DOMAIN_MATCH_RULES.filter((rule) => rule.id !== HIGH_RISK_DOMAIN_ID).sort(
    (a, b) => b.priority - a.priority,
  );

  for (const rule of sortedRules) {
    const matchedKeywords = rule.keywords.filter((keyword) => keywordMatches(haystack, keyword));
    if (matchedKeywords.length > 0) {
      return {
        domainId: rule.id,
        matchedKeywords,
        matchSource: "keyword",
        isHighRisk: false,
        requiresExpertChecklist: false,
      };
    }
  }

  return {
    domainId: FALLBACK_DOMAIN_ID,
    matchedKeywords: [],
    matchSource: "fallback",
    isHighRisk: false,
    requiresExpertChecklist: false,
  };
}

export function getDomainPromptText(domainId) {
  return DOMAIN_PROMPTS[domainId];
}

export function buildDomainPromptSection(input) {
  const match = matchDomainPrompt(input);
  const sections = [
    "=== P7 DOMAIN PROMPT (single domain only) ===",
    getDomainPromptText(match.domainId),
    "",
    `domainId: ${match.domainId}`,
    `matchSource: ${match.matchSource}`,
    `matchedKeywords: ${match.matchedKeywords.join(", ") || "none"}`,
  ];

  if (match.requiresExpertChecklist) {
    sections.push("", EXPERT_CHECKLIST_APPENDIX);
  }

  return sections.join("\n");
}

export function buildDomainAugmentedUserPrompt(baseUserPrompt, toolContext) {
  const domainSection = buildDomainPromptSection(toolContext);
  return [baseUserPrompt, "", domainSection].join("\n");
}

export function toDomainMatchInput(toolContext) {
  return {
    slug: toolContext.slug,
    title: toolContext.title,
    category: toolContext.category,
    description: toolContext.description,
    sectorSlug: toolContext.sectorSlug,
    tags: toolContext.tags,
    riskClass: toolContext.existingMetadata?.riskClass,
  };
}

export function runDomainDispatcherSelfTests() {
  const cases = [
    {
      name: "cnc-manufacturing",
      input: { slug: "cnc-quote-risk-analyzer", category: "manufacturing" },
      expectDomain: "MANUFACTURING_AND_MACHINING",
    },
    {
      name: "oee-lean",
      input: { slug: "oee-loss-calculator", category: "oee" },
      expectDomain: "LEAN_WASTE_AND_OEE",
    },
    {
      name: "margin-pricing",
      input: { slug: "job-margin-analyzer", category: "cost" },
      expectDomain: "COSTING_MARGIN_AND_PRICING",
    },
    {
      name: "freight-logistics",
      input: { slug: "freight-cost-estimator", category: "logistics" },
      expectDomain: "LOGISTICS_AND_TRANSPORT",
    },
    {
      name: "energy-tariff",
      input: { slug: "electricity-tariff-calculator", category: "energy" },
      expectDomain: "ENERGY_AND_UTILITIES",
    },
    {
      name: "inventory-stock",
      input: { slug: "inventory-holding-cost", category: "inventory" },
      expectDomain: "INVENTORY_AND_STOCK",
    },
    {
      name: "maintenance-mtbf",
      input: { slug: "mtbf-mttr-analyzer", category: "maintenance" },
      expectDomain: "MAINTENANCE_AND_DOWNTIME",
    },
    {
      name: "hvac-field",
      input: { slug: "hvac-service-quote", category: "hvac" },
      expectDomain: "CONSTRUCTION_AND_FIELD_SERVICE",
    },
    {
      name: "dairy-yield",
      input: { slug: "dairy-yield-calculator", category: "agriculture" },
      expectDomain: "FOOD_AGRI_AND_PROCESS",
    },
    {
      name: "tax-high-risk",
      input: { slug: "corporate-tax-estimator", category: "finance" },
      expectDomain: "FINANCE_LEGAL_TAX_REGULATORY_HIGH_RISK",
      expectHighRisk: true,
    },
    {
      name: "generic-fallback",
      input: { slug: "random-industrial-metric", category: "misc" },
      expectDomain: "GENERAL_INDUSTRIAL_COST_ANALYTICS",
      expectFallback: true,
    },
    {
      name: "risk-class-override",
      input: {
        slug: "simple-oee-check",
        category: "oee",
        riskClass: "HIGH_ENGINEERING_SAFETY",
      },
      expectDomain: "FINANCE_LEGAL_TAX_REGULATORY_HIGH_RISK",
      expectHighRisk: true,
    },
  ];

  const results = cases.map((testCase) => {
    const result = matchDomainPrompt(testCase.input);
    const domainOk = result.domainId === testCase.expectDomain;
    const highRiskOk = testCase.expectHighRisk ? result.isHighRisk : true;
    const fallbackOk = testCase.expectFallback ? result.matchSource === "fallback" : true;
    const pass = domainOk && highRiskOk && fallbackOk;
    return {
      name: testCase.name,
      pass,
      expected: testCase.expectDomain,
      actual: result.domainId,
      matchSource: result.matchSource,
    };
  });

  return {
    allPass: results.every((r) => r.pass),
    results,
  };
}
