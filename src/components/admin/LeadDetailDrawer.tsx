"use client";

import { useEffect, type ReactNode } from "react";
import { LeadActivityList } from "@/components/admin/LeadActivityList";
import { LeadContactCell } from "@/components/admin/LeadContactCell";
import { LeadActionCenter } from "@/components/admin/LeadActionCenter";
import {
  LeadPipelineControls,
  type LeadPipelinePatch,
} from "@/components/admin/LeadPipelineControls";
import { LeadPriorityBadge } from "@/components/admin/LeadPriorityBadge";
import { LeadStatusBadge } from "@/components/admin/LeadStatusBadge";
import { LeadFollowUpSlaBadge } from "@/components/admin/LeadFollowUpSla";
import { LeadQualityDetail } from "@/components/admin/LeadQualityScore";
import { LeadDataQualityDetail } from "@/components/admin/LeadCleanupControls";
import type { TestLeadClassificationPatch } from "@/components/admin/LeadTestClassificationControls";
import { formatLocalDateTime } from "@/lib/format/datetime";
import { formatLeadPlan, formatLeadSource } from "@/lib/leads/admin-metrics";
import {
  formatLeadIntentSummary,
  getLeadPriorityLabel,
  resolveLeadPriority,
  resolveLeadStatus,
  resolveNextAction,
} from "@/lib/leads/lead-pipeline";
import { resolveLeadFollowUpSla } from "@/lib/leads/follow-up-sla";
import { computeLeadQualityScore } from "@/lib/leads/lead-quality-score";
import { resolveLeadActionRecommendation } from "@/lib/leads/lead-action-center";
import { resolveLeadAttribution } from "@/lib/leads/source-attribution";
import { detectTestLead } from "@/lib/leads/lead-cleanup";
import type { LeadIntent } from "@/lib/leads/types";

interface LeadDetailDrawerProps {
  lead: LeadIntent | null;
  open: boolean;
  onClose: () => void;
  onLeadPatched?: (leadId: string, patch: LeadPipelinePatch) => void;
  onLeadTestClassificationPatched?: (
    leadId: string,
    patch: TestLeadClassificationPatch
  ) => void;
}

function displayValue(value: string | number | undefined): string {
  if (value === undefined || value === null) {
    return "—";
  }
  if (typeof value === "string" && !value.trim()) {
    return "—";
  }
  return String(value);
}

function DetailSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-xl border border-slate/20 bg-white p-4 sm:p-5">
      <h3 className="text-sm font-bold text-deep-navy">{title}</h3>
      <dl className="mt-3 space-y-3 text-sm">{children}</dl>
    </section>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1 sm:grid-cols-[9rem_1fr] sm:gap-3">
      <dt className="font-medium text-slate">{label}</dt>
      <dd className="break-words text-deep-navy">{value}</dd>
    </div>
  );
}

