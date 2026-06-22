/**
 * Tool #22 — Nakit Akışı Açığı
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const CASH_FLOW_GAP_SCHEMA: PremiumCalculatorSchema = {
  id: "cash-flow-gap-analyzer", legacyPaidSlug: "cash-flow-gap-analyzer",
  name: "Nakit Akışı Açığı Analizi", name_i18n: {"en":"Cash Flow Gap Analysis","tr":"Nakit Akışı Açığı Analizi"}, sectorSlug: "financial-planning", category: "measurement",
  painStatement: "Nakit akışı açığı, DSO/DPO/DIO dengesi ve nakit döngüsü hesaplanmazsa likidite krizi önceden tespit edilemez.", painStatement_i18n: {"en":"Nakit akışı açığı, DSO/DPO/DIO dengesi ve nakit döngüsü hesaplanmazsa likidite krizi önceden tespit edilemez.","tr":"Nakit akışı açığı, DSO/DPO/DIO dengesi ve nakit döngüsü hesaplanmazsa likidite krizi önceden tespit edilemez."},
  inputs: [
    { id: "monthlyRevenue", label: "Aylık Gelir", label_i18n: {"en":"Monthly Revenue","tr":"Aylık Gelir"}, type: "number", unit: "USD", required: true, smartDefault: 100000, validation: { min: 0 }, helper: "", expertMeaning: "Monthly revenue", expertMeaning_i18n: {"en":"Monthly revenue","tr":"Aylık gelir"} },
    { id: "monthlyExpenses", label: "Aylık Giderler", label_i18n: {"en":"Monthly Expenses","tr":"Aylık Giderler"}, type: "number", unit: "USD", required: true, smartDefault: 85000, validation: { min: 0 }, helper: "", expertMeaning: "Monthly expenses", expertMeaning_i18n: {"en":"Monthly expenses","tr":"Aylık giderler"} },
    { id: "accountsReceivable", label: "Alacak Bakiyesi", label_i18n: {"en":"Accounts Receivable","tr":"Alacak Bakiyesi"}, type: "number", unit: "USD", required: true, smartDefault: 150000, validation: { min: 0 }, helper: "", expertMeaning: "Accounts receivable", expertMeaning_i18n: {"en":"Accounts receivable","tr":"Alacak hesapları"} },
    { id: "accountsPayable", label: "Borç Bakiyesi", label_i18n: {"en":"Accounts Payable","tr":"Borç Bakiyesi"}, type: "number", unit: "USD", required: true, smartDefault: 80000, validation: { min: 0 }, helper: "", expertMeaning: "Accounts payable", expertMeaning_i18n: {"en":"Accounts payable","tr":"Borç hesapları"} },
    { id: "inventoryValue", label: "Stok Değeri", label_i18n: {"en":"Inventory Value","tr":"Stok Değeri"}, type: "number", unit: "USD", required: true, smartDefault: 120000, validation: { min: 0 }, helper: "", expertMeaning: "Inventory value", expertMeaning_i18n: {"en":"Inventory value","tr":"Stok değeri"} },
    { id: "cogsMonthly", label: "Aylık Satılan Mal Maliyeti", label_i18n: {"en":"Monthly COGS","tr":"Aylık Satılan Mal Maliyeti"}, type: "number", unit: "USD", required: true, smartDefault: 60000, validation: { min: 0 }, helper: "", expertMeaning: "Monthly COGS", expertMeaning_i18n: {"en":"Monthly COGS","tr":"Aylık satılan mal maliyeti"} },
    { id: "numMonths", label: "Projeksiyon Ay Sayısı", label_i18n: {"en":"Projection Months","tr":"Projeksiyon Ay Sayısı"}, type: "number", unit: "ay", required: false, smartDefault: 6, validation: { min: 1, max: 24 }, helper: "", expertMeaning: "Projection months", expertMeaning_i18n: {"en":"Projection months","tr":"Projeksiyon ay sayısı"} },
  ],
  outputs: [
    { id: "cashInflow", label: "Aylık Nakit Girişi", label_i18n: {"en":"Aylk Nakit Girisi","tr":"Aylık Nakit Girişi"}, unit: "USD", format: "currency" },
    { id: "cashOutflow", label: "Aylık Nakit Çıkışı", label_i18n: {"en":"Aylk Nakit Cks","tr":"Aylık Nakit Çıkışı"}, unit: "USD", format: "currency" },
    { id: "netCashFlow", label: "Net Nakit Akışı", label_i18n: {"en":"Net Nakit Aks","tr":"Net Nakit Akışı"}, unit: "USD/ay", format: "currency" },
    { id: "cumulativeCash", label: "Kümülatif Nakit", label_i18n: {"en":"Kumulatif Nakit","tr":"Kümülatif Nakit"}, unit: "USD", format: "currency" },
    { id: "cashGap", label: "Nakit Açığı", label_i18n: {"en":"Nakit Acg","tr":"Nakit Açığı"}, unit: "USD", format: "currency" },
    { id: "dso", label: "DSO (Alacak Gün Süresi)", label_i18n: {"en":"DSO (Alacak Gun Suresi)","tr":"DSO (Alacak Gün Süresi)"}, unit: "gün", format: "number" },
    { id: "dpo", label: "DPO (Borç Gün Süresi)", label_i18n: {"en":"DPO (Borc Gun Suresi)","tr":"DPO (Borç Gün Süresi)"}, unit: "gün", format: "number" },
    { id: "dio", label: "DIO (Stok Gün Süresi)", label_i18n: {"en":"DIO (Stok Gun Suresi)","tr":"DIO (Stok Gün Süresi)"}, unit: "gün", format: "number" },
    { id: "cashConversionCycle", label: "Nakit Dönüşüm Döngüsü", label_i18n: {"en":"Nakit Donusum Dongusu","tr":"Nakit Dönüşüm Döngüsü"}, unit: "gün", format: "number" },
  ],
  thresholds: [{ fieldId: "cashGap", warning: 20000, critical: 50000, direction: "higher_is_bad", warningMessage: "Nakit açığı > $20K — kredi limiti veya factoring değerlendirilmeli.", warningMessage_i18n: {"en":"Cash gap > $20K — evaluate credit line or factoring.","tr":"Nakit açığı > $20K — kredi limiti veya factoring değerlendirilmeli."}, criticalMessage: "Nakit açığı > $50K — acil nakit yönetimi aksiyonu gerekli.", criticalMessage_i18n: {"en":"Cash gap > $50K — urgent cash management action needed.","tr":"Nakit açığı > $50K — acil nakit yönetimi aksiyonu gerekli."} }],
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
  assumptions: { hiddenLossMultiplier: 1.1, volatilityPercent: 10, targetMarginPercent: 15, assumptionNotes: ["DSO = (Alacak/Gelir)×30 gün.", "CCC = DSO + DIO − DPO.", "Negatif kümülatif nakit = nakit açığı."],assumptionNotes_i18n:[{"en":"DSO = (Alacak/Gelir)×30 gün.","tr":"DSO = (Alacak/Gelir)×30 gün."},{"en":"CCC = DSO + DIO − DPO.","tr":"CCC = DSO + DIO − DPO."},{"en":"Negatif kümülatif nakit = nakit açığı.","tr":"Negatif kümülatif nakit = nakit açığı."}]},
};
