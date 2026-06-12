#!/usr/bin/env node
import { execSync } from "node:child_process";
import { writeFileSync, unlinkSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");
const probeScript = join(ROOT, "scripts/.guided-resolver-probe.ts");
const probeSource = `import catalog from "../src/lib/tools/free-traffic-catalog.generated.json";
import { resolveReferenceGraphic } from "../src/lib/guidance/reference-graphic-resolver";

let unresolved = 0;
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
  if (!resolved.template) unresolved += 1;
}
if (unresolved > 0) {
  console.error("UNRESOLVED:" + unresolved);
  process.exit(1);
}
console.log("OK:" + catalog.length);
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
