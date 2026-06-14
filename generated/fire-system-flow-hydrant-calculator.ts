// Auto-generated from fire-system-flow-hydrant-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface FireSystemFlowHydrantCalculatorInput {
  buildingType: 'commercial' | 'industrial' | 'residential' | 'storage';
  hazardClassification: 'light' | 'ordinary1' | 'ordinary2' | 'extra1' | 'extra2';
  sprinklerCoverageArea: number;
  numberOfSprinklers: number;
  designDensity: number;
  hydrantFlowRate: number;
  numberOfHydrants: number;
  simultaneousHydrantDemand: number;
  frictionLossFactor: number;
  pipeLength: number;
  elevationChange: number;
  requiredPressureAtOutlet: number;
  waterSupplyPressure: number;
  dataConfidence: number;
}

export const FireSystemFlowHydrantCalculatorInputSchema = z.object({
  buildingType: z.enum(['commercial', 'industrial', 'residential', 'storage']).default('commercial'),
  hazardClassification: z.enum(['light', 'ordinary1', 'ordinary2', 'extra1', 'extra2']).default('ordinary1'),
  sprinklerCoverageArea: z.number().min(80).max(225).default(130),
  numberOfSprinklers: z.number().min(1).max(1000).default(10),
  designDensity: z.number().min(0.05).max(0.6).default(0.15),
  hydrantFlowRate: z.number().min(250).max(5000).default(1000),
  numberOfHydrants: z.number().min(1).max(10).default(2),
  simultaneousHydrantDemand: z.number().min(250).max(2500).default(500),
  frictionLossFactor: z.number().min(0).max(50).default(10),
  pipeLength: z.number().min(0).max(5000).default(500),
  elevationChange: z.number().min(-100).max(100).default(0),
  requiredPressureAtOutlet: z.number().min(20).max(150).default(50),
  waterSupplyPressure: z.number().min(30).max(200).default(80),
  dataConfidence: z.number().min(50).max(100).default(90),
});

export interface FireSystemFlowHydrantCalculatorOutput {
  overallStatus: number;
  breakdown: {
    totalSprinklerFlow: number;
    totalHydrantSupply: number;
    totalDemand: number;
    totalSupply: number;
    requiredPressure: number;
    availablePressure: number;
    flowAdequacy: number;
    pressureAdequacy: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: FireSystemFlowHydrantCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.sprinklerFlowPerHead = ((): number => { try { const __v = input.designDensity * input.sprinklerCoverageArea; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalSprinklerFlow = ((): number => { try { const __v = results.sprinklerFlowPerHead * input.numberOfSprinklers; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalHydrantSupply = ((): number => { try { const __v = input.hydrantFlowRate * input.numberOfHydrants; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalDemand = ((): number => { try { const __v = results.totalSprinklerFlow + (input.simultaneousHydrantDemand * input.numberOfHydrants); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalSupply = ((): number => { try { const __v = results.totalHydrantSupply; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.frictionLoss = ((): number => { try { const __v = input.frictionLossFactor * (input.pipeLength / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.elevationPressure = ((): number => { try { const __v = input.elevationChange * 0.433; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.requiredPressure = ((): number => { try { const __v = input.requiredPressureAtOutlet + results.frictionLoss + results.elevationPressure; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.availablePressure = ((): number => { try { const __v = input.waterSupplyPressure; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.flowAdequacy = ((): number => { try { const __v = results.totalSupply >= results.totalDemand ? 'Adequate' : 'Inadequate'; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.pressureAdequacy = ((): number => { try { const __v = results.availablePressure >= results.requiredPressure ? 'Adequate' : 'Inadequate'; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.overallStatus = ((): number => { try { const __v = results.flowAdequacy == 'Adequate' && results.pressureAdequacy == 'Adequate' ? 'Compliant' : 'Non-compliant'; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjusted = ((): number => { try { const __v = results.overallStatus == 'Compliant' ? 'Compliant with ' + input.dataConfidence + '% confidence' : 'Non-compliant with ' + input.dataConfidence + '% confidence'; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateFireSystemFlowHydrantCalculator(input: FireSystemFlowHydrantCalculatorInput): FireSystemFlowHydrantCalculatorOutput {
  const results = evaluateFormulas(input);
  const overallStatus = results.overallStatus ?? 0;
  const breakdown = {
    totalSprinklerFlow: results.totalSprinklerFlow,
    totalHydrantSupply: results.totalHydrantSupply,
    totalDemand: results.totalDemand,
    totalSupply: results.totalSupply,
    requiredPressure: results.requiredPressure,
    availablePressure: results.availablePressure,
    flowAdequacy: results.flowAdequacy,
    pressureAdequacy: results.pressureAdequacy,
  };

  // rule: If buildingType is 'storage' and hazardClassification is 'light', then warning: 'Storage buildings typically require higher hazard classification.'
  // rule: If designDensity < 0.1 and hazardClassification in ['extra1','extra2'], then error: 'Design density too low for extra hazard.'
  // rule: If hydrantFlowRate < simultaneousHydrantDemand, then error: 'Hydrant flow rate insufficient for simultaneous demand.'
  // rule: If waterSupplyPressure < requiredPressureAtOutlet + frictionLossFactor * pipeLength / 100 + elevationChange * 0.433, then error: 'Insufficient water supply pressure.'
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): If totalDemand > totalSupply, then 'Flow deficit: insufficient water supply.'
  // threshold skipped (non-JS): If availablePressure < requiredPressure, then 'Pressure deficit: insufficient pressure at outlet.'
  // threshold skipped (non-JS): If dataConfidence < 70, then 'Low data confidence; results may be unreliable.'

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjusted; } catch { return overallStatus; } })();

  return {
    overallStatus,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF export of detailed report","CSV export of input and output data","Trend analysis over multiple calculations","Comparison with NFPA standards and local codes","Detailed hydraulic calculation breakdown"],
  };
}
