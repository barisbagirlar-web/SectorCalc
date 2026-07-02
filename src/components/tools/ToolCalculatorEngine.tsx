"use client";
/* eslint-disable */
// @ts-nocheck


import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ToolDefinition } from "@/data/tool-schema";
import { ToolForm } from "@/components/tools/ToolForm";
import { ToolResultPanel } from "@/components/tools/ToolResultPanel";
import { ExportToolbar } from "@/components/tools/ExportToolbar";
import { RiskVerdictCard } from "@/components/tools/RiskVerdictCard";
import { ScenarioAnalysisPanel } from "@/components/tools/ScenarioAnalysisPanel";
import {
 PremiumDecisionReportPanel,
 mapLegacyCncInputs,
} from "@/components/tools/PremiumDecisionReportPanel";
import { DecisionToolLegalDisclaimer } from "@/components/tools/DecisionToolLegalDisclaimer";
import { FreeToolPrivacyNote } from "@/components/tools/FreeToolPrivacyNote";
import { FreeToolUpgradePanel } from "@/components/tools/FreeToolUpgradePanel";
import { PremiumToolPaywall } from "@/components/subscription/PremiumToolPaywall";
import {
 getDefaultInputValues,
 runCalculator,
 validateCalculatorInput,
} from "@/lib/features/calculators/registry";
import { formatCurrency } from "@/lib/core/format/currency";
import { industrySlugToLeadValue } from "@/data/lead-options";
import {
 ANALYTICS_EVENTS,
 trackEvent,
} from "@/lib/infrastructure/analytics/events";
import {
 filterFreeResults,
 getRevenueToolByFreeSlug,
 getVisibleInputs,
 stripPaidOnlyResults,
} from "@/lib/features/tools/revenue-tools";
import { useProSubscription } from "@/lib/features/subscription/use-pro-subscription";
import { CalculationWorkspace } from "@/components/smart-form/CalculationWorkspace";
import { MARGINCORE_TERMS } from "@/lib/content/terminology/margincore-identity";
import { useLocale } from "@/lib/i18n-stub";
import { translateCalculatorPhrase } from "@/lib/infrastructure/i18n/calculator-phrase-translate";
import { RuleEngineAlerts } from "@/components/tools/RuleEngineAlerts";
import { AssumptionLedger } from "@/components/tools/AssumptionLedger";
import { TornadoChart } from "@/components/tools/TornadoChart";
import { FinancialImpactAnalysis } from "@/components/tools/FinancialImpactAnalysis";
import { evaluateCuttingParameters } from "@/lib/features/engine/rule-engine";
interface ToolCalculatorEngineProps {
 definition: ToolDefinition;
}

