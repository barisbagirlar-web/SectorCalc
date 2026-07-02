import Link from "next/link";
import { Gauge } from "lucide-react";
import { getTranslations } from "@/lib/i18n-stub";
import { Container } from "@/components/ui/Container";
import { HomepageStrokeIcon } from "@/components/home/HomepageStrokeIcon";
import { HOMEPAGE_POPULAR_TOOL_ICON_MAP } from "@/lib/ui-shared/home/homepage-icon-map";
import { resolveHomepageMessage } from "@/lib/ui-shared/home/homepage-component-utils";
import {
  HOMEPAGE_POPULAR_CATEGORY_GROUP_ID,
  HOMEPAGE_POPULAR_TOOLS,
  isHomepageCriticalToolLive,
  resolveHomepageCriticalToolHref,
} from "@/lib/ui-shared/home/homepage-positioning-data";

export async function PopularTools() {
  const t = await getTranslations("homepageHybrid");

  return (
    <section className="sc-home-omni__section" aria-labelledby="home-critical-heading">
      <Container size="wide" className="sc-pro-container sc-pro-container--wide min-w-0">
        <header className="sc-home-omni__section-head">
          <h2 id="home-critical-heading" className="sc-home-omni__section-title">
            {t("criticalTools.title")}
          </h2>
        </header>
        <ul className="sc-home-omni__popular-grid">
          {HOMEPAGE_POPULAR_TOOLS.map((entry) => {
            const href = resolveHomepageCriticalToolHref(entry.tool);
            const live = isHomepageCriticalToolLive(entry.tool);
            const name = t(`criticalTools.groups.${entry.groupId}.items.${entry.tool.id}.title`);
            const category = resolveHomepageMessage(
              t,
              `criticalTools.popularCategories.${entry.categoryKey}`,
              `criticalTools.groups.${HOMEPAGE_POPULAR_CATEGORY_GROUP_ID[entry.categoryKey] ?? entry.groupId}.title`,
            );
            const Icon = HOMEPAGE_POPULAR_TOOL_ICON_MAP[entry.tool.id] ?? Gauge;

            const card = (
              <>
                <HomepageStrokeIcon icon={Icon} className="sc-home-omni__popular-icon" size={32} />
                <span className="sc-home-omni__popular-badge">{category}</span>
                <span className="sc-home-omni__popular-title">{name}</span>
              </>
            );

            if (href && live) {
              return (
                <li key={`${entry.groupId}-${entry.tool.id}`}>
                  <Link href={href} className="sc-home-omni__popular-card">
                    {card}
                  </Link>
                </li>
              );
            }

            return (
              <li key={`${entry.groupId}-${entry.tool.id}`}>
                <div className="sc-home-omni__popular-card">{card}</div>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
