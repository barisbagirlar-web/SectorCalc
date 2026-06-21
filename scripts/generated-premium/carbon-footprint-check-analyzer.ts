/**
 * Karbon Ayak izi Check — Premium Calculator Schema
 * Auto-generated from user-provided formulas
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const CARBONFOOTPRINTCHECK_SCHEMA: PremiumCalculatorSchema = {
  id: "carbon-footprint-check-analyzer",
  legacyPaidSlug: "carbon-footprint-check-analyzer",
  name: "Karbon Ayak izi Check",
  sectorSlug: "general",
  category: "cost",
  painStatement: "Karbon Ayak izi Check — premium analysis tool.",
  inputs: [
    { id: "yakit_tuketimleri", label: "Yakıt Tüketimleri", type: "array", required: true },
    { id: "kacak_emisyon", label: "Kaçak Emisyon", type: "number", required: true },
    { id: "elektrik_tuketimi", label: "Elektrik Tüketimi", type: "number", required: true },
    { id: "malzeme_miktarlari_ve_ef", label: "Malzeme Miktarları ve EF", type: "matrix", required: true },
    { id: "tasima_mesafesi_ve_modu", label: "Taşıma Mesafesi ve Modu", type: "array", required: true },
    { id: "gelecek_karbon_fiyati", label: "Gelecek Karbon Fiyatı", type: "currency/ton", required: true },
    { id: "uretim_hacmi", label: "Üretim Hacmi", type: "number", required: true },
  ],
  outputs: [
    { id: "scope1", label: "Scope1", unit: "currency", format: "currency" },
    { id: "scope2__location", label: "Scope2_ Location", unit: "currency", format: "currency" },
    { id: "scope2__market", label: "Scope2_ Market", unit: "currency", format: "currency" },
    { id: "scope3__upstream", label: "Scope3_ Upstream", unit: "currency", format: "currency" },
    { id: "total_carbon", label: "Total Carbon", unit: "currency", format: "currency" },
    { id: "carbon_intensity", label: "Carbon Intensity", unit: "currency", format: "currency" },
    { id: "financial_risk", label: "Financial Risk", unit: "currency", format: "currency" },
  ],
  thresholds: [],
  formulaPipeline: [
    { formulaId: "custom.karbon_ayak_izi_check_analyzer_0", inputMap: { FuelConsumption_i: "fuel_consumption_i", EmissionFactor_i: "emission_factor_i", FugitiveEmissions: "fugitive_emissions" }, outputId: "scope1" },
    { formulaId: "custom.karbon_ayak_izi_check_analyzer_1", inputMap: { ElectricityConsumption: "electricity_consumption", GridEmissionFactor: "grid_emission_factor" }, outputId: "scope2__location" },
    { formulaId: "custom.karbon_ayak_izi_check_analyzer_2", inputMap: { ElectricityConsumption: "electricity_consumption", GridFactor: "grid_factor", REC_Factor: "r_e_c__factor" }, outputId: "scope2__market" },
    { formulaId: "custom.karbon_ayak_izi_check_analyzer_3", inputMap: { Material_i: "material_i", MaterialEF_i: "material_e_f_i", Logistics_Emissions: "logistics__emissions" }, outputId: "scope3__upstream" },
    { formulaId: "custom.karbon_ayak_izi_check_analyzer_4", inputMap: { Scope1: "scope1", Scope2_Market: "scope2__market", Scope3_Upstream: "scope3__upstream" }, outputId: "total_carbon" },
    { formulaId: "custom.karbon_ayak_izi_check_analyzer_5", inputMap: { TotalCarbon: "total_carbon", ProductionVolume: "production_volume" }, outputId: "carbon_intensity" },
    { formulaId: "custom.karbon_ayak_izi_check_analyzer_6", inputMap: { TotalCarbon: "total_carbon", ForecastedCarbonPrice: "forecasted_carbon_price" }, outputId: "financial_risk" },
  ],
  reportTemplate: {
    title: "Karbon Ayak izi Check Report",
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
