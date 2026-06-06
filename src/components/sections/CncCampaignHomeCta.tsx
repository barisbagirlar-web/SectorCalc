import Link from "next/link";
import { Container } from "@/components/ui/Container";

export function CncCampaignHomeCta() {
  return (
    <section className="border-b border-slate/10 bg-white py-8 sm:py-10">
      <Container>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-deep-navy">
              Running CNC or manufacturing quotes?
            </p>
            <p className="mt-1 text-sm leading-relaxed text-slate">
              Start with the free machine time calculator or unlock the CNC Quote Risk
              Analyzer.
            </p>
          </div>
          <Link
            href="/cnc-quote-risk"
            className="inline-flex min-h-[44px] shrink-0 items-center justify-center rounded-lg border-2 border-professional-blue px-6 text-sm font-semibold text-professional-blue transition-colors hover:bg-professional-blue/5"
          >
            View CNC quote risk tools
          </Link>
        </div>
      </Container>
    </section>
  );
}
