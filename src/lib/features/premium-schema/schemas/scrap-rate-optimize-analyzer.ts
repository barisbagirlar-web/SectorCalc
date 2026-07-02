
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const SCRAP_OPTIMIZE_SCHEMA: PremiumCalculatorSchema = {
  id: "scrap-rate-optimize-analyzer", legacyPaidSlug: "scrap-rate-optimize-analyzer",
  name: "Scrap Rate Optimization & Pareto Analysis", name_i18n: {"en":"Scrap Rate Optimization & Pareto Analysis"}, sectorSlug: "sheet-metal", category: "cost",
  painStatement: "Scrap cost is not just material loss; it includes labor, machine, and opportunity costs. Source-based Pareto analysis is needed.", painStatement_i18n: {"en":"Scrap cost is not just material loss; it includes labor, machine, and opportunity costs. Source-based Pareto analysis is needed."},
  inputs: [
    { id: "scrapQty", label: "Scrap Quantity", label_i18n: {"en":"Scrap Quantity"}, type: "number", unit: "units/year", required: true, smartDefault: 5000, validation: { min: 0 }, helper: "", expertMeaning: "Annual scrap quantity", expertMeaning_i18n: {"en":"Annual scrap quantity"} },
    { id: "totalInput", label: "Total Production Input", label_i18n: {"en":"Total Production Input"}, type: "number", unit: "units/year", required: true, smartDefault: 100000, validation: { min: 1 }, helper: "", expertMeaning: "Total input quantity", expertMeaning_i18n: {"en":"Total input quantity"} },
    { id: "matCost", label: "Material Cost/Unit", label_i18n: {"en":"Material Cost/Unit"}, type: "number", unit: "USD", required: true, smartDefault: 2, validation: { min: 0 }, helper: "", expertMeaning: "Material cost per unit", expertMeaning_i18n: {"en":"Material cost per unit"} },
    { id: "cycleTime", label: "Cycle Time", label_i18n: {"en":"Cycle Time"}, type: "number", unit: "dak", required: false, smartDefault: 2, validation: { min: 0 }, helper: "", expertMeaning: "Cycle time per part", expertMeaning_i18n: {"en":"Cycle time per part"} },
    { id: "labRate", label: "Labor Hourly Rate", label_i18n: {"en":"Labor Hourly Rate"}, type: "number", unit: "USD/hour", required: false, smartDefault: 25, validation: { min: 0 }, helper: "", expertMeaning: "Labor hourly rate", expertMeaning_i18n: {"en":"Labor hourly rate"} },
    { id: "machRate", label: "Machine Hourly Rate", label_i18n: {"en":"Machine Hourly Rate"}, type: "number", unit: "USD/hour", required: false, smartDefault: 75, validation: { min: 0 }, helper: "", expertMeaning: "Machine hourly rate", expertMeaning_i18n: {"en":"Machine hourly rate"} },
    { id: "unitMargin", label: "Unit Profit Margin", label_i18n: {"en":"Unit Profit Margin"}, type: "number", unit: "USD", required: false, smartDefault: 5, validation: { min: 0 }, helper: "", expertMeaning: "Profit margin per unit", expertMeaning_i18n: {"en":"Profit margin per unit"} },
    { id: "salvage", label: "Salvage Value/Unit", label_i18n: {"en":"Salvage Value/Unit"}, type: "number", unit: "USD", required: false, smartDefault: 0.5, validation: { min: 0 }, helper: "", expertMeaning: "Salvage value per scrap", expertMeaning_i18n: {"en":"Salvage value per scrap"} },
    { id: "benchmarkRate", label: "Target (Benchmark) Scrap Rate", label_i18n: {"en":"Target (Benchmark) Scrap Rate"}, type: "number", unit: "%", required: false, smartDefault: 3, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Target scrap rate", expertMeaning_i18n: {"en":"Target scrap rate"} },
    { id: "impFactor", label: "Improvement Factor", label_i18n: {"en":"Improvement Factor"}, type: "number", unit: "%", required: false, smartDefault: 20, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Expected improvement", expertMeaning_i18n: {"en":"Expected improvement"} },
  ],
  outputs: [
    { id: "currentScrapRate", label: "Current Scrap Rate", label_i18n: {"en":"Current Scrap Rate"}, unit: "%", format: "percentage" },
    { id: "totalScrapCost", label: "Total Scrap Cost", label_i18n: {"en":"Total Scrap Cost"}, unit: "USD/year", format: "currency", isBigNumber: true },
  ],
  thresholds: [{ fieldId: "currentScrapRate", warning: 5, critical: 10, direction: "higher_is_bad", warningMessage: "Scrap rate > 5% - initiate improvement program.", warningMessage_i18n: {"en":"Scrap rate > 5% - initiate improvement program."}, criticalMessage: "Scrap rate > 10% - urgent process improvement.", criticalMessage_i18n: {"en":"Scrap rate > 10% - urgent process improvement."} }],
  formulaPipeline: [
    { formulaId: "cost.scrap_optimize_total", inputMap: {
        salvage: "salvage",
        scrapMat: "matCost",
        scrapLab: "cycleTime",
        scrapOh: "machRate",
        oppCost: "unitMargin"
      }, outputId: "totalScrapCost" },
  ],
  reportTemplate: { title: "Scrap Rate Optimization Report", title_i18n: {"en":"Scrap Rate Optimization Report"}, sections: ["executive_summary", "loss_breakdown", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.15, volatilityPercent: 15, targetMarginPercent: 20, assumptionNotes: ["ScrapRate = ScrapQty/TotalInput.", "Total = Scrap×(MatCost+Labor+OH+Margin)-Salvage.", "Target = Benchmark×(1-ImpFactor)."],assumptionNotes_i18n:[{"en":"ScrapRate = ScrapQty/TotalInput."},{"en":"Total = Scrap×(MatCost+Labor+OH+Margin)-Salvage."},{"en":"Target = Benchmark×(1-ImpFactor)."}]},
};
