"use client";

import { useMemo, type ReactNode } from "react";
import { useLocale } from "next-intl";
import { GuidanceProvider } from "@/components/guidance/GuidanceContext";
import { ReferenceGraphicCard } from "@/components/guidance/ReferenceGraphicCard";
import type { AppLocale } from "@/i18n/routing";
import { resolveReferenceGraphic } from "@/lib/guidance/reference-graphic-resolver";
import type {
  GuidanceTier,
  ReferenceGraphicField,
} from "@/lib/guidance/reference-graphic-types";

export type ToolGuidanceLayoutProps = {
  readonly toolSlug: string;
  readonly tier: GuidanceTier;
  readonly fields: readonly ReferenceGraphicField[];
  readonly toolTitle?: string;
  readonly toolCategory?: string;
  readonly toolSector?: string;
  readonly children: ReactNode;
};

export function ToolGuidanceLayout({
  toolSlug,
  tier,
  fields,
  toolTitle,
  toolCategory,
  toolSector,
  children,
}: ToolGuidanceLayoutProps) {
  const locale = useLocale() as AppLocale;

  const resolvedGraphic = useMemo(
    () =>
      resolveReferenceGraphic({
        locale,
        toolSlug,
        tier,
        fields,
        toolTitle,
        toolCategory,
        toolSector,
      }),
    [locale, toolSlug, tier, fields, toolTitle, toolCategory, toolSector],
  );

  const fieldLabels = useMemo(() => {
    const labels: Record<string, string> = {};
    for (const field of fields) {
      if (field.label) {
        labels[field.key] = field.label;
      }
    }
    return labels;
  }, [fields]);

  return (
    <GuidanceProvider resolvedGraphic={resolvedGraphic} fieldLabels={fieldLabels}>
      <div className="grg-layout" data-tool-guidance-layout="true">
        <div className="grg-layout__mobile-guide">
          <ReferenceGraphicCard />
        </div>
        <div className="grg-layout__body">
          <div className="grg-layout__form">{children}</div>
          <div className="grg-layout__desktop-guide">
            <ReferenceGraphicCard />
          </div>
        </div>
      </div>
    </GuidanceProvider>
  );
}
