"use client";

import { HubLink } from "@/components/layout/HubLink";
import type { SectorRegistryKey } from "@/lib/os/registry/sectors";

/** Cross-hub prefetch map - related sectors for entity graph & crawl depth. */
const RELATED_SECTORS: Partial<Record<SectorRegistryKey, readonly SectorRegistryKey[]>> = {
  cnc: ["logistics", "construction", "metalworking"],
  logistics: ["cnc", "construction", "marine"],
  construction: ["cnc", "logistics", "facility_mgmt"],
  agriculture: ["livestock", "food_bev", "construction"],
  energy_plant: ["hvac", "water_utility", "metalworking"],
  textile: ["cnc", "metalworking", "logistics"],
};

export interface SectorHubCrossLinksProps {
  sectorKey: SectorRegistryKey;
  sectorName: string;
}

export function SectorHubCrossLinks({ sectorKey, sectorName }: SectorHubCrossLinksProps) {
  const related = RELATED_SECTORS[sectorKey] ?? ["cnc", "logistics", "construction"];

  return (
    <nav
      aria-label="Related industrial hubs"
      className="mt-10 border-t border-technical-gray pt-6 font-sans text-sm"
    >
      <p className="label-badge mb-3 text-body-charcoal">Related Intelligence Hubs</p>
      <ul className="flex flex-wrap gap-3">
        {related.map((key) => (
          <li key={key}>
            <HubLink
              href={`/audit/${key}`}
              className="text-body-charcoal transition-colors hover:text-premium-velvet"
            >
              {key.replace(/_/g, " ")}
            </HubLink>
          </li>
        ))}
        <li>
          <HubLink
            href="/benchmarks"
            className="text-body-charcoal transition-colors hover:text-premium-velvet"
          >
            Industry Benchmarks
          </HubLink>
        </li>
        <li>
          <HubLink
            href="/sustainability"
            className="text-body-charcoal transition-colors hover:text-premium-velvet"
          >
            CBAM Suite
          </HubLink>
        </li>
      </ul>
      <p className="mt-3 text-xs text-body-charcoal">
        Cross-linked from {sectorName} audit - no orphan pages in the SectorCalc entity graph.
      </p>
    </nav>
  );
}
