const fs = require("fs");
const path = require("path");

const schemasDir = path.join(__dirname, "../src/lib/premium-schema/schemas");
const registryFile = path.join(__dirname, "../src/lib/premium-schema/schema-registry.ts");

const files = fs.readdirSync(schemasDir).filter(f => f.endsWith(".ts"));

let imports = [];
let schemaVariables = [];
let legacySlugMap = {};

for (const file of files) {
  if (file === "index.ts") continue; // skip index if exists
  const content = fs.readFileSync(path.join(schemasDir, file), "utf8");
  const basename = file.replace(".ts", "");

  const exportMatch = content.match(/export const ([A-Z0-9_]+_SCHEMA):/);
  if (!exportMatch) continue;
  const varName = exportMatch[1];

  const legacyMatch = content.match(/legacyPaidSlug:\s*"([^"]+)"/);
  const idMatch = content.match(/id:\s*"([^"]+)"/);

  imports.push(`import { ${varName} } from "@/lib/premium-schema/schemas/${basename}";`);
  schemaVariables.push(varName);

  if (legacyMatch && idMatch) {
    legacySlugMap[legacyMatch[1]] = idMatch[1];
  }
}

const legacySlugLines = Object.entries(legacySlugMap).map(([key, val]) => `  "${key}": "${val}",`);


const fileContent = `import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

${imports.join("\n")}

export const PREMIUM_CALCULATOR_SCHEMAS: readonly PremiumCalculatorSchema[] = [
  ${schemaVariables.join(",\n  ")}
];

export const PREMIUM_SCHEMA_SLUG_MAP: Record<string, string> = {
${legacySlugLines.join("\n")}
};

export function getPremiumCalculatorSchema(id: string): PremiumCalculatorSchema | null {
  return PREMIUM_CALCULATOR_SCHEMAS.find((schema) => schema.id === id) ?? null;
}

export function getPremiumSchemaForPaidSlug(paidSlug: string): PremiumCalculatorSchema | null {
  const schemaId = PREMIUM_SCHEMA_SLUG_MAP[paidSlug];
  if (!schemaId) {
    return null;
  }
  return getPremiumCalculatorSchema(schemaId);
}

export function listPremiumSchemaIds(): readonly string[] {
  return PREMIUM_CALCULATOR_SCHEMAS.map((s) => s.id);
}
`;

fs.writeFileSync(registryFile, fileContent);
console.log(`Successfully registered ${schemaVariables.length} schemas to schema-registry.ts!`);
