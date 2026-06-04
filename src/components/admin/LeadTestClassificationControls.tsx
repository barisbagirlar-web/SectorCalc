"use client";

import { useEffect, useState } from "react";
import { useAdminAuth } from "@/lib/admin/use-admin-auth";
import { isAdminLeadWriteEnabled } from "@/lib/admin/lead-write-config";
import { type TestLeadDetection } from "@/lib/leads/lead-cleanup";
import { updateTestLeadClassificationClient } from "@/lib/leads/update-test-lead-classification-client";
import type { LeadIntent } from "@/lib/leads/types";

const MAX_REASON_LENGTH = 300;

export interface TestLeadClassificationPatch {
  isTestLead: boolean;
  testLeadReason?: string;
  testLeadMarkedAt?: string;
  testLeadMarkedByUid?: string;
  testLeadMarkedByEmail?: string;
  updatedAt?: string;
}

interface LeadTestClassificationControlsProps {
  lead: LeadIntent;
  detection: TestLeadDetection;
  onSaved?: (leadId: string, patch: TestLeadClassificationPatch) => void;
}

type SaveFeedback = "saved" | "error" | null;

const fieldClass =
  "w-full min-h-[44px] rounded-lg border border-slate/25 bg-white px-3 text-sm text-deep-navy focus:border-professional-blue focus:outline-none focus:ring-2 focus:ring-professional-blue/20";

export function LeadTestClassificationControls({
  lead,
  detection,
  onSaved,
}: LeadTestClassificationControlsProps) {
  const writeFlagEnabled = isAdminLeadWriteEnabled();
  const { loading: authLoading, isAdmin, user, getIdToken } = useAdminAuth();
  const [reason, setReason] = useState(lead.testLeadReason ?? "");
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<SaveFeedback>(null);

  useEffect(() => {
    setReason(lead.testLeadReason ?? "");
    setFeedback(null);
  }, [lead]);

  const canSaveFirestore = lead.storageMode === "firestore";
  const canWrite = writeFlagEnabled && isAdmin && canSaveFirestore;
  const isExplicitlyMarked = lead.isTestLead === true;
  const isExplicitlyUnmarked = lead.isTestLead === false;
  const canUnmark = detection.isTestLead && !isExplicitlyUnmarked;
  const canMark = !isExplicitlyMarked;

  const handleMark = async (markAsTest: boolean) => {
    if (!canWrite || !onSaved) {
      setFeedback("error");
      return;
    }

    const idToken = await getIdToken();
    if (!idToken) {
      setFeedback("error");
      return;
    }

    const trimmedReason = reason.trim();
    const previousPatch: TestLeadClassificationPatch = {
      isTestLead: lead.isTestLead ?? false,
      testLeadReason: lead.testLeadReason,
      testLeadMarkedAt: lead.testLeadMarkedAt,
      testLeadMarkedByUid: lead.testLeadMarkedByUid,
      testLeadMarkedByEmail: lead.testLeadMarkedByEmail,
      updatedAt: lead.updatedAt,
    };

    const optimisticPatch: TestLeadClassificationPatch = {
      isTestLead: markAsTest,
      testLeadReason: markAsTest ? trimmedReason : "",
      testLeadMarkedAt: new Date().toISOString(),
      testLeadMarkedByUid: user?.uid,
      testLeadMarkedByEmail: user?.email ?? undefined,
      updatedAt: new Date().toISOString(),
    };

    onSaved(lead.id, optimisticPatch);
    setSaving(true);
    setFeedback(null);

    const result = await updateTestLeadClassificationClient({
      leadId: lead.id,
      isTestLead: markAsTest,
      testLeadReason: markAsTest ? trimmedReason : "",
      idToken,
    });

    if (!result.success) {
      onSaved(lead.id, previousPatch);
      setFeedback("error");
      setSaving(false);
      return;
    }

    onSaved(lead.id, {
      isTestLead: result.isTestLead ?? markAsTest,
      testLeadReason: result.testLeadReason,
      testLeadMarkedAt: result.testLeadMarkedAt,
      testLeadMarkedByUid: result.testLeadMarkedByUid,
      testLeadMarkedByEmail: result.testLeadMarkedByEmail,
      updatedAt: result.updatedAt,
    });
    setFeedback("saved");
    setSaving(false);
  };

  if (!canSaveFirestore) {
    return (
      <p className="text-xs text-slate">
        Manuel test lead işaretleme yalnızca Firestore lead&apos;leri için kullanılabilir.
      </p>
    );
  }

  if (!writeFlagEnabled) {
    return (
      <p className="text-xs text-slate">
        Admin yazma altyapısı yapılandırılmamış.
      </p>
    );
  }

  if (!isAdmin) {
    return (
      <p className="text-xs text-slate">Bu işlem için admin girişi gerekli.</p>
    );
  }

  return (
    <div className="space-y-3 border-t border-slate/15 pt-4">
      <label className="block space-y-1.5">
        <span className="text-xs font-medium text-slate">Test lead açıklaması</span>
        <textarea
          value={reason}
          onChange={(event) => setReason(event.target.value.slice(0, MAX_REASON_LENGTH))}
          rows={2}
          placeholder="Opsiyonel kısa açıklama"
          disabled={saving || authLoading}
          className={`${fieldClass} min-h-[72px] resize-y py-2`}
        />
      </label>

      <div className="flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          disabled={saving || authLoading || !canMark}
          onClick={() => void handleMark(true)}
          className="inline-flex min-h-[44px] flex-1 items-center justify-center rounded-lg border border-slate/25 bg-white px-3 text-sm font-semibold text-deep-navy transition-colors hover:border-professional-blue/40 hover:bg-off-white disabled:opacity-50"
        >
          {saving ? "Kaydediliyor…" : "Test Lead Olarak İşaretle"}
        </button>
        <button
          type="button"
          disabled={saving || authLoading || !canUnmark}
          onClick={() => void handleMark(false)}
          className="inline-flex min-h-[44px] flex-1 items-center justify-center rounded-lg border border-slate/25 bg-white px-3 text-sm font-semibold text-deep-navy transition-colors hover:border-professional-blue/40 hover:bg-off-white disabled:opacity-50"
        >
          {saving ? "Kaydediliyor…" : "Test Lead İşaretini Kaldır"}
        </button>
      </div>

      {feedback === "saved" ? (
        <p className="text-xs font-medium text-emerald-700" role="status">
          Kaydedildi
        </p>
      ) : null}
      {feedback === "error" ? (
        <p className="text-xs font-medium text-soft-red" role="alert">
          Kaydedilemedi. URL yapılandırmasını ve admin yetkisini kontrol edin.
        </p>
      ) : null}

      {detection.isManualMark && lead.testLeadMarkedByEmail ? (
        <p className="text-xs text-slate">
          Son işaretleyen: {lead.testLeadMarkedByEmail}
        </p>
      ) : null}
    </div>
  );
}
