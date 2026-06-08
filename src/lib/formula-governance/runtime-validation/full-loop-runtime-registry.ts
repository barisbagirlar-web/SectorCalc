/**
 * Slugs with production full-loop runtime enforcement (Mind 2 gate → calc → Mind 1 validation).
 */

export const FULL_LOOP_RUNTIME_SLUGS = ["welding-bid-risk-analyzer"] as const;

export type FullLoopRuntimeSlug = (typeof FULL_LOOP_RUNTIME_SLUGS)[number];

export function isFullLoopRuntimeSlug(slug: string): slug is FullLoopRuntimeSlug {
  return (FULL_LOOP_RUNTIME_SLUGS as readonly string[]).includes(slug);
}
