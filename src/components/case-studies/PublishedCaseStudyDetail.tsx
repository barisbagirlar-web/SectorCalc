import { Calendar, Clock, Briefcase, ArrowLeft, CheckCircle } from "lucide-react";
import { getTranslations } from "@/lib/i18n-stub";
import Link from "next/link";
import { DecisionToolLegalDisclaimer } from "@/components/tools/DecisionToolLegalDisclaimer";
import type { CaseStudy } from "@/lib/features/case-studies/types";
import { resolveGeneratedToolPath } from "@/lib/features/tools/paths";

type Props = {
  readonly study: CaseStudy;
  readonly locale: string;
};

function formatPublishedDate(value: string, locale: string): string {
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export async function PublishedCaseStudyDetail({ study, locale }: Props) {
  const t = await getTranslations("caseStudies");

  return (
    <article className="min-w-0">
      <Link
        href="/case-studies"
        prefetch={false}
        className="mb-6 inline-flex min-h-[44px] items-center gap-2 text-sm text-slate-500 transition hover:text-sc-copper"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        {t("backToList")}
      </Link>

      <header className="mb-8 rounded-r-xl border-l-4 border-sc-copper bg-sc-copper/5 p-6">
        <div className="mb-2 flex items-center gap-2 text-sm font-medium text-sc-copper">
          <Briefcase className="h-4 w-4" aria-hidden="true" />
          {study.industry}
        </div>
        <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">{study.title}</h1>
        <p className="mt-2 text-lg text-slate-600">{study.subtitle}</p>
        <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-slate-400">
          <span className="inline-flex items-center gap-1">
            <Calendar className="h-4 w-4" aria-hidden="true" />
            {formatPublishedDate(study.publishedAt, locale)}
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-4 w-4" aria-hidden="true" />
            {t("readTime", { count: study.readTime })}
          </span>
        </div>
      </header>

      <div className="mb-8 flex flex-wrap items-center gap-2">
        <span className="mr-1 text-sm font-medium text-slate-500">{t("toolsUsed")}</span>
        {study.tools.map((tool) => (
          <Link
            key={tool}
            href={resolveGeneratedToolPath(tool)}
            prefetch={false}
            className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700 transition hover:bg-sc-copper/10 hover:text-sc-copper"
          >
            {tool.replace(/-/g, " ")}
          </Link>
        ))}
      </div>

      <div className="prose prose-slate max-w-none">
        <h2>{t("challengeHeading")}</h2>
        <p>{study.challenge}</p>

        <h2>{t("solutionHeading")}</h2>
        <p>{study.solution}</p>

        <h2>{t("resultsHeading")}</h2>
        <div className="not-prose my-6 grid gap-4 sm:grid-cols-2">
          {study.results.map((result) => (
            <div
              key={result.metric}
              className="rounded-xl border border-slate-100 bg-slate-50 p-4"
            >
              <div className="text-sm text-slate-500">{result.metric}</div>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <span className="text-sm text-red-500 line-through">{result.before}</span>
                <CheckCircle className="h-4 w-4 text-emerald-600" aria-hidden="true" />
                <span className="text-xl font-bold text-emerald-600">{result.after}</span>
              </div>
            </div>
          ))}
        </div>

        {study.testimonial ? (
          <div className="not-prose my-8 rounded-xl border border-sc-copper/20 bg-sc-copper/5 p-6">
            <p className="text-lg italic text-slate-700">&ldquo;{study.testimonial.quote}&rdquo;</p>
            <div className="mt-3">
              <p className="font-semibold text-slate-900">{study.testimonial.author}</p>
              <p className="text-sm text-slate-500">
                {study.testimonial.title} · {study.testimonial.company}
              </p>
            </div>
          </div>
        ) : null}

        <div className="not-prose mt-8 rounded-xl border border-sc-copper/20 bg-gradient-to-r from-sc-copper/10 to-sc-copper/5 p-6 text-center">
          <h3 className="text-lg font-semibold text-slate-900">{t("ctaTitle")}</h3>
          <p className="mt-1 text-slate-500">{t("ctaBody")}</p>
          <Link
            href="/pricing"
            prefetch={false}
            className="sc-cta-primary mt-4 inline-flex min-h-[44px] items-center px-6 text-sm font-medium"
          >
            {t("ctaButton")}
          </Link>
        </div>
      </div>

      <div className="mt-8">
        <DecisionToolLegalDisclaimer />
      </div>
    </article>
  );
}
