"use client";

import { useCallback, useEffect, useState } from "react";
import {
  buildLeadEmailMessage,
  buildLeadInternalNote,
  buildLeadWhatsappMessage,
} from "@/lib/leads/lead-copy-actions";
import {
  getRecommendedStatusLabel,
  resolveLeadActionRecommendation,
  type ActionPriorityLevel,
  type LeadActionRecommendation,
  type SuggestedMessageType,
} from "@/lib/leads/lead-action-center";
import type { LeadIntent } from "@/lib/leads/types";

type CopyTarget = "whatsapp" | "email" | "internal";

const priorityClasses: Record<ActionPriorityLevel, string> = {
  urgent: "border-soft-red/30 bg-soft-red/5 text-soft-red",
  high: "border-amber/30 bg-amber/10 text-amber",
  normal: "border-slate/25 bg-off-white/80 text-deep-navy",
  low: "border-slate/20 bg-off-white text-slate",
};

const COPY_BUTTONS: {
  target: CopyTarget;
  label: string;
  build: (lead: LeadIntent) => string;
  messageType: SuggestedMessageType;
}[] = [
  {
    target: "whatsapp",
    label: "WhatsApp Mesajını Kopyala",
    build: buildLeadWhatsappMessage,
    messageType: "whatsapp",
  },
  {
    target: "email",
    label: "E-posta Metnini Kopyala",
    build: buildLeadEmailMessage,
    messageType: "email",
  },
  {
    target: "internal",
    label: "İç Notu Kopyala",
    build: buildLeadInternalNote,
    messageType: "internal_note",
  },
];

interface LeadActionCenterProps {
  lead: LeadIntent;
  recommendation?: LeadActionRecommendation;
}

export function LeadActionCenter({
  lead,
  recommendation: recommendationProp,
}: LeadActionCenterProps) {
  const recommendation =
    recommendationProp ?? resolveLeadActionRecommendation(lead);
  const [copiedTarget, setCopiedTarget] = useState<CopyTarget | null>(null);
  const [fallbackText, setFallbackText] = useState<string | null>(null);

  useEffect(() => {
    setCopiedTarget(null);
    setFallbackText(null);
  }, [lead.id]);

  const handleCopy = useCallback(
    async (target: CopyTarget, build: (item: LeadIntent) => string) => {
      const text = build(lead);
      setCopiedTarget(null);
      setFallbackText(null);

      try {
        await navigator.clipboard.writeText(text);
        setCopiedTarget(target);
        window.setTimeout(() => {
          setCopiedTarget((current) => (current === target ? null : current));
        }, 2000);
      } catch {
        setFallbackText(text);
      }
    },
    [lead]
  );

  return (
    <section
      className="rounded-xl border border-slate/20 bg-white p-4 sm:p-5"
      aria-label="Action Center"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-deep-navy">Action Center</h3>
          <p className="mt-1 text-xs leading-relaxed text-slate">
            SLA, kalite ve duruma göre sıradaki en iyi aksiyon.
          </p>
        </div>
        <span
          className={`inline-flex shrink-0 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${priorityClasses[recommendation.priorityLevel]}`}
        >
          {recommendation.priorityLevel}
        </span>
      </div>

      <div className="mt-4 space-y-3 text-sm">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate">
            Sıradaki en iyi aksiyon
          </p>
          <p className="mt-1 break-words font-semibold text-deep-navy">
            {recommendation.recommendedActionLabel}
            {recommendation.shouldContactToday ? (
              <span className="ml-2 font-normal text-amber">· Bugün</span>
            ) : null}
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate">
            Neden bu aksiyon?
          </p>
          <p className="mt-1 break-words text-deep-navy">
            {recommendation.recommendedActionReason}
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate">
            Önerilen status
          </p>
          <p className="mt-1 text-deep-navy">
            {getRecommendedStatusLabel(recommendation)}
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate">
            Checklist
          </p>
          <ul className="mt-1 list-inside list-disc space-y-1 break-words text-deep-navy">
            {recommendation.actionChecklist.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-5 border-t border-slate/15 pt-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate">
          Mesaj şablonları
        </p>
        <p className="mt-1 text-xs text-slate">
          Otomatik gönderim yok — metni kopyalayıp manuel iletin.
        </p>
        <div className="mt-3 flex flex-col gap-2">
          {COPY_BUTTONS.map((button) => {
            const copied = copiedTarget === button.target;
            const suggested =
              recommendation.suggestedMessageType === button.messageType;
            return (
              <button
                key={button.target}
                type="button"
                onClick={() => void handleCopy(button.target, button.build)}
                className={`inline-flex min-h-[44px] w-full items-center justify-center rounded-lg border px-3 text-sm font-semibold transition-colors ${
                  suggested
                    ? "border-professional-blue/40 bg-professional-blue/5 text-deep-navy hover:bg-professional-blue/10"
                    : "border-slate/25 bg-white text-deep-navy hover:border-professional-blue/40 hover:bg-off-white"
                }`}
              >
                {copied ? "Kopyalandı" : button.label}
                {suggested && !copied ? (
                  <span className="ml-2 text-xs font-normal text-slate">
                    (önerilen)
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>

        {fallbackText ? (
          <div className="mt-4 space-y-2">
            <p className="text-xs font-medium text-soft-red" role="alert">
              Panoya kopyalanamadı. Metni aşağıdan manuel kopyalayın.
            </p>
            <textarea
              readOnly
              value={fallbackText}
              rows={8}
              className="w-full resize-y rounded-lg border border-slate/25 bg-off-white px-3 py-2 text-sm text-deep-navy focus:border-professional-blue focus:outline-none focus:ring-2 focus:ring-professional-blue/20"
              aria-label="Kopyalanacak metin"
            />
          </div>
        ) : null}
      </div>
    </section>
  );
}

interface LeadActionBadgeProps {
  recommendation: LeadActionRecommendation;
}

export function LeadActionBadge({ recommendation }: LeadActionBadgeProps) {
  return (
    <span
      className={`inline-flex max-w-full items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${priorityClasses[recommendation.priorityLevel]}`}
      title={recommendation.recommendedActionReason}
    >
      <span className="truncate">{recommendation.recommendedActionLabel}</span>
    </span>
  );
}
