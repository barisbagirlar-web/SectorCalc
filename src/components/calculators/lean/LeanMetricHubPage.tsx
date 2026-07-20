import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/infrastructure/metadata";
import { PageLayout } from "@/components/layout/PageLayout";
import { LeanMetricHubContent } from "@/components/calculators/lean/LeanMetricHubContent";
import { LeanMetricSsrChrome } from "@/components/calculators/lean/LeanMetricSsrChrome";
import {
  LEAN_METRIC_HUBS,
  type LeanMetricHubSlug,
} from "@/lib/features/tools/lean-metric-hubs";

type AppLocale = "en";

export async function createLeanMetricMetadata(slug: LeanMetricHubSlug): Promise<Metadata> {
  const hub = LEAN_METRIC_HUBS[slug];
  return createPageMetadata({
    title: hub.metaTitle,
    description: hub.metaDescription,
    path: hub.path,
    locale: "en" as AppLocale,
  });
}

export function LeanMetricHubPage({ slug }: { slug: LeanMetricHubSlug }) {
  const hub = LEAN_METRIC_HUBS[slug];
  return (
    <PageLayout>
      <main id="main-content" className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <LeanMetricSsrChrome hub={hub} />
        <LeanMetricHubContent slug={slug} />
      </main>
    </PageLayout>
  );
}
