import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { callDeepSeekJson, getDeepSeekClientConfig } from "@/lib/ai/deepseek/deepseek-client";
import { validateBulkRepairEnvelope } from "@/lib/ai/deepseek/bulk-tool-repair-json-guard";
import {
  buildBulkRepairSystemPrompt,
  buildBulkRepairUserPrompt,
} from "@/lib/ai/deepseek/bulk-tool-repair-prompts";
import { applyBulkRepairBatch } from "@/lib/ai/deepseek/bulk-tool-repair-applier";
import {
  readAuditCounts,
  selectBulkRepairSlugs,
} from "@/lib/ai/deepseek/bulk-tool-repair-collector";
import { planBulkRepairBatch } from "@/lib/ai/deepseek/bulk-tool-repair-planner";
import type {
  BulkToolRepairItem,
  BulkToolRepairReport,
} from "@/lib/ai/deepseek/bulk-tool-repair-types";

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

function selectAndPlan(limit: number, riskFilter: Set<string>): BulkToolRepairItem[] {
  const poolSize = Math.min(Math.max(limit * 3, limit), 500);
  const pool = selectBulkRepairSlugs(poolSize);
  const plannedAll = planBulkRepairBatch(pool)
    .filter((item) => riskFilter.has(item.riskLevel))
    .sort((a, b) => rankRepairItem(b) - rankRepairItem(a) || a.slug.localeCompare(b.slug));

  const autoApply = plannedAll.filter(
    (item) => item.repairDecision === "auto_apply" && item.patches.length > 0,
  );
  const manual = plannedAll.filter(
    (item) => item.repairDecision === "manual_review" && item.patches.length > 0,
  );
  const remainder = plannedAll.filter(
    (item) => item.repairDecision === "keep_safe_state" || item.patches.length === 0,
  );

  return [...autoApply, ...manual, ...remainder].slice(0, limit);
}

function rankRepairItem(item: BulkToolRepairItem): number {
  if (item.repairDecision === "auto_apply" && item.patches.length > 0) {
    return 100;
  }
  if (item.repairDecision === "manual_review" && item.patches.length > 0) {
    return 50;
  }
  if (item.patches.length > 0) {
    return 25;
  }
  return 0;
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

    if (remote.riskLevel === "high" || remote.riskLevel === "critical") {
      return {
        ...item,
        riskLevel: remote.riskLevel,
        repairDecision: "manual_review",
        rootCause: remote.rootCause || item.rootCause,
      };
    }

    if (remote.repairDecision === "manual_review" || remote.repairDecision === "keep_safe_state") {
      return {
        ...item,
        repairDecision: remote.repairDecision,
        rootCause: remote.rootCause || item.rootCause,
      };
    }

    return item;
  });
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
  const mode = parseMode();
  const riskFilter = parseRiskFilter();
  const before = readAuditCounts();
  const blockers: string[] = [];

  let planned = selectAndPlan(limit, riskFilter);
  const selected = planned.map((item) => item.slug);

  let deepseekStatus: BulkToolRepairReport["deepseekStatus"] = "skipped";
  const config = getDeepSeekClientConfig();

  if (!config.apiKey) {
    deepseekStatus = "missing_api_key";
    blockers.push("DEEPSEEK_API_KEY missing — DeepSeek advisory overlay skipped");
  } else if (planned.length > 0) {
    const batchSize = planned.length > 50 ? 25 : planned.length;
    const batches: BulkToolRepairItem[][] = [];
    for (let i = 0; i < planned.length; i += batchSize) {
      batches.push(planned.slice(i, i + batchSize));
    }

    const mergedItems: BulkToolRepairItem[] = [];
    for (const batch of batches) {
      const result = await callDeepSeekJson(
        "schema_review",
        [
          { role: "system", content: buildBulkRepairSystemPrompt() },
          { role: "user", content: buildBulkRepairUserPrompt(batch) },
        ],
        validateBulkRepairEnvelope,
      );

      if (!result.ok) {
        deepseekStatus = result.errorCode === "missing_api_key" ? "missing_api_key" : "api_error";
        blockers.push(`DeepSeek API error: ${result.errorCode ?? "unknown"}`);
        mergedItems.push(...batch);
        break;
      }

      deepseekStatus = "ok";
      mergedItems.push(...mergeDeepSeekDecisions(batch, result.data.items as BulkToolRepairItem[]));
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

  const applyRequested = mode === "apply";
  const canApplyDeterministic = applyRequested && (!config.apiKey || deepseekStatus !== "api_error");

  if (applyRequested && !config.apiKey) {
    blockers.push("Deterministic local apply running without DeepSeek confirmation");
  }

  if (canApplyDeterministic) {
    const applyResult = applyBulkRepairBatch(planned);
    patched = applyResult.patchedSlugs;
    manualReview = applyResult.manualReview;
    safeStateKept = applyResult.safeStateKept;
    skipped = planned
      .filter(
        (item) =>
          item.repairDecision === "auto_apply" &&
          item.patches.length > 0 &&
          !patched.includes(item.slug),
      )
      .map((item) => item.slug);
    runAudits();
  } else if (applyRequested) {
    blockers.push("Apply blocked due to DeepSeek API error");
    manualReview = planned.filter((item) => item.repairDecision === "manual_review").map((i) => i.slug);
    safeStateKept = planned.filter((item) => item.repairDecision === "keep_safe_state").map((i) => i.slug);
    skipped = planned
      .filter((item) => item.repairDecision === "auto_apply")
      .map((item) => item.slug);
  } else {
    manualReview = planned.filter((item) => item.repairDecision === "manual_review").map((i) => i.slug);
    safeStateKept = planned.filter((item) => item.repairDecision === "keep_safe_state").map((i) => i.slug);
    skipped = planned
      .filter(
        (item) =>
          item.repairDecision === "auto_apply" &&
          item.patches.length > 0 &&
          item.riskLevel !== "high" &&
          item.riskLevel !== "critical",
      )
      .map((item) => item.slug);
  }

  blockedByPolicy = planned
    .filter((item) => item.riskLevel === "high" || item.riskLevel === "critical")
    .map((item) => item.slug);

  const after = canApplyDeterministic ? readAuditCounts() : before;

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
  };

  writeReport(report);

  const exitCode =
    applyRequested && patched.length === 0 && planned.some((item) => item.repairDecision === "auto_apply")
      ? 1
      : 0;

  return { report, exitCode };
}

async function main(): Promise<void> {
  const { report, exitCode } = await runBulkToolRepair();

  console.log("=== DeepSeek Bulk Tool Repair (ASR-0) ===");
  console.log(`mode: ${report.mode}`);
  console.log(`limit: ${report.limit}`);
  console.log(`selected: ${report.selected.length}`);
  console.log(`deepseek: ${report.deepseekStatus}`);
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
