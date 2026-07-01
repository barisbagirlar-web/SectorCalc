/**
 * Tool #52 — Hydraulic Sistem Kayıp
 */
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const HYDRAULIC_LOSS_SCHEMA: PremiumCalculatorSchema = {
  id: "hydraulic-system-loss-analyzer", legacyPaidSlug: "hydraulic-system-loss-analyzer",
  name: "Hidrolik Sistem Kayıp & Verim Analizi", name_i18n: {"en":"Hydraulic System Loss & Efficiency Analyzer"}, sectorSlug: "sheet-metal", category: "energy",
  painStatement: "Hidrolik sistemlerde kaçak, sürtünme ve vana kayıpları enerji verimini düşürür ve işletme maliyetini artırır.", painStatement_i18n: {"en":"Hidrolik sistemlerde kaçak, sürtünme ve vana kayıpları enerji verimini düşürür ve işletme maliyetini artırır."},
  inputs: [
    { id: "qLeak", label: "Kaçak Debisi", label_i18n: {"en":"Leakage flow rate"}, type: "number", unit: "L/dak", required: true, smartDefault: 5, validation: { min: 0 }, helper: "", expertMeaning: "Leakage flow rate", expertMeaning_i18n: {"en":"Leakage flow rate"} },
    { id: "systemPressure", label: "Sistem Basıncı", label_i18n: {"en":"System pressure"}, type: "number", unit: "bar", required: true, smartDefault: 200, validation: { min: 0 }, helper: "", expertMeaning: "System pressure", expertMeaning_i18n: {"en":"System pressure"} },
    { id: "flowRate", label: "Pompa Debisi", label_i18n: {"en":"Pompa Debisi"}, type: "number", unit: "L/dak", required: true, smartDefault: 100, validation: { min: 0.1 }, helper: "", expertMeaning: "Pump flow rate", expertMeaning_i18n: {"en":"Pump flow rate"} },
    { id: "deltaPipe", label: "Boru Sürtünme Kaybı", label_i18n: {"en":"Pipe friction loss"}, type: "number", unit: "bar", required: false, smartDefault: 3, validation: { min: 0 }, helper: "", expertMeaning: "Pipe friction loss", expertMeaning_i18n: {"en":"Pipe friction loss"} },
    { id: "deltaValve", label: "Vana Kaybı", label_i18n: {"en":"Valve pressure loss"}, type: "number", unit: "bar", required: false, smartDefault: 2, validation: { min: 0 }, helper: "", expertMeaning: "Valve pressure loss", expertMeaning_i18n: {"en":"Valve pressure loss"} },
    { id: "operatingHours", label: "Yıllık Çalışma Saati", label_i18n: {"en":"Annual operating hours"}, type: "number", unit: "saat/yıl", required: false, smartDefault: 4000, validation: { min: 0 }, helper: "", expertMeaning: "Annual operating hours", expertMeaning_i18n: {"en":"Annual operating hours"} },
    { id: "elecRate", label: "Elektrik Tarifesi", label_i18n: {"en":"Elektrik Tarifesi"}, type: "number", unit: "USD/kWh", required: false, smartDefault: 0.12, validation: { min: 0 }, helper: "", expertMeaning: "Electricity rate", expertMeaning_i18n: {"en":"Electricity rate"} },
    { id: "powerOut", label: "Çıkış Gücü", label_i18n: {"en":"Output power"}, type: "number", unit: "kW", required: false, smartDefault: 30, validation: { min: 0 }, helper: "", expertMeaning: "Output power", expertMeaning_i18n: {"en":"Output power"} },
    { id: "powerIn", label: "Giriş Gücü", label_i18n: {"en":"Input power"}, type: "number", unit: "kW", required: false, smartDefault: 40, validation: { min: 0 }, helper: "", expertMeaning: "Input power", expertMeaning_i18n: {"en":"Input power"} },
  ],
  outputs: [
    { id: "leakLoss", label: "Kaçak Güç Kaybı", label_i18n: {"en":"Kacak Guc Kayb"}, unit: "kW", format: "number" },
    { id: "heatLoss", label: "Toplam Isıl Kayıp", label_i18n: {"en":"Toplam Isl Kayp"}, unit: "kW", format: "number" },
    { id: "eff", label: "Sistem Verimi", label_i18n: {"en":"Sistem Verimi"}, unit: "%", format: "percentage" },
    { id: "annualEnergyCost", label: "Yıllık Enerji Kayıp Maliyeti", label_i18n: {"en":"Yllk Enerji Kayp Maliyeti"}, unit: "USD/yıl", format: "currency", isBigNumber: true },
  ],
  thresholds: [{ fieldId: "eff", warning: 80, critical: 70, direction: "lower_is_bad", warningMessage: "Verim < %80 — kaçak ve sürtünme kayıpları azaltılmalı.", warningMessage_i18n: {"en":"Verim < %80 — kaçak ve sürtünme kayıpları azaltılmalı."}, criticalMessage: "Verim < %70 — sistem revizyonu gerekli.", criticalMessage_i18n: {"en":"Verim < %70 — sistem revizyonu gerekli."} }],
  formulaPipeline: [
    { formulaId: "energy.hydraulic_heat_loss", inputMap: {
        qLeak: "qLeak",
        p: "deltaPipe",
        deltaPPipe: "deltaValve"
      ,
        qFlow: "qFlow",
        deltaPValve: "deltaPValve"}, outputId: "heatLoss" },
    { formulaId: "energy.hydraulic_cost", inputMap: {
        elecRate: "elecRate",
        heat: "heatLoss",
        hours: "operatingHours"
      }, outputId: "annualEnergyCost" },
    { formulaId: "energy.hydraulic_eff", inputMap: {
        pOut: "powerOut",
        pIn: "powerIn"
      }, outputId: "eff" },
  ],
  reportTemplate: { title: "Hydraulic System Loss Report", title_i18n: {"en":"Hydraulic System Loss Report"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.15, volatilityPercent: 15, targetMarginPercent: 20, assumptionNotes: ["Leak loss = Q_Leak×P/600. Friction = ΔP×Q/600.", "Heat = Leak+Friction+Valve. Cost = Heat×Hours×ElecRate.", "Eff = (P_Out/P_In)×100."],assumptionNotes_i18n:[{"en":"Leak loss = Q_Leak×P/600. Friction = ΔP×Q/600."},{"en":"Heat = Leak+Friction+Valve. Cost = Heat×Hours×ElecRate."},{"en":"Eff = (P_Out/P_In)×100."}] },
};
