#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import {
  APPLIED_DIR,
  ROOT,
  STAGING_DIR,
  appliedManifestPath,
  draftPath,
  stagingPath,
} from "./lib/activation-paths.mjs";

const allowedReferenceSlug = process.env.TOOL_ACTIVATION_REFERENCE_SLUG || null;

function usage() {
  console.error("Usage: node scripts/tool-activation/apply-activation-draft.mjs --slug <tool-slug>");
  process.exit(1);
}

function parseArgs(argv) {
  const slugIndex = argv.indexOf("--slug");
  if (slugIndex === -1 || !argv[slugIndex + 1]) {
    usage();
  }

  return argv[slugIndex + 1];
}

function assertReferenceLock(slug) {
  if (!allowedReferenceSlug) {
    throw new Error("TOOL_ACTIVATION_REFERENCE_SLUG is required for first activation apply.");
  }

  if (slug !== allowedReferenceSlug) {
    throw new Error(`Apply is locked to reference tool only: ${allowedReferenceSlug}`);
  }
}

function runDraftGateChecks(draftFile) {
  execFileSync(
    "npx",
    ["tsx", "scripts/tool-activation/check-draft-gates.ts", draftFile],
    { cwd: ROOT, stdio: "inherit" },
  );
}

function main() {
  const slug = parseArgs(process.argv.slice(2));
  assertReferenceLock(slug);

  const draftFile = draftPath(slug);
  if (!fs.existsSync(draftFile)) {
    throw new Error(`Draft not found: ${draftFile}`);
  }

  const draft = JSON.parse(fs.readFileSync(draftFile, "utf8"));
  runDraftGateChecks(draftFile);

  fs.mkdirSync(APPLIED_DIR, { recursive: true });
  fs.mkdirSync(STAGING_DIR, { recursive: true });

  const stagingFile = stagingPath(slug);
  const appliedOperations = [
    "validated reference slug lock",
    "validated formulaAction preserve-existing policy",
    "validated unit consistency MVP checks",
    "validated test case minimum for risk level",
    "staged metadata/tests/validation only",
  ];

  if (draft.metadata) {
    appliedOperations.push("staged metadata");
  }
  if (draft.testCases?.length) {
    appliedOperations.push("staged testCases");
  }
  if (draft.validationNotes?.length) {
    appliedOperations.push("staged validationNotes");
  }

  fs.writeFileSync(
    stagingFile,
    `${JSON.stringify(
      {
        slug,
        formulaAction: draft.formulaAction,
        metadata: draft.metadata ?? {},
        testCases: draft.testCases ?? [],
        validationNotes: draft.validationNotes ?? [],
        formulaExpression: null,
      },
      null,
      2,
    )}\n`,
    "utf8",
  );

  const manifest = {
    slug,
    appliedAt: new Date().toISOString(),
    referenceSlugLock: allowedReferenceSlug,
    formulaAction: draft.formulaAction,
    formulaPreserved: draft.formulaAction === "preserve-existing",
    productionSourceModified: false,
    stagingPath: path.relative(ROOT, stagingFile),
    appliedOperations,
  };

  fs.writeFileSync(appliedManifestPath(slug), `${JSON.stringify(manifest, null, 2)}\n`, "utf8");

  console.log(`Activation draft validated and staged for ${slug}.`);
  console.log(`Production source was not modified (first-lock policy).`);
  console.log(`Manifest: ${appliedManifestPath(slug)}`);
}

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
