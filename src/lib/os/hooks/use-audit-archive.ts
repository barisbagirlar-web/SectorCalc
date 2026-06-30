"use client";

import { useMemo } from "react";
import { useUserSubscription } from "@/lib/features/billing/use-user-subscription";
import { AUDIT_ARCHIVE_PLACEHOLDER } from "@/lib/os/data/audit-archive-data";
import { savedReportsToAuditRecords } from "@/lib/os/data/map-audit-records";
import type { AuditRecord } from "@/lib/os/data/audit-archive-data";
import { useUserReports } from "@/lib/features/reports/use-user-reports";

export type UseAuditArchiveState = {
  records: readonly AuditRecord[];
  loading: boolean;
  error: string | null;
  isSample: boolean;
  isAuthenticated: boolean;
};

export function useAuditArchive(maxRecords = 50): UseAuditArchiveState {
  const { user, loading: authLoading } = useUserSubscription();
  const { reports, loading: reportsLoading, error } = useUserReports(user, maxRecords);

  const records = useMemo(() => {
    if (!user) {
      return AUDIT_ARCHIVE_PLACEHOLDER;
    }
    return savedReportsToAuditRecords(reports);
  }, [user, reports]);

  return {
    records,
    loading: authLoading || (Boolean(user) && reportsLoading),
    error: user ? error : null,
    isSample: !user,
    isAuthenticated: Boolean(user),
  };
}
