import * as fs from "fs";
import * as path from "path";
import { normalizeGeneratedI18nText } from "@/lib/generated-tools/resolve-i18n-text";
import { normalizeRawGeneratedSchema } from "@/lib/generated-tools/normalize-schema";
import type { GeneratedToolInput, GeneratedToolSchema } from "@/lib/generated-tools/types";

const SCHEMAS_DIR = path.join(process.cwd(), "generated", "schemas");

function schemaPathForSlug(slug: string): string {
  return path.join(SCHEMAS_DIR, `${slug}-schema.json`);
}

function normalizeGeneratedToolInput(input: GeneratedToolInput): GeneratedToolInput {
  const label = input.label.trim();
  const businessContext = input.businessContext.trim();

  return {
    ...input,
    label,
    businessContext,
    label_i18n: normalizeGeneratedI18nText(input.label_i18n, label),
    businessContext_i18n: normalizeGeneratedI18nText(input.businessContext_i18n, businessContext),
  };
}

function normalizeGeneratedToolSchema(schema: GeneratedToolSchema): GeneratedToolSchema {
  return {
    ...schema,
    inputs: schema.inputs.map(normalizeGeneratedToolInput),
  };
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
  const raw = JSON.parse(fs.readFileSync(schemaPath, "utf-8")) as unknown;
  const normalized = normalizeRawGeneratedSchema(raw, slug);
  if (!normalized) {
    return null;
  }
  return normalizeGeneratedToolSchema(normalized);
}

export function generatedToolDiagramPublicPath(slug: string): string {
  return `/generated/schemas/${slug}-diagram.svg`;
}

export function generatedToolDiagramExists(slug: string): boolean {
  const sourcePath = path.join(SCHEMAS_DIR, `${slug}-diagram.svg`);
  const publicPath = path.join(process.cwd(), "public", "generated", "schemas", `${slug}-diagram.svg`);
  return fs.existsSync(sourcePath) || fs.existsSync(publicPath);
}
