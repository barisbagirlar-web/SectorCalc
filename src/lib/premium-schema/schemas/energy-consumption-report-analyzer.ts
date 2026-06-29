/**
 * Tool #34 — Enerji Tüketim Raporu
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const ENERGY_CONSUMPTION_SCHEMA: PremiumCalculatorSchema = {
  id: "energy-consumption-report-analyzer", legacyPaidSlug: "energy-consumption-report-analyzer",
  name: "Enerji Tüketim Raporu & PF Analizi", name_i18n: {"en":"Energy Consumption Report & PF Analysis","tr":"Enerji Tüketim Raporu & PF Analizi"}, sectorSlug: "sheet-metal", category: "energy",
  painStatement: "Enerji faturasında reaktif ceza, talep bedeli ve karbon maliyeti analiz edilmezse işletme gereksiz ödeme yapar.", painStatement_i18n: {"en":"If reactive penalty, demand charge, and carbon cost are not analyzed in the energy bill, the business makes unnecessary payments.","tr":"Enerji faturasında reaktif ceza, talep bedeli ve karbon maliyeti analiz edilmezse işletme gereksiz ödeme yapar."},
  inputs: [
    { id: "activeKwh", label: "Aktif Tüketim (kWh)", label_i18n: {"en":"Active Consumption (kWh)","tr":"Aktif Tüketim (kWh)"}, type: "number", unit: "kWh", required: true, smartDefault: 100000, validation: { min: 0 }, helper: "", expertMeaning: "Active energy consumption", expertMeaning_i18n: {"en":"Active energy consumption","tr":"Aktif enerji tüketimi"} },
    { id: "reactiveKvarh", label: "Reaktif Tüketim (kVArh)", label_i18n: {"en":"Reactive Consumption (kVArh)","tr":"Reaktif Tüketim (kVArh)"}, type: "number", unit: "kVArh", required: true, smartDefault: 40000, validation: { min: 0 }, helper: "", expertMeaning: "Reactive energy consumption", expertMeaning_i18n: {"en":"Reactive energy consumption","tr":"Reaktif enerji tüketimi"} },
    { id: "peakKw", label: "Talep (Peak kW)", label_i18n: {"en":"Demand (Peak kW)","tr":"Talep (Peak kW)"}, type: "number", unit: "kW", required: true, smartDefault: 500, validation: { min: 0 }, helper: "", expertMeaning: "Peak demand in kW", expertMeaning_i18n: {"en":"Peak demand in kW","tr":"kW cinsinden tepe talebi"} },
    { id: "pfThreshold", label: "PF Ceza Eşiği", label_i18n: {"en":"PF Penalty Threshold","tr":"PF Ceza Eşiği"}, type: "number", unit: "%", required: false, smartDefault: 95, validation: { min: 50, max: 100 }, helper: "", expertMeaning: "Power factor threshold", expertMeaning_i18n: {"en":"Power factor threshold","tr":"Güç faktörü eşiği"} },
    { id: "reactiveTariff", label: "Reaktif Ceza Tarifesi", label_i18n: {"en":"Reactive Penalty Tariff","tr":"Reaktif Ceza Tarifesi"}, type: "number", unit: "USD/kVArh", required: false, smartDefault: 0.03, validation: { min: 0 }, helper: "", expertMeaning: "Reactive energy tariff", expertMeaning_i18n: {"en":"Reactive energy tariff","tr":"Reaktif enerji tarifesi"} },
    { id: "demandRate", label: "Güç Bedeli", label_i18n: {"en":"Demand Charge","tr":"Güç Bedeli"}, type: "number", unit: "USD/kW", required: false, smartDefault: 10, validation: { min: 0 }, helper: "", expertMeaning: "Demand charge rate", expertMeaning_i18n: {"en":"Demand charge rate","tr":"Talep bedel oranı"} },
    { id: "baseAmount", label: "Baz Tutar", label_i18n: {"en":"Base Amount","tr":"Baz Tutar"}, type: "number", unit: "USD", required: false, smartDefault: 5000, validation: { min: 0 }, helper: "", expertMeaning: "Base electricity amount", expertMeaning_i18n: {"en":"Base electricity amount","tr":"Baz elektrik tutarı"} },
    { id: "touAmount", label: "TOU (Zaman Dilimi)", label_i18n: {"en":"TOU (Time of Use)","tr":"TOU (Zaman Dilimi)"}, type: "number", unit: "USD", required: false, smartDefault: 2000, validation: { min: 0 }, helper: "", expertMeaning: "Time-of-use charges", expertMeaning_i18n: {"en":"Time-of-use charges","tr":"Zaman dilimi ücretleri"} },
    { id: "taxAmount", label: "Vergi & Fonlar", label_i18n: {"en":"Taxes & Surcharges","tr":"Vergi & Fonlar"}, type: "number", unit: "USD", required: false, smartDefault: 1500, validation: { min: 0 }, helper: "", expertMeaning: "Taxes and surcharges", expertMeaning_i18n: {"en":"Taxes and surcharges","tr":"Vergi ve ek ücretler"} },
    { id: "emisFactor", label: "Emisyon Faktörü", label_i18n: {"en":"Emission Factor","tr":"Emisyon Faktörü"}, type: "number", unit: "kgCO₂/kWh", required: false, smartDefault: 0.4, validation: { min: 0 }, helper: "", expertMeaning: "CO2 emission factor", expertMeaning_i18n: {"en":"CO2 emission factor","tr":"CO2 emisyon faktörü"} },
    { id: "carbonPrice", label: "Karbon Fiyatı", label_i18n: {"en":"Carbon Price","tr":"Karbon Fiyatı"}, type: "number", unit: "USD/ton", required: false, smartDefault: 50, validation: { min: 0 }, helper: "", expertMeaning: "Carbon price per ton", expertMeaning_i18n: {"en":"Carbon price per ton","tr":"Ton başına karbon fiyatı"} },
  ],
  outputs: [
    { id: "powerFactor", label: "Güç Faktörü (PF)", label_i18n: {"en":"Power Factor (PF)","tr":"Güç Faktörü (PF)"}, unit: "", format: "percentage" },
    { id: "reactivePenalty", label: "Reaktif Ceza", label_i18n: {"en":"Reactive Penalty","tr":"Reaktif Ceza"}, unit: "USD", format: "currency" },
    { id: "totalBill", label: "Toplam Fatura", label_i18n: {"en":"Total Bill","tr":"Toplam Fatura"}, unit: "USD", format: "currency" },
    { id: "carbonFootprint", label: "Karbon Maliyeti", label_i18n: {"en":"Carbon Cost","tr":"Karbon Maliyeti"}, unit: "USD", format: "currency", isBigNumber: true },
  ],
  thresholds: [{ fieldId: "powerFactor", warning: 90, critical: 85, direction: "lower_is_bad", warningMessage: "PF < %90 — kompanzasyon iyileştirilmeli.", warningMessage_i18n: {"en":"PF < 90% — improve compensation.","tr":"PF < %90 — kompanzasyon iyileştirilmeli."}, criticalMessage: "PF < %85 — reaktif ceza riski yüksek.", criticalMessage_i18n: {"en":"PF < 85% — reactive penalty risk is high.","tr":"PF < %85 — reaktif ceza riski yüksek."} }],
  formulaPipeline: [
    { formulaId: "energy.power_factor", inputMap: { activeKwh: "activeKwh", reactiveKvarh: "reactiveKvarh" }, outputId: "powerFactor" },
    { formulaId: "energy.reactive_penalty", inputMap: { powerFactor: "powerFactor", pfThreshold: "pfThreshold", activeKwh: "activeKwh", reactiveKvarh: "reactiveKvarh", reactiveTariff: "reactiveTariff" }, outputId: "reactivePenalty" },
    { formulaId: "energy.demand_charge", inputMap: { peakKw: "peakKw", demandRate: "demandRate" }, outputId: "demandCharge" },
    { formulaId: "energy.energy_total_bill", inputMap: { baseAmount: "baseAmount", touAmount: "touAmount", demandCharge: "demandCharge", reactivePenalty: "reactivePenalty", taxAmount: "taxAmount" }, outputId: "totalBill" },
    { formulaId: "energy.energy_carbon_footprint", inputMap: { activeKwh: "activeKwh", emisFactor: "emisFactor", carbonPrice: "carbonPrice" }, outputId: "carbonFootprint" },
  ],
  reportTemplate: { title: "Energy Consumption Report", title_i18n: {"en":"Energy Consumption Report","tr":"Energy Consumption Report"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.1, volatilityPercent: 10, targetMarginPercent: 15, assumptionNotes: ["PF = Active/√(Active²+Reactive²).", "Reactive penalty if PF < threshold.", "Carbon cost = kWh×EmisFactor×CarbonPrice/1000."],assumptionNotes_i18n:[{"en":"PF = Active/√(Active²+Reactive²).","tr":"PF = Active/√(Active²+Reactive²)."},{"en":"Reactive penalty if PF < threshold.","tr":"Reactive penalty if PF < threshold."},{"en":"Carbon cost = kWh×EmisFactor×CarbonPrice/1000.","tr":"Carbon cost = kWh×EmisFactor×CarbonPrice/1000."}] },
};
