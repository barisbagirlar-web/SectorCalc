import { KondenserAdiyabatikOnSogutmaEnerjiTasarrufuCalculator43InputSchema } from "./kondenser-adiyabatik-on-sogutma-enerji-tasarrufu-calculator-43-validation";

export const calculateKondenserAdiyabatikOnSogutmaEnerjiTasarrufuCalculator43Contract: any = {
  id: "kondenser-adiyabatik-on-sogutma-enerji-tasarrufu-calculator-43",
  version: "1.0.0",
  category: "cost",
  inputSchema: KondenserAdiyabatikOnSogutmaEnerjiTasarrufuCalculator43InputSchema,
  
  execute: async (input: any) => {
    try {
      const {
        chillerCap = 0,
        currentCop = 0,
        tDry = 0,
        tWet = 0,
        padEff = 0,
        opHours = 0,
        elecRate = 0,
        systemCapex = 0,
        systemOpex = 0
      } = input;

      // Convert chiller capacity from TR to kW (1 TR = 3.517 kW)
      const capKW = chillerCap * 3.517;

      // Calculate new condensing temperature after adiabatic precooling
      const padEffFraction = padEff / 100;
      const tCondNew = tDry - (padEffFraction * (tDry - tWet));

      // Calculate the temperature improvement
      const deltaTImprovement = tDry - tCondNew;

      // Calculate new COP based on temperature improvement (approx 3% improvement per °C reduction)
      const improvementFactor = deltaTImprovement * 0.03;
      const newCOP = currentCop * (1 + improvementFactor);

      // Calculate power consumption (kW) for current and new COP
      const powerCurrent = capKW / currentCop;
      const powerNew = capKW / newCOP;

      // Calculate power savings in kW
      const powerSavingsKW = powerCurrent - powerNew;

      // Calculate annual energy savings in kWh
      const annualSavingsKWh = powerSavingsKW * opHours;

      // Calculate annual cost savings in USD
      const annualSavingsUSD = annualSavingsKWh * elecRate;

      // Calculate net annual savings after operation costs
      const netAnnualSavings = annualSavingsUSD - systemOpex;

      // Calculate payback period in months
      const paybackMonths = netAnnualSavings > 0 
        ? (systemCapex / netAnnualSavings) * 12 
        : Infinity;

      // Calculate ROI percentage
      const rOIPct = systemCapex > 0 
        ? (netAnnualSavings / systemCapex) * 100 
        : 0;

      // Calculate CO2 reduction in tons (assuming 0.5 kg CO2 per kWh)
      const cO2ReductionTon = (annualSavingsKWh * 0.5) / 1000;

      return {
        capKW: Math.round(capKW * 100) / 100,
        tCondNew: Math.round(tCondNew * 100) / 100,
        deltaTImprovement: Math.round(deltaTImprovement * 100) / 100,
        newCOP: Math.round(newCOP * 1000) / 1000,
        powerCurrent: Math.round(powerCurrent * 100) / 100,
        powerNew: Math.round(powerNew * 100) / 100,
        powerSavingsKW: Math.round(powerSavingsKW * 100) / 100,
        annualSavingsKWh: Math.round(annualSavingsKWh * 100) / 100,
        annualSavingsUSD: Math.round(annualSavingsUSD * 100) / 100,
        netAnnualSavings: Math.round(netAnnualSavings * 100) / 100,
        paybackMonths: paybackMonths === Infinity || isNaN(paybackMonths) 
          ? 0 
          : Math.round(paybackMonths * 100) / 100,
        rOIPct: Math.round(rOIPct * 100) / 100,
        cO2ReductionTon: Math.round(cO2ReductionTon * 100) / 100
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};