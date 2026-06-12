"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { LedgerNumberTick } from "@/components/ui/LedgerNumberTick";
import { PremiumReportExportActions } from "@/components/reports/PremiumReportExportActions";
import { PremiumReportLockedState } from "@/components/reports/PremiumReportLockedState";
import { buildPremiumReportExportPayload } from "@/lib/premium-schema/premium-report-export";
import {
  PREVIEW_ENTITLEMENT,
  buildPremiumCheckoutHref,
  limitPreviewThresholdCount,
  type PremiumEntitlement,
} from "@/lib/entitlements/premium-entitlements";
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
import { getPremiumClaimCopy } from "@/lib/premium-schema/premium-claim-copy";
import { worstThresholdSeverity } from "@/lib/premium-schema/premium-schema-engine";
import type { SevenMudaEngineeringResult } from "@/lib/premium-schema/calculators/seven-muda-waste-cost";
import { formatPremiumValue } from "@/lib/premium-schema/format-premium-result";
import { resolveSevenMudaRev5Labels } from "@/lib/i18n/seven-muda-rev5-labels";

export type PremiumDecisionReportPreviewProps = {
  schema: PremiumCalculatorSchema;
  result: PremiumSchemaEngineResult;
  locale: string;
  /** Hide sections already shown above the fold on mobile */
  compact?: boolean;
  entitlement?: PremiumEntitlement;
  checkoutHref?: string;
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

function DecisionValueSection({
  title,
  intro,
  bullets,
  decisionValue,
}: {
  title: string;
  intro: string;
  bullets: readonly string[];
  decisionValue: string;
}) {
  return (
    <section className="sc-premium-decision-report__section sc-premium-decision-value" aria-label={title}>
      <h3 className="sc-premium-decision-report__heading">{title}</h3>
      <p className="sc-premium-decision-value__intro">{intro}</p>
      <ul className="sc-premium-decision-value__list">
        {bullets.map((bullet) => (
          <li key={bullet}>{bullet}</li>
        ))}
      </ul>
      <p className="sc-premium-decision-value__note">{decisionValue}</p>
    </section>
  );
}

function SevenMudaRev5DecisionSection({
  engineering,
  locale,
}: {
  engineering: SevenMudaEngineeringResult;
  locale: string;
}) {
  const labels = resolveSevenMudaRev5Labels(locale);
  const fmtCurrency = (value: number) => formatPremiumValue(value, "currency", "", locale);
  const fmtPercent = (value: number) => formatPremiumValue(value, "percentage", "%", locale);
  const fmtNumber = (value: number) => formatPremiumValue(value, "number", "", locale);
  const verdict = engineering.decisionVerdict;

  return (
    <>
      <section className="sc-premium-decision-report__section" aria-label={labels.executiveSummary}>
        <h3 className="sc-premium-decision-report__heading">{labels.executiveSummary}</h3>
        <dl className="sc-premium-driver-grid">
          <div className="sc-premium-driver-grid__item">
            <dt className="sc-premium-driver-grid__label">{labels.totalWasteCost}</dt>
            <dd className="sc-premium-driver-grid__value">{fmtCurrency(engineering.totalWasteCost)}</dd>
          </div>
          <div className="sc-premium-driver-grid__item">
            <dt className="sc-premium-driver-grid__label">{labels.annualizedWasteCost}</dt>
            <dd className="sc-premium-driver-grid__value">{fmtCurrency(engineering.annualizedWasteCost)}</dd>
          </div>
          <div className="sc-premium-driver-grid__item">
            <dt className="sc-premium-driver-grid__label">{labels.wasteCostPerUnit}</dt>
            <dd className="sc-premium-driver-grid__value">{fmtCurrency(engineering.wasteCostPerUnit)}</dd>
          </div>
          <div className="sc-premium-driver-grid__item">
            <dt className="sc-premium-driver-grid__label">{labels.periodRevenue}</dt>
            <dd className="sc-premium-driver-grid__value">{fmtCurrency(engineering.periodRevenue)}</dd>
          </div>
          <div className="sc-premium-driver-grid__item">
            <dt className="sc-premium-driver-grid__label">{labels.periodGrossMarginValue}</dt>
            <dd className="sc-premium-driver-grid__value">
              {fmtCurrency(engineering.periodGrossMarginValue)}
            </dd>
          </div>
          <div className="sc-premium-driver-grid__item">
            <dt className="sc-premium-driver-grid__label">{labels.wasteToRevenueRatio}</dt>
            <dd className="sc-premium-driver-grid__value">
              {fmtPercent(engineering.wasteToRevenueRatioPct)}
            </dd>
          </div>
          <div className="sc-premium-driver-grid__item">
            <dt className="sc-premium-driver-grid__label">{labels.wasteToGrossMarginRatio}</dt>
            <dd className="sc-premium-driver-grid__value">
              {fmtPercent(engineering.wasteToGrossMarginRatioPct)}
            </dd>
          </div>
          <div className="sc-premium-driver-grid__item">
            <dt className="sc-premium-driver-grid__label">{labels.highestWasteCategory}</dt>
            <dd className="sc-premium-driver-grid__value">
              {labels.categoryName(engineering.highestWasteCategory)}
            </dd>
          </div>
          <div className="sc-premium-driver-grid__item">
            <dt className="sc-premium-driver-grid__label">{labels.firstActionCategory}</dt>
            <dd className="sc-premium-driver-grid__value">
              {labels.categoryName(verdict.firstActionCategory)}
            </dd>
          </div>
          <div className="sc-premium-driver-grid__item">
            <dt className="sc-premium-driver-grid__label">{labels.confidenceLevel}</dt>
            <dd className="sc-premium-driver-grid__value">
              {labels.confidenceText(engineering.confidenceLevel)}
            </dd>
          </div>
          <div className="sc-premium-driver-grid__item">
            <dt className="sc-premium-driver-grid__label">{labels.riskAdjustedPriorityScore}</dt>
            <dd className="sc-premium-driver-grid__value">
              {fmtNumber(engineering.riskAdjustedPriorityScore)}
            </dd>
          </div>
          <div className="sc-premium-driver-grid__item">
            <dt className="sc-premium-driver-grid__label">{labels.doubleCountRisk}</dt>
            <dd className="sc-premium-driver-grid__value">
              {verdict.hasDoubleCountRisk ? labels.doubleCountDetected : labels.doubleCountNone}
            </dd>
          </div>
        </dl>
      </section>

      <section className="sc-premium-decision-report__section" aria-label={labels.decisionVerdict}>
        <h3 className="sc-premium-decision-report__heading">{labels.decisionVerdict}</h3>
        <p className="sc-premium-decision-report__intro">
          {labels.summaryLevelText(verdict.summaryLevel)}
        </p>
        <dl className="sc-premium-driver-grid">
          <div className="sc-premium-driver-grid__item">
            <dt className="sc-premium-driver-grid__label">{labels.biggestCostCategory}</dt>
            <dd className="sc-premium-driver-grid__value">
              {labels.categoryName(verdict.biggestCostCategory)}
            </dd>
          </div>
          <div className="sc-premium-driver-grid__item">
            <dt className="sc-premium-driver-grid__label">{labels.dataConfidence}</dt>
            <dd className="sc-premium-driver-grid__value">
              {labels.confidenceText(verdict.dataConfidence)}
            </dd>
          </div>
        </dl>
      </section>

      <section className="sc-premium-decision-report__section" aria-label={labels.wasteBreakdown}>
        <h3 className="sc-premium-decision-report__heading">{labels.wasteBreakdown}</h3>
        <div className="overflow-x-auto">
          <table className="sc-premium-table w-full text-left text-sm">
            <thead>
              <tr>
                <th className="sc-premium-table__head">{labels.category}</th>
                <th className="sc-premium-table__head">{labels.cost}</th>
                <th className="sc-premium-table__head">{labels.share}</th>
                <th className="sc-premium-table__head">{labels.actionPriority}</th>
              </tr>
            </thead>
            <tbody>
              {engineering.wasteBreakdown.map((item) => (
                <tr key={item.key}>
                  <td className="sc-premium-table__cell">{labels.categoryName(item.key)}</td>
                  <td className="sc-premium-table__cell">{fmtCurrency(item.cost)}</td>
                  <td className="sc-premium-table__cell">{fmtPercent(item.sharePct)}</td>
                  <td className="sc-premium-table__cell">{fmtNumber(item.actionPriorityScore)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="sc-premium-decision-report__section" aria-label={labels.recommendedActionOrder}>
        <h3 className="sc-premium-decision-report__heading">{labels.recommendedActionOrder}</h3>
        <ol className="sc-premium-action-steps list-decimal pl-5">
          {engineering.recommendedActionOrder.map((key) => (
            <li key={key}>{labels.categoryName(key)}</li>
          ))}
        </ol>
      </section>

      <section className="sc-premium-decision-report__section" aria-label={labels.recoveryScenarios}>
        <h3 className="sc-premium-decision-report__heading">{labels.recoveryScenarios}</h3>
        <div className="overflow-x-auto">
          <table className="sc-premium-table w-full text-left text-sm">
            <thead>
              <tr>
                <th className="sc-premium-table__head">{labels.reduction}</th>
                <th className="sc-premium-table__head">{labels.periodSavings}</th>
                <th className="sc-premium-table__head">{labels.annualSavings}</th>
              </tr>
            </thead>
            <tbody>
              {engineering.recoveryScenarios.map((scenario) => (
                <tr key={scenario.reductionPct}>
                  <td className="sc-premium-table__cell">{fmtPercent(scenario.reductionPct)}</td>
                  <td className="sc-premium-table__cell">{fmtCurrency(scenario.periodSavings)}</td>
                  <td className="sc-premium-table__cell">{fmtCurrency(scenario.annualSavings)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="sc-premium-decision-report__section" aria-label={labels.warnings}>
        <h3 className="sc-premium-decision-report__heading">{labels.warnings}</h3>
        {engineering.doubleCountWarnings.length > 0 ? (
          <ul className="sc-premium-assumption-list">
            {engineering.doubleCountWarnings.map((warning) => (
              <li key={warning}>{labels.resolveWarningMessage(warning)}</li>
            ))}
          </ul>
        ) : (
          <p className="sc-premium-decision-report__intro">{labels.noWarnings}</p>
        )}
      </section>
    </>
  );
}

function ExportPreviewRow({
  payload,
  printHref,
  entitlement,
  checkoutHref,
}: {
  payload: ReturnType<typeof buildPremiumReportExportPayload>;
  printHref: string;
  entitlement: PremiumEntitlement;
  checkoutHref: string;
}) {
  return (
    <PremiumReportExportActions
      payload={payload}
      printHref={printHref}
      entitlement={entitlement}
      checkoutHref={checkoutHref}
    />
  );
}

/** Full A4-style premium decision report preview. */
export function PremiumDecisionReportPreview({
  schema,
  result,
  locale,
  compact = false,
  entitlement = PREVIEW_ENTITLEMENT,
  checkoutHref,
}: PremiumDecisionReportPreviewProps) {
  const t = useTranslations("premiumDecisionReport");
  const tDecision = useTranslations("premiumDecisionReport.decisionValue");
  const verdict = getVerdictFromThresholds(result.thresholdAlerts);
  const thresholdItems = getThresholdSummary(schema, result.thresholdAlerts, result.outputs, locale);
  const previewThresholdItems = limitPreviewThresholdCount(thresholdItems, 2);
  const severity = worstThresholdSeverity(result.thresholdAlerts);
  const assumptions = getAssumptionLines(schema);
  const isFullReport = entitlement.canViewFullReport;
  const resolvedCheckoutHref = buildPremiumCheckoutHref(schema.id, checkoutHref);
  const claimCopy = getPremiumClaimCopy(schema.id);

  const decisionBullets = [
    tDecision("bullet1"),
    tDecision("bullet2"),
    tDecision("bullet3"),
    tDecision("bullet4"),
  ] as const;

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

      {result.sevenMudaEngineering ? (
        <SevenMudaRev5DecisionSection
          engineering={result.sevenMudaEngineering}
          locale={locale}
        />
      ) : null}

      {!compact ? (
        <>
          <ExecutiveVerdictBlock verdict={verdict} statusLabel={t(`status.${verdict.status}`)} />
          <BigNumberSummary result={result} meaningLabel={t("whatThisMeans")} />
          {!isFullReport ? (
            <ThresholdStatusSection items={previewThresholdItems} title={t("thresholdTitle")} />
          ) : null}
          <DecisionValueSection
            title={tDecision("title")}
            intro={tDecision("intro")}
            bullets={decisionBullets}
            decisionValue={claimCopy.decisionValue}
          />
        </>
      ) : null}

      {isFullReport ? (
        <>
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

          <ExportPreviewRow
            payload={exportPayload}
            printHref={printHref}
            entitlement={entitlement}
            checkoutHref={resolvedCheckoutHref}
          />
        </>
      ) : (
        <PremiumReportLockedState
          schemaName={schema.name}
          schemaSlug={schema.id}
          locale={locale}
          checkoutHref={resolvedCheckoutHref}
        />
      )}
    </article>
  );
}

export { ExecutiveVerdictBlock, BigNumberSummary, LossDriverBreakdown, ThresholdStatusSection, SuggestedActionSection, SevenMudaRev5DecisionSection };

export function buildPremiumDecisionReportData(
  schema: PremiumCalculatorSchema,
  result: PremiumSchemaEngineResult,
  locale = "en",
) {
  const verdict = getVerdictFromThresholds(result.thresholdAlerts);
  const thresholdItems = getThresholdSummary(schema, result.thresholdAlerts, result.outputs, locale);
  const severity = worstThresholdSeverity(result.thresholdAlerts);
  return { verdict, thresholdItems, severity };
}
