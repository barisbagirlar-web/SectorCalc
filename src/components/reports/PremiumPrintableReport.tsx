import type { PremiumReportExportPayload } from "@/lib/premium-schema/premium-report-export";
import { getTechnicalSimulationNotice } from "@/lib/premium-schema/premium-report-export";
import { formatLocalizedDate, normalizeLocale } from "@/lib/format/localization";

export interface PremiumPrintableReportProps {
  payload: PremiumReportExportPayload;
  locale: string;
  isSample?: boolean;
}

interface PrintLabels {
  readonly sampleBanner: string;
  readonly generated: string;
  readonly sector: string;
  readonly executiveSummary: string;
  readonly hiddenLossDrivers: string;
  readonly driver: string;
  readonly value: string;
  readonly description: string;
  readonly thresholdCheck: string;
  readonly metric: string;
  readonly status: string;
  readonly message: string;
  readonly suggestedActions: string;
  readonly assumptions: string;
  readonly legalNote: string;
  readonly reportId: string;
  readonly critical: string;
  readonly warning: string;
  readonly acceptable: string;
}

const PRINT_LABELS: Record<"en" | "tr", PrintLabels> = {
  en: {
    sampleBanner: "Sample report — unlock the full decision report to export without this label.",
    generated: "Generated",
    sector: "Sector",
    executiveSummary: "Executive Summary",
    hiddenLossDrivers: "Hidden Loss Drivers",
    driver: "Driver",
    value: "Value",
    description: "Description",
    thresholdCheck: "Threshold Check",
    metric: "Metric",
    status: "Status",
    message: "Message",
    suggestedActions: "Suggested Actions",
    assumptions: "Assumptions",
    legalNote: "Legal Note",
    reportId: "Report ID",
    critical: "Critical",
    warning: "Warning",
    acceptable: "Acceptable",
  },
  tr: {
    sampleBanner:
      "Örnek rapor — etiketsiz dışa aktarmak için tam karar raporunun kilidini açın.",
    generated: "Oluşturulma",
    sector: "Sektör",
    executiveSummary: "Yönetici Özeti",
    hiddenLossDrivers: "Görünmeyen Kayıp Kalemleri",
    driver: "Kalem",
    value: "Değer",
    description: "Açıklama",
    thresholdCheck: "Eşik Kontrolü",
    metric: "Metrik",
    status: "Durum",
    message: "Mesaj",
    suggestedActions: "Önerilen Adımlar",
    assumptions: "Varsayımlar",
    legalNote: "Yasal Not",
    reportId: "Rapor No",
    critical: "Kritik",
    warning: "Uyarı",
    acceptable: "Kabul edilebilir",
  },
};

function statusLabel(
  status: PremiumReportExportPayload["executiveVerdict"]["status"],
  labels: PrintLabels,
): string {
  switch (status) {
    case "critical":
      return labels.critical;
    case "warning":
      return labels.warning;
    case "acceptable":
      return labels.acceptable;
  }
}

function levelLabel(level: "safe" | "warning" | "critical", labels: PrintLabels): string {
  switch (level) {
    case "critical":
      return labels.critical;
    case "warning":
      return labels.warning;
    case "safe":
      return labels.acceptable;
  }
}

