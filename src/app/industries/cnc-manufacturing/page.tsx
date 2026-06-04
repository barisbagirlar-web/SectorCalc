import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageLayout } from "@/components/layout/PageLayout";
import { IndustryPageContent } from "@/components/pages/IndustryPageContent";
import { getIndustryBySlug } from "@/data/industries";
import { getIndustryHubContent } from "@/data/industry-hub-content";
import { createPageMetadata } from "@/lib/metadata";

const industry = getIndustryBySlug("cnc-manufacturing");
const hub = getIndustryHubContent("cnc-manufacturing");

export const metadata: Metadata = industry
  ? createPageMetadata({
      title: hub.hubTitle,
      description: hub.seoDescription,
      path: industry.href,
    })
  : {};

export default function CncManufacturingIndustryPage() {
  if (!industry) notFound();
  return (
    <PageLayout>
      <IndustryPageContent industry={industry} />
    </PageLayout>
  );
}
