import { getTranslations } from "@/lib/i18n-stub";
import { Container } from "@/components/ui/Container";
import { HomepageStrokeIcon } from "@/components/home/HomepageStrokeIcon";
import { HOMEPAGE_EXCEL_ICON_MAP } from "@/lib/ui-shared/home/homepage-icon-map";
import { HOMEPAGE_EXCEL_IDS } from "@/lib/ui-shared/home/homepage-positioning-data";

export async function LimitsGrid() {
  const t = await getTranslations("homepageHybrid");

  return (
    <section className="sc-home-omni__section" aria-labelledby="home-excel-heading">
      <Container size="wide" className="sc-pro-container sc-pro-container--wide min-w-0">
        <header className="sc-home-omni__section-head">
          <h2 id="home-excel-heading" className="sc-home-omni__section-title">
            {t("whyNotExcel.title")}
          </h2>
        </header>
        <ul className="sc-home-omni__why-grid">
          {HOMEPAGE_EXCEL_IDS.map((id) => {
            const Icon = HOMEPAGE_EXCEL_ICON_MAP[id];

            return (
              <li key={id}>
                <article className="sc-home-omni__why-card">
                  <HomepageStrokeIcon icon={Icon} className="sc-home-omni__why-icon" />
                  <h3 className="sc-home-omni__why-card-title">{t(`whyNotExcel.items.${id}.title`)}</h3>
                  <p className="sc-home-omni__why-card-text">{t(`whyNotExcel.items.${id}.text`)}</p>
                </article>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
