"use client";

import type { IndustrySlug } from "@/lib/tools/industry-registry";
import { PremiumAuditInput } from "@/components/os/PremiumAuditInput";
import { industrySlugToSectorKey } from "@/lib/os/registry/sectors";

export interface IndustryAuditModuleProps {
  industrySlug: IndustrySlug;
}

export function IndustryAuditModule({ industrySlug }: IndustryAuditModuleProps) {
  const sectorId = industrySlugToSectorKey(industrySlug);

  return (
    <div className="mx-auto max-w-5xl">
      <PremiumAuditInput sectorId={sectorId} />
    </div>
  );
}
