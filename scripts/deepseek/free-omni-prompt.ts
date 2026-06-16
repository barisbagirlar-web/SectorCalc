import type { CalculatorListEntry } from "./parse-calculator-list";
import { resolveSectionCategory } from "./parse-calculator-list";
import { CATALOG_CATEGORY_TO_SECTOR_SLUG } from "@/lib/catalog/catalog-category-mappings";
import {
  ALLOWED_FORMULA_OPERATORS,
  INDUSTRIAL_DOMAIN_REFERENCES,
  INDUSTRIAL_STANDARDS,
} from "./industrial-standards";

const I18N_KEYS = '"en","tr","de","fr","es","ar"';

const FREE_TRAFFIC_CATEGORIES = [
  "construction-measurement",
  "finance-business",
  "manufacturing-workshop",
  "energy-carbon",
  "logistics-travel",
  "agriculture-food",
  "everyday-life",
  "math-statistics",
  "conversion",
  "health-body",
  "physics-science",
  "chemistry-science",
  "engineering-science",
  "food-cooking",
  "date-time",
  "education-academic",
  "ecology-environment",
  "gaming-entertainment",
  "hobbies-diy",
] as const;

export function buildFreeOmniSchemaPrompt(entry: CalculatorListEntry): string {
  const category = resolveSectionCategory(entry.section);
  const sectorSlug =
    CATALOG_CATEGORY_TO_SECTOR_SLUG[category as keyof typeof CATALOG_CATEGORY_TO_SECTOR_SLUG];
  return `You are an ISO 9001:2015-certified industrial mathematics engineer (ECMI methodology).
Build a production-grade, TÜV-certifiable FREE public calculator for SectorCalc.com.

Calculator name: "${entry.name}"
Slug (toolName field, exact): "${entry.slug}"
Section: "${entry.section}"
Subsection: "${entry.subsection || "General"}"
catalogCategory: "${category}"
sectorSlug: "${sectorSlug}"

Quality framework: ${INDUSTRIAL_STANDARDS.quality}
ECMI: ${INDUSTRIAL_STANDARDS.ecmi}

REQUIREMENTS (MANDATORY – ISO 9001 – 8.3.5 Design Outputs):

1. Use the REAL domain formula for "${entry.name}" — not a generic ratio placeholder.
   Formulas must be physically meaningful and dimensionally consistent.
2. 3–8 inputs. Each input MUST have:
   - id: snake_case (e.g., operating_pressure)
   - label + label_i18n (${I18N_KEYS})
   - type: "number" (numeric inputs)
   - unit: valid SI or industry unit (e.g., MPa, mm, °C, kg/m³, m/s, %)
   - default: realistic engineering default
   - businessContext + businessContext_i18n (${I18N_KEYS}): 1-sentence engineering significance
3. label === label_i18n.en and businessContext === businessContext_i18n.en.
4. ${ALLOWED_FORMULA_OPERATORS}
5. formulas: at least 2 keys. Each maps to a compilable JavaScript expression.
6. outputs.primary = main formula key; outputs.breakdown = object with human labels for each formula key.
7. premiumRequired: false, premiumFeatures: [].
8. catalogCategory MUST be one of: ${FREE_TRAFFIC_CATEGORIES.map((c) => `"${c}"`).join(", ")}.
   Use "${category}" unless the calculator clearly belongs elsewhere.
9. sectorSlug MUST be "${sectorSlug}" (industry hub slug for sector pages).
10. validation.rules and validation.thresholds (can be empty objects/arrays).
11. Medical/financial tools: disclaimer tone in businessContext only — not medical/legal advice.

${INDUSTRIAL_DOMAIN_REFERENCES}

EXAMPLE (pressure vessel thickness):
Inputs: operating_pressure (MPa), inner_radius (mm), allowable_stress (MPa), joint_efficiency, corrosion_allowance (mm)
Formulas:
- t_min = (operating_pressure * inner_radius) / (allowable_stress * joint_efficiency - 0.6 * operating_pressure)
- t_design = t_min + corrosion_allowance
Outputs: primary=t_design, breakdown includes t_min and t_design

Return ONLY valid JSON matching:
{
  "toolName": "${entry.slug}",
  "catalogCategory": "${category}",
  "sectorSlug": "${sectorSlug}",
  "inputs": [...],
  "validation": { "rules": [], "thresholds": {} },
  "formulas": { "result_key": "expression", "derived_key": "expression" },
  "outputs": {
    "primary": "result_key",
    "breakdown": {},
    "hiddenLossDrivers": [],
    "suggestedActions": ["Verify inputs before decisions."],
    "dataConfidenceAdjusted": "result_key"
  },
  "premiumRequired": false,
  "premiumFeatures": []
}`;
}
