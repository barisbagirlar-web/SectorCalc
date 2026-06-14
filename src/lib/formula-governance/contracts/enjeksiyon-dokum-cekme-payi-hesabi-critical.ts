/**
 * P64 — enjeksiyon-dokum-cekme-payi-hesabi premium-schema FormulaContract (factory generated).
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
import { ENJEKSIYON_DOKUM_CEKME_PAYI_HESABI_INPUT_KEYS } from "@/lib/premium-schema/calculators/enjeksiyon-dokum-cekme-payi-hesabi-validation";

const PREMIUM_SCHEMA_DISCLAIMER =
  "Technical simulation only — not financial, legal, safety, or professional advice. Verify assumptions before business decisions.";

const REQUIRED_INPUTS = [...ENJEKSIYON_DOKUM_CEKME_PAYI_HESABI_INPUT_KEYS];
const OUTPUTS = [
  "totalExposure",
  "variancePercent",
  "summaryLevel",
  "primaryDriver",
  "decisionVerdict"
] as const;

export const EnjeksiyonDokumCekmePayiHesabiCalculatorContract: FormulaContract = buildAssuredCriticalContract({
  toolId: "premium-schema.enjeksiyon-dokum-cekme-payi-hesabi",
  toolName: "enjeksiyon-dokum-cekme-payi-hesabi",
  slug: "enjeksiyon-dokum-cekme-payi-hesabi",
  purpose: "Quantify totalExposure exposure for enjeksiyon-dokum-cekme-payi-hesabi.",
  userDecision: "What is the deterministic totalExposure exposure for this input profile?",
  decisionImpact: "financial",
  requiredInputs: REQUIRED_INPUTS,
  criticalInputs: REQUIRED_INPUTS,
  outputs: [...OUTPUTS],
  assumptions: [
    PREMIUM_SCHEMA_DISCLAIMER,
    "This tool provides deterministic cost/risk/margin exposure estimation from declared inputs. It is not a regulatory, legal, safety, engineering or professional certification decision engine.",
    "Metadata lastUpdated: 2026-06-13.",
    "Metadata validUntil: 2027-06-13.",
    "totalExposure via cost.total_exposure pipeline step.",
    "variancePercent via benchmark.variance_percent pipeline step.",
    "summaryLevel uses totalExposure thresholds warning 1 / critical 3 (higher_is_bad).",
    calculatorProductionAssumption(
      "src/lib/premium-schema/calculators/enjeksiyon-dokum-cekme-payi-hesabi-validation.ts",
      "validateEnjeksiyonDokumCekmePayiHesabiInputs(inputs) → validation errors and warnings",
    ),
    calculatorProductionAssumption(
      "src/lib/premium-schema/calculators/enjeksiyon-dokum-cekme-payi-hesabi.ts",
      "calculateEnjeksiyonDokumCekmePayiHesabi(inputs) → exposure metrics and decisionVerdict",
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

export const ENJEKSIYON_DOKUM_CEKME_PAYI_HESABI_CRITICAL_FORMULA_CONTRACTS: readonly FormulaContract[] = [
  EnjeksiyonDokumCekmePayiHesabiCalculatorContract,
];
