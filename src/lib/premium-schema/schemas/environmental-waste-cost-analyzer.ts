/**
 * Tool #36 — Environmental Fire
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const ENVIRONMENTAL_WASTE_SCHEMA: PremiumCalculatorSchema = {
  id: "environmental-waste-cost-analyzer", legacyPaidSlug: "environmental-waste-cost-analyzer",
  name: "Çevre Atık Maliyet & Döngüsellik Analizi", sectorSlug: "legal-tax", category: "cost",
  painStatement: "Atık bertaraf, tehlikeli atık ve emisyon maliyetleri ayrıştırılmazsa çevre cezaları ve sürdürülebilirlik raporlaması hatalı olur.",
  inputs: [
    { id: "nonHazWaste", label: "Tehlikesiz Atık Miktarı", type: "number", unit: "ton", required: true, smartDefault: 50, validation: { min: 0 }, helper: "", expertMeaning: "Non-hazardous waste" },
    { id: "disposalFee", label: "Bertaraf Ücreti", type: "number", unit: "USD/ton", required: true, smartDefault: 100, validation: { min: 0 }, helper: "", expertMeaning: "Disposal fee per ton" },
    { id: "hazMass", label: "Tehlikeli Atık Miktarı", type: "number", unit: "ton", required: true, smartDefault: 10, validation: { min: 0 }, helper: "", expertMeaning: "Hazardous waste mass" },
    { id: "hazFee", label: "Tehlikeli Atık Ücreti", type: "number", unit: "USD/ton", required: true, smartDefault: 500, validation: { min: 0 }, helper: "", expertMeaning: "Hazardous waste fee" },
    { id: "hazSurcharge", label: "Tehlikeli Ek Ücret", type: "number", unit: "USD/ton", required: false, smartDefault: 100, validation: { min: 0 }, helper: "", expertMeaning: "Hazardous surcharge" },
    { id: "recycMass", label: "Geri Dönüşüm Miktarı", type: "number", unit: "ton", required: true, smartDefault: 20, validation: { min: 0 }, helper: "", expertMeaning: "Recycling mass" },
    { id: "sortCost", label: "Ayırma Maliyeti", type: "number", unit: "USD/ton", required: false, smartDefault: 50, validation: { min: 0 }, helper: "", expertMeaning: "Sorting cost per ton" },
    { id: "scrapRevenue", label: "Hurda Geliri", type: "number", unit: "USD/ton", required: false, smartDefault: 30, validation: { min: 0 }, helper: "", expertMeaning: "Scrap revenue per ton" },
    { id: "airEmissions", label: "Hava Emisyonu", type: "number", unit: "tonCO₂", required: false, smartDefault: 100, validation: { min: 0 }, helper: "", expertMeaning: "Air emissions in tons" },
    { id: "carbonPrice", label: "Karbon Fiyatı", type: "number", unit: "USD/ton", required: false, smartDefault: 50, validation: { min: 0 }, helper: "", expertMeaning: "Carbon price" },
    { id: "waterEffluent", label: "Atık Su Hacmi", type: "number", unit: "m³", required: false, smartDefault: 1000, validation: { min: 0 }, helper: "", expertMeaning: "Wastewater volume" },
    { id: "treatCost", label: "Atık Su Arıtma", type: "number", unit: "USD/m³", required: false, smartDefault: 3, validation: { min: 0 }, helper: "", expertMeaning: "Treatment cost per m³" },
    { id: "probViolation", label: "İhlal Olasılığı", type: "number", unit: "%", required: false, smartDefault: 5, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Violation probability" },
    { id: "fineAmount", label: "Ceza Tutarı", type: "number", unit: "USD", required: false, smartDefault: 500000, validation: { min: 0 }, helper: "", expertMeaning: "Maximum fine amount" },
  ],
  outputs: [
    { id: "totalEnvCost", label: "Toplam Çevre Maliyeti", unit: "USD", format: "currency", isBigNumber: true },
  ],
  thresholds: [{ fieldId: "totalEnvCost", warning: 50000, critical: 150000, direction: "higher_is_bad", warningMessage: "Çevre maliyeti > $50K — azaltım programı başlatılmalı.", criticalMessage: "Maliyet > $150K — acil çevre yönetimi aksiyonu." }],
  formulaPipeline: [
    { formulaId: "cost.env_fire_disposal", inputMap: { nonHazWaste: "nonHazWaste", disposalFee: "disposalFee" }, outputId: "disposalCost" },
    { formulaId: "cost.env_fire_haz", inputMap: { hazMass: "hazMass", hazFee: "hazFee", hazSurcharge: "hazSurcharge" }, outputId: "hazCost" },
    { formulaId: "cost.env_fire_recycling", inputMap: { recycMass: "recycMass", sortCost: "sortCost", scrapRevenue: "scrapRevenue" }, outputId: "recyclingCost" },
    { formulaId: "cost.env_fire_emissions", inputMap: { airEmissions: "airEmissions", carbonPrice: "carbonPrice", waterEffluent: "waterEffluent", treatCost: "treatCost" }, outputId: "emissionsCost" },
    { formulaId: "cost.env_fire_penalty_risk", inputMap: { probViolation: "probViolation", fineAmount: "fineAmount" }, outputId: "penaltyRisk" },
    { formulaId: "cost.env_fire_total", inputMap: { disposalCost: "disposalCost", hazCost: "hazCost", recyclingCost: "recyclingCost", emissionsCost: "emissionsCost", penaltyRisk: "penaltyRisk" }, outputId: "totalEnvCost" },
  ],
  reportTemplate: { title: "Environmental Waste Cost Report", sections: ["executive_summary", "loss_breakdown", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.2, volatilityPercent: 20, targetMarginPercent: 25, assumptionNotes: ["Disposal = Waste×Fee. Haz = Mass×(Fee+Surcharge).", "Recycling = Mass×(SortCost-ScrapRev).", "Emissions = Air×CarbonPrice + Water×TreatCost."] },
};
