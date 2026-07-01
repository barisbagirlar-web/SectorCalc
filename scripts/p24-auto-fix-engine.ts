#!/usr/bin/env npx tsx
import fs from "node:fs";
import path from "node:path";
import { applyIndustrialSchemaAutoFix } from "../src/lib/generated-tools/industrial-schema-auto-fix";
import { evaluateSchemaTrust } from "../src/lib/generated-tools/trust-gate";

const SCHEMAS_DIR = path.join(process.cwd(), "generated/schemas");
const AUDIT_FILE = path.join(process.cwd(), "p24-audit-report.json");

function main(): void {
  if (!fs.existsSync(AUDIT_FILE)) {
    console.error("❌ Run scripts/p24-audit-engine.ts first.");
    process.exit(1);
  }

  const audit = JSON.parse(fs.readFileSync(AUDIT_FILE, "utf8")) as Array<{
    slug: string;
    status: string;
  }>;
  const toFix = audit.filter((item) => item.status !== "PASS");
  let fixed = 0;
  let skipped = 0;

  for (const item of toFix) {
    const filePath = path.join(SCHEMAS_DIR, `${item.slug}-schema.json`);
    if (!fs.existsSync(filePath)) {
      skipped += 1;
      continue;
    }

    const schema = JSON.parse(fs.readFileSync(filePath, "utf8")) as Record<string, unknown>;
    const modified = applyIndustrialSchemaAutoFix(schema, item.slug);

    if (modified) {
      fs.writeFileSync(filePath, `${JSON.stringify(schema, null, 2)}\n`);
      const after = evaluateSchemaTrust(schema, item.slug);
      fixed += 1;
      console.log(`✅ Fixed: ${item.slug} (${item.status} → ${after.status})`);
    }
  }

  console.log(`\n🎉 Total ${fixed} schemas fixed.`);
  if (skipped > 0) {
    console.log(`   Skipped (missing file): ${skipped}`);
  }
}

main();
