#!/usr/bin/env node
/**
 * Shared parity checks for generated schemas, tool files, and calculator registry.
 */
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const GENERATED_DIR = join(ROOT, "generated");
const SCHEMAS_DIR = join(GENERATED_DIR, "schemas");
const REGISTRY_FILE = join(ROOT, "src/lib/generated-tools/calculator-registry.ts");

export function listSchemaSlugs() {
  if (!existsSync(SCHEMAS_DIR)) {
    return [];
  }
  return readdirSync(SCHEMAS_DIR)
    .filter((name) => name.endsWith("-schema.json"))
    .map((name) => name.replace(/-schema\.json$/, ""))
    .sort((left, right) => left.localeCompare(right));
}

export function countGeneratedTools() {
  if (!existsSync(GENERATED_DIR)) {
    return 0;
  }
  return readdirSync(GENERATED_DIR).filter((name) => name.endsWith(".ts") && name !== "index.ts").length;
}

export function countRegistryLoaders() {
  if (!existsSync(REGISTRY_FILE)) {
    return 0;
  }
  const registryText = readFileSync(REGISTRY_FILE, "utf8");
  return (registryText.match(/: createLoader\(/g) ?? []).length;
}

export function allSchemasHaveGeneratedTools() {
  const slugs = listSchemaSlugs();
  if (slugs.length === 0) {
    return false;
  }
  return slugs.every((slug) => existsSync(join(GENERATED_DIR, `${slug}.ts`)));
}

export function registryParityOk() {
  const toolCount = countGeneratedTools();
  const loaderCount = countRegistryLoaders();
  if (toolCount === 0) {
    return loaderCount === 0;
  }
  return loaderCount === toolCount;
}

export function describeGeneratedArtifactState() {
  const schemaCount = listSchemaSlugs().length;
  const toolCount = countGeneratedTools();
  const loaderCount = countRegistryLoaders();
  return { schemaCount, toolCount, loaderCount };
}
