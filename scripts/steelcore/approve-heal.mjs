#!/usr/bin/env node
/**
 * steelcore:approve-heal — Apply Approved Healing Patches
 *
 * Reads a diff patch from heal-suggestions/ and applies it after
 * human confirmation. This is the gateway for AI-generated fixes.
 *
 * Usage: node scripts/steelcore/approve-heal.mjs --patch=heal-1234567890-schema-auto-fix.patch
 *        node scripts/steelcore/approve-heal.mjs --latest        # apply most recent patch
 *        node scripts/steelcore/approve-heal.mjs --list          # list all pending patches
 *        node scripts/steelcore/approve-heal.mjs --all           # apply ALL pending patches
 */
import { execSync } from "node:child_process";
import { readFileSync, readdirSync, renameSync, mkdirSync, existsSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const HEAL_DIR = join(process.cwd(), "heal-suggestions");
const APPLIED_DIR = join(HEAL_DIR, "applied");

function listPendingPatches() {
  if (!existsSync(HEAL_DIR)) return [];
  return readdirSync(HEAL_DIR)
    .filter(f => f.endsWith(".patch") && !f.startsWith("."))
    .sort();
}

function getLatestPatch() {
  const patches = listPendingPatches();
  if (patches.length === 0) return null;
  // Sort by timestamp embedded in filename: heal-{timestamp}-*.patch
  return patches.sort().reverse()[0];
}

function applyPatch(patchFile) {
  const filepath = join(HEAL_DIR, patchFile);
  if (!existsSync(filepath)) {
    console.error(`❌ Patch not found: ${filepath}`);
    return false;
  }

  const content = readFileSync(filepath, "utf-8");
  console.log(`\nPatch: ${patchFile}`);
  console.log("-".repeat(60));

  // Show header info
  const headerLines = content.split("\n").filter(l => l.startsWith("# "));
  for (const line of headerLines) {
    console.log(`  ${line.slice(2)}`);
  }

  // Show diff summary
  const diffLines = content.split("\n").filter(l => l.startsWith("+") || l.startsWith("-"));
  const additions = diffLines.filter(l => l.startsWith("+")).length;
  const deletions = diffLines.filter(l => l.startsWith("-")).length;
  console.log(`\n  Changes: +${additions} / -${deletions} lines`);

  // Show diff content (truncated for readability)
  console.log("-".repeat(60));
  const lines = content.split("\n");
  const summaryLines = lines.filter(l =>
    l.startsWith("diff --git") || l.startsWith("---") || l.startsWith("+++") ||
    l.startsWith("+") || l.startsWith("-")
  ).slice(0, 80);

  for (const line of summaryLines) {
    if (line.startsWith("+") && !line.startsWith("+++")) {
      console.log(`\x1b[32m${line}\x1b[0m`);
    } else if (line.startsWith("-") && !line.startsWith("---")) {
      console.log(`\x1b[31m${line}\x1b[0m`);
    } else {
      console.log(line);
    }
  }

  if (lines.length > 80) {
    console.log(`  ... (${lines.length - 80} more lines)`);
  }

  // Apply using git apply
  try {
    console.log("\nApplying patch via git apply...");
    execSync(`git apply ${filepath}`, {
      cwd: process.cwd(),
      stdio: "pipe",
      timeout: 30000,
      encoding: "utf-8",
    });
    console.log("✅ Patch applied successfully!");

    // Move to applied/
    mkdirSync(APPLIED_DIR, { recursive: true });
    const appliedPath = join(APPLIED_DIR, patchFile);
    renameSync(filepath, appliedPath);
    console.log(`  Moved to: ${appliedPath}`);

    return true;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`❌ Failed to apply patch: ${msg.slice(0, 200)}`);

    // Write error log
    const errorLog = join(HEAL_DIR, `${patchFile}.error.log`);
    writeFileSync(errorLog, msg, "utf-8");
    console.log(`  Error log: ${errorLog}`);
    return false;
  }
}

function main() {
  const showList = process.argv.includes("--list");
  const useLatest = process.argv.includes("--latest");
  const applyAll = process.argv.includes("--all");
  const patchArg = process.argv.find(a => a.startsWith("--patch="));

  console.log("=".repeat(60));
  console.log("SteelCore Approve-Heal — Human Approval Gateway");
  console.log(`Heal directory: ${HEAL_DIR}`);
  console.log("=".repeat(60));

  if (!existsSync(HEAL_DIR)) {
    mkdirSync(HEAL_DIR, { recursive: true });
  }

  if (showList) {
    const patches = listPendingPatches();
    if (patches.length === 0) {
      console.log("\nNo pending patches. System is clean.");
    } else {
      console.log(`\nPending patches (${patches.length}):`);
      for (const p of patches) {
        const size = readFileSync(join(HEAL_DIR, p), "utf-8").length;
        console.log(`  ${p} (${Math.round(size / 1024)} KB)`);
      }
      console.log(`\nApply: npm run steelcore:approve-heal -- --patch=<filename>`);
      console.log(`Apply all: npm run steelcore:approve-heal -- --all`);
    }
    return;
  }

  if (applyAll) {
    const patches = listPendingPatches();
    if (patches.length === 0) {
      console.log("\nNo pending patches to apply.");
      process.exit(0);
    }
    console.log(`\nApplying ALL ${patches.length} pending patches...`);
    let applied = 0;
    let failed = 0;
    for (const p of patches) {
      if (applyPatch(p)) {
        applied++;
      } else {
        failed++;
      }
    }
    console.log(`\nResults: ${applied} applied, ${failed} failed`);
    process.exit(failed > 0 ? 1 : 0);
  }

  // Determine which patch to apply
  let patchFile = null;

  if (patchArg) {
    patchFile = patchArg.split("=")[1];
  } else if (useLatest) {
    patchFile = getLatestPatch();
    if (!patchFile) {
      console.log("\nNo pending patches found.");
      process.exit(0);
    }
    console.log(`\nLatest patch: ${patchFile}`);
  } else {
    // Show available patches
    const patches = listPendingPatches();
    if (patches.length === 0) {
      console.log("\nNo pending patches found.");
      console.log("Usage: npm run steelcore:approve-heal -- --patch=<filename>");
      console.log("       npm run steelcore:approve-heal -- --latest");
      console.log("       npm run steelcore:approve-heal -- --list");
      process.exit(0);
    }

    console.log(`\nAvailable patches (${patches.length}):`);
    for (const p of patches) {
      console.log(`  ${p}`);
    }
    console.log("\nSpecify patch: npm run steelcore:approve-heal -- --patch=<filename>");
    console.log("Latest: npm run steelcore:approve-heal -- --latest");
    process.exit(0);
  }

  if (patchFile) {
    const success = applyPatch(patchFile);
    process.exit(success ? 0 : 1);
  }
}

main();