export function ToolCalculatorEngine({ definition }: ToolCalculatorEngineProps) {
 const locale = useLocale();
 const marginLeakDriversTitle = translateCalculatorPhrase("Margin leak drivers", locale);
 const isFreeTool = definition.tier === "free";
 const isPremiumTool = definition.tier === "premium";
 const hasDecisionReport = Boolean(definition.features?.decisionReport);
 const toolSlug = definition.slug;
 const industryLeadValue = industrySlugToLeadValue(definition.industryId);
 const visibleInputs = useMemo(
 () => getVisibleInputs(definition),
 [definition]
 );
 const revenueFree = getRevenueToolByFreeSlug(definition.slug);
 const { isPro, loading: subscriptionLoading } = useProSubscription();
 const premiumLocked = isPremiumTool && !subscriptionLoading && !isPro;
 const showPaidOutput = isPremiumTool && isPro && !premiumLocked;

 const [values, setValues] = useState<Record<string, number | string>>(() =>
 getDefaultInputValues(definition.inputs)
 );
 const [errors, setErrors] = useState<Record<string, string>>({});
 const [touched, setTouched] = useState<Record<string, boolean>>({});
 const formStartedRef = useRef(false);
 const calculatedRef = useRef(false);

 useEffect(() => {
 trackEvent(ANALYTICS_EVENTS.tool_view, {
 toolSlug,
 tier: definition.tier,
 });
 }, [toolSlug, definition.tier]);

 const validate = useCallback(
 (nextValues: Record<string, number | string>) => {
 return validateCalculatorInput(definition.calculatorId, nextValues);
 },
 [definition.calculatorId]
 );

 const computed = useMemo(() => {
 const validationErrors = validate(values);
 const hasErrors = Object.keys(validationErrors).length > 0;
 if (hasErrors) {
 return { results: [], premium: undefined, hasErrors: true };
 }
 const output = runCalculator(definition.calculatorId, values);
 let results = output?.results ?? [];
 if (isFreeTool) {
 results = filterFreeResults(definition, results);
 results = stripPaidOnlyResults(definition, results);
 }
 return {
 results,
 premium: showPaidOutput ? output?.premium : undefined,
 hasErrors: false,
 };
 }, [definition, values, validate, isFreeTool, showPaidOutput]);

 useEffect(() => {
 if (
 !calculatedRef.current &&
 computed.results.length > 0 &&
 !computed.hasErrors
 ) {
 calculatedRef.current = true;
 trackEvent(ANALYTICS_EVENTS.calculation_completed, {
 toolSlug,
 tier: definition.tier,
 calculatorId: definition.calculatorId,
 });
 }
 }, [
 computed.results.length,
 computed.hasErrors,
 toolSlug,
 definition.tier,
 definition.calculatorId,
 ]);

 const displayErrors = useMemo(() => {
 const validationErrors = validate(values);
 const filtered: Record<string, string> = {};
 for (const [key, message] of Object.entries(validationErrors)) {
 if (touched[key] || errors[key]) {
 filtered[key] = message;
 }
 }
 return { ...filtered, ...errors };
 }, [values, validate, touched, errors]);

  const ruleAlerts = useMemo(() => {
    return evaluateCuttingParameters(values);
  }, [values]);

 const scenariosSummary = useMemo(() => {
 if (!computed.premium?.scenarios.length) return "";
 const { scenarioLabels } = computed.premium;
 return computed.premium.scenarios
 .map((s) => {
 const secondary =
 s.secondaryFormat === "percent"
 ? `${s.secondaryValue.toFixed(1)}%`
 : formatCurrency(s.secondaryValue);
 return `${s.label}: ${formatCurrency(s.primaryValue)} at ${s.metricDisplay} (${scenarioLabels.secondary}: ${secondary}).`;
 })
 .join(" ");
 }, [computed.premium]);

 const handleChange = (id: string, value: number | string) => {
 if (!formStartedRef.current) {
 formStartedRef.current = true;
 trackEvent(ANALYTICS_EVENTS.form_started, { toolSlug });
 }
 const nextValues = { ...values, [id]: value };
 setValues(nextValues);
 calculatedRef.current = false;
 if (touched[id]) {
 const validationErrors = validate(nextValues);
 setErrors(validationErrors);
 }
 };

 const handleBlur = (id: string) => {
 setTouched((prev) => ({ ...prev, [id]: true }));
 const validationErrors = validate(values);
 setErrors(validationErrors);
 };

 const freeRiskNote =
 isFreeTool && revenueFree ? revenueFree.freeValue : null;

 const isCncStochastic =
 isPremiumTool && toolSlug === "cnc-minimum-safe-quote-analyzer";

 const cncStochasticInputs = useMemo(() => {
 if (!isCncStochastic) return null;
 return mapLegacyCncInputs(values);
 }, [isCncStochastic, values]);

 return (
 <div className="flex min-w-0 flex-col gap-8">
 <CalculationWorkspace
  variant="split"
  decision={null}
  inputs={
   <div className="sc-form-result-panel min-w-0" data-calc-form="true">
    <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-text-secondary">
     {MARGINCORE_TERMS.riskVariables}
    </p>
    <h2 className="mb-6 text-lg font-bold text-text-primary">{marginLeakDriversTitle}</h2>
    {isFreeTool ? (
     <>
      <p className="mb-4 text-sm leading-relaxed text-text-secondary">
       {MARGINCORE_TERMS.freePreCheck}
      </p>
      <FreeToolPrivacyNote locale="en" />
     </>
    ) : null}
    <div className={isFreeTool ? "mt-4" : undefined}>
     <ToolForm
      inputs={visibleInputs}
      values={values}
      errors={displayErrors}
      onChange={handleChange}
      onBlur={handleBlur}
     />
    </div>
   </div>
  }
  output={
   <div className="sc-form-result-panel min-w-0 space-y-4" data-calc-result="true">
    {premiumLocked ? (
     <PremiumToolPaywall toolTitle={definition.title} toolSlug={toolSlug} />
    ) : (
     <>
      <ToolResultPanel
       results={computed.results}
       interpretationNote={freeRiskNote ?? definition.interpretationNote}
       hasErrors={computed.hasErrors}
       dense={hasDecisionReport && showPaidOutput}
      />
      {computed.results.length > 0 && !computed.hasErrors ? (
       <DecisionToolLegalDisclaimer variant={isPremiumTool ? "paid" : "free"} />
      ) : null}
      {isFreeTool && revenueFree && computed.results.length > 0 && !computed.hasErrors ? (
       <FreeToolUpgradePanel locale="en" revenue={revenueFree} />
      ) : null}
       {computed.premium && !computed.hasErrors && (
        <RiskVerdictCard
         riskLevel={computed.premium.riskLevel}
         riskLevelLabel={computed.premium.report.riskLevelLabel}
         verdictText={computed.premium.verdictText}
        />
       )}
       {showPaidOutput && computed.results.length > 0 && !computed.hasErrors && (
         <RuleEngineAlerts alerts={ruleAlerts} />
       )}
      </>
     )}
    </div>
  }
 />

 {showPaidOutput && computed.premium && !computed.hasErrors && (
 <div className="order-3 min-w-0 space-y-8">
 <ScenarioAnalysisPanel
 scenarios={computed.premium.scenarios}
 labels={computed.premium.scenarioLabels}
 />
 {isCncStochastic && cncStochasticInputs ? (
 <PremiumDecisionReportPanel
 variant="stochastic"
 sector="cnc-manufacturing"
 inputs={cncStochasticInputs}
 inputsReady={computed.results.length > 0 && !computed.hasErrors}
 toolSlug={toolSlug}
 toolTitle={definition.title}
 />
 ) : (
 <PremiumDecisionReportPanel
 report={computed.premium.report}
 riskLevel={computed.premium.riskLevel}
 scenariosSummary={scenariosSummary}
 toolSlug={toolSlug}
 toolTitle={definition.title}
 />
 )}
 <DecisionToolLegalDisclaimer variant="paid" />
 </div>
 )}
  
  
  {showPaidOutput && computed.results.length > 0 && !computed.hasErrors && (
    <div className="order-4 min-w-0 space-y-2">
      <TornadoChart inputs={values} />
      <FinancialImpactAnalysis inputs={values} />
      <AssumptionLedger />
    </div>
  )}

  {!premiumLocked && showPaidOutput && (
 <div className={`min-w-0 ${computed.premium ? "order-4" : "order-3"}`}>
 <ExportToolbar
 toolSlug={toolSlug}
 toolTitle={definition.title}
 industryLeadValue={industryLeadValue}
 locked={false}
 />
 </div>
 )}
 </div>
 );
}
