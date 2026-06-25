import { VerimlilikArtiriciProjectVapIndirgenmisNakitAkisiCalculator85InputSchema, type VerimlilikArtiriciProjectVapIndirgenmisNakitAkisiCalculator85Input } from "./verimlilik-artirici-project-vap-indirgenmis-nakit-akisi-calculator-85-validation";

export const calculateVerimlilikArtiriciProjectVapIndirgenmisNakitAkisiCalculator85Contract: any = {
  id: "verimlilik-artirici-project-vap-indirgenmis-nakit-akisi-calculator-85",
  version: "1.0.0",
  category: "cost",
  inputSchema: VerimlilikArtiriciProjectVapIndirgenmisNakitAkisiCalculator85InputSchema,
  
  execute: async (input: VerimlilikArtiriciProjectVapIndirgenmisNakitAkisiCalculator85Input) => {
    try {
      const currentEnergyKwh = input.currentEnergyKwh;
      const targetReductionPct = input.targetReductionPct;
      const elecTariff = input.elecTariff;
      const vapCapex = input.vapCapex;
      const vapOpexYr = input.vapOpexYr;
      const projectLifeYr = input.projectLifeYr;
      const discountRate = input.discountRate;

      const energySavingsKWh = currentEnergyKwh * (targetReductionPct / 100);
      const grossAnnualSavingsUSD = energySavingsKWh * elecTariff;
      const netAnnualCashFlow = grossAnnualSavingsUSD - vapOpexYr;

      let nPV = -vapCapex;
      for (let t = 1; t <= projectLifeYr; t++) {
        nPV += netAnnualCashFlow / Math.pow(1 + (discountRate / 100), t);
      }

      let iRR = 0;
      const irrPrecision = 0.0001;
      const maxIterations = 1000;
      let guess = 0.1;

      const calculateNPV = (rate: number): number => {
        let npv = -vapCapex;
        for (let t = 1; t <= projectLifeYr; t++) {
          npv += netAnnualCashFlow / Math.pow(1 + rate, t);
        }
        return npv;
      };

      if (netAnnualCashFlow > 0 && vapCapex > 0) {
        for (let i = 0; i < maxIterations; i++) {
          const npv = calculateNPV(guess);
          const npvDerivative = ((calculateNPV(guess + irrPrecision) - calculateNPV(guess - irrPrecision)) / (2 * irrPrecision));
          
          if (Math.abs(npvDerivative) < 1e-10) {
            break;
          }
          
          const newGuess = guess - npv / npvDerivative;
          
          if (Math.abs(newGuess - guess) < irrPrecision) {
            break;
          }
          
          guess = newGuess;
          
          if (guess < 0) {
            guess = 0;
          }
        }
        
        iRR = guess * 100; // Convert to percentage
      }

      const simplePaybackYrs = netAnnualCashFlow > 0 ? vapCapex / netAnnualCashFlow : 0;
      const cO2ReductionTon = (energySavingsKWh * 0.45) / 1000;

      return {
        energySavingsKWh,
        grossAnnualSavingsUSD,
        netAnnualCashFlow,
        nPV,
        iRR: Math.max(0, iRR), // Ensure non-negative IRR
        simplePaybackYrs,
        cO2ReductionTon
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};