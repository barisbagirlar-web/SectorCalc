import { getAllPremiumSchemas } from "../src/lib/features/premium-schema/schema-registry";
const schemas = getAllPremiumSchemas();
let totalInputs = 0;
for (const schema of schemas) totalInputs += schema.inputs.length;
console.log("Total schema inputs:", totalInputs);
