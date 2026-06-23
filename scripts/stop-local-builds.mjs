#!/usr/bin/env node
/**
 * Emergency stop for stale local Next.js / deploy processes that corrupt `.next`.
 */
import { spawnSync } from "node:child_process";
import { existsSync, rmSync } from "node:fs";
import { join } from "node:path";
import { GLOBAL_BUILD_LOCK_PATH } from "./lib/global-build-lock.mjs";

const ROOT = process.cwd();
const MY_PID = process.pid;

const PATTERNS = [
  "next-build-with-500-fallback",
  "deploy-production.mjs",
  "firebase-hosting-build.mjs",
  "next/dist/bin/next build",
  "node_modules/.bin/next build",
  "npm exec next build",
];

/** @param {string} pattern */
function killOtherProcesses(pattern) {
  const found = spawnSync("pgrep", ["-f", pattern], { encoding: "utf8" });
  const pids = (found.stdout ?? "")
    .trim()
    .split("\n")
    .filter(Boolean)
    .map((value) => Number(value))
    .filter((pid) => pid > 0 && pid !== MY_PID);

  for (const pid of pids) {
    try {
      process.kill(pid, "SIGTERM");
    } catch {
      // already exited
    }
  }
}

for (const pattern of PATTERNS) {
  killOtherProcesses(pattern);
}

for (const lock of [
  GLOBAL_BUILD_LOCK_PATH,
  join(ROOT, ".next-deploy.lock"),
  join(ROOT, ".next/.build.lock"),
]) {
  if (existsSync(lock)) {
    rmSync(lock, { force: true });
  }
}

console.log("stop-local-builds: stopped other build/deploy processes and cleared locks.");
