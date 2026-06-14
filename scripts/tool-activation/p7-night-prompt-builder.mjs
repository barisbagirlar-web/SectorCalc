import { CHIEF_ENGINEER_SYSTEM_PROMPT } from "./p7-chief-engineer-system-prompt.mjs";
import { getP7ResponseJsonSchemaHint, getP7PassingResponseExample } from "./p7-night-response-schema.mjs";
import { resolveDomainPrompt } from "./p7-domain-prompt-packs.mjs";

export function buildToolUserPrompt(toolContext) {
  const schemaHint = getP7ResponseJsonSchemaHint();
  const slug = typeof toolContext?.slug === "string" ? toolContext.slug : "example-tool";
  const example = getP7PassingResponseExample(slug);
  return [
    "Denetlenecek tool bağlamı (JSON):",
    JSON.stringify(toolContext, null, 2),
    "",
    "Görev:",
    "Yukarıdaki tool için Chief Engineer denetim standardına uygun tam JSON yanıt üret.",
    "Yanıt TEK bir JSON nesnesi olmalı; markdown veya açıklama metni ekleme.",
    "High-risk tool'larda canGenerateCalculator false döndür.",
    "Eksik veya yüzeysel kriter varsa status FAIL ve overallDecision REJECTED ver.",
    "PASS yalnızca tüm mühendislik kalite kriterleri eksiksiz sağlandığında verilir.",
    "",
    "Zorunlu top-level alanlar:",
    JSON.stringify(schemaHint.required ?? [], null, 2),
    "",
    "Zorunlu formulaMethod alt alanları:",
    JSON.stringify(schemaHint.properties?.formulaMethod?.required ?? [], null, 2),
    "",
    "Örnek PASS yanıt iskeleti (alanları tool'a göre doldur, yapıyı koru):",
    JSON.stringify(example, null, 2),
    "",
    "Kritik: formulaMethod zorunlu bir nesnedir; null/string/boş bırakma.",
  ].join("\n");
}

export function getToolDomainMatch(toolContext) {
  return resolveDomainPrompt(toolContext).match;
}

export function buildDeepSeekMessages(toolContext) {
  const domainPrompt = resolveDomainPrompt(toolContext);

  return [
    {
      role: "system",
      content: CHIEF_ENGINEER_SYSTEM_PROMPT,
    },
    {
      role: "system",
      content: domainPrompt.content,
    },
    {
      role: "user",
      content: buildToolUserPrompt(toolContext),
    },
  ];
}
