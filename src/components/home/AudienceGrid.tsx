import { getTranslations } from "@/lib/i18n-stub";
import { Container } from "@/components/ui/Container";
import { HomepageStrokeIcon } from "@/components/home/HomepageStrokeIcon";
import { HOMEPAGE_AUDIENCE_ICON_MAP } from "@/lib/ui-shared/home/homepage-icon-map";
import { resolveHomepageMessage } from "@/lib/ui-shared/home/homepage-component-utils";
import { HOMEPAGE_AUDIENCE_IDS } from "@/lib/ui-shared/home/homepage-positioning-data";

export async function AudienceGrid() {
  const t = await getTranslations("homepageHybrid");

  return (
    <section
      className="sc-home-omni__section sc-home-omni__section--surface"
      aria-labelledby="home-audiences-heading"
    >
      <Container size="wide" className="sc-pro-container sc-pro-container--wide min-w-0">
        <header className="sc-home-omni__section-head">
          <h2 id="home-audiences-heading" className="sc-home-omni__section-title">
            {t("audiences.title")}
          </h2>
        </header>
        <ul className="sc-home-omni__audience-grid">
          {HOMEPAGE_AUDIENCE_IDS.map((id) => {
            const Icon = HOMEPAGE_AUDIENCE_ICON_MAP[id];

            return (
              <li key={id}>
                <article className="sc-home-omni__audience-card">
                  <HomepageStrokeIcon icon={Icon} className="sc-home-omni__audience-icon" />
                  <div className="sc-home-omni__audience-body">
                    <h3 className="sc-home-omni__audience-title">{t(`audiences.items.${id}.title`)}</h3>
                    <p className="sc-home-omni__audience-text">
                      {resolveHomepageMessage(
                        t,
                        `audiences.items.${id}.examples`,
                        `audiences.items.${id}.text`,
                      )}
                    </p>
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
