import { TOP_CRITICAL_FORMULA_CONTRACTS } from "../src/lib/features/formula-governance/contracts/top-critical";
import { BATCH_EXPANSION_CRITICAL_FORMULA_CONTRACTS } from "../src/lib/features/formula-governance/contracts/batch-expansion-critical";
import { BATCH_TRAFFIC_CATALOG_CRITICAL_FORMULA_CONTRACTS } from "../src/lib/features/formula-governance/contracts/batch-traffic-catalog-critical";
import { BATCH_PREMIUM_SCHEMA_CRITICAL_FORMULA_CONTRACTS } from "../src/lib/features/formula-governance/contracts/batch-premium-schema-critical";
import { PREMIUM_SCHEMA_EXTENDED_CRITICAL_FORMULA_CONTRACTS } from "../src/lib/features/formula-governance/contracts/premium-schema-extended-critical";
import { ENGINE_MODULES_CRITICAL_FORMULA_CONTRACTS } from "../src/lib/features/formula-governance/contracts/engine-modules-critical";

const allContracts = [
  ...TOP_CRITICAL_FORMULA_CONTRACTS,
  ...BATCH_EXPANSION_CRITICAL_FORMULA_CONTRACTS,
  ...BATCH_TRAFFIC_CATALOG_CRITICAL_FORMULA_CONTRACTS,
  ...BATCH_PREMIUM_SCHEMA_CRITICAL_FORMULA_CONTRACTS,
  ...PREMIUM_SCHEMA_EXTENDED_CRITICAL_FORMULA_CONTRACTS,
  ...ENGINE_MODULES_CRITICAL_FORMULA_CONTRACTS,
];

// In this architecture, what indicates if a tool is free vs pro? Usually the metadata tier or the schema.
// Let's just grab 10 from TOP_CRITICAL (likely pro) and 10 from BATCH_TRAFFIC (likely free), or randomly.
// Since the prompt asks to manually check, I will just dump 5 of each for now, then 5 more to complete 10 each, and run them through FormulaRegistry.

console.log(`Total contracts found: ${allContracts.length}`);

const sampleContracts = allContracts.slice(0, 5); // Just checking structure for now
console.log(JSON.stringify(sampleContracts.map(c => ({ id: c.metadata.id, inputs: c.inputs.map(i => i.id) })), null, 2));

