import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const KWH_COST_SCHEMA: PremiumCalculatorSchema = {
  id: "kwh-cost-analyzer", legacyPaidSlug: "kwh-cost-analyzer",
  name: "KWh Maliyet Analizi", name_i18n: {"en":"KWh Maliyet Analizi","tr":"KWh Maliyet Analizi"}, sectorSlug: "energy-consumption", category: "cost",
  painStatement: "Birim kWh maliyeti ve güç faktörü cezası hesaplanmazsa, enerji faturasının gerçek kaynağı anlaşılamaz.", painStatement_i18n: {"en":"Birim kWh maliyeti ve güç faktörü cezası hesaplanmazsa, enerji faturasının gerçek kaynağı anlaşılamaz.","tr":"Birim kWh maliyeti ve güç faktörü cezası hesaplanmazsa, enerji faturasının gerçek kaynağı anlaşılamaz."},
  inputs: [
    { id: "activeEnergy", label: "Aktif Tüketim", label_i18n: {"en":"Active energy consumption","tr":"Aktif Tüketim"}, type: "number", unit: "kWh", required: true, smartDefault: 500000, validation: { min: 0 }, helper: "", expertMeaning: "Active energy consumption", expertMeaning_i18n: {"en":"Active energy consumption","tr":"aktif tüketim"} },
    { id: "energyRate", label: "Enerji Birim Fiyatı", label_i18n: {"en":"Energy rate","tr":"Enerji Birim Fiyatı"}, type: "number", unit: "USD/kWh", required: true, smartDefault: 0.10, validation: { min: 0 }, helper: "", expertMeaning: "Energy rate", expertMeaning_i18n: {"en":"Energy rate","tr":"enerji birim fiyatı"} },
    { id: "peakDemand", label: "Çekilen Güç", label_i18n: {"en":"Peak demand","tr":"Çekilen Güç"}, type: "number", unit: "kW", required: true, smartDefault: 800, validation: { min: 0 }, helper: "", expertMeaning: "Peak demand", expertMeaning_i18n: {"en":"Peak demand","tr":"çekilen güç"} },
    { id: "demandRate", label: "Güç Bedeli", label_i18n: {"en":"Demand rate","tr":"Güç Bedeli"}, type: "number", unit: "USD/kW", required: true, smartDefault: 15, validation: { min: 0 }, helper: "", expertMeaning: "Demand rate", expertMeaning_i18n: {"en":"Demand rate","tr":"güç bedeli"} },
    { id: "powerFactor", label: "Güç Faktörü", label_i18n: {"en":"Power factor","tr":"Güç Faktörü"}, type: "number", unit: "", required: false, smartDefault: 0.88, validation: { min: 0, max: 1 }, helper: "", expertMeaning: "Power factor", expertMeaning_i18n: {"en":"Power factor","tr":"güç faktörü"} },
    { id: "pfThreshold", label: "Ceza Eşiği", label_i18n: {"en":"Min acceptable PF","tr":"Ceza Eşiği"}, type: "number", unit: "", required: false, smartDefault: 0.9, validation: { min: 0, max: 1 }, helper: "", expertMeaning: "Min acceptable PF", expertMeaning_i18n: {"en":"Min acceptable PF","tr":"ceza eşiği"} },
    { id: "reactiveEnergy", label: "Reaktif Tüketim", label_i18n: {"en":"Reactive energy","tr":"Reaktif Tüketim"}, type: "number", unit: "kVArh", required: false, smartDefault: 200000, validation: { min: 0 }, helper: "", expertMeaning: "Reactive energy", expertMeaning_i18n: {"en":"Reactive energy","tr":"reaktif tüketim"} },
    { id: "penaltyRate", label: "Reaktif Ceza Oranı", label_i18n: {"en":"Reactive penalty rate","tr":"Reaktif Ceza Oranı"}, type: "number", unit: "USD/kVArh", required: false, smartDefault: 0.02, validation: { min: 0 }, helper: "", expertMeaning: "Reactive penalty rate", expertMeaning_i18n: {"en":"Reactive penalty rate","tr":"reaktif ceza oranı"} },
    { id: "taxRate", label: "Vergi/Fon Oranı", label_i18n: {"en":"Tax rate","tr":"Vergi/Fon Oranı"}, type: "number", unit: "%", required: false, smartDefault: 18, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Tax rate", expertMeaning_i18n: {"en":"Tax rate","tr":"vergi/fon oranı"} },
    { id: "oldPeak", label: "Eski Tepe Gücü", label_i18n: {"en":"Previous peak demand","tr":"Eski Tepe Gücü"}, type: "number", unit: "kW", required: false, smartDefault: 900, validation: { min: 0 }, helper: "", expertMeaning: "Previous peak demand", expertMeaning_i18n: {"en":"Previous peak demand","tr":"eski tepe gücü"} },
    { id: "newPeak", label: "Yeni Tepe Gücü", label_i18n: {"en":"New peak demand","tr":"Yeni Tepe Gücü"}, type: "number", unit: "kW", required: false, smartDefault: 800, validation: { min: 0 }, helper: "", expertMeaning: "New peak demand", expertMeaning_i18n: {"en":"New peak demand","tr":"yeni tepe gücü"} },
  ],
  outputs: [
    { id: "energyCharge", label: "Enerji Bedeli", label_i18n: {"en":"Enerji Bedeli","tr":"Enerji Bedeli"}, unit: "USD", format: "currency" },
    { id: "demandCharge", label: "Güç Bedeli", label_i18n: {"en":"Guc Bedeli","tr":"Güç Bedeli"}, unit: "USD", format: "currency" },
    { id: "reactivePenalty", label: "Reaktif Ceza", label_i18n: {"en":"Reaktif Ceza","tr":"Reaktif Ceza"}, unit: "USD", format: "currency" },
    { id: "totalBill", label: "Toplam Fatura", label_i18n: {"en":"Toplam Fatura","tr":"Toplam Fatura"}, unit: "USD", format: "currency", isBigNumber: true },
    { id: "unitCostKwh", label: "Birim kWh Maliyeti", label_i18n: {"en":"Birim kWh Maliyeti","tr":"Birim kWh Maliyeti"}, unit: "USD/kWh", format: "currency" },
    { id: "peakShavingSavings", label: "Tepe Traşlama Kazancı", label_i18n: {"en":"Tepe Traslama Kazanc","tr":"Tepe Traşlama Kazancı"}, unit: "USD", format: "currency" },
  ],
  thresholds: [{ fieldId: "unitCostKwh", warning: 0.15, critical: 0.25, direction: "higher_is_bad", warningMessage: "Birim > $0.15/kWh — enerji verimliliği değerlendirilmeli.", warningMessage_i18n: {"en":"Birim > $0.15/kWh — enerji verimliliği değerlendirilmeli.","tr":"Birim > $0.15/kWh — enerji verimliliği değerlendirilmeli."}, criticalMessage: "Birim > $0.25/kWh — acil enerji tasarrufu programı.", criticalMessage_i18n: {"en":"Birim > $0.25/kWh — acil enerji tasarrufu programı.","tr":"Birim > $0.25/kWh — acil enerji tasarrufu programı."} }],
  formulaPipeline: [
    { formulaId: "cost.energy_charge", inputMap: {
        consumptionKwh: "activeEnergy",
        ratePerKwh: "energyRate"
      }, outputId: "energyCharge" },
    { formulaId: "cost.demand_charge", inputMap: { peakDemand: "peakDemand", demandRate: "demandRate" }, outputId: "demandCharge" },
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
  reportTemplate: { title: "KWh Maliyet Raporu", title_i18n: {"en":"KWh Maliyet Raporu","tr":"KWh Maliyet Raporu"}, sections: ["executive_summary", "loss_breakdown", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.05, volatilityPercent: 10, targetMarginPercent: 15, assumptionNotes: ["Reaktif ceza = PF < eşik ise reaktif × ceza oranı.", "Birim maliyet = Toplam / Aktif tüketim.", "Tepe traşlama = (Eski - Yeni) × Güç bedeli."],assumptionNotes_i18n:[{"en":"Reaktif ceza = PF < eşik ise reaktif × ceza oranı.","tr":"Reaktif ceza = PF < eşik ise reaktif × ceza oranı."},{"en":"Birim maliyet = Toplam / Aktif tüketim.","tr":"Birim maliyet = Toplam / Aktif tüketim."},{"en":"Tepe traşlama = (Eski - Yeni) × Güç bedeli.","tr":"Tepe traşlama = (Eski - Yeni) × Güç bedeli."}] },
};
