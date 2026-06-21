/**
 * Navlun Maliyeti — Premium Calculator Schema
 * Auto-generated from user-provided formulas
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const FREIGHTCOST_SCHEMA: PremiumCalculatorSchema = {
  id: "freight-cost-analyzer",
  legacyPaidSlug: "freight-cost-analyzer",
  name: "Navlun Maliyeti",
  sectorSlug: "general",
  category: "cost",
  painStatement: "Navlun Maliyeti — premium analysis tool.",
  inputs: [
    { id: "bruthacimsel_agirlik", label: "Brüt/Hacimsel Ağırlık", type: "number", required: true },
    { id: "navlun_kg_fiyati", label: "Navlun kg Fiyatı", type: "number", required: true },
    { id: "kiymet", label: "Kıymet", type: "number", required: true },
    { id: "gumruk_vergisi", label: "Gümrük Vergisi", type: "number", required: true },
    { id: "thc", label: "THC", type: "number", required: true },
    { id: "baf_orani", label: "BAF Oranı", type: "number", required: true },
    { id: "guvenlik_ucreti", label: "Güvenlik Ücreti", type: "number", required: true },
    { id: "sabit_gumrukcu_bedeli", label: "Sabit Gümrükçü Bedeli", type: "number", required: true },
  ],
  outputs: [
    { id: "chargeable_weight", label: "Chargeable Weight", unit: "currency", format: "currency" },
    { id: "base_freight", label: "Base Freight", unit: "currency", format: "currency" },
    { id: "bunker_surcharge", label: "Bunker Surcharge", unit: "currency", format: "currency" },
    { id: "security_fee", label: "Security Fee", unit: "currency", format: "currency" },
    { id: "terminal_handling", label: "Terminal Handling", unit: "currency", format: "currency" },
    { id: "customs_clearance", label: "Customs Clearance", unit: "currency", format: "currency" },
    { id: "total_freight_cost", label: "Total Freight Cost", unit: "currency", format: "currency" },
    { id: "cost_per_unit", label: "Cost Per Unit", unit: "currency", format: "currency" },
  ],
  thresholds: [],
  formulaPipeline: [
    { formulaId: "custom.navlun_maliyeti_analyzer_0", inputMap: { GrossWeight: "gross_weight", VolumetricWeight: "volumetric_weight" }, outputId: "chargeable_weight" },
    { formulaId: "custom.navlun_maliyeti_analyzer_1", inputMap: { ChargeableWeight: "chargeable_weight", RatePerKg: "rate_per_kg" }, outputId: "base_freight" },
    { formulaId: "custom.navlun_maliyeti_analyzer_2", inputMap: { BaseFreight: "base_freight", BAF_Pct: "b_a_f__pct" }, outputId: "bunker_surcharge" },
    { formulaId: "custom.navlun_maliyeti_analyzer_3", inputMap: { ChargeableWeight: "chargeable_weight", SecurityRate: "security_rate" }, outputId: "security_fee" },
    { formulaId: "custom.navlun_maliyeti_analyzer_4", inputMap: { Units: "units", THC_Rate: "thc" }, outputId: "terminal_handling" },
    { formulaId: "custom.navlun_maliyeti_analyzer_5", inputMap: { FixedFee: "fixed_fee", Value: "value", DutyPct: "duty_pct" }, outputId: "customs_clearance" },
    { formulaId: "custom.navlun_maliyeti_analyzer_6", inputMap: { BaseFreight: "base_freight", BunkerSurcharge: "bunker_surcharge", SecurityFee: "security_fee", TerminalHandling: "terminal_handling", CustomsClearance: "customs_clearance" }, outputId: "total_freight_cost" },
    { formulaId: "custom.navlun_maliyeti_analyzer_7", inputMap: { TotalFreightCost: "total_freight_cost", TotalUnits: "total_units" }, outputId: "cost_per_unit" },
  ],
  reportTemplate: {
    title: "Navlun Maliyeti Report",
    sections: ["executive_summary", "loss_breakdown", "thresholds", "action_plan"],
    exportFormats: ["pdf"],
  },
  assumptions: {
    hiddenLossMultiplier: 1.0,
    volatilityPercent: 10,
    targetMarginPercent: 20,
    assumptionNotes: ["Based on user-provided formulas.", "Verify constants periodically."],
  },
};
