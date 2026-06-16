// Auto-generated from viscosity-converter-calculator-schema.json
import * as z from 'zod';

export interface Viscosity_converter_calculatorInput {
  inputValue: number;
  fromUnit: number;
  toUnit: number;
  density: number;
}

export const Viscosity_converter_calculatorInputSchema = z.object({
  inputValue: z.number().default(1),
  fromUnit: z.number().default(0),
  toUnit: z.number().default(1),
  density: z.number().default(1000),
});

function evaluateAllFormulas(input: Viscosity_converter_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (function(value, from, to, dens) { const dynamicUnits = [0,1,2,3];
  const kinematicUnits = [4,5,6];
  const dynamicFactors = [1, 0.001, 0.1, 0.001]; // to Pa·s
  const kinematicFactors = [0.0001, 0.000001, 1]; // to m²/s
  const unitNames = ['Pa·s','cP','P','mPa·s','St','cSt','m²/s'];
  const steps = [];
  let baseDynamic, baseKinematic;
  let result;
  steps.push(`Giriş: ${value} ${unitNames[from]}`);

  if (dynamicUnits.includes(from) && dynamicUnits.includes(to)) {
    baseDynamic = value * dynamicFactors[from]; // Pa·s
    result = baseDynamic / dynamicFactors[to];
    steps.push(`Dönüşüm (dinamik): ${value} ${unitNames[from]} = ${baseDynamic} Pa·s = ${result} ${unitNames[to]}`);
  }
  else if (kinematicUnits.includes(from) && kinematicUnits.includes(to)) {
    baseKinematic = value * kinematicFactors[from - 4]; // m²/s
    result = baseKinematic / kinematicFactors[to - 4];
    steps.push(`Dönüşüm (kinematik): ${value} ${unitNames[from]} = ${baseKinematic} m²/s = ${result} ${unitNames[to]}`);
  }
  else if (dynamicUnits.includes(from) && kinematicUnits.includes(to)) {
    if (dens <= 0) throw new Error('Yoğunluk pozitif olmalıdır');
    baseDynamic = value * dynamicFactors[from]; // Pa·s
    baseKinematic = baseDynamic / dens;          // m²/s
    result = baseKinematic / kinematicFactors[to - 4];
    steps.push(`Dinamikten kinematiğe: ${value} ${unitNames[from]} = ${baseDynamic} Pa·s ⇒ ${baseKinematic} m²/s (yoğunluk: ${dens} kg/m³) = ${result} ${unitNames[to]}`);
  }
  else if (kinematicUnits.includes(from) && dynamicUnits.includes(to)) {
    if (dens <= 0) throw new Error('Yoğunluk pozitif olmalıdır');
    baseKinematic = value * kinematicFactors[from - 4]; // m²/s
    baseDynamic = baseKinematic * dens;                 // Pa·s
    result = baseDynamic / dynamicFactors[to];
    steps.push(`Kinematikten dinamiğe: ${value} ${unitNames[from]} = ${baseKinematic} m²/s ⇒ ${baseDynamic} Pa·s (yoğunluk: ${dens} kg/m³) = ${result} ${unitNames[to]}`);
  }
  else {
    throw new Error('Geçersiz birim seçimi');
  }
  steps.push(`Sonuç: ${result} ${unitNames[to]}`);
  return { primary: result, breakdown: steps }; })(value, from, to, dens); results["convert"] = Number.isFinite(v) ? v : 0; } catch { results["convert"] = 0; }
  return results;
}


export function calculateViscosity_converter_calculator(input: Viscosity_converter_calculatorInput): Viscosity_converter_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["convertedValue"] ?? 0;
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  const dataConfidenceAdjusted =
    typeof (input as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as Record<string, unknown>).dataConfidence as number) / 100)
      : totalWasteCost;
  return {
    totalWasteCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Viscosity_converter_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
