import { formatLocalDateTime } from "@/lib/format/datetime";
import { formatLeadPlan, formatLeadSource } from "@/lib/leads/admin-metrics";
import {
  formatLeadIntentSummary,
  getLeadPriorityLabel,
  getLeadStatusLabel,
  resolveLeadPriority,
  resolveLeadStatus,
  resolveNextAction,
} from "@/lib/leads/lead-pipeline";
import { resolveLeadAttribution } from "@/lib/leads/source-attribution";
import type { LeadIntent } from "@/lib/leads/types";

const UTF8_BOM = "\uFEFF";

export const LEADS_CSV_HEADERS = [
  "Oluşturulma Tarihi",
  "UTC Tarih",
  "Ad Soyad",
  "E-posta",
  "Telefon",
  "Intent",
  "Tool / Source",
  "Plan",
  "Industry",
  "Priority",
  "Status",
  "Next Action",
  "Admin Note",
  "Lead Score",
  "Attribution",
  "Source Page",
  "Source Tool",
  "Tool Tier",
  "CTA Source",
  "Referrer",
  "UTM Summary",
] as const;

function escapeCsvCell(value: string): string {
  const normalized = value.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  if (
    normalized.includes(",") ||
    normalized.includes('"') ||
    normalized.includes("\n")
  ) {
    return `"${normalized.replace(/"/g, '""')}"`;
  }
  return normalized;
}

function formatToolSource(lead: LeadIntent): string {
  const sourceTool = lead.sourceTool?.trim();
  if (sourceTool) {
    return sourceTool;
  }
  const tool = lead.toolRequested.trim();
  const source = formatLeadSource(lead.source);
  return tool ? `${tool} / ${source}` : source;
}

function formatLeadScore(lead: LeadIntent): string {
  const score = lead.leadScore;
  if (typeof score !== "number" || Number.isNaN(score)) {
    return "";
  }
  return String(score);
}

function leadToCsvRow(lead: LeadIntent): string[] {
  const attribution = resolveLeadAttribution(lead);

  return [
    formatLocalDateTime(lead.createdAt),
    lead.createdAt,
    lead.name,
    lead.email,
    lead.phone?.trim() ?? "",
    formatLeadIntentSummary(lead),
    formatToolSource(lead),
    formatLeadPlan(lead.plan),
    lead.industry,
    getLeadPriorityLabel(resolveLeadPriority(lead)),
    getLeadStatusLabel(resolveLeadStatus(lead)),
    resolveNextAction(lead),
    lead.adminNote?.trim() ?? "",
    formatLeadScore(lead),
    attribution.attributionLabel,
    attribution.sourcePageLabel,
    attribution.sourceToolLabel,
    attribution.toolTierLabel,
    attribution.ctaLabel,
    attribution.referrerLabel,
    attribution.utmSummary,
  ];
}

export function buildLeadsCsv(leads: LeadIntent[]): string {
  const lines: string[] = [
    LEADS_CSV_HEADERS.map(escapeCsvCell).join(","),
    ...leads.map((lead) =>
      leadToCsvRow(lead).map((cell) => escapeCsvCell(cell)).join(",")
    ),
  ];
  return UTF8_BOM + lines.join("\n");
}

export function getLeadsCsvFilename(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `sectorcalc-leads-${year}-${month}-${day}.csv`;
}
