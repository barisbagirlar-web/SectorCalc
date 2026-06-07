import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { AuditArchivePageContent } from "@/components/os/AuditArchivePageContent";
import { createPageMetadata } from "@/lib/metadata";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("auditArchive");

  return createPageMetadata({
    title: t("meta.title"),
    description: t("meta.description"),
    path: "/account/archive",
  });
}

export default async function AuditArchivePage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <AuditArchivePageContent />;
}
