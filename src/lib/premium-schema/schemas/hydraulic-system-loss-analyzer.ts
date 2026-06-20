/**
 * Tool #52 — Hydraulic Sistem Kayıp
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const HYDRAULIC_LOSS_SCHEMA: PremiumCalculatorSchema = {
  id: "hydraulic-system-loss-analyzer", legacyPaidSlug: "hydraulic-system-loss-analyzer",
  name: "Hidrolik Sistem Kayıp & Verim Analizi", sectorSlug: "sheet-metal", category: "energy",
  painStatement: "Hidrolik sistemlerde kaçak, sürtünme ve vana kayıpları enerji verimini düşürür ve işletme maliyetini artırır.",
  inputs: [
    { id: "qLeak", label: "Kaçak Debisi", type: "number", unit: "L/dak", required: true, smartDefault: 5, validation: { min: 0 }, helper: "", expertMeaning: "Leakage flow rate" },
    { id: "systemPressure", label: "Sistem Basıncı", type: "number", unit: "bar", required: true, smartDefault: 200, validation: { min: 0 }, helper: "", expertMeaning: "System pressure" },
    { id: "flowRate", label: "Pompa Debisi", type: "number", unit: "L/dak", required: true, smartDefault: 100, validation: { min: 0.1 }, helper: "", expertMeaning: "Pump flow rate" },
    { id: "deltaPipe", label: "Boru Sürtünme Kaybı", type: "number", unit: "bar", required: false, smartDefault: 3, validation: { min: 0 }, helper: "", expertMeaning: "Pipe friction loss" },
    { id: "deltaValve", label: "Vana Kaybı", type: "number", unit: "bar", required: false, smartDefault: 2, validation: { min: 0 }, helper: "", expertMeaning: "Valve pressure loss" },
    { id: "operatingHours", label: "Yıllık Çalışma Saati", type: "number", unit: "saat/yıl", required: false, smartDefault: 4000, validation: { min: 0 }, helper: "", expertMeaning: "Annual operating hours" },
    { id: "elecRate", label: "Elektrik Tarifesi", type: "number", unit: "USD/kWh", required: false, smartDefault: 0.12, validation: { min: 0 }, helper: "", expertMeaning: "Electricity rate" },
    { id: "powerOut", label: "Çıkış Gücü", type: "number", unit: "kW", required: false, smartDefault: 30, validation: { min: 0 }, helper: "", expertMeaning: "Output power" },
    { id: "powerIn", label: "Giriş Gücü", type: "number", unit: "kW", required: false, smartDefault: 40, validation: { min: 0 }, helper: "", expertMeaning: "Input power" },
  ],
  outputs: [
    { id: "leakLoss", label: "Kaçak Güç Kaybı", unit: "kW", format: "number" },
    { id: "heatLoss", label: "Toplam Isıl Kayıp", unit: "kW", format: "number" },
    { id: "eff", label: "Sistem Verimi", unit: "%", format: "percentage" },
    { id: "annualEnergyCost", label: "Yıllık Enerji Kayıp Maliyeti", unit: "USD/yıl", format: "currency", isBigNumber: true },
  ],
  thresholds: [{ fieldId: "eff", warning: 80, critical: 70, direction: "lower_is_bad", warningMessage: "Verim < %80 — kaçak ve sürtünme kayıpları azaltılmalı.", criticalMessage: "Verim < %70 — sistem revizyonu gerekli." }],
  formulaPipeline: [
    { formulaId: "energy.hydraulic_heat_loss", inputMap: { leakLoss: "qLeak", frictionLoss: "deltaPipe", valveLoss: "deltaValve" }, outputId: "heatLoss" },
    { formulaId: "energy.hydraulic_cost", inputMap: { heatLoss: "heatLoss", operatingHours: "operatingHours", elecRate: "elecRate" }, outputId: "annualEnergyCost" },
    { formulaId: "energy.hydraulic_eff", inputMap: { powerOut: "powerOut", powerIn: "powerIn" }, outputId: "eff" },
  ],
  reportTemplate: { title: "Hydraulic System Loss Report", sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.15, volatilityPercent: 15, targetMarginPercent: 20, assumptionNotes: ["Leak loss = Q_Leak×P/600. Friction = ΔP×Q/600.", "Heat = Leak+Friction+Valve. Cost = Heat×Hours×ElecRate.", "Eff = (P_Out/P_In)×100."] },
};
