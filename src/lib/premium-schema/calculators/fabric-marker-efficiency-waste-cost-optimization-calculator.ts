import { KumasPastalMarkerVerimiVeFireCostOptimizasyonuCalculator138InputSchema, type KumasPastalMarkerVerimiVeFireCostOptimizasyonuCalculator138Input } from "./kumas-pastal-marker-verimi-ve-fire-cost-optimizasyonu-calculator-138-validation";

export const calculateKumasPastalMarkerVerimiVeFireCostOptimizasyonuCalculator138Contract: any = {
  id: "kumas-pastal-marker-verimi-ve-fire-cost-optimizasyonu-calculator-138",
  version: "1.0.0",
  category: "cost",
  inputSchema: KumasPastalMarkerVerimiVeFireCostOptimizasyonuCalculator138InputSchema,
  
  execute: async (input: any) => {
    try {
      const fabricUsableWidth = Number(input.fabricUsableWidth);
      const markerLength = Number(input.markerLength);
      const patternNetArea = Number(input.patternNetArea);
      const fabricLayers = Number(input.fabricLayers);
      const fabricPriceMeter = Number(input.fabricPriceMeter);
      const endWasteMargin = Number(input.endWasteMargin);
      const annualCuts = Number(input.annualCuts);

      // Gross Marker Area cm2 = (marker_length * 100) * fabric_usable_width
      const grossMarkerAreaCm2 = (markerLength * 100) * fabricUsableWidth;

      // Marker Efficiency Pct = (pattern_net_area / Gross_Marker_Area_cm2) * 100
      const markerEfficiencyPct = grossMarkerAreaCm2 > 0 ? (patternNetArea / grossMarkerAreaCm2) * 100 : 0;

      // Fabric Used Per Layer m = marker_length + (2 * end_waste_margin / 100)
      const fabricUsedPerLayerM = markerLength + (2 * endWasteMargin / 100);

      // Total Fabric Per Cut m = Fabric_Used_Per_Layer_m * fabric_layers
      const totalFabricPerCutM = fabricUsedPerLayerM * fabricLayers;

      // Cost Per Cut = Total_Fabric_Per_Cut_m * fabric_price_meter
      const costPerCut = totalFabricPerCutM * fabricPriceMeter;

      // Waste Area Per Layer cm2 = Gross_Marker_Area_cm2 - pattern_net_area
      const wasteAreaPerLayerCm2 = grossMarkerAreaCm2 - patternNetArea;

      // Wasted Value Per Cut = (Waste_Area_Per_Layer_cm2 / Gross_Marker_Area_cm2) * Cost_Per_Cut
      const wastedValuePerCut = grossMarkerAreaCm2 > 0 ? (wasteAreaPerLayerCm2 / grossMarkerAreaCm2) * costPerCut : 0;

      // Annual Wasted Value = Wasted_Value_Per_Cut * annual_cuts
      const annualWastedValue = wastedValuePerCut * annualCuts;

      return {
        grossMarkerAreaCm2,
        markerEfficiencyPct,
        fabricUsedPerLayerM,
        totalFabricPerCutM,
        costPerCut,
        wasteAreaPerLayerCm2,
        wastedValuePerCut,
        annualWastedValue
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};