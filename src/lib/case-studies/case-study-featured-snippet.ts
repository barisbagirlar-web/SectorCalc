import {
  formatEuroAmount,
  getPrimaryResultRow,
  resolveCaseStudySavingsEur,
} from "@/lib/case-studies/academic-database";
import type { CaseStudy } from "@/lib/case-studies/types";

export type CaseStudySnippetCopy = {
  readonly question: string;
  readonly answer: string;
  readonly bullets: readonly string[];
};

export type CaseStudySnippetLabels = {
  readonly snippetQuestionFallback: (values: { industry: string }) => string;
  readonly snippetAnswerMetric: (values: {
    metric: string;
    before: string;
    after: string;
  }) => string;
  readonly snippetAnswerSavings: (values: { amount: string }) => string;
};

const SNIPPET_ANSWER_MAX_WORDS = 58;

function trimToWordLimit(text: string, maxWords: number): string {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length <= maxWords) {
    return text.trim();
  }
  return `${words.slice(0, maxWords).join(" ")}…`;
}

function firstSolutionSentence(solution: string): string {
  const normalized = solution.trim();
  if (!normalized) {
    return "";
  }
  const match = normalized.match(/^[^.\n!?]+[.!?]?/u);
  return match?.[0]?.trim() ?? normalized.slice(0, 120);
}

function isQuestionSubtitle(subtitle: string): boolean {
  const trimmed = subtitle.trim();
  return trimmed.endsWith("?") || trimmed.endsWith("؟");
}

export function buildCaseStudySnippetCopy(
  study: CaseStudy,
  locale: string,
  labels: CaseStudySnippetLabels,
): CaseStudySnippetCopy {
  const question = isQuestionSubtitle(study.subtitle)
    ? study.subtitle.trim()
    : labels.snippetQuestionFallback({ industry: study.industry });

  const parts: string[] = [];
  const solutionLead = firstSolutionSentence(study.solution);
  if (solutionLead) {
    parts.push(solutionLead);
  }

  const primary = getPrimaryResultRow(study);
  if (primary?.metric) {
    parts.push(
      labels.snippetAnswerMetric({
        metric: primary.metric,
        before: primary.before,
        after: primary.after,
      }),
    );
  }

  const savings = resolveCaseStudySavingsEur(study);
  if (savings > 0) {
    parts.push(
      labels.snippetAnswerSavings({
        amount: formatEuroAmount(savings, locale),
      }),
    );
  }

  const answer = trimToWordLimit(parts.join(" "), SNIPPET_ANSWER_MAX_WORDS);
  const bullets = study.results
    .slice(0, 4)
    .map((row) => `${row.metric}: ${row.before} → ${row.after}`);

  return { question, answer, bullets };
}

export function buildCaseStudyIndexSummaryLine(study: CaseStudy, locale: string): string {
  const company = study.testimonial?.company ?? study.industry;
  const primary = getPrimaryResultRow(study);
  const savings = formatEuroAmount(resolveCaseStudySavingsEur(study), locale);
  if (!primary) {
    return `${company}: €${savings} documented savings`;
  }
  return `${company}: ${primary.metric} ${primary.before} → ${primary.after}, €${savings} savings`;
}
