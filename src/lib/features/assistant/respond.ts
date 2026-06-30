/**
 * SectorCalc Assistant — deterministic responder (P10).
 *
 * Pure function: message in, structured result out. No network, no AI, no
 * calculation. Used by the /api/assistant route. The client renders localized
 * copy from the `assistant` i18n namespace keyed by `topic`.
 */

import { checkGuardrails } from "@/lib/features/assistant/guardrails";
import {
  defaultNavigationSuggestions,
  matchTools,
} from "@/lib/features/assistant/knowledge";
import type {
  AssistantResult,
  AssistantSuggestion,
  AssistantTopic,
} from "@/lib/features/assistant/types";

const ENGLISH_REPLY: Record<AssistantTopic, string> = {
  findTool: "Here are SectorCalc tools that match what you described.",
  explainTool: "That tool turns your job inputs into a clear verdict with the risk drivers behind it.",
  inputs: "You enter the core costs, quantities, and rates for your job. Required fields are minimal; optional fields sharpen the result.",
  results: "The result is a verdict with the metrics and risk drivers behind it, so you can see why it lands where it does.",
  approvedReports: "Pro results can be saved as exportable decision summaries your team can review internally.",
  trustTrace: "Calculation Summary records inputs, assumptions, and validation steps so you can see how the result was derived.",
  regionalUnits: "SectorCalc supports metric, imperial, and regional units, and shows the conversions it used.",
  benchmarks: "SectorCalc shows indicative regional benchmark context next to your result, not official figures.",
  pricing: "See plans and what is included on the pricing page.",
  enterprise: "For team usage, governance, bundles, and procurement, see the enterprise page.",
  about: "SectorCalc is a global industrial calculation and decision-support platform.",
  blockedFormula: "I can't run calculations or share formulas. Open the relevant tool and it will compute the result for you.",
  blockedPrivate: "I can't access private data, accounts, or secrets, and I can't bypass any gate.",
  fallback: "I can help you find the right tool, understand inputs and results, and navigate SectorCalc.",
};

const NAV_TOPICS: ReadonlyArray<{ topic: AssistantTopic; patterns: RegExp[]; suggestion: AssistantSuggestion }> = [
  {
    topic: "enterprise",
    patterns: [/\benterprise\b/, /\bteam\b/, /\borganization\b/, /\bprocurement\b/, /\bbusiness plan\b/],
    suggestion: { slug: "enterprise", label: "Enterprise", href: "/enterprise" },
  },
  {
    topic: "pricing",
    patterns: [/\bpricing\b/, /\bsubscription\b/, /\bplan\b/, /\bcost to use\b/, /\bhow much does\b/, /\bpro plan\b/],
    suggestion: { slug: "pricing", label: "Pricing", href: "/pricing" },
  },
  {
    topic: "approvedReports",
    patterns: [/\bdecision summary\b/, /\bpremium report\b/, /\bsaved report\b/],
    suggestion: { slug: "reports", label: "Saved summaries", href: "/account/reports" },
  },
  {
    topic: "trustTrace",
    patterns: [/\bcalculation summary\b/, /\bcalculation governance\b/],
    suggestion: { slug: "methodology", label: "Methodology", href: "/methodology" },
  },
  {
    topic: "about",
    patterns: [/\babout\b/, /\bwho are you\b/, /\bwhat is sectorcalc\b/, /\bwhat does sectorcalc\b/],
    suggestion: { slug: "about-us", label: "About SectorCalc", href: "/about-us" },
  },
];

const TOPIC_ONLY: ReadonlyArray<{ topic: AssistantTopic; patterns: RegExp[] }> = [
  { topic: "regionalUnits", patterns: [/\bunit\b/, /\bmetric\b/, /\bimperial\b/, /\bconvert\b/] },
  { topic: "benchmarks", patterns: [/\bbenchmark\b/, /\bcompare to others\b/, /\bindustry average\b/] },
  { topic: "inputs", patterns: [/\binput\b/, /\bfield\b/, /\bwhat do i enter\b/, /\bwhat should i enter\b/] },
  { topic: "results", patterns: [/\bresult\b/, /\bverdict\b/, /\binterpret\b/, /\bwhat does .* mean\b/] },
];

function build(topic: AssistantTopic, suggestions: AssistantSuggestion[], blocked = false): AssistantResult {
  return { topic, blocked, suggestions, reply: ENGLISH_REPLY[topic] };
}

export function respond(rawMessage: string): AssistantResult {
  const message = rawMessage.trim();
  const lower = message.toLowerCase();

  const guardrail = checkGuardrails(message);
  if (guardrail) {
    return build(guardrail, [], true);
  }

  for (const nav of NAV_TOPICS) {
    if (nav.patterns.some((pattern) => pattern.test(lower))) {
      return build(nav.topic, [nav.suggestion]);
    }
  }

  const toolMatches = matchTools(message);
  if (toolMatches.length > 0) {
    const topic: AssistantTopic = toolMatches.length === 1 ? "explainTool" : "findTool";
    return build(topic, toolMatches);
  }

  for (const item of TOPIC_ONLY) {
    if (item.patterns.some((pattern) => pattern.test(lower))) {
      return build(item.topic, []);
    }
  }

  return build("fallback", defaultNavigationSuggestions());
}
