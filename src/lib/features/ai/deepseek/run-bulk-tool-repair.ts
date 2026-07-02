import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { callDeepSeekJson, getDeepSeekClientConfig } from "@/lib/features/ai/deepseek/deepseek-client";
import { validateBulkRepairEnvelope } from "@/lib/features/ai/deepseek/bulk-tool-repair-json-guard";
import {
  buildBulkRepairSystemPrompt,
  buildBulkRepairUserPrompt,
} from "@/lib/features/ai/deepseek/bulk-tool-repair-prompts";
import {
  applyBulkRepairBatch,
  prepareDeterministicFallbackBatch,
} from "@/lib/features/ai/deepseek/bulk-tool-repair-applier";
import {
  readAuditCounts,
  selectBulkRepairBatch,
} from "@/lib/features/ai/deepseek/bulk-tool-repair-collector";
import { planBulkRepairBatch } from "@/lib/features/ai/deepseek/bulk-tool-repair-planner";
import type {
  BulkRepairDecision,
  BulkRepairPatchPlan,
  BulkToolRepairItem,
  BulkToolRepairReport,
  DeepSeekDiagnostics,
  PatchCandidateSummary,
} from "@/lib/features/ai/deepseek/bulk-tool-repair-types";

const ROOT = process.cwd();
const OUTPUT_DIR = path.join(ROOT, "scripts/.cache/deepseek");
const REPORT_PATH = path.join(OUTPUT_DIR, "bulk-tool-repair-report.json");

function parseRiskFilter(): Set<string> {
  const raw = process.env.DEEPSEEK_REPAIR_RISK?.trim() || "low,medium";
  return new Set(
    raw
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean),
  );
}

function parseMode(): "apply" | "plan" {
  const raw = process.env.DEEPSEEK_REPAIR_MODE?.trim() || "plan";
  return raw === "apply" ? "apply" : "plan";
}

function parseChunkSize(): number {
  const raw = Number(process.env.DEEPSEEK_REPAIR_CHUNK_SIZE || 10);
  if (!Number.isFinite(raw) || raw < 1) {
    return 10;
  }
  return Math.min(Math.floor(raw), 25);
}

function parseDeterministicFallbackEnabled(): boolean {
  return process.env.DEEPSEEK_REPAIR_ALLOW_DETERMINISTIC_FALLBACK?.trim() === "true";
}

function isPatchCandidateDecision(decision: BulkRepairDecision): boolean {
  return decision === "auto_apply" || decision === "auto_apply_candidate";
}

function isApplyEligibleDecision(decision: BulkRepairDecision, allowCandidate: boolean): boolean {
  if (decision === "auto_apply") {
    return true;
  }
  return allowCandidate && decision === "auto_apply_candidate";
}

function rankRepairItem(item: BulkToolRepairItem): number {
  if (isPatchCandidateDecision(item.repairDecision) && item.patches.length > 0) {
    return item.repairDecision === "auto_apply" ? 100 : 90;
  }
  if (item.repairDecision === "manual_review" && item.patches.length > 0) {
    return 50;
  }
  if (item.patches.length > 0) {
    return 25;
  }
  return 0;
}

function normalizeRepairDecision(raw: string | undefined): BulkRepairDecision {
  if (raw === "auto_apply_candidate" || raw === "auto_apply") {
    return raw;
  }
  if (raw === "manual_review" || raw === "keep_safe_state" || raw === "skip") {
    return raw;
  }
  return "manual_review";
}

function normalizePatch(patch: BulkRepairPatchPlan): BulkRepairPatchPlan {
  return {
    ...patch,
    targetFile: patch.targetFile ?? "",
    safeToApply: Boolean(patch.safeToApply),
    requiresHumanApproval: patch.requiresHumanApproval ?? !patch.safeToApply,
  };
}

