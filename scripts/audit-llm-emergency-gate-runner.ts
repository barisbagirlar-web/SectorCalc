import { buildCategorizedToolIndex } from "../src/lib/catalog/build-categorized-tool-index";
import { listPublicFreeToolSlugsExcludingMigrated } from "../src/lib/freemium/resolve-free-to-premium-migration";

export const EMERGENCY_GATE_MIGRATED_FREE_SLUGS = [
  "oee-calculator",
  "laser-cutting-time-check",
  "3d-print-cost-check",
  "cbam-exposure-quick-check",
  "rent-vs-buy-calculator",
  "sample-size-calculator",
  "linear-regression-calculator",
  "kdv-tevkifati-hesaplama",
  "sgk-prim-hesaplama-isci-plus-isveren",
  "ic-verim-orani-irr-hesaplama",
  "basincli-kap-cidar-kalinligi-hesabi",
  "istatistiksel-proses-kontrol-spc-limit-hesabi",
  "alti-sigma-dpmo-sigma-seviyesi-cevirici",
  "navlun-maliyeti-hesaplayici",
] as const;

const freeIndexSlugs = new Set(
  buildCategorizedToolIndex()
    .filter((item) => item.tier === "free")
    .map((item) => item.slug),
);
const publicFreeSlugs = new Set(listPublicFreeToolSlugsExcludingMigrated());

const stillInFreeIndex = EMERGENCY_GATE_MIGRATED_FREE_SLUGS.filter((slug) =>
  freeIndexSlugs.has(slug),
);
const stillInPublicFree = EMERGENCY_GATE_MIGRATED_FREE_SLUGS.filter((slug) =>
  publicFreeSlugs.has(slug),
);

console.log(JSON.stringify({ stillInFreeIndex, stillInPublicFree }));
