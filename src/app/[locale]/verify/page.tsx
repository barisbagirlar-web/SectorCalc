import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { PageLayout } from "@/components/layout/PageLayout";
import { Container } from "@/components/ui/Container";
import PageHero from "@/components/shared/PageHero";
import { VerifyReportForm } from "@/components/trust-trace/VerifyReportForm";
import { DecisionToolLegalDisclaimer } from "@/components/tools/DecisionToolLegalDisclaimer";
import { createPageMetadata } from "@/lib/metadata";
import type { AppLocale } from "@/i18n/routing";

type PageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ reportId?: string; hash?: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return createPageMetadata({
    title: "Verify Calculation Summary — SectorCalc",
    description:
      "Check whether a SectorCalc premium decision summary report ID and calculation hash match our approved report registry.",
    path: "/verify",
    locale: locale as AppLocale,
  });
}

export default async function VerifyPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  const { reportId, hash } = await searchParams;
  setRequestLocale(locale);

  return (
    <PageLayout>
      <PageHero
        eyebrow="Trust Trace"
        title="Verify calculation summary"
        description="Enter a report ID from a premium decision summary. Optionally include the calculation hash to confirm the stored record matches."
      />
      <Container className="pb-12 pt-2">
        <div className="mx-auto max-w-2xl">
          <VerifyReportForm
            initialReportId={typeof reportId === "string" ? reportId : ""}
            initialHash={typeof hash === "string" ? hash : ""}
          />
          <div className="mt-8">
            <DecisionToolLegalDisclaimer />
          </div>
        </div>
      </Container>
    </PageLayout>
  );
}
