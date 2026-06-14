export const PREMIUM_FULL_LOOP_RUNTIME_SLUGS: readonly string[] = [];
export const FREE_FULL_LOOP_RUNTIME_SLUGS: readonly string[] = [];
export function isPremiumFullLoopRuntimeSlug(_slug: string): boolean {
  return false;
}
export function isFreeFullLoopRuntimeSlug(_slug: string): boolean {
  return false;
}
export function listFullLoopRuntimeSlugs(): readonly string[] {
  return [];
}

export function isFullLoopRuntimeSlug(_slug: string): boolean {
  return false;
}

export function resolveFullLoopContractSlug(slug: string): string {
  return slug;
}
