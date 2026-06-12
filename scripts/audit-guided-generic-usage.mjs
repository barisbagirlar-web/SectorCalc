#!/usr/bin/env node
import { execSync } from "node:child_process";
import { writeFileSync, unlinkSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");
const probeScript = join(ROOT, "scripts/.guided-generic-usage.ts");

const probeSource = `import catalog from "../src/lib/tools/free-traffic-catalog.generated.json";
import { resolveReferenceGraphic } from "../src/lib/guidance/reference-graphic-resolver";
import { TOOLS_THAT_MUST_NOT_BE_GENERIC } from "../src/lib/guidance/reference-graphic-taxonomy";

let genericCount = 0;
const failures: string[] = [];

for (const tool of catalog) {
  const resolved = resolveReferenceGraphic({
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
  if (resolved.template === "generic") {
    genericCount += 1;
  }
  if (TOOLS_THAT_MUST_NOT_BE_GENERIC.includes(tool.slug) && resolved.template === "generic") {
    failures.push(\`\${tool.slug} must not resolve to generic\`);
  }
}

if (failures.length) {
  console.error(failures.join("\\n"));
  process.exit(1);
}
console.log("GENERIC:" + genericCount);
`;

writeFileSync(probeScript, probeSource, "utf8");
try {
  execSync(`npx tsx "${probeScript}"`, { cwd: ROOT, encoding: "utf8", stdio: "inherit" });
} finally {
  try {
    unlinkSync(probeScript);
  } catch {
    // ignore
  }
}
