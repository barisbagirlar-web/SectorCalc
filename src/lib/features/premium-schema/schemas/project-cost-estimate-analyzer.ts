/**
 * Tool #36 - Proje Maliyet Tahmini
 */
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const PROJECT_COST_ESTIMATE_ANALYZER_SCHEMA: PremiumCalculatorSchema = {
  id: "project-cost-estimate-analyzer", legacyPaidSlug: "project-cost-estimate-analyzer",
  name: "Project Cost Estimate Analysis", sectorSlug: "construction", category: "cost",
  painStatement: "Errors in project cost estimates lead to cash flow constraints, subcontractor delays, and eroding profit margins.",
  inputs: [
    { id: "directLabor", label: "Direct Labor", type: "number", unit: "USD", required: true, smartDefault: 150000, validation: { min: 0 }, helper: "", expertMeaning: "Direct labor costs" },
    { id: "directMaterial", label: "Direct Material", type: "number", unit: "USD", required: true, smartDefault: 350000, validation: { min: 0 }, helper: "", expertMeaning: "Direct material costs" },
    { id: "equipment", label: "Equipment", type: "number", unit: "USD", required: true, smartDefault: 100000, validation: { min: 0 }, helper: "", expertMeaning: "Equipment costs" },
    { id: "subcontractor", label: "Subcontractor", type: "number", unit: "USD", required: true, smartDefault: 200000, validation: { min: 0 }, helper: "", expertMeaning: "Subcontractor costs" },
    { id: "overheadPercent", label: "Overhead Rate", type: "number", unit: "%", required: true, smartDefault: 15, validation: { min: 0, max: 50 }, helper: "", expertMeaning: "Overhead percentage" },
    { id: "contingencyPercent", label: "Contingency Rate", type: "number", unit: "%", required: false, smartDefault: 10, validation: { min: 0, max: 50 }, helper: "", expertMeaning: "Contingency percentage" },
    { id: "actualCost", label: "Actual Cost", type: "number", unit: "USD", required: false, smartDefault: 900000, validation: { min: 0 }, helper: "", expertMeaning: "Actual cost incurred" },
  ],
  outputs: [
    { id: "projectDirectLabor", label: "Direct Labor", unit: "USD", format: "currency" },
    { id: "projectDirectMaterial", label: "Direct Material", unit: "USD", format: "currency" },
    { id: "projectEquipment", label: "Equipment", unit: "USD", format: "currency" },
    { id: "projectSubcontractor", label: "Subcontractor", unit: "USD", format: "currency" },
    { id: "projectOverhead", label: "Overhead", unit: "USD", format: "currency" },
    { id: "projectContingency", label: "Contingency", unit: "USD", format: "currency" },
    { id: "projectTotalEstimate", label: "Total Estimated Cost", unit: "USD", format: "currency", isBigNumber: true },
    { id: "projectCostVariance", label: "Cost Variance", unit: "USD", format: "currency", isBigNumber: true },
  ],
  thresholds: [{ fieldId: "projectCostVariance", warning: 50000, critical: 100000, direction: "higher_is_bad", warningMessage: "Variance > $50K - consider budget revision.", criticalMessage: "Variance > $100K - urgent project cost control." }],
  formulaPipeline: [
    { formulaId: "cost.project_direct_labor", inputMap: { directLabor: "directLabor" }, outputId: "projectDirectLabor" },
    { formulaId: "cost.project_direct_material", inputMap: { directMaterial: "directMaterial" }, outputId: "projectDirectMaterial" },
    { formulaId: "cost.project_equipment", inputMap: { equipment: "equipment" }, outputId: "projectEquipment" },
    { formulaId: "cost.project_subcontractor", inputMap: { subcontractor: "subcontractor" }, outputId: "projectSubcontractor" },
    { formulaId: "cost.project_overhead", inputMap: { directLabor: "directLabor", directMaterial: "directMaterial", equipment: "equipment", subcontractor: "subcontractor", overheadPercent: "overheadPercent" }, outputId: "projectOverhead" },
    { formulaId: "cost.project_contingency", inputMap: { directLabor: "directLabor", directMaterial: "directMaterial", equipment: "equipment", subcontractor: "subcontractor", projectOverhead: "projectOverhead", contingencyPercent: "contingencyPercent" }, outputId: "projectContingency" },
    { formulaId: "cost.project_total_estimate", inputMap: { projectDirectLabor: "projectDirectLabor", projectDirectMaterial: "projectDirectMaterial", projectEquipment: "projectEquipment", projectSubcontractor: "projectSubcontractor", projectOverhead: "projectOverhead", projectContingency: "projectContingency" }, outputId: "projectTotalEstimate" },
    { formulaId: "cost.project_cost_variance", inputMap: { actualCost: "actualCost", projectTotalEstimate: "projectTotalEstimate" }, outputId: "projectCostVariance" },
  ],
  reportTemplate: { title: "Project Cost Estimate Report", sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.0, volatilityPercent: 15, targetMarginPercent: 20, assumptionNotes: ["Overhead = (labor+material+equipment+subcontractor) x rate.", "Contingency = (direct + overhead) x rate.", "Total = sum of all items.", "Variance = actual - estimated."] },
};
