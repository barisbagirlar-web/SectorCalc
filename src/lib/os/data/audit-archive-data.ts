import type { GlobalAuditStatus } from "@/lib/os/core/audit-engine";

export interface AuditRecord {
  id: string;
  timestamp: string;
  sector: string;
  financialImpact: string;
  status: GlobalAuditStatus;
}

export const AUDIT_ARCHIVE_PLACEHOLDER: readonly AuditRecord[] = [
  {
    id: "AUD-2026-0142",
    timestamp: "2026-06-04T09:14:00Z",
    sector: "CNC Machining Intelligence",
    financialImpact: "$1,240.00",
    status: "CRITICAL",
  },
  {
    id: "AUD-2026-0138",
    timestamp: "2026-06-03T16:42:00Z",
    sector: "Construction Project Intelligence",
    financialImpact: "$420.00",
    status: "OPTIMAL",
  },
  {
    id: "AUD-2026-0131",
    timestamp: "2026-06-02T11:08:00Z",
    sector: "Logistics Fleet Intelligence",
    financialImpact: "$890.00",
    status: "CRITICAL",
  },
] as const;