function mergeDeepSeekDecisions(
  planned: BulkToolRepairItem[],
  deepseekItems: BulkToolRepairItem[],
): BulkToolRepairItem[] {
  const bySlug = new Map(deepseekItems.map((item) => [item.slug, item]));
  return planned.map((item) => {
    const remote = bySlug.get(item.slug);
    if (!remote) {
      return item;
    }

    const remotePatches =
      remote.patches?.length > 0 ? remote.patches.map(normalizePatch) : item.patches;
    const remoteDecision = normalizeRepairDecision(remote.repairDecision);
    const mergedPatches = remotePatches.length > 0 ? remotePatches : item.patches;

    if (remote.riskLevel === "high" || remote.riskLevel === "critical") {
      return {
        ...item,
        patches: mergedPatches,
        riskLevel: remote.riskLevel,
        repairDecision: "manual_review",
        rootCause: remote.rootCause || item.rootCause,
        whyNotPatchable: remote.whyNotPatchable,
        expectedAuditAfterPatch: remote.expectedAuditAfterPatch ?? item.expectedAuditAfterPatch,
      };
    }

    if (remoteDecision === "keep_safe_state" || remoteDecision === "skip") {
      return {
        ...item,
        repairDecision: remoteDecision,
        patches: mergedPatches,
        rootCause: remote.rootCause || item.rootCause,
        whyNotPatchable:
          remote.whyNotPatchable ||
          remote.rootCause ||
          item.whyNotPatchable ||
          "DeepSeek marked as not patchable.",
        expectedAuditAfterPatch: remote.expectedAuditAfterPatch ?? item.expectedAuditAfterPatch,
        riskLevel: remote.riskLevel ?? item.riskLevel,
      };
    }

    if (remoteDecision === "manual_review") {
      return {
        ...item,
        repairDecision: "manual_review",
        patches: mergedPatches,
        rootCause: remote.rootCause || item.rootCause,
        whyNotPatchable: remote.whyNotPatchable,
        expectedAuditAfterPatch: remote.expectedAuditAfterPatch ?? item.expectedAuditAfterPatch,
        riskLevel: remote.riskLevel ?? item.riskLevel,
      };
    }

    if (mergedPatches.length > 0) {
      return {
        ...item,
        repairDecision: remoteDecision,
        patches: mergedPatches,
        rootCause: remote.rootCause || item.rootCause,
        whyNotPatchable: remote.whyNotPatchable,
        expectedAuditAfterPatch: remote.expectedAuditAfterPatch ?? item.expectedAuditAfterPatch,
        riskLevel: remote.riskLevel ?? item.riskLevel,
      };
    }

    return {
      ...item,
      rootCause: remote.rootCause || item.rootCause,
      whyNotPatchable:
        remote.whyNotPatchable ||
        item.whyNotPatchable ||
        "DeepSeek returned no applicable patches.",
      riskLevel: remote.riskLevel ?? item.riskLevel,
    };
  });
}

function selectAndPlan(limit: number, riskFilter: Set<string>): {
  items: BulkToolRepairItem[];
  selectionDiagnostics: BulkToolRepairReport["selectionDiagnostics"];
} {
  const { rows, selectionDiagnostics } = selectBulkRepairBatch(limit);
  const plannedAll = planBulkRepairBatch(rows)
    .filter((item) => riskFilter.has(item.riskLevel))
    .sort((a, b) => rankRepairItem(b) - rankRepairItem(a) || a.slug.localeCompare(b.slug));

  const patchCandidates = plannedAll.filter(
    (item) => isPatchCandidateDecision(item.repairDecision) && item.patches.length > 0,
  );
  const manual = plannedAll.filter(
    (item) => item.repairDecision === "manual_review" && item.patches.length > 0,
  );
  const remainder = plannedAll.filter(
    (item) =>
      item.repairDecision === "keep_safe_state" ||
      item.repairDecision === "skip" ||
      item.patches.length === 0,
  );

  return {
    items: [...patchCandidates, ...manual, ...remainder].slice(0, limit),
    selectionDiagnostics,
  };
}

