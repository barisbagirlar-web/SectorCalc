"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { LedgerNumberTick } from "@/components/ui/LedgerNumberTick";
import { PremiumReportExportActions } from "@/components/reports/PremiumReportExportActions";
import { buildPremiumReportExportPayload } from "@/lib/premium-schema/premium-report-export";
import type {
  PremiumCalculatorSchema,
  PremiumSchemaEngineResult,
  ThresholdSeverity,
} from "@/lib/premium-schema/premium-calculator-schema";
import {
  getAssumptionLines,
  getBigNumberMeaning,
  getHiddenDriverOutputs,
  getOutputMeaning,
  getSuggestedActionSteps,
  getThresholdSummary,
  getVerdictFromThresholds,
  type ExecutiveVerdict,
  type ThresholdSummaryItem,
} from "@/lib/premium-schema/format-premium-result";
import { worstThresholdSeverity } from "@/lib/premium-schema/premium-schema-engine";

export type PremiumDecisionReportPreviewProps = {
  schema: PremiumCalculatorSchema;
  result: PremiumSchemaEngineResult;
  locale: string;
  /** Hide sections already shown above the fold on mobile */
  compact?: boolean;
};

const VERDICT_CLASS: Record<ExecutiveVerdict["status"], string> = {
  Critical: "sc-premium-verdict sc-premium-verdict--critical",
  Warning: "sc-premium-verdict sc-premium-verdict--warning",
  Acceptable: "sc-premium-verdict sc-premium-verdict--safe",
};

const LEVEL_CLASS: Record<ThresholdSummaryItem["level"], string> = {
  critical: "sc-premium-threshold-row sc-premium-threshold-row--critical",
  warning: "sc-premium-threshold-row sc-premium-threshold-row--warning",
  safe: "sc-premium-threshold-row sc-premium-threshold-row--safe",
};

function ExecutiveVerdictBlock({
  verdict,
  statusLabel,
}: {
  verdict: ExecutiveVerdict;
  statusLabel: string;
}) {
  return (
    <section className={VERDICT_CLASS[verdict.status]} aria-label="Executive verdict">
      <p className="sc-premium-verdict__status">{statusLabel}</p>
      <p className="sc-premium-verdict__headline">{verdict.verdict}</p>
      <p className="sc-premium-verdict__explanation">{verdict.explanation}</p>
    </section>
  );
}

function BigNumberSummary({
  result,
  meaningLabel,
}: {
  result: PremiumSchemaEngineResult;
  meaningLabel: string;
}) {
  return (
    <section className="sc-premium-decision-report__big-number" aria-label="Primary exposure">
      <p className="sc-premium-report-section__title">{result.bigNumber.label}</p>
      <LedgerNumberTick
        value={result.bigNumber.formatted}
        className="sc-ledger-big-number sc-result-primary sc-premium-decision-report__value"
      />
      {result.bigNumber.unit ? (
        <p className="sc-premium-decision-report__unit">{result.bigNumber.unit}</p>
      ) : null}
      <p className="sc-premium-decision-report__meaning">
        <span className="sc-premium-decision-report__meaning-label">{meaningLabel}</span>
        {getBigNumberMeaning(result.bigNumber.format)}
      </p>
    </section>
  );
}

