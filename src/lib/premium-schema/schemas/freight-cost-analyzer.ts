/**
 * Tool #23 — Navlun Maliyeti
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const FREIGHT_COST_SCHEMA: PremiumCalculatorSchema = {
  id: "freight-cost-analyzer", legacyPaidSlug: "freight-cost-analyzer",
  name: "Navlun Maliyeti Analizi", sectorSlug: "logistics-transport", category: "cost",
  painStatement: "Navlun maliyetinde ağırlık, bunker, terminal ve gümrük kalemleri ayrı hesaplanmazsa gerçek lojistik maliyeti gizli kalır.",
  inputs: [
    { id: "grossWeight", label: "Brüt Ağırlık", type: "number", unit: "kg", required: true, smartDefault: 1500, validation: { min: 0.1 }, helper: "", expertMeaning: "Gross weight in kg" },
    { id: "volumeM3", label: "Hacim", type: "number", unit: "m³", required: true, smartDefault: 5, validation: { min: 0.01 }, helper: "", expertMeaning: "Volume in cubic meters" },
    { id: "baseRate", label: "Navlun Baz Fiyat", type: "number", unit: "USD/kg", required: true, smartDefault: 2.5, validation: { min: 0.01 }, helper: "", expertMeaning: "Base freight rate per kg" },
    { id: "bunkerPct", label: "Bunker Ek Yüzdesi", type: "number", unit: "%", required: true, smartDefault: 15, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Bunker surcharge percentage" },
    { id: "terminalFee", label: "Terminal İşlem Ücreti", type: "number", unit: "USD", required: true, smartDefault: 200, validation: { min: 0 }, helper: "", expertMeaning: "Terminal handling fee" },
    { id: "customsFee", label: "Gümrük Ücreti", type: "number", unit: "USD", required: true, smartDefault: 150, validation: { min: 0 }, helper: "", expertMeaning: "Customs clearance fee" },
  ],
  outputs: [
    { id: "chargeableWeight", label: "Taşınabilir Ağırlık", unit: "kg", format: "number" },
    { id: "baseFreight", label: "Baz Navlun Bedeli", unit: "USD", format: "currency" },
    { id: "bunkerSurcharge", label: "Bunker Ek Ücreti", unit: "USD", format: "currency" },
    { id: "terminalCost", label: "Terminal Maliyeti", unit: "USD", format: "currency" },
    { id: "customsCost", label: "Gümrük Maliyeti", unit: "USD", format: "currency" },
    { id: "totalFreightCost", label: "Toplam Navlun Maliyeti", unit: "USD", format: "currency" },
    { id: "costPerUnit", label: "Birim Başına Navlun", unit: "USD/kg", format: "currency" },
  ],
  thresholds: [{ fieldId: "totalFreightCost", warning: 3000, critical: 8000, direction: "higher_is_bad", warningMessage: "Toplam navlun > $3K — alternatif taşımacılık modları değerlendirilmeli.", criticalMessage: "Toplam navlun > $8K — lojistik ihalesi yenilenmeli." }],
  formulaPipeline: [
    { formulaId: "measurement.chargeable_weight", inputMap: { grossWeight: "grossWeight", volumeM3: "volumeM3" }, outputId: "chargeableWeight" },
    { formulaId: "cost.base_freight", inputMap: { chargeableWeight: "chargeableWeight", baseRate: "baseRate" }, outputId: "baseFreight" },
    { formulaId: "cost.bunker_surcharge", inputMap: { baseFreight: "baseFreight", bunkerPct: "bunkerPct" }, outputId: "bunkerSurcharge" },
    { formulaId: "cost.terminal_handling", inputMap: { terminalFee: "terminalFee" }, outputId: "terminalCost" },
    { formulaId: "cost.customs_clearance", inputMap: { customsFee: "customsFee" }, outputId: "customsCost" },
    { formulaId: "cost.total_freight_cost", inputMap: { baseFreight: "baseFreight", bunkerSurcharge: "bunkerSurcharge", terminalCost: "terminalCost", customsCost: "customsCost" }, outputId: "totalFreightCost" },
    { formulaId: "measurement.freight_cost_per_unit", inputMap: { totalFreightCost: "totalFreightCost", chargeableWeight: "chargeableWeight" }, outputId: "costPerUnit" },
  ],
  reportTemplate: { title: "Freight Cost Analysis Report", sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.1, volatilityPercent: 10, targetMarginPercent: 15, assumptionNotes: ["Taşınabilir ağırlık = max(brüt ağırlık, hacim × 167).", "Bunker = baz navlun × bunker yüzdesi.", "Toplam = baz + bunker + terminal + gümrük."] },
};
