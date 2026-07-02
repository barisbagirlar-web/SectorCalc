import { getTranslations } from "@/lib/i18n-stub";
import { listSectorRegistryKeys } from "@/lib/os/registry/sectors";

const METRIC_KEYS = ["sectors", "engine", "confidence", "gate"] as const;

export async function SystemStatusWidget() {
  const t = await getTranslations("industrialHome");
  const sectorCount = listSectorRegistryKeys().length;

  return (
    <section className="ind-os-section" aria-labelledby="system-status-heading">
      <h2 id="system-status-heading" className="ind-os-section-title">
        {t("systemStatus.title")}
      </h2>
      <dl className="ind-os-metric-grid">
        {METRIC_KEYS.map((key) => (
          <div key={key} className="ind-os-metric">
            <dt className="ind-os-metric__label">{t(`systemStatus.metrics.${key}.label`)}</dt>
            <dd className="ind-os-metric__value data-value">
              {key === "sectors"
                ? t("systemStatus.metrics.sectors.value", { count: sectorCount })
                : t(`systemStatus.metrics.${key}.value`)}
            </dd>
          </div>
        ))}
      </dl>
      <p className="ind-os-caption mt-2">{t("systemStatus.line")}</p>
    </section>
  );
}
