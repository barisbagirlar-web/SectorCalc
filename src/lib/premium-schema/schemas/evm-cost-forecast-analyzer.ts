/**
 * Tool #38 — EVM Maliyet Forecast
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const EVM_FORECAST_SCHEMA: PremiumCalculatorSchema = {
  id: "evm-cost-forecast-analyzer", legacyPaidSlug: "evm-cost-forecast-analyzer",
  name: "EVM Maliyet Tahmin & Forekast Analizi", sectorSlug: "construction", category: "cost",
  painStatement: "EVM metrikleri (SV, CV, SPI, CPI) hesaplanmadan proje maliyet ve takvim sapması erken tespit edilemez.",
  inputs: [
    { id: "bac", label: "BAC (Bütçelenen Tamamlanma)", type: "number", unit: "USD", required: true, smartDefault: 1000000, validation: { min: 1 }, helper: "", expertMeaning: "Budget at completion" },
    { id: "plannedValue", label: "PV (Planlanan Değer)", type: "number", unit: "USD", required: true, smartDefault: 500000, validation: { min: 0 }, helper: "", expertMeaning: "Planned value to date" },
    { id: "earnedValue", label: "EV (Kazanılan Değer)", type: "number", unit: "USD", required: true, smartDefault: 450000, validation: { min: 0 }, helper: "", expertMeaning: "Earned value to date" },
    { id: "actualCost", label: "AC (Gerçek Maliyet)", type: "number", unit: "USD", required: true, smartDefault: 520000, validation: { min: 0 }, helper: "", expertMeaning: "Actual cost to date" },
    { id: "varianceReason", label: "Varyans Nedeni", type: "select", unit: "", enumValues: ["verimlilik", "malzeme", "işçilik", "kapsam", "diğer"], required: false, smartDefault: "verimlilik", helper: "", expertMeaning: "Primary variance cause" },
    { id: "remainingRisk", label: "Kalan Risk Yüzdesi", type: "number", unit: "%", required: false, smartDefault: 15, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Remaining risk percentage" },
    { id: "managementReserve", label: "Yönetim Rezervi", type: "number", unit: "USD", required: false, smartDefault: 50000, validation: { min: 0 }, helper: "", expertMeaning: "Management reserve" },
  ],
  outputs: [
    { id: "sv", label: "SV (Program Sapması)", unit: "USD", format: "currency" },
    { id: "cv", label: "CV (Maliyet Sapması)", unit: "USD", format: "currency" },
    { id: "spi", label: "SPI (Program Performansı)", unit: "", format: "number" },
    { id: "cpi", label: "CPI (Maliyet Performansı)", unit: "", format: "number" },
    { id: "eac", label: "EAC (Tahmini Tamamlanma)", unit: "USD", format: "currency" },
    { id: "vac", label: "VAC (Tamamlanma Sapması)", unit: "USD", format: "currency", isBigNumber: true },
  ],
  thresholds: [{ fieldId: "cpi", warning: 0.9, critical: 0.8, direction: "lower_is_bad", warningMessage: "CPI < 0.9 — maliyet aşımı var, aksiyon alınmalı.", criticalMessage: "CPI < 0.8 — proje maliyet kontrolü kaybedilmiş." }],
  formulaPipeline: [
    { formulaId: "cost.evm_sv", inputMap: { earnedValue: "earnedValue", plannedValue: "plannedValue" }, outputId: "sv" },
    { formulaId: "cost.evm_cv", inputMap: { earnedValue: "earnedValue", actualCost: "actualCost" }, outputId: "cv" },
    { formulaId: "cost.evm_spi", inputMap: { earnedValue: "earnedValue", plannedValue: "plannedValue" }, outputId: "spi" },
    { formulaId: "cost.evm_cpi", inputMap: { earnedValue: "earnedValue", actualCost: "actualCost" }, outputId: "cpi" },
    { formulaId: "cost.evm_eac_cpi", inputMap: { bac: "bac", cpi: "cpi" }, outputId: "eac" },
    { formulaId: "cost.evm_vac", inputMap: { bac: "bac", eac: "eac" }, outputId: "vac" },
  ],
  reportTemplate: { title: "EVM Cost Forecast Report", sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.15, volatilityPercent: 15, targetMarginPercent: 20, assumptionNotes: ["SV = EV-PV. CV = EV-AC. SPI = EV/PV. CPI = EV/AC.", "EAC(CPI) = BAC/CPI. VAC = BAC-EAC.", "If CPI < 0.8 the project is over budget."] },
};
