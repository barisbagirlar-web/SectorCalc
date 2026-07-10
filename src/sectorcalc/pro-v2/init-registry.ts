// SectorCalc PRO V2 — Registry Initialization
// Call initProV2Registry() at app startup to register all migrated tools.

import { registerTool, getToolDefinition, getRegisteredSlugs } from "./proToolRegistry";
import { registerWeldTool } from "./register-weld-tool";
import { registerMachineHourlyRateTool } from "./register-machine-hourly-rate";
import { registerJobQuoteBuilderTool } from "./register-job-quote-builder";
import { registerLossMakingJobDetectorTool } from "./register-loss-making-job-detector";
import { registerBreakEvenTool } from "./register-break-even";
import { registerEmployeeCostTool } from "./register-employee-cost";

let initialized = false;

export function initProV2Registry(): void {
  if (initialized) return;
  initialized = true;

  // Wave 0 — Golden reference
  registerWeldTool();

  // Wave 1 — Cost and quotation tools
  registerMachineHourlyRateTool();
  registerJobQuoteBuilderTool();
  registerLossMakingJobDetectorTool();
  registerBreakEvenTool();
  registerEmployeeCostTool();
}

export { getToolDefinition, getRegisteredSlugs };
