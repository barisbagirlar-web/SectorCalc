import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { VerificationSeal } from "@/components/verification/VerificationSeal";
import { PageLayout } from "@/components/layout/PageLayout";
import { Container } from "@/components/ui/Container";
import { buildPublicVerificationDisplay, parseVerificationId } from "@/lib/verification/verification-seal";
import { createPageMetadata } from "@/lib/metadata";
import type { AppLocale } from "@/i18n/routing";

type PageProps = { params: Promise<{ locale: string; verificationId: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, verificationId } = await params;
  return createPageMetadata({
    title: `Verify ${verificationId}`,
    description: "SectorCalc report verification seal display.",
    path: `/verify/${verificationId}`,
    locale: locale as AppLocale,
  });
}

export default async function VerifyByIdPage({ params }: PageProps) {
  const { locale, verificationId } = await params;
  setRequestLocale(locale);

  const status = parseVerificationId(verificationId);
  if (status === "invalid_id") {
    notFound();
  }

  const display = buildPublicVerificationDisplay({
    verificationId,
    formulaContractSlug: "—",
    generatedAt: "—",
    validationStatus: "lookup_pending",
  });

  return (
    <PageLayout>
      <section className="sc-craft-section overflow-x-hidden">
        <Container size="narrow" className="sc-craft-container min-w-0 space-y-4">
          <h1 className="text-xl font-semibold text-navy">Verification record</h1>
          <VerificationSeal display={display} />
          <p className="text-sm text-body-charcoal">
            Live database lookup is not enabled in this release. This page validates ID format and
            shows the public seal shell.
          </p>
        </Container>
      </section>
    </PageLayout>
  );
}
