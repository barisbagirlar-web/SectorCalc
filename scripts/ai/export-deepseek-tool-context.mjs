#!/usr/bin/env node
/**
 * DeepSeek Tool Context Export — redacted repair context for bulk factory.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  CONTROL_PLANE_REPORT_PATH,
  FORMULA_KNOWLEDGE_GRAPH_PATH,
  RUNTIME_TRUST_REPORT_PATH,
  DEEPSEEK_TOOL_CONTEXT_PATH,
  DEEPSEEK_FORMULA_AUDIT_PATH,
  buildDeepSeekToolContext,
  buildControlPlaneReport,
  buildFormulaKnowledgeGraph,
  formatDeepSeekExportStdout,
} from "../tool-activation/lib/p25-control-plane-lib.mjs";
import { P24_REPORT_PATH } from "../tool-activation/lib/p24-tool-quality-lib.mjs";
import { LEGACY_CONFLICT_REPORT_PATH } from "../tool-activation/lib/legacy-conflict-audit-lib.mjs";
import { redactSecretsLiteDeep } from "../tool-activation/lib/deepseek-redaction-lite.mjs";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");

function readJson(filePath) {
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function main() {
  const controlPlane =
    readJson(CONTROL_PLANE_REPORT_PATH) ??
    buildControlPlaneReport({
      p24Report: readJson(P24_REPORT_PATH),
    });

  const knowledgeGraph =
    readJson(FORMULA_KNOWLEDGE_GRAPH_PATH) ?? buildFormulaKnowledgeGraph();

  const payload = buildDeepSeekToolContext(controlPlane, knowledgeGraph);

  const enriched = {
    ...payload,
    inputs: {
      p24: fs.existsSync(P24_REPORT_PATH) ? path.relative(ROOT, P24_REPORT_PATH) : null,
      runtimeTrust: fs.existsSync(RUNTIME_TRUST_REPORT_PATH)
        ? path.relative(ROOT, RUNTIME_TRUST_REPORT_PATH)
        : null,
      controlPlane: path.relative(ROOT, CONTROL_PLANE_REPORT_PATH),
      knowledgeGraph: path.relative(ROOT, FORMULA_KNOWLEDGE_GRAPH_PATH),
      legacyConflicts: fs.existsSync(LEGACY_CONFLICT_REPORT_PATH)
        ? path.relative(ROOT, LEGACY_CONFLICT_REPORT_PATH)
        : null,
      formulaAuditSuggestions: fs.existsSync(DEEPSEEK_FORMULA_AUDIT_PATH)
        ? path.relative(ROOT, DEEPSEEK_FORMULA_AUDIT_PATH)
        : null,
    },
  };

  const redacted = redactSecretsLiteDeep(enriched);
  const redactionApplied = JSON.stringify(enriched) !== JSON.stringify(redacted);

  fs.mkdirSync(path.dirname(DEEPSEEK_TOOL_CONTEXT_PATH), { recursive: true });
  fs.writeFileSync(DEEPSEEK_TOOL_CONTEXT_PATH, `${JSON.stringify(redacted, null, 2)}\n`, "utf8");

  console.log(formatDeepSeekExportStdout(redacted, redactionApplied));
}

main();
