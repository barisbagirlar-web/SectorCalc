import { CNC_CYCLE_TIME_SCHEMA } from './src/lib/features/premium-schema/schemas/cnc-cycle-time-analyzer';
import { FORMULA_REGISTRY } from './src/lib/features/premium-schema/formula-registry';

const inputs = {
  "cuttingSpeed": 150,
  "chipLoad": 0.12,
  "toothCount": 4,
  "depthOfCut": 2,
  "toolDiameter": 20,
  "cutLength": 100,
  "rapidDistance": 300,
  "rapidSpeed": 15000,
  "toolChanges": 2,
  "timePerChange": 0.5,
  "nonCuttingTime": 0.3,
  "loadUnloadTime": 0.5,
  "plannedTime": 480,
  "downtime": 30,
  "totalParts": 100
};

const pipelineOutputs: Record<string, number> = {};
for (const step of CNC_CYCLE_TIME_SCHEMA.formulaPipeline) {
  const formulaFn = FORMULA_REGISTRY[step.formulaId];
  if (!formulaFn) {
     console.log('NOT FOUND', step.formulaId);
     continue;
  }
  
  const mappedInputs: Record<string, number> = {};
  for (const [formulaArg, schemaField] of Object.entries(step.inputMap)) {
    let val = pipelineOutputs[schemaField] ?? inputs[schemaField as keyof typeof inputs] as number;
    mappedInputs[formulaArg] = val;
  }
  
  const rawValue = formulaFn(mappedInputs);
  pipelineOutputs[step.outputId] = rawValue;
  console.log(`Step ${step.formulaId} -> ${step.outputId}:`, mappedInputs, '=>', rawValue);
}

