import { getTranslations } from "next-intl/server";
// @ts-nocheck
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
    path: "/methodology",
    locale: locale as "en",
  });
}

export default async function MethodologyPage({ params }: PageProps) {
  const locale = "en";
  
  const t = await getTranslations();

  return (
    <ManifestoPageContent
      variant="methodology"
      headline={"headline"}
      lead={"lead"}
    />
  );
}
