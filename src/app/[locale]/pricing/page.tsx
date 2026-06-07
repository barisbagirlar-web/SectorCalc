import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageLayout } from "@/components/layout/PageLayout";
import { PricingPlansGrid } from "@/components/sections/PricingPlansGrid";
import { Container } from "@/components/ui/Container";
import { createPageMetadata } from "@/lib/metadata";
import type { AppLocale } from "@/i18n/routing";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations("pricing");
  return createPageMetadata({
    title: t("title"),
    description: t("tagline"),
    path: "/pricing",
    locale: locale as AppLocale,
  });
}

export default async function PricingPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("pricing");

  return (
    <PageLayout>
      <section className="sc-pro-section sc-pro-section--alt sc-pro-section--border">
        <Container className="sc-pro-container">
          <p className="sc-pro-eyebrow">{t("eyebrow")}</p>
          <h1 className="sc-pro-title sc-pro-title--compact">{t("title")}</h1>
          <p className="sc-pro-lead">{t("tagline")}</p>
          <hr className="sc-ledger-separator" />
        </Container>
      </section>
      <PricingPlansGrid showHeader={false} tierMode="pro-focused" />
    </PageLayout>
  );
}
