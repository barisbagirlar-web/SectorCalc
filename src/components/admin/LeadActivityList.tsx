"use client";

import { useEffect, useState } from "react";
import { formatLocalDateTime } from "@/lib/format/datetime";
import {
  entryShowsAdminNote,
  formatActivitySummary,
  formatChangedFieldsLabel,
  getActivityDetailLine,
  getEntryAdminNote,
  listLeadActivity,
  type LeadActivityEntry,
} from "@/lib/leads/lead-activity";
import type { LeadIntent } from "@/lib/leads/types";

interface LeadActivityListProps {
  lead: LeadIntent;
  refreshKey?: string;
}

export function LeadActivityList({ lead, refreshKey }: LeadActivityListProps) {
  const [entries, setEntries] = useState<LeadActivityEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    if (lead.storageMode !== "firestore") {
      setEntries([]);
      setLoading(false);
      setLoadError(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setLoadError(false);

    void listLeadActivity(lead.id, 5)
      .then((data) => {
        if (!cancelled) {
          setEntries(data);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setEntries([]);
          setLoadError(true);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [lead.id, lead.storageMode, refreshKey]);

  if (lead.storageMode !== "firestore") {
    return (
      <p className="text-sm text-slate">
        Aktivite geçmişi yalnızca Firestore lead&apos;leri için kullanılabilir.
      </p>
    );
  }

  if (loading) {
    return (
      <p className="text-sm text-slate" role="status">
        Aktivite geçmişi yükleniyor…
      </p>
    );
  }

  if (loadError) {
    return (
      <p className="text-sm text-slate" role="status">
        Aktivite geçmişi yüklenemedi.
      </p>
    );
  }

  if (entries.length === 0) {
    return (
      <p className="text-sm text-slate">
        Henüz aktivite kaydı yok. Kaydet ile yapılan güncellemeler burada görünür.
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {entries.map((entry) => {
        const detailLine = getActivityDetailLine(entry);

        return (
          <li
            key={entry.id}
            className="rounded-lg border border-slate/15 bg-off-white/60 px-3 py-3 text-sm"
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <p className="font-medium text-deep-navy">
                {formatActivitySummary(entry)}
              </p>
              <time
                dateTime={entry.createdAt}
                title={entry.createdAt}
                className="shrink-0 text-xs text-slate"
              >
                {formatLocalDateTime(entry.createdAt)}
              </time>
            </div>
            {detailLine ? (
              <p className="mt-1 text-xs text-slate">{detailLine}</p>
            ) : null}
            <p className="mt-1 text-xs text-slate">
              {entry.actorEmail ? entry.actorEmail : null}
              {entry.actorEmail ? " · " : null}
              Değişen alanlar: {formatChangedFieldsLabel(entry.changedFields)}
            </p>
            {entryShowsAdminNote(entry) ? (
              <p className="mt-2 line-clamp-2 text-xs text-deep-navy">
                Not: {getEntryAdminNote(entry)}
              </p>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}
