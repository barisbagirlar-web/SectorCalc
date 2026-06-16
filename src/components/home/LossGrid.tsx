import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { HomepageStrokeIcon } from "@/components/home/HomepageStrokeIcon";
import { HOMEPAGE_LOSS_ICON_MAP } from "@/lib/home/homepage-icon-map";
import { resolveHomepageMessage } from "@/lib/home/homepage-component-utils";
import { HOMEPAGE_LOSS_IDS } from "@/lib/home/homepage-positioning-data";

export async function LossGrid() {
  const t = await getTranslations("homepageHybrid");
  const subtitle = t.has("losses.subtitle") ? t("losses.subtitle") : "";

  return (
    <section className="sc-home-omni__section" aria-labelledby="home-losses-heading">
      <Container size="wide" className="sc-pro-container sc-pro-container--wide min-w-0">
        <header className="sc-home-omni__section-head">
          <h2 id="home-losses-heading" className="sc-home-omni__section-title">
            {t("losses.title")}
          </h2>
          {subtitle ? <p className="sc-home-omni__section-lead">{subtitle}</p> : null}
        </header>
        <ul className="sc-home-omni__loss-grid">
          {HOMEPAGE_LOSS_IDS.map((id) => {
            const Icon = HOMEPAGE_LOSS_ICON_MAP[id];

            return (
              <li key={id}>
                <article className="sc-home-omni__loss-card">
                  <HomepageStrokeIcon icon={Icon} className="sc-home-omni__loss-icon" />
                  <h3 className="sc-home-omni__loss-title">{t(`losses.items.${id}.title`)}</h3>
                  <p className="sc-home-omni__loss-text">
                    {resolveHomepageMessage(t, `losses.items.${id}.examples`, `losses.items.${id}.text`)}
                  </p>
                </article>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
