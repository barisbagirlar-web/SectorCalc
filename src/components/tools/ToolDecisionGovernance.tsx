"use client";

import type { ReactNode } from "react";
import { useLocale } from "next-intl";
import { UsageAgreementNotice } from "@/components/disclaimer/UsageAgreementNotice";
import { StandardSystemSelector } from "@/components/standards/StandardSystemSelector";
import { CalculationFeedbackButton } from "@/components/feedback/CalculationFeedbackButton";
import { resolveDecisionEngineContext } from "@/lib/decision-engine/decision-engine-resolver";
import { toolUsesEngineeringStandards } from "@/lib/standards/standard-system-resolver";
import type { FeedbackSnapshotValue, FeedbackToolType } from "@/lib/feedback/types";

type ToolDecisionGovernanceProps = {
  readonly toolSlug: string;
  readonly tier: "free" | "premium" | "premium-schema";
  readonly toolType: FeedbackToolType;
  readonly routePath: string;
  readonly sector?: string;
  readonly category?: string;
  readonly region?: string;
  readonly inputSnapshot?: Readonly<Record<string, FeedbackSnapshotValue>>;
  readonly resultSnapshot?: Readonly<Record<string, FeedbackSnapshotValue>>;
  readonly formSlot?: ReactNode;
  readonly resultSlot?: ReactNode;
};

export function ToolDecisionGovernance({
  toolSlug,
  tier,
  toolType,
  routePath,
  sector,
  category,
  region,
  inputSnapshot,
  resultSnapshot,
  formSlot,
  resultSlot,
}: ToolDecisionGovernanceProps) {
  const locale = useLocale();
  const ctx = resolveDecisionEngineContext({
    toolSlug,
    locale,
    tier,
    sector,
    category,
    region,
  });

  return (
    <div className="space-y-4" data-decision-governance="true" data-tool-archetype={ctx.caseState.archetype}>
      <UsageAgreementNotice
        toolSlug={toolSlug}
        tier={tier}
        sector={sector}
        category={category}
        region={region ?? ctx.caseState.region}
      />
      {toolUsesEngineeringStandards(toolSlug) ? (
        <StandardSystemSelector toolSlug={toolSlug} region={ctx.caseState.region} />
      ) : null}
      {formSlot}
      {resultSlot}
      <CalculationFeedbackButton
        toolSlug={toolSlug}
        toolType={toolType}
        locale={locale}
        routePath={routePath}
        region={ctx.caseState.region}
        inputSnapshot={inputSnapshot}
        resultSnapshot={resultSnapshot}
      />
    </div>
  );
}