function buildPatchCandidates(items: BulkToolRepairItem[]): PatchCandidateSummary[] {
  return items
    .filter((item) => isPatchCandidateDecision(item.repairDecision) && item.patches.length > 0)
    .map((item) => ({
      slug: item.slug,
      repairDecision: item.repairDecision,
      riskLevel: item.riskLevel,
      patchCount: item.patches.length,
      patchTypes: item.patches.map((patch) => patch.type),
      rootCause: item.rootCause,
      whyNotPatchable: item.whyNotPatchable,
    }));
}

function buildDeepSeekDiagnostics(
  items: BulkToolRepairItem[],
  rawItems: number,
  parsedItems: number,
): DeepSeekDiagnostics {
  const withPatches = items.filter((item) => item.patches.length > 0);
  const withoutPatches = items.filter((item) => item.patches.length === 0);
  const keepSafe = items.filter((item) => item.repairDecision === "keep_safe_state");
  const reasonCounts = new Map<string, number>();

  for (const item of items) {
    const reason = item.whyNotPatchable || item.rootCause;
    if (reason) {
      reasonCounts.set(reason, (reasonCounts.get(reason) ?? 0) + 1);
    }
  }

  const commonWhyNotPatchable = [...reasonCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([reason, count]) => `${count}x: ${reason}`);

  return {
    rawItems,
    parsedItems,
    itemsWithPatches: withPatches.length,
    itemsWithoutPatches: withoutPatches.length,
    allSafeStateKept: items.length > 0 && keepSafe.length === items.length,
    commonWhyNotPatchable,
  };
}

function collectNotPatchableReasons(items: BulkToolRepairItem[]): string[] {
  return items
    .filter((item) => item.repairDecision === "keep_safe_state" || item.repairDecision === "skip")
    .map((item) => `${item.slug}: ${item.whyNotPatchable || item.rootCause || "no reason"}`);
}

function evaluatePlanModeQuality(
  report: Omit<BulkToolRepairReport, "blockers"> & { blockers: string[] },
  mode: "apply" | "plan",
): number {
  if (mode !== "plan") {
    return 0;
  }

  const failures: string[] = [];

  if (report.selectionDiagnostics.selectedAutoRepair === 0) {
    failures.push("selectedAutoRepair=0");
  }
  if (report.deepseekStatus === "ok" && report.deepseekDiagnostics.parsedItems === 0) {
    failures.push("parsedItems=0");
  }
  if (
    report.selected.length >= 50 &&
    report.deepseekDiagnostics.itemsWithPatches === 0
  ) {
    failures.push("itemsWithPatches=0 with selected>=50");
  }
  const safeRatio =
    report.selected.length > 0 ? report.safeStateKept.length / report.selected.length : 0;
  if (safeRatio > 0.9 && report.notPatchableReasons.length === 0) {
    failures.push("safeStateKept>90% with empty notPatchableReasons");
  }
  if (report.deepseekDiagnostics.allSafeStateKept) {
    failures.push("all items keep_safe_state");
  }

  if (failures.length > 0) {
    report.blockers.push(`Plan mode quality gate failed: ${failures.join("; ")}`);
    return 1;
  }

  return 0;
}

function runAudits(): void {
  spawnSync("node", ["scripts/tool-activation/audit-p24-tool-quality.mjs"], {
    cwd: ROOT,
    stdio: "inherit",
  });
  spawnSync("node", ["scripts/tool-activation/audit-runtime-trust-engine.mjs"], {
    cwd: ROOT,
    stdio: "inherit",
  });
}

function writeReport(report: BulkToolRepairReport): void {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  fs.writeFileSync(REPORT_PATH, `${JSON.stringify(report, null, 2)}\n`, "utf8");
}

