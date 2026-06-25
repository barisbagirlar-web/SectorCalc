import { BasincliHavaSizintiMaliyetiSonikAkisEntegrasyonuCalculator10InputSchema, type BasincliHavaSizintiMaliyetiSonikAkisEntegrasyonuCalculator10Input } from "./basincli-hava-sizinti-maliyeti-sonik-akis-entegrasyonu-calculator-10-validation";

export const calculateBasincliHavaSizintiMaliyetiSonikAkisEntegrasyonuCalculator10Contract: any = {
  id: "basincli-hava-sizinti-maliyeti-sonik-akis-entegrasyonu-calculator-10",
  version: "1.0.0",
  category: "cost",
  inputSchema: BasincliHavaSizintiMaliyetiSonikAkisEntegrasyonuCalculator10InputSchema,
  
  execute: async (input: BasincliHavaSizintiMaliyetiSonikAkisEntegrasyonuCalculator10Input) => {
    try {
      // Destructure inputs with validation
      const fad = Number(input.fad);           // m³/dk
      const opHrs = Number(input.opHrs);        // saat/yıl
      const leakD = Number(input.leakD);        // mm
      const pSys = Number(input.pSys);          // bar (gauge)
      const nPoly = Number(input.nPoly);        // politropik üs
      const tIn = Number(input.tIn);            // °C
      const elecRate = Number(input.elecRate);  // USD/kWh
      const mechEff = Number(input.mechEff);    // %

      // Input validation
      if (fad <= 0 || opHrs <= 0 || leakD <= 0 || pSys <= 0 || nPoly <= 0 || mechEff <= 0 || elecRate <= 0) {
        throw new Error("All input values must be positive.");
      }

      // Step 1: Absolute temperature (Kelvin)
      const tAbs = tIn + 273.15;

      // Step 2: Absolute pressure (bar absolute)
      const pAbs = pSys + 1.013; // 1.013 bar = standard atmospheric pressure

      // Step 3: Specific Power (kW per m³/min flow)
      // Formula derived from polytropic compression work
      const specPower = ((nPoly / (nPoly - 1)) * 1.013 * 100 * (fad / 60) * (Math.pow((pAbs / 1.013), ((nPoly - 1) / nPoly)) - 1)) / (mechEff / 100);

      // Step 4: Sonic flow leak rate for an orifice
      // Using standard orifice discharge coefficient Cd = 0.65 for a sharp-edged hole
      // Leak flow equation based on Bernoulli with compressible flow correction
      const cd = 0.65; // Discharge coefficient for sharp-edged orifice
      const leakArea = (Math.PI / 4) * Math.pow(leakD / 1000, 2); // m²
      const rhoAtm = 101325 / (287 * tAbs); // kg/m³ (density of air at standard conditions)
      const deltaP = pSys * 100000; // Pa (convert bar to Pa)
      const leakFlowLS = cd * leakArea * Math.sqrt(2 * deltaP / rhoAtm) * 1000; // L/s

      // Step 5: Convert leak flow to m³/min
      const leakFlowM3Min = (leakFlowLS * 60) / 1000; // m³/min

      // Step 6: Leak Power (kW) - power consumed by the compressor to supply the leaked air
      const leakPower = leakFlowM3Min * (specPower / fad);

      // Step 7: Annual cost of the leak
      const annualLeakCost = leakPower * opHrs * elecRate;

      // Return all computed values
      return {
        tAbs: Math.round(tAbs * 100) / 100,
        pAbs: Math.round(pAbs * 100) / 100,
        specPower: Math.round(specPower * 100) / 100,
        leakFlowLS: Math.round(leakFlowLS * 100) / 100,
        leakFlowM3Min: Math.round(leakFlowM3Min * 100) / 100,
        leakPower: Math.round(leakPower * 100) / 100,
        annualLeakCost: Math.round(annualLeakCost * 100) / 100
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};