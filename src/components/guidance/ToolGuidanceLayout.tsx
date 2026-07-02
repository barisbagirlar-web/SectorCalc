type AppLocale = "en";
"use client";

import { useMemo, type ReactNode } from "react";
import { useLocale } from "@/lib/i18n-stub";
import { GuidanceProvider } from "@/components/guidance/GuidanceContext";
import { PremiumInputGuide } from "@/components/tool-guides/PremiumInputGuide";
import { shouldRenderPremiumGuide } from "@/lib/features/tools/guide/tool-guide-policy";
import type {
  GuidanceTier,
  ReferenceGraphicField,
} from "@/lib/content/guidance/reference-graphic-types";

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
  fields,
  children,
}: ToolGuidanceLayoutProps) {
  const locale = useLocale() as AppLocale;

  const formInputKeys = useMemo(() => fields.map((field) => field.key), [fields]);

  const showGuide = useMemo(
    () => shouldRenderPremiumGuide(toolSlug, formInputKeys),
    [toolSlug, formInputKeys],
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
    <GuidanceProvider fieldLabels={fieldLabels}>
      <div
        className="grg-layout"
        data-tool-guidance-layout="true"
        data-has-input-guide={showGuide ? "true" : "false"}
      >
        {showGuide ? (
          <>
            <div className="grg-layout__mobile-guide">
              <PremiumInputGuide slug={toolSlug} locale={locale} formInputKeys={formInputKeys} />
            </div>
            <div className="grg-layout__body">
              <div className="grg-layout__form">{children}</div>
              <div className="grg-layout__desktop-guide">
                <PremiumInputGuide slug={toolSlug} locale={locale} formInputKeys={formInputKeys} />
              </div>
            </div>
          </>
        ) : (
          <div className="grg-layout__form">{children}</div>
        )}
      </div>
    </GuidanceProvider>
  );
}
