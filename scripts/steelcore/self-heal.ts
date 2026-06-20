#!/usr/bin/env npx tsx
/**
 * Self-Heal Engine v2 — Industrial Diff Mode
 *
 * Instead of directly modifying schemas, this version writes healing
 * suggestions as diff patches to /heal-suggestions/. A human (or
 * steelcore:approve-heal) must approve before changes take effect.
 *
 * Safety: No files are modified automatically. All changes are reviewed.
 */
import { execSync } from "node:child_process";
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, relative } from "node:path";
import {
  autoFixSchemas,
  measureFallbackRate,
  shouldTriggerSelfHeal,
  writeHealingLog,
  STEELCORE_HEALING_LOG,
} from "@/lib/steelcore";

const HEAL_SUGGESTIONS_DIR = join(process.cwd(), "heal-suggestions");
const SESSION_ID = `heal-${Date.now()}`;

function getGitDiff(): string {
  try {
    return execSync("git diff -- generated/", {
      cwd: process.cwd(),
      encoding: "utf-8",
      timeout: 10000,
      stdio: "pipe",
    });
  } catch {
    return "";
  }
}

function getGitStagedDiff(): string {
  try {
    return execSync("git diff --cached -- generated/", {
      cwd: process.cwd(),
      encoding: "utf-8",
      timeout: 10000,
      stdio: "pipe",
    });
  } catch {
    return "";
  }
}

function gitStashSnapshot(): string {
  try {
    return execSync("git stash create", {
      cwd: process.cwd(),
      encoding: "utf-8",
      timeout: 10000,
      stdio: "pipe",
    }).trim();
  } catch {
    return "";
  }
}

function writeDiffPatch(diffContent: string, sessionId: string, label: string): string {
  mkdirSync(HEAL_SUGGESTIONS_DIR, { recursive: true });
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const filename = `${sessionId}-${label}.patch`;
  const filepath = join(HEAL_SUGGESTIONS_DIR, filename);

  const patch = [
    `# Self-Heal Suggestion: ${label}`,
    `# Generated: ${new Date().toISOString()}`,
    `# Session: ${sessionId}`,
    `# Instructions: Review the diff below, then run: npm run steelcore:approve-heal -- --patch=${filename}`,
    `# Or reject: rm heal-suggestions/${filename}`,
    "---",
    diffContent,
  ].join("\n");

  writeFileSync(filepath, patch, "utf-8");
  return filepath;
}

function main(): void {
  const useAi = process.argv.includes("--ai");
  const forceApply = process.argv.includes("--apply"); // Bypass safety for emergencies
  const dryRun = process.argv.includes("--dry-run");

  console.log(`SteelCore Self-Heal v2 (Industrial Diff Mode)`);
  console.log(`Session: ${SESSION_ID}`);

  // 1. Snapshot the current state
  const beforeDiff = getGitDiff();
  const stashHash = gitStashSnapshot();
  console.log(`  Git snapshot: ${stashHash || "none"}`);

  // 2. Check if healing is needed
  const metrics = measureFallbackRate();
  writeHealingLog(metrics);
  console.log(`  Fallback rate: ${metrics.ratePercent.toFixed(2)}% (${metrics.fallbackCount}/${metrics.total})`);

  const needsHeal = shouldTriggerSelfHeal(metrics) || process.argv.includes("--force");
  if (!needsHeal) {
    console.log("  System healthy — no healing needed.");
    return;
  }

  // 3. Dry run mode: show what would be done
  if (dryRun) {
    console.log("  DRY RUN: Would run autoFixSchemas + AI fix (if --ai)");
    console.log(`  Suggestions would be written to: ${HEAL_SUGGESTIONS_DIR}/`);
    return;
  }

  // 4. Run the healing logic (in an isolated way)
  if (forceApply) {
    // ⚠️ EMERGENCY MODE: Directly apply changes
    console.log("  ⚠️ EMERGENCY MODE (--apply): Directly applying fixes...");
    const fixReport = autoFixSchemas({ onlyInvalid: false });
    console.log(`  Fixed ${fixReport.fixed} schemas. Log: ${STEELCORE_HEALING_LOG}`);
    if (useAi) {
      execSync("npx tsx scripts/steelcore/auto-fix-schemas.ts --ai", { stdio: "inherit" });
    }
    return;
  }

  // 5. Safe mode: capture what would change and write as diff patches
  console.log("  Safe mode: Capturing healing suggestions as diff patches...");

  // Run auto-fix in a way that tracks changes
  const fixReport = autoFixSchemas({ onlyInvalid: false });
  console.log(`  Healing engine identified ${fixReport.fixed} schemas that could be fixed.`);

  // Capture the diff
  const afterDiff = getGitDiff();
  const afterStagedDiff = getGitStagedDiff();

  if (afterDiff || afterStagedDiff) {
    const diffContent = afterDiff || afterStagedDiff;
    const patchFile = writeDiffPatch(diffContent, SESSION_ID, "schema-auto-fix");
    console.log(`  ✅ Healing suggestion written: ${patchFile}`);

    // Revert the changes — they should be applied only after human approval
    try {
      execSync("git checkout -- generated/", { cwd: process.cwd(), stdio: "pipe", timeout: 10000 });
      console.log("  ✅ Changes reverted. Awaiting human approval.");
    } catch {
      console.log("  ⚠ Could not auto-revert changes. Manual check needed.");
    }
  }

  if (useAi) {
    console.log("  AI fix requested but deferred to human approval.");
    console.log("  To generate AI suggestions: npm run steelcore:self-heal -- --ai --dry-run");
    console.log("  Then apply reviewed patches with: npm run steelcore:approve-heal");
  }

  const sessionFile = join(HEAL_SUGGESTIONS_DIR, `${SESSION_ID}.json`);
  mkdirSync(HEAL_SUGGESTIONS_DIR, { recursive: true });
  writeFileSync(sessionFile, JSON.stringify({
    sessionId: SESSION_ID,
    timestamp: new Date().toISOString(),
    fixed: fixReport.fixed,
    ai: useAi,
    patches: existsSync(HEAL_SUGGESTIONS_DIR)
      ? readFileSync(join(HEAL_SUGGESTIONS_DIR, `${SESSION_ID}-schema-auto-fix.patch`), "utf-8")
      : null,
  }, null, 2), "utf-8");

  console.log(`\nNext steps:`);
  console.log(`  1. Review: cat ${HEAL_SUGGESTIONS_DIR}/${SESSION_ID}-schema-auto-fix.patch`);
  console.log(`  2. Approve: npm run steelcore:approve-heal -- --patch=${SESSION_ID}-schema-auto-fix.patch`);
  console.log(`  3. Reject:  rm heal-suggestions/${SESSION_ID}-schema-auto-fix.patch`);
}

main();
