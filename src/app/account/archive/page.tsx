export const dynamic = "force-dynamic";

import { getTranslations } from "next-intl/server";

import type { Metadata } from "next";
import { AuditArchivePageContent } from "@/components/os/AuditArchivePageContent";
import { createPageMetadata } from "@/lib/metadata";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = "en";

  const t = await getTranslations("auditArchive");

  return createPageMetadata({
    title: t("meta.title"),
    description: t("meta.description"),
    path: "/account/archive",
  });
}

export default async function AuditArchivePage({ params }: PageProps) {
  const locale = "en";


  return <AuditArchivePageContent />;
}
