export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Link from "@/lib/ui-shared/navigation/next-link";
import { PageLayout } from "@/components/layout/PageLayout";
import PageHero from "@/components/shared/PageHero";
import { LegalContactBlock } from "@/components/legal/LegalContactBlock";
import { LegalPageContent } from "@/components/legal/LegalPageContent";
import { createPageMetadata } from "@/lib/infrastructure/metadata";
import type { AppLocale } from "@/i18n/routing";

export const revalidate = 3600;

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "privacy.meta" });

  return createPageMetadata({
    title: t("title"),
    description: t("description"),
    path: "/privacy",
    locale: locale as AppLocale,
  });
}

export default async function PrivacyPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("privacy");
  const tCommon = await getTranslations("legalCommon");

  const sections = [1, 2, 3, 4, 5, 6, 7, 8, 9].map((index) => ({
    title: t(`section${index}.title`),
    paragraphs: [t(`section${index}.content`)],
  }));

  return (
    <PageLayout>
      <PageHero
        eyebrow={tCommon("eyebrow")}
        title={t("title")}
        description={t("heroDescription")}
      />
      <LegalPageContent
        title={t("title")}
        effectiveDate={t("effective")}
        intro={t("intro")}
        sections={sections}
        footerNote={
          <>
            <LegalContactBlock />
            <p className="mt-6">
              {tCommon.rich("privacyFooter", {
                terms: (chunks) => (
                  <Link href="/terms" className="font-semibold text-deep-navy hover:underline">
                    {chunks}
                  </Link>
                ),
                refund: (chunks) => (
                  <Link
                    href="/refund-policy"
                    className="font-semibold text-deep-navy hover:underline"
                  >
                    {chunks}
                  </Link>
                ),
              })}
            </p>
          </>
        }
      />
    </PageLayout>
  );
}
