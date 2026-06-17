#!/usr/bin/env node
/**
 * Vercel / CI build gate — ensures clean-slate clones have required dirs
 * before test:generated and next build (generated/ is gitignored).
 */
import * as fs from "node:fs";
import * as path from "node:path";

const root = process.cwd();
const generatedDir = path.join(root, "generated");
const schemasDir = path.join(generatedDir, "schemas");
const publicDiagramsDir = path.join(root, "public", "generated", "schemas");

/** Regex dotAll (`s`) requires ES2018+ and breaks Next typecheck on older targets. */
const FORBIDDEN_DOTALL_FLAG = /\$\/is[,\s)]|\/is[,\s)]/;

function walkTsFiles(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkTsFiles(full, files);
    } else if (entry.name.endsWith(".ts")) {
      files.push(full);
    }
  }
  return files;
}

function assertTsconfigTarget() {
  const tsconfigPath = path.join(root, "tsconfig.json");
  const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, "utf8"));
  const target = String(tsconfig.compilerOptions?.target ?? "ES5");
  const year = Number.parseInt(target.replace(/\D/g, ""), 10);
  if (!Number.isFinite(year) || year < 2018) {
    console.error(
      `ensure-build-prereqs: tsconfig target must be ES2018+ for regex/lookbehind (got ${target})`,
    );
    process.exit(1);
  }
}

function assertNoDotAllRegexFlags() {
  const toolsDir = path.join(root, "src/lib/generated-tools");
  if (!fs.existsSync(toolsDir)) {
    return;
  }
  for (const file of walkTsFiles(toolsDir)) {
    const text = fs.readFileSync(file, "utf8");
    if (FORBIDDEN_DOTALL_FLAG.test(text)) {
      console.error(`ensure-build-prereqs: forbidden regex /is flag in ${file}`);
      process.exit(1);
    }
  }
}

/** Drop orphan `{slug}-schema.json` when `{slug}-calculator-schema.json` already exists. */
function removeDuplicateBareSchemas() {
  if (!fs.existsSync(schemasDir)) {
    return;
  }

  const schemaNames = new Set(fs.readdirSync(schemasDir).filter((name) => name.endsWith("-schema.json")));
  let removed = 0;

  for (const name of schemaNames) {
    const slug = name.replace(/-schema\.json$/, "");
    if (slug.endsWith("-calculator")) {
      continue;
    }

    const calculatorSchema = `${slug}-calculator-schema.json`;
    if (!schemaNames.has(calculatorSchema)) {
      continue;
    }

    fs.unlinkSync(path.join(schemasDir, name));
    removed += 1;
    console.warn(
      `ensure-build-prereqs: removed duplicate bare schema ${name} (${calculatorSchema} is canonical)`,
    );
  }

  if (removed > 0) {
    console.log(`ensure-build-prereqs: cleaned ${removed} duplicate bare schema(s)`);
  }
}

for (const dir of [generatedDir, schemasDir, publicDiagramsDir]) {
  fs.mkdirSync(dir, { recursive: true });
}

assertTsconfigTarget();
assertNoDotAllRegexFlags();
removeDuplicateBareSchemas();

console.log("ensure-build-prereqs: generated/schemas + public/generated/schemas ready");
