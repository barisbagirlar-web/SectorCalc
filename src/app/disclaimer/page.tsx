export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "@/lib/i18n-stub";
import Link from "@/lib/ui-shared/navigation/next-link";
import { PageLayout } from "@/components/layout/PageLayout";
import PageHero from "@/components/shared/PageHero";
import { LegalPageContent } from "@/components/legal/LegalPageContent";
import { CONTACT_EMAILS } from "@/config/contact";
import { createPageMetadata } from "@/lib/infrastructure/metadata";
import type { AppLocale } from "@/i18n/routing";

type PageProps = { params: Promise<{  }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = "en";
  const t = await getTranslations({ locale, namespace: "disclaimerPage" });
  return createPageMetadata({
    title: t("meta.title"),
    description: t("meta.description"),
    path: "/disclaimer",
    locale: locale as AppLocale,
  });
}

export default async function DisclaimerPage({ params }: PageProps) {
  const locale = "en";
  setRequestLocale(locale);
  const t = await getTranslations("disclaimerPage");

  const rawSections = t.raw("sections") as Array<{
    title: string;
    paragraphs: string[];
  }>;

  const sections = rawSections.map((section, index) => ({
    title: section.title,
    paragraphs:
      index === 5
        ? [(section.paragraphs?.[0] ?? "").replace("{email}", CONTACT_EMAILS.hello)]
        : section.paragraphs ?? [],
  }));

  return (
    <PageLayout>
      <PageHero
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("description")}
      />
      <LegalPageContent
        title={t("title")}
        intro={t("intro")}
        sections={sections}
        footerNote={
          <p>
            {t("footerSeparator")}{" "}
            <Link href="/terms" className="font-semibold text-deep-navy hover:underline">
              {t("footerTerms")}
            </Link>{" "}
            {t("footerSeparator")}{" "}
            <Link
              href="/privacy"
              className="font-semibold text-deep-navy hover:underline"
            >
              {t("footerPrivacy")}
            </Link>
            .
          </p>
        }
      />
    </PageLayout>
  );
}
