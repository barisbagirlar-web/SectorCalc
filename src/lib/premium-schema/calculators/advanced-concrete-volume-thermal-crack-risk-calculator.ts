import { IleriSeviyeBetonHacmiVeTermalCatlakRiskiCalculator12InputSchema, type IleriSeviyeBetonHacmiVeTermalCatlakRiskiCalculator12Input } from "./ileri-seviye-beton-hacmi-ve-termal-catlak-riski-calculator-12-validation";

export const calculateIleriSeviyeBetonHacmiVeTermalCatlakRiskiCalculator12Contract: any = {
  id: "ileri-seviye-beton-hacmi-ve-termal-catlak-riski-calculator-12",
  version: "1.0.0",
  category: "cost",
  inputSchema: IleriSeviyeBetonHacmiVeTermalCatlakRiskiCalculator12InputSchema,
  
  execute: async (input: any) => {
    try {
      const {
        volSlab,
        volFooting,
        volColumn,
        rebarPct,
        wastePct,
        ambientTemp,
        cementContent,
        cementType,
        unitPrice,
        pumpFee
      } = input as IleriSeviyeBetonHacmiVeTermalCatlakRiskiCalculator12Input;

      // Gross geometric volume calculation
      const grossGeoVol = volSlab + volFooting + volColumn;

      // Rebar displacement volume
      const rebarDisplacement = grossGeoVol * (rebarPct / 100);

      // Net concrete volume after rebar displacement
      const netConcreteVol = grossGeoVol - rebarDisplacement;

      // Order volume including waste factor
      const orderVol = netConcreteVol * (1 + (wastePct / 100));

      // Total material cost based on ordered volume
      const totalMaterialCost = orderVol * unitPrice;

      // Total cost including pump fee (pumpFee is assumed to include mobilization + m3 fee as a lump sum)
      const totalCost = totalMaterialCost + pumpFee;

      // Adiabatic temperature rise calculation
      // Heat of hydration: ~350 kJ/kg for cement, specific heat of concrete: ~1.05 kJ/kg°C
      // Density of concrete: 2400 kg/m3
      // Formula: ΔT = (cementContent * 350 * cementType) / (2400 * 1.05)
      const adiabaticTempRise = (cementContent * 350 * cementType) / (2400 * 1.05);

      // Maximum core temperature
      const maxCoreTemp = ambientTemp + adiabaticTempRise;

      // Temperature differential between core and ambient
      const tempDifferential = maxCoreTemp - ambientTemp;

      return {
        grossGeoVol: Math.round(grossGeoVol * 100) / 100,
        rebarDisplacement: Math.round(rebarDisplacement * 100) / 100,
        netConcreteVol: Math.round(netConcreteVol * 100) / 100,
        orderVol: Math.round(orderVol * 100) / 100,
        totalMaterialCost: Math.round(totalMaterialCost * 100) / 100,
        totalCost: Math.round(totalCost * 100) / 100,
        adiabaticTempRise: Math.round(adiabaticTempRise * 100) / 100,
        maxCoreTemp: Math.round(maxCoreTemp * 100) / 100,
        tempDifferential: Math.round(tempDifferential * 100) / 100
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};