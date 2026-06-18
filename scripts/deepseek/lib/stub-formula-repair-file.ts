import fs from "node:fs";
import path from "node:path";
import { inferArchetypePatch } from "./formula-archetype-engine";
import { isSchemaStub, loadSchemaRecord } from "./stub-schema-scan";
import { validateRepairPatch } from "./stub-formula-validate";
import type { RepairPatch, SchemaRecord } from "./stub-formula-types";

export type StubRepairMethod = "archetype" | "skipped" | "failed";

export function mergeRepairPatch(schema: SchemaRecord, patch: RepairPatch): SchemaRecord {
  return {
    ...schema,
    formulas: patch.formulas,
    outputs: { ...(schema.outputs as object), ...patch.outputs },
  };
}

/** Apply archetype repair to a schema file when it is still a stub sum. */
export function repairStubSchemaFile(schemaPath: string): StubRepairMethod {
  const slug = path.basename(schemaPath, "-schema.json");
  const schemasDir = path.dirname(schemaPath);
  const schema = loadSchemaRecord(schemasDir, slug);
  if (!isSchemaStub(schema)) {
    return "skipped";
  }

  const patch = inferArchetypePatch(schema);
  const error = validateRepairPatch(schema, patch);
  if (error) {
    return "failed";
  }

  const nextSchema = mergeRepairPatch(schema, patch);
  fs.writeFileSync(schemaPath, `${JSON.stringify(nextSchema, null, 2)}\n`);
  return "archetype";
}

/** Preserve calculation fields from disk when another batch job holds stale in-memory schemas. */
export function mergeCalculationFieldsFromDisk(
  inMemory: SchemaRecord,
  filePath: string,
): SchemaRecord {
  if (!fs.existsSync(filePath)) {
    return inMemory;
  }
  const disk = JSON.parse(fs.readFileSync(filePath, "utf8")) as SchemaRecord;
  return {
    ...inMemory,
    formulas: disk.formulas ?? inMemory.formulas,
    outputs: disk.outputs ?? inMemory.outputs,
  };
}
