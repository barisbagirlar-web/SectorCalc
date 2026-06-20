/**
 * Tool #4 — Araç Amortismanı (Vehicle Depreciation & TCO)
 * SL → DB → TCO → TaxShield
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

const DEPRECIATION_METHOD_OPTIONS = [
  { value: "SL", label: "Straight-Line (SL)" },
  { value: "DB", label: "Double-Declining (DB)" },
  { value: "MACRS", label: "MACRS (ABD)" },
  { value: "UoP", label: "Units of Production (UoP)" },
] as const;

const TAX_COUNTRY_OPTIONS = [
  { value: "US", label: "United States" }, { value: "EU", label: "European Union" },
  { value: "TR", label: "Türkiye" }, { value: "UK", label: "United Kingdom" },
] as const;

export const VEHICLE_DEPRECIATION_SCHEMA: PremiumCalculatorSchema = {
  id: "vehicle-depreciation-tco-analyzer", legacyPaidSlug: "vehicle-depreciation-tco-analyzer",
  name: "Araç Amortismanı & TCO Analizi", sectorSlug: "logistics-transport", category: "cost",
  painStatement: "Filo yatırımlarında amortisman yöntemi seçimi ve TCO hesabı yapılmazsa vergi avantajı kaçırılır, nakit akışı yanlış modellenir.",
  inputs: [
    { id: "acquisitionCost", label: "Edinme Bedeli", type: "number", unit: "USD", required: true, smartDefault: 50000, validation: { min: 1 }, helper: "", expertMeaning: "Purchase price incl. taxes" },
    { id: "salvageValue", label: "Kalıntı Değer", type: "number", unit: "USD", required: true, smartDefault: 10000, validation: { min: 0 }, helper: "Aracın ekonomik ömrü sonundaki tahmini değeri.", expertMeaning: "Residual value at end of life" },
    { id: "usefulLife", label: "Faydalı Ömür", type: "number", unit: "yıl", required: true, smartDefault: 5, validation: { min: 1, max: 30 }, helper: "", expertMeaning: "Depreciation period" },
    { id: "annualKm", label: "Yıllık Km Beklentisi", type: "number", unit: "km/yıl", required: false, smartDefault: 30000, validation: { min: 0 }, helper: "", expertMeaning: "For UoP method" },
    { id: "totalExpectedKm", label: "Toplam Beklenen Km", type: "number", unit: "km", required: false, smartDefault: 150000, validation: { min: 0 }, helper: "", expertMeaning: "Total useful life in km (UoP)" },
    { id: "depreciationMethod", label: "Amortisman Yöntemi", type: "select", unit: "", required: true, smartDefault: "SL", options: [...DEPRECIATION_METHOD_OPTIONS], helper: "", expertMeaning: "SL, DB, MACRS or UoP" },
    { id: "taxRate", label: "Kurumlar Vergisi", type: "number", unit: "%", required: true, smartDefault: 25, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Corporate tax rate" },
    { id: "wacc", label: "İskonto Oranı (WACC)", type: "number", unit: "%", required: true, smartDefault: 10, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Discount rate for PV" },
    { id: "annualOpCost", label: "Yıllık İşletme Maliyeti", type: "number", unit: "USD", required: false, smartDefault: 5000, validation: { min: 0 }, helper: "", expertMeaning: "Insurance, registration, tires" },
    { id: "annualMaintCost", label: "Yıllık Bakım Maliyeti", type: "number", unit: "USD", required: false, smartDefault: 3000, validation: { min: 0 }, helper: "", expertMeaning: "Repairs, maintenance" },
  ],
  outputs: [
    { id: "slAnnual", label: "SL Yıllık Amortisman", unit: "USD", format: "currency" },
    { id: "slMonthly", label: "SL Aylık Amortisman", unit: "USD", format: "currency" },
    { id: "dbRate", label: "DB Yıllık Oran", unit: "%", format: "percentage" },
    { id: "taxShieldAnnual", label: "Yıllık Vergi Kalkanı", unit: "USD", format: "currency" },
    { id: "tco", label: "TCO (Toplam Sahip Olma Maliyeti)", unit: "USD", format: "currency", isBigNumber: true },
  ],
  thresholds: [
    { fieldId: "tco", warning: 75000, critical: 100000, direction: "higher_is_bad", warningMessage: "TCO > $75K — maliyet optimizasyonu değerlendir.", criticalMessage: "TCO > $100K — alternatif araç/finansman modelleri incelenmeli." },
  ],
  formulaPipeline: [
    { formulaId: "depreciation.sl_annual", inputMap: { cost: "acquisitionCost", residualValue: "salvageValue", usefulLife: "usefulLife" }, outputId: "slAnnual" },
    { formulaId: "depreciation.db_rate", inputMap: { usefulLife: "usefulLife" }, outputId: "dbRate" },
    { formulaId: "depreciation.tco", inputMap: { acquisitionCost: "acquisitionCost", annualOpCost: "annualOpCost", annualMaintCost: "annualMaintCost", fuelCostPerYear: "annualOpCost", residualValue: "salvageValue", discountRate: "wacc", usefulLife: "usefulLife" }, outputId: "tco" },
    { formulaId: "depreciation.tax_shield", inputMap: { annualDepreciation: "slAnnual", taxRate: "taxRate" }, outputId: "taxShieldAnnual" },
  ],
  reportTemplate: { title: "Vehicle Depreciation & TCO Report", sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.1, volatilityPercent: 10, targetMarginPercent: 15, assumptionNotes: ["SL = (Cost - Salvage) / Life. DB = 2/Life % of remaining book value.", "TCO = Acquisition + PV(Operating + Maintenance) - PV(Salvage).", "Tax shield = Depreciation × TaxRate. PV at WACC.", "MACRS and UoP methods require additional asset class data."] },
};
