import { getAllPremiumSchemas } from "../src/lib/features/premium-schema/schema-registry";
import { runPremiumSchemaEngine, buildDefaultSchemaInputs, schemaHasFiniteResults } from "../src/lib/features/premium-schema/premium-schema-engine";
import { listGeneratedToolSchemaSlugs, getGeneratedToolSchema } from "../src/lib/features/generated-tools/schema-loader-core";
import { adaptLegacyJsonToPremiumSchema } from "../src/lib/features/dynamic-form-v2/legacy-to-premium-adapter";

let passCount = 0;
let failCount = 0;
const failures: Array<{ id: string; reason: string }> = [];

// Monkey-patch console.warn to detect missing formulas
const originalWarn = console.warn;
let caughtWarnings: string[] = [];
console.warn = (...args) => {
  if (typeof args[0] === 'string' && args[0].includes("[SchemaEngine] Formula")) {
    caughtWarnings.push(args[0]);
  }
  originalWarn(...args);
};

const schemas = getAllPremiumSchemas();

// Load Free tools
const legacySlugs = listGeneratedToolSchemaSlugs();
for (const slug of legacySlugs) {
    const rawSchema = getGeneratedToolSchema(slug);
    if (!rawSchema) continue;
    try {
        const schema = adaptLegacyJsonToPremiumSchema(rawSchema as any, slug);
        schemas.push(schema);
    } catch (e) {
        // Skip broken legacy adaptations
    }
}

for (const schema of schemas) {
  try {
    const defaultInputs = buildDefaultSchemaInputs(schema);
    
    schema.inputs.forEach((inp: any) => {
        if (inp.array && (!defaultInputs[inp.id] || defaultInputs[inp.id].length === 0)) {
            defaultInputs[inp.id] = [1.5, 2.0];
        }
    });

    caughtWarnings = [];
    const resultDefault = runPremiumSchemaEngine(schema, defaultInputs, "en", "USD");
    
    // Differential test
    const doubleInputs = { ...defaultInputs };
    schema.inputs.forEach((inp: any) => {
        if (typeof defaultInputs[inp.id] === "number") {
             doubleInputs[inp.id] = (defaultInputs[inp.id] as number) * 2.1 + 1.3; 
        }
    });
    
    const resultDouble = runPremiumSchemaEngine(schema, doubleInputs, "en", "USD");
    
    let outputsChanged = resultDefault.bigNumber.raw !== resultDouble.bigNumber.raw;
    if (!outputsChanged) {
        for (let i = 0; i < resultDefault.outputs.length; i++) {
            if (resultDefault.outputs[i].raw !== resultDouble.outputs[i].raw) {
                 outputsChanged = true;
                 break;
            }
        }
    }

    if (caughtWarnings.length > 0) {
        failCount++;
        failures.push({
            id: schema.id,
            reason: `Missing/Failed Formulas: ${caughtWarnings.length} found. (${caughtWarnings[0]})`,
        });
    } else if (!schemaHasFiniteResults(resultDefault) || !schemaHasFiniteResults(resultDouble)) {
        failCount++;
        failures.push({
            id: schema.id,
            reason: "Non-finite result (NaN or Infinity)",
        });
    } else if (!outputsChanged && schema.outputs.length > 0) {
        failCount++;
        failures.push({
            id: schema.id,
            reason: "Inputs do not affect the formula! (Differential Test Failed)",
        });
    } else {
        passCount++;
    }
  } catch (err: any) {
    failCount++;
    failures.push({
        id: schema.id,
        reason: err.message,
    });
  }
}

console.log(`\n=== RUNTIME TRUST AUDIT (Includes Free & Pro Tools) ===`);
console.log(`PASS: ${passCount}`);
console.log(`FAIL: ${failCount}`);
if (failCount > 0) {
    console.log(`\nFailed Schemas:`);
    failures.forEach(f => {
        console.log(`- ${f.id}: ${f.reason}`);
    });
    process.exit(1);
}
