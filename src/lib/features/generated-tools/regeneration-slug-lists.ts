import freeSlugs from "../../../../free-slugs.json";
import premiumSlugs from "../../../../premium-slugs.json";

export const REGENERATION_FREE_SLUGS = freeSlugs as readonly string[];
export const REGENERATION_PREMIUM_SLUGS = premiumSlugs as readonly string[];
export const REGENERATION_ALL_SLUGS = [...REGENERATION_FREE_SLUGS, ...REGENERATION_PREMIUM_SLUGS] as const;
