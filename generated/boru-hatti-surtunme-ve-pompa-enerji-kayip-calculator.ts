// Auto-generated from boru-hatti-surtunme-ve-pompa-enerji-kayip-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface BoruHattiSurtunmeVePompaEnerjiKayipCalculatorInput {
  flowRate: number;
  pipeDiameter: number;
  pipeLength: number;
  roughness: number;
  fluidDensity: number;
  fluidViscosity: number;
  pumpEfficiency: number;
  electricityCost: number;
  operatingHours: number;
  fittingLossCoefficient: number;
}

export const BoruHattiSurtunmeVePompaEnerjiKayipCalculatorInputSchema = z.object({
  flowRate: z.number().min(0.001).max(100).default(0.1),
  pipeDiameter: z.number().min(0.01).max(5).default(0.3),
  pipeLength: z.number().min(1).max(100000).default(1000),
  roughness: z.number().min(0.000001).max(0.01).default(0.000045),
  fluidDensity: z.number().min(1).max(2000).default(1000),
  fluidViscosity: z.number().min(0.0001).max(10).default(0.001),
  pumpEfficiency: z.number().min(10).max(100).default(75),
  electricityCost: z.number().min(0.1).max(10).default(2),
  operatingHours: z.number().min(0).max(8760).default(8000),
  fittingLossCoefficient: z.number().min(0).max(100).default(0.5),
});

export interface BoruHattiSurtunmeVePompaEnerjiKayipCalculatorOutput {
  annualEnergyCost: number;
  breakdown: {
    majorLoss: number;
    minorLoss: number;
    pressureDrop: number;
    hydraulicPower: number;
    shaftPower: number;
    annualEnergyConsumption: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: BoruHattiSurtunmeVePompaEnerjiKayipCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.crossSectionalArea = ((): number => { try { const __v = A = π * (input.pipeDiameter/2)^2; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.velocity = ((): number => { try { const __v = v = input.flowRate / A; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.reynoldsNumber = ((): number => { try { const __v = Re = (input.fluidDensity * v * input.pipeDiameter) / input.fluidViscosity; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.frictionFactor = ((): number => { try { const __v = 0; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.majorLoss = ((): number => { try { const __v = h_f = f * (input.pipeLength/input.pipeDiameter) * (v^2/(2*9.81)); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.minorLoss = ((): number => { try { const __v = h_m = input.fittingLossCoefficient * (v^2/(2*9.81)); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalHeadLoss = ((): number => { try { const __v = h_total = h_f + h_m; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.pressureDrop = ((): number => { try { const __v = ΔP = input.fluidDensity * 9.81 * h_total; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.hydraulicPower = ((): number => { try { const __v = P_h = input.fluidDensity * 9.81 * input.flowRate * h_total; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.shaftPower = ((): number => { try { const __v = P_s = P_h / (input.pumpEfficiency/100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.annualEnergyConsumption = ((): number => { try { const __v = E = P_s * input.operatingHours; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.annualEnergyCost = ((): number => { try { const __v = C = E * input.electricityCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateBoruHattiSurtunmeVePompaEnerjiKayipCalculator(input: BoruHattiSurtunmeVePompaEnerjiKayipCalculatorInput): BoruHattiSurtunmeVePompaEnerjiKayipCalculatorOutput {
  const results = evaluateFormulas(input);
  const annualEnergyCost = results.annualEnergyCost ?? 0;
  const breakdown = {
    majorLoss: results.majorLoss,
    minorLoss: results.minorLoss,
    pressureDrop: results.pressureDrop,
    hydraulicPower: results.hydraulicPower,
    shaftPower: results.shaftPower,
    annualEnergyConsumption: results.annualEnergyConsumption,
  };

  // rule: flowRate > 0
  // rule: pipeDiameter > 0
  // rule: pipeLength > 0
  // rule: roughness >= 0
  // rule: fluidDensity > 0
  // rule: fluidViscosity > 0
  // rule: pumpEfficiency > 0 && pumpEfficiency <= 100
  // rule: electricityCost > 0
  // rule: operatingHours >= 0 && operatingHours <= 8760
  // rule: fittingLossCoefficient >= 0
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): Pompa verimi dusuk, bakim veya degisim gerekebilir.
  // threshold skipped (non-JS): Yuksek basinc dususu, pompa kapasitesi yetersiz olabilir.
  // threshold skipped (non-JS): Laminer akis, surtunme kaybi hesaplamasi farkli yapilmali.

  const dataConfidenceAdjusted = (() => { try { return annualEnergyCost; } catch { return annualEnergyCost; } })();

  return {
    annualEnergyCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF raporu","CSV veri disa aktarimi","Trend analizi (zaman serisi)","Senaryo karsilastirma","Detayli kayip analizi raporu"],
  };
}
