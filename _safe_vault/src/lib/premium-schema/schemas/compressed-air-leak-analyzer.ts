import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const COMPRESSED_AIR_LEAK_SCHEMA: PremiumCalculatorSchema = {
  id: "compressed-air-leak-analyzer", legacyPaidSlug: "compressed-air-leak-analyzer",
  name: "Kompresör Kaçağı Maliyet", name_i18n: {"en":"Kompresor Kacagi Maliyet","tr":"Kompresör Kaçağı Maliyet"}, sectorSlug: "cnc-manufacturing", category: "energy",
  painStatement: "Basınçlı hava kaçakları tespit edilmezse enerji maliyeti gizlice artar ve karbon emisyonu yükselir.", painStatement_i18n: {"en":"Basınçlı hava kaçakları tespit edilmezse enerji maliyeti gizlice artar ve karbon emisyonu yükselir.","tr":"Basınçlı hava kaçakları tespit edilmezse enerji maliyeti gizlice artar ve karbon emisyonu yükselir."},
  inputs: [
    { id: "leakDiameter", label: "Kaçak Çapı", label_i18n: {"en":"Orifice diameter","tr":"Kaçak Çapı"}, type: "number", unit: "mm", required: true, smartDefault: 2, validation: { min: 0.1 }, helper: "", expertMeaning: "Orifice diameter", expertMeaning_i18n: {"en":"Orifice diameter","tr":"kaçak çapı"} },
    { id: "linePressure", label: "Hat Basıncı", label_i18n: {"en":"Line pressure","tr":"Hat Basıncı"}, type: "number", unit: "bar", required: true, smartDefault: 7, validation: { min: 1 }, helper: "", expertMeaning: "Line pressure", expertMeaning_i18n: {"en":"Line pressure","tr":"hat basıncı"} },
    { id: "leakCount", label: "Kaçak Sayısı", label_i18n: {"en":"Number of leaks","tr":"Kaçak Sayısı"}, type: "number", unit: "", required: true, smartDefault: 5, validation: { min: 1 }, helper: "", expertMeaning: "Number of leaks", expertMeaning_i18n: {"en":"Number of leaks","tr":"kaçak sayısı"} },
    { id: "compressorEff", label: "Kompresör Verimi", label_i18n: {"en":"Compressor efficiency","tr":"Kompresör Verimi"}, type: "number", unit: "", required: false, smartDefault: 0.85, validation: { min: 0, max: 1 }, helper: "", expertMeaning: "Compressor efficiency", expertMeaning_i18n: {"en":"Compressor efficiency","tr":"kompresör verimi"} },
    { id: "operatingHours", label: "Yıllık Çalışma Saati", label_i18n: {"en":"Annual operating hours","tr":"Yıllık Çalışma Saati"}, type: "number", unit: "saat", required: true, smartDefault: 8000, validation: { min: 1 }, helper: "", expertMeaning: "Annual operating hours", expertMeaning_i18n: {"en":"Annual operating hours","tr":"yıllık çalışma saati"} },
    { id: "elecRate", label: "Elektrik Tarifesi", label_i18n: {"en":"Elektrik Tarifesi","tr":"Elektrik Tarifesi"}, type: "number", unit: "USD/kWh", required: true, smartDefault: 0.12, validation: { min: 0 }, helper: "", expertMeaning: "Electricity rate", expertMeaning_i18n: {"en":"Electricity rate","tr":"Electricity rate"} },
    { id: "gridEF", label: "Emisyon Faktörü", label_i18n: {"en":"Grid emission factor","tr":"Emisyon Faktörü"}, type: "number", unit: "tCO2e/MWh", required: false, smartDefault: 0.45, validation: { min: 0 }, helper: "", expertMeaning: "Grid emission factor", expertMeaning_i18n: {"en":"Grid emission factor","tr":"emisyon faktörü"} },
    { id: "repairCost", label: "Tamir Maliyeti", label_i18n: {"en":"Tamir Maliyeti","tr":"Tamir Maliyeti"}, type: "number", unit: "USD", required: false, smartDefault: 200, validation: { min: 0 }, helper: "", expertMeaning: "Repair cost per leak", expertMeaning_i18n: {"en":"Repair cost per leak","tr":"Repair cost per leak"} },
  ],
  outputs: [
    { id: "leakFlow", label: "Kaçak Debisi", label_i18n: {"en":"Kacak Debisi","tr":"Kaçak Debisi"}, unit: "CFM", format: "number" },
    { id: "powerLoss", label: "Güç Kaybı", label_i18n: {"en":"Guc Kayb","tr":"Güç Kaybı"}, unit: "kW", format: "number" },
    { id: "annualEnergyLoss", label: "Yıllık Enerji Kaybı", label_i18n: {"en":"Yllk Enerji Kayb","tr":"Yıllık Enerji Kaybı"}, unit: "kWh", format: "number" },
    { id: "costPerLeak", label: "Kaçak Başı Maliyet", label_i18n: {"en":"Kacak Bas Maliyet","tr":"Kaçak Başı Maliyet"}, unit: "USD/yıl", format: "currency" },
    { id: "totalLeakCost", label: "Toplam Kaçak Maliyeti", label_i18n: {"en":"Toplam Kacak Maliyeti","tr":"Toplam Kaçak Maliyeti"}, unit: "USD/yıl", format: "currency", isBigNumber: true },
    { id: "carbonEmissions", label: "Karbon Emisyonu", label_i18n: {"en":"Karbon Emisyonu","tr":"Karbon Emisyonu"}, unit: "tCO2e", format: "number" },
    { id: "paybackMonths", label: "Tamir Geri Ödeme", label_i18n: {"en":"Tamir Geri Odeme","tr":"Tamir Geri Ödeme"}, unit: "ay", format: "duration" },
  ],
  thresholds: [{ fieldId: "totalLeakCost", warning: 5000, critical: 20000, direction: "higher_is_bad", warningMessage: "Kaçak maliyeti > $5K/yıl — onarım programı başlatılmalı.", warningMessage_i18n: {"en":"Kaçak maliyeti > $5K/yıl — onarım programı başlatılmalı.","tr":"Kaçak maliyeti > $5K/yıl — onarım programı başlatılmalı."}, criticalMessage: "Kaçak maliyeti > $20K/yıl — acil müdahale gerekli.", criticalMessage_i18n: {"en":"Kaçak maliyeti > $20K/yıl — acil müdahale gerekli.","tr":"Kaçak maliyeti > $20K/yıl — acil müdahale gerekli."} }],
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
  reportTemplate: { title: "Kompresör Kaçak Raporu", title_i18n: {"en":"Kompresör Kaçak Raporu","tr":"Kompresör Kaçak Raporu"}, sections: ["executive_summary", "loss_breakdown", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.1, volatilityPercent: 10, targetMarginPercent: 15, assumptionNotes: ["Kaçak debisi = 22.4×d²×P/√T.", "Güç kaybı = Q×P×144/(33000×Verim).", "Geri ödeme = Tamir / Yıllık maliyet."],assumptionNotes_i18n:[{"en":"Kaçak debisi = 22.4×d²×P/√T.","tr":"Kaçak debisi = 22.4×d²×P/√T."},{"en":"Güç kaybı = Q×P×144/(33000×Verim).","tr":"Güç kaybı = Q×P×144/(33000×Verim)."},{"en":"Geri ödeme = Tamir / Yıllık maliyet.","tr":"Geri ödeme = Tamir / Yıllık maliyet."}] },
};
