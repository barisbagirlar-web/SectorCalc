import fs from "node:fs";
import path from "node:path";
import { callDeepSeekJson, getDeepSeekClientConfig } from "@/lib/ai/deepseek/deepseek-client";
import {
  buildFormulaAuditSystemPrompt,
  buildFormulaAuditUserPrompt,
} from "@/lib/ai/deepseek/deepseek-prompts";
import { validateSuggestionEnvelope } from "@/lib/ai/deepseek/deepseek-json-guard";
import {
  buildFormulaAuditToolContexts,
  ERT_PROBLEM_SLUG,
  selectFormulaAuditSlugs,
} from "@/lib/ai/deepseek/formula-audit-collector";
import type { DeepSeekSuggestionEnvelopeMeta } from "@/lib/ai/deepseek/deepseek-types";

const ROOT = process.cwd();
const OUTPUT_DIR = path.join(ROOT, "scripts/.cache/deepseek");
const OUTPUT_PATH = path.join(OUTPUT_DIR, "formula-audit-suggestions.json");

function writeReport(report: DeepSeekSuggestionEnvelopeMeta): void {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, `${JSON.stringify(report, null, 2)}\n`, "utf8");
}

function unavailableReport(reason: string, slugs: string[]): DeepSeekSuggestionEnvelopeMeta {
  return {
    taskType: "formula_audit",
    generatedAt: new Date().toISOString(),
    mustNotAutoApply: true,
    items: [],
    status: "unavailable",
    suggestionUnavailable: true,
    errorCode: reason === "missing_api_key" ? "missing_api_key" : undefined,
    auditedSlugs: slugs,
    message: reason,
  };
}

export async function runDeepSeekFormulaAudit(): Promise<{
  outputPath: string;
  exitCode: number;
  report: DeepSeekSuggestionEnvelopeMeta;
}> {
  const config = getDeepSeekClientConfig();
  const maxTools = Number(process.env.DEEPSEEK_MAX_TOOLS_PER_RUN || 10);
  const slugs = selectFormulaAuditSlugs(maxTools);
  const toolContexts = buildFormulaAuditToolContexts(slugs);

  if (!config.apiKey) {
    const report = unavailableReport("missing_api_key", slugs);
    writeReport(report);
    return { outputPath: OUTPUT_PATH, exitCode: 0, report };
  }

  const result = await callDeepSeekJson(
    "formula_audit",
    [
      { role: "system", content: buildFormulaAuditSystemPrompt() },
      { role: "user", content: buildFormulaAuditUserPrompt(toolContexts) },
    ],
    validateSuggestionEnvelope,
  );

  if (!result.ok) {
    const report: DeepSeekSuggestionEnvelopeMeta = {
      taskType: "formula_audit",
      generatedAt: new Date().toISOString(),
      mustNotAutoApply: true,
      items: [],
      status: "api_error",
      suggestionUnavailable: true,
      errorCode: result.errorCode,
      auditedSlugs: slugs,
      message: result.message || result.errorCode,
    };
    writeReport(report);
    return { outputPath: OUTPUT_PATH, exitCode: 0, report };
  }

  const report: DeepSeekSuggestionEnvelopeMeta = {
    ...result.data,
    generatedAt: result.data.generatedAt || new Date().toISOString(),
    status: "ok",
    auditedSlugs: slugs,
  };

  writeReport(report);
  return { outputPath: OUTPUT_PATH, exitCode: 0, report };
}

async function main(): Promise<void> {
  const { outputPath, exitCode, report } = await runDeepSeekFormulaAudit();

  console.log("=== DeepSeek Formula Auditor (DSK-1) ===");
  console.log(`problem slug included: ${report.auditedSlugs?.includes(ERT_PROBLEM_SLUG) ? "yes" : "no"}`);
  console.log(`audited slugs: ${(report.auditedSlugs ?? []).length}`);
  console.log(`suggestions: ${report.items.length}`);
  console.log(`status: ${report.status ?? "unknown"}`);
  console.log(`output: ${outputPath}`);
  process.exit(exitCode);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(0);
});
