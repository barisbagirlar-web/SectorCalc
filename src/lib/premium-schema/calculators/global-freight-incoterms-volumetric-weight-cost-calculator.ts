import { GlobalNavlunIncotermsVeHacimselAgirlikMaliyetiCalculator104InputSchema, type GlobalNavlunIncotermsVeHacimselAgirlikMaliyetiCalculator104Input } from "./global-navlun-incoterms-ve-hacimsel-agirlik-maliyeti-calculator-104-validation";

export const calculateGlobalNavlunIncotermsVeHacimselAgirlikMaliyetiCalculator104Contract: any = {
  id: "global-navlun-incoterms-ve-hacimsel-agirlik-maliyeti-calculator-104",
  version: "1.0.0",
  category: "cost",
  inputSchema: GlobalNavlunIncotermsVeHacimselAgirlikMaliyetiCalculator104InputSchema,
  
  execute: async (input: any) => {
    try {
      // Parse inputs
      const grossWeightKg = Number(input.grossWeightKg);
      const lengthCm = Number(input.lengthCm);
      const widthCm = Number(input.widthCm);
      const heightCm = Number(input.heightCm);
      const transportMode = Number(input.transportMode); // Freight rate in USD
      const bafPct = Number(input.bafPct);
      const thcFee = Number(input.thcFee);
      const customsValue = Number(input.customsValue);
      const dutyPct = Number(input.dutyPct);
      const insurancePct = Number(input.insurancePct);

      // Validate inputs
      if (isNaN(grossWeightKg) || isNaN(lengthCm) || isNaN(widthCm) || isNaN(heightCm) || 
          isNaN(transportMode) || isNaN(bafPct) || isNaN(thcFee) || isNaN(customsValue) || 
          isNaN(dutyPct) || isNaN(insurancePct)) {
        throw new Error("Invalid input values: All inputs must be valid numbers");
      }

      // Volume calculations
      const volumeCm3 = lengthCm * widthCm * heightCm;
      const volumeCBM = volumeCm3 / 1000000;

      // Volumetric weight calculations
      const volWeightAirKg = volumeCm3 / 6000;
      const volWeightRoadKg = volumeCm3 / 3000;
      const volWeightSeaCBM = volumeCBM;

      // Determine chargeable weight based on transport mode
      // transportMode value: 1=Hava_Kargo, 2=Karayolu, else=Deniz
      let chargeableWeight: number;
      if (transportMode === 1) {
        // Air freight
        chargeableWeight = Math.max(grossWeightKg, volWeightAirKg);
      } else if (transportMode === 2) {
        // Road freight
        chargeableWeight = Math.max(grossWeightKg, volWeightRoadKg);
      } else {
        // Sea freight (default)
        chargeableWeight = Math.max(volumeCBM, grossWeightKg / 1000);
      }

      // Freight rate is used as transportMode input value
      const freightRate = transportMode;

      // Cost calculations
      const baseFreight = chargeableWeight * freightRate;
      const bafSurcharge = baseFreight * (bafPct / 100);
      const cIFValue = customsValue + baseFreight + bafSurcharge + thcFee;
      const insuranceCost = cIFValue * (insurancePct / 100);
      const customsDuty = cIFValue * (dutyPct / 100);
      const totalLandedCost = cIFValue + insuranceCost + customsDuty;

      return {
        volumeCm3: Math.round(volumeCm3 * 100) / 100,
        volumeCBM: Math.round(volumeCBM * 100000) / 100000,
        volWeightAirKg: Math.round(volWeightAirKg * 100) / 100,
        volWeightRoadKg: Math.round(volWeightRoadKg * 100) / 100,
        volWeightSeaCBM: Math.round(volWeightSeaCBM * 100000) / 100000,
        chargeableWeight: Math.round(chargeableWeight * 100) / 100,
        baseFreight: Math.round(baseFreight * 100) / 100,
        bAFSurcharge: Math.round(bafSurcharge * 100) / 100,
        cIFValue: Math.round(cIFValue * 100) / 100,
        insuranceCost: Math.round(insuranceCost * 100) / 100,
        customsDuty: Math.round(customsDuty * 100) / 100,
        totalLandedCost: Math.round(totalLandedCost * 100) / 100
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};