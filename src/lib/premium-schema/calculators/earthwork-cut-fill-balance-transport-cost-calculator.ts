import { KesimdolguEarthworkDengeVeNakliyeMaliyetiCalculator68InputSchema, type KesimdolguEarthworkDengeVeNakliyeMaliyetiCalculator68Input } from "./kesimdolgu-earthwork-denge-ve-nakliye-maliyeti-calculator-68-validation";

export const calculateKesimdolguEarthworkDengeVeNakliyeMaliyetiCalculator68Contract: any = {
  id: "kesimdolgu-earthwork-denge-ve-nakliye-maliyeti-calculator-68",
  version: "1.0.0",
  category: "cost",
  inputSchema: KesimdolguEarthworkDengeVeNakliyeMaliyetiCalculator68InputSchema,
  
  execute: async (input: any) => {
    try {
      const parsed = KesimdolguEarthworkDengeVeNakliyeMaliyetiCalculator68InputSchema.parse(input);
      
      const {
        cutVolume,
        fillVolume,
        swellFactor,
        shrinkFactor,
        haulRate,
        haulDistance,
        borrowRate,
        disposalRate
      } = parsed;

      // Step 1: Convert cut volume to loose (swelled) state
      const looseCutVolume = cutVolume * swellFactor;

      // Step 2: Convert fill volume to required compacted volume
      const requiredCompactedFill = fillVolume / shrinkFactor;

      // Step 3: Net balance in loose cubic meters
      const netBalanceLoose = looseCutVolume - requiredCompactedFill;

      // Step 4: Determine borrow and waste volumes
      const borrowNeededM3 = Math.max(0, netBalanceLoose < 0 ? Math.abs(netBalanceLoose) : 0);
      const wasteDisposalM3 = Math.max(0, netBalanceLoose);

      // Step 5: Calculate haul cost (only for material that is actually moved from cut to fill)
      // The amount moved is the lesser of loose cut and required fill (in common loose terms)
      const movedLooseVolume = Math.min(looseCutVolume, requiredCompactedFill);
      const haulCost = movedLooseVolume * haulDistance * haulRate;

      // Step 6: Borrow and disposal costs
      const borrowCost = borrowNeededM3 * borrowRate;
      const disposalCost = wasteDisposalM3 * disposalRate;

      // Step 7: Total cost
      const totalEarthworkCost = haulCost + borrowCost + disposalCost;

      return {
        looseCutVolume: Math.round(looseCutVolume * 100) / 100,
        requiredCompactedFill: Math.round(requiredCompactedFill * 100) / 100,
        netBalanceLoose: Math.round(netBalanceLoose * 100) / 100,
        borrowNeededM3: Math.round(borrowNeededM3 * 100) / 100,
        wasteDisposalM3: Math.round(wasteDisposalM3 * 100) / 100,
        haulCost: Math.round(haulCost * 100) / 100,
        borrowCost: Math.round(borrowCost * 100) / 100,
        disposalCost: Math.round(disposalCost * 100) / 100,
        totalEarthworkCost: Math.round(totalEarthworkCost * 100) / 100
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};