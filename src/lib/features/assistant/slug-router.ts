import "server-only";

import OpenAI from "openai";
import { getAiToolIndexRecord } from "@/lib/features/ai/tool-search-index";
import { checkGuardrails } from "@/lib/features/assistant/guardrails";
import { matchTools } from "@/lib/features/assistant/knowledge";
import { stripLocaleFromPath } from "@/lib/infrastructure/i18n/locale-routing";
import {
  REGENERATION_FREE_SLUGS,
  REGENERATION_PREMIUM_SLUGS,
} from "@/lib/features/generated-tools/regeneration-slug-lists";
import type { AssistantSuggestion } from "@/lib/features/assistant/types";

export type SlugRouterSource = "fallback" | "knowledge" | "deepseek";

export type SlugRouterResult = {
  readonly message: string;
  readonly slug: string | null;
  readonly source: SlugRouterSource | null;
  readonly blocked: boolean;
  readonly topic?: "blockedFormula" | "blockedPrivate";
  readonly suggestion?: AssistantSuggestion;
};

/**
 * Revenue tool slugs NOT in REGENERATION lists but used by deterministic rules.
 * Revenue tools live in src/lib/tools/revenue-tools-*.ts with their own paths.
 */
const REVENUE_FREE_SLUGS = new Set<string>(["roi-quick-check"]);
const REVENUE_PREMIUM_SLUGS = new Set<string>(["roi-payback-analyzer"]);

const VALID_SLUGS = new Set<string>([
  ...REGENERATION_PREMIUM_SLUGS,
  ...REGENERATION_FREE_SLUGS,
  ...REVENUE_FREE_SLUGS,
  ...REVENUE_PREMIUM_SLUGS,
]);

const KEYWORD_RULES: ReadonlyArray<{ readonly patterns: RegExp[]; readonly slug: string }> = [
  {
    patterns: [/\boee\b/, /genel ekipman/i],
    slug: "oee-calculator",
  },
  {
    patterns: [/\bfire\b/, /\bhurda\b/, /\bscrap\b/],
    slug: "scrap-rate-calculator",
  },
  {
    patterns: [/\bcnc\b/, /\btezgah\b/],
    slug: "cnc-cycle-time-calculator",
  },
  {
    patterns: [/\bkarbon\b/, /carbon footprint/i, /carbon-footprint/i],
    slug: "carbon-footprint-quick",
  },
  {
    patterns: [/basabas/i, /break[- ]?even/i],
    slug: "break-even-safety-margin-calculator",
  },
  {
    patterns: [/\bstok\b/, /\beoq\b/, /inventory carrying/i],
    slug: "inventory-carrying-cost-eoq-calculator",
  },
  {
    patterns: [/iscilik/i, /personel/i, /employee total cost/i],
    slug: "employee-total-cost-calculator",
  },
  {
    patterns: [/\broi\b/, /yatirim/i, /return on investment/i, /investment return/i, /getiri/i, /kazanc/i],
    slug: "roi-quick-check",
  },
];

function resolveToolSuggestion(slug: string, locale: string): AssistantSuggestion | undefined {
  if (!VALID_SLUGS.has(slug)) {
    return undefined;
  }

  const indexed = getAiToolIndexRecord(slug);
  if (indexed?.routeStatus === "active-route") {
    const localizedUrl = indexed.localeUrls[locale] ?? indexed.localeUrls.en ?? indexed.canonicalUrl;
    const rawHref = localizedUrl.replace(/^https?:\/\/[^/]+/, "") || `/tools/generated/${slug}`;
    const href = stripLocaleFromPath(rawHref);
    const label = indexed.title[locale] ?? indexed.title.en ?? slug;

    return { slug, label, href };
  }

  if (REGENERATION_PREMIUM_SLUGS.includes(slug) || REVENUE_PREMIUM_SLUGS.has(slug)) {
    return { slug, label: slug, href: `/tools/premium/${slug}` };
  }

  if (REGENERATION_FREE_SLUGS.includes(slug) || REVENUE_FREE_SLUGS.has(slug)) {
    const labels: Record<string, string> = {
      "roi-quick-check": "ROI Quick Check",
    };
    return { slug, label: labels[slug] ?? slug, href: `/tools/generated/${slug}` };
  }

  return { slug, label: slug, href: `/tools/generated/${slug}` };
}

