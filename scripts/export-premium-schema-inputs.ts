/**
 * JSON export of premium schema input labels for i18n generators.
 * stdout only — no secrets.
 */
import { PREMIUM_CALCULATOR_SCHEMAS } from "../src/lib/premium-schema/schema-registry";

const payload = PREMIUM_CALCULATOR_SCHEMAS.map((schema) => ({
  slug: schema.id,
  inputs: schema.inputs.map((input) => ({
    key: input.id,
    label: input.label,
    helper: input.helper ?? "",
  })),
}));

process.stdout.write(JSON.stringify(payload));
