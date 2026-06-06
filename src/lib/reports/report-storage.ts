import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { getFirestoreDb } from "@/lib/firebase/client";
import { buildVerdictReportData, type VerdictReportData, type VerdictReportInput } from "@/lib/reports/verdict-report";
import type {
  PremiumSeverity,
  PremiumToolInputValues,
  PremiumToolResult,
} from "@/lib/tools/premium-tool-results";
import type { RevenueTool } from "@/lib/tools/revenue-tools";

const COLLECTION_NAME = "reports";

export type SavedVerdictReportResult = {
  verdict: string;
  headline: string;
  primaryMetricLabel: string;
  primaryMetricValue: string;
  riskDrivers: string[];
  suggestedAction: string;
  severity: PremiumSeverity;
};

export type SavedVerdictReport = {
  id: string;
  uid: string;
  toolSlug: string;
  toolTitle: string;
  sector: string;
  createdAt: string;
  updatedAt: string;
  result: SavedVerdictReportResult;
  inputs: VerdictReportInput[];
  legalDisclaimer: string;
};

export type SaveVerdictReportResult =
  | { ok: true; id: string }
  | { ok: false; error: string };

function isPremiumSeverity(value: unknown): value is PremiumSeverity {
  return value === "safe" || value === "watch" || value === "danger";
}

function normalizeInputSummary(value: unknown): VerdictReportInput[] {
  if (!Array.isArray(value)) {
    return [];
  }

  const inputs: VerdictReportInput[] = [];

  for (const item of value) {
    if (!item || typeof item !== "object") {
      continue;
    }
    const record = item as Record<string, unknown>;
    const label = typeof record.label === "string" ? record.label : "";
    const inputValue = typeof record.value === "string" ? record.value : "";
    if (label.length === 0) {
      continue;
    }
    inputs.push({ label, value: inputValue });
  }

  return inputs;
}

function normalizeSavedVerdictReportResult(
  value: unknown
): SavedVerdictReportResult | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const data = value as Record<string, unknown>;
  const verdict = typeof data.verdict === "string" ? data.verdict : "";
  const headline = typeof data.headline === "string" ? data.headline : "";
  const primaryMetricLabel =
    typeof data.primaryMetricLabel === "string" ? data.primaryMetricLabel : "";
  const primaryMetricValue =
    typeof data.primaryMetricValue === "string" ? data.primaryMetricValue : "";
  const suggestedAction =
    typeof data.suggestedAction === "string" ? data.suggestedAction : "";
  const severity = isPremiumSeverity(data.severity) ? data.severity : "watch";
  const riskDrivers = Array.isArray(data.riskDrivers)
    ? data.riskDrivers.filter((item): item is string => typeof item === "string")
    : [];

  if (
    verdict.length === 0 ||
    headline.length === 0 ||
    primaryMetricLabel.length === 0 ||
    primaryMetricValue.length === 0 ||
    suggestedAction.length === 0
  ) {
    return null;
  }

  return {
    verdict,
    headline,
    primaryMetricLabel,
    primaryMetricValue,
    riskDrivers,
    suggestedAction,
    severity,
  };
}

function normalizeSavedVerdictReport(
  id: string,
  value: unknown
): SavedVerdictReport | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const data = value as Record<string, unknown>;
  const uid = typeof data.uid === "string" ? data.uid : "";
  const toolSlug = typeof data.toolSlug === "string" ? data.toolSlug : "";
  const toolTitle = typeof data.toolTitle === "string" ? data.toolTitle : "";
  const sector = typeof data.sector === "string" ? data.sector : "";
  const createdAt = typeof data.createdAt === "string" ? data.createdAt : "";
  const updatedAt = typeof data.updatedAt === "string" ? data.updatedAt : "";
  const legalDisclaimer =
    typeof data.legalDisclaimer === "string" ? data.legalDisclaimer : "";
  const result = normalizeSavedVerdictReportResult(data.result);
  const inputs = normalizeInputSummary(data.inputs);

  if (
    uid.length === 0 ||
    toolSlug.length === 0 ||
    toolTitle.length === 0 ||
    sector.length === 0 ||
    createdAt.length === 0 ||
    updatedAt.length === 0 ||
    legalDisclaimer.length === 0 ||
    !result
  ) {
    return null;
  }

  return {
    id,
    uid,
    toolSlug,
    toolTitle,
    sector,
    createdAt,
    updatedAt,
    result,
    inputs,
    legalDisclaimer,
  };
}

