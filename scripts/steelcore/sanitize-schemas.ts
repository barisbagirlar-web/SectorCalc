#!/usr/bin/env npx tsx
import fs from "node:fs";
import path from "node:path";
import {
  applyRuleBasedSchemaFix,
  listSchemaFiles,
  SCHEMAS_DIR,
  validateAllSchemas,
} from "@/lib/steelcore";

function main(): void {
  const files = listSchemaFiles(SCHEMAS_DIR);
  let sanitized = 0;

  for (const file of files) {
    const filePath = path.join(SCHEMAS_DIR, file);
    const schema = JSON.parse(fs.readFileSync(filePath, "utf8")) as Record<string, unknown>;
    const slug =
      typeof schema.toolName === "string" && schema.toolName.trim()
        ? schema.toolName.trim()
        : file.replace(/-schema\.json$/, "");

    const modified = applyRuleBasedSchemaFix(schema, slug);
    if (!modified) {
      continue;
    }

    fs.writeFileSync(filePath, `${JSON.stringify(schema, null, 2)}\n`);
    sanitized += 1;
  }

  const report = validateAllSchemas();
  console.log(`SteelCore sanitize: ${sanitized} schemas rewritten`);
  console.log(`Validation: ${report.valid}/${report.total} valid (${report.invalid} invalid)`);
}

main();
