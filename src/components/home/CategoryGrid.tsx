import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { HomepageStrokeIcon } from "@/components/home/HomepageStrokeIcon";
import { HOMEPAGE_COVERAGE_ICON_MAP } from "@/lib/home/homepage-icon-map";
import { readHomepageStringArray } from "@/lib/home/homepage-component-utils";
import { HOMEPAGE_COVERAGE_IDS } from "@/lib/home/homepage-positioning-data";

export async function CategoryGrid() {
  const t = await getTranslations("homepageHybrid");
  const subtitle = t("coverage.subtitle");

  return (
    <section
      className="sc-home-omni__section sc-home-omni__section--surface"
      aria-labelledby="home-coverage-heading"
    >
      <Container size="wide" className="sc-pro-container sc-pro-container--wide min-w-0">
        <header className="sc-home-omni__section-head">
          <h2 id="home-coverage-heading" className="sc-home-omni__section-title">
            {t("coverage.title")}
          </h2>
          {subtitle ? <p className="sc-home-omni__section-lead">{subtitle}</p> : null}
        </header>
        <ul className="sc-home-omni__category-grid">
          {HOMEPAGE_COVERAGE_IDS.map((id) => {
            const tags = readHomepageStringArray(t.raw(`coverage.items.${id}.tags`));
            const Icon = HOMEPAGE_COVERAGE_ICON_MAP[id];

            return (
              <li key={id}>
                <article className="sc-home-omni__category-card">
                  <span className="sc-home-omni__category-icon">
                    <HomepageStrokeIcon icon={Icon} />
                  </span>
                  <h3 className="sc-home-omni__category-name">
                    {t(`coverage.items.${id}.shortTitle`)}
                  </h3>
                  <div className="sc-home-omni__category-tags">
                    {tags.map((tag) => (
                      <span key={tag} className="sc-home-omni__category-tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
