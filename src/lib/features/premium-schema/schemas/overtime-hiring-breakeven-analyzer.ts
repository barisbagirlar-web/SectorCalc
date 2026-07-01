/**
 * Tool #29 — Overtime vs Hiring Basabas
 */
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const OVERTIME_HIRING_BREAKEVEN_SCHEMA: PremiumCalculatorSchema = {
  id: "overtime-hiring-breakeven-analyzer", legacyPaidSlug: "overtime-hiring-breakeven-analyzer",
  name: "Overtime vs Hiring Breakeven", sectorSlug: "cnc-manufacturing", category: "cost",
  painStatement: "Is overtime or hiring a new worker more advantageous? A wrong decision inflates production costs and reduces profitability.",
  inputs: [
    { id: "overtimeRate", label: "Hourly overtime premium rate", type: "number", unit: "USD/hr", required: true, smartDefault: 30, validation: { min: 1 }, helper: "", expertMeaning: "Hourly overtime premium rate" },
    { id: "hiringCost", label: "Total hiring cost per worker", type: "number", unit: "USD", required: true, smartDefault: 3500, validation: { min: 1 }, helper: "", expertMeaning: "Total hiring cost per worker" },
    { id: "annualSalary", label: "Annual gross salary per hire", type: "number", unit: "USD/yr", required: true, smartDefault: 42000, validation: { min: 1 }, helper: "", expertMeaning: "Annual gross salary per hire" },
    { id: "overtimeHoursPerMonth", label: "Monthly overtime hours per worker", type: "number", unit: "hr/mo", required: true, smartDefault: 40, validation: { min: 1 }, helper: "", expertMeaning: "Monthly overtime hours per worker" },
    { id: "qualityDefectRate", label: "Additional defect rate from overtime", type: "number", unit: "%", required: false, smartDefault: 5, validation: { min: 0 }, helper: "", expertMeaning: "Additional defect rate from overtime" },
  ],
  outputs: [
    { id: "otCostHour", label: "Overtime Unit Cost", unit: "USD/hr", format: "currency" },
    { id: "hiringTotalCost", label: "Total Hiring Cost", unit: "USD", format: "currency" },
    { id: "annualNewHireCost", label: "Annual New Hire Cost", unit: "USD/yr", format: "currency" },
    { id: "breakevenHours", label: "Breakeven Threshold Hours", unit: "hr/mo", format: "number", isBigNumber: true },
    { id: "otHireDecision", label: "Decision", unit: "", format: "score" },
  ],
  thresholds: [{ fieldId: "breakevenHours", warning: 40, critical: 80, direction: "higher_is_bad", warningMessage: "Threshold > 40 hours — consider new hire.", criticalMessage: "Threshold > 80 hours — new hire unavoidable." }],
  formulaPipeline: [
    { formulaId: "cost.ot_cost_hour", inputMap: {
        baseRate: "overtimeRate",
        otMultiplier: "qualityDefectRate"
      }, outputId: "otCostHour" },
    { formulaId: "cost.hiring_total_cost", inputMap: {
        advertising: "hiringCost"
      ,
        recruiting: "recruiting",
        training: "training",
        onboarding: "onboarding"}, outputId: "hiringTotalCost" },
    { formulaId: "cost.annual_new_hire_cost", inputMap: {
        hiringTotalCost: "hiringTotalCost",
        salary: "annualSalary"
      ,
        benefits: "benefits"}, outputId: "annualNewHireCost" },
    { formulaId: "measurement.breakeven_hours_base", inputMap: { annualNewHireCost: "annualNewHireCost", otCostHour: "otCostHour" }, outputId: "breakevenHours" },
    { formulaId: "measurement.ot_hire_decision", inputMap: { overtimeHoursPerMonth: "overtimeHoursPerMonth", breakevenHours: "breakevenHours" ,
        annualOtHours: "annualOtHours"}, outputId: "otHireDecision" },
  ],
  reportTemplate: { title: "Overtime vs Hiring Report", sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.0, volatilityPercent: 10, targetMarginPercent: 10, assumptionNotes: ["OT cost = hourly rate × 1.5 + quality impact.", "Hiring cost: ads, interview, training, lost productivity.", "Annual cost = salary + hiring amortization.", "Breakeven = annual cost / OT unit cost / 12."] },
};
