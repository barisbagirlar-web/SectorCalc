/**
 * Smart form pilot production rollback checklist - Phase 5H-G-P.
 */

import { ROLLOUT_BATCH_H_PRODUCTION_DEPLOYED_ROUTE_SLUGS } from "@/components/tools/smart-form/rollout-batch-h-catalog";
import { SMART_FORM_PILOT_STAGING_FLAG_NAME } from "@/components/tools/smart-form/pilot-staging-rollout-approval";

export type SmartFormPilotProductionRollbackChecklistItem = {
  readonly id: string;
  readonly label: string;
  readonly required: boolean;
};

export type SmartFormPilotProductionRollbackChecklist = {
  readonly flagName: typeof SMART_FORM_PILOT_STAGING_FLAG_NAME;
  readonly pilotRoutes: readonly string[];
  readonly items: readonly SmartFormPilotProductionRollbackChecklistItem[];
};

const PRODUCTION_ROLLBACK_ITEMS: readonly Omit<SmartFormPilotProductionRollbackChecklistItem, "id">[] = [
  {
    label: `Set env flag ${SMART_FORM_PILOT_STAGING_FLAG_NAME}=false`,
    required: true,
  },
  {
    label: "Rebuild required after flag change",
    required: true,
  },
  {
    label: "Redeploy previous stable build or flag-off build",
    required: true,
  },
  {
    label: "Verify all three pilot routes use classic fallback form",
    required: true,
  },
  {
    label: "Verify browser console is clean on pilot routes",
    required: true,
  },
  {
    label: "Verify result card uses classic calculation path",
    required: true,
  },
  {
    label: "Verify analytics helper does not throw on submit",
    required: true,
  },
  {
    label: "Verify no production calculator output diff after rollback",
    required: true,
  },
  {
    label: "Verify mobile header menu still works after rollback",
    required: true,
  },
];

export function buildSmartFormPilotProductionRollbackChecklist(): SmartFormPilotProductionRollbackChecklist {
  const pilotRoutes = ROLLOUT_BATCH_H_PRODUCTION_DEPLOYED_ROUTE_SLUGS.map(
    (routeSlug) => `/tools/free/${routeSlug}`,
  );

  return {
    flagName: SMART_FORM_PILOT_STAGING_FLAG_NAME,
    pilotRoutes,
    items: PRODUCTION_ROLLBACK_ITEMS.map((item, index) => ({
      id: `production-rollback-${index}`,
      ...item,
    })),
  };
}