export function LeadDetailDrawer({
  lead,
  open,
  onClose,
  onLeadPatched,
  onLeadTestClassificationPatched,
}: LeadDetailDrawerProps) {
  useEffect(() => {
    if (!open) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open || !lead) {
    return null;
  }

  const status = resolveLeadStatus(lead);
  const priority = resolveLeadPriority(lead);
  const nextAction = resolveNextAction(lead);
  const suggestedNextAction = !lead.nextAction?.trim();
  const attribution = resolveLeadAttribution(lead);
  const followUpSla = resolveLeadFollowUpSla(lead);
  const quality = computeLeadQualityScore(lead);
  const actionRecommendation = resolveLeadActionRecommendation(lead);
  const testDetection = detectTestLead(lead);

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="presentation">
      <button
        type="button"
        className="absolute inset-0 bg-deep-navy/30"
        aria-label="Detayı kapat"
        onClick={onClose}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="lead-detail-drawer-title"
        className="relative z-10 flex h-[92dvh] w-full flex-col overflow-hidden rounded-t-2xl border border-slate/20 bg-white shadow-card md:h-full md:max-w-xl md:rounded-none md:rounded-l-2xl md:border-l md:border-t-0"
      >
        <header className="flex shrink-0 items-start justify-between gap-4 border-b border-slate/15 px-5 py-4">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate">
              Lead detayı
            </p>
            <h2
              id="lead-detail-drawer-title"
              className="mt-1 text-lg font-bold text-deep-navy"
            >
              {lead.name}
            </h2>
            <p className="mt-0.5 break-words text-sm text-slate">{lead.company}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-slate/20 text-slate transition-colors hover:bg-off-white hover:text-deep-navy"
            aria-label="Kapat"
          >
            <span aria-hidden className="text-xl leading-none">
              ×
            </span>
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5">
          <div className="space-y-4">
            <DetailSection title="Lead Özeti">
              <DetailRow label="Ad Soyad" value={displayValue(lead.name)} />
              <DetailRow label="Şirket" value={displayValue(lead.company)} />
              <div className="grid gap-1 sm:grid-cols-[9rem_1fr] sm:gap-3">
                <dt className="font-medium text-slate">İletişim</dt>
                <dd>
                  <LeadContactCell lead={lead} />
                </dd>
              </div>
              <div className="grid gap-1 sm:grid-cols-[9rem_1fr] sm:gap-3">
                <dt className="font-medium text-slate">Oluşturulma</dt>
                <dd>
                  <time
                    dateTime={lead.createdAt}
                    title={lead.createdAt}
                    className="text-deep-navy"
                  >
                    {formatLocalDateTime(lead.createdAt)}
                  </time>
                  <p className="mt-1 break-all text-xs text-slate">
                    UTC: {lead.createdAt}
                  </p>
                </dd>
              </div>
              <div className="grid gap-1 sm:grid-cols-[9rem_1fr] sm:items-center sm:gap-3">
                <dt className="font-medium text-slate">Öncelik / Durum</dt>
                <dd className="flex flex-wrap gap-2">
                  <LeadPriorityBadge lead={lead} />
                  <LeadStatusBadge status={status} />
                </dd>
              </div>
              <DetailRow label="Lead ID" value={displayValue(lead.id)} />
              <DetailRow label="Depolama" value={displayValue(lead.storageMode)} />
            </DetailSection>

            <DetailSection title="Lead Kalitesi">
              <LeadQualityDetail quality={quality} />
            </DetailSection>

            <DetailSection title="Veri Kalitesi">
              <LeadDataQualityDetail
                detection={testDetection}
                lead={lead}
                onSaved={onLeadTestClassificationPatched}
              />
            </DetailSection>

            <DetailSection title="Takip Durumu">
              <div className="grid gap-1 sm:grid-cols-[9rem_1fr] sm:items-center sm:gap-3">
                <dt className="font-medium text-slate">SLA</dt>
                <dd>
                  <LeadFollowUpSlaBadge sla={followUpSla} />
                </dd>
              </div>
              <DetailRow label="Yaş" value={followUpSla.ageLabel} />
              <DetailRow
                label="Önerilen aksiyon"
                value={followUpSla.recommendedAction}
              />
            </DetailSection>

            <LeadActionCenter
              lead={lead}
              recommendation={actionRecommendation}
            />

            <DetailSection title="Kaynak Analizi">
              <DetailRow
                label="Attribution"
                value={displayValue(attribution.attributionLabel)}
              />
              <DetailRow
                label="Sayfa"
                value={displayValue(attribution.sourcePageLabel)}
              />
              <DetailRow
                label="Araç"
                value={displayValue(attribution.sourceToolLabel)}
              />
              <DetailRow
                label="Seviye"
                value={displayValue(attribution.toolTierLabel)}
              />
              <DetailRow
                label="Sektör"
                value={displayValue(attribution.industryLabel)}
              />
              <DetailRow label="Plan" value={displayValue(attribution.planLabel)} />
              <DetailRow label="CTA" value={displayValue(attribution.ctaLabel)} />
              <DetailRow
                label="Referrer"
                value={displayValue(attribution.referrerLabel)}
              />
              <DetailRow label="UTM" value={displayValue(attribution.utmSummary)} />
            </DetailSection>

            <DetailSection title="Talep Bilgisi">
              <DetailRow label="Intent" value={displayValue(formatLeadIntentSummary(lead))} />
              <DetailRow label="Araç" value={displayValue(lead.toolRequested)} />
              <DetailRow label="Kaynak" value={displayValue(formatLeadSource(lead.source))} />
              <DetailRow label="Source tool" value={displayValue(lead.sourceTool)} />
              <DetailRow label="Plan" value={displayValue(formatLeadPlan(lead.plan))} />
              <DetailRow label="Sektör" value={displayValue(lead.industry)} />
              <DetailRow label="Sayfa" value={displayValue(lead.pagePath)} />
            </DetailSection>

            <DetailSection title="Mesaj / Form Detayı">
              <DetailRow label="Kullanım amacı" value={displayValue(lead.intendedUse)} />
              <DetailRow label="Mesaj" value={displayValue(lead.message)} />
            </DetailSection>

            <DetailSection title="Admin Alanı">
              <DetailRow label="Admin notu" value={displayValue(lead.adminNote)} />
              <DetailRow
                label="Next action"
                value={
                  suggestedNextAction
                    ? `${nextAction} (öneri)`
                    : displayValue(nextAction)
                }
              />
              <DetailRow
                label="Lead score"
                value={displayValue(lead.leadScore)}
              />
              <DetailRow
                label="Öncelik (hesap)"
                value={getLeadPriorityLabel(priority)}
              />
              <DetailRow
                label="Güncellenme"
                value={displayValue(
                  lead.updatedAt
                    ? formatLocalDateTime(lead.updatedAt)
                    : undefined
                )}
              />
              {lead.updatedAt ? (
                <DetailRow label="UTC güncelleme" value={lead.updatedAt} />
              ) : null}
            </DetailSection>

            <DetailSection title="Aktivite Geçmişi">
              <LeadActivityList
                lead={lead}
                refreshKey={`${lead.updatedAt ?? lead.id}-${String(lead.isTestLead)}-${lead.testLeadMarkedAt ?? ""}`}
              />
            </DetailSection>

            <DetailSection title="Hızlı Aksiyon">
              <LeadPipelineControls lead={lead} layout="mobile" onSaved={onLeadPatched} />
            </DetailSection>

            <details className="rounded-xl border border-slate/20 bg-off-white/50 px-4 py-3 text-sm">
              <summary className="cursor-pointer font-medium text-slate">
                Ham kayıt (JSON)
              </summary>
              <pre className="mt-3 max-h-48 overflow-auto break-words rounded-lg border border-slate/15 bg-white p-3 text-xs text-deep-navy">
                {JSON.stringify(lead, null, 2)}
              </pre>
            </details>
          </div>
        </div>
      </aside>
    </div>
  );
}
