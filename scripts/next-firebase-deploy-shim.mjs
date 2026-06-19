#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const BUILD_ID_PATH = join(ROOT, ".next/BUILD_ID");
const args = process.argv.slice(2);

// Detect recursive invocation: if SECTORCALC_SHIM_REAL_NEXT is set, forward directly.
if (process.env.SECTORCALC_SHIM_REAL_NEXT) {
  const realNextCandidates = [
    join(ROOT, "node_modules/.bin/next.firebase-backup"),
  ];
  const realNext = realNextCandidates.find((candidate) => existsSync(candidate));
  if (realNext) {
    const s = spawnSync(process.execPath, [realNext, ...args], { cwd: ROOT, stdio: "inherit", env: process.env });
    process.exit(s.status ?? 1);
  }
}

function finalizeExistingBuild() {
  spawnSync("node", ["scripts/finalize-next-build.mjs"], { cwd: ROOT, stdio: "inherit" });
  const validate = spawnSync("node", ["scripts/validate-next-build.mjs"], {
    cwd: ROOT,
    stdio: "inherit",
  });
  return (validate.status ?? 1) === 0;
}

if (args[0] === "build") {
  if (existsSync(BUILD_ID_PATH) && finalizeExistingBuild()) {
    console.log("next-firebase-deploy-shim: reusing validated .next build for Firebase deploy.");
    process.exit(0);
  }

  const status = spawnSync("node", ["scripts/next-build-with-500-fallback.mjs"], {
    cwd: ROOT,
    stdio: "inherit",
    env: {
      ...process.env,
      NODE_OPTIONS: process.env.NODE_OPTIONS ?? "--max-old-space-size=8192",
    },
  }).status;
  process.exit(status ?? 1);
}

const realNextCandidates = [
  join(ROOT, "node_modules/next/dist/bin/next"),
  join(ROOT, "node_modules/.bin/next.firebase-backup"),
];

const realNext = realNextCandidates.find((candidate) => existsSync(candidate));
if (!realNext) {
  console.error("next-firebase-deploy-shim: could not locate the real Next.js binary.");
  process.exit(1);
}

const status = spawnSync(process.execPath, [realNext, ...args], {
  cwd: ROOT,
  stdio: "inherit",
});
process.exit(status.status ?? 1);
