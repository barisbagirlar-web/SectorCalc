import { getTranslations } from "next-intl/server";

import type { Metadata } from "next";
import { ManifestoPageContent } from "@/components/manifesto/ManifestoPageContent";
import { createPageMetadata } from "@/lib/metadata";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = "en";
  const t = await getTranslations();
  return createPageMetadata({
    title: "title",
    description: "description",
    path: "/trust",
    locale: locale as "en",
  });
}

export default async function TrustPage({ params }: PageProps) {
  const locale = "en";
  
  const t = await getTranslations();

  return (
    <ManifestoPageContent
      variant="trust"
      headline={"headline"}
      lead={"lead"}
    />
  );
}