export async function runBulkToolRepair(): Promise<{
  report: BulkToolRepairReport;
  exitCode: number;
}> {
  const limit = Number(process.env.DEEPSEEK_BULK_LIMIT || 50);
  if (!process.env.DEEPSEEK_TIMEOUT_MS && limit > 25) {
    process.env.DEEPSEEK_TIMEOUT_MS = "90000";
  }
  const mode = parseMode();
  const riskFilter = parseRiskFilter();
  const chunkSize = parseChunkSize();
  const allowDeterministicFallback = parseDeterministicFallbackEnabled();
  const before = readAuditCounts();
  const blockers: string[] = [];

  const { items: initialPlanned, selectionDiagnostics } = selectAndPlan(limit, riskFilter);
  let planned = initialPlanned;
  const selected = planned.map((item) => item.slug);

  let deepseekStatus: BulkToolRepairReport["deepseekStatus"] = "skipped";
  let deepseekRawItems = 0;
  let deepseekParsedItems = 0;
  let deepseekErrorCount = 0;
  const invalidJsonDebugPaths: string[] = [];
  const config = getDeepSeekClientConfig();

  if (!config.apiKey) {
    deepseekStatus = "missing_api_key";
    blockers.push("DEEPSEEK_API_KEY missing - DeepSeek advisory overlay skipped");
  } else if (planned.length > 0) {
    const batches: BulkToolRepairItem[][] = [];
    for (let i = 0; i < planned.length; i += chunkSize) {
      batches.push(planned.slice(i, i + chunkSize));
    }

    const mergedItems: BulkToolRepairItem[] = [];
    for (const batch of batches) {
      deepseekRawItems += batch.length;
      const result = await callDeepSeekJson(
        "schema_review",
        [
          { role: "system", content: buildBulkRepairSystemPrompt() },
          { role: "user", content: buildBulkRepairUserPrompt(batch) },
        ],
        validateBulkRepairEnvelope,
      );

      if (!result.ok) {
        deepseekErrorCount += 1;
        deepseekStatus = result.errorCode === "missing_api_key" ? "missing_api_key" : "api_error";
        blockers.push(`DeepSeek API error: ${result.errorCode ?? "unknown"}`);
        if (result.rawDebugPath) {
          invalidJsonDebugPaths.push(result.rawDebugPath);
        }
        mergedItems.push(...batch);
        continue;
      }

      deepseekStatus = deepseekErrorCount > 0 ? "partial_error" : "ok";
      const remoteItems = result.data.items as BulkToolRepairItem[];
      deepseekParsedItems += remoteItems.length;
      mergedItems.push(...mergeDeepSeekDecisions(batch, remoteItems));
    }

    if (mergedItems.length > 0) {
      planned = mergedItems;
    }
  }

  let patched: string[] = [];
  let manualReview: string[] = [];
  let safeStateKept: string[] = [];
  let skipped: string[] = [];
  let blockedByPolicy: string[] = [];
  const testResults: string[] = [];
  let deterministicFallbackUsed = false;
  let deterministicFallbackReason: string | undefined;
  let fallbackPatched = 0;

  const applyRequested = mode === "apply";
  const deepseekFailed =
    deepseekStatus === "api_error" ||
    deepseekStatus === "partial_error" ||
    deepseekErrorCount > 0;
  const hasPatchCandidates =
    initialPlanned.filter(
      (item) => isPatchCandidateDecision(item.repairDecision) && item.patches.length > 0,
    ).length > 0;
  const shouldUseDeterministicFallback =
    applyRequested &&
    allowDeterministicFallback &&
    hasPatchCandidates &&
    selectionDiagnostics.selectedAutoRepair > 0 &&
    deepseekFailed;

  if (shouldUseDeterministicFallback) {
    deterministicFallbackUsed = true;
    deterministicFallbackReason =
      deepseekErrorCount > 0 ? "deepseek_invalid_json" : "deepseek_unavailable";
    blockers.push(
      `Deterministic fallback apply enabled (${deterministicFallbackReason})`,
    );
  }

  const canApplyDeterministic =
    applyRequested &&
    (deepseekStatus === "ok" ||
      deepseekStatus === "partial_error" ||
      !config.apiKey ||
      shouldUseDeterministicFallback);

  if (applyRequested && !config.apiKey) {
    blockers.push("Deterministic local apply running without DeepSeek confirmation");
  }

  if (canApplyDeterministic) {
    const applyItems = shouldUseDeterministicFallback
      ? prepareDeterministicFallbackBatch(initialPlanned)
      : planned;
    const applyResult = applyBulkRepairBatch(applyItems, {
      allowCandidate: !shouldUseDeterministicFallback,
    });
    patched = applyResult.patchedSlugs;
    manualReview = applyResult.manualReview;
    safeStateKept = applyResult.safeStateKept;
    fallbackPatched = shouldUseDeterministicFallback ? patched.length : 0;
    skipped = applyItems
      .filter(
        (item) =>
          isApplyEligibleDecision(item.repairDecision, !shouldUseDeterministicFallback) &&
          item.patches.length > 0 &&
          !patched.includes(item.slug) &&
          !manualReview.includes(item.slug) &&
          !safeStateKept.includes(item.slug),
      )
      .map((item) => item.slug);

    if (!shouldUseDeterministicFallback) {
      const fallbackOnly = prepareDeterministicFallbackBatch(
        planned.filter(
          (item) =>
            isPatchCandidateDecision(item.repairDecision) &&
            item.patches.length > 0 &&
            !patched.includes(item.slug),
        ),
      );
      if (fallbackOnly.length > 0 && allowDeterministicFallback) {
        const fallbackResult = applyBulkRepairBatch(fallbackOnly, { allowCandidate: false });
        for (const slug of fallbackResult.patchedSlugs) {
          if (!patched.includes(slug)) {
            patched.push(slug);
            fallbackPatched += 1;
          }
        }
        deterministicFallbackUsed = deterministicFallbackUsed || fallbackPatched > 0;
        deterministicFallbackReason =
          deterministicFallbackReason ?? "residual_safe_patches";
      }
    }

    runAudits();
  } else if (applyRequested) {
    blockers.push("Apply blocked due to DeepSeek API error (fallback disabled)");
    manualReview = planned.filter((item) => item.repairDecision === "manual_review").map((i) => i.slug);
    safeStateKept = planned
      .filter(
        (item) =>
          item.repairDecision === "keep_safe_state" ||
          item.repairDecision === "auto_apply" ||
          item.repairDecision === "auto_apply_candidate",
      )
      .map((i) => i.slug);
    skipped = planned
      .filter((item) => item.repairDecision === "skip")
      .map((item) => item.slug);
  } else {
    manualReview = planned.filter((item) => item.repairDecision === "manual_review").map((i) => i.slug);
    safeStateKept = planned.filter((item) => item.repairDecision === "keep_safe_state").map((i) => i.slug);
    skipped = planned
      .filter((item) => item.repairDecision === "skip")
      .map((item) => item.slug);
  }

  blockedByPolicy = planned
    .filter((item) => item.riskLevel === "high" || item.riskLevel === "critical")
    .map((item) => item.slug);

  const after = canApplyDeterministic ? readAuditCounts() : before;

  const deepseekDiagnostics = buildDeepSeekDiagnostics(
    planned,
    deepseekRawItems,
    deepseekParsedItems,
  );
  const patchCandidates = buildPatchCandidates(planned);
  const notPatchableReasons = collectNotPatchableReasons(planned);
  const policyBlocks = blockedByPolicy.map(
    (slug) => `${slug}: blocked by high/critical risk policy`,
  );

  const report: BulkToolRepairReport = {
    generatedAt: new Date().toISOString(),
    mode,
    limit,
    selected,
    patched,
    skipped,
    manualReview,
    safeStateKept,
    blockedByPolicy,
    before,
    after,
    testResults,
    blockers,
    deepseekStatus,
    items: planned,
    selectionDiagnostics,
    deepseekDiagnostics,
    patchCandidates,
    notPatchableReasons,
    policyBlocks,
    chunkSize,
    deterministicFallbackUsed: deterministicFallbackUsed || undefined,
    deterministicFallbackReason,
    fallbackPatched: fallbackPatched > 0 ? fallbackPatched : undefined,
    invalidJsonDebugPaths: invalidJsonDebugPaths.length > 0 ? invalidJsonDebugPaths : undefined,
  };

  writeReport(report);

  let exitCode = evaluatePlanModeQuality(report, mode);
  if (
    applyRequested &&
    patched.length === 0 &&
    planned.some(
      (item) =>
        isApplyEligibleDecision(item.repairDecision, true) && item.patches.length > 0,
    )
  ) {
    exitCode = 1;
  }

  return { report, exitCode };
}

