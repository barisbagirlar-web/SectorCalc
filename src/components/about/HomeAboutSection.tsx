import { getTranslations } from "@/lib/i18n-stub";
import Link from "next/link";

export async function HomeAboutSection() {
  const t = await getTranslations("homeAbout");

  return (
    <section
      className="sc-about-container"
      data-home-about-section="true"
      aria-labelledby="home-about-title"
    >
      <h2 id="home-about-title" className="sc-about-title">
        {t("title")}
      </h2>

      <p className="sc-about-text">{t("paragraph1")}</p>
      <p className="sc-about-text">{t("paragraph2")}</p>

      <div className="sc-about-belief">
        <h3 className="sc-about-belief-title">{t("beliefTitle")}</h3>
        <p className="sc-about-belief-subtitle">{t("beliefSubtitle")}</p>
      </div>

      <div className="sc-about-highlight">
        <span className="sc-about-highlight-primary">{t("highlightPrimary")}</span>
        <br />
        <span className="sc-about-highlight-secondary">{t("highlightSecondary")}</span>
      </div>

      <Link
        href="/about-us"
        className="sc-about-cta"
        data-home-about-cta="true"
        aria-label={t("ctaAria")}
      >
        {t("cta")}
      </Link>
    </section>
  );
}
