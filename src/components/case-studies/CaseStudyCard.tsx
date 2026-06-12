import Link from "@/lib/navigation/next-link";
import type { CaseStudyEntry } from "@/lib/case-studies/case-study-types";

type CaseStudyCardProps = {
  readonly entry: CaseStudyEntry;
  readonly href: string;
};

export function CaseStudyCard({ entry, href }: CaseStudyCardProps) {
  return (
    <Link
      href={href}
      className="sc-industrial-panel sc-ledger-panel block min-w-0 p-4 sm:p-5 transition-colors hover:border-copper/40"
    >
      <p className="text-xs font-medium uppercase tracking-wide text-copper">{entry.sectorLabel}</p>
      <h2 className="mt-2 text-base font-semibold text-navy sm:text-lg">{entry.title}</h2>
      <p className="mt-2 line-clamp-3 text-sm text-body-charcoal">{entry.problem}</p>
      <p className="mt-3 text-xs text-body-charcoal">
        {entry.evidenceLevel.replace(/-/g, " ")}
      </p>
    </Link>
  );
}
