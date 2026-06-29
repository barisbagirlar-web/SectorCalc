export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageLayout } from "@/components/layout/PageLayout";
import { JsonLd } from "@/components/seo/JsonLd";
import { Container } from "@/components/ui/Container";
import { GUIDE_REFERENCE_AUTHOR, guideReferenceAuthorJsonLdId } from "@/config/guide-reference-author";
import { createPageMetadata } from "@/lib/metadata";
import type { AppLocale } from "@/i18n/routing";
import { SITE_URL } from "@/lib/semantic/site-url";
import { sanitizeJsonLd, type JsonLdRecord } from "@/lib/seo/schema-mesh";


type PageProps = { params: Promise<{ locale: string }> };

function buildWilSchildersProfileJsonLd(locale: AppLocale, bio: string, role: string): JsonLdRecord {
  return sanitizeJsonLd({
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    name: GUIDE_REFERENCE_AUTHOR.name,
    url: `${SITE_URL}/${locale}${GUIDE_REFERENCE_AUTHOR.profilePath}`,
    mainEntity: {
      "@type": "Person",
      "@id": guideReferenceAuthorJsonLdId(),
      name: GUIDE_REFERENCE_AUTHOR.name,
      jobTitle: role,
      description: bio,
      sameAs: GUIDE_REFERENCE_AUTHOR.sameAs,
      knowsAbout: GUIDE_REFERENCE_AUTHOR.knowsAbout,
    },
  }) as JsonLdRecord;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "seoAuthority" });

  return createPageMetadata({
    title: t("teamWilMetaTitle"),
    description: t("teamWilMetaDescription"),
    path: GUIDE_REFERENCE_AUTHOR.profilePath,
    locale: locale as AppLocale,
  });
}

export default async function WilSchildersTeamPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("seoAuthority");
  const role = GUIDE_REFERENCE_AUTHOR.role[locale as AppLocale] ?? GUIDE_REFERENCE_AUTHOR.role.en;
  const profileJsonLd = buildWilSchildersProfileJsonLd(locale as AppLocale, t("teamWilBio"), role);

  return (
    <PageLayout>
      <JsonLd data={profileJsonLd} />
      <section className="bg-white py-16 sm:py-24">
        <Container size="wide">
          <div className="mx-auto max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">{role}</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
              {t("teamWilHeading")}
            </h1>
            <p className="mt-4 text-base leading-relaxed text-text-secondary">{t("teamWilBio")}</p>
            <a
              href={GUIDE_REFERENCE_AUTHOR.externalProfileUrl}
              target="_blank"
              rel="author noopener noreferrer"
              className="mt-6 inline-flex min-h-[44px] items-center text-sm font-semibold text-deep-navy underline underline-offset-2"
            >
              {t("teamWilExternalProfile")}
            </a>
          </div>
        </Container>
      </section>
    </PageLayout>
  );
}
