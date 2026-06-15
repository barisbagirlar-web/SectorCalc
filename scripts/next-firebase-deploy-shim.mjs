#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);

if (args[0] === "build") {
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
  join(ROOT, "node_modules/.bin/next.firebase-backup"),
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
