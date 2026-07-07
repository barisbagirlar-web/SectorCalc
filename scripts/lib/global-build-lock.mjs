#!/usr/bin/env node
/**
 * Repo-wide build/deploy lock — prevents parallel `next build` from corrupting `.next`.
 * Used by local Firebase deploy, npm run build, and Firebase deploy.
 */
import { existsSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { execSync } from "node:child_process";
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
    // Send signal 0 to check existence
    process.kill(pid, 0);
    // Double-check: verify the process is actually node/next (not recycled PID)
    try {
      const comm = execSync(`ps -p ${pid} -o comm= 2>/dev/null || echo "unknown"`, {
        encoding: 'utf8',
        timeout: 2000,
      }).trim();
      // Allow node, next, npm, sh/zsh build processes; reject recycled PIDs
      if (comm && !comm.includes('node') && !comm.includes('next') && !comm.includes('npm') && !comm.includes('sh') && comm !== 'unknown') {
        return false; // PID recycled by a non-build process
      }
    } catch {
      // Can't determine process name — fall through to kill check
    }
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
    // Time-based expiry: if lock is older than 15 minutes, treat as stale
    const startedAt = existing.startedAt ? new Date(existing.startedAt).getTime() : 0;
    const age = Date.now() - startedAt;
    const MAX_LOCK_AGE_MS = 15 * 60 * 1000; // 15 minutes
    
    if (age > MAX_LOCK_AGE_MS) {
      console.warn(
        `global-build-lock: stale lock from "${existing.label}" (pid ${existing.pid}, age ${Math.round(age/1000)}s) — evicting`,
      );
      rmSync(GLOBAL_BUILD_LOCK_PATH, { force: true });
    } else {
      if (existing.pid === process.pid) {
        return;
      }
      console.error(
        `global-build-lock: blocked — "${existing.label}" (pid ${existing.pid}) running since ${existing.startedAt ?? "unknown"}`,
      );
      console.error("global-build-lock: stop other builds first: npm run stop:builds");
      process.exit(1);
    }
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
