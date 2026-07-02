import { readFileSync } from "node:fs";
import { join } from "node:path";
import { getAllPremiumSchemas } from "../src/lib/features/premium-schema/schema-registry";
import { runPremiumSchemaEngine, buildDefaultSchemaInputs, schemaHasFiniteResults } from "../src/lib/features/premium-schema/premium-schema-engine";
import { listGeneratedToolSchemaSlugs, getGeneratedToolSchema } from "../src/lib/features/generated-tools/schema-loader-core";
import { adaptLegacyJsonToPremiumSchema } from "../src/lib/features/dynamic-form-v2/legacy-to-premium-adapter";
import { evaluateRuntimeTrust } from "../src/lib/features/tools/runtime-trust-engine";

const ROOT = join(import.meta.dirname, "..");
const freeSlugs: string[] = JSON.parse(readFileSync(join(ROOT, "free-slugs.json"), "utf8"));
const premiumSlugs: string[] = JSON.parse(readFileSync(join(ROOT, "premium-slugs.json"), "utf8"));

// Run dynamic engine evaluations first
const schemas = getAllPremiumSchemas();
const legacySlugs = listGeneratedToolSchemaSlugs();
for (const slug of legacySlugs) {
    const rawSchema = getGeneratedToolSchema(slug);
    if (!rawSchema) continue;
    try {
        const schema = adaptLegacyJsonToPremiumSchema(rawSchema as any, slug);
        schemas.push(schema);
    } catch (e) {}
}

const engineFailures: Array<{ id: string; reason: string }> = [];

let originalWarn = console.warn;
let caughtWarnings: string[] = [];
console.warn = (...args) => {
  if (typeof args[0] === 'string' && args[0].includes("[SchemaEngine] Formula")) {
    caughtWarnings.push(args[0]);
  }
  originalWarn(...args);
};

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
    
    if (!outputsChanged && schema.inputs.length > 0) {
        const singleDoubleInputs = { ...defaultInputs };
        const firstNumInput = schema.inputs.find((inp: any) => typeof defaultInputs[inp.id] === "number");
        if (firstNumInput && typeof defaultInputs[firstNumInput.id] === "number") {
            singleDoubleInputs[firstNumInput.id] = (defaultInputs[firstNumInput.id] as number) * 2.1 + 1.3;
            const resultSingle = runPremiumSchemaEngine(schema, singleDoubleInputs, "en", "USD");
            for (let i = 0; i < resultDefault.outputs.length; i++) {
                if (resultDefault.outputs[i].raw !== resultSingle.outputs[i].raw) {
                    outputsChanged = true;
                    break;
                }
            }
        }
    }
    
    if (!outputsChanged && schema.inputs.length > 0) {
        const singleHalveInputs = { ...defaultInputs };
        const firstNumInput = schema.inputs.find((inp: any) => typeof defaultInputs[inp.id] === "number");
        if (firstNumInput && typeof defaultInputs[firstNumInput.id] === "number") {
            singleHalveInputs[firstNumInput.id] = Math.max(0.001, (defaultInputs[firstNumInput.id] as number) * 0.1 - 2);
            const resultSingle = runPremiumSchemaEngine(schema, singleHalveInputs, "en", "USD");
            for (let i = 0; i < resultDefault.outputs.length; i++) {
                if (resultDefault.outputs[i].raw !== resultSingle.outputs[i].raw) {
                    outputsChanged = true;
                    break;
                }
            }
        }
    }

    if (caughtWarnings.length > 0) {
        engineFailures.push({
            id: schema.id,
            reason: `Missing/Failed Formulas: ${caughtWarnings.length} found. (${caughtWarnings[0]})`,
        });
    } else if (!schemaHasFiniteResults(resultDefault) || !schemaHasFiniteResults(resultDouble)) {
        engineFailures.push({
            id: schema.id,
            reason: "Non-finite result (NaN or Infinity)",
        });
    } else if (!outputsChanged && schema.outputs.length > 0) {
        engineFailures.push({
            id: schema.id,
            reason: "Inputs do not affect the formula! (Differential Test Failed)",
        });
    }
  } catch (err: any) {
    engineFailures.push({
        id: schema.id,
        reason: err.message,
    });
  }
}

// Restore original console.warn
console.warn = originalWarn;

// Run static trust audits on all unique slugs
const allSlugs = Array.from(new Set([...freeSlugs, ...premiumSlugs, ...schemas.map(s => s.id)]));
const trustAudits: any[] = [];

for (const slug of allSlugs) {
  // Check both surfaces
  const freeTrust = evaluateRuntimeTrust({ slug, locale: "en", surface: "free" });
  const premiumTrust = evaluateRuntimeTrust({ slug, locale: "en", surface: "premium" });
  
  trustAudits.push({
    slug,
    free: {
      status: freeTrust.status,
      findings: freeTrust.findings,
      formulaGateEligible: freeTrust.formulaGateEligible,
      paymentEligible: freeTrust.paymentEligible,
      calculationEligible: freeTrust.calculationEligible,
    },
    premium: {
      status: premiumTrust.status,
      findings: premiumTrust.findings,
      formulaGateEligible: premiumTrust.formulaGateEligible,
      paymentEligible: premiumTrust.paymentEligible,
      calculationEligible: premiumTrust.calculationEligible,
    }
  });
}

console.log(JSON.stringify({ engineFailures, trustAudits }, null, 2));
