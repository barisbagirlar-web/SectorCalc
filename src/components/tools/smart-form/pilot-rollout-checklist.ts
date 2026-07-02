/**
 * Smart form pilot rollout rollback checklist - Phase 5H-G-L.
 */

import { ROLLOUT_BATCH_H_PRODUCTION_DEPLOYED_ROUTE_SLUGS } from "@/components/tools/smart-form/rollout-batch-h-catalog";
import { SMART_FORM_PILOT_STAGING_FLAG_NAME } from "@/components/tools/smart-form/pilot-staging-rollout-approval";

export type SmartFormPilotRolloutChecklistItem = {
  readonly id: string;
  readonly label: string;
  readonly required: boolean;
};

export type SmartFormPilotRolloutChecklist = {
  readonly flagName: typeof SMART_FORM_PILOT_STAGING_FLAG_NAME;
  readonly pilotRoutes: readonly string[];
  readonly items: readonly SmartFormPilotRolloutChecklistItem[];
};

const ROLLBACK_ITEMS: readonly Omit<SmartFormPilotRolloutChecklistItem, "id">[] = [
  {
    label: `Set env flag ${SMART_FORM_PILOT_STAGING_FLAG_NAME}=false`,
    required: true,
  },
  {
    label: "Rebuild staging/hosting bundle after flag change",
    required: true,
  },
  {
    label: "Verify all three pilot routes fallback to classic free form",
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
];

export function buildSmartFormPilotRolloutRollbackChecklist(): SmartFormPilotRolloutChecklist {
  const pilotRoutes = ROLLOUT_BATCH_H_PRODUCTION_DEPLOYED_ROUTE_SLUGS.map(
    (routeSlug) => `/tools/free/${routeSlug}`,
  );

  return {
    flagName: SMART_FORM_PILOT_STAGING_FLAG_NAME,
    pilotRoutes,
    items: ROLLBACK_ITEMS.map((item, index) => ({
      id: `rollback-${index}`,
      ...item,
    })),
  };
}
