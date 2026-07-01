/**
 * Tool #23 — Navlun Maliyeti
 */
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const FREIGHT_COST_SCHEMA: PremiumCalculatorSchema = {
  id: "freight-cost-analyzer", legacyPaidSlug: "freight-cost-analyzer",
  name: "Freight Cost Analyzer", name_i18n: {"en":"Freight Cost Analyzer"}, sectorSlug: "logistics-transport", category: "cost",
  painStatement: "Navlun maliyetinde ağırlık, bunker, terminal ve gümrük kalemleri ayrı hesaplanmazsa gerçek lojistik maliyeti gizli kalır.", painStatement_i18n: {"en":"freight maliyetinde Weight, bunker, terminal ve customs kalemleri ayrı if not calculated Actual logistics Cost latent kalır."},
  inputs: [
    { id: "grossWeight", label: "Gross weight in kg", label_i18n: {"en":"Gross weight in kg"}, type: "number", unit: "kg", required: true, smartDefault: 1500, validation: { min: 0.1 }, helper: "", expertMeaning: "Gross weight in kg", expertMeaning_i18n: {"en":"Gross weight in kg"} },
    { id: "volumeM3", label: "Hacim", label_i18n: {"en":"Hacim"}, type: "number", unit: "m³", required: true, smartDefault: 5, validation: { min: 0.01 }, helper: "", expertMeaning: "Volume in cubic meters", expertMeaning_i18n: {"en":"Volume in cubic meters"} },
    { id: "baseRate", label: "Navlun Baz Fiyat", label_i18n: {"en":"freight Base Fiyat"}, type: "number", unit: "USD/kg", required: true, smartDefault: 2.5, validation: { min: 0.01 }, helper: "", expertMeaning: "Base freight rate per kg", expertMeaning_i18n: {"en":"Base freight rate per kg"} },
    { id: "bunkerPct", label: "Bunker Ek Yüzdesi", label_i18n: {"en":"Bunker surcharge percentage"}, type: "number", unit: "%", required: true, smartDefault: 15, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Bunker surcharge percentage", expertMeaning_i18n: {"en":"Bunker surcharge percentage"} },
    { id: "terminalFee", label: "Terminal handling fee", label_i18n: {"en":"Terminal handling fee"}, type: "number", unit: "USD", required: true, smartDefault: 200, validation: { min: 0 }, helper: "", expertMeaning: "Terminal handling fee", expertMeaning_i18n: {"en":"Terminal handling fee"} },
    { id: "customsFee", label: "Gümrük Ücreti", label_i18n: {"en":"Customs clearance fee"}, type: "number", unit: "USD", required: true, smartDefault: 150, validation: { min: 0 }, helper: "", expertMeaning: "Customs clearance fee", expertMeaning_i18n: {"en":"Customs clearance fee"} },
  ],
  outputs: [
    { id: "chargeableWeight", label: "Tasnabilir Agrlk", label_i18n: {"en":"Tasnabilir Weight"}, unit: "kg", format: "number" },
    { id: "baseFreight", label: "Baz Navlun Bedeli", label_i18n: {"en":"Base freight Bedeli"}, unit: "USD", format: "currency" },
    { id: "bunkerSurcharge", label: "Bunker Ek Ücreti", label_i18n: {"en":"Bunker Ek Rate"}, unit: "USD", format: "currency" },
    { id: "terminalCost", label: "Terminal Maliyeti", label_i18n: {"en":"Terminal Cost"}, unit: "USD", format: "currency" },
    { id: "customsCost", label: "Gümrük Maliyeti", label_i18n: {"en":"customs Cost"}, unit: "USD", format: "currency" },
    { id: "totalFreightCost", label: "Toplam Navlun Maliyeti", label_i18n: {"en":"Total freight Cost"}, unit: "USD", format: "currency" },
    { id: "costPerUnit", label: "Birim Basna Navlun", label_i18n: {"en":"Unit Per freight"}, unit: "USD/kg", format: "currency" },
  ],
  thresholds: [{ fieldId: "totalFreightCost", warning: 3000, critical: 8000, direction: "higher_is_bad", warningMessage: "Toplam navlun > $3K — alternatif taşımacılık modları değerlendirilmeli.", warningMessage_i18n: {"en":"Total freight > $3K — alternatif taşımacılık modları değerlendirilmeli."}, criticalMessage: "Toplam navlun > $8K — lojistik ihalesi yenilenmeli.", criticalMessage_i18n: {"en":"Total freight > $8K — logistics ihalesi yenilenmeli."} }],
  formulaPipeline: [
    { formulaId: "measurement.chargeable_weight", inputMap: {
        actualWeight: "grossWeight",
        volumetricWeight: "volumeM3"
      }, outputId: "chargeableWeight" },
    { formulaId: "cost.base_freight", inputMap: {
        chargeableWeight: "chargeableWeight",
        ratePerKg: "baseRate"
      }, outputId: "baseFreight" },
    { formulaId: "cost.bunker_surcharge", inputMap: { baseFreight: "baseFreight", bunkerPct: "bunkerPct" }, outputId: "bunkerSurcharge" },
    { formulaId: "cost.terminal_handling", inputMap: {
        chargeableWeight: "terminalFee"
      ,
        handlingRate: "handlingRate"}, outputId: "terminalCost" },
    { formulaId: "cost.customs_clearance", inputMap: {
        declaredValue: "customsFee"
      ,
        customsRate: "customsRate"}, outputId: "customsCost" },
    { formulaId: "cost.total_freight_cost", inputMap: {
        baseFreight: "baseFreight",
        bunkerSurcharge: "bunkerSurcharge",
        terminalHandling: "terminalCost",
        customsClearance: "customsCost"
      ,
        insurance: "insurance"}, outputId: "totalFreightCost" },
    { formulaId: "measurement.freight_cost_per_unit", inputMap: {
        totalFreightCost: "totalFreightCost",
        unitCount: "chargeableWeight"
      }, outputId: "costPerUnit" },
  ],
  reportTemplate: { title: "Freight Cost Analysis Report", title_i18n: {"en":"Freight Cost Analysis Report"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.1, volatilityPercent: 10, targetMarginPercent: 15, assumptionNotes: ["Taşınabilir ağırlık = max(brüt ağırlık, hacim × 167).", "Bunker = baz navlun × bunker yüzdesi.", "Toplam = baz + bunker + terminal + gümrük."],assumptionNotes_i18n:[{"en":"Taşınabilir ağırlık = max(brüt ağırlık, hacim × 167)."},{"en":"Bunker = baz navlun × bunker yüzdesi."},{"en":"Toplam = baz + bunker + terminal + gümrük."}] },
};
