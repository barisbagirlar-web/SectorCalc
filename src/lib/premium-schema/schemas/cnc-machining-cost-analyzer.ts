/**
 * Tool #23 — CNC İşleme Maliyeti
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const CNC_MACHINING_COST_SCHEMA: PremiumCalculatorSchema = {
  id: "cnc-machining-cost-analyzer", legacyPaidSlug: "cnc-machining-cost-analyzer",
  name: "CNC İşleme Birim Maliyet Analizi", sectorSlug: "cnc-manufacturing", category: "cost",
  painStatement: "CNC parça maliyetini malzeme, işleme, takım, enerji ve genel gider olarak ayrıştırmadan yapılan fiyatlama marj kaybına yol açar.",
  inputs: [
    { id: "rawVolume", label: "Hammadde Hacmi", type: "number", unit: "cm³", required: true, smartDefault: 500, validation: { min: 0.1 }, helper: "", expertMeaning: "Raw material volume per part" },
    { id: "density", label: "Malzeme Yoğunluğu", type: "number", unit: "g/cm³", required: true, smartDefault: 7.85, validation: { min: 0.1 }, helper: "", expertMeaning: "Material density" },
    { id: "pricePerKg", label: "Malzeme Birim Fiyatı", type: "number", unit: "USD/kg", required: true, smartDefault: 2.5, validation: { min: 0.01 }, helper: "", expertMeaning: "Material price per kg" },
    { id: "scrapRate", label: "Fire Oranı", type: "number", unit: "%", required: false, smartDefault: 5, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Material scrap rate" },
    { id: "totalTime", label: "Toplam İşleme Süresi", type: "number", unit: "dak", required: true, smartDefault: 5, validation: { min: 0.1 }, helper: "", expertMeaning: "Total machining time per part" },
    { id: "machineRate", label: "Makine Saat Ücreti", type: "number", unit: "USD/saat", required: true, smartDefault: 85, validation: { min: 1 }, helper: "", expertMeaning: "Machine hourly rate" },
    { id: "cutTime", label: "Kesme Süresi (T_cut)", type: "number", unit: "dak", required: false, smartDefault: 3, validation: { min: 0 }, helper: "", expertMeaning: "Actual cutting time" },
    { id: "toolLife", label: "Takım Ömrü", type: "number", unit: "dak", required: false, smartDefault: 60, validation: { min: 0 }, helper: "", expertMeaning: "Tool life in minutes" },
    { id: "toolCost", label: "Takım Maliyeti", type: "number", unit: "USD", required: false, smartDefault: 50, validation: { min: 0 }, helper: "", expertMeaning: "Cost per cutting edge" },
    { id: "machinePower", label: "Makine Gücü", type: "number", unit: "kW", required: false, smartDefault: 15, validation: { min: 0 }, helper: "", expertMeaning: "Machine spindle power" },
    { id: "elecRate", label: "Elektrik Tarifesi", type: "number", unit: "USD/kWh", required: false, smartDefault: 0.12, validation: { min: 0 }, helper: "", expertMeaning: "Electricity unit cost" },
    { id: "overheadRate", label: "Genel Gider Oranı", type: "number", unit: "USD/saat", required: false, smartDefault: 20, validation: { min: 0 }, helper: "", expertMeaning: "Overhead allocation rate" },
    { id: "qualityCost", label: "Kalite Maliyeti", type: "number", unit: "USD", required: false, smartDefault: 0.5, validation: { min: 0 }, helper: "", expertMeaning: "Inspection/rework per part" },
  ],
  outputs: [
    { id: "materialCost", label: "Malzeme Maliyeti", unit: "USD", format: "currency" },
    { id: "machiningCost", label: "İşleme Maliyeti", unit: "USD", format: "currency" },
    { id: "toolingCost", label: "Takım Maliyeti", unit: "USD", format: "currency" },
    { id: "energyCost", label: "Enerji Maliyeti", unit: "USD", format: "currency" },
    { id: "overheadCost", label: "Genel Gider", unit: "USD", format: "currency" },
    { id: "totalUnitCost", label: "Toplam Birim Maliyet", unit: "USD", format: "currency", isBigNumber: true },
  ],
  thresholds: [
    { fieldId: "totalUnitCost", warning: 15, critical: 30, direction: "higher_is_bad", warningMessage: "Birim maliyet > $15 — maliyet optimizasyonu değerlendirilmeli.", criticalMessage: "Birim maliyet > $30 — alternatif proses/malzeme düşünülmeli." },
  ],
  formulaPipeline: [
    { formulaId: "cost.cnc_material", inputMap: { rawVolume: "rawVolume", density: "density", pricePerKg: "pricePerKg", scrapRate: "scrapRate" }, outputId: "materialCost" },
    { formulaId: "cost.cnc_machining", inputMap: { totalTime: "totalTime", machineRate: "machineRate" }, outputId: "machiningCost" },
    { formulaId: "cost.cnc_tooling", inputMap: { cutTime: "cutTime", toolLife: "toolLife", toolCost: "toolCost" }, outputId: "toolingCost" },
    { formulaId: "cost.cnc_energy", inputMap: { machinePower: "machinePower", totalTime: "totalTime", elecRate: "elecRate" }, outputId: "energyCost" },
    { formulaId: "cost.cnc_overhead", inputMap: { totalTime: "totalTime", overheadRate: "overheadRate" }, outputId: "overheadCost" },
    { formulaId: "cost.cnc_total_unit", inputMap: { materialCost: "materialCost", machiningCost: "machiningCost", toolingCost: "toolingCost", energyCost: "energyCost", overheadCost: "overheadCost", qualityCost: "qualityCost" }, outputId: "totalUnitCost" },
  ],
  reportTemplate: { title: "CNC Machining Cost Report", sections: ["executive_summary", "loss_breakdown", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.15, volatilityPercent: 10, targetMarginPercent: 20, assumptionNotes: ["Mat = Vol×Density×Price×(1+Scrap%).", "Machining = T_total×MachineRate/60. Tooling = (T_cut/ToolLife)×ToolCost.", "Energy = Power×T_total/60×ElecRate."] },
};
