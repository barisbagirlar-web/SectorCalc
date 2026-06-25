import { CmmProbStylusBukulmeVeOlcumBelirsizligiIso10360Calculator114InputSchema, type CmmProbStylusBukulmeVeOlcumBelirsizligiIso10360Calculator114Input } from "./cmm-prob-stylus-bukulme-ve-olcum-belirsizligi-iso-10360-calculator-114-validation";

export const calculateCmmProbStylusBukulmeVeOlcumBelirsizligiIso10360Calculator114Contract: any = {
  id: "cmm-prob-stylus-bukulme-ve-olcum-belirsizligi-iso-10360-calculator-114",
  version: "1.0.0",
  category: "cost",
  inputSchema: CmmProbStylusBukulmeVeOlcumBelirsizligiIso10360Calculator114InputSchema,
  
  execute: async (input: any) => {
    try {
      const stylusLength = input.stylusLength;
      const stylusDia = input.stylusDia;
      const materialE = input.materialE;
      const triggerForce = input.triggerForce;
      const tempVariation = input.tempVariation;
      const expansionCoeff = input.expansionCoeff;
      const partTolerance = input.partTolerance;

      // Inertia I = (π * stylusDia^4) / 64
      const inertiaI = (Math.PI * Math.pow(stylusDia, 4)) / 64;

      // Bending Deflection mm = (triggerForce * stylusLength^3) / (3 * (materialE * 1000) * inertiaI)
      // materialE is in GPa, convert to N/mm² (MPa) by multiplying by 1000
      const materialEMpa = materialE * 1000;
      const bendingDeflectionMm = (triggerForce * Math.pow(stylusLength, 3)) / (3 * materialEMpa * inertiaI);

      // Bending Error µm = bendingDeflectionMm * 1000
      const bendingErrorUm = bendingDeflectionMm * 1000;

      // Temp Error µm = (stylusLength / 1000) * expansionCoeff * tempVariation
      // expansionCoeff is in µm/(m.K), stylusLength in mm
      const tempErrorUm = (stylusLength / 1000) * expansionCoeff * tempVariation;

      // Combined Error µm = sqrt(bendingErrorUm^2 + tempErrorUm^2)
      const combinedErrorUm = Math.sqrt(Math.pow(bendingErrorUm, 2) + Math.pow(tempErrorUm, 2));

      // TUR = partTolerance / combinedErrorUm
      const tUR = combinedErrorUm > 0 ? partTolerance / combinedErrorUm : 0;

      return {
        inertiaI: inertiaI,
        bendingDeflectionMm: bendingDeflectionMm,
        bendingErrorUm: bendingErrorUm,
        tempErrorUm: tempErrorUm,
        combinedErrorUm: combinedErrorUm,
        tUR: tUR
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};