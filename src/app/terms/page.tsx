export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "@/lib/i18n-stub";
import Link from "@/lib/ui-shared/navigation/next-link";
import { PageLayout } from "@/components/layout/PageLayout";
import PageHero from "@/components/shared/PageHero";
import { LegalContactBlock } from "@/components/legal/LegalContactBlock";
import { LegalPageContent } from "@/components/legal/LegalPageContent";
import { createPageMetadata } from "@/lib/infrastructure/metadata";

export const revalidate = 3600;

type PageProps = { params: Promise<{  }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = "en";
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "terms.meta" });

  return createPageMetadata({
    title: t("title"),
    description: t("description"),
    path: "/terms",
    locale: locale as AppLocale,
  });
}

export default async function TermsPage({ params }: PageProps) {
  const locale = "en";
  setRequestLocale(locale);
  const t = await getTranslations("terms");
  const tCommon = await getTranslations("legalCommon");

  const sections = [1, 2, 3, 4, 5, 6, 7].map((index) => ({
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
        effectiveDate={t("lastUpdated", { date: t("lastUpdatedDate") })}
        intro={t("intro")}
        sections={sections}
        footerNote={
          <>
            <LegalContactBlock />
            <p className="mt-6">
              {tCommon.rich("termsFooter", {
                privacy: (chunks: any) => (
                  <Link
                    href="/privacy"
                    className="font-semibold text-deep-navy hover:underline"
                  >
                    {chunks}
                  </Link>
                ),
                refund: (chunks: any) => (
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
