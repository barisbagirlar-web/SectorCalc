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

function main() {
  cleanupGeneratedArtifacts();
  if (!hasSchemaFiles()) {
    console.log("ensure-generated-artifacts: no schema JSON files — skipping generate:all");
    return;
  }

  console.log("ensure-generated-artifacts: regenerating tools from schemas");
  execSync("npm run assign:schema-categories", { stdio: "inherit", cwd: root });
  execSync("npm run generate:all", { stdio: "inherit", cwd: root });
  execSync("npm run generate:registry", { stdio: "inherit", cwd: root });
}

main();
