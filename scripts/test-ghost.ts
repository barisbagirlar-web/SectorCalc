import { getAllPremiumSchemas } from "../src/lib/features/premium-schema/schema-registry";
const schemas = getAllPremiumSchemas();
const schema = schemas.find(s => s.id === "cnc-machining-cost-analyzer");
console.log("inputs:", schema.inputs.map(i => i.id));
console.log("pipeline inputMap keys:", schema.formulaPipeline.map(p => Object.values(p.inputMap)));
