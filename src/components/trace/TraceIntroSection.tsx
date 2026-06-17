import { getTranslations } from "next-intl/server";
import { TraceIntro } from "@/components/trace/TraceIntro";

export async function TraceIntroSection() {
  const t = await getTranslations("trace");
  const tHome = await getTranslations("home");

  return (
    <TraceIntro
      copy={{
        avatarAlt: t("title"),
        badge: t("intro.badge"),
        title: t("intro.title"),
        description: t("intro.description"),
        feature1: tHome("stats.free"),
        feature2: tHome("stats.premium"),
        cta: t("intro.cta"),
      }}
    />
  );
}