function buildReportDocument({
  uid,
  tool,
  values,
  result,
}: {
  uid: string;
  tool: RevenueTool;
  values: PremiumToolInputValues;
  result: PremiumToolResult;
}) {
  const reportData = buildVerdictReportData({ tool, values, result });
  const timestamp = new Date().toISOString();

  return {
    uid,
    toolSlug: tool.paidSlug,
    toolTitle: reportData.toolTitle,
    sector: reportData.sector,
    createdAt: timestamp,
    updatedAt: timestamp,
    result: {
      verdict: reportData.verdict,
      headline: reportData.headline,
      primaryMetricLabel: reportData.primaryMetricLabel,
      primaryMetricValue: reportData.primaryMetricValue,
      riskDrivers: reportData.riskDrivers,
      suggestedAction: reportData.suggestedAction,
      severity: result.severity,
    },
    inputs: reportData.inputs,
    legalDisclaimer: reportData.legalDisclaimer,
  };
}

export async function saveVerdictReport({
  uid,
  tool,
  values,
  result,
}: {
  uid: string;
  tool: RevenueTool;
  values: PremiumToolInputValues;
  result: PremiumToolResult;
}): Promise<SaveVerdictReportResult> {
  if (!uid.trim()) {
    return { ok: false, error: "User is not signed in." };
  }

  const db = getFirestoreDb();
  if (!db) {
    return { ok: false, error: "Firestore is unavailable." };
  }

  try {
    const payload = buildReportDocument({ uid, tool, values, result });
    const docRef = await addDoc(collection(db, COLLECTION_NAME), payload);
    return { ok: true, id: docRef.id };
  } catch {
    return { ok: false, error: "Could not save report." };
  }
}

export async function listUserVerdictReports(
  uid: string
): Promise<SavedVerdictReport[]> {
  if (!uid.trim()) {
    return [];
  }

  const db = getFirestoreDb();
  if (!db) {
    return [];
  }

  try {
    const reportsQuery = query(
      collection(db, COLLECTION_NAME),
      where("uid", "==", uid),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(reportsQuery);

    const reports: SavedVerdictReport[] = [];
    for (const docSnapshot of snapshot.docs) {
      const normalized = normalizeSavedVerdictReport(
        docSnapshot.id,
        docSnapshot.data()
      );
      if (normalized) {
        reports.push(normalized);
      }
    }
    return reports;
  } catch {
    return [];
  }
}

export async function getUserVerdictReport({
  uid,
  reportId,
}: {
  uid: string;
  reportId: string;
}): Promise<SavedVerdictReport | null> {
  if (!uid.trim() || !reportId.trim()) {
    return null;
  }

  const db = getFirestoreDb();
  if (!db) {
    return null;
  }

  try {
    const docRef = doc(db, COLLECTION_NAME, reportId);
    const snapshot = await getDoc(docRef);
    if (!snapshot.exists()) {
      return null;
    }

    const normalized = normalizeSavedVerdictReport(reportId, snapshot.data());
    if (!normalized || normalized.uid !== uid) {
      return null;
    }

    return normalized;
  } catch {
    return null;
  }
}

export function savedReportToVerdictReportData(
  report: SavedVerdictReport
): VerdictReportData {
  return {
    toolTitle: report.toolTitle,
    sector: report.sector,
    generatedAt: report.createdAt,
    verdict: report.result.verdict,
    headline: report.result.headline,
    primaryMetricLabel: report.result.primaryMetricLabel,
    primaryMetricValue: report.result.primaryMetricValue,
    riskDrivers: report.result.riskDrivers,
    suggestedAction: report.result.suggestedAction,
    inputs: report.inputs,
    legalDisclaimer: report.legalDisclaimer,
  };
}
