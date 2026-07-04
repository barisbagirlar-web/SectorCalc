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

function resolveGeneratedSchemasDir(): string {
  // Next.js standalone output (Firebase Cloud Function production)
  const standalonePath = path.join(process.cwd(), ".next", "standalone", "generated", "schemas");
  if (fs.existsSync(standalonePath)) {
    return standalonePath;
  }
  // Next.js server output (alt production bundle path)
  const serverPath = path.join(process.cwd(), ".next", "server", "generated", "schemas");
  if (fs.existsSync(serverPath)) {
    return serverPath;
  }
  // Local dev / project root
  return path.join(process.cwd(), "generated", "schemas");
}

function schemaPathForSlug(slug: string): string {
  // First check v531 directory
  if (fs.existsSync(SCHEMAS_DIR)) {
    const files = fs.readdirSync(SCHEMAS_DIR);
    const match = files.find((f) => f.includes(slug) && f.endsWith(".json"));
    if (match) {
      return path.join(SCHEMAS_DIR, match);
    }
  }

  // Fallback: check generated/schemas/{firstChar}/{slug}-schema.json
  const firstChar = slug.charAt(0).toLowerCase();
  const subDir = /[a-z0-9]/.test(firstChar) ? firstChar : "other";
  const generatedPath = path.join(resolveGeneratedSchemasDir(), subDir, `${slug}-schema.json`);
  if (fs.existsSync(generatedPath)) {
    return generatedPath;
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
  const slugs = new Set<string>();

  // Collect slugs from v531 directory
  if (fs.existsSync(SCHEMAS_DIR)) {
    for (const name of fs.readdirSync(SCHEMAS_DIR)) {
      if (!name.endsWith(".json")) continue;
      const slug = path.basename(name)
        .replace(/^\d+_sc_\d+_(?:premium_)?/, "")
        .replace(/\.schema\.json$/, "")
        .replace(/\.json$/, "");
      if (slug) slugs.add(slug);
    }
  }

  // Also collect from generated/schemas/ subdirectories for legacy free tools
  const genDir = resolveGeneratedSchemasDir();
  if (fs.existsSync(genDir)) {
    for (const subDir of fs.readdirSync(genDir)) {
      const subPath = path.join(genDir, subDir);
      if (!fs.statSync(subPath).isDirectory()) continue;
      for (const name of fs.readdirSync(subPath)) {
        if (!name.endsWith("-schema.json")) continue;
        const slug = name.replace(/-schema\.json$/, "");
        if (slug) slugs.add(slug);
      }
    }
  }

  return [...slugs].sort((left, right) => left.localeCompare(right));
}

export function getGeneratedToolSchema(slug: string): GeneratedToolSchema | null {
  const schemaPath = schemaPathForSlug(slug);
  if (!fs.existsSync(schemaPath)) {
    return null;
  }
  const raw = JSON.parse(fs.readFileSync(schemaPath, "utf-8")) as unknown;

  // ── Layer 1: Strict English validation — reject Turkish in any active/public schema ──
  // Legacy generated schemas with Turkish tokens (sonuc, insaat, etc.) must be
  // either cleaned to pure English or excluded from public resolution.
  // No warn-only bypass for active/public schemas.
  try {
    validateNoTurkish(raw, slug);
  } catch (err) {
    if (process.env.NODE_ENV !== "production") {
      console.error(`[SchemaLoader] Turkish tokens in ${slug} — schema rejected (zero-Turkish policy)`);
    }
    return null;
  }

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