function LossDriverBreakdown({
  result,
  title,
  intro,
}: {
  result: PremiumSchemaEngineResult;
  title: string;
  intro: string;
}) {
  const drivers = getHiddenDriverOutputs(result);
  if (drivers.length === 0) {
    return null;
  }

  return (
    <section className="sc-premium-decision-report__section">
      <h3 className="sc-premium-decision-report__heading">{title}</h3>
      <p className="sc-premium-decision-report__intro">{intro}</p>
      <dl className="sc-premium-driver-grid">
        {drivers.map((output) => (
          <div key={output.id} className="sc-premium-driver-grid__item">
            <dt className="sc-premium-driver-grid__label">{output.label}</dt>
            <dd className="sc-premium-driver-grid__value">{output.formatted}</dd>
            <dd className="sc-premium-driver-grid__hint">{getOutputMeaning(output)}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function ThresholdStatusSection({
  items,
  title,
}: {
  items: readonly ThresholdSummaryItem[];
  title: string;
}) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section className="sc-premium-decision-report__section">
      <h3 className="sc-premium-decision-report__heading">{title}</h3>
      <ul className="sc-premium-threshold-list">
        {items.map((item) => (
          <li key={item.fieldId} className={LEVEL_CLASS[item.level]}>
            <div className="sc-premium-threshold-row__meta">
              <span className="sc-premium-threshold-row__label">{item.fieldLabel}</span>
              <span className="sc-premium-threshold-row__value">{item.value}</span>
            </div>
            <p className="sc-premium-threshold-row__message">{item.message}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

function SuggestedActionSection({
  severity,
  engineAction,
  title,
  immediateLabel,
  monitoringLabel,
  decisionLabel,
}: {
  severity: ThresholdSeverity;
  engineAction: string;
  title: string;
  immediateLabel: string;
  monitoringLabel: string;
  decisionLabel: string;
}) {
  const steps = getSuggestedActionSteps(severity);

  return (
    <section className="sc-premium-decision-report__section sc-premium-decision-report__action">
      <h3 className="sc-premium-decision-report__heading">{title}</h3>
      <p className="sc-premium-decision-report__action-lead">{engineAction}</p>
      <ul className="sc-premium-action-steps">
        <li>
          <span className="sc-premium-action-steps__label">{immediateLabel}</span>
          {steps.immediate}
        </li>
        <li>
          <span className="sc-premium-action-steps__label">{monitoringLabel}</span>
          {steps.monitoring}
        </li>
        <li>
          <span className="sc-premium-action-steps__label">{decisionLabel}</span>
          {steps.decision}
        </li>
      </ul>
    </section>
  );
}

function AssumptionsSection({
  lines,
  legalNote,
  assumptionsTitle,
  legalTitle,
}: {
  lines: readonly string[];
  legalNote: string;
  assumptionsTitle: string;
  legalTitle: string;
}) {
  return (
    <section className="sc-premium-decision-report__section sc-premium-decision-report__assumptions">
      <h3 className="sc-premium-decision-report__heading">{assumptionsTitle}</h3>
      <ul className="sc-premium-assumption-list">
        {lines.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
      <h4 className="sc-premium-decision-report__legal-title">{legalTitle}</h4>
      <p className="sc-premium-decision-report__legal">{legalNote}</p>
    </section>
  );
}

function ExportPreviewRow({
  payload,
  printHref,
}: {
  payload: ReturnType<typeof buildPremiumReportExportPayload>;
  printHref: string;
}) {
  return <PremiumReportExportActions payload={payload} printHref={printHref} />;
}

/** Full A4-style premium decision report preview. */
export function PremiumDecisionReportPreview({
  schema,
  result,
  locale,
  compact = false,
}: PremiumDecisionReportPreviewProps) {
  const t = useTranslations("premiumDecisionReport");
  const verdict = getVerdictFromThresholds(result.thresholdAlerts);
  const thresholdItems = getThresholdSummary(schema, result.thresholdAlerts, result.outputs);
  const severity = worstThresholdSeverity(result.thresholdAlerts);
  const assumptions = getAssumptionLines(schema);

  const exportPayload = useMemo(
    () => buildPremiumReportExportPayload(schema, result, locale),
    [schema, result, locale]
  );
  const printHref = `/tools/premium-schema/${schema.id}/print`;

  return (
    <article className="sc-premium-decision-report sc-ledger-letterpress" aria-label={t("documentLabel")}>
      <header className="sc-premium-decision-report__header">
        <p className="sc-ledger-eyebrow">{t("reportEyebrow")}</p>
        <h2 className="sc-premium-decision-report__title">{schema.name}</h2>
        <p className="sc-premium-decision-report__subtitle">{schema.reportTemplate.title}</p>
      </header>

      {!compact ? (
        <>
          <ExecutiveVerdictBlock verdict={verdict} statusLabel={t(`status.${verdict.status}`)} />
          <BigNumberSummary result={result} meaningLabel={t("whatThisMeans")} />
        </>
      ) : null}

      <div className={compact ? "hidden xl:block" : undefined}>
        <LossDriverBreakdown
          result={result}
          title={t("hiddenDriversTitle")}
          intro={t("hiddenDriversIntro")}
        />
      </div>

      <div className={compact ? "hidden xl:block" : undefined}>
        <ThresholdStatusSection items={thresholdItems} title={t("thresholdTitle")} />
      </div>

      <div className={compact ? "hidden xl:block" : undefined}>
        <SuggestedActionSection
          severity={severity}
          engineAction={result.suggestedAction}
          title={t("suggestedActionTitle")}
          immediateLabel={t("actionImmediate")}
          monitoringLabel={t("actionMonitoring")}
          decisionLabel={t("actionDecision")}
        />
      </div>

      <AssumptionsSection
        lines={assumptions}
        legalNote={result.legalNote}
        assumptionsTitle={t("assumptionsTitle")}
        legalTitle={t("legalTitle")}
      />

      <ExportPreviewRow payload={exportPayload} printHref={printHref} />
    </article>
  );
}

export { ExecutiveVerdictBlock, BigNumberSummary, LossDriverBreakdown, ThresholdStatusSection, SuggestedActionSection };

export function buildPremiumDecisionReportData(
  schema: PremiumCalculatorSchema,
  result: PremiumSchemaEngineResult
) {
  const verdict = getVerdictFromThresholds(result.thresholdAlerts);
  const thresholdItems = getThresholdSummary(schema, result.thresholdAlerts, result.outputs);
  const severity = worstThresholdSeverity(result.thresholdAlerts);
  return { verdict, thresholdItems, severity };
}
