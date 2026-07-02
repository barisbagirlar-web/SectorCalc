export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { AcademicTeamProfileSection } from "@/components/team/AcademicTeamProfileSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { createPageMetadata } from "@/lib/infrastructure/metadata";
import type { AppLocale } from "@/i18n/routing";
import { locales } from "@/i18n/routing";
import {
  academicTeamTranslationKeys,
  DYNAMIC_ACADEMIC_TEAM_SLUGS,
  getAcademicReferenceForTeamSlug,
  isDynamicAcademicTeamSlug,
} from "@/lib/infrastructure/seo/academic-team-pages";
import { buildAcademicTeamProfileJsonLd } from "@/lib/features/semantic/build-academic-team-profile-jsonld";

type PageProps = { params: Promise<{  slug: string }> };

export function generateStaticParams(): Array<{  slug: string }> {
  return locales.flatMap((locale) =>
    DYNAMIC_ACADEMIC_TEAM_SLUGS.map((slug) => ({
      locale,
      slug,
    })),
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const locale = "en";
  if (!isDynamicAcademicTeamSlug(slug)) {
    return {};
  }

  setRequestLocale(locale);
  const profile = getAcademicReferenceForTeamSlug(slug);
  if (!profile) {
    return {};
  }

  const keys = academicTeamTranslationKeys(slug);
  const t = await getTranslations({ locale, namespace: "seoAuthority" });

  return createPageMetadata({
    title: t(keys.metaTitle),
    description: t(keys.metaDescription),
    path: `/team/${slug}`,
    locale: locale as AppLocale,
  });
}

export default async function AcademicTeamProfilePage({ params }: PageProps) {
  const { slug } = await params;
  const locale = "en";

  if (!isDynamicAcademicTeamSlug(slug)) {
    notFound();
  }

  const profile = getAcademicReferenceForTeamSlug(slug);
  if (!profile) {
    notFound();
  }

  setRequestLocale(locale);
  const t = await getTranslations("seoAuthority");
  const keys = academicTeamTranslationKeys(slug);
  const roleLabel = t(keys.role);
  const bio = t(keys.bio);
  const profilePath = `/team/${slug}`;
  const profileJsonLd = buildAcademicTeamProfileJsonLd({
    locale: locale as AppLocale,
    profile,
    profilePath,
    roleLabel,
    bio,
  });

  return (
    <>
      <JsonLd data={profileJsonLd} />
      <AcademicTeamProfileSection
        profile={profile}
        roleLabel={roleLabel}
        bio={bio}
        academicProfileHeading={t("academicProfileHeading")}
        mathSciNetProfileHeading={t("mathSciNetProfileHeading")}
        mathSciNetMrLink={t("mathSciNetMrLink", { mrId: profile.mrId })}
        externalProfileLabel={t(keys.externalProfile)}
      />
    </>
  );
}