export function PremiumPrintableReport({
  payload,
  locale,
  isSample = false,
}: PremiumPrintableReportProps) {
  const formatLocale = normalizeLocale(locale);
  const labels = PRINT_LABELS[formatLocale];
  const generatedLabel = formatLocalizedDate(payload.generatedAt, formatLocale);
  const verdictStatusLabel = statusLabel(payload.executiveVerdict.status, labels);

  return (
    <article className="sc-print-report" aria-label={payload.title}>
      {isSample ? (
        <p className="sc-print-report__sample-banner" role="note">
          {labels.sampleBanner}
        </p>
      ) : null}
      <header className="sc-print-section sc-print-report__cover">
        <p className="sc-print-report__brand">SectorCalc</p>
        <h1 className="sc-print-report__title">{payload.schemaName}</h1>
        <p className="sc-print-report__subtitle">{payload.title}</p>
        <p className="sc-print-report__meta">
          {labels.generated} {generatedLabel} · {labels.sector}: {payload.sectorSlug}
        </p>
        <p className="sc-print-report__simulation-notice">
          {getTechnicalSimulationNotice(formatLocale)}
        </p>
      </header>

      <section className="sc-print-section sc-print-report__executive">
        <h2 className="sc-print-section__title">{labels.executiveSummary}</h2>
        <div className={`sc-print-verdict sc-print-verdict--${payload.executiveVerdict.status}`}>
          <p className="sc-print-verdict__status">{verdictStatusLabel}</p>
          <p className="sc-print-verdict__headline">{payload.executiveVerdict.verdict}</p>
          <p className="sc-print-verdict__explanation">{payload.executiveVerdict.explanation}</p>
        </div>
        <div className="sc-print-big-number">
          <p className="sc-print-big-number__label">{payload.bigNumber.label}</p>
          <p className="sc-print-big-number__value">{payload.bigNumber.value}</p>
          {payload.bigNumber.unit ? (
            <p className="sc-print-big-number__unit">{payload.bigNumber.unit}</p>
          ) : null}
        </div>
      </section>

      {payload.hiddenDrivers.length > 0 ? (
        <section className="sc-print-section sc-print-page-break">
          <h2 className="sc-print-section__title">{labels.hiddenLossDrivers}</h2>
          <table className="sc-print-table">
            <thead>
              <tr>
                <th scope="col">{labels.driver}</th>
                <th scope="col">{labels.value}</th>
                <th scope="col">{labels.description}</th>
              </tr>
            </thead>
            <tbody>
              {payload.hiddenDrivers.map((driver) => (
                <tr key={driver.label}>
                  <td>{driver.label}</td>
                  <td>{driver.value}</td>
                  <td>{driver.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ) : null}

      {payload.thresholds.length > 0 ? (
        <section className="sc-print-section sc-print-page-break">
          <h2 className="sc-print-section__title">{labels.thresholdCheck}</h2>
          <table className="sc-print-table">
            <thead>
              <tr>
                <th scope="col">{labels.metric}</th>
                <th scope="col">{labels.status}</th>
                <th scope="col">{labels.value}</th>
                <th scope="col">{labels.message}</th>
              </tr>
            </thead>
            <tbody>
              {payload.thresholds.map((threshold) => (
                <tr key={threshold.label}>
                  <td>{threshold.label}</td>
                  <td>{levelLabel(threshold.level, labels)}</td>
                  <td>{threshold.value}</td>
                  <td>{threshold.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ) : null}

      <section className="sc-print-section sc-print-page-break">
        <h2 className="sc-print-section__title">{labels.suggestedActions}</h2>
        <ol className="sc-print-action-list">
          {payload.suggestedActions.map((action) => (
            <li key={action}>{action}</li>
          ))}
        </ol>
      </section>

      <section className="sc-print-section sc-print-page-break">
        <h2 className="sc-print-section__title">{labels.assumptions}</h2>
        <ul className="sc-print-assumption-list">
          {payload.assumptions.map((assumption) => (
            <li key={assumption}>{assumption}</li>
          ))}
        </ul>
      </section>

      <section className="sc-print-section sc-print-page-break">
        <h2 className="sc-print-section__title">{labels.legalNote}</h2>
        <p className="sc-print-legal">{payload.legalNote}</p>
      </section>

      <footer className="sc-print-section sc-print-report__footer">
        <p className="sc-print-report__footer-brand">SectorCalc</p>
        <p className="sc-print-report__footer-id">
          {labels.reportId}: {payload.reportId}
        </p>
      </footer>
    </article>
  );
}
