import { CHIEF_ENGINEER_SYSTEM_PROMPT } from "./p7-chief-engineer-system-prompt.mjs";
import { getP7ResponseJsonSchemaHint } from "./p7-night-response-schema.mjs";
import {
  buildDomainPromptSection,
  matchDomainPrompt,
  toDomainMatchInput,
} from "./p7-domain-prompt-dispatcher.mjs";

export function buildToolUserPrompt(toolContext) {
  const schemaHint = getP7ResponseJsonSchemaHint();
  return [
    "Denetlenecek tool bağlamı (JSON):",
    JSON.stringify(toolContext, null, 2),
    "",
    "Görev:",
    "Yukarıdaki tool için Chief Engineer denetim standardına uygun tam JSON yanıt üret.",
    "High-risk tool'larda canGenerateCalculator false döndür.",
    "Eksik veya yüzeysel kriter varsa status FAIL ve overallDecision REJECTED ver.",
    "PASS yalnızca tüm mühendislik kalite kriterleri eksiksiz sağlandığında verilir.",
    "",
    "Zorunlu response alanları:",
    JSON.stringify(schemaHint.required ?? [], null, 2),
  ].join("\n");
}

export function getToolDomainMatch(toolContext) {
  return matchDomainPrompt(toDomainMatchInput(toolContext));
}

export function buildDeepSeekMessages(toolContext) {
  return [
    {
      role: "system",
      content: CHIEF_ENGINEER_SYSTEM_PROMPT,
    },
    {
      role: "system",
      content: buildDomainPromptSection(toDomainMatchInput(toolContext)),
    },
    {
      role: "user",
      content: buildToolUserPrompt(toolContext),
    },
  ];
}
