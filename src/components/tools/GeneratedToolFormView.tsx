"use client";

import { useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
import { DynamicToolFormWrapper } from "@/lib/features/dynamic-form-v2";
import { HMI_CSS } from "@/lib/features/dynamic-form-v2/hmi-css";
import { ToolAcademicReferences } from "@/components/tools/ToolAcademicReferences";
import { ToolDescription } from "@/components/tools/ToolDescription";
import { ExpertAuthoritySection } from "@/components/content/ExpertAuthoritySection";
import { VerificationQueueButton } from "@/components/feedback/VerificationQueueButton";
import {
  resolveGeneratedToolTitle,
} from "@/lib/features/generated-tools/resolve-tool-display";
import { resolveGeneratedToolAboutContent } from "@/lib/features/generated-tools/resolve-tool-about";
import {
  useToolSchema,
} from "@/lib/features/generated-tools/use-tool-schema";
import type { GeneratedToolSchema } from "@/lib/features/generated-tools/types";

export type GeneratedToolFormViewProps = {
  readonly slug: string;
  readonly schema: GeneratedToolSchema;
};

export function GeneratedToolFormView({ slug, schema }: GeneratedToolFormViewProps) {
  const locale = useLocale();
  const t = useTranslations("generatedTool");
  const { loading, error, trustStatus } = useToolSchema(slug, schema);

  const aboutContent = useMemo(
    () => resolveGeneratedToolAboutContent(slug, schema, locale),
    [locale, schema, slug],
  );

  // Detect stub formula: all formulas are product chains (no domain operations)
  const isStubFormula = useMemo(() => {
    const formulas = schema.formulas ?? {};
    const expressions = Object.values(formulas).filter((v): v is string => typeof v === "string");
    if (expressions.length === 0) return false;
    return expressions.every((expr) => {
      const hasStubMarker = expr.includes("normalized_product") || expr.includes("adjustment_factor");
      const isBareMult =
        /^[\w\s*()]+$/.test(expr) &&
        !expr.includes("+") &&
        !expr.includes("/") &&
        !expr.includes("Math.") &&
        !expr.includes("**") &&
        expr.split("*").length >= 2;
      return hasStubMarker || isBareMult;
    });
  }, [schema]);

  const displayName = useMemo(
    () => resolveGeneratedToolTitle(slug, schema, locale),
    [locale, schema, slug],
  );
  const isPremium = schema.premiumRequired === true;

  if (loading) {
    return (
      <div className="card" style={{ margin: 20, textAlign: "center", color: "var(--ink-50)", fontFamily: "var(--mono)", fontSize: 12, letterSpacing: ".08em" }}>
        <span className="led signal pulse" style={{ display: "inline-block", marginRight: 10, verticalAlign: "middle" }} />
        {t("loading")}
      </div>
    );
  }

  if (error) {
    return (
      <div className="decision review" style={{ margin: 20 }}>
        <div className="d-label">SYSTEM ERROR</div>
        <div className="d-text" style={{ fontSize: 14, textTransform: "none" }}>{error ?? t("loadError")}</div>
      </div>
    );
  }

  const isQuarantine = trustStatus === "QUARANTINE";

  return (
    <>
      <style>{HMI_CSS}</style>
      <div className="wrap" style={{ paddingTop: 0 }}>
        {isQuarantine ? (
          <div className="card" style={{ marginBottom: 18, borderLeft: "3px solid var(--warn)" }}>
            <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <span className="led warn" style={{ flex: "none", marginTop: 4 }} />
              <div>
                <div className="d-label">QUARANTINE</div>
                <div className="d-sub" style={{ marginTop: 4 }}>{t("quarantineWarning")}</div>
              </div>
            </div>
          </div>
        ) : null}

        {isStubFormula && !isPremium ? (
          <div className="card" style={{ marginBottom: 12, borderLeft: "3px solid var(--ink-50)" }}>
            <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <span className="led off" style={{ flex: "none", marginTop: 4 }} />
              <div>
                <div className="d-label">STUB FORMULA</div>
                <div className="d-sub" style={{ marginTop: 4, fontSize: 10.5 }}><b>{t("stubFormulaLabel")}</b> {t("stubFormulaHint")}</div>
              </div>
            </div>
          </div>
        ) : null}

        {isStubFormula && isPremium ? (
          <div className="card" style={{ marginBottom: 12, borderLeft: "3px solid var(--warn)" }}>
            <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <span className="led warn" style={{ flex: "none", marginTop: 4 }} />
              <div>
                <div className="d-label">STUB FORMULA · PREMIUM</div>
                <div className="d-sub" style={{ marginTop: 4, fontSize: 10.5 }}><b>{t("stubFormulaLabel")}</b> {t("stubFormulaHint")}</div>
              </div>
            </div>
          </div>
        ) : null}

        <DynamicToolFormWrapper schema={schema} slug={slug} showMasthead={false} />

        <div className="card" style={{ marginTop: 22 }}>
          <ToolDescription content={aboutContent} isPremium={isPremium} />
        </div>

        <div className="card" style={{ marginTop: 12 }}>
          <ToolAcademicReferences />
        </div>

        <VerificationQueueButton
          toolSlug={slug}
          locale={locale}
          tier={isPremium ? "premium" : "free"}
          pageUrl={typeof window !== "undefined" ? window.location.href : `/tools/${isPremium ? "premium" : "generated"}/${slug}`}
        />

        <ExpertAuthoritySection toolName={displayName} />
      </div>
    </>
  );
}
