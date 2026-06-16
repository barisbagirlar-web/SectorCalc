#!/usr/bin/env node
/**
 * Regenerates generated/*.ts and calculator-registry when schema JSON exists locally.
 * Safe no-op on clean CI clones without generated/schemas content.
 *
 * Env:
 * - SECTORCALC_SKIP_GENERATE_ALL=1 — skip when artifacts already complete (fail if not)
 * - SECTORCALC_SKIP_GENERATE_ALL=0 — always regenerate
 * - unset — auto-skip when every schema has a .ts file and registry parity holds
 */
import * as fs from "node:fs";
import * as path from "node:path";
import { execSync } from "node:child_process";
import {
  allSchemasHaveGeneratedTools,
  describeGeneratedArtifactState,
  registryParityOk,
} from "../vercel/generated-artifact-parity.mjs";

const root = process.cwd();
const schemasDir = path.join(root, "generated", "schemas");

function hasSchemaFiles() {
  if (!fs.existsSync(schemasDir)) {
    return false;
  }
  return fs.readdirSync(schemasDir).some((name) => name.endsWith("-schema.json"));
}

function cleanupGeneratedArtifacts() {
  const generatedDir = path.join(root, "generated");
  if (!fs.existsSync(generatedDir)) {
    return;
  }
  for (const name of fs.readdirSync(generatedDir)) {
    if (name.endsWith(".log") || name.endsWith(".pid")) {
      fs.unlinkSync(path.join(generatedDir, name));
    }
  }
}

function artifactsReady() {
  return allSchemasHaveGeneratedTools() && registryParityOk();
}

function shouldSkipGenerateAll() {
  const flag = process.env.SECTORCALC_SKIP_GENERATE_ALL;
  if (flag === "0") {
    return false;
  }
  if (flag === "1") {
    return true;
  }
  return artifactsReady();
}

function assertSkipAllowed() {
  if (!artifactsReady()) {
    const state = describeGeneratedArtifactState();
    console.error(
      `ensure-generated-artifacts: skip requested but artifacts incomplete — ${state.loaderCount} loaders, ${state.toolCount} tools, ${state.schemaCount} schemas`,
    );
    process.exit(1);
  }
}

function main() {
  cleanupGeneratedArtifacts();
  if (!hasSchemaFiles()) {
    console.log("ensure-generated-artifacts: no schema JSON files — skipping generate:all");
    return;
  }

  if (shouldSkipGenerateAll()) {
    if (process.env.SECTORCALC_SKIP_GENERATE_ALL === "1") {
      assertSkipAllowed();
    }
    const state = describeGeneratedArtifactState();
    console.log(
      `ensure-generated-artifacts: up to date — skipping generate:all (${state.toolCount} tools, ${state.schemaCount} schemas)`,
    );
    return;
  }

  console.log("ensure-generated-artifacts: regenerating tools from schemas");
  execSync("npm run assign:schema-categories", { stdio: "inherit", cwd: root });
  execSync("npm run generate:all", { stdio: "inherit", cwd: root });
  execSync("npm run generate:registry", { stdio: "inherit", cwd: root });
}

main();
