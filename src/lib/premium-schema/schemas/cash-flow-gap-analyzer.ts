/**
 * Tool #22 — Nakit Akışı Açığı
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const CASH_FLOW_GAP_SCHEMA: PremiumCalculatorSchema = {
  id: "cash-flow-gap-analyzer", legacyPaidSlug: "cash-flow-gap-analyzer",
  name: "Nakit Akışı Açığı Analizi", sectorSlug: "financial-planning", category: "measurement",
  painStatement: "Nakit akışı açığı, DSO/DPO/DIO dengesi ve nakit döngüsü hesaplanmazsa likidite krizi önceden tespit edilemez.",
  inputs: [
    { id: "monthlyRevenue", label: "Aylık Gelir", type: "number", unit: "USD", required: true, smartDefault: 100000, validation: { min: 0 }, helper: "", expertMeaning: "Monthly revenue" },
    { id: "monthlyExpenses", label: "Aylık Giderler", type: "number", unit: "USD", required: true, smartDefault: 85000, validation: { min: 0 }, helper: "", expertMeaning: "Monthly expenses" },
    { id: "accountsReceivable", label: "Alacak Bakiyesi", type: "number", unit: "USD", required: true, smartDefault: 150000, validation: { min: 0 }, helper: "", expertMeaning: "Accounts receivable" },
    { id: "accountsPayable", label: "Borç Bakiyesi", type: "number", unit: "USD", required: true, smartDefault: 80000, validation: { min: 0 }, helper: "", expertMeaning: "Accounts payable" },
    { id: "inventoryValue", label: "Stok Değeri", type: "number", unit: "USD", required: true, smartDefault: 120000, validation: { min: 0 }, helper: "", expertMeaning: "Inventory value" },
    { id: "cogsMonthly", label: "Aylık Satılan Mal Maliyeti", type: "number", unit: "USD", required: true, smartDefault: 60000, validation: { min: 0 }, helper: "", expertMeaning: "Monthly COGS" },
    { id: "numMonths", label: "Projeksiyon Ay Sayısı", type: "number", unit: "ay", required: false, smartDefault: 6, validation: { min: 1, max: 24 }, helper: "", expertMeaning: "Projection months" },
  ],
  outputs: [
    { id: "cashInflow", label: "Aylık Nakit Girişi", unit: "USD", format: "currency" },
    { id: "cashOutflow", label: "Aylık Nakit Çıkışı", unit: "USD", format: "currency" },
    { id: "netCashFlow", label: "Net Nakit Akışı", unit: "USD/ay", format: "currency" },
    { id: "cumulativeCash", label: "Kümülatif Nakit", unit: "USD", format: "currency" },
    { id: "cashGap", label: "Nakit Açığı", unit: "USD", format: "currency" },
    { id: "dso", label: "DSO (Alacak Gün Süresi)", unit: "gün", format: "number" },
    { id: "dpo", label: "DPO (Borç Gün Süresi)", unit: "gün", format: "number" },
    { id: "dio", label: "DIO (Stok Gün Süresi)", unit: "gün", format: "number" },
    { id: "cashConversionCycle", label: "Nakit Dönüşüm Döngüsü", unit: "gün", format: "number" },
  ],
  thresholds: [{ fieldId: "cashGap", warning: 20000, critical: 50000, direction: "higher_is_bad", warningMessage: "Nakit açığı > $20K — kredi limiti veya factoring değerlendirilmeli.", criticalMessage: "Nakit açığı > $50K — acil nakit yönetimi aksiyonu gerekli." }],
  formulaPipeline: [
    { formulaId: "measurement.cash_inflow", inputMap: { monthlyRevenue: "monthlyRevenue" }, outputId: "cashInflow" },
    { formulaId: "measurement.cash_outflow", inputMap: { monthlyExpenses: "monthlyExpenses" }, outputId: "cashOutflow" },
    { formulaId: "measurement.net_cash_flow", inputMap: { cashInflow: "cashInflow", cashOutflow: "cashOutflow" }, outputId: "netCashFlow" },
    { formulaId: "measurement.cumulative_cash", inputMap: { netCashFlow: "netCashFlow", numMonths: "numMonths" }, outputId: "cumulativeCash" },
    { formulaId: "measurement.cash_gap", inputMap: { cumulativeCash: "cumulativeCash", netCashFlow: "netCashFlow" }, outputId: "cashGap" },
    { formulaId: "measurement.dso", inputMap: { accountsReceivable: "accountsReceivable", monthlyRevenue: "monthlyRevenue" }, outputId: "dso" },
    { formulaId: "measurement.dpo", inputMap: { accountsPayable: "accountsPayable", cogsMonthly: "cogsMonthly" }, outputId: "dpo" },
    { formulaId: "measurement.dio", inputMap: { inventoryValue: "inventoryValue", cogsMonthly: "cogsMonthly" }, outputId: "dio" },
    { formulaId: "measurement.cash_conversion_cycle", inputMap: { dso: "dso", dpo: "dpo", dio: "dio" }, outputId: "cashConversionCycle" },
  ],
  reportTemplate: { title: "Cash Flow Gap Report", sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.1, volatilityPercent: 10, targetMarginPercent: 15, assumptionNotes: ["DSO = (Alacak/Gelir)×30 gün.", "CCC = DSO + DIO − DPO.", "Negatif kümülatif nakit = nakit açığı."] },
};
