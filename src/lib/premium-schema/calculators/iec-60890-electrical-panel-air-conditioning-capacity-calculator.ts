import { Iec60890ElektrikPanoIklimlendirmeKapasitesiCalculator50InputSchema, type Iec60890ElektrikPanoIklimlendirmeKapasitesiCalculator50Input } from "./iec-60890-elektrik-pano-iklimlendirme-kapasitesi-calculator-50-validation";

export const calculateIec60890ElektrikPanoIklimlendirmeKapasitesiCalculator50Contract: any = {
  id: "iec-60890-elektrik-pano-iklimlendirme-kapasitesi-calculator-50",
  version: "1.0.0",
  category: "cost",
  inputSchema: Iec60890ElektrikPanoIklimlendirmeKapasitesiCalculator50InputSchema,
  
  execute: async (input: any) => {
    try {
      const {
        width = 0,
        height = 0,
        depth = 0,
        internalPower = 0,
        tOut = 0,
        tIn = 0,
        mountingType = 0
      } = input;

      // Surface area calculation: A_surface = 2 * (W*H + W*D + H*D)
      const aSurface = 2 * (width * height + width * depth + height * depth);

      // Mounting factor based on mounting type value
      // Assuming mountingType values: 1 = Single free-standing, 2 = Wall-mounted, 3 = Enclosed/Other
      let mountingFactor: number;
      if (mountingType === 1) {
        mountingFactor = 1.0;
      } else if (mountingType === 2) {
        mountingFactor = 0.85;
      } else {
        mountingFactor = 0.70;
      }

      // Effective surface area
      const aEffective = aSurface * mountingFactor;

      // Temperature difference
      const deltaT = tIn - tOut;

      // Heat transfer coefficient for electrical panels (typical steel panel: ~5.5 W/m2K)
      const materialK = 5.5;

      // Conduction heat transfer
      const qConduction = materialK * aEffective * deltaT;

      // Cooling requirement: internal heat generation minus heat loss through conduction
      const qCoolingReq = internalPower - qConduction;

      // Required cooler capacity with 20% safety factor, minimum 0
      const coolerCapacityW = Math.max(0, qCoolingReq * 1.20);

      // Convert Watts to BTU/hr (1 W = 3.412 BTU/hr)
      const coolerCapacityBTU = coolerCapacityW * 3.412;

      return {
        aSurface: Math.round(aSurface * 100) / 100,
        mountingFactor: Math.round(mountingFactor * 100) / 100,
        aEffective: Math.round(aEffective * 100) / 100,
        deltaT: Math.round(deltaT * 100) / 100,
        qConduction: Math.round(qConduction * 100) / 100,
        qCoolingReq: Math.round(qCoolingReq * 100) / 100,
        coolerCapacityW: Math.round(coolerCapacityW * 100) / 100,
        coolerCapacityBTU: Math.round(coolerCapacityBTU * 100) / 100
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};