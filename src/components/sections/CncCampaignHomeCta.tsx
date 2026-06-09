import Link from "next/link";
import { Container } from "@/components/ui/Container";

export function CncCampaignHomeCta() {
 return (
 <section className="border-b border-border-subtle bg-white py-8 sm:py-10">
 <Container>
 <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
 <div className="max-w-2xl">
 <p className="text-sm font-semibold text-text-primary">
 Running CNC or manufacturing quotes?
 </p>
 <p className="mt-1 text-sm leading-relaxed text-text-secondary">
 Start with the free machine time calculator or unlock the CNC Quote Risk
 Analyzer.
 </p>
 </div>
 <Link
 href="/cnc-quote-risk"
 className="inline-flex min-h-[44px] shrink-0 items-center justify-center rounded-lg border border-ink-black px-6 text-sm font-semibold text-ink-black transition-colors hover:bg-accent-teal/5"
 >
 View CNC quote risk tools
 </Link>
 </div>
 </Container>
 </section>
 );
}
