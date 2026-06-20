/**
 * Tool — Rüzgar Türbini Yatırım
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const WIND_TURBINE_INVESTMENT_ANALYZER: PremiumCalculatorSchema = {
  id: "wind-turbine-investment-analyzer", legacyPaidSlug: "wind-turbine-investment-analyzer",
  name: "Rüzgar Türbini Yatırım Analizi", sectorSlug: "energy-carbon", category: "cost",
  painStatement: "Rüzgar türbini yatırımında AEP, gelir ve NPV hesaplanmazsa yatırımın geri dönüşü ve fizibilitesi belirsiz kalır.",
  inputs: [
    { id: "rotorDiameter", label: "Rotor Çapı", type: "number", unit: "m", required: true, smartDefault: 82, validation: { min: 1 }, helper: "", expertMeaning: "Rotor diameter in meters" },
    { id: "hubHeight", label: "Kule Yüksekliği", type: "number", unit: "m", required: true, smartDefault: 80, validation: { min: 1 }, helper: "", expertMeaning: "Hub height in meters" },
    { id: "avgWindSpeed", label: "Ortalama Rüzgar Hızı", type: "number", unit: "m/s", required: true, smartDefault: 7.5, validation: { min: 2, max: 25 }, helper: "", expertMeaning: "Annual average wind speed at hub height" },
    { id: "airDensity", label: "Hava Yoğunluğu", type: "number", unit: "kg/m³", required: false, smartDefault: 1.225, validation: { min: 0.5, max: 1.5 }, helper: "", expertMeaning: "Air density at site" },
    { id: "capacityFactor", label: "Kapasite Faktörü", type: "number", unit: "%", required: false, smartDefault: 30, validation: { min: 5, max: 60 }, helper: "", expertMeaning: "Expected capacity factor" },
    { id: "electricityPrice", label: "Elektrik Fiyatı", type: "number", unit: "USD/kWh", required: true, smartDefault: 0.08, validation: { min: 0.01 }, helper: "", expertMeaning: "Price per kWh sold" },
    { id: "investmentCost", label: "Yatırım Maliyeti", type: "number", unit: "USD", required: true, smartDefault: 2500000, validation: { min: 1 }, helper: "", expertMeaning: "Total CAPEX" },
    { id: "opexPerYear", label: "Yıllık İşletme Maliyeti", type: "number", unit: "USD/yıl", required: true, smartDefault: 75000, validation: { min: 1 }, helper: "", expertMeaning: "Annual OPEX" },
    { id: "projectLife", label: "Proje Ömrü", type: "number", unit: "yıl", required: false, smartDefault: 20, validation: { min: 1, max: 50 }, helper: "", expertMeaning: "Project lifetime" },
    { id: "discountRate", label: "İskonto Oranı", type: "number", unit: "%", required: false, smartDefault: 8, validation: { min: 0, max: 30 }, helper: "", expertMeaning: "Discount rate for NPV" },
  ],
  outputs: [
    { id: "aep", label: "Yıllık Enerji Üretimi (AEP)", unit: "MWh/yıl", format: "number", isBigNumber: true },
    { id: "annualRevenue", label: "Yıllık Gelir", unit: "USD/yıl", format: "currency" },
    { id: "ebitda", label: "FVAÖK (EBITDA)", unit: "USD/yıl", format: "currency" },
    { id: "lcoe", label: "Seviyelendirilmiş Enerji Maliyeti (LCOE)", unit: "USD/kWh", format: "currency" },
    { id: "npv", label: "Net Bugünkü Değer (NPV)", unit: "USD", format: "currency", isBigNumber: true },
  ],
  thresholds: [{ fieldId: "lcoe", warning: 0.06, critical: 0.10, direction: "higher_is_bad", warningMessage: "LCOE > $0.06/kWh — piyasa rekabeti zorlaşabilir.", criticalMessage: "LCOE > $0.10/kWh — yatırım fizibilitesi düşük." }],
  formulaPipeline: [
    { formulaId: "measurement.wind_aep", inputMap: { rotorDiameter: "rotorDiameter", avgWindSpeed: "avgWindSpeed", airDensity: "airDensity", capacityFactor: "capacityFactor" }, outputId: "aep" },
    { formulaId: "cost.wind_annual_revenue", inputMap: { aep: "aep", electricityPrice: "electricityPrice" }, outputId: "annualRevenue" },
    { formulaId: "cost.wind_ebitda", inputMap: { annualRevenue: "annualRevenue", opexPerYear: "opexPerYear" }, outputId: "ebitda" },
    { formulaId: "cost.wind_lcoe", inputMap: { investmentCost: "investmentCost", aep: "aep", opexPerYear: "opexPerYear", projectLife: "projectLife" }, outputId: "lcoe" },
    { formulaId: "cost.wind_npv", inputMap: { annualRevenue: "annualRevenue", opexPerYear: "opexPerYear", investmentCost: "investmentCost", projectLife: "projectLife", discountRate: "discountRate" }, outputId: "npv" },
  ],
  reportTemplate: { title: "Rüzgar Türbini Yatırım Raporu", sections: ["executive_summary", "loss_breakdown", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.1, volatilityPercent: 10, targetMarginPercent: 15, assumptionNotes: ["AEP = 0.5 × ρ × A × V³ × Cp × 8760 / 1e6.", "LCOE = (CAPEX + ΣOPEXₜ/(1+r)ᵗ) / ΣAEPₜ/(1+r)ᵗ.", "NPV = Σ(Revenueₜ − OPEXₜ)/(1+r)ᵗ − CAPEX.", "Rüzgar hızı Weibull dağılımı varsayılmıştır."] },
};
