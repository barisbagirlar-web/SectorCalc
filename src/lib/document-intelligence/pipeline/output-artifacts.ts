/**
 * Document Intelligence — Canonical Output Artifact Contract
 *
 * Single source of truth for output storage layout and artifact filenames.
 * Both the processing pipeline (writer) and the downloads endpoint (reader)
 * MUST use these helpers so that written paths always match read paths.
 */
import "server-only";

export type OutputArtifactKind = "workbook" | "exception_report" | "source_map" | "summary_html";

export interface OutputArtifactSpec {
  kind: OutputArtifactKind;
  /** Filename template. `{jobId}` is substituted at runtime. */
  filenameTemplate: string;
  description: string;
  contentType: string;
}

export const OUTPUT_ARTIFACT_SPECS: readonly OutputArtifactSpec[] = [
  {
    kind: "workbook",
    filenameTemplate: "SectorCalc_Maintenance_BOM_{jobId}.xlsx",
    description: "Full ERP-Ready BOM Workbook",
    contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  },
  {
    kind: "exception_report",
    filenameTemplate: "SectorCalc_Procurement_Exception_Report_{jobId}.xlsx",
    description: "Procurement Exception Report",
    contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  },
  {
    kind: "source_map",
    filenameTemplate: "SectorCalc_Source_Map_{jobId}.csv",
    description: "Source Traceability Map",
    contentType: "text/csv",
  },
  {
    kind: "summary_html",
    filenameTemplate: "SectorCalc_Processing_Summary_{jobId}.html",
    description: "Processing Summary (Printable)",
    contentType: "text/html",
  },
] as const;

/**
 * Canonical storage prefix for a job's output artifacts.
 * Layout: document-intelligence/{userId}/{jobId}/output
 */
export function outputStoragePrefix(userId: string, jobId: string): string {
  return `document-intelligence/${userId}/${jobId}/output`;
}

export function artifactFilename(spec: OutputArtifactSpec, jobId: string): string {
  return spec.filenameTemplate.replace("{jobId}", jobId);
}

export function artifactStoragePath(userId: string, jobId: string, spec: OutputArtifactSpec): string {
  return `${outputStoragePrefix(userId, jobId)}/${artifactFilename(spec, jobId)}`;
}
