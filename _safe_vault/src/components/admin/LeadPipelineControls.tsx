"use client";

import { useEffect, useState } from "react";
import { useAdminAuth } from "@/lib/admin/use-admin-auth";
import { isAdminLeadWriteEnabled } from "@/lib/admin/lead-write-config";
import { updateLeadPipelineClient } from "@/lib/leads/update-lead-pipeline-client";
import { LeadPriorityBadge } from "@/components/admin/LeadPriorityBadge";
import { LeadStatusBadge } from "@/components/admin/LeadStatusBadge";
import {
 buildWhatsAppUrl,
 hasCallablePhone,
 PIPELINE_STATUS_OPTIONS,
 resolveLeadStatus,
} from "@/lib/leads/lead-pipeline";
import type { LeadIntent, LeadStatus } from "@/lib/leads/types";

const WRITE_DISABLED_MESSAGE =
 "Admin write infrastructure is being prepared. Only viewing is active for now.";

const AUTH_REQUIRED_MESSAGE = "Admin login required.";

const NOT_ADMIN_MESSAGE = "Admin authorization required for this action.";

const WRITE_ENABLED_HINT =
 "Save writes through the Firebase Auth verified admin account.";

const fieldClass =
 "w-full min-h-[44px] rounded-lg border border-slate/25 bg-white px-3 text-sm text-deep-navy focus:border-professional-blue focus:outline-none focus:ring-2 focus:ring-professional-blue/20";

export interface LeadPipelinePatch {
 status: LeadStatus;
 adminNote?: string;
 updatedAt?: string;
}

interface LeadPipelineControlsProps {
 lead: LeadIntent;
 layout: "table" | "mobile";
 onSaved?: (leadId: string, patch: LeadPipelinePatch) => void;
}

type SaveFeedback = "saved" | "error" | null;

