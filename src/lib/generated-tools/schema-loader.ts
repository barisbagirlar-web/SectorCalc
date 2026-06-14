import * as fs from "node:fs";
import * as path from "node:path";
import type { GeneratedToolSchema } from "@/lib/generated-tools/types";

const SCHEMAS_DIR = path.join(process.cwd(), "generated", "schemas");

function schemaPathForSlug(slug: string): string {
  return path.join(SCHEMAS_DIR, `${slug}-schema.json`);
}

export function listGeneratedToolSchemaSlugs(): string[] {
  if (!fs.existsSync(SCHEMAS_DIR)) {
    return [];
  }
  return fs
    .readdirSync(SCHEMAS_DIR)
    .filter((name) => name.endsWith("-schema.json"))
    .map((name) => name.replace(/-schema\.json$/, ""))
    .sort((left, right) => left.localeCompare(right));
}

export function getGeneratedToolSchema(slug: string): GeneratedToolSchema | null {
  const schemaPath = schemaPathForSlug(slug);
  if (!fs.existsSync(schemaPath)) {
    return null;
  }
  const raw = fs.readFileSync(schemaPath, "utf-8");
  return JSON.parse(raw) as GeneratedToolSchema;
}

export function generatedToolDiagramPublicPath(slug: string): string {
  return `/generated/schemas/${slug}-diagram.svg`;
}

export function generatedToolDiagramExists(slug: string): boolean {
  const sourcePath = path.join(SCHEMAS_DIR, `${slug}-diagram.svg`);
  const publicPath = path.join(process.cwd(), "public", "generated", "schemas", `${slug}-diagram.svg`);
  return fs.existsSync(sourcePath) || fs.existsSync(publicPath);
}
