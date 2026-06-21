/**
 * Tool #22 — Nakit Akışı Açığı
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const CASH_FLOW_GAP_SCHEMA: PremiumCalculatorSchema = {
  id: "cash-flow-gap-analyzer", legacyPaidSlug: "cash-flow-gap-analyzer",
  name: "Nakit Akışı Açığı Analizi", name_i18n: {"en":"Nakit Akışı Açığı Analizi","tr":"Nakit Akışı Açığı Analizi"}, sectorSlug: "financial-planning", category: "measurement",
  painStatement: "Nakit akışı açığı, DSO/DPO/DIO dengesi ve nakit döngüsü hesaplanmazsa likidite krizi önceden tespit edilemez.", painStatement_i18n: {"en":"Nakit akışı açığı, DSO/DPO/DIO dengesi ve nakit döngüsü hesaplanmazsa likidite krizi önceden tespit edilemez.","tr":"Nakit akışı açığı, DSO/DPO/DIO dengesi ve nakit döngüsü hesaplanmazsa likidite krizi önceden tespit edilemez."},
  inputs: [
    { id: "monthlyRevenue", label: "Aylık Gelir", label_i18n: {"en":"Aylık Gelir","tr":"Aylık Gelir"}, type: "number", unit: "USD", required: true, smartDefault: 100000, validation: { min: 0 }, helper: "", expertMeaning: "Monthly revenue", expertMeaning_i18n: {"en":"Monthly revenue","tr":"Monthly revenue"} },
    { id: "monthlyExpenses", label: "Aylık Giderler", label_i18n: {"en":"Aylık Giderler","tr":"Aylık Giderler"}, type: "number", unit: "USD", required: true, smartDefault: 85000, validation: { min: 0 }, helper: "", expertMeaning: "Monthly expenses", expertMeaning_i18n: {"en":"Monthly expenses","tr":"Monthly expenses"} },
    { id: "accountsReceivable", label: "Alacak Bakiyesi", label_i18n: {"en":"Alacak Bakiyesi","tr":"Alacak Bakiyesi"}, type: "number", unit: "USD", required: true, smartDefault: 150000, validation: { min: 0 }, helper: "", expertMeaning: "Accounts receivable", expertMeaning_i18n: {"en":"Accounts receivable","tr":"Accounts receivable"} },
    { id: "accountsPayable", label: "Borç Bakiyesi", label_i18n: {"en":"Borç Bakiyesi","tr":"Borç Bakiyesi"}, type: "number", unit: "USD", required: true, smartDefault: 80000, validation: { min: 0 }, helper: "", expertMeaning: "Accounts payable", expertMeaning_i18n: {"en":"Accounts payable","tr":"Accounts payable"} },
    { id: "inventoryValue", label: "Stok Değeri", label_i18n: {"en":"Stok Değeri","tr":"Stok Değeri"}, type: "number", unit: "USD", required: true, smartDefault: 120000, validation: { min: 0 }, helper: "", expertMeaning: "Inventory value", expertMeaning_i18n: {"en":"Inventory value","tr":"Inventory value"} },
    { id: "cogsMonthly", label: "Aylık Satılan Mal Maliyeti", label_i18n: {"en":"Aylık Satılan Mal Maliyeti","tr":"Aylık Satılan Mal Maliyeti"}, type: "number", unit: "USD", required: true, smartDefault: 60000, validation: { min: 0 }, helper: "", expertMeaning: "Monthly COGS", expertMeaning_i18n: {"en":"Monthly COGS","tr":"Monthly COGS"} },
    { id: "numMonths", label: "Projeksiyon Ay Sayısı", label_i18n: {"en":"Projeksiyon Ay Sayısı","tr":"Projeksiyon Ay Sayısı"}, type: "number", unit: "ay", required: false, smartDefault: 6, validation: { min: 1, max: 24 }, helper: "", expertMeaning: "Projection months", expertMeaning_i18n: {"en":"Projection months","tr":"Projection months"} },
  ],
  outputs: [
    { id: "cashInflow", label: "Aylık Nakit Girişi", label_i18n: {"en":"Aylık Nakit Girişi","tr":"Aylık Nakit Girişi"}, unit: "USD", format: "currency" },
    { id: "cashOutflow", label: "Aylık Nakit Çıkışı", label_i18n: {"en":"Aylık Nakit Çıkışı","tr":"Aylık Nakit Çıkışı"}, unit: "USD", format: "currency" },
    { id: "netCashFlow", label: "Net Nakit Akışı", label_i18n: {"en":"Net Nakit Akışı","tr":"Net Nakit Akışı"}, unit: "USD/ay", format: "currency" },
    { id: "cumulativeCash", label: "Kümülatif Nakit", label_i18n: {"en":"Kümülatif Nakit","tr":"Kümülatif Nakit"}, unit: "USD", format: "currency" },
    { id: "cashGap", label: "Nakit Açığı", label_i18n: {"en":"Nakit Açığı","tr":"Nakit Açığı"}, unit: "USD", format: "currency" },
    { id: "dso", label: "DSO (Alacak Gün Süresi)", label_i18n: {"en":"DSO (Alacak Gün Süresi)","tr":"DSO (Alacak Gün Süresi)"}, unit: "gün", format: "number" },
    { id: "dpo", label: "DPO (Borç Gün Süresi)", label_i18n: {"en":"DPO (Borç Gün Süresi)","tr":"DPO (Borç Gün Süresi)"}, unit: "gün", format: "number" },
    { id: "dio", label: "DIO (Stok Gün Süresi)", label_i18n: {"en":"DIO (Stok Gün Süresi)","tr":"DIO (Stok Gün Süresi)"}, unit: "gün", format: "number" },
    { id: "cashConversionCycle", label: "Nakit Dönüşüm Döngüsü", label_i18n: {"en":"Nakit Dönüşüm Döngüsü","tr":"Nakit Dönüşüm Döngüsü"}, unit: "gün", format: "number" },
  ],
  thresholds: [{ fieldId: "cashGap", warning: 20000, critical: 50000, direction: "higher_is_bad", warningMessage: "Nakit açığı > $20K — kredi limiti veya factoring değerlendirilmeli.", warningMessage_i18n: {"en":"Nakit açığı > $20K — kredi limiti veya factoring değerlendirilmeli.","tr":"Nakit açığı > $20K — kredi limiti veya factoring değerlendirilmeli."}, criticalMessage: "Nakit açığı > $50K — acil nakit yönetimi aksiyonu gerekli.", criticalMessage_i18n: {"en":"Nakit açığı > $50K — acil nakit yönetimi aksiyonu gerekli.","tr":"Nakit açığı > $50K — acil nakit yönetimi aksiyonu gerekli."} }],
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
  reportTemplate: { title: "Cash Flow Gap Report", title_i18n: {"en":"Cash Flow Gap Report","tr":"Cash Flow Gap Report"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.1, volatilityPercent: 10, targetMarginPercent: 15, assumptionNotes: ["DSO = (Alacak/Gelir)×30 gün.", "CCC = DSO + DIO − DPO.", "Negatif kümülatif nakit = nakit açığı."],assumptionNotes_i18n:[{"en":"DSO = (Alacak/Gelir)×30 gün.","tr":"DSO = (Alacak/Gelir)×30 gün."},{"en":"CCC = DSO + DIO − DPO.","tr":"CCC = DSO + DIO − DPO."},{"en":"Negatif kümülatif nakit = nakit açığı.","tr":"Negatif kümülatif nakit = nakit açığı."}] },
};
