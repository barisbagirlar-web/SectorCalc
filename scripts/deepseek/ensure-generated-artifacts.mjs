#!/usr/bin/env node
/**
 * Regenerates generated/*.ts and calculator-registry when schema JSON exists locally.
 * Safe no-op on clean CI clones without generated/schemas content.
 */
import * as fs from "node:fs";
import * as path from "node:path";
import { execSync } from "node:child_process";

const root = process.cwd();
const schemasDir = path.join(root, "generated", "schemas");
const generatedToolsDir = path.join(root, "generated", "tools");
const registryPath = path.join(root, "src/lib/calculator-registry.ts");

function hasSchemaFiles() {
  if (!fs.existsSync(schemasDir)) {
    return false;
  }
  return fs.readdirSync(schemasDir).some((name) => name.endsWith("-schema.json"));
}

function allSchemasHaveGeneratedTools() {
  if (!fs.existsSync(schemasDir) || !fs.existsSync(generatedToolsDir)) {
    return false;
  }
  const schemas = fs.readdirSync(schemasDir).filter((name) => name.endsWith("-schema.json"));
  if (schemas.length === 0) return false;
  const tools = new Set(fs.readdirSync(generatedToolsDir).filter((name) => name.endsWith(".ts")));
  return schemas.every((schema) => {
    const toolName = schema.replace("-schema.json", ".ts");
    return tools.has(toolName);
  });
}

function cleanupGeneratedArtifacts() {
  const generatedDir = path.join(root, "generated");
  if (!fs.existsSync(generatedDir)) return;
  for (const name of fs.readdirSync(generatedDir)) {
    if (name.endsWith(".log") || name.endsWith(".pid")) {
      fs.unlinkSync(path.join(generatedDir, name));
    }
  }
}

function artifactsReady() {
  return allSchemasHaveGeneratedTools() && fs.existsSync(registryPath);
}

function shouldSkipGenerateAll() {
  const flag = process.env.SECTORCALC_SKIP_GENERATE_ALL;
  if (flag === "0") return false;
  if (!artifactsReady()) return false;
  return true;
}

function main() {
  cleanupGeneratedArtifacts();
  if (!hasSchemaFiles()) {
    console.log("ensure-generated-artifacts: no schema JSON files — skipping generate:all");
    return;
  }

  if (shouldSkipGenerateAll()) {
    console.log(
      `ensure-generated-artifacts: up to date — skipping generate:all`,
    );
    return;
  }

  if (process.env.SECTORCALC_SKIP_GENERATE_ALL === "1") {
    console.warn(
      "ensure-generated-artifacts: skip requested but artifacts incomplete — running generate:all (local only)",
    );
  }

  console.log("ensure-generated-artifacts: regenerating tools from schemas");
  execSync("npm run assign:schema-categories", { stdio: "inherit", cwd: root });
  execSync("npm run generate:all", { stdio: "inherit", cwd: root });
  execSync("npm run generate:registry", { stdio: "inherit", cwd: root });
}

main();
