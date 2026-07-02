import { getTranslations } from "@/lib/i18n-stub";
import { TraceIntro } from "@/components/trace/TraceIntro";
import { getHomepageCatalogToolCounts } from "@/lib/ui-shared/home/homepage-stats";

export async function TraceIntroSection() {
  const t = await getTranslations("trace");
  const { freeCount, premiumCount } = getHomepageCatalogToolCounts();

  return (
    <TraceIntro
      copy={{
        avatarAlt: t("title"),
        badge: t("intro.badge"),
        title: t("intro.title"),
        description: t("intro.description"),
        feature1: t("intro.feature1", { count: freeCount }),
        feature2: t("intro.feature2", { count: premiumCount }),
        cta: t("intro.cta"),
      }}
    />
  );
}
