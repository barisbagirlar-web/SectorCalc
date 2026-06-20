/**
 * Tool #34 — Enerji Tüketim Raporu
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const ENERGY_CONSUMPTION_SCHEMA: PremiumCalculatorSchema = {
  id: "energy-consumption-report-analyzer", legacyPaidSlug: "energy-consumption-report-analyzer",
  name: "Enerji Tüketim Raporu & PF Analizi", sectorSlug: "sheet-metal", category: "energy",
  painStatement: "Enerji faturasında reaktif ceza, talep bedeli ve karbon maliyeti analiz edilmezse işletme gereksiz ödeme yapar.",
  inputs: [
    { id: "activeKwh", label: "Aktif Tüketim (kWh)", type: "number", unit: "kWh", required: true, smartDefault: 100000, validation: { min: 0 }, helper: "", expertMeaning: "Active energy consumption" },
    { id: "reactiveKvarh", label: "Reaktif Tüketim (kVArh)", type: "number", unit: "kVArh", required: true, smartDefault: 40000, validation: { min: 0 }, helper: "", expertMeaning: "Reactive energy consumption" },
    { id: "peakKw", label: "Talep (Peak kW)", type: "number", unit: "kW", required: true, smartDefault: 500, validation: { min: 0 }, helper: "", expertMeaning: "Peak demand in kW" },
    { id: "pfThreshold", label: "PF Ceza Eşiği", type: "number", unit: "%", required: false, smartDefault: 95, validation: { min: 50, max: 100 }, helper: "", expertMeaning: "Power factor threshold" },
    { id: "reactiveTariff", label: "Reaktif Ceza Tarifesi", type: "number", unit: "USD/kVArh", required: false, smartDefault: 0.03, validation: { min: 0 }, helper: "", expertMeaning: "Reactive energy tariff" },
    { id: "demandRate", label: "Güç Bedeli", type: "number", unit: "USD/kW", required: false, smartDefault: 10, validation: { min: 0 }, helper: "", expertMeaning: "Demand charge rate" },
    { id: "baseAmount", label: "Baz Tutar", type: "number", unit: "USD", required: false, smartDefault: 5000, validation: { min: 0 }, helper: "", expertMeaning: "Base electricity amount" },
    { id: "touAmount", label: "TOU (Zaman Dilimi)", type: "number", unit: "USD", required: false, smartDefault: 2000, validation: { min: 0 }, helper: "", expertMeaning: "Time-of-use charges" },
    { id: "taxAmount", label: "Vergi & Fonlar", type: "number", unit: "USD", required: false, smartDefault: 1500, validation: { min: 0 }, helper: "", expertMeaning: "Taxes and surcharges" },
    { id: "emisFactor", label: "Emisyon Faktörü", type: "number", unit: "kgCO₂/kWh", required: false, smartDefault: 0.4, validation: { min: 0 }, helper: "", expertMeaning: "CO2 emission factor" },
    { id: "carbonPrice", label: "Karbon Fiyatı", type: "number", unit: "USD/ton", required: false, smartDefault: 50, validation: { min: 0 }, helper: "", expertMeaning: "Carbon price per ton" },
  ],
  outputs: [
    { id: "powerFactor", label: "Güç Faktörü (PF)", unit: "", format: "percentage" },
    { id: "reactivePenalty", label: "Reaktif Ceza", unit: "USD", format: "currency" },
    { id: "totalBill", label: "Toplam Fatura", unit: "USD", format: "currency" },
    { id: "carbonFootprint", label: "Karbon Maliyeti", unit: "USD", format: "currency", isBigNumber: true },
  ],
  thresholds: [{ fieldId: "powerFactor", warning: 90, critical: 85, direction: "lower_is_bad", warningMessage: "PF < %90 — kompanzasyon iyileştirilmeli.", criticalMessage: "PF < %85 — reaktif ceza riski yüksek." }],
  formulaPipeline: [
    { formulaId: "energy.power_factor", inputMap: { activeKwh: "activeKwh", reactiveKvarh: "reactiveKvarh" }, outputId: "powerFactor" },
    { formulaId: "energy.reactive_penalty", inputMap: { powerFactor: "powerFactor", pfThreshold: "pfThreshold", activeKwh: "activeKwh", reactiveKvarh: "reactiveKvarh", reactiveTariff: "reactiveTariff" }, outputId: "reactivePenalty" },
    { formulaId: "energy.demand_charge", inputMap: { peakKw: "peakKw", demandRate: "demandRate" }, outputId: "demandCharge" },
    { formulaId: "energy.energy_total_bill", inputMap: { baseAmount: "baseAmount", touAmount: "touAmount", demandCharge: "demandCharge", reactivePenalty: "reactivePenalty", taxAmount: "taxAmount" }, outputId: "totalBill" },
    { formulaId: "energy.energy_carbon_footprint", inputMap: { activeKwh: "activeKwh", emisFactor: "emisFactor", carbonPrice: "carbonPrice" }, outputId: "carbonFootprint" },
  ],
  reportTemplate: { title: "Energy Consumption Report", sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.1, volatilityPercent: 10, targetMarginPercent: 15, assumptionNotes: ["PF = Active/√(Active²+Reactive²).", "Reactive penalty if PF < threshold.", "Carbon cost = kWh×EmisFactor×CarbonPrice/1000."] },
};
