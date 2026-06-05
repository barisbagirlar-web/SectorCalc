import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SITE } from "@/config/site";

interface CTASectionProps {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}

export function CTASection({
  eyebrow,
  title = "Move from operational inputs to structured decisions",
  subtitle = `${SITE.siteName} helps operators and advisors evaluate cost, margin and pricing risk — with sector tools and decision reports built for real commercial outcomes.`,
  primaryLabel = "Explore sector tools",
  primaryHref = "/industries",
  secondaryLabel = "Preview sample report",
  secondaryHref = "/reports/sample-decision-report",
}: CTASectionProps) {
  return (
    <section className="relative overflow-hidden border-t border-amber/15 bg-gradient-to-br from-dark-navy via-deep-navy to-[#0c1929]">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(245,158,11,0.08),transparent_55%)]"
        aria-hidden
      />
      <Container size="wide" className="relative py-12 md:py-16 lg:py-20">
        {eyebrow ? (
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-amber">
            {eyebrow}
          </p>
        ) : null}
        <h2
          className={`max-w-3xl text-2xl font-bold leading-tight tracking-tight text-white md:text-3xl lg:text-[2rem] ${
            eyebrow ? "mt-3" : ""
          }`}
        >
          {title}
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/80 md:text-base md:leading-7">
          {subtitle}
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <Link
            href={primaryHref}
            className="inline-flex min-h-[44px] items-center justify-center rounded-lg bg-amber px-6 py-2.5 text-sm font-semibold text-deep-navy shadow-sm transition-colors hover:bg-amber/90"
          >
            {primaryLabel}
          </Link>
          <Link
            href={secondaryHref}
            className="inline-flex min-h-[44px] items-center justify-center rounded-lg border border-white/25 bg-white/5 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:border-white/40 hover:bg-white/10"
          >
            {secondaryLabel}
          </Link>
        </div>
      </Container>
    </section>
  );
}
