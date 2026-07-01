import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const COMPRESSED_AIR_LEAK_SCHEMA: PremiumCalculatorSchema = {
  id: "compressed-air-leak-analyzer", legacyPaidSlug: "compressed-air-leak-analyzer",
  name: "Compressor Leak Cost Analyzer", name_i18n: {"en":"Compressor Leak Cost Analyzer"}, sectorSlug: "cnc-manufacturing", category: "energy",
  painStatement: "Basınçlı hava kaçakları tespit edilmezse enerji maliyeti gizlice artar ve karbon emisyonu yükselir.", painStatement_i18n: {"en":"If compressed Air leaks are not detected, energy Cost silently increases and Carbon emissions rise."},
  inputs: [
    { id: "leakDiameter", label: "Orifice diameter", label_i18n: {"en":"Orifice diameter"}, type: "number", unit: "mm", required: true, smartDefault: 2, validation: { min: 0.1 }, helper: "", expertMeaning: "Orifice diameter", expertMeaning_i18n: {"en":"Orifice diameter"} },
    { id: "linePressure", label: "Line pressure", label_i18n: {"en":"Line pressure"}, type: "number", unit: "bar", required: true, smartDefault: 7, validation: { min: 1 }, helper: "", expertMeaning: "Line pressure", expertMeaning_i18n: {"en":"Line pressure"} },
    { id: "leakCount", label: "Number of leaks", label_i18n: {"en":"Number of leaks"}, type: "number", unit: "", required: true, smartDefault: 5, validation: { min: 1 }, helper: "", expertMeaning: "Number of leaks", expertMeaning_i18n: {"en":"Number of leaks"} },
    { id: "compressorEff", label: "Kompresör Verimi", label_i18n: {"en":"Compressor efficiency"}, type: "number", unit: "", required: false, smartDefault: 0.85, validation: { min: 0, max: 1 }, helper: "", expertMeaning: "Compressor efficiency", expertMeaning_i18n: {"en":"Compressor efficiency"} },
    { id: "operatingHours", label: "Annual operating hours", label_i18n: {"en":"Annual operating hours"}, type: "number", unit: "saat", required: true, smartDefault: 8000, validation: { min: 1 }, helper: "", expertMeaning: "Annual operating hours", expertMeaning_i18n: {"en":"Annual operating hours"} },
    { id: "elecRate", label: "Elektrik Tarifesi", label_i18n: {"en":"Elektrik Tarifesi"}, type: "number", unit: "USD/kWh", required: true, smartDefault: 0.12, validation: { min: 0 }, helper: "", expertMeaning: "Electricity rate", expertMeaning_i18n: {"en":"Electricity rate"} },
    { id: "gridEF", label: "Emisyon Faktörü", label_i18n: {"en":"Grid emission factor"}, type: "number", unit: "tCO2e/MWh", required: false, smartDefault: 0.45, validation: { min: 0 }, helper: "", expertMeaning: "Grid emission factor", expertMeaning_i18n: {"en":"Grid emission factor"} },
    { id: "repairCost", label: "Repair Cost", label_i18n: {"en":"Repair Cost"}, type: "number", unit: "USD", required: false, smartDefault: 200, validation: { min: 0 }, helper: "", expertMeaning: "Repair cost per leak", expertMeaning_i18n: {"en":"Repair cost per leak"} },
  ],
  outputs: [
    { id: "leakFlow", label: "Kacak Debisi", label_i18n: {"en":"Leak Debisi"}, unit: "CFM", format: "number" },
    { id: "powerLoss", label: "Power Loss", label_i18n: {"en":"Power Loss"}, unit: "kW", format: "number" },
    { id: "annualEnergyLoss", label: "Annual Energy Loss", label_i18n: {"en":"Annual Energy Loss"}, unit: "kWh", format: "number" },
    { id: "costPerLeak", label: "Kacak Bas Maliyet", label_i18n: {"en":"Leak Bas Cost"}, unit: "USD/yıl", format: "currency" },
    { id: "totalLeakCost", label: "Total Leak Cost", label_i18n: {"en":"Total Leak Cost"}, unit: "USD/yıl", format: "currency", isBigNumber: true },
    { id: "carbonEmissions", label: "Karbon Emisyonu", label_i18n: {"en":"Carbon Emisyonu"}, unit: "tCO2e", format: "number" },
    { id: "paybackMonths", label: "Tamir Geri Ödeme", label_i18n: {"en":"Tamir Return Payment"}, unit: "ay", format: "duration" },
  ],
  thresholds: [{ fieldId: "totalLeakCost", warning: 5000, critical: 20000, direction: "higher_is_bad", warningMessage: "Kaçak maliyeti > $5K/yıl — onarım programı başlatılmalı.", warningMessage_i18n: {"en":"Leak Cost > $5K/yr — repair program should be initiated."}, criticalMessage: "Kaçak maliyeti > $20K/yıl — acil müdahale gerekli.", criticalMessage_i18n: {"en":"Leak Cost > $20K/yr — urgent intervention required."} }],
  formulaPipeline: [
    { formulaId: "measurement.leak_flow_cfm", inputMap: {
        leakArea: "leakDiameter",
        pressure: "linePressure"
      }, outputId: "leakFlow" },
    { formulaId: "measurement.leak_power_loss", inputMap: {
        leakFlowCfm: "leakFlow",
        pressure: "linePressure",
        compressorEff: "compressorEff"
      }, outputId: "powerLoss" },
    { formulaId: "measurement.leak_annual_energy", inputMap: {
        leakPowerLoss: "powerLoss",
        runningHours: "operatingHours"
      }, outputId: "annualEnergyLoss" },
    { formulaId: "cost.leak_cost", inputMap: {
        leakAnnualEnergy: "annualEnergyLoss",
        energyRate: "elecRate",
        leakCount: "leakCount"
      }, outputId: "costPerLeak" },
    { formulaId: "cost.leak_total_cost", inputMap: {
        leakCount: "leakCount",
        leakCost: "costPerLeak"
      }, outputId: "totalLeakCost" },
    { formulaId: "measurement.leak_carbon", inputMap: {
        leakAnnualEnergy: "annualEnergyLoss",
        gridCarbonFactor: "gridEF"
      }, outputId: "carbonEmissions" },
    { formulaId: "cost.leak_payback", inputMap: {
        repairCost: "repairCost",
        leakCost: "costPerLeak"
      }, outputId: "paybackMonths" },
  ],
  reportTemplate: { title: "Kompresör Kaçak Raporu", title_i18n: {"en":"Compressor Leak Report"}, sections: ["executive_summary", "loss_breakdown", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.1, volatilityPercent: 10, targetMarginPercent: 15, assumptionNotes: ["Kaçak debisi = 22.4×d²×P/√T.", "Güç kaybı = Q×P×144/(33000×Verim).", "Geri ödeme = Tamir / Yıllık maliyet."],assumptionNotes_i18n:[{"en":"Leak flow rate = 22.4×d²×P/√T."},{"en":"Power loss = Q×P×144/(33000×Efficiency)."},{"en":"Payback = Repair / Annual cost."}] },
};