async function main(): Promise<void> {
  const { report, exitCode } = await runBulkToolRepair();

  console.log("=== DeepSeek Bulk Tool Repair (ASR-0) ===");
  console.log(`mode: ${report.mode}`);
  console.log(`limit: ${report.limit}`);
  console.log(`selected: ${report.selected.length}`);
  console.log(`selectedAutoRepair: ${report.selectionDiagnostics.selectedAutoRepair}`);
  console.log(`patchCandidates: ${report.patchCandidates.length}`);
  console.log(`itemsWithPatches: ${report.deepseekDiagnostics.itemsWithPatches}`);
  console.log(`deepseek: ${report.deepseekStatus}`);
  console.log(`chunkSize: ${report.chunkSize ?? "default"}`);
  if (report.deterministicFallbackUsed) {
    console.log(`deterministicFallbackUsed: ${report.deterministicFallbackUsed}`);
    console.log(`deterministicFallbackReason: ${report.deterministicFallbackReason ?? "n/a"}`);
    console.log(`fallbackPatched: ${report.fallbackPatched ?? 0}`);
  }
  if (report.invalidJsonDebugPaths && report.invalidJsonDebugPaths.length > 0) {
    console.log(`invalidJsonDebugPaths: ${report.invalidJsonDebugPaths.join(", ")}`);
  }
  console.log(
    `before PASS/WARN/FAIL/QUARANTINE: ${report.before.PASS}/${report.before.WARN}/${report.before.FAIL}/${report.before.QUARANTINE}`,
  );
  console.log(
    `after PASS/WARN/FAIL/QUARANTINE: ${report.after.PASS}/${report.after.WARN}/${report.after.FAIL}/${report.after.QUARANTINE}`,
  );
  console.log(`patched: ${report.patched.length}`);
  console.log(`skipped: ${report.skipped.length}`);
  console.log(`manualReview: ${report.manualReview.length}`);
  console.log(`safeStateKept: ${report.safeStateKept.length}`);
  console.log(`blockedByPolicy: ${report.blockedByPolicy.length}`);
  if (report.blockers.length > 0) {
    console.log(`blockers: ${report.blockers.join("; ")}`);
  }
  console.log(`output: ${path.relative(ROOT, REPORT_PATH)}`);

  if (report.patchCandidates.length > 0) {
    console.log("\nPatch candidates (first 20):");
    for (const candidate of report.patchCandidates.slice(0, 20)) {
      console.log(
        ` - ${candidate.slug} (${candidate.repairDecision}, ${candidate.patchCount} patches: ${candidate.patchTypes.join(",")})`,
      );
    }
  }

  if (report.patched.length > 0) {
    console.log("\nPatched slugs:");
    for (const slug of report.patched.slice(0, 30)) {
      console.log(` - ${slug}`);
    }
  }

  process.exit(exitCode);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