export function LeadPipelineControls({
 lead,
 layout,
 onSaved,
}: LeadPipelineControlsProps) {
 const writeFlagEnabled = isAdminLeadWriteEnabled();
 const { loading: authLoading, user, isAdmin, getIdToken } = useAdminAuth();
 const resolvedStatus = resolveLeadStatus(lead);
 const [draftStatus, setDraftStatus] = useState<LeadStatus>(resolvedStatus);
 const [draftNote, setDraftNote] = useState(lead.adminNote ?? "");
 const [saving, setSaving] = useState(false);
 const [feedback, setFeedback] = useState<SaveFeedback>(null);

 useEffect(() => {
 setDraftStatus(resolveLeadStatus(lead));
 setDraftNote(lead.adminNote ?? "");
 setFeedback(null);
 }, [lead]);

 const whatsAppUrl = buildWhatsAppUrl(lead);
 const canSaveFirestore = lead.storageMode === "firestore";
 const canWrite = writeFlagEnabled && isAdmin && canSaveFirestore;
 const saveDisabled = !canWrite || authLoading || saving;

 const handleSave = async () => {
 if (!writeFlagEnabled || !canSaveFirestore || !onSaved) {
 setFeedback("error");
 return;
 }

 if (!isAdmin) {
 setFeedback("error");
 return;
 }

 const idToken = await getIdToken();
 if (!idToken) {
 setFeedback("error");
 return;
 }

 const previousStatus = lead.status;
 const previousNote = lead.adminNote;
 const previousUpdatedAt = lead.updatedAt;

 const optimisticPatch: LeadPipelinePatch = {
 status: draftStatus,
 adminNote: draftNote.trim() || undefined,
 updatedAt: new Date().toISOString(),
 };

 onSaved(lead.id, optimisticPatch);
 setSaving(true);
 setFeedback(null);

 const result = await updateLeadPipelineClient({
 leadId: lead.id,
 status: draftStatus,
 adminNote: draftNote,
 idToken,
 });

 if (!result.success) {
 onSaved(lead.id, {
 status: previousStatus,
 adminNote: previousNote,
 updatedAt: previousUpdatedAt,
 });
 setDraftStatus(resolveLeadStatus(lead));
 setDraftNote(previousNote ?? "");
 setFeedback("error");
 setSaving(false);
 return;
 }

 onSaved(lead.id, {
 status: result.status ?? draftStatus,
 adminNote: (result.adminNote ?? draftNote.trim()) || undefined,
 updatedAt: result.updatedAt ?? optimisticPatch.updatedAt,
 });
 setFeedback("saved");
 setSaving(false);
 };

 const isCompact = layout === "table";
 const statusMessage = !writeFlagEnabled
 ? WRITE_DISABLED_MESSAGE
 : authLoading
 ? "Checking session…"
 : !user
 ? AUTH_REQUIRED_MESSAGE
 : !isAdmin
 ? NOT_ADMIN_MESSAGE
 : WRITE_ENABLED_HINT;

 return (
 <div className={isCompact ? "space-y-2 min-w-[140px]" : "space-y-3"}>
 <div className={isCompact ? "space-y-1.5" : "flex flex-wrap items-center gap-2"}>
 <LeadPriorityBadge lead={lead} />
 <LeadStatusBadge status={resolvedStatus} />
 </div>

 <label className={isCompact ? "block space-y-1" : "block space-y-1.5"}>
 <span className="text-[10px] font-medium uppercase tracking-wide text-text-secondary">
 Status
 </span>
 <select
 value={draftStatus}
 onChange={(e) => setDraftStatus(e.target.value as LeadStatus)}
 className={fieldClass}
 aria-label="Lead status"
 >
 {PIPELINE_STATUS_OPTIONS.map((opt) => (
 <option key={opt.value} value={opt.value}>
 {opt.label}
 </option>
 ))}
 </select>
 </label>

 <label className={isCompact ? "block space-y-1" : "block space-y-1.5"}>
 <span className="text-[10px] font-medium uppercase tracking-wide text-text-secondary">
 Admin note
 </span>
 <textarea
 value={draftNote}
 onChange={(e) => setDraftNote(e.target.value)}
 rows={isCompact ? 2 : 3}
 maxLength={500}
 placeholder="Optional note…"
 className={`${fieldClass} min-h-[72px] resize-y py-2`}
 />
 </label>

 <div className={isCompact ? "flex flex-col gap-2" : "flex flex-col gap-2 sm:flex-row"}>
 <button
 type="button"
 onClick={() => void handleSave()}
 disabled={saveDisabled}
 title={statusMessage}
 className="inline-flex min-h-[44px] w-full items-center justify-center rounded-lg bg-professional-blue px-3 text-sm font-semibold text-white transition-colors hover:bg-black disabled:cursor-not-allowed disabled:opacity-50"
 >
 {saving ? "Saving…" : "Save"}
 </button>
 {hasCallablePhone(lead) && whatsAppUrl ? (
 <a
 href={whatsAppUrl}
 target="_blank"
 rel="noopener noreferrer"
 className="inline-flex min-h-[44px] w-full items-center justify-center rounded-lg border border-deep-navy/20 bg-bg-subtle px-3 text-sm font-semibold text-text-secondary transition-colors hover:bg-bg-subtle"
 >
 Open WhatsApp
 </a>
 ) : null}
 </div>

 {!canSaveFirestore ? (
 <p className="text-xs text-text-secondary">
 Records can only be updated for Firestore leads.
 </p>
 ) : null}

 <p className="text-xs leading-relaxed text-text-secondary" role="status">
 {statusMessage}
 </p>

 {feedback === "saved" ? (
 <p className="text-xs font-medium text-deep-navy" role="status">
 Saved
 </p>
 ) : null}
 {feedback === "error" ? (
 <p className="text-xs font-medium text-amber" role="alert">
 Failed to save
 </p>
 ) : null}
 </div>
 );
}
