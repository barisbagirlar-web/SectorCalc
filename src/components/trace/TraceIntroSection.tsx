import { getHomepageCatalogToolCounts } from "@/lib/home/homepage-stats";
import { TraceIntro } from "@/components/trace/TraceIntro";

export function TraceIntroSection() {
  const { freeCount, premiumCount } = getHomepageCatalogToolCounts();

  return <TraceIntro freeCount={freeCount} premiumCount={premiumCount} />;
}
