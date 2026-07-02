import { getTranslations } from "@/lib/i18n-stub";

interface HomeOperationsValueSectionProps {
  locale: string;
}

export async function HomeOperationsValueSection({ locale }: HomeOperationsValueSectionProps) {
  const t = await getTranslations({ locale, namespace: "homeOperationsValueSection" });
  const cardCount = 3;

  return (
    <section className="mc-home-operations" aria-labelledby="home-operations-heading">
      <div className="container">
        <h2 id="home-operations-heading">{t("heading")}</h2>
        <div className="mc-home-operations-grid">
          {Array.from({ length: cardCount }, (_, i) => (
            <article key={i} className="mc-home-operations-card">
              <h3>{t(`card${i}.title`)}</h3>
              <p>{t(`card${i}.description`)}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
