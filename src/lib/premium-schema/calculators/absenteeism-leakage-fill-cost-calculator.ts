import { DevamsizlikAbsenteeismSizintiVeDolguMaliyetiCalculator27InputSchema, type DevamsizlikAbsenteeismSizintiVeDolguMaliyetiCalculator27Input } from "./devamsizlik-absenteeism-sizinti-ve-dolgu-maliyeti-calculator-27-validation";

export const calculateDevamsizlikAbsenteeismSizintiVeDolguMaliyetiCalculator27Contract: any = {
  id: "devamsizlik-absenteeism-sizinti-ve-dolgu-maliyeti-calculator-27",
  version: "1.0.0",
  category: "cost",
  inputSchema: DevamsizlikAbsenteeismSizintiVeDolguMaliyetiCalculator27InputSchema,
  
  execute: async (input: any) => {
    try {
      const absentHrs = input.absentHrs;
      const regRate = input.regRate;
      const burdenPct = input.burdenPct;
      const otFillPct = input.otFillPct;
      const otMultiplier = input.otMultiplier;
      const tempFillPct = input.tempFillPct;
      const tempRate = input.tempRate;
      const outputPerHr = input.outputPerHr;
      const contribMargin = input.contribMargin;

      // Validate all required inputs are present and are numbers
      if ([absentHrs, regRate, burdenPct, otFillPct, otMultiplier, tempFillPct, tempRate, outputPerHr, contribMargin].some(v => v === undefined || v === null || isNaN(Number(v)))) {
        throw new Error("All input values must be valid numbers.");
      }

      const aHrs = Number(absentHrs);
      const rRate = Number(regRate);
      const bPct = Number(burdenPct);
      const otFill = Number(otFillPct);
      const otMult = Number(otMultiplier);
      const tempFill = Number(tempFillPct);
      const tRate = Number(tempRate);
      const outPerHr = Number(outputPerHr);
      const cMargin = Number(contribMargin);

      // Unfilled percentage
      const unfilledPct = 100 - (otFill + tempFill);

      // Direct absenteeism cost: wages + employer burden
      const directAbsentCost = aHrs * rRate * (1 + (bPct / 100));

      // Overtime premium cost: extra cost for OT beyond regular pay
      const oTPremiumCost = aHrs * (otFill / 100) * ((rRate * otMult * (1 + (bPct / 100))) - rRate);

      // Temporary labor cost
      const tempLaborCost = aHrs * (tempFill / 100) * tRate;

      // Production loss: lost output value from unfilled hours
      const productionLoss = aHrs * (unfilledPct / 100) * outPerHr * cMargin;

      // Total cost of absenteeism
      const totalAbsentCost = directAbsentCost + oTPremiumCost + tempLaborCost + productionLoss;

      // Cost per absent hour
      const costPerAbsentHour = aHrs > 0 ? totalAbsentCost / aHrs : 0;

      return {
        unfilledPct: Math.round(unfilledPct * 100) / 100,
        directAbsentCost: Math.round(directAbsentCost * 100) / 100,
        oTPremiumCost: Math.round(oTPremiumCost * 100) / 100,
        tempLaborCost: Math.round(tempLaborCost * 100) / 100,
        productionLoss: Math.round(productionLoss * 100) / 100,
        totalAbsentCost: Math.round(totalAbsentCost * 100) / 100,
        costPerAbsentHour: Math.round(costPerAbsentHour * 100) / 100
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};