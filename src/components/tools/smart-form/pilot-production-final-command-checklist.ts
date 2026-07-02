/**
 * Smart form pilot production final command checklist - Phase 5H-G-R.
 */

import {
  SMART_FORM_PILOT_PRODUCTION_DEPLOY_COMMAND,
  SMART_FORM_PILOT_PRODUCTION_ROLLBACK_COMMAND,
} from "@/components/tools/smart-form/pilot-production-deploy-execution-plan";
import { buildSmartFormPilotProductionRollbackChecklist } from "@/components/tools/smart-form/pilot-production-rollback-checklist";

export type SmartFormPilotProductionFinalCommandChecklistItem = {
  readonly id: string;
  readonly label: string;
  readonly required: boolean;
};

export type SmartFormPilotProductionFinalCommandChecklist = {
  readonly items: readonly SmartFormPilotProductionFinalCommandChecklistItem[];
  readonly pilotRoutes: readonly string[];
  readonly deployCommand: string;
  readonly rollbackCommand: string;
};

const FINAL_COMMAND_ITEMS: readonly Omit<SmartFormPilotProductionFinalCommandChecklistItem, "id">[] =
  [
    { label: "git status clean", required: true },
    { label: "main branch current", required: true },
    { label: "build passed", required: true },
    { label: "check:secrets passed", required: true },
    { label: "production deploy audit ready", required: true },
    { label: "final user command approval required", required: true },
    { label: "deploy command copied but not executed", required: true },
    { label: "rollback command ready", required: true },
    { label: "post-deploy smoke route list ready", required: true },
  ];

export function buildSmartFormPilotProductionFinalCommandChecklist(): SmartFormPilotProductionFinalCommandChecklist {
  const rollbackChecklist = buildSmartFormPilotProductionRollbackChecklist();

  return {
    items: FINAL_COMMAND_ITEMS.map((item, index) => ({
      id: `final-command-${index}`,
      ...item,
    })),
    pilotRoutes: rollbackChecklist.pilotRoutes,
    deployCommand: SMART_FORM_PILOT_PRODUCTION_DEPLOY_COMMAND,
    rollbackCommand: SMART_FORM_PILOT_PRODUCTION_ROLLBACK_COMMAND,
  };
}
