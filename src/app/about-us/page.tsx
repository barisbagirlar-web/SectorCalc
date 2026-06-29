import { getTranslations } from "next-intl/server";

import type { Metadata } from "next";
import { AboutDetailContent } from "@/components/about/AboutDetailContent";
import { createPageMetadata } from "@/lib/metadata";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = "en";
  const t = await getTranslations();
  return createPageMetadata({
    title: "seoTitle",
    description: "seoDescription",
    path: "/about-us",
    locale: locale as "en",
  });
}

export default async function AboutUsPage({ params }: PageProps) {
  const locale = "en";
  

  return <AboutDetailContent />;
}