function deterministicSlug(query: string): string | null {
  const lower = query.toLowerCase();

  for (const rule of KEYWORD_RULES) {
    if (rule.patterns.some((pattern) => pattern.test(lower))) {
      return rule.slug;
    }
  }

  return null;
}

function knowledgeSlug(query: string): string | null {
  const matches = matchTools(query);
  if (matches.length === 1) {
    return matches[0]?.slug ?? null;
  }

  return null;
}

async function deepSeekSlug(query: string): Promise<string | null> {
  const apiKey = process.env.DEEPSEEK_API_KEY?.trim();
  if (!apiKey) {
    return null;
  }

  const client = new OpenAI({
    apiKey,
    baseURL: "https://api.deepseek.com",
  });

  const model = process.env.AI_ASSISTANT_ROUTER_MODEL?.trim() || "deepseek-chat";
  const sampleSlugs = [
    "oee-calculator",
    "scrap-rate-calculator",
    "break-even-safety-margin-calculator",
    "inventory-carrying-cost-eoq-calculator",
    "employee-total-cost-calculator",
    "roi-quick-check",
    "roi-payback-analyzer",
  ].join(", ");

  const prompt = [
    `User question: "${query}"`,
    "",
    "Which SectorCalc calculator slug best matches this question?",
    "Return ONLY the slug name, or the word null if unsure.",
    "No explanation. No markdown.",
    "",
    `Valid examples: ${sampleSlugs}`,
  ].join("\n");

  try {
    const response = await client.chat.completions.create({
      model,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
      max_tokens: 20,
    });

    const answer = response.choices[0]?.message?.content?.trim().replace(/["'`]/g, "") ?? "";
    if (!answer || answer === "null" || !VALID_SLUGS.has(answer)) {
      return null;
    }

    return answer;
  } catch {
    return null;
  }
}

function buildSuccessMessage(
  locale: string,
  suggestion: AssistantSuggestion,
  source: SlugRouterSource,
): string {
  const sourceNote =
    locale === "tr"
      ? source === "deepseek"
        ? " (AI onerisi)"
        : " (sistem onerisi)"
      : source === "deepseek"
        ? " (AI suggestion)"
        : " (system suggestion)";

  if (locale === "tr") {
    return `Bu hesaplama icin ${suggestion.label} aracini kullanabilirsiniz.${sourceNote}`;
  }

  return `For this calculation, you can use the ${suggestion.label} tool.${sourceNote}`;
}

function buildNotFoundMessage(locale: string): string {
  return locale === "tr"
    ? "Uzgunum, bu konuda henuz bir hesaplama aracimiz yok. Lutfen farkli bir soru deneyin veya kredi paketlerimize goz atin."
    : "Sorry, we do not have a calculator for this topic yet. Try a different question or browse our credit packages.";
}

function buildBlockedMessage(locale: string, topic: "blockedFormula" | "blockedPrivate"): string {
  if (topic === "blockedPrivate") {
    return locale === "tr"
      ? "Ozel verilere, hesaplara veya gizli anahtarlara erisemem ve hicbir kisitlamayi atlatamam."
      : "I can't access private data, accounts, or secrets, and I can't bypass any gate.";
  }

  return locale === "tr"
    ? "Hesaplama yapamam veya formul paylasamam. Ilgili araci acin, sonucu sizin icin o hesaplar."
    : "I can't run calculations or share formulas. Open the relevant tool and it will compute the result for you.";
}

export async function routeAssistantSlug(
  userMessage: string,
  locale = "en",
): Promise<SlugRouterResult> {
  const message = userMessage.trim();
  const guardrail = checkGuardrails(message);

  if (guardrail) {
    return {
      message: buildBlockedMessage(locale, guardrail),
      slug: null,
      source: null,
      blocked: true,
      topic: guardrail,
    };
  }

  let slug = deterministicSlug(message);
  let source: SlugRouterSource | null = slug ? "fallback" : null;

  if (!slug) {
    slug = knowledgeSlug(message);
    source = slug ? "knowledge" : null;
  }

  if (!slug) {
    slug = await deepSeekSlug(message);
    source = slug ? "deepseek" : null;
  }

  if (slug) {
    const suggestion = resolveToolSuggestion(slug, locale);
    if (suggestion) {
      return {
        message: buildSuccessMessage(locale, suggestion, source ?? "fallback"),
        slug,
        source: source ?? "fallback",
        blocked: false,
        suggestion,
      };
    }
  }

  return {
    message: buildNotFoundMessage(locale),
    slug: null,
    source: null,
    blocked: false,
  };
}
