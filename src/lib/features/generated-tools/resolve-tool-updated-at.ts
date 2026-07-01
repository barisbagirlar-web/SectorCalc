import * as fs from "node:fs";
import * as path from "node:path";
import { parseToolIsoDateOnly } from "@/lib/features/generated-tools/format-tool-last-updated-date";
import { STANDARD_CALCULATOR_OVERRIDES } from "@/lib/features/generated-tools/standard-calculator-overrides";
import type { GeneratedToolSchema } from "@/lib/features/generated-tools/types";

function resolveSchemasDir(): string {
  const candidates = [
    path.join(process.cwd(), "generated", "schemas"),
    path.join(process.cwd(), ".next", "server", "generated", "schemas"),
    path.join(process.cwd(), ".next", "standalone", "generated", "schemas"),
  ];
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }
  return candidates[0];
}

const SCHEMAS_DIR = resolveSchemasDir();
const GENERATED_DIR = path.join(process.cwd(), "generated");
const STANDARD_OVERRIDES_PATH = path.join(
  process.cwd(),
  "src/lib/features/generated-tools/standard-calculator-overrides.ts",
);

function readLatestMtimeIso(paths: readonly string[]): string | null {
  let latest: Date | null = null;

  for (const filePath of paths) {
    if (!fs.existsSync(filePath)) {
      continue;
    }
    const mtime = fs.statSync(filePath).mtime;
    if (!latest || mtime > latest) {
      latest = mtime;
    }
  }

  if (!latest) {
    return null;
  }

  return latest.toISOString().slice(0, 10);
}

function buildTrackedPaths(slug: string): string[] {
  const paths = [
    path.join(SCHEMAS_DIR, `${slug}-schema.json`),
    path.join(GENERATED_DIR, `${slug}.ts`),
  ];

  if (Object.prototype.hasOwnProperty.call(STANDARD_CALCULATOR_OVERRIDES, slug)) {
    paths.push(STANDARD_OVERRIDES_PATH);
  }

  return paths;
}

/** ISO date (YYYY-MM-DD) for when this tool's schema/calculator last changed. */
export function getGeneratedToolLastUpdatedIso(
  slug: string,
  schema?: GeneratedToolSchema | null,
): string | null {
  const explicit = parseToolIsoDateOnly(schema?.lastUpdated);
  if (explicit) {
    return explicit;
  }

  return readLatestMtimeIso(buildTrackedPaths(slug));
}
