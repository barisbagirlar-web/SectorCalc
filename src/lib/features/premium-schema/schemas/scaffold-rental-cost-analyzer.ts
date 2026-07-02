
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const SCAFFOLD_RENTAL_SCHEMA: PremiumCalculatorSchema = {
  id: "scaffold-rental-cost-analyzer", legacyPaidSlug: "scaffold-rental-cost-analyzer",
  name: "Scaffold Rental & Duration Optimization", name_i18n: {"en":"Scaffold Rental & Duration Optimization"}, sectorSlug: "construction", category: "cost",
  painStatement: "If scaffold rental duration and area are not optimized, unnecessary rent, labor, and transportation costs occur.", painStatement_i18n: {"en":"If scaffold rental duration and area are not optimized, unnecessary rent, labor, and transportation costs occur."},
  inputs: [
    { id: "buildingPerimeter", label: "Building perimeter", label_i18n: {"en":"Building perimeter"}, type: "number", unit: "m", required: true, smartDefault: 80, validation: { min: 1 }, helper: "", expertMeaning: "Building perimeter", expertMeaning_i18n: {"en":"Building perimeter"} },
    { id: "buildingHeight", label: "Building height", label_i18n: {"en":"Building height"}, type: "number", unit: "m", required: true, smartDefault: 15, validation: { min: 1 }, helper: "", expertMeaning: "Building height", expertMeaning_i18n: {"en":"Building height"} },
    { id: "rentalRatePerM2", label: "Rental Rate per m²", label_i18n: {"en":"Rental Rate per m²"}, type: "number", unit: "USD/m²/ay", required: true, smartDefault: 8, validation: { min: 0 }, helper: "", expertMeaning: "Monthly rental rate per m²", expertMeaning_i18n: {"en":"Monthly rental rate per m²"} },
    { id: "rentalDuration", label: "Rental duration", label_i18n: {"en":"Rental duration"}, type: "number", unit: "months", required: true, smartDefault: 6, validation: { min: 0.5 }, helper: "", expertMeaning: "Rental duration", expertMeaning_i18n: {"en":"Rental duration"} },
    { id: "erectionRate", label: "Erection labor rate per m²", label_i18n: {"en":"Erection labor rate per m²"}, type: "number", unit: "USD/m²", required: false, smartDefault: 5, validation: { min: 0 }, helper: "", expertMeaning: "Erection labor rate per m²", expertMeaning_i18n: {"en":"Erection labor rate per m²"} },
    { id: "dismantleRate", label: "Dismantle labor rate per m²", label_i18n: {"en":"Dismantle labor rate per m²"}, type: "number", unit: "USD/m²", required: false, smartDefault: 3, validation: { min: 0 }, helper: "", expertMeaning: "Dismantle labor rate per m²", expertMeaning_i18n: {"en":"Dismantle labor rate per m²"} },
    { id: "transportCost", label: "Transportation Cost", label_i18n: {"en":"Transportation Cost"}, type: "number", unit: "USD", required: false, smartDefault: 2000, validation: { min: 0 }, helper: "", expertMeaning: "Transport cost", expertMeaning_i18n: {"en":"Transport cost"} },
    { id: "overrunCost", label: "Overrun extension cost", label_i18n: {"en":"Overrun extension cost"}, type: "number", unit: "USD", required: false, smartDefault: 1500, validation: { min: 0 }, helper: "", expertMeaning: "Overrun extension cost", expertMeaning_i18n: {"en":"Overrun extension cost"} },
  ],
  outputs: [
    { id: "scaffoldArea", label: "Iskele Alan", label_i18n: {"en":"Iskele Alan"}, unit: "m²", format: "number" },
    { id: "rental", label: "Rental Cost", label_i18n: {"en":"Rental Cost"}, unit: "USD", format: "currency" },
    { id: "laborCost", label: "Labor Cost", label_i18n: {"en":"Labor Cost"}, unit: "USD", format: "currency" },
    { id: "total", label: "Total Iskele Cost", label_i18n: {"en":"Total Iskele Cost"}, unit: "USD", format: "currency", isBigNumber: true },
  ],
  thresholds: [{ fieldId: "total", warning: 50000, critical: 100000, direction: "higher_is_bad", warningMessage: "Cost > $50K — rental duration or area should be optimized.", warningMessage_i18n: {"en":"Cost > $50K — rental duration or area should be optimized."}, criticalMessage: "Cost > $100K — alternative scaffolding system should be evaluated.", criticalMessage_i18n: {"en":"Cost > $100K — alternative scaffolding system should be evaluated."} }],
  formulaPipeline: [
    { formulaId: "measurement.scaffold_area", inputMap: { buildingPerimeter: "buildingPerimeter", buildingHeight: "buildingHeight" }, outputId: "scaffoldArea" },
    { formulaId: "cost.scaffold_rental", inputMap: { scaffoldArea: "scaffoldArea", rentalRatePerM2: "rentalRatePerM2", rentalDuration: "rentalDuration" }, outputId: "rental" },
    { formulaId: "cost.scaffold_labor", inputMap: { scaffoldArea: "scaffoldArea", erectionRate: "erectionRate", dismantleRate: "dismantleRate" }, outputId: "laborCost" },
    { formulaId: "cost.scaffold_total", inputMap: {
        rental: "rental",
        laborCost: "laborCost",
        transportCost: "transportCost",
        overrunCost: "overrunCost"
      }, outputId: "total" },
  ],
  reportTemplate: { title: "Scaffold Rental Cost Report", title_i18n: {"en":"Scaffold Rental Cost Report"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.15, volatilityPercent: 15, targetMarginPercent: 20, assumptionNotes: ["Area = Perimeter × Height.", "Rental = Area×Rate×Dur. Labor = Area×(Erect+Dism).", "Total = Rental+Labor+Transport+Overrun."],assumptionNotes_i18n:[{"en":"Area = Perimeter × Height."},{"en":"Rental = Area×Rate×Dur. Labor = Area×(Erect+Dism)."},{"en":"Total = Rental+Labor+Transport+Overrun."}] },
};
