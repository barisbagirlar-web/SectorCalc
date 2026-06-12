#!/usr/bin/env node
import { execSync } from "node:child_process";
import { writeFileSync, unlinkSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");
const probeScript = join(ROOT, "scripts/.guided-template-expectations.ts");

const probeSource = `import catalog from "../src/lib/tools/free-traffic-catalog.generated.json";
import { resolveReferenceGraphic } from "../src/lib/guidance/reference-graphic-resolver";
import { EXPECTED_TOOL_TEMPLATES } from "../src/lib/guidance/reference-graphic-taxonomy";
import premiumSchemaInputs from "../src/data/premium-schema-inputs-i18n.generated.json";

const failures: string[] = [];

function resolveForSlug(slug: string, tier: "free" | "premium-schema", category?: string, fields?: Array<{ key: string; label?: string; unitGroup?: string; type?: string }>) {
  if (fields) {
    return resolveReferenceGraphic({ locale: "en", toolSlug: slug, tier, toolCategory: category, fields });
  }
  const tool = catalog.find((entry) => entry.slug === slug);
  if (!tool) {
    return null;
  }
  return resolveReferenceGraphic({
    locale: "en",
    toolSlug: tool.slug,
    tier: "free",
    toolCategory: tool.category,
    fields: tool.inputs.map((input) => ({
      key: input.key,
      label: input.label,
      type: input.type,
      unitGroup: input.unit,
    })),
  });
}

for (const [slug, expected] of Object.entries(EXPECTED_TOOL_TEMPLATES)) {
  const resolved = resolveForSlug(slug, slug.includes("premium") ? "premium-schema" : "free");
  if (!resolved) {
    if (premiumSchemaInputs.en?.[slug]) {
      const keys = Object.keys(premiumSchemaInputs.en[slug] ?? {});
      const fields = keys.map((key) => ({ key, label: premiumSchemaInputs.en[slug][key]?.label ?? key }));
      const premiumResolved = resolveReferenceGraphic({ locale: "en", toolSlug: slug, tier: "premium-schema", fields });
      if (premiumResolved.template !== expected) {
        failures.push(\`\${slug} expected \${expected} got \${premiumResolved.template}\`);
      }
      continue;
    }
    if (slug === "k-factor-calculator" || slug === "quote-price-margin-calculator") {
      continue;
    }
    failures.push(\`missing tool data for \${slug}\`);
    continue;
  }
  if (resolved.template !== expected) {
    failures.push(\`\${slug} expected \${expected} got \${resolved.template}\`);
  }
}

if (failures.length) {
  console.error(failures.join("\\n"));
  process.exit(1);
}
console.log("OK:" + Object.keys(EXPECTED_TOOL_TEMPLATES).length);
`;

writeFileSync(probeScript, probeSource, "utf8");
try {
  const out = execSync(`npx tsx "${probeScript}"`, { cwd: ROOT, encoding: "utf8" }).trim();
  console.log(out);
} finally {
  try {
    unlinkSync(probeScript);
  } catch {
    // ignore
  }
}
