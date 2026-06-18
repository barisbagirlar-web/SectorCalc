import fs from "node:fs";
import path from "node:path";
import { isStubSumFormula } from "@/lib/generated-tools/validate-industrial-schema";
import type { SchemaRecord } from "./stub-formula-types";

export function isSchemaStub(record: SchemaRecord): boolean {
  const inputIds = (record.inputs ?? []).map((input) => input.id);
  const formulas = Object.values(record.formulas ?? {}).filter(
    (value) => typeof value === "string",
  ) as string[];
  if (formulas.length === 0) {
    return true;
  }
  return formulas.every((expression) => isStubSumFormula(expression, inputIds));
}

export function loadSchemaRecord(schemasDir: string, slug: string): SchemaRecord {
  const filePath = path.join(schemasDir, `${slug}-schema.json`);
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as SchemaRecord;
}

export function listStubSchemaSlugs(
  schemasDir: string,
  tier: "all" | "premium" | "free",
): string[] {
  const slugs: string[] = [];
  for (const file of fs.readdirSync(schemasDir).filter((name) => name.endsWith("-schema.json"))) {
    const record = JSON.parse(fs.readFileSync(path.join(schemasDir, file), "utf8")) as SchemaRecord;
    if (tier === "premium" && !record.premiumRequired) {
      continue;
    }
    if (tier === "free" && record.premiumRequired) {
      continue;
    }
    if (!isSchemaStub(record)) {
      continue;
    }
    slugs.push(record.toolName ?? file.replace("-schema.json", ""));
  }
  return slugs.sort();
}
