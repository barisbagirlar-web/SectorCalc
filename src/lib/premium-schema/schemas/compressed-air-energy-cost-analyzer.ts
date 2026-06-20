/**
 * Tool #10 — Basınçlı Hava Sistemi Enerji Maliyeti
 * CompressorPower → AnnualEnergyCost → TotalAnnualCost
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const COMPRESSED_AIR_SCHEMA: PremiumCalculatorSchema = {
  id: "compressed-air-energy-cost-analyzer", legacyPaidSlug: "compressed-air-energy-cost-analyzer",
  name: "Basınçlı Hava Sistemi Enerji Maliyet Analizi", sectorSlug: "energy-consumption", category: "energy",
  painStatement: "Basınçlı hava sistemleri fabrika elektrik faturasının %30'una kadar çıkabilir. Kaçaklar ve düşük verim gizli maliyet oluşturur. Bu araç sistem enerji maliyetini ve ısı geri kazanım tasarrufunu hesaplar.",
  inputs: [
    { id: "compressorPowerKw", label: "Kompresör Gücü", type: "number", unit: "kW", required: true, smartDefault: 75, validation: { min: 0 }, helper: "", expertMeaning: "Compressor motor power" },
    { id: "operatingHoursPerYear", label: "Çalışma Saati/Yıl", type: "number", unit: "saat/yıl", required: true, smartDefault: 8000, validation: { min: 0 }, helper: "", expertMeaning: "Annual operating hours" },
    { id: "loadFactor", label: "Yük Oranı", type: "number", unit: "", required: true, smartDefault: 0.8, validation: { min: 0, max: 1 }, helper: "", expertMeaning: "Compressor load factor" },
    { id: "efficiencyIsothermal", label: "İzotermal Verim", type: "number", unit: "%", required: true, smartDefault: 70, validation: { min: 1, max: 100 }, helper: "", expertMeaning: "Isothermal efficiency" },
    { id: "efficiencyMotor", label: "Motor Verimi", type: "number", unit: "%", required: true, smartDefault: 90, validation: { min: 1, max: 100 }, helper: "", expertMeaning: "Electric motor efficiency" },
    { id: "efficiencyDrive", label: "Tahrik Verimi", type: "number", unit: "%", required: false, smartDefault: 95, validation: { min: 1, max: 100 }, helper: "", expertMeaning: "Drive/belt efficiency" },
    { id: "electricityRate", label: "Elektrik Tarifesi", type: "number", unit: "USD/kWh", required: true, smartDefault: 0.12, validation: { min: 0 }, helper: "", expertMeaning: "Electricity unit cost" },
    { id: "excessPressureDropKpa", label: "Aşırı Basınç Düşümü", type: "number", unit: "kPa", required: false, smartDefault: 50, validation: { min: 0 }, helper: "", expertMeaning: "Excess ΔP above design" },
    { id: "heatRecoveryEfficiency", label: "Isı Geri Kazanım Verimi", type: "number", unit: "%", required: false, smartDefault: 50, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Heat recovery efficiency" },
    { id: "alternativeEnergyCost", label: "Alternatif Enerji Maliyeti", type: "number", unit: "USD/kWh", required: false, smartDefault: 0.10, validation: { min: 0 }, helper: "", expertMeaning: "Cost of alternative heating" },
    { id: "gridEmissionFactor", label: "Şebeke Emisyon Faktörü", type: "number", unit: "kgCO₂/kWh", required: false, smartDefault: 0.45, validation: { min: 0 }, helper: "", expertMeaning: "Grid carbon intensity" },
    { id: "annualEnergyCostInput", label: "Yıllık Enerji Maliyeti (Tahmini)", type: "number", unit: "USD/yıl", required: false, smartDefault: 40000, validation: { min: 0 }, helper: "Kompresörün yıllık elektrik maliyeti.", expertMeaning: "Annual electricity cost" },
    { id: "leakageCostInput", label: "Kaçak Kaynaklı Yıllık Kayıp", type: "number", unit: "USD/yıl", required: false, smartDefault: 8000, validation: { min: 0 }, helper: "Basınçlı hava kaçaklarının yıllık maliyeti.", expertMeaning: "Annual leakage cost" },
    { id: "heatRecoverySavingsInput", label: "Isı Geri Kazanım Tasarrufu", type: "number", unit: "USD/yıl", required: false, smartDefault: 3000, validation: { min: 0 }, helper: "Atık ısının geri kazanımından sağlanan tasarruf.", expertMeaning: "Annual heat recovery savings" },
  ],
  outputs: [
    { id: "annualEnergyCost", label: "Yıllık Enerji Maliyeti", unit: "USD/yıl", format: "currency" },
    { id: "heatRecoverySavings", label: "Isı Geri Kazanım Tasarrufu", unit: "USD/yıl", format: "currency" },
    { id: "totalAnnualCost", label: "Toplam Yıllık Maliyet", unit: "USD/yıl", format: "currency", isBigNumber: true },
    { id: "carbonFootprint", label: "Yıllık Karbon Ayak İzi", unit: "kgCO₂/kWh", format: "number" },
  ],
  thresholds: [
    { fieldId: "totalAnnualCost", warning: 50000, critical: 150000, direction: "higher_is_bad", warningMessage: "Yıllık maliyet > $50K — kaçak taraması önerilir.", criticalMessage: "Yıllık maliyet > $150K — kompresör yenileme fizibilitesi yapılmalı." },
  ],
  formulaPipeline: [
    { formulaId: "energy.compressed_air_annual_cost", inputMap: { annualEnergyCost: "annualEnergyCostInput", leakageCost: "leakageCostInput", pressureDropCost: "excessPressureDropKpa", heatRecoverySavings: "heatRecoverySavingsInput" }, outputId: "totalAnnualCost" },
  ],
  reportTemplate: { title: "Compressed Air Energy Cost Report", sections: ["executive_summary", "loss_breakdown", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.15, volatilityPercent: 15, targetMarginPercent: 20, assumptionNotes: ["Annual energy cost = Power × Hours × Rate × Load factor.", "Heat recovery savings = Power × RecoveryEff × Hours × AltEnergyCost.", "Leakage cost estimated at 20-30% of total energy cost for typical systems.", "Carbon footprint = (Total cost / Electricity rate) × Grid emission factor.", "1 kW saved = 8,760 kWh/year at continuous operation."] },
};
