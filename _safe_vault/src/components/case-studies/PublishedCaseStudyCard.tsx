import { Calendar, Clock, Briefcase } from "lucide-react";
import { Link } from "@/i18n/routing";
import type { CaseStudy } from "@/lib/case-studies/types";

type Props = {
  readonly study: CaseStudy;
  readonly readTimeLabel: string;
  readonly locale: string;
};

function formatPublishedDate(value: string, locale: string): string {
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

export function PublishedCaseStudyCard({ study, readTimeLabel, locale }: Props) {
  return (
    <Link
      href={`/case-studies/${study.slug}`}
      prefetch={false}
      className="group flex min-h-[220px] flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-sc-copper/40 hover:shadow-md"
      data-published-case-study-card={study.slug}
    >
      <div className="mb-3 flex items-center gap-2 text-xs font-medium text-sc-copper">
        <Briefcase className="h-3.5 w-3.5" aria-hidden="true" />
        {study.industry}
      </div>
      <h2 className="text-xl font-semibold text-slate-900 transition group-hover:text-sc-copper">
        {study.title}
      </h2>
      <p className="mt-2 line-clamp-2 text-sm text-slate-500">{study.subtitle}</p>
      <div className="mt-auto flex flex-wrap items-center gap-4 pt-4 text-xs text-slate-400">
        <span className="inline-flex items-center gap-1">
          <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
          {formatPublishedDate(study.publishedAt, locale)}
        </span>
        <span className="inline-flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" aria-hidden="true" />
          {readTimeLabel}
        </span>
      </div>
      <div className="mt-3 flex flex-wrap gap-1">
        {study.tools.map((tool) => (
          <span
            key={tool}
            className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-500"
          >
            {tool.replace(/-/g, " ")}
          </span>
        ))}
      </div>
    </Link>
  );
}
