import { KwhEnerjiCostAnalysisVeReaktifCezaKalkaniCalculator75InputSchema, type KwhEnerjiCostAnalysisVeReaktifCezaKalkaniCalculator75Input } from "./kwh-enerji-cost-analysis-ve-reaktif-ceza-kalkani-calculator-75-validation";

export const calculateKwhEnerjiCostAnalysisVeReaktifCezaKalkaniCalculator75Contract: any = {
  id: "kwh-enerji-cost-analysis-ve-reaktif-ceza-kalkani-calculator-75",
  version: "1.0.0",
  category: "cost",
  inputSchema: KwhEnerjiCostAnalysisVeReaktifCezaKalkaniCalculator75InputSchema,
  
  execute: async (input: any) => {
    try {
      const {
        activeKwh,
        reactiveKvarh,
        peakDemandKw,
        activeRate,
        reactiveRate,
        demandRate,
        penaltyThreshold,
        taxRate
      } = input;

      // Input validation
      if (activeKwh <= 0) {
        throw new Error("Aktif enerji tüketimi sıfırdan büyük olmalıdır.");
      }

      // Power Factor PF = cos(φ) = active_kwh / sqrt(active_kwh² + reactive_kvarh²)
      const denominator = Math.sqrt(Math.pow(activeKwh, 2) + Math.pow(reactiveKvarh, 2));
      const powerFactorPF = denominator > 0 ? activeKwh / denominator : 1;

      // Reactive Ratio Pct = (reactive_kvarh / active_kwh) * 100
      const reactiveRatioPct = (reactiveKvarh / activeKwh) * 100;

      // Penalty kVArh = MAX(0, reactive_kvarh - (active_kwh * (penalty_threshold / 100)))
      const thresholdDecimal = penaltyThreshold / 100;
      const allowedReactive = activeKwh * thresholdDecimal;
      const penaltyKVArh = Math.max(0, reactiveKvarh - allowedReactive);

      // Cost Components
      const costActive = activeKwh * activeRate;
      const costReactivePenalty = penaltyKVArh * reactiveRate;
      const costDemand = peakDemandKw * demandRate;
      const subtotal = costActive + costReactivePenalty + costDemand;

      // Total Bill = Subtotal * (1 + tax_rate / 100)
      const taxMultiplier = 1 + (taxRate / 100);
      const totalBill = subtotal * taxMultiplier;

      // Blended Unit Cost kWh = Total Bill / active_kwh
      const blendedUnitCostKWh = totalBill / activeKwh;

      return {
        powerFactorPF: Math.round(powerFactorPF * 10000) / 10000,
        reactiveRatioPct: Math.round(reactiveRatioPct * 100) / 100,
        penaltyKVArh: Math.round(penaltyKVArh * 100) / 100,
        costActive: Math.round(costActive * 100) / 100,
        costReactivePenalty: Math.round(costReactivePenalty * 100) / 100,
        costDemand: Math.round(costDemand * 100) / 100,
        subtotal: Math.round(subtotal * 100) / 100,
        totalBill: Math.round(totalBill * 100) / 100,
        blendedUnitCostKWh: Math.round(blendedUnitCostKWh * 10000) / 10000
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};