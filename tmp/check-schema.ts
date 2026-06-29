import { getPremiumSchemaForPaidSlug } from "../src/lib/premium-schema/schema-registry";

const slug = process.argv[2] || "change-order-impact-analyzer";
const schema = getPremiumSchemaForPaidSlug(slug);
console.log(`Schema: ${!!schema}, inputs: ${schema?.inputs?.length ?? 0}`);
if (schema && schema.inputs.length > 0) {
  console.log(`First input: ${schema.inputs[0].id} - ${schema.inputs[0].label}`);
}
