/**
 * Builds the 3-second industrial field panel from a decision report context.
 */

import type {
  FieldPanelKpi,
  FieldPanelKpiStatus,
  PremiumFieldPanel,
  ToleranceStatus,
} from "@/lib/features/premium/premium-architecture";
import {
  PREMIUM_DECISION_FAMILY_LABELS,
  PREMIUM_REPORT_FAMILY_LABELS,
} from "@/lib/features/premium/premium-architecture";
import type { PremiumArchitectureProfile } from "@/lib/features/premium/premium-architecture";
import type { PremiumSeverity } from "@/lib/features/tools/premium-tool-contract";

export interface FieldPanelBuildInput {
  readonly profile: PremiumArchitectureProfile;
  readonly verdictSeverity: PremiumSeverity;
  readonly verdictLabel: string;
  readonly primaryMetricLabel: string;
  readonly primaryMetricValue: string;
  readonly baseCostDisplay: string;
  readonly p90CostDisplay: string;
  readonly hiddenMultiplier: number;
  readonly quotedPriceDisplay: string | null;
  readonly recommendation: string;
  readonly topLossLabel: string;
}

function kpiStatusFromVerdict(severity: PremiumSeverity): FieldPanelKpiStatus {
  if (severity === "accept") {
    return "ok";
  }
  if (severity === "reject") {
    return "bad";
  }
  return "warn";
}

function toleranceFromVerdict(severity: PremiumSeverity): ToleranceStatus {
  if (severity === "accept") {
    return "within";
  }
  if (severity === "reject") {
    return "breach";
  }
  return "watch";
}

function toleranceLine(status: ToleranceStatus, focus: string): string {
  if (status === "within") {
    return `Within tolerance band - ${focus}`;
  }
  if (status === "breach") {
    return `Tolerance breached - ${focus}`;
  }
  return `Watch band - ${focus}`;
}

function impactLine(profile: PremiumArchitectureProfile, p90Display: string): string {
  const kinds = profile.lossImpacts
    .map((kind) => {
      if (kind === "monetary") return "money";
      if (kind === "material") return "material";
      if (kind === "time") return "time";
      if (kind === "energy") return "energy";
      if (kind === "carbon") return "carbon";
      return "capacity";
    })
    .join(", ");
  return `P90 exposure ${p90Display} across ${kinds} loss dimensions.`;
}

export function buildPremiumFieldPanel(input: FieldPanelBuildInput): PremiumFieldPanel {
  const toleranceStatus = toleranceFromVerdict(input.verdictSeverity);
  const kpiStatus = kpiStatusFromVerdict(input.verdictSeverity);

  const kpis: FieldPanelKpi[] = [
    {
      label: input.primaryMetricLabel,
      value: input.primaryMetricValue,
      status: kpiStatus,
    },
    {
      label: "Visible cost",
      value: input.baseCostDisplay,
      status: "ok",
    },
    {
      label: "P90 exposure",
      value: input.p90CostDisplay,
      status: toleranceStatus === "breach" ? "bad" : toleranceStatus === "watch" ? "warn" : "ok",
    },
    {
      label: "Hidden buffer",
      value: `×${input.hiddenMultiplier.toFixed(2)}`,
      status: input.hiddenMultiplier > 1.12 ? "warn" : "ok",
    },
  ];

  if (input.quotedPriceDisplay) {
    kpis[0] = {
      label: "Your price",
      value: input.quotedPriceDisplay,
      status: kpiStatus,
    };
  }

  return {
    familyBadge: PREMIUM_REPORT_FAMILY_LABELS[input.profile.reportFamily],
    sectorLabel: input.profile.sectorLabel,
    verdictLine: input.verdictLabel,
    measuredLine: input.profile.whatIsMeasured,
    lossHotspotLine: `${input.topLossLabel} - ${input.profile.whereIsLoss}`,
    toleranceStatus,
    toleranceLine: toleranceLine(toleranceStatus, input.profile.toleranceFocus),
    impactLine: impactLine(input.profile, input.p90CostDisplay),
    actionLine: input.recommendation,
    kpis,
  };
}

export function buildLossAwareSummary(
  profile: PremiumArchitectureProfile,
  baseCostDisplay: string,
  p90Display: string
): string {
  const family = PREMIUM_DECISION_FAMILY_LABELS[profile.decisionFamily];
  return `${family}: visible cost ${baseCostDisplay}. Buffered exposure ${p90Display}. ${profile.whereIsLoss}`;
}
