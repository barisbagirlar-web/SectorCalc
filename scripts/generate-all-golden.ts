import fs from "fs";
import path from "path";
import { getAllPremiumSchemas } from "../src/lib/features/premium-schema/schema-registry";
import { FORMULA_REGISTRY } from "../src/lib/features/premium-schema/formula-registry";

const schemas = getAllPremiumSchemas();

let count = 0;

for (const schema of schemas) {
  const goldenPath = path.join(__dirname, `../src/lib/features/premium-schema/schemas/${schema.id}.golden.json`);
  if (fs.existsSync(goldenPath)) continue;

  const inputs: Record<string, number | number[]> = {};
  for (const input of schema.inputs) {
    if (input.smartDefault !== undefined) {
      if (input.array) {
        inputs[input.id] = [Number(input.smartDefault), Number(input.smartDefault)]; // dummy array
      } else {
        inputs[input.id] = Number(input.smartDefault);
      }
    } else {
      if (input.array) {
        inputs[input.id] = [10, 10];
      } else {
        inputs[input.id] = 10;
      }
    }
  }

  // Certain specific fields need array data if it's not clear
  if (schema.id === 'spc-limit-control-analyzer') {
    inputs['subgroupMeans'] = [10.1, 10.2, 9.9, 10.0, 10.1];
    inputs['subgroupRanges'] = [0.2, 0.1, 0.3, 0.2, 0.1];
  }

  const results: Record<string, any> = {};
  const pipelineInputs: Record<string, any> = { ...inputs };

  try {
    for (const step of schema.formulaPipeline || []) {
      const fnDef = FORMULA_REGISTRY[step.formulaId];
      if (!fnDef) throw new Error(`Formula ${step.formulaId} not found`);

      const mappedArgs: Record<string, any> = {};
      for (const [fnArg, schemaArg] of Object.entries(step.inputMap)) {
        mappedArgs[fnArg] = pipelineInputs[schemaArg];
      }

      const outVal = fnDef(mappedArgs);
      
      if (step.outputId) {
        pipelineInputs[step.outputId] = outVal;
        results[step.outputId] = outVal;
      }
    }
    
    // Validate output
    let valid = true;
    for (const output of schema.outputs) {
      if (results[output.id] === undefined || isNaN(Number(results[output.id]))) {
        valid = false;
        break;
      }
    }

    if (valid) {
      const goldenObj = {
        meta: {
          tolerance: {
            abs: 1e-4,
            rel: 1e-6
          }
        },
        cases: [
          {
            name: "Smart Defaults Base Case",
            inputs,
            expected: results
          }
        ]
      };

      fs.writeFileSync(goldenPath, JSON.stringify(goldenObj, null, 2), "utf8");
      count++;
      console.log(`Generated golden for ${schema.id}`);
    } else {
      console.log(`Skipped ${schema.id} due to NaN/undefined outputs`);
    }

  } catch (e: any) {
    console.log(`Error generating for ${schema.id}: ${e.message}`);
  }
}

console.log(`Generated ${count} new golden files.`);
