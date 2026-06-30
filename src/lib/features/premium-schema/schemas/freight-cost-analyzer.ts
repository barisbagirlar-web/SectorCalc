/**
 * Tool #23 — Navlun Maliyeti
 */
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const FREIGHT_COST_SCHEMA: PremiumCalculatorSchema = {
  id: "freight-cost-analyzer", legacyPaidSlug: "freight-cost-analyzer",
  name: "Navlun Maliyeti Analizi", name_i18n: {"en":"Navlun Maliyeti Analizi","tr":"Navlun Maliyeti Analizi"}, sectorSlug: "logistics-transport", category: "cost",
  painStatement: "Navlun maliyetinde ağırlık, bunker, terminal ve gümrük kalemleri ayrı hesaplanmazsa gerçek lojistik maliyeti gizli kalır.", painStatement_i18n: {"en":"Navlun maliyetinde ağırlık, bunker, terminal ve gümrük kalemleri ayrı hesaplanmazsa gerçek lojistik maliyeti gizli kalır.","tr":"Navlun maliyetinde ağırlık, bunker, terminal ve gümrük kalemleri ayrı hesaplanmazsa gerçek lojistik maliyeti gizli kalır."},
  inputs: [
    { id: "grossWeight", label: "Brüt Ağırlık", label_i18n: {"en":"Gross weight in kg","tr":"Brüt Ağırlık"}, type: "number", unit: "kg", required: true, smartDefault: 1500, validation: { min: 0.1 }, helper: "", expertMeaning: "Gross weight in kg", expertMeaning_i18n: {"en":"Gross weight in kg","tr":"brüt ağırlık"} },
    { id: "volumeM3", label: "Hacim", label_i18n: {"en":"Hacim","tr":"Hacim"}, type: "number", unit: "m³", required: true, smartDefault: 5, validation: { min: 0.01 }, helper: "", expertMeaning: "Volume in cubic meters", expertMeaning_i18n: {"en":"Volume in cubic meters","tr":"Volume in cubic meters"} },
    { id: "baseRate", label: "Navlun Baz Fiyat", label_i18n: {"en":"Navlun Baz Fiyat","tr":"Navlun Baz Fiyat"}, type: "number", unit: "USD/kg", required: true, smartDefault: 2.5, validation: { min: 0.01 }, helper: "", expertMeaning: "Base freight rate per kg", expertMeaning_i18n: {"en":"Base freight rate per kg","tr":"Base freight rate per kg"} },
    { id: "bunkerPct", label: "Bunker Ek Yüzdesi", label_i18n: {"en":"Bunker surcharge percentage","tr":"Bunker Ek Yüzdesi"}, type: "number", unit: "%", required: true, smartDefault: 15, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Bunker surcharge percentage", expertMeaning_i18n: {"en":"Bunker surcharge percentage","tr":"bunker ek yüzdesi"} },
    { id: "terminalFee", label: "Terminal İşlem Ücreti", label_i18n: {"en":"Terminal handling fee","tr":"Terminal İşlem Ücreti"}, type: "number", unit: "USD", required: true, smartDefault: 200, validation: { min: 0 }, helper: "", expertMeaning: "Terminal handling fee", expertMeaning_i18n: {"en":"Terminal handling fee","tr":"terminal i̇şlem ücreti"} },
    { id: "customsFee", label: "Gümrük Ücreti", label_i18n: {"en":"Customs clearance fee","tr":"Gümrük Ücreti"}, type: "number", unit: "USD", required: true, smartDefault: 150, validation: { min: 0 }, helper: "", expertMeaning: "Customs clearance fee", expertMeaning_i18n: {"en":"Customs clearance fee","tr":"gümrük ücreti"} },
  ],
  outputs: [
    { id: "chargeableWeight", label: "Taşınabilir Ağırlık", label_i18n: {"en":"Tasnabilir Agrlk","tr":"Taşınabilir Ağırlık"}, unit: "kg", format: "number" },
    { id: "baseFreight", label: "Baz Navlun Bedeli", label_i18n: {"en":"Baz Navlun Bedeli","tr":"Baz Navlun Bedeli"}, unit: "USD", format: "currency" },
    { id: "bunkerSurcharge", label: "Bunker Ek Ücreti", label_i18n: {"en":"Bunker Ek Ucreti","tr":"Bunker Ek Ücreti"}, unit: "USD", format: "currency" },
    { id: "terminalCost", label: "Terminal Maliyeti", label_i18n: {"en":"Terminal Maliyeti","tr":"Terminal Maliyeti"}, unit: "USD", format: "currency" },
    { id: "customsCost", label: "Gümrük Maliyeti", label_i18n: {"en":"Gumruk Maliyeti","tr":"Gümrük Maliyeti"}, unit: "USD", format: "currency" },
    { id: "totalFreightCost", label: "Toplam Navlun Maliyeti", label_i18n: {"en":"Toplam Navlun Maliyeti","tr":"Toplam Navlun Maliyeti"}, unit: "USD", format: "currency" },
    { id: "costPerUnit", label: "Birim Başına Navlun", label_i18n: {"en":"Birim Basna Navlun","tr":"Birim Başına Navlun"}, unit: "USD/kg", format: "currency" },
  ],
  thresholds: [{ fieldId: "totalFreightCost", warning: 3000, critical: 8000, direction: "higher_is_bad", warningMessage: "Toplam navlun > $3K — alternatif taşımacılık modları değerlendirilmeli.", warningMessage_i18n: {"en":"Toplam navlun > $3K — alternatif taşımacılık modları değerlendirilmeli.","tr":"Toplam navlun > $3K — alternatif taşımacılık modları değerlendirilmeli."}, criticalMessage: "Toplam navlun > $8K — lojistik ihalesi yenilenmeli.", criticalMessage_i18n: {"en":"Toplam navlun > $8K — lojistik ihalesi yenilenmeli.","tr":"Toplam navlun > $8K — lojistik ihalesi yenilenmeli."} }],
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
  reportTemplate: { title: "Freight Cost Analysis Report", title_i18n: {"en":"Freight Cost Analysis Report","tr":"Freight Cost Analysis Report"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.1, volatilityPercent: 10, targetMarginPercent: 15, assumptionNotes: ["Taşınabilir ağırlık = max(brüt ağırlık, hacim × 167).", "Bunker = baz navlun × bunker yüzdesi.", "Toplam = baz + bunker + terminal + gümrük."],assumptionNotes_i18n:[{"en":"Taşınabilir ağırlık = max(brüt ağırlık, hacim × 167).","tr":"Taşınabilir ağırlık = max(brüt ağırlık, hacim × 167)."},{"en":"Bunker = baz navlun × bunker yüzdesi.","tr":"Bunker = baz navlun × bunker yüzdesi."},{"en":"Toplam = baz + bunker + terminal + gümrük.","tr":"Toplam = baz + bunker + terminal + gümrük."}] },
};
