import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { ReportPreviewCard } from "@/components/cards/ReportPreviewCard";

export function ReportPreviewSection() {
  return (
    <section className="border-y border-slate/10 bg-[#f4f6f8] py-16 md:py-24 lg:py-28">
      <Container size="wide">
        <h2 className="text-center text-[1.75rem] font-bold leading-tight tracking-tight text-deep-navy sm:text-4xl lg:text-[2.5rem]">
          Decision report preview
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-center text-sm text-slate sm:text-base">
          Premium sector tools produce stakeholder-ready packages — not isolated calculator
          output.
        </p>
        <div className="mt-12">
          <ReportPreviewCard />
        </div>
        <p className="mx-auto mt-8 max-w-2xl text-center text-sm text-slate">
          Illustrative layout based on live premium tool structure.{" "}
          <Link
            href="/reports/sample-decision-report"
            className="font-semibold text-professional-blue hover:underline"
          >
            Open the full sample report →
          </Link>
        </p>
      </Container>
    </section>
  );
}
