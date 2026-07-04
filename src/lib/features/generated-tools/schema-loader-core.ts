import * as fs from "fs";
import * as path from "path";
import { normalizeGeneratedI18nText } from "@/lib/features/generated-tools/resolve-i18n-text";
import { normalizeRawGeneratedSchema } from "@/lib/features/generated-tools/normalize-schema";
import { validateNoTurkish, containsTurkish } from "@/lib/core/schema/schema-loader";
import type { GeneratedToolInput, GeneratedToolSchema } from "@/lib/features/generated-tools/types";

function resolveSchemasDir(): string {
  return path.join(process.cwd(), "src", "sectorcalc", "schemas", "v531");
}

const SCHEMAS_DIR = resolveSchemasDir();

function schemaPathForSlug(slug: string): string {
  if (!fs.existsSync(SCHEMAS_DIR)) {
    return "";
  }
  const files = fs.readdirSync(SCHEMAS_DIR);
  // Search for the schema file matching the slug
  const match = files.find((f) => f.includes(slug) && f.endsWith(".json"));
  if (match) {
    return path.join(SCHEMAS_DIR, match);
  }
  return "";
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
  return fs.readdirSync(SCHEMAS_DIR)
    .filter((name) => name.endsWith(".json"))
    .map((name) => path.basename(name).replace(/^\d+_sc_\d+_(?:premium_)?/, "").replace(/\.schema\.json$/, "").replace(/\.json$/, ""))
    .sort((left, right) => left.localeCompare(right));
}

export function getGeneratedToolSchema(slug: string): GeneratedToolSchema | null {
  const schemaPath = schemaPathForSlug(slug);
  if (!fs.existsSync(schemaPath)) {
    return null;
  }
  const raw = JSON.parse(fs.readFileSync(schemaPath, "utf-8")) as unknown;

  // ── Layer 1: Strict English validation ──
  validateNoTurkish(raw, slug);

  const normalized = normalizeRawGeneratedSchema(raw, slug);
  if (!normalized) {
    return null;
  }
  return normalizeGeneratedToolSchema(normalized);
}

export function generatedToolDiagramPublicPath(slug: string): string {
  // Diagrams follow same subdirectory pattern as schemas
  const firstChar = slug.charAt(0).toLowerCase();
  const subDir = /[a-z0-9]/.test(firstChar) ? firstChar : "other";
  return `/generated/schemas/${subDir}/${slug}-diagram.svg`;
}

export function generatedToolDiagramExists(slug: string): boolean {
  const firstChar = slug.charAt(0).toLowerCase();
  const subDir = /[a-z0-9]/.test(firstChar) ? firstChar : "other";
  const sourcePath = path.join(SCHEMAS_DIR, subDir, `${slug}-diagram.svg`);
  const publicPath = path.join(process.cwd(), "public", "generated", "schemas", subDir, `${slug}-diagram.svg`);
  return fs.existsSync(sourcePath) || fs.existsSync(publicPath);
}
