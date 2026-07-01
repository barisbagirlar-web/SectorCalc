/**
 * Tool #36 — Environmental Fire
 */
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const ENVIRONMENTAL_WASTE_SCHEMA: PremiumCalculatorSchema = {
  id: "environmental-waste-cost-analyzer", legacyPaidSlug: "environmental-waste-cost-analyzer",
  name: "Environmental Waste Cost & Circularity Analyzer", name_i18n: {"en":"Environmental Waste Cost & Circularity Analyzer"}, sectorSlug: "legal-tax", category: "cost",
  painStatement: "Atık bertaraf, tehlikeli atık ve emisyon maliyetleri ayrıştırılmazsa çevre cezaları ve sürdürülebilirlik raporlaması hatalı olur.", painStatement_i18n: {"en":"Waste disposal, hazardous Waste ve emission maliyetleri ayrıştırılmazsa environmental cezaları ve sürdürülebilirlik raporlaması hatalı olur."},
  inputs: [
    { id: "nonHazWaste", label: "Non-hazardous waste", label_i18n: {"en":"Non-hazardous waste"}, type: "number", unit: "ton", required: true, smartDefault: 50, validation: { min: 0 }, helper: "", expertMeaning: "Non-hazardous waste", expertMeaning_i18n: {"en":"Non-hazardous waste"} },
    { id: "disposalFee", label: "Bertaraf Ücreti", label_i18n: {"en":"Disposal fee per ton"}, type: "number", unit: "USD/ton", required: true, smartDefault: 100, validation: { min: 0 }, helper: "", expertMeaning: "Disposal fee per ton", expertMeaning_i18n: {"en":"Disposal fee per ton"} },
    { id: "hazMass", label: "Hazardous waste mass", label_i18n: {"en":"Hazardous waste mass"}, type: "number", unit: "ton", required: true, smartDefault: 10, validation: { min: 0 }, helper: "", expertMeaning: "Hazardous waste mass", expertMeaning_i18n: {"en":"Hazardous waste mass"} },
    { id: "hazFee", label: "Hazardous waste fee", label_i18n: {"en":"Hazardous waste fee"}, type: "number", unit: "USD/ton", required: true, smartDefault: 500, validation: { min: 0 }, helper: "", expertMeaning: "Hazardous waste fee", expertMeaning_i18n: {"en":"Hazardous waste fee"} },
    { id: "hazSurcharge", label: "Tehlikeli Ek Ücret", label_i18n: {"en":"Hazardous surcharge"}, type: "number", unit: "USD/ton", required: false, smartDefault: 100, validation: { min: 0 }, helper: "", expertMeaning: "Hazardous surcharge", expertMeaning_i18n: {"en":"Hazardous surcharge"} },
    { id: "recycMass", label: "Recycling mass", label_i18n: {"en":"Recycling mass"}, type: "number", unit: "ton", required: true, smartDefault: 20, validation: { min: 0 }, helper: "", expertMeaning: "Recycling mass", expertMeaning_i18n: {"en":"Recycling mass"} },
    { id: "sortCost", label: "Sorting cost per ton", label_i18n: {"en":"Sorting cost per ton"}, type: "number", unit: "USD/ton", required: false, smartDefault: 50, validation: { min: 0 }, helper: "", expertMeaning: "Sorting cost per ton", expertMeaning_i18n: {"en":"Sorting cost per ton"} },
    { id: "scrapRevenue", label: "Hurda Geliri", label_i18n: {"en":"Scrap Geliri"}, type: "number", unit: "USD/ton", required: false, smartDefault: 30, validation: { min: 0 }, helper: "", expertMeaning: "Scrap revenue per ton", expertMeaning_i18n: {"en":"Scrap revenue per ton"} },
    { id: "airEmissions", label: "Hava Emisyonu", label_i18n: {"en":"Air Emisyonu"}, type: "number", unit: "tonCO₂", required: false, smartDefault: 100, validation: { min: 0 }, helper: "", expertMeaning: "Air emissions in tons", expertMeaning_i18n: {"en":"Air emissions in tons"} },
    { id: "carbonPrice", label: "Carbon price", label_i18n: {"en":"Carbon price"}, type: "number", unit: "USD/ton", required: false, smartDefault: 50, validation: { min: 0 }, helper: "", expertMeaning: "Carbon price", expertMeaning_i18n: {"en":"Carbon price"} },
    { id: "waterEffluent", label: "Wastewater volume", label_i18n: {"en":"Wastewater volume"}, type: "number", unit: "m³", required: false, smartDefault: 1000, validation: { min: 0 }, helper: "", expertMeaning: "Wastewater volume", expertMeaning_i18n: {"en":"Wastewater volume"} },
    { id: "treatCost", label: "Treatment cost per m³", label_i18n: {"en":"Treatment cost per m³"}, type: "number", unit: "USD/m³", required: false, smartDefault: 3, validation: { min: 0 }, helper: "", expertMeaning: "Treatment cost per m³", expertMeaning_i18n: {"en":"Treatment cost per m³"} },
    { id: "probViolation", label: "Violation probability", label_i18n: {"en":"Violation probability"}, type: "number", unit: "%", required: false, smartDefault: 5, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Violation probability", expertMeaning_i18n: {"en":"Violation probability"} },
    { id: "fineAmount", label: "Maximum fine amount", label_i18n: {"en":"Maximum fine amount"}, type: "number", unit: "USD", required: false, smartDefault: 500000, validation: { min: 0 }, helper: "", expertMeaning: "Maximum fine amount", expertMeaning_i18n: {"en":"Maximum fine amount"} },
  ],
  outputs: [
    { id: "totalEnvCost", label: "Toplam Cevre Maliyeti", label_i18n: {"en":"Total environmental Cost"}, unit: "USD", format: "currency", isBigNumber: true },
  ],
  thresholds: [{ fieldId: "totalEnvCost", warning: 50000, critical: 150000, direction: "higher_is_bad", warningMessage: "Çevre maliyeti > $50K — azaltım programı başlatılmalı.", warningMessage_i18n: {"en":"environmental Cost > $50K — azaltım program başlatılmalı."}, criticalMessage: "Maliyet > $150K — acil çevre yönetimi aksiyonu.", criticalMessage_i18n: {"en":"Cost > $150K — urgent environmental yönetimi aksiyonu."} }],
  formulaPipeline: [
    { formulaId: "cost.env_fire_disposal", inputMap: {
        waste: "nonHazWaste",
        dispFee: "disposalFee"
      }, outputId: "disposalCost" },
    { formulaId: "cost.env_fire_haz", inputMap: {
        hazMass: "hazMass",
        hazFee: "hazFee",
        surcharge: "hazSurcharge"
      }, outputId: "hazCost" },
    { formulaId: "cost.env_fire_recycling", inputMap: {
        recycMass: "recycMass",
        sortCost: "sortCost",
        scrapRev: "scrapRevenue"
      }, outputId: "recyclingCost" },
    { formulaId: "cost.env_fire_emissions", inputMap: {
        carbonPrice: "carbonPrice",
        treatCost: "treatCost",
        air: "airEmissions",
        water: "waterEffluent"
      }, outputId: "emissionsCost" },
    { formulaId: "cost.env_fire_penalty_risk", inputMap: {
        probViolation: "probViolation",
        fine: "fineAmount"
      }, outputId: "penaltyRisk" },
    { formulaId: "cost.env_fire_total", inputMap: {
        disposalCost: "disposalCost",
        hazCost: "hazCost",
        penaltyRisk: "penaltyRisk",
        recycleCost: "recyclingCost",
        emisCost: "emissionsCost"
      }, outputId: "totalEnvCost" },
  ],
  reportTemplate: { title: "Environmental Waste Cost Report", title_i18n: {"en":"Environmental Waste Cost Report"}, sections: ["executive_summary", "loss_breakdown", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.2, volatilityPercent: 20, targetMarginPercent: 25, assumptionNotes: ["Disposal = Waste×Fee. Haz = Mass×(Fee+Surcharge).", "Recycling = Mass×(SortCost-ScrapRev).", "Emissions = Air×CarbonPrice + Water×TreatCost."],assumptionNotes_i18n:[{"en":"Disposal = Waste×Fee. Haz = Mass×(Fee+Surcharge)."},{"en":"Recycling = Mass×(SortCost-ScrapRev)."},{"en":"Emissions = Air×CarbonPrice + Water×TreatCost."}] },
};
