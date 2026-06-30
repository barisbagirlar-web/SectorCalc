import fs from "node:fs";
import path from "node:path";
import { evaluateSchemaTrust, type TrustGateStatus } from "@/lib/features/generated-tools/trust-gate";
import { validateIndustrialSchema } from "@/lib/features/generated-tools/validate-industrial-schema";
import { SCHEMAS_DIR } from "@/lib/core/steelcore/constants";
import { validateStructuralSchema } from "@/lib/core/steelcore/structural-validator";
import type {
  SteelCoreSchemaIssue,
  SteelCoreSchemaValidationResult,
  SteelCoreValidationReport,
} from "@/lib/core/steelcore/types";

function readSlug(schema: Record<string, unknown>, fileName: string): string {
  const toolName = schema.toolName;
  if (typeof toolName === "string" && toolName.trim()) {
    return toolName.trim();
  }
  return fileName.replace(/-schema\.json$/, "");
}

export function validateSchemaRecord(
  schema: Record<string, unknown>,
  file: string,
): SteelCoreSchemaValidationResult {
  const slug = readSlug(schema, file);
  const issues: SteelCoreSchemaIssue[] = [];

  for (const message of validateStructuralSchema(schema)) {
    issues.push({ layer: "structural", message });
  }

  const industrial = validateIndustrialSchema(schema);
  if (!industrial.valid) {
    for (const message of industrial.errors) {
      issues.push({ layer: "industrial", message });
    }
  }

  const trust = evaluateSchemaTrust(schema, slug);
  for (const message of trust.issues) {
    if (!issues.some((issue) => issue.message === message)) {
      issues.push({ layer: "trust", message });
    }
  }

  const valid =
    issues.filter((issue) => issue.layer !== "trust").length === 0 &&
    (trust.status === "PASS" || trust.status === "WARN");

  return { file, slug, valid, trustStatus: trust.status, issues };
}

function emptyStatusCounts(): Record<TrustGateStatus, number> {
  return { PASS: 0, WARN: 0, FAIL: 0, RUNTIME_FAIL: 0, QUARANTINE: 0 };
}

export function listSchemaFiles(schemasDir: string = path.join(process.cwd(), SCHEMAS_DIR)): string[] {
  if (!fs.existsSync(schemasDir)) {
    return [];
  }
  
  const dirs = fs.readdirSync(schemasDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
  
  let files: string[] = [];
  for (const dir of dirs) {
    const subFiles = fs.readdirSync(path.join(schemasDir, dir))
      .filter(f => f.endsWith("-schema.json"))
      .map(f => path.join(dir, f));
    files = files.concat(subFiles);
  }
  
  return files.sort();
}

export function validateAllSchemas(schemasDir: string = path.join(process.cwd(), SCHEMAS_DIR)): SteelCoreValidationReport {
  const files = listSchemaFiles(schemasDir);
  const results = files.map((file) => {
    const schema = JSON.parse(
      fs.readFileSync(path.join(schemasDir, file), "utf8"),
    ) as Record<string, unknown>;
    return validateSchemaRecord(schema, file);
  });

  const byStatus = emptyStatusCounts();
  for (const result of results) {
    byStatus[result.trustStatus] += 1;
  }

  const valid = results.filter((result) => result.valid).length;
  return {
    timestamp: new Date().toISOString(),
    total: results.length,
    valid,
    invalid: results.length - valid,
    byStatus,
    results,
  };
}
