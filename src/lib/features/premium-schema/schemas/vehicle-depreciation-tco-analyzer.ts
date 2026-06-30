/**
 * Tool #4 — Araç Amortismanı (Vehicle Depreciation & TCO)
 * SL → DB → TCO → TaxShield
 */
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";

const DEPRECIATION_METHOD_OPTIONS = [
  { value: "SL", label: "Straight-Line (SL)", label_i18n: {"en":"Straight-Line (SL)","tr":"Straight-Line (SL)"} },
  { value: "DB", label: "Double-Declining (DB)", label_i18n: {"en":"Double-Declining (DB)","tr":"Double-Declining (DB)"} },
  { value: "MACRS", label: "MACRS (ABD)", label_i18n: {"en":"MACRS (ABD)","tr":"MACRS (ABD)"} },
  { value: "UoP", label: "Units of Production (UoP)", label_i18n: {"en":"Units of Production (UoP)","tr":"Units of Production (UoP)"} },
] as const;

const TAX_COUNTRY_OPTIONS = [
  { value: "US", label: "United States", label_i18n: {"en":"United States","tr":"United States"} }, { value: "EU", label: "European Union", label_i18n: {"en":"European Union","tr":"European Union"} },
  { value: "TR", label: "Türkiye", label_i18n: {"en":"Turkiye","tr":"Türkiye"} }, { value: "UK", label: "United Kingdom", label_i18n: {"en":"United Kingdom","tr":"United Kingdom"} },
] as const;

