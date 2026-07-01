/**
 * Tool #28 — Tohum Oranı
 */
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const SEED_RATE_SCHEMA: PremiumCalculatorSchema = {
  id: "seed-rate-analyzer", legacyPaidSlug: "seed-rate-analyzer",
  name: "Seed Rate and Cost Analysis", name_i18n: {"en":"Seed Rate and Cost Analysis"}, sectorSlug: "food", category: "cost",
  painStatement: "If seed rate and germination loss are not calculated, planting cost increases unnecessarily and yield drops.", painStatement_i18n: {"en":"If seed rate and germination loss are not calculated, planting cost increases unnecessarily and yield drops."},
  inputs: [
    { id: "fieldArea", label: "Field Area", label_i18n: {"en":"Field Area"}, type: "number", unit: "dekar", required: true, smartDefault: 100, validation: { min: 1 }, helper: "", expertMeaning: "Field area in decares", expertMeaning_i18n: {"en":"Field area in decares"} },
    { id: "seedPerDecare", label: "Seed per Decare", label_i18n: {"en":"Seed per Decare"}, type: "number", unit: "kg/dekar", required: true, smartDefault: 20, validation: { min: 0.1 }, helper: "", expertMeaning: "Seed rate per decare", expertMeaning_i18n: {"en":"Seed rate per decare"} },
    { id: "seedUnitCost", label: "Tohum Birim Maliyeti", label_i18n: {"en":"Seed Unit Cost"}, type: "number", unit: "USD/kg", required: true, smartDefault: 3, validation: { min: 0.01 }, helper: "", expertMeaning: "Seed cost per kg", expertMeaning_i18n: {"en":"Seed cost per kg"} },
    { id: "germinationRate", label: "Germination Rate", label_i18n: {"en":"Germination Rate"}, type: "number", unit: "%", required: true, smartDefault: 90, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Expected germination rate", expertMeaning_i18n: {"en":"Expected germination rate"} },
    { id: "wasteRateSeeds", label: "Seed Waste Rate", label_i18n: {"en":"Seed Waste Rate"}, type: "number", unit: "%", required: false, smartDefault: 5, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Seed waste percentage", expertMeaning_i18n: {"en":"Seed waste percentage"} },
    { id: "desiredStandCount", label: "Target Plant Count", label_i18n: {"en":"Target Plant Count"}, type: "number", unit: "adet/dekar", required: false, smartDefault: 5000, validation: { min: 0 }, helper: "", expertMeaning: "Target plant stand per decare", expertMeaning_i18n: {"en":"Target plant stand per decare"} },
  ],
  outputs: [
    { id: "seedRequirement", label: "Total Seed Requirement", label_i18n: {"en":"Total Seed Requirement"}, unit: "kg", format: "number" },
    { id: "seedCostTotal", label: "Toplam Tohum Maliyeti", label_i18n: {"en":"Total Seed Cost"}, unit: "USD", format: "currency" },
    { id: "seedFinancialLoss", label: "Waste and Germination Loss", label_i18n: {"en":"Waste and Germination Loss"}, unit: "USD", format: "currency" },
  ],
  thresholds: [{ fieldId: "seedFinancialLoss", warning: 1000, critical: 3000, direction: "higher_is_bad", warningMessage: "Seed loss > $1K — increase planting precision.", warningMessage_i18n: {"en":"Seed loss > $1K — increase planting precision."}, criticalMessage: "Seed loss > $3K — review seed quality and planting method.", criticalMessage_i18n: {"en":"Seed loss > $3K — review seed quality and planting method."} }],
  formulaPipeline: [
    { formulaId: "measurement.seed_requirement", inputMap: { fieldArea: "fieldArea", seedPerDecare: "seedPerDecare", germinationRate: "germinationRate", wasteRateSeeds: "wasteRateSeeds" ,
        areaHa: "areaHa",
        seedRatePerHa: "seedRatePerHa"}, outputId: "seedRequirement" },
    { formulaId: "cost.seed_cost_total", inputMap: { seedRequirement: "seedRequirement", seedUnitCost: "seedUnitCost" ,
        seedPricePerUnit: "seedPricePerUnit"}, outputId: "seedCostTotal" },
    { formulaId: "cost.seed_financial_loss", inputMap: { seedCostTotal: "seedCostTotal", germinationRate: "germinationRate", wasteRateSeeds: "wasteRateSeeds" ,
        expectedGermination: "expectedGermination",
        actualGermination: "actualGermination"}, outputId: "seedFinancialLoss" },
  ],
  reportTemplate: { title: "Seed Rate & Cost Report", title_i18n: {"en":"Seed Rate & Cost Report"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.1, volatilityPercent: 5, targetMarginPercent: 20, assumptionNotes: ["Seed req. = Area × Rate / (Germ% × (1−Waste%)).", "Total cost = Requirement × UnitCost.", "Loss = Cost × (1 − Germ%) + Waste adjustment."],assumptionNotes_i18n:[{"en":"Seed req. = Area × Rate / (Germ% × (1−Waste%))."},{"en":"Total cost = Requirement × UnitCost."},{"en":"Loss = Cost × (1 − Germ%) + Waste adjustment."}] },
};
