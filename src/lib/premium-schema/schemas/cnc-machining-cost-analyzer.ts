/**
 * Tool #23 — CNC İşleme Maliyeti
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const CNC_MACHINING_COST_SCHEMA: PremiumCalculatorSchema = {
  id: "cnc-machining-cost-analyzer", legacyPaidSlug: "cnc-machining-cost-analyzer",
  name: "CNC İşleme Birim Maliyet Analizi", name_i18n: {"en":"CNC Machining Unit Cost Analysis","tr":"CNC İşleme Birim Maliyet Analizi"}, sectorSlug: "cnc-manufacturing", category: "cost",
  painStatement: "CNC parça maliyetini malzeme, işleme, takım, enerji ve genel gider olarak ayrıştırmadan yapılan fiyatlama marj kaybına yol açar.", painStatement_i18n: {"en":"Pricing without breaking down CNC part cost into material, machining, tooling, energy, and overhead leads to margin loss.","tr":"CNC parça maliyetini malzeme, işleme, takım, enerji ve genel gider olarak ayrıştırmadan yapılan fiyatlama marj kaybına yol açar."},
  inputs: [
    { id: "rawVolume", label: "Hammadde Hacmi", label_i18n: {"en":"Raw Material Volume","tr":"Hammadde Hacmi"}, type: "number", unit: "cm³", required: true, smartDefault: 500, validation: { min: 0.1 }, helper: "", expertMeaning: "Raw material volume per part", expertMeaning_i18n: {"en":"Raw material volume per part","tr":"Parça başı hammadde hacmi"} },
    { id: "density", label: "Malzeme Yoğunluğu", label_i18n: {"en":"Material Density","tr":"Malzeme Yoğunluğu"}, type: "number", unit: "g/cm³", required: true, smartDefault: 7.85, validation: { min: 0.1 }, helper: "", expertMeaning: "Material density", expertMeaning_i18n: {"en":"Material density","tr":"Malzeme yoğunluğu"} },
    { id: "pricePerKg", label: "Malzeme Birim Fiyatı", label_i18n: {"en":"Material Unit Price","tr":"Malzeme Birim Fiyatı"}, type: "number", unit: "USD/kg", required: true, smartDefault: 2.5, validation: { min: 0.01 }, helper: "", expertMeaning: "Material price per kg", expertMeaning_i18n: {"en":"Material price per kg","tr":"Kg başına malzeme fiyatı"} },
    { id: "scrapRate", label: "Fire Oranı", label_i18n: {"en":"Scrap Rate","tr":"Fire Oranı"}, type: "number", unit: "%", required: false, smartDefault: 5, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Material scrap rate", expertMeaning_i18n: {"en":"Material scrap rate","tr":"Malzeme fire oranı"} },
    { id: "totalTime", label: "Toplam İşleme Süresi", label_i18n: {"en":"Total Machining Time","tr":"Toplam İşleme Süresi"}, type: "number", unit: "dak", required: true, smartDefault: 5, validation: { min: 0.1 }, helper: "", expertMeaning: "Total machining time per part", expertMeaning_i18n: {"en":"Total machining time per part","tr":"Parça başı toplam işleme süresi"} },
    { id: "machineRate", label: "Makine Saat Ücreti", label_i18n: {"en":"Machine Hourly Rate","tr":"Makine Saat Ücreti"}, type: "number", unit: "USD/saat", required: true, smartDefault: 85, validation: { min: 1 }, helper: "", expertMeaning: "Machine hourly rate", expertMeaning_i18n: {"en":"Machine hourly rate","tr":"Makine saat ücreti"} },
    { id: "cutTime", label: "Kesme Süresi (T_cut)", label_i18n: {"en":"Cutting Time (T_cut)","tr":"Kesme Süresi (T_cut)"}, type: "number", unit: "dak", required: false, smartDefault: 3, validation: { min: 0 }, helper: "", expertMeaning: "Actual cutting time", expertMeaning_i18n: {"en":"Actual cutting time","tr":"Gerçek kesme süresi"} },
    { id: "toolLife", label: "Takım Ömrü", label_i18n: {"en":"Tool Life","tr":"Takım Ömrü"}, type: "number", unit: "dak", required: false, smartDefault: 60, validation: { min: 0 }, helper: "", expertMeaning: "Tool life in minutes", expertMeaning_i18n: {"en":"Tool life in minutes","tr":"Takım ömrü (dakika)"} },
    { id: "toolCost", label: "Takım Maliyeti", label_i18n: {"en":"Tool Cost","tr":"Takım Maliyeti"}, type: "number", unit: "USD", required: false, smartDefault: 50, validation: { min: 0 }, helper: "", expertMeaning: "Cost per cutting edge", expertMeaning_i18n: {"en":"Cost per cutting edge","tr":"Kesme kenarı başına maliyet"} },
    { id: "machinePower", label: "Makine Gücü", label_i18n: {"en":"Machine Power","tr":"Makine Gücü"}, type: "number", unit: "kW", required: false, smartDefault: 15, validation: { min: 0 }, helper: "", expertMeaning: "Machine spindle power", expertMeaning_i18n: {"en":"Machine spindle power","tr":"Makine iş mili gücü"} },
    { id: "elecRate", label: "Elektrik Tarifesi", label_i18n: {"en":"Electricity Rate","tr":"Elektrik Tarifesi"}, type: "number", unit: "USD/kWh", required: false, smartDefault: 0.12, validation: { min: 0 }, helper: "", expertMeaning: "Electricity unit cost", expertMeaning_i18n: {"en":"Electricity unit cost","tr":"Birim elektrik maliyeti"} },
    { id: "overheadRate", label: "Genel Gider Oranı", label_i18n: {"en":"Overhead Rate","tr":"Genel Gider Oranı"}, type: "number", unit: "USD/saat", required: false, smartDefault: 20, validation: { min: 0 }, helper: "", expertMeaning: "Overhead allocation rate", expertMeaning_i18n: {"en":"Overhead allocation rate","tr":"Genel gider dağıtım oranı"} },
    { id: "qualityCost", label: "Kalite Maliyeti", label_i18n: {"en":"Quality Cost","tr":"Kalite Maliyeti"}, type: "number", unit: "USD", required: false, smartDefault: 0.5, validation: { min: 0 }, helper: "", expertMeaning: "Inspection/rework per part", expertMeaning_i18n: {"en":"Inspection/rework per part","tr":"Parça başı muayene/yeniden işleme"} },
  ],
  outputs: [
    { id: "materialCost", label: "Malzeme Maliyeti", label_i18n: {"en":"Malzeme Maliyeti","tr":"Malzeme Maliyeti"}, unit: "USD", format: "currency" },
    { id: "machiningCost", label: "İşleme Maliyeti", label_i18n: {"en":"Isleme Maliyeti","tr":"İşleme Maliyeti"}, unit: "USD", format: "currency" },
    { id: "toolingCost", label: "Takım Maliyeti", label_i18n: {"en":"Tool Cost","tr":"Takım Maliyeti"}, unit: "USD", format: "currency" },
    { id: "energyCost", label: "Enerji Maliyeti", label_i18n: {"en":"Enerji Maliyeti","tr":"Enerji Maliyeti"}, unit: "USD", format: "currency" },
    { id: "overheadCost", label: "Genel Gider", label_i18n: {"en":"Genel Gider","tr":"Genel Gider"}, unit: "USD", format: "currency" },
    { id: "totalUnitCost", label: "Toplam Birim Maliyet", label_i18n: {"en":"Toplam Birim Maliyet","tr":"Toplam Birim Maliyet"}, unit: "USD", format: "currency", isBigNumber: true },
  ],
  thresholds: [
    { fieldId: "totalUnitCost", warning: 15, critical: 30, direction: "higher_is_bad", warningMessage: "Birim maliyet > $15 — maliyet optimizasyonu değerlendirilmeli.", warningMessage_i18n: {"en":"Unit cost > $15 — evaluate cost optimization.","tr":"Birim maliyet > $15 — maliyet optimizasyonu değerlendirilmeli."}, criticalMessage: "Birim maliyet > $30 — alternatif proses/malzeme düşünülmeli.", criticalMessage_i18n: {"en":"Unit cost > $30 — consider alternative process/material.","tr":"Birim maliyet > $30 — alternatif proses/malzeme düşünülmeli."} },
  ],
  formulaPipeline: [
    { formulaId: "cost.cnc_material", inputMap: { rawVolume: "rawVolume", density: "density", pricePerKg: "pricePerKg", scrapRate: "scrapRate" }, outputId: "materialCost" },
    { formulaId: "cost.cnc_machining", inputMap: { totalTime: "totalTime", machineRate: "machineRate" }, outputId: "machiningCost" },
    { formulaId: "cost.cnc_tooling", inputMap: { cutTime: "cutTime", toolLife: "toolLife", toolCost: "toolCost" }, outputId: "toolingCost" },
    { formulaId: "cost.cnc_energy", inputMap: { machinePower: "machinePower", totalTime: "totalTime", elecRate: "elecRate" }, outputId: "energyCost" },
    { formulaId: "cost.cnc_overhead", inputMap: { totalTime: "totalTime", overheadRate: "overheadRate" }, outputId: "overheadCost" },
    { formulaId: "cost.cnc_total_unit", inputMap: { materialCost: "materialCost", machiningCost: "machiningCost", toolingCost: "toolingCost", energyCost: "energyCost", overheadCost: "overheadCost", qualityCost: "qualityCost" }, outputId: "totalUnitCost" },
  ],
  reportTemplate: { title: "CNC Machining Cost Report", title_i18n: {"en":"CNC Machining Cost Report","tr":"CNC Machining Cost Report"}, sections: ["executive_summary", "loss_breakdown", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.15, volatilityPercent: 10, targetMarginPercent: 20, assumptionNotes: ["Mat = Vol×Density×Price×(1+Scrap%).", "Machining = T_total×MachineRate/60. Tooling = (T_cut/ToolLife)×ToolCost.", "Energy = Power×T_total/60×ElecRate."],assumptionNotes_i18n:[{"en":"Mat = Vol×Density×Price×(1+Scrap%).","tr":"Mat = Vol×Density×Price×(1+Scrap%)."},{"en":"Machining = T_total×MachineRate/60. Tooling = (T_cut/ToolLife)×ToolCost.","tr":"Machining = T_total×MachineRate/60. Tooling = (T_cut/ToolLife)×ToolCost."},{"en":"Energy = Power×T_total/60×ElecRate.","tr":"Energy = Power×T_total/60×ElecRate."}]},
};
