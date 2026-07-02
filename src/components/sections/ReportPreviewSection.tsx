import Link from "@/lib/ui-shared/navigation/next-link";
import { Container } from "@/components/ui/Container";
import { ReportPreviewCard } from "@/components/cards/ReportPreviewCard";

export function ReportPreviewSection() {
 return (
 <section className="border-y border-border-subtle bg-[#f4f6f8] py-16 md:py-24 lg:py-28">
 <Container size="wide">
 <h2 className="text-center text-[1.75rem] font-bold leading-tight tracking-tight text-text-primary sm:text-4xl lg:text-[2.5rem]">
 Decision report preview
 </h2>
        <p className="mx-auto mt-5 max-w-2xl text-left text-sm text-text-secondary sm:text-base">
          Premium sector tools produce stakeholder-ready packages - not isolated calculator
          output.
        </p>
        <div className="mt-12">
          <ReportPreviewCard />
        </div>
        <p className="mx-auto mt-8 max-w-2xl text-left text-sm text-text-secondary">
          Illustrative layout based on live premium tool structure.{" "}
 <Link
 href="/reports/sample-decision-report"
 className="font-semibold text-deep-navy hover:underline"
 >
 Open the full sample report →
 </Link>
 </p>
 </Container>
 </section>
 );
}
