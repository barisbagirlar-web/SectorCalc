import { Depo3dKupKullanimiVeForkliftAlanOptimizasyonuCalculator26InputSchema, type Depo3dKupKullanimiVeForkliftAlanOptimizasyonuCalculator26Input } from "./depo-3d-kup-kullanimi-ve-forklift-alan-optimizasyonu-calculator-26-validation";

export const calculateDepo3dKupKullanimiVeForkliftAlanOptimizasyonuCalculator26Contract: any = {
  id: "depo-3d-kup-kullanimi-ve-forklift-alan-optimizasyonu-calculator-26",
  version: "1.0.0",
  category: "cost",
  inputSchema: Depo3dKupKullanimiVeForkliftAlanOptimizasyonuCalculator26InputSchema,
  
  execute: async (input: any) => {
    try {
      const {
        bldgAreaM2,
        storageRatio,
        netHeightM,
        palletL,
        palletW,
        palletH,
        aisleWidth,
        rackLevels,
        clearanceH,
      } = input;

      const storageRatioDecimal = storageRatio / 100;

      // Net Storage Area
      const netStorageArea = bldgAreaM2 * storageRatioDecimal;

      // Pallets Per Square - accounting for aisles
      const palletFootprint = palletL * palletW;
      const aisleAllocation = palletW * aisleWidth * 0.5;
      const palletsPerSquare = netStorageArea / (palletFootprint + aisleAllocation);

      // Floor Positions
      const floorPositions = Math.floor(palletsPerSquare);

      // Total Pallet Positions
      const totalPalletPositions = floorPositions * rackLevels;

      // Theoretical Building Volume
      const theoreticalBldgVol = bldgAreaM2 * netHeightM;

      // Actual Inventory Volume
      const palletVolume = palletL * palletW * palletH;
      const actualInventoryVol = totalPalletPositions * palletVolume;

      // Cube Utilization
      const cubeUtilization = theoreticalBldgVol > 0 
        ? (actualInventoryVol / theoreticalBldgVol) * 100 
        : 0;

      // Required Height
      const requiredHeight = rackLevels * (palletH + clearanceH);

      return {
        netStorageArea,
        palletsPerSquare,
        floorPositions,
        totalPalletPositions,
        theoreticalBldgVol,
        actualInventoryVol,
        cubeUtilization,
        requiredHeight,
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};