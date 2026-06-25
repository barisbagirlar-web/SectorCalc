import { getTranslations } from "next-intl/server";
// @ts-nocheck
import type { Metadata } from "next";
import { AuditArchivePageContent } from "@/components/os/AuditArchivePageContent";
import { createPageMetadata } from "@/lib/metadata";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = "en";
  
  const t = await getTranslations();

  return createPageMetadata({
    title: "meta.title",
    description: "meta.description",
    path: "/account/archive",
  });
}

export default async function AuditArchivePage({ params }: PageProps) {
  const locale = "en";
  

  return <AuditArchivePageContent />;
}
