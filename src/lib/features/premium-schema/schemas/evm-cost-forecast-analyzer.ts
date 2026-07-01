/**
 * Tool #38 — EVM Maliyet Forecast
 */
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const EVM_FORECAST_SCHEMA: PremiumCalculatorSchema = {
  id: "evm-cost-forecast-analyzer", legacyPaidSlug: "evm-cost-forecast-analyzer",
  name: "EVM Maliyet Tahmin & Forekast Analizi", name_i18n: {"en":"EVM Cost Estimate & Forecast Analysis"}, sectorSlug: "construction", category: "cost",
  painStatement: "EVM metrikleri (SV, CV, SPI, CPI) hesaplanmadan proje maliyet ve takvim sapması erken tespit edilemez.", painStatement_i18n: {"en":"Without EVM metrics (SV, CV, SPI, CPI), project cost and schedule variance cannot be detected early."},
  inputs: [
    { id: "bac", label: "BAC (Bütçelenen Tamamlanma)", label_i18n: {"en":"BAC (Budget at Completion)"}, type: "number", unit: "USD", required: true, smartDefault: 1000000, validation: { min: 1 }, helper: "", expertMeaning: "Budget at completion", expertMeaning_i18n: {"en":"Budget at completion"} },
    { id: "plannedValue", label: "PV (Planlanan Değer)", label_i18n: {"en":"PV (Planned Value)"}, type: "number", unit: "USD", required: true, smartDefault: 500000, validation: { min: 0 }, helper: "", expertMeaning: "Planned value to date", expertMeaning_i18n: {"en":"Planned value to date"} },
    { id: "earnedValue", label: "EV (Kazanılan Değer)", label_i18n: {"en":"EV (Earned Value)"}, type: "number", unit: "USD", required: true, smartDefault: 450000, validation: { min: 0 }, helper: "", expertMeaning: "Earned value to date", expertMeaning_i18n: {"en":"Earned value to date"} },
    { id: "actualCost", label: "AC (Gerçek Maliyet)", label_i18n: {"en":"AC (Actual Cost)"}, type: "number", unit: "USD", required: true, smartDefault: 520000, validation: { min: 0 }, helper: "", expertMeaning: "Actual cost to date", expertMeaning_i18n: {"en":"Actual cost to date"} },
    { id: "varianceReason", label: "Varyans Nedeni", label_i18n: {"en":"Variance Cause"}, type: "select", unit: "", enumValues: ["verimlilik", "malzeme", "işçilik", "kapsam", "diğer"], required: false, smartDefault: "verimlilik", helper: "", expertMeaning: "Primary variance cause", expertMeaning_i18n: {"en":"Primary variance cause"} },
    { id: "remainingRisk", label: "Kalan Risk Yüzdesi", label_i18n: {"en":"Remaining Risk Percentage"}, type: "number", unit: "%", required: false, smartDefault: 15, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Remaining risk percentage", expertMeaning_i18n: {"en":"Remaining risk percentage"} },
    { id: "managementReserve", label: "Yönetim Rezervi", label_i18n: {"en":"Management Reserve"}, type: "number", unit: "USD", required: false, smartDefault: 50000, validation: { min: 0 }, helper: "", expertMeaning: "Management reserve", expertMeaning_i18n: {"en":"Management reserve"} },
  ],
  outputs: [
    { id: "sv", label: "SV (Program Sapması)", label_i18n: {"en":"SV (Program Sapmas)"}, unit: "USD", format: "currency" },
    { id: "cv", label: "CV (Maliyet Sapması)", label_i18n: {"en":"CV (Maliyet Sapmas)"}, unit: "USD", format: "currency" },
    { id: "spi", label: "SPI (Program Performansı)", label_i18n: {"en":"SPI (Program Performans)"}, unit: "", format: "number" },
    { id: "cpi", label: "CPI (Maliyet Performansı)", label_i18n: {"en":"CPI (Maliyet Performans)"}, unit: "", format: "number" },
    { id: "eac", label: "EAC (Tahmini Tamamlanma)", label_i18n: {"en":"EAC (Tahmini Tamamlanma)"}, unit: "USD", format: "currency" },
    { id: "vac", label: "VAC (Tamamlanma Sapması)", label_i18n: {"en":"VAC (Tamamlanma Sapmas)"}, unit: "USD", format: "currency", isBigNumber: true },
  ],
  thresholds: [{ fieldId: "cpi", warning: 0.9, critical: 0.8, direction: "lower_is_bad", warningMessage: "CPI < 0.9 — maliyet aşımı var, aksiyon alınmalı.", warningMessage_i18n: {"en":"CPI < 0.9 — cost overrun exists, action needed."}, criticalMessage: "CPI < 0.8 — proje maliyet kontrolü kaybedilmiş.", criticalMessage_i18n: {"en":"CPI < 0.8 — project cost control lost."} }],
  formulaPipeline: [
    { formulaId: "cost.evm_sv", inputMap: {
        ev: "earnedValue",
        pv: "plannedValue"
      }, outputId: "sv" },
    { formulaId: "cost.evm_cv", inputMap: {
        ev: "earnedValue",
        ac: "actualCost"
      }, outputId: "cv" },
    { formulaId: "cost.evm_spi", inputMap: {
        ev: "earnedValue",
        pv: "plannedValue"
      }, outputId: "spi" },
    { formulaId: "cost.evm_cpi", inputMap: {
        ev: "earnedValue",
        ac: "actualCost"
      }, outputId: "cpi" },
    { formulaId: "cost.evm_eac_cpi", inputMap: { bac: "bac", cpi: "cpi" }, outputId: "eac" },
    { formulaId: "cost.evm_vac", inputMap: { bac: "bac", eac: "eac" }, outputId: "vac" },
  ],
  reportTemplate: { title: "EVM Cost Forecast Report", title_i18n: {"en":"EVM Cost Forecast Report"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.15, volatilityPercent: 15, targetMarginPercent: 20, assumptionNotes: ["SV = EV-PV. CV = EV-AC. SPI = EV/PV. CPI = EV/AC.", "EAC(CPI) = BAC/CPI. VAC = BAC-EAC.", "If CPI < 0.8 the project is over budget."],assumptionNotes_i18n:[{"en":"SV = EV-PV. CV = EV-AC. SPI = EV/PV. CPI = EV/AC."},{"en":"EAC(CPI) = BAC/CPI. VAC = BAC-EAC."},{"en":"If CPI < 0.8 the project is over budget."}]},
};
