"use client";

import { ExpertCalcTerminal } from "@/components/os/ExpertCalcTerminal";
import { getSectorEntry, type SectorRegistryKey } from "@/lib/os/registry/sectors";

export interface OsAuditModuleProps {
  sectorId: SectorRegistryKey;
}

export function OsAuditModule({ sectorId }: OsAuditModuleProps) {
  getSectorEntry(sectorId);

  return (
    <div className="mx-auto max-w-5xl">
      <ExpertCalcTerminal sectorId={sectorId} tier="premium" />
    </div>
  );
}
