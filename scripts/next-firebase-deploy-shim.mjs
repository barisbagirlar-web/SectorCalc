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
    join(ROOT, "node_modules/next/dist/bin/next.firebase-backup"),
    join(ROOT, "node_modules/next/dist/bin/next"),
  ];
  const realNext = realNextCandidates.find((candidate) => existsSync(candidate));
  if (realNext) {
    const s = spawnSync(process.execPath, [realNext, ...args], { cwd: ROOT, stdio: "inherit", env: process.env });
    process.exit(s.status ?? 1);
  }
}

function finalizeExistingBuild() {
  const finalize = spawnSync("node", ["scripts/finalize-next-build.mjs"], { cwd: ROOT, stdio: "inherit" });
  return (finalize.status ?? 1) === 0;
}

if (args[0] === "build") {
  // Always run the build with retry logic. Do NOT early-exit even if .next/BUILD_ID exists,
  // because Firebase framework integration needs to run its full pipeline (including function
  // source packaging at .firebase/sectorcalc-bf412/functions/).
  const status = spawnSync("node", ["scripts/next-build-with-500-fallback.mjs"], {
    cwd: ROOT,
    stdio: "inherit",
    env: {
      ...process.env,
      NODE_OPTIONS: process.env.NODE_OPTIONS ?? "--max-old-space-size=8192 --dns-result-order=ipv4first",
    },
  }).status;
  process.exit(status ?? 1);
}

const realNextCandidates = [
  join(ROOT, "node_modules/next/dist/bin/next.firebase-backup"),
  join(ROOT, "node_modules/next/dist/bin/next"),
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
