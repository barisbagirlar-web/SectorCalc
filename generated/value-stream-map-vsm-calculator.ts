// Auto-generated from value-stream-map-vsm-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface ValueStreamMapVsmCalculatorInput {
  customerDemand: number;
  availableWorkingTime: number;
  processSteps: number;
  cycleTime: number;
  changeoverTime: number;
  uptime: number;
  defectRate: number;
  inventoryWIP: number;
  batchSize: number;
  shiftsPerDay: number;
  dataConfidence: 'low' | 'medium' | 'high';
}

export const ValueStreamMapVsmCalculatorInputSchema = z.object({
  customerDemand: z.number().min(1).max(100000).default(100),
  availableWorkingTime: z.number().min(1).max(86400).default(28800),
  processSteps: z.number().min(1).max(50).default(5),
  cycleTime: z.number().min(0.1).max(3600).default(60),
  changeoverTime: z.number().min(0).max(480).default(30),
  uptime: z.number().min(0).max(100).default(85),
  defectRate: z.number().min(0).max(100).default(2),
  inventoryWIP: z.number().min(0).max(100000).default(500),
  batchSize: z.number().min(1).max(10000).default(50),
  shiftsPerDay: z.number().min(1).max(3).default(1),
  dataConfidence: z.enum(['low', 'medium', 'high']).default('medium'),
});

export interface ValueStreamMapVsmCalculatorOutput {
  valueAddedRatio: number;
  breakdown: {
    taktTime: number;
    totalCycleTime: number;
    productionLeadTime: number;
    oee: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: ValueStreamMapVsmCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.taktTime = ((): number => { try { const __v = input.availableWorkingTime / input.customerDemand; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalCycleTime = ((): number => { try { const __v = input.processSteps * input.cycleTime; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.productionLeadTime = ((): number => { try { const __v = input.inventoryWIP * input.cycleTime / (input.customerDemand * (1 - input.defectRate/100)); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.valueAddedRatio = ((): number => { try { const __v = results.totalCycleTime / results.productionLeadTime * 100; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.oee = ((): number => { try { const __v = input.uptime * (1 - input.defectRate/100) * (1 - input.changeoverTime/(input.availableWorkingTime/60)); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.taktTimeAdjusted = ((): number => { try { const __v = results.taktTime * (1 - input.defectRate/100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.bottleneckIdentification = ((): number => { try { const __v = input.cycleTime > results.taktTime ? 'Bottleneck at step with cycle time > takt time' : 'No bottleneck'; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateValueStreamMapVsmCalculator(input: ValueStreamMapVsmCalculatorInput): ValueStreamMapVsmCalculatorOutput {
  const results = evaluateFormulas(input);
  const valueAddedRatio = results.valueAddedRatio ?? 0;
  const breakdown = {
    taktTime: results.taktTime,
    totalCycleTime: results.totalCycleTime,
    productionLeadTime: results.productionLeadTime,
    oee: results.oee,
  };

  // rule: customerDemand > 0
  // rule: availableWorkingTime > 0
  // rule: cycleTime > 0
  // rule: uptime >= 0 and uptime <= 100
  // rule: defectRate >= 0 and defectRate <= 100
  // rule: batchSize > 0
  // rule: shiftsPerDay >= 1 and shiftsPerDay <= 3
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  if (input.defectRate > 5) hiddenLossDrivers.push("High defect rate; consider Six Sigma DMAIC");
  if (input.uptime < 80) hiddenLossDrivers.push("Low uptime; investigate OEE losses");
  if (input.cycleTime > taktTime) hiddenLossDrivers.push("Cycle time exceeds takt time; bottleneck");

  const dataConfidenceAdjusted = (() => { try { return results.valueAddedRatio * (input.dataConfidence === 'high' ? 1 : input.dataConfidence === 'medium' ? 0.9 : 0.8); } catch { return valueAddedRatio; } })();

  return {
    valueAddedRatio,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF Export","CSV Export","Trend Analysis","Comparison with Benchmarks","Detailed Report with Charts"],
  };
}
