// Auto-generated from welded-bolted-connection-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface WeldedBoltedConnectionCalculatorInput {
  connectionType: 'welded' | 'bolted';
  loadType: 'static' | 'fatigue' | 'impact';
  appliedLoad: number;
  loadAngle: number;
  materialGrade: 'S235' | 'S275' | 'S355' | 'S460' | 'A36' | 'A572';
  plateThickness: number;
  weldSize: number;
  boltDiameter: 'M12' | 'M16' | 'M20' | 'M24' | 'M30';
  boltGrade: '4.6' | '5.6' | '8.8' | '10.9';
  numberOfBolts: number;
  safetyFactor: number;
  dataConfidence: number;
}

export const WeldedBoltedConnectionCalculatorInputSchema = z.object({
  connectionType: z.enum(['welded', 'bolted']).default('welded'),
  loadType: z.enum(['static', 'fatigue', 'impact']).default('static'),
  appliedLoad: z.number().min(0).max(10000).default(100),
  loadAngle: z.number().min(0).max(90).default(0),
  materialGrade: z.enum(['S235', 'S275', 'S355', 'S460', 'A36', 'A572']).default('S235'),
  plateThickness: z.number().min(3).max(100).default(10),
  weldSize: z.number().min(3).max(30).default(6),
  boltDiameter: z.enum(['M12', 'M16', 'M20', 'M24', 'M30']).default('M20'),
  boltGrade: z.enum(['4.6', '5.6', '8.8', '10.9']).default('8.8'),
  numberOfBolts: z.number().min(1).max(100).default(4),
  safetyFactor: z.number().min(1).max(5).default(1.5),
  dataConfidence: z.number().min(50).max(100).default(90),
});

export interface WeldedBoltedConnectionCalculatorOutput {
  utilizationRatio: number;
  breakdown: {
    materialStrength: number;
    weldCapacity: number;
    boltShearCapacity: number;
    totalBoltCapacity: number;
    loadComponents: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: WeldedBoltedConnectionCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.materialStrength = ((): number => { try { const __v = 0; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.boltTensileStrength = ((): number => { try { const __v = 0; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.boltShearStrength = ((): number => { try { const __v = 0.6 * results.boltTensileStrength; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.weldShearStrength = ((): number => { try { const __v = 0.6 * results.materialStrength; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.weldEffectiveArea = ((): number => { try { const __v = 0.707 * input.weldSize * input.plateThickness; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.weldCapacity = ((): number => { try { const __v = results.weldEffectiveArea * results.weldShearStrength / input.safetyFactor; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.boltShearArea = ((): number => { try { const __v = 0; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.boltShearCapacity = ((): number => { try { const __v = results.boltShearArea * results.boltShearStrength / input.safetyFactor; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalBoltCapacity = ((): number => { try { const __v = results.boltShearCapacity * input.numberOfBolts; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.loadComponentVertical = ((): number => { try { const __v = input.appliedLoad * cos(input.loadAngle * PI / 180); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.loadComponentHorizontal = ((): number => { try { const __v = input.appliedLoad * sin(input.loadAngle * PI / 180); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.utilizationRatio = ((): number => { try { const __v = 0; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjusted = ((): number => { try { const __v = results.utilizationRatio * (100 / input.dataConfidence); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateWeldedBoltedConnectionCalculator(input: WeldedBoltedConnectionCalculatorInput): WeldedBoltedConnectionCalculatorOutput {
  const results = evaluateFormulas(input);
  const utilizationRatio = results.utilizationRatio ?? 0;
  const breakdown = {
    materialStrength: results.materialStrength,
    weldCapacity: results.weldCapacity,
    boltShearCapacity: results.boltShearCapacity,
    totalBoltCapacity: results.totalBoltCapacity,
    loadComponents: results.loadComponents,
  };

  // rule: If connectionType='welded', then weldSize must be >= 3 and <= plateThickness
  // rule: If connectionType='bolted', then boltDiameter must be selected and numberOfBolts >= 1
  // rule: If loadType='fatigue', then safetyFactor must be >= 2.0
  // rule: appliedLoad must be > 0
  // rule: plateThickness must be >= 3
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): Connection is overstressed. Increase weld size, bolt diameter, or number of bolts.
  // threshold skipped (non-JS): Connection is near capacity. Consider redesign for safety.
  // threshold skipped (non-JS): Low data confidence. Results may be unreliable.

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjusted; } catch { return utilizationRatio; } })();

  return {
    utilizationRatio,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF report export","CSV data export","Trend analysis over multiple designs","Comparison of welded vs bolted options","Detailed calculation breakdown with code references"],
  };
}
