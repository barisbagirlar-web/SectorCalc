#!/usr/bin/env node
/**
 * Deterministic .next cleanup — avoids macOS `rm -rf` races on deep SSG trees.
 */
import { existsSync, readdirSync, rmSync, unlinkSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const NEXT_DIR = join(ROOT, ".next");

function deleteEntry(targetPath) {
  rmSync(targetPath, {
    recursive: true,
    force: true,
    maxRetries: 12,
    retryDelay: 250,
  });
}

function cleanNextArtifacts() {
  if (!existsSync(NEXT_DIR)) {
    return { removed: false };
  }

  for (let attempt = 1; attempt <= 5; attempt += 1) {
    try {
      deleteEntry(NEXT_DIR);
      if (!existsSync(NEXT_DIR)) {
        return { removed: true };
      }
    } catch (error) {
      const code = error && typeof error === "object" && "code" in error ? String(error.code) : "";
      if (attempt === 5) {
        throw error;
      }
      if (code === "ENOTEMPTY" || code === "EBUSY" || code === "EPERM") {
        // Drain shallow children then retry (macOS APFS race on deep trees).
        try {
          for (const entry of readdirSync(NEXT_DIR)) {
            deleteEntry(join(NEXT_DIR, entry));
          }
        } catch {
          // ignore — next attempt uses recursive rm
        }
      }
    }
  }

  return { removed: !existsSync(NEXT_DIR) };
}

export { cleanNextArtifacts };

if (process.argv[1]?.endsWith("clean-next-artifacts.mjs")) {
  cleanNextArtifacts();
  if (existsSync(NEXT_DIR)) {
    console.error("clean-next-artifacts: failed to fully remove .next");
    process.exit(1);
  }
  console.log("clean-next-artifacts: .next removed");
}
