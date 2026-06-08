/**
 * Smart form pilot manual QA checklist builder — Phase 5H-G-I.
 */

import {
  getSmartFormPilotBatchRegistry,
  type SmartFormPilotBatchRegistryEntry,
} from "@/components/tools/smart-form/pilot-batch-qa-registry";

export type SmartFormPilotManualQaCheckItem = {
  readonly id: string;
  readonly label: string;
  readonly required: boolean;
};

export type SmartFormPilotManualQaPilotChecklist = {
  readonly routeSlug: string;
  readonly governanceSlug: string;
  readonly manualQaUrl: string;
  readonly checks: readonly SmartFormPilotManualQaCheckItem[];
};

export type SmartFormPilotManualQaChecklist = {
  readonly totalPilots: number;
  readonly pilots: readonly SmartFormPilotManualQaPilotChecklist[];
  readonly manualQaUrls: readonly string[];
};

const STANDARD_CHECKS: readonly Omit<SmartFormPilotManualQaCheckItem, "id">[] = [
  { label: "Desktop layout renders without horizontal scroll", required: true },
  { label: "Mobile layout renders without horizontal scroll", required: true },
  { label: "Browser console has no errors after load and submit", required: true },
  { label: "Network tab shows no failed requests on submit", required: true },
  { label: "Flag false fallback shows classic free form", required: true },
  { label: "Flag true shows smart form bridge renderer", required: true },
  { label: "Required mapped inputs accept numeric values", required: true },
  { label: "Derived fields render read-only", required: true },
  { label: "Assumption callouts render and are not editable submit fields", required: true },
  { label: "Pilot calculate produces result card", required: true },
  { label: "free_tool_started and free_tool_completed analytics fire once", required: true },
  { label: "Result card matches classic path for same mapped inputs", required: true },
];

function buildChecksForPilot(entry: SmartFormPilotBatchRegistryEntry): SmartFormPilotManualQaCheckItem[] {
  return STANDARD_CHECKS.map((check, index) => ({
    id: `${entry.routeSlug}-${index}`,
    ...check,
  }));
}

export function buildSmartFormPilotManualQaChecklist(): SmartFormPilotManualQaChecklist {
  const registry = getSmartFormPilotBatchRegistry();
  const pilots = registry.map((entry) => ({
    routeSlug: entry.routeSlug,
    governanceSlug: entry.governanceSlug,
    manualQaUrl: entry.manualQaUrl,
    checks: buildChecksForPilot(entry),
  }));

  return {
    totalPilots: pilots.length,
    pilots,
    manualQaUrls: pilots.map((pilot) => pilot.manualQaUrl),
  };
}
