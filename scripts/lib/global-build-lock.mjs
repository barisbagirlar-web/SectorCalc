#!/usr/bin/env node
/**
 * Repo-wide build/deploy lock — prevents parallel `next build` from corrupting `.next`.
 * Used by local Firebase deploy, npm run build, and Vercel build entry (non-CI).
 */
import { existsSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
export const GLOBAL_BUILD_LOCK_PATH = join(ROOT, ".sectorcalc-build.lock");

function readLock() {
  if (!existsSync(GLOBAL_BUILD_LOCK_PATH)) {
    return null;
  }
  try {
    return JSON.parse(readFileSync(GLOBAL_BUILD_LOCK_PATH, "utf8"));
  } catch {
    return null;
  }
}

function pidAlive(pid) {
  if (typeof pid !== "number" || pid <= 0) {
    return false;
  }
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

/**
 * @param {string} label Human-readable owner (e.g. "deploy:hosting", "npm run build")
 */
export function acquireGlobalBuildLock(label) {
  const existing = readLock();
  if (existing && pidAlive(existing.pid)) {
    if (existing.pid === process.pid) {
      return;
    }
    console.error(
      `global-build-lock: blocked — "${existing.label}" (pid ${existing.pid}) running since ${existing.startedAt ?? "unknown"}`,
    );
    console.error("global-build-lock: stop other builds first: npm run stop:builds");
    process.exit(1);
  }

  if (existing) {
    rmSync(GLOBAL_BUILD_LOCK_PATH, { force: true });
  }

  writeFileSync(
    GLOBAL_BUILD_LOCK_PATH,
    JSON.stringify({
      pid: process.pid,
      label,
      startedAt: new Date().toISOString(),
    }),
    "utf8",
  );
}

export function releaseGlobalBuildLock() {
  if (!existsSync(GLOBAL_BUILD_LOCK_PATH)) {
    return;
  }
  const lock = readLock();
  if (lock?.pid === process.pid) {
    rmSync(GLOBAL_BUILD_LOCK_PATH, { force: true });
  }
}
