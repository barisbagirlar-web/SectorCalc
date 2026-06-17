import type { JsonGuardResult } from "@/lib/ai/deepseek/deepseek-json-guard";
import type { CaseStudyFormValues } from "@/lib/case-studies/case-study-drafts";
import type { CaseStudyResult } from "@/lib/case-studies/types";

export type ParsedCaseStudyFromText = {
  title: string;
  subtitle: string;
  industry: string;
  country: string;
  city: string;
  duration: string;
  savings: number | null;
  tools: string;
  challenge: string;
  solution: string;
  results: CaseStudyResult[];
  testimonial: string;
  author: string;
  authorTitle: string;
  company: string;
};

function readString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function readNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string") {
    const digits = value.replace(/[^\d]/g, "");
    if (!digits) {
      return null;
    }
    const parsed = Number.parseInt(digits, 10);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function readTools(value: unknown): string {
  if (Array.isArray(value)) {
    return value
      .filter((entry): entry is string => typeof entry === "string")
      .map((entry) => entry.trim())
      .filter(Boolean)
      .join(", ");
  }
  return readString(value);
}

function readResults(value: unknown): CaseStudyResult[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((entry): CaseStudyResult | null => {
      if (!entry || typeof entry !== "object") {
        return null;
      }
      const record = entry as Record<string, unknown>;
      const metric = readString(record.metric) || readString(record.label);
      const before = readString(record.before);
      const after = readString(record.after);
      if (!metric && !before && !after) {
        return null;
      }
      return { metric, before, after };
    })
    .filter((row): row is CaseStudyResult => row !== null);
}

export function buildCaseStudyParsePrompt(text: string, sourceLocale = "en"): string {
  return `You are a case study parser for industrial engineering success stories.

Extract the following fields from the text below. Return ONLY valid JSON.
The source text language is: ${sourceLocale}.

FIELDS TO EXTRACT:
- title: Short, compelling title (max 10 words)
- subtitle: 1 sentence summary (max 15 words)
- industry: Industry sector (e.g., "Automotive", "CNC Machining", "Energy")
- country: Country name
- city: City name
- duration: Project duration (e.g., "Jan 2026 – May 2026")
- savings: Numeric savings amount only (no currency symbol)
- tools: Comma-separated tool slugs or names mentioned
- challenge: 2-3 sentences describing the problem
- solution: 2-3 sentences describing the solution
- results: Array of { "metric", "before", "after" } objects (e.g., [{"metric":"OEE","before":"18%","after":"61%"}])
- testimonial: Quote from the customer (if any)
- author: Customer name
- authorTitle: Customer title
- company: Customer company

RULES:
- If a field is not found, return an empty string or null for savings.
- Only return valid JSON, no extra text.

TEXT:
${text}`;
}

export function validateParsedCaseStudyFromText(
  parsed: unknown,
): JsonGuardResult<ParsedCaseStudyFromText> {
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    return { ok: false, reason: "invalid_json", message: "Parser output must be an object." };
  }

  const record = parsed as Record<string, unknown>;
  const results = readResults(record.results);

  return {
    ok: true,
    data: {
      title: readString(record.title),
      subtitle: readString(record.subtitle),
      industry: readString(record.industry),
      country: readString(record.country),
      city: readString(record.city),
      duration: readString(record.duration) || readString(record.projectDuration),
      savings: readNumber(record.savings) ?? readNumber(record.savingsEur),
      tools: readTools(record.tools),
      challenge: readString(record.challenge),
      solution: readString(record.solution),
      results,
      testimonial: readString(record.testimonial) || readString(record.testimonialQuote),
      author: readString(record.author) || readString(record.testimonialAuthor),
      authorTitle: readString(record.authorTitle) || readString(record.testimonialTitle),
      company: readString(record.company) || readString(record.testimonialCompany),
    },
  };
}

export function mergeParsedCaseStudyIntoFormValues(
  base: CaseStudyFormValues,
  parsed: ParsedCaseStudyFromText,
): CaseStudyFormValues {
  const savingsEur =
    parsed.savings !== null && parsed.savings > 0 ? String(parsed.savings) : base.savingsEur;
  const results =
    parsed.results.length > 0
      ? parsed.results
      : base.results;

  return {
    ...base,
    title: parsed.title || base.title,
    subtitle: parsed.subtitle || base.subtitle,
    industry: parsed.industry || base.industry,
    country: parsed.country || base.country,
    city: parsed.city || base.city,
    projectDuration: parsed.duration || base.projectDuration,
    savingsEur,
    tools: parsed.tools || base.tools,
    challenge: parsed.challenge || base.challenge,
    solution: parsed.solution || base.solution,
    results,
    testimonialQuote: parsed.testimonial || base.testimonialQuote,
    testimonialAuthor: parsed.author || base.testimonialAuthor,
    testimonialTitle: parsed.authorTitle || base.testimonialTitle,
    testimonialCompany: parsed.company || base.testimonialCompany,
  };
}