export const VEHICLE_DEPRECIATION_SCHEMA: PremiumCalculatorSchema = {
  id: "vehicle-depreciation-tco-analyzer", legacyPaidSlug: "vehicle-depreciation-tco-analyzer",
  name: "Araç Amortismanı & TCO Analizi", name_i18n: {"en":"Arac Amortismani & TCO Analizi","tr":"Araç Amortismanı & TCO Analizi"}, sectorSlug: "logistics-transport", category: "cost",
  painStatement: "Filo yatırımlarında amortisman yöntemi seçimi ve TCO hesabı yapılmazsa vergi avantajı kaçırılır, nakit akışı yanlış modellenir.", painStatement_i18n: {"en":"Filo yatırımlarında amortisman yöntemi seçimi ve TCO hesabı yapılmazsa vergi avantajı kaçırılır, nakit akışı yanlış modellenir.","tr":"Filo yatırımlarında amortisman yöntemi seçimi ve TCO hesabı yapılmazsa vergi avantajı kaçırılır, nakit akışı yanlış modellenir."},
  inputs: [
    { id: "acquisitionCost", label: "Edinme Bedeli", label_i18n: {"en":"Edinme Bedeli","tr":"Edinme Bedeli"}, type: "number", unit: "USD", required: true, smartDefault: 50000, validation: { min: 1 }, helper: "", expertMeaning: "Purchase price incl. taxes", expertMeaning_i18n: {"en":"Purchase price incl. taxes","tr":"Purchase price incl. taxes"} },
    { id: "salvageValue", label: "Kalıntı Değer", label_i18n: {"en":"Residual value at end of life","tr":"Kalıntı Değer"}, type: "number", unit: "USD", required: true, smartDefault: 10000, validation: { min: 0 }, helper: "Aracın ekonomik ömrü sonundaki tahmini değeri.", helper_i18n: {"en":"Aracın ekonomik ömrü sonundaki tahmini değeri.","tr":"Aracın ekonomik ömrü sonundaki tahmini değeri."}, expertMeaning: "Residual value at end of life", expertMeaning_i18n: {"en":"Residual value at end of life","tr":"kalıntı değer"} },
    { id: "usefulLife", label: "Faydalı Ömür", label_i18n: {"en":"Depreciation period","tr":"Faydalı Ömür"}, type: "number", unit: "yıl", required: true, smartDefault: 5, validation: { min: 1, max: 30 }, helper: "", expertMeaning: "Depreciation period", expertMeaning_i18n: {"en":"Depreciation period","tr":"faydalı ömür"} },
    { id: "annualKm", label: "Yıllık Km Beklentisi", label_i18n: {"en":"For UoP method","tr":"Yıllık Km Beklentisi"}, type: "number", unit: "km/yıl", required: false, smartDefault: 30000, validation: { min: 0 }, helper: "", expertMeaning: "For UoP method", expertMeaning_i18n: {"en":"For UoP method","tr":"yıllık km beklentisi"} },
    { id: "totalExpectedKm", label: "Toplam Beklenen Km", label_i18n: {"en":"Toplam Beklenen Km","tr":"Toplam Beklenen Km"}, type: "number", unit: "km", required: false, smartDefault: 150000, validation: { min: 0 }, helper: "", expertMeaning: "Total useful life in km (UoP)", expertMeaning_i18n: {"en":"Total useful life in km (UoP)","tr":"Total useful life in km (UoP)"} },
    { id: "depreciationMethod", label: "Amortisman Yöntemi", label_i18n: {"en":"SL, DB, MACRS or UoP","tr":"Amortisman Yöntemi"}, type: "select", unit: "", required: true, smartDefault: "SL", options: [...DEPRECIATION_METHOD_OPTIONS], helper: "", expertMeaning: "SL, DB, MACRS or UoP", expertMeaning_i18n: {"en":"SL, DB, MACRS or UoP","tr":"amortisman yöntemi"} },
    { id: "taxRate", label: "Kurumlar Vergisi", label_i18n: {"en":"Kurumlar Vergisi","tr":"Kurumlar Vergisi"}, type: "number", unit: "%", required: true, smartDefault: 25, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Corporate tax rate", expertMeaning_i18n: {"en":"Corporate tax rate","tr":"Corporate tax rate"} },
    { id: "wacc", label: "İskonto Oranı (WACC)", label_i18n: {"en":"Discount rate for PV","tr":"İskonto Oranı (WACC)"}, type: "number", unit: "%", required: true, smartDefault: 10, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Discount rate for PV", expertMeaning_i18n: {"en":"Discount rate for PV","tr":"i̇skonto oranı (wacc)"} },
    { id: "annualOpCost", label: "Yıllık İşletme Maliyeti", label_i18n: {"en":"Insurance, registration, tires","tr":"Yıllık İşletme Maliyeti"}, type: "number", unit: "USD", required: false, smartDefault: 5000, validation: { min: 0 }, helper: "", expertMeaning: "Insurance, registration, tires", expertMeaning_i18n: {"en":"Insurance, registration, tires","tr":"yıllık i̇şletme maliyeti"} },
    { id: "annualMaintCost", label: "Yıllık Bakım Maliyeti", label_i18n: {"en":"Repairs, maintenance","tr":"Yıllık Bakım Maliyeti"}, type: "number", unit: "USD", required: false, smartDefault: 3000, validation: { min: 0 }, helper: "", expertMeaning: "Repairs, maintenance", expertMeaning_i18n: {"en":"Repairs, maintenance","tr":"yıllık bakım maliyeti"} },
  ],
  outputs: [
    { id: "slAnnual", label: "SL Yıllık Amortisman", label_i18n: {"en":"SL Yllk Amortisman","tr":"SL Yıllık Amortisman"}, unit: "USD", format: "currency" },
    { id: "slMonthly", label: "SL Aylık Amortisman", label_i18n: {"en":"SL Aylk Amortisman","tr":"SL Aylık Amortisman"}, unit: "USD", format: "currency" },
    { id: "dbRate", label: "DB Yıllık Oran", label_i18n: {"en":"DB Yllk Oran","tr":"DB Yıllık Oran"}, unit: "%", format: "percentage" },
    { id: "taxShieldAnnual", label: "Yıllık Vergi Kalkanı", label_i18n: {"en":"Yllk Vergi Kalkan","tr":"Yıllık Vergi Kalkanı"}, unit: "USD", format: "currency" },
    { id: "tco", label: "TCO (Toplam Sahip Olma Maliyeti)", label_i18n: {"en":"TCO (Toplam Sahip Olma Maliyeti)","tr":"TCO (Toplam Sahip Olma Maliyeti)"}, unit: "USD", format: "currency", isBigNumber: true },
  ],
  thresholds: [
    { fieldId: "tco", warning: 75000, critical: 100000, direction: "higher_is_bad", warningMessage: "TCO > $75K — maliyet optimizasyonu değerlendir.", warningMessage_i18n: {"en":"TCO > $75K — maliyet optimizasyonu değerlendir.","tr":"TCO > $75K — maliyet optimizasyonu değerlendir."}, criticalMessage: "TCO > $100K — alternatif araç/finansman modelleri incelenmeli.", criticalMessage_i18n: {"en":"TCO > $100K — alternatif araç/finansman modelleri incelenmeli.","tr":"TCO > $100K — alternatif araç/finansman modelleri incelenmeli."} },
  ],
  formulaPipeline: [
    { formulaId: "depreciation.sl_annual", inputMap: { cost: "acquisitionCost", residualValue: "salvageValue", usefulLife: "usefulLife" }, outputId: "slAnnual" },
    { formulaId: "depreciation.db_rate", inputMap: { usefulLife: "usefulLife" }, outputId: "dbRate" },
    { formulaId: "depreciation.tco", inputMap: { acquisitionCost: "acquisitionCost", annualOpCost: "annualOpCost", annualMaintCost: "annualMaintCost", fuelCostPerYear: "annualOpCost", residualValue: "salvageValue", discountRate: "wacc", usefulLife: "usefulLife" }, outputId: "tco" },
    { formulaId: "depreciation.tax_shield", inputMap: { annualDepreciation: "slAnnual", taxRate: "taxRate" }, outputId: "taxShieldAnnual" },
  ],
  reportTemplate: { title: "Vehicle Depreciation & TCO Report", title_i18n: {"en":"Vehicle Depreciation & TCO Report","tr":"Vehicle Depreciation & TCO Report"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.1, volatilityPercent: 10, targetMarginPercent: 15, assumptionNotes: ["SL = (Cost - Salvage) / Life. DB = 2/Life % of remaining book value.", "TCO = Acquisition + PV(Operating + Maintenance) - PV(Salvage).", "Tax shield = Depreciation × TaxRate. PV at WACC.", "MACRS and UoP methods require additional asset class data."],assumptionNotes_i18n:[{"en":"SL = (Cost - Salvage) / Life. DB = 2/Life % of remaining book value.","tr":"SL = (Cost - Salvage) / Life. DB = 2/Life % of remaining book value."},{"en":"TCO = Acquisition + PV(Operating + Maintenance) - PV(Salvage).","tr":"TCO = Acquisition + PV(Operating + Maintenance) - PV(Salvage)."},{"en":"Tax shield = Depreciation × TaxRate. PV at WACC.","tr":"Tax shield = Depreciation × TaxRate. PV at WACC."},{"en":"MACRS and UoP methods require additional asset class data.","tr":"MACRS and UoP methods require additional asset class data."}] },
};
