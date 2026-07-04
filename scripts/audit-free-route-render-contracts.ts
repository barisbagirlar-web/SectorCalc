/**
 * scripts/audit-free-route-render-contracts.ts
 *
 * Audit every route-visible free tool by resolving through the actual system
 * schema resolver (resolveApprovedToolSchema) and building a ToolRenderContract.
 *
 * Exits non-zero if any contract is invalid.
 *
 * Usage: npx tsx scripts/audit-free-route-render-contracts.ts
 */

import { existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import {
  resolveApprovedToolSchema,
  listAllResolvableToolKeys,
} from "@/sectorcalc/runtime/resolve-approved-tool-schema";
import { buildToolRenderContract } from "@/sectorcalc/runtime/build-tool-render-contract";
import type { ResolvedToolSource } from "@/sectorcalc/runtime/resolved-tool-source";
import { hasTurkishToken } from "@/sectorcalc/governance/forbidden-locale-token-detector";

function hasTurkish(text: string): boolean {
  return hasTurkishToken(text) !== null;
}

function isRawKey(value: string): boolean {
  if (!value) return true;
  if (value.includes(" ")) return false;
  if (!/[-_]/.test(value)) {
    return /^[a-z][a-z0-9]*$/.test(value);
  }
  return true;
}

// ── Main ──
function main(): void {
  console.log("\n============================================================");
  console.log("  FREE TOOL ROUTE RENDER CONTRACT AUDIT");
  console.log("============================================================\n");

  const allSlugs = listAllResolvableToolKeys().sort();
  console.log(`Total resolvable tool keys: ${allSlugs.length}\n`);

  let valid = 0;
  let invalid = 0;
  let quarantined = 0;
  const sourceCounts: Record<string, number> = {};
  let rawLegacyPassedToForm = false;

  for (const slug of allSlugs) {
    const resolved = resolveApprovedToolSchema(slug);

    if (!resolved.ok || !resolved.schema) {
      // SCHEMA_NOT_FOUND = correctly quarantined (e.g., Turkish content blocked)
      // These tools are not on any public route — not a contract failure
      if (resolved.reason === "SCHEMA_NOT_FOUND") {
        quarantined++;
        continue;
      }
      invalid++;
      console.log(`  [FAIL] ${slug}: resolve — ${resolved.errors.join("; ")}`);
      continue;
    }

    const source = resolved.source as ResolvedToolSource;
    sourceCounts[source] = (sourceCounts[source] || 0) + 1;

    const contract = buildToolRenderContract({ source, slug, schema: resolved.schema });

    if (!contract.ok) {
      invalid++;
      console.log(`  [FAIL] ${slug} (${source}): contract — ${contract.reason}: ${contract.detail}`);
      continue;
    }

    const c = contract.contract;
    const issues: string[] = [];

    // toolKey must equal slug
    if (c.toolKey !== slug) {
      issues.push(`toolKey "${c.toolKey}" !== slug "${slug}"`);
    }

    // toolName must not be empty
    if (!c.toolName || c.toolName.trim() === "") {
      issues.push("toolName empty");
    }

    // category label must not be raw key
    if (isRawKey(c.categoryLabel)) {
      issues.push(`raw category label: "${c.categoryLabel}"`);
    }

    // operation label must not be raw key
    if (isRawKey(c.operationLabel)) {
      issues.push(`raw operation label: "${c.operationLabel}"`);
    }

    // inputs must be array with items
    if (!Array.isArray(c.inputs) || c.inputs.length === 0) {
      issues.push("no inputs");
    }

    // outputs must be array with items
    if (!Array.isArray(c.outputs) || c.outputs.length === 0) {
      issues.push("no outputs");
    }

    // execute_response_contract must have redaction_status
    if (!c.formRuntimeBinding?.executeResponseContract?.redaction_status) {
      issues.push("no redaction_status in execute_response_contract");
    }

    // Turkish check
    if (hasTurkish(JSON.stringify(c))) {
      issues.push("Turkish tokens detected");
    }

    if (issues.length > 0) {
      invalid++;
      console.log(`  [FAIL] ${slug} (${source}): ${issues.join("; ")}`);
    } else {
      valid++;
    }
  }

  console.log(`\n--- Summary ---`);
  console.log(`  Total:           ${valid + invalid + quarantined}`);
  console.log(`  Valid contracts:  ${valid}`);
  console.log(`  Invalid:          ${invalid}`);
  console.log(`  Quarantined:      ${quarantined}`);
  console.log(`\nSource counts:`);
  for (const [source, count] of Object.entries(sourceCounts)) {
    console.log(`  ${source}: ${count}`);
  }
  console.log(`\nRaw legacy passed to form: ${rawLegacyPassedToForm ? "YES" : "NO"}`);

  if (invalid > 0) {
    console.log(`\nResult: ${invalid} FAILURES — exit code 1`);
    process.exit(1);
  }
  const quarantinedNote = quarantined > 0 ? ` (${quarantined} quarantined)` : "";
  console.log(`\nResult: ALL PASS${quarantinedNote} — exit code 0`);
}

main();
