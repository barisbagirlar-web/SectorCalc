export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "@/lib/i18n-stub";
import { PageLayout } from "@/components/layout/PageLayout";
import { Container } from "@/components/ui/Container";
import PageHero from "@/components/shared/PageHero";
import { VerifyReportForm } from "@/components/trust-trace/VerifyReportForm";
import { DecisionToolLegalDisclaimer } from "@/components/tools/DecisionToolLegalDisclaimer";
import { createPageMetadata } from "@/lib/infrastructure/metadata";
import type { AppLocale } from "@/i18n/routing";

type PageProps = {
  params: Promise<{  }>;
  searchParams: Promise<{ reportId?: string; hash?: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = "en";
  const t = await getTranslations({ locale, namespace: "verify" });
  return createPageMetadata({
    title: t("metaTitle"),
    description: t("metaDescription"),
    path: "/verify",
    locale: locale as AppLocale,
  });
}

export default async function VerifyPage({ params, searchParams }: PageProps) {
  const locale = "en";
  const { reportId, hash } = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "verify" });

  return (
    <PageLayout>
      <PageHero
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("description")}
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
