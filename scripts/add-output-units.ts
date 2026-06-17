import fs from "node:fs";
import path from "node:path";
import {
  inferUnitFromOutputKey,
} from "../src/lib/generated-tools/resolve-output-unit";

const SCHEMAS_DIR = path.join(process.cwd(), "generated/schemas");
const GENERIC_INPUT_UNITS = new Set(["unit", "units", "dimensionless", "—", "-"]);

type SchemaInput = { unit?: string };
type SchemaRecord = {
  inputs?: SchemaInput[];
  outputs?: {
    primary?: string;
    unit?: string;
    breakdown?: unknown;
    breakdownUnits?: Record<string, string>;
  };
};

function isMeaningfulUnit(unit: string | undefined): boolean {
  const trimmed = unit?.trim();
  return Boolean(trimmed && !GENERIC_INPUT_UNITS.has(trimmed.toLowerCase()));
}

function resolveInputUnit(inputs: SchemaInput[] | undefined): string {
  const unit = inputs?.find((input) => isMeaningfulUnit(input.unit))?.unit;
  return unit?.trim() ?? "—";
}

function normalizeBreakdownKeys(breakdown: unknown): string[] {
  if (Array.isArray(breakdown)) {
    return breakdown.filter((entry): entry is string => typeof entry === "string" && entry.trim().length > 0);
  }
  if (breakdown && typeof breakdown === "object") {
    return Object.keys(breakdown as Record<string, unknown>);
  }
  return [];
}

function resolvePrimaryUnit(schema: SchemaRecord): string {
  const outputs = schema.outputs ?? {};
  if (isMeaningfulUnit(outputs.unit)) {
    return outputs.unit!.trim();
  }

  const primary = typeof outputs.primary === "string" ? outputs.primary.trim() : "";
  const fromKey = primary ? inferUnitFromOutputKey(primary) : undefined;
  if (fromKey) {
    return fromKey;
  }

  return resolveInputUnit(schema.inputs);
}

function resolveBreakdownUnits(schema: SchemaRecord): Record<string, string> {
  const outputs = schema.outputs ?? {};
  const keys = normalizeBreakdownKeys(outputs.breakdown);
  const units: Record<string, string> = { ...(outputs.breakdownUnits ?? {}) };

  for (const key of keys) {
    if (isMeaningfulUnit(units[key])) {
      continue;
    }
    const inferred = inferUnitFromOutputKey(key);
    if (inferred) {
      units[key] = inferred;
    }
  }

  return units;
}

function main(): void {
  const files = fs.readdirSync(SCHEMAS_DIR).filter((file) => file.endsWith(".json"));
  let updated = 0;

  for (const file of files) {
    const filePath = path.join(SCHEMAS_DIR, file);
    const schema = JSON.parse(fs.readFileSync(filePath, "utf-8")) as SchemaRecord;

    if (!schema.outputs || typeof schema.outputs !== "object") {
      schema.outputs = { primary: "result", unit: "—" };
    }

    const nextUnit = resolvePrimaryUnit(schema);
    const nextBreakdownUnits = resolveBreakdownUnits(schema);
    const hadUnit = isMeaningfulUnit(schema.outputs.unit);
    const hadBreakdownUnits =
      schema.outputs.breakdownUnits && Object.keys(schema.outputs.breakdownUnits).length > 0;

    schema.outputs.unit = nextUnit;

    if (Object.keys(nextBreakdownUnits).length > 0) {
      schema.outputs.breakdownUnits = nextBreakdownUnits;
    }

    if (!hadUnit || !hadBreakdownUnits || schema.outputs.unit !== nextUnit) {
      fs.writeFileSync(filePath, `${JSON.stringify(schema, null, 2)}\n`);
      updated += 1;
      console.log(`updated ${file}: unit = ${schema.outputs.unit}`);
    }
  }

  console.log(`Done. Updated ${updated} of ${files.length} schema files.`);
}

main();
