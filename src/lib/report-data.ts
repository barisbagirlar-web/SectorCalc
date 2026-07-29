import type { StackReportData, StackResult } from '../engine-api/types.js';

/** Return the server-authored report payload without re-running decision logic. */
export function buildReportData(result: StackResult): StackReportData {
  return result.reportData;
}
