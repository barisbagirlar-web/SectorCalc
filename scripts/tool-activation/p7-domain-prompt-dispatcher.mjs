/**
 * P7 Domain Prompt Dispatcher (mjs mirror for night-factory scripts).
 * Keep in sync with src/lib/ai/deepseek/domain-prompt-dispatcher.ts
 */

export const DOMAIN_PROMPT_IDS = [
  "MANUFACTURING_AND_MACHINING",
  "LEAN_WASTE_AND_OEE",
  "COSTING_MARGIN_AND_PRICING",
  "LOGISTICS_AND_TRANSPORT",
  "ENERGY_AND_UTILITIES",
  "INVENTORY_AND_STOCK",
  "MAINTENANCE_AND_DOWNTIME",
  "CONSTRUCTION_AND_FIELD_SERVICE",
  "FOOD_AGRI_AND_PROCESS",
  "FINANCE_LEGAL_TAX_REGULATORY_HIGH_RISK",
  "GENERAL_INDUSTRIAL_COST_ANALYTICS",
];

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

const DOMAIN_PROMPTS = {
  MANUFACTURING_AND_MACHINING: [
    "DOMAIN: MANUFACTURING_AND_MACHINING",
    "Evaluate machining, fabrication, and production calculators.",
    "Require cycle-time, setup, tooling, material removal, scrap/yield, and capacity realism.",
    "Reject generic cost/rate inputs without process context.",
    "Formulas must cite shop-floor measurable variables with units.",
    DOMAIN_OUTPUT_RULES,
  ].join("\n"),

  LEAN_WASTE_AND_OEE: [
    "DOMAIN: LEAN_WASTE_AND_OEE",
    "Evaluate waste, OEE, downtime, scrap, rework, and changeover tools.",
    "Require availability, performance, quality decomposition or explicit waste monetization.",
    "Reject single-ratio shortcuts without loss breakdown.",
    "Oracle cases must cover zero-loss, typical-loss, and high-loss scenarios.",
    DOMAIN_OUTPUT_RULES,
  ].join("\n"),

  COSTING_MARGIN_AND_PRICING: [
    "DOMAIN: COSTING_MARGIN_AND_PRICING",
    "Evaluate quote, bid, margin, and job-cost calculators.",
    "Require direct cost, burden/overhead, risk buffer, and margin normalization.",
    "Reject price-only outputs without cost stack trace.",
    "Validation must block negative margin inputs and unrealistic markup bounds.",
    DOMAIN_OUTPUT_RULES,
  ].join("\n"),

  LOGISTICS_AND_TRANSPORT: [
    "DOMAIN: LOGISTICS_AND_TRANSPORT",
    "Evaluate route, freight, delivery, fuel, and handling calculators.",
    "Require distance/time, load factor, fuel or tariff basis, and handling surcharges.",
    "Reject flat-rate formulas without operational drivers.",
    "Units must distinguish per-trip, per-km, per-kg, and per-pallet.",
    DOMAIN_OUTPUT_RULES,
  ].join("\n"),

  ENERGY_AND_UTILITIES: [
    "DOMAIN: ENERGY_AND_UTILITIES",
    "Evaluate energy, power, tariff, heat-loss, cooling, and carbon tools.",
    "Require kWh or thermal basis, duty cycle, efficiency, and tariff tier logic.",
    "Reject watt guesses without time basis.",
    "Carbon outputs must state emission factor source or assumption.",
    DOMAIN_OUTPUT_RULES,
  ].join("\n"),

  INVENTORY_AND_STOCK: [
    "DOMAIN: INVENTORY_AND_STOCK",
    "Evaluate inventory holding, reorder, obsolescence, and warehouse-space tools.",
    "Require demand rate, lead time, carrying cost, and service-level or EOQ logic.",
    "Reject stock count formulas without turnover or holding cost basis.",
    DOMAIN_OUTPUT_RULES,
  ].join("\n"),

  MAINTENANCE_AND_DOWNTIME: [
    "DOMAIN: MAINTENANCE_AND_DOWNTIME",
    "Evaluate maintenance, MTBF, MTTR, failure, and repair downtime tools.",
    "Require failure rate or interval, repair duration, and production loss linkage.",
    "Reject downtime minutes without availability impact math.",
    DOMAIN_OUTPUT_RULES,
  ].join("\n"),

  CONSTRUCTION_AND_FIELD_SERVICE: [
    "DOMAIN: CONSTRUCTION_AND_FIELD_SERVICE",
    "Evaluate field-service, trades, and construction operation calculators.",
    "Require labor hours, material takeoff, travel/mobilization, and rework allowance.",
    "Reject lump-sum inputs without scope drivers.",
    DOMAIN_OUTPUT_RULES,
  ].join("\n"),

  FOOD_AGRI_AND_PROCESS: [
    "DOMAIN: FOOD_AGRI_AND_PROCESS",
    "Evaluate agriculture, dairy, recipe, menu, and process-yield tools.",
    "Require yield, shrink, batch size, and ingredient/process loss linkage.",
    "Reject recipe cost without portion or batch normalization.",
    DOMAIN_OUTPUT_RULES,
  ].join("\n"),

  FINANCE_LEGAL_TAX_REGULATORY_HIGH_RISK: [
    "DOMAIN: FINANCE_LEGAL_TAX_REGULATORY_HIGH_RISK",
    "HIGH-RISK DOMAIN — do not approve automatic calculator generation.",
    "Produce expert verification checklist, required legal/regulatory sources, oracle test plan, and input gap analysis.",
    "Set canGenerateCalculator=false unless explicit human expert sign-off path is documented.",
    "Reject generic tax/legal/fx formulas without jurisdiction and effective-date context.",
    DOMAIN_OUTPUT_RULES,
  ].join("\n"),

  GENERAL_INDUSTRIAL_COST_ANALYTICS: [
    "DOMAIN: GENERAL_INDUSTRIAL_COST_ANALYTICS",
    "Fallback domain for industrial cost and operations analytics.",
    "Require measurable operational drivers, explicit assumptions, and decision-grade outputs.",
    "Reject placeholder formulas and generic inputs.",
    DOMAIN_OUTPUT_RULES,
  ].join("\n"),
};

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
