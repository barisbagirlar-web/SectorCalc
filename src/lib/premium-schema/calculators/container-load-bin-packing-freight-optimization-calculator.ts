import { KonteynerYukBinPackingVeNavlunOptimizasyonuCalculator72InputSchema, type KonteynerYukBinPackingVeNavlunOptimizasyonuCalculator72Input } from "./konteyner-yuk-bin-packing-ve-navlun-optimizasyonu-calculator-72-validation";

export const calculateKonteynerYukBinPackingVeNavlunOptimizasyonuCalculator72Contract: any = {
  id: "konteyner-yuk-bin-packing-ve-navlun-optimizasyonu-calculator-72",
  version: "1.0.0",
  category: "cost",
  inputSchema: KonteynerYukBinPackingVeNavlunOptimizasyonuCalculator72InputSchema,
  
  execute: async (input: any) => {
    try {
      // Destructure input
      const {
        containerL,
        containerW,
        containerH,
        maxPayload,
        palletL,
        palletW,
        palletH,
        palletWeight,
        maxStackLayers,
        freightCost,
      } = input;

      // Guard against missing or invalid inputs (return mocked values if essential data is missing)
      if (
        containerL <= 0 || containerW <= 0 || containerH <= 0 ||
        maxPayload <= 0 || palletL <= 0 || palletW <= 0 || palletH <= 0 ||
        palletWeight <= 0 || maxStackLayers <= 0 || freightCost <= 0
      ) {
        return {
          floorPalletsOrient1: 0,
          floorPalletsOrient2: 0,
          maxFloorPallets: 0,
          heightLayers: 0,
          totalPalletsVolConstraint: 0,
          totalPalletsWeightConstraint: 0,
          actualLoadedPallets: 0,
          containerVolM3: 0,
          loadedVolM3: 0,
          volumeUtilization: 0,
          loadedWeight: 0,
          weightUtilization: 0,
          costPerPallet: 0,
          wastedFreightValue: 0,
        };
      }

      // Floor_Pallets_Orient1 = FLOOR(container_l / pallet_l) * FLOOR(container_w / pallet_w)
      const floorPalletsOrient1 = Math.floor(containerL / palletL) * Math.floor(containerW / palletW);

      // Floor_Pallets_Orient2 = FLOOR(container_l / pallet_w) * FLOOR(container_w / pallet_l)
      const floorPalletsOrient2 = Math.floor(containerL / palletW) * Math.floor(containerW / palletL);

      // Max_Floor_Pallets = MAX(Floor_Pallets_Orient1, Floor_Pallets_Orient2)
      const maxFloorPallets = Math.max(floorPalletsOrient1, floorPalletsOrient2);

      // Height_Layers = MIN(max_stack_layers, FLOOR(container_h / pallet_h))
      const heightLayers = Math.min(maxStackLayers, Math.floor(containerH / palletH));

      // Total_Pallets_Vol_Constraint = Max_Floor_Pallets * Height_Layers
      const totalPalletsVolConstraint = maxFloorPallets * heightLayers;

      // Total_Pallets_Weight_Constraint = FLOOR(max_payload / pallet_weight)
      const totalPalletsWeightConstraint = Math.floor(maxPayload / palletWeight);

      // Actual_Loaded_Pallets = MIN(Total_Pallets_Vol_Constraint, Total_Pallets_Weight_Constraint)
      const actualLoadedPallets = Math.min(totalPalletsVolConstraint, totalPalletsWeightConstraint);

      // Container_Vol_m3 = container_l * container_w * container_h
      const containerVolM3 = containerL * containerW * containerH;

      // Pallet volume in m3
      const palletVolumeM3 = palletL * palletW * palletH;

      // Loaded_Vol_m3 = Actual_Loaded_Pallets * (pallet_l * pallet_w * pallet_h)
      const loadedVolM3 = actualLoadedPallets * palletVolumeM3;

      // Volume_Utilization = (Loaded_Vol_m3 / Container_Vol_m3) * 100
      const volumeUtilization = containerVolM3 > 0 ? (loadedVolM3 / containerVolM3) * 100 : 0;

      // Loaded_Weight = Actual_Loaded_Pallets * pallet_weight
      const loadedWeight = actualLoadedPallets * palletWeight;

      // Weight_Utilization = (Loaded_Weight / max_payload) * 100
      const weightUtilization = maxPayload > 0 ? (loadedWeight / maxPayload) * 100 : 0;

      // Cost_Per_Pallet = freight_cost / Actual_Loaded_Pallets
      const costPerPallet = actualLoadedPallets > 0 ? freightCost / actualLoadedPallets : 0;

      // Wasted_Freight_Value = freight_cost * (1 - (MAX(Volume_Utilization, Weight_Utilization) / 100))
      const maxUtilization = Math.max(volumeUtilization, weightUtilization);
      const wastedFreightValue = freightCost * (1 - (maxUtilization / 100));

      return {
        floorPalletsOrient1,
        floorPalletsOrient2,
        maxFloorPallets,
        heightLayers,
        totalPalletsVolConstraint,
        totalPalletsWeightConstraint,
        actualLoadedPallets,
        containerVolM3,
        loadedVolM3,
        volumeUtilization,
        loadedWeight,
        weightUtilization,
        costPerPallet,
        wastedFreightValue,
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};