import type { PremiumReportExportPayload } from "@/lib/premium-schema/premium-report-export";
import { getTechnicalSimulationNotice } from "@/lib/premium-schema/premium-report-export";

export interface PremiumPrintableReportProps {
  payload: PremiumReportExportPayload;
  locale: string;
  isSample?: boolean;
}

const STATUS_LABEL: Record<PremiumReportExportPayload["executiveVerdict"]["status"], string> = {
  critical: "Critical",
  warning: "Warning",
  acceptable: "Acceptable",
};

const LEVEL_LABEL: Record<"safe" | "warning" | "critical", string> = {
  safe: "Acceptable",
  warning: "Warning",
  critical: "Critical",
};

function formatGeneratedDate(iso: string, locale: string): string {
  const parsed = Date.parse(iso);
  if (!Number.isFinite(parsed)) {
    return iso;
  }
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "long",
    timeStyle: "short",
  }).format(new Date(parsed));
}

export function PremiumPrintableReport({
  payload,
  locale,
  isSample = false,
}: PremiumPrintableReportProps) {
  const generatedLabel = formatGeneratedDate(payload.generatedAt, locale);
  const statusLabel = STATUS_LABEL[payload.executiveVerdict.status];

  return (
    <article className="sc-print-report" aria-label={payload.title}>
      {isSample ? (
        <p className="sc-print-report__sample-banner" role="note">
          Sample report — unlock the full decision report to export without this label.
        </p>
      ) : null}
      <header className="sc-print-section sc-print-report__cover">
        <p className="sc-print-report__brand">SectorCalc</p>
        <h1 className="sc-print-report__title">{payload.schemaName}</h1>
        <p className="sc-print-report__subtitle">{payload.title}</p>
        <p className="sc-print-report__meta">
          Generated {generatedLabel} · Sector: {payload.sectorSlug}
        </p>
        <p className="sc-print-report__simulation-notice">{getTechnicalSimulationNotice()}</p>
      </header>

      <section className="sc-print-section sc-print-report__executive">
        <h2 className="sc-print-section__title">Executive Summary</h2>
        <div className={`sc-print-verdict sc-print-verdict--${payload.executiveVerdict.status}`}>
          <p className="sc-print-verdict__status">{statusLabel}</p>
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
          <h2 className="sc-print-section__title">Hidden Loss Drivers</h2>
          <table className="sc-print-table">
            <thead>
              <tr>
                <th scope="col">Driver</th>
                <th scope="col">Value</th>
                <th scope="col">Description</th>
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
          <h2 className="sc-print-section__title">Threshold Check</h2>
          <table className="sc-print-table">
            <thead>
              <tr>
                <th scope="col">Metric</th>
                <th scope="col">Status</th>
                <th scope="col">Value</th>
                <th scope="col">Message</th>
              </tr>
            </thead>
            <tbody>
              {payload.thresholds.map((threshold) => (
                <tr key={threshold.label}>
                  <td>{threshold.label}</td>
                  <td>{LEVEL_LABEL[threshold.level]}</td>
                  <td>{threshold.value}</td>
                  <td>{threshold.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ) : null}

      <section className="sc-print-section sc-print-page-break">
        <h2 className="sc-print-section__title">Suggested Actions</h2>
        <ol className="sc-print-action-list">
          {payload.suggestedActions.map((action) => (
            <li key={action}>{action}</li>
          ))}
        </ol>
      </section>

      <section className="sc-print-section sc-print-page-break">
        <h2 className="sc-print-section__title">Assumptions</h2>
        <ul className="sc-print-assumption-list">
          {payload.assumptions.map((assumption) => (
            <li key={assumption}>{assumption}</li>
          ))}
        </ul>
      </section>

      <section className="sc-print-section sc-print-page-break">
        <h2 className="sc-print-section__title">Legal Note</h2>
        <p className="sc-print-legal">{payload.legalNote}</p>
      </section>

      <footer className="sc-print-section sc-print-report__footer">
        <p className="sc-print-report__footer-brand">SectorCalc</p>
        <p className="sc-print-report__footer-id">Report ID: {payload.reportId}</p>
      </footer>
    </article>
  );
}
