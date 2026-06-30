import fs from "node:fs";
import path from "node:path";
import { applyIndustrialSchemaAutoFix } from "@/lib/features/generated-tools/industrial-schema-auto-fix";
import { evaluateSchemaTrust } from "@/lib/features/generated-tools/trust-gate";
import { SCHEMAS_DIR } from "@/lib/core/steelcore/constants";
import { normalizeSchemaMechanically } from "@/lib/core/steelcore/schema-normalizer";
import { listSchemaFiles, validateSchemaRecord } from "@/lib/core/steelcore/schema-validator";

export type SteelCoreAutoFixResult = {
  readonly slug: string;
  readonly file: string;
  readonly fixed: boolean;
  readonly beforeStatus: string;
  readonly afterStatus: string;
};

export type SteelCoreAutoFixReport = {
  readonly timestamp: string;
  readonly attempted: number;
  readonly fixed: number;
  readonly skipped: number;
  readonly results: readonly SteelCoreAutoFixResult[];
};

export function applyRuleBasedSchemaFix(schema: Record<string, unknown>, slug: string): boolean {
  let modified = false;
  modified = normalizeSchemaMechanically(schema) || modified;
  modified = applyIndustrialSchemaAutoFix(schema, slug) || modified;
  modified = normalizeSchemaMechanically(schema) || modified;
  return modified;
}

export function autoFixSchemas(options?: {
  readonly schemasDir?: string;
  readonly onlyInvalid?: boolean;
}): SteelCoreAutoFixReport {
  const schemasDir = options?.schemasDir ?? path.join(process.cwd(), SCHEMAS_DIR);
  const files = listSchemaFiles(schemasDir);
  const results: SteelCoreAutoFixResult[] = [];
  let fixed = 0;
  let skipped = 0;

  for (const file of files) {
    const filePath = path.join(schemasDir, file);
    const schema = JSON.parse(fs.readFileSync(filePath, "utf8")) as Record<string, unknown>;
    const slug =
      typeof schema.toolName === "string" && schema.toolName.trim()
        ? schema.toolName.trim()
        : file.replace(/-schema\.json$/, "");

    const before = validateSchemaRecord(schema, file);
    if (options?.onlyInvalid && before.valid) {
      skipped += 1;
      continue;
    }

    const beforeTrust = evaluateSchemaTrust(schema, slug);
    if (!applyRuleBasedSchemaFix(schema, slug)) {
      skipped += 1;
      results.push({
        slug,
        file,
        fixed: false,
        beforeStatus: beforeTrust.status,
        afterStatus: beforeTrust.status,
      });
      continue;
    }

    fs.writeFileSync(filePath, `${JSON.stringify(schema, null, 2)}\n`);
    const afterTrust = evaluateSchemaTrust(schema, slug);
    fixed += 1;
    results.push({
      slug,
      file,
      fixed: true,
      beforeStatus: beforeTrust.status,
      afterStatus: afterTrust.status,
    });
  }

  return {
    timestamp: new Date().toISOString(),
    attempted: files.length,
    fixed,
    skipped,
    results,
  };
}
