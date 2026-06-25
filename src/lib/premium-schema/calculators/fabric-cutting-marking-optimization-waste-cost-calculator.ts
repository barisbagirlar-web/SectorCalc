import { KumasKesimPastalOptimizasyonuVeFireMaliyetiCalculator73InputSchema, type KumasKesimPastalOptimizasyonuVeFireMaliyetiCalculator73Input } from "./kumas-kesim-pastal-optimizasyonu-ve-fire-maliyeti-calculator-73-validation";

export const calculateKumasKesimPastalOptimizasyonuVeFireMaliyetiCalculator73Contract: any = {
  id: "kumas-kesim-pastal-optimizasyonu-ve-fire-maliyeti-calculator-73",
  version: "1.0.0",
  category: "cost",
  inputSchema: KumasKesimPastalOptimizasyonuVeFireMaliyetiCalculator73InputSchema,
  
  execute: async (input: any) => {
    try {
      const {
        fabricWidth,
        markerLength,
        patternAreaTotal,
        fabricPriceM,
        layers,
        endWasteCm,
        annualCuts
      } = input;

      // Convert marker length from meters to cm for area calculation
      const markerLengthCm = markerLength * 100;

      // Gross Marker Area (cm²) = marker length (cm) * fabric usable width (cm)
      const grossMarkerAreaCm2 = markerLengthCm * fabricWidth;

      // Marker Efficiency (%) = (total pattern area / gross marker area) * 100
      const markerEfficiencyPct = grossMarkerAreaCm2 > 0 
        ? (patternAreaTotal / grossMarkerAreaCm2) * 100 
        : 0;

      // Fabric Used Per Cut (m) = (marker length + (2 * end waste cm converted to m)) * number of layers
      const endWasteM = endWasteCm / 100;
      const fabricUsedPerCutM = (markerLength + (2 * endWasteM)) * layers;

      // Total Cost Per Cut = fabric used (m) * fabric price (USD/m)
      const totalCostPerCut = fabricUsedPerCutM * fabricPriceM;

      // Waste Area Per Layer (cm²) = gross marker area - total pattern area
      const wasteAreaPerLayer = grossMarkerAreaCm2 - patternAreaTotal;

      // Wasted Value Per Cut = (waste area / gross marker area) * total cost per cut
      const wastedValuePerCut = grossMarkerAreaCm2 > 0 
        ? (wasteAreaPerLayer / grossMarkerAreaCm2) * totalCostPerCut 
        : 0;

      // Annual Wasted Value = wasted value per cut * annual number of cuts
      const annualWastedValue = wastedValuePerCut * annualCuts;

      return {
        grossMarkerAreaCm2: Math.round(grossMarkerAreaCm2 * 100) / 100,
        markerEfficiencyPct: Math.round(markerEfficiencyPct * 100) / 100,
        fabricUsedPerCutM: Math.round(fabricUsedPerCutM * 100) / 100,
        totalCostPerCut: Math.round(totalCostPerCut * 100) / 100,
        wasteAreaPerLayer: Math.round(wasteAreaPerLayer * 100) / 100,
        wastedValuePerCut: Math.round(wastedValuePerCut * 100) / 100,
        annualWastedValue: Math.round(annualWastedValue * 100) / 100
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};