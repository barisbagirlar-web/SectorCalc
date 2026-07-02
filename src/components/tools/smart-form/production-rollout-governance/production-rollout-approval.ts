/**
 * Smart form production rollout approval - Phase 5I-L default pending.
 */

export const PRODUCTION_ROLLOUT_APPROVED_DEFAULT = false as const;
export const PRODUCTION_ROLLOUT_DEPLOY_REQUIRED_DEFAULT = false as const;

export function isProductionRolloutApproved(): false {
  return false;
}
