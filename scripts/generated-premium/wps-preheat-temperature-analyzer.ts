/**
 * WPS Preheat Sıcaklık — Premium Calculator Schema
 * Auto-generated from user-provided formulas
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const WPSPREHEATTEMPERATURE_SCHEMA: PremiumCalculatorSchema = {
  id: "wps-preheat-temperature-analyzer",
  legacyPaidSlug: "wps-preheat-temperature-analyzer",
  name: "WPS Preheat Sıcaklık",
  sectorSlug: "general",
  category: "cost",
  painStatement: "WPS Preheat Sıcaklık — premium analysis tool.",
  inputs: [
    { id: "cu", label: "Cu", type: "number", required: true },
    { id: "kalinlik_mm", label: "Kalınlık mm", type: "number", required: true },
    { id: "isi_girdisi_kjmm", label: "Isı Girdisi kJ/mm", type: "number", required: true },
    { id: "hidrojen_seviyesi_ml100g", label: "Hidrojen Seviyesi ml/100g", type: "number", required: true },
    { id: "ortam_sicakligi", label: "Ortam Sıcaklığı", type: "number", required: true },
    { id: "isitici_verimi", label: "Isıtıcı Verimi", type: "number", required: true },
    { id: "enerji_fiyati", label: "Enerji Fiyatı", type: "number", required: true },
  ],
  outputs: [
    { id: "carbon_equivalent__c_e", label: "Carbon Equivalent_ C E", unit: "currency", format: "currency" },
    { id: "preheat_temp", label: "Preheat Temp", unit: "currency", format: "currency" },
    { id: "critical_cooling_time", label: "Critical Cooling Time", unit: "currency", format: "currency" },
    { id: "hydrogen_cracking_risk", label: "Hydrogen Cracking Risk", unit: "currency", format: "currency" },
    { id: "energy_cost", label: "Energy Cost", unit: "currency", format: "currency" },
  ],
  thresholds: [],
  formulaPipeline: [
    { formulaId: "custom.wps_preheat_sicaklik_analyzer_0", inputMap: { Mn: "mn", Cr: "cr", Mo: "mo", Ni: "ni", Cu: "cu" }, outputId: "carbon_equivalent__c_e" },
    { formulaId: "custom.wps_preheat_sicaklik_analyzer_1", inputMap: { CE: "c_e", Thickness: "thickness", HydrogenLevel: "hydrogen_level", HeatInput: "heat_input" }, outputId: "preheat_temp" },
    { formulaId: "custom.wps_preheat_sicaklik_analyzer_2", inputMap: { t_8_5: "t_8_5", Thickness: "thickness", HeatInput: "heat_input", Constant: "constant" }, outputId: "critical_cooling_time" },
    { formulaId: "custom.wps_preheat_sicaklik_analyzer_3", inputMap: { PreheatTemp: "preheat_temp", RequiredPreheat: "required_preheat", HIGH: "h_i_g_h", LOW: "l_o_w" }, outputId: "hydrogen_cracking_risk" },
    { formulaId: "custom.wps_preheat_sicaklik_analyzer_4", inputMap: { Mass: "mass", SpecificHeat: "specific_heat", PreheatTemp: "preheat_temp", AmbientTemp: "ambient_temp", HeaterEfficiency: "heater_efficiency", EnergyPrice: "energy_price" }, outputId: "energy_cost" },
  ],
  reportTemplate: {
    title: "WPS Preheat Sıcaklık Report",
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
