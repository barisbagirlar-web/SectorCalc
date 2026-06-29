/**
 * Tool #36 — Proje Maliyet Tahmini
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const PROJECT_COST_ESTIMATE_ANALYZER_SCHEMA: PremiumCalculatorSchema = {
  id: "project-cost-estimate-analyzer", legacyPaidSlug: "project-cost-estimate-analyzer",
  name: "Proje Maliyet Tahmin Analizi", name_i18n: {"en":"Project Cost Estimate Analysis","tr":"Proje Maliyet Tahmin Analizi", sectorSlug: "construction", category: "cost",
  painStatement: "Proje maliyet tahminindeki hatalar nakit akışı sıkışıklığına, taşeron gecikmelerine ve kar marjının erimesine yol açar.", painStatement_i18n: {"en":"Errors in project cost estimates lead to cash flow constraints, subcontractor delays, and eroding profit margins.","tr":"Proje maliyet tahminindeki hatalar nakit akışı sıkışıklığına, taşeron gecikmelerine ve kar marjının erimesine yol açar.",
  inputs: [
    { id: "directLabor", label: "Direkt İşçilik", label_i18n: {"en":"Direct Labor","tr":"Direkt İşçilik", type: "number", unit: "USD", required: true, smartDefault: 150000, validation: { min: 0 }, helper: "", expertMeaning: "Direct labor costs", expertMeaning_i18n: {"en":"Direct labor costs","tr":"Direct labor costs" },
    { id: "directMaterial", label: "Direkt Malzeme", label_i18n: {"en":"Direkt Malzeme","tr":"Direkt Malzeme"}, type: "number", unit: "USD", required: true, smartDefault: 350000, validation: { min: 0 }, helper: "", expertMeaning: "Direct material costs", expertMeaning_i18n: {"en":"Direct material costs","tr":"Direct material costs" },
    { id: "equipment", label: "Ekipman", label_i18n: {"en":"Ekipman","tr":"Ekipman"}, type: "number", unit: "USD", required: true, smartDefault: 100000, validation: { min: 0 }, helper: "", expertMeaning: "Equipment costs", expertMeaning_i18n: {"en":"Equipment costs","tr":"Equipment costs" },
    { id: "subcontractor", label: "Taşeron", label_i18n: {"en":"Subcontractor","tr":"Taşeron", type: "number", unit: "USD", required: true, smartDefault: 200000, validation: { min: 0 }, helper: "", expertMeaning: "Subcontractor costs", expertMeaning_i18n: {"en":"Subcontractor costs","tr":"Subcontractor costs" },
    { id: "overheadPercent", label: "Genel Gider Oranı", label_i18n: {"en":"Overhead Rate","tr":"Genel Gider Oranı", type: "number", unit: "%", required: true, smartDefault: 15, validation: { min: 0, max: 50 }, helper: "", expertMeaning: "Overhead percentage", expertMeaning_i18n: {"en":"Overhead percentage","tr":"Overhead percentage" },
    { id: "contingencyPercent", label: "Beklenmeyen Gider Oranı", label_i18n: {"en":"Contingency Rate","tr":"Beklenmeyen Gider Oranı", type: "number", unit: "%", required: false, smartDefault: 10, validation: { min: 0, max: 50 }, helper: "", expertMeaning: "Contingency percentage", expertMeaning_i18n: {"en":"Contingency percentage","tr":"Contingency percentage" },
    { id: "actualCost", label: "Gerçekleşen Maliyet", label_i18n: {"en":"Actual Cost","tr":"Gerçekleşen Maliyet", type: "number", unit: "USD", required: false, smartDefault: 900000, validation: { min: 0 }, helper: "", expertMeaning: "Actual cost incurred", expertMeaning_i18n: {"en":"Actual cost incurred","tr":"Actual cost incurred" },
  ],
  outputs: [
    { id: "projectDirectLabor", label: "Direkt İşçilik", label_i18n: {"en":"Direct Labor","tr":"Direkt İşçilik", unit: "USD", format: "currency" },
    { id: "projectDirectMaterial", label: "Direkt Malzeme", label_i18n: {"en":"Direkt Malzeme","tr":"Direkt Malzeme"}, unit: "USD", format: "currency" },
    { id: "projectEquipment", label: "Ekipman", label_i18n: {"en":"Ekipman","tr":"Ekipman"}, unit: "USD", format: "currency" },
    { id: "projectSubcontractor", label: "Taşeron", label_i18n: {"en":"Subcontractor","tr":"Taşeron", unit: "USD", format: "currency" },
    { id: "projectOverhead", label: "Genel Gider", label_i18n: {"en":"Genel Gider","tr":"Genel Gider"}, unit: "USD", format: "currency" },
    { id: "projectContingency", label: "Beklenmeyen Gider", label_i18n: {"en":"Beklenmeyen Gider","tr":"Beklenmeyen Gider"}, unit: "USD", format: "currency" },
    { id: "projectTotalEstimate", label: "Toplam Tahmini Maliyet", label_i18n: {"en":"Toplam Tahmini Maliyet","tr":"Toplam Tahmini Maliyet"}, unit: "USD", format: "currency", isBigNumber: true },
    { id: "projectCostVariance", label: "Maliyet Sapması", label_i18n: {"en":"Maliyet Sapması","tr":"Maliyet Sapması"}, unit: "USD", format: "currency", isBigNumber: true },
  ],
  thresholds: [{ fieldId: "projectCostVariance", warning: 50000, critical: 100000, direction: "higher_is_bad", warningMessage: "Sapma > $50K — bütçe revizyonu düşünülmeli.", warningMessage_i18n: {"en":"Variance > $50K — consider budget revision.","tr":"Sapma > $50K — bütçe revizyonu düşünülmeli.", criticalMessage: "Sapma > $100K — proje maliyet kontrolü acil.", criticalMessage_i18n: {"en":"Variance > $100K — urgent project cost control.","tr":"Sapma > $100K — proje maliyet kontrolü acil." }],
  formulaPipeline: [
    { formulaId: "cost.project_direct_labor", inputMap: { directLabor: "directLabor" }, outputId: "projectDirectLabor" },
    { formulaId: "cost.project_direct_material", inputMap: { directMaterial: "directMaterial" }, outputId: "projectDirectMaterial" },
    { formulaId: "cost.project_equipment", inputMap: { equipment: "equipment" }, outputId: "projectEquipment" },
    { formulaId: "cost.project_subcontractor", inputMap: { subcontractor: "subcontractor" }, outputId: "projectSubcontractor" },
    { formulaId: "cost.project_overhead", inputMap: { directLabor: "directLabor", directMaterial: "directMaterial", equipment: "equipment", subcontractor: "subcontractor", overheadPercent: "overheadPercent" }, outputId: "projectOverhead" },
    { formulaId: "cost.project_contingency", inputMap: { directLabor: "directLabor", directMaterial: "directMaterial", equipment: "equipment", subcontractor: "subcontractor", overheadPercent: "overheadPercent", contingencyPercent: "contingencyPercent" }, outputId: "projectContingency" },
    { formulaId: "cost.project_total_estimate", inputMap: { projectDirectLabor: "projectDirectLabor", projectDirectMaterial: "projectDirectMaterial", projectEquipment: "projectEquipment", projectSubcontractor: "projectSubcontractor", projectOverhead: "projectOverhead", projectContingency: "projectContingency" }, outputId: "projectTotalEstimate" },
    { formulaId: "cost.project_cost_variance", inputMap: { actualCost: "actualCost", projectTotalEstimate: "projectTotalEstimate" }, outputId: "projectCostVariance" },
  ],
  reportTemplate: { title: "Project Cost Estimate Report", title_i18n: {"en":"Project Cost Estimate Report","tr":"Project Cost Estimate Report"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.0, volatilityPercent: 15, targetMarginPercent: 20, assumptionNotes: ["Genel gider = (işçilik+malzeme+ekipman+taşeron) × oran.", "Beklenmeyen = (doğrudan + genel gider) × oran.", "Toplam = tüm kalemlerin toplamı.", "Sapma = gerçekleşen - tahmini."],assumptionNotes_i18n:[{"en":"Overhead = (labor+material+equipment+subcontractor) × rate.","tr":"Genel gider = (işçilik+malzeme+ekipman+taşeron) × oran."},{"en":"Contingency = (direct + overhead) × rate.","tr":"Beklenmeyen = (doğrudan + genel gider) × oran."},{"en":"Total = sum of all items.","tr":"Toplam = tüm kalemlerin toplamı."},{"en":"Variance = actual - estimated.","tr":"Sapma = gerçekleşen - tahmini."}] },
};
