import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const KWH_COST_SCHEMA: PremiumCalculatorSchema = {
  id: "kwh-cost-analyzer", legacyPaidSlug: "kwh-cost-analyzer",
  name: "KWh Cost Analyzer", name_i18n: {"en":"KWh Cost Analyzer"}, sectorSlug: "energy-consumption", category: "cost",
  painStatement: "Birim kWh maliyeti ve guc faktoru cezasi hesaplanmazsa, enerji faturasinin gercek kaynagi anlasilamaz.", painStatement_i18n: {"en":"If unit kWh cost and power factor penalty are not calculated, the actual source of the energy bill cannot be understood."},
  inputs: [
    { id: "activeEnergy", label: "Aktif Tuketim", label_i18n: {"en":"Active energy consumption"}, type: "number", unit: "kWh", required: true, smartDefault: 500000, validation: { min: 0 }, helper: "", expertMeaning: "Active energy consumption", expertMeaning_i18n: {"en":"Active energy consumption"} },
    { id: "energyRate", label: "Energy rate", label_i18n: {"en":"Energy rate"}, type: "number", unit: "USD/kWh", required: true, smartDefault: 0.10, validation: { min: 0 }, helper: "", expertMeaning: "Energy rate", expertMeaning_i18n: {"en":"Energy rate"} },
    { id: "peakDemand", label: "Peak demand", label_i18n: {"en":"Peak demand"}, type: "number", unit: "kW", required: true, smartDefault: 800, validation: { min: 0 }, helper: "", expertMeaning: "Peak demand", expertMeaning_i18n: {"en":"Peak demand"} },
    { id: "demandRate", label: "Demand rate", label_i18n: {"en":"Demand rate"}, type: "number", unit: "USD/kW", required: true, smartDefault: 15, validation: { min: 0 }, helper: "", expertMeaning: "Demand rate", expertMeaning_i18n: {"en":"Demand rate"} },
    { id: "powerFactor", label: "Power factor", label_i18n: {"en":"Power factor"}, type: "number", unit: "", required: false, smartDefault: 0.88, validation: { min: 0, max: 1 }, helper: "", expertMeaning: "Power factor", expertMeaning_i18n: {"en":"Power factor"} },
    { id: "pfThreshold", label: "Min acceptable PF", label_i18n: {"en":"Min acceptable PF"}, type: "number", unit: "", required: false, smartDefault: 0.9, validation: { min: 0, max: 1 }, helper: "", expertMeaning: "Min acceptable PF", expertMeaning_i18n: {"en":"Min acceptable PF"} },
    { id: "reactiveEnergy", label: "Reaktif Tuketim", label_i18n: {"en":"Reactive energy"}, type: "number", unit: "kVArh", required: false, smartDefault: 200000, validation: { min: 0 }, helper: "", expertMeaning: "Reactive energy", expertMeaning_i18n: {"en":"Reactive energy"} },
    { id: "penaltyRate", label: "Reactive penalty rate", label_i18n: {"en":"Reactive penalty rate"}, type: "number", unit: "USD/kVArh", required: false, smartDefault: 0.02, validation: { min: 0 }, helper: "", expertMeaning: "Reactive penalty rate", expertMeaning_i18n: {"en":"Reactive penalty rate"} },
    { id: "taxRate", label: "Tax rate", label_i18n: {"en":"Tax rate"}, type: "number", unit: "%", required: false, smartDefault: 18, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Tax rate", expertMeaning_i18n: {"en":"Tax rate"} },
    { id: "oldPeak", label: "Eski Tepe Gucu", label_i18n: {"en":"Previous peak demand"}, type: "number", unit: "kW", required: false, smartDefault: 900, validation: { min: 0 }, helper: "", expertMeaning: "Previous peak demand", expertMeaning_i18n: {"en":"Previous peak demand"} },
    { id: "newPeak", label: "Yeni Tepe Gucu", label_i18n: {"en":"New peak demand"}, type: "number", unit: "kW", required: false, smartDefault: 800, validation: { min: 0 }, helper: "", expertMeaning: "New peak demand", expertMeaning_i18n: {"en":"New peak demand"} },
  ],
  outputs: [
    { id: "energyCharge", label: "Enerji Bedeli", label_i18n: {"en":"energy Bedeli"}, unit: "USD", format: "currency" },
    { id: "demandCharge", label: "Guc Bedeli", label_i18n: {"en":"Power Bedeli"}, unit: "USD", format: "currency" },
    { id: "reactivePenalty", label: "Reaktif Ceza", label_i18n: {"en":"Reaktif penalty"}, unit: "USD", format: "currency" },
    { id: "totalBill", label: "Total Bill", label_i18n: {"en":"Total Bill"}, unit: "USD", format: "currency", isBigNumber: true },
    { id: "unitCostKwh", label: "Birim kWh Maliyeti", label_i18n: {"en":"Unit kWh Cost"}, unit: "USD/kWh", format: "currency" },
    { id: "peakShavingSavings", label: "Tepe Traslama Kazanc", label_i18n: {"en":"Tepe Traslama Gain"}, unit: "USD", format: "currency" },
  ],
  thresholds: [{ fieldId: "unitCostKwh", warning: 0.15, critical: 0.25, direction: "higher_is_bad", warningMessage: "Birim > $0.15/kWh — enerji verimliligi degerlendirilmeli.", warningMessage_i18n: {"en":"Unit > $0.15/kWh — energy efficiency should be evaluated."}, criticalMessage: "Birim > $0.25/kWh — acil enerji tasarrufu programi.", criticalMessage_i18n: {"en":"Unit > $0.25/kWh — urgent energy savings program."} }],
  formulaPipeline: [
    { formulaId: "cost.energy_charge", inputMap: {
        consumptionKwh: "activeEnergy",
        ratePerKwh: "energyRate"
      }, outputId: "energyCharge" },
    { formulaId: "cost.demand_charge", inputMap: { peakDemand: "peakDemand", demandRate: "demandRate" ,
        peakDemandKW: "peakDemandKW",
        demandRatePerKW: "demandRatePerKW",
        months: "months"}, outputId: "demandCharge" },
    { formulaId: "cost.reactive_penalty_kwh", inputMap: {
        penaltyRate: "penaltyRate",
        reactivePower: "powerFactor",
        reactiveAllowance: "pfThreshold",
        reactiveEnergy: "reactiveEnergy"
      }, outputId: "reactivePenalty" },
    { formulaId: "cost.total_bill_kwh", inputMap: {
        energyCharge: "energyCharge",
        reactivePenalty: "reactivePenalty",
        fixedCharge: "demandCharge",
        tax: "taxRate"
      }, outputId: "totalBill" },
    { formulaId: "cost.unit_cost_kwh", inputMap: {
        totalBill: "totalBill",
        totalConsumption: "activeEnergy"
      }, outputId: "unitCostKwh" },
    { formulaId: "cost.peak_shaving_savings", inputMap: {
        peakDemand: "oldPeak",
        shavedDemand: "newPeak",
        demandCharge: "demandRate"
      }, outputId: "peakShavingSavings" },
  ],
  reportTemplate: { title: "KWh Maliyet Raporu", title_i18n: {"en":"KWh Cost Raporu"}, sections: ["executive_summary", "loss_breakdown", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.05, volatilityPercent: 10, targetMarginPercent: 15, assumptionNotes: ["Reaktif ceza = PF < esik ise reaktif × ceza orani.", "Birim maliyet = Toplam / Aktif tuketim.", "Tepe traslama = (Eski - Yeni) × Guc bedeli."],assumptionNotes_i18n:[{"en":"Reactive penalty = if PF < threshold then reactive × penalty rate."},{"en":"Unit cost = Total / Active consumption."},{"en":"Peak shaving = (Old - New) × Power charge."}] },
};
