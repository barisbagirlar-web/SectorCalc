import { getAllPremiumSchemas } from "../src/lib/features/premium-schema/schema-registry";
import { FORMULA_META } from "../src/lib/features/premium-schema/formula-registry";

const schemas = getAllPremiumSchemas();
const schema = schemas.find(s => s.id === "cnc-machining-cost-analyzer")!;

const definedVars = new Set(schema.inputs.map((i: any) => i.id));
const usedInputIds = new Set<string>();

for (const step of schema.formulaPipeline || []) {
  const { formulaId, inputMap, outputId } = step;
  const meta = FORMULA_META[formulaId];
  if (!meta) continue;

  for (const req of meta.requiredInputs || []) {
    const mappedVar = inputMap[req];
    console.log(`req: ${req}, mappedVar: ${mappedVar}, defined: ${definedVars.has(mappedVar)}`);
    if (mappedVar && definedVars.has(mappedVar)) {
      if (schema.inputs.some((i: any) => i.id === mappedVar)) {
        usedInputIds.add(mappedVar);
        console.log(`ADDED to usedInputIds: ${mappedVar}`);
      }
    }
  }
}
console.log("usedInputIds:", Array.from(usedInputIds));
