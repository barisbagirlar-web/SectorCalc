import { computeLeadQualityScore } from "@/lib/features/leads/lead-quality-score";
import type { LeadIntent } from "@/lib/features/leads/types";

export type TestLeadConfidence = "high" | "medium" | "low";

export interface TestLeadDetection {
 isTestLead: boolean;
 confidence: TestLeadConfidence;
 reasons: string[];
 isManualMark: boolean;
 manualReason?: string;
 manualOverrideNotTest: boolean;
}

export interface LeadCleanupSummary {
 totalLeads: number;
 testLeadCount: number;
 excludedFromMetricsCount: number;
 metricsLeadCount: number;
}

export interface FilterLeadsForMetricsOptions {
 excludeTestLeads?: boolean;
}

const TEST_PATTERNS = ["test", "deneme", "demo", "dfdf", "asdf", "qwer", "123"];
const WEAK_MESSAGE_PATTERNS = ["test", "deneme", "123", "dddd", "dfdf"];

function normalizeText(value: string | undefined): string {
 return value?.trim().toLowerCase() ?? "";
}

function containsTestPattern(value: string): boolean {
 const normalized = normalizeText(value);
 if (!normalized) {
 return false;
 }
 return TEST_PATTERNS.some(
 (pattern) => normalized === pattern || normalized.includes(pattern)
 );
}

function isTestEmail(email: string): boolean {
 return normalizeText(email) === "test@test.com";
}

function isMeaninglessShortMessage(message: string | undefined): boolean {
 const trimmed = message?.trim() ?? "";
 if (trimmed.length === 0 || trimmed.length >= 5) {
 return false;
 }

 if (/^(.)\1+$/.test(trimmed)) {
 return true;
 }

 if (/^[0-9]+$/.test(trimmed)) {
 return true;
 }

 return containsTestPattern(trimmed) || WEAK_MESSAGE_PATTERNS.some((pattern) =>
 trimmed.toLowerCase().includes(pattern)
 );
}

function isSuspiciousCompany(company: string): boolean {
 const normalized = normalizeText(company);
 if (!normalized) {
 return false;
 }

 return (
 /https?:\/\//.test(normalized) ||
 normalized.includes("localhost") ||
 normalized.includes("127.0.0.1") ||
 normalized.startsWith("www.")
 );
}

function hasWeakMessage(lead: LeadIntent): boolean {
 const message = lead.message?.trim() ?? "";
 if (!message) {
 return true;
 }
 const normalized = message.toLowerCase();
 return WEAK_MESSAGE_PATTERNS.some(
 (pattern) => normalized === pattern || normalized.includes(pattern)
 );
}

function countPatternFields(lead: LeadIntent): number {
 let count = 0;
 if (containsTestPattern(lead.name)) count += 1;
 if (containsTestPattern(lead.company)) count += 1;
 if (containsTestPattern(lead.message ?? "")) count += 1;
 return count;
}

function resolveConfidence(
 reasons: string[],
 patternFieldCount: number
): TestLeadConfidence {
 if (
 reasons.some((reason) => reason.includes("test@test.com")) ||
 patternFieldCount >= 3
 ) {
 return "high";
 }

 if (reasons.length >= 2 || patternFieldCount >= 2) {
 return "medium";
 }

 if (reasons.length === 1) {
 return "medium";
 }

 return "low";
}

function resolveIsTestLead(
 reasons: string[],
 confidence: TestLeadConfidence,
 patternFieldCount: number
): boolean {
 if (confidence === "high") {
 return true;
 }

 if (reasons.some((reason) => reason.includes("test@test.com"))) {
 return true;
 }

 if (patternFieldCount >= 2) {
 return true;
 }

 if (
   reasons.some((reason) =>
    reason.includes("Weak message + low quality score")
   )
 ) {
 return true;
 }

 if (confidence === "medium" && reasons.length >= 2) {
 return true;
 }

 return false;
}

function detectAutomaticTestLead(lead: LeadIntent): TestLeadDetection {
 const reasons: string[] = [];

 if (isTestEmail(lead.email)) {
   reasons.push("test@test.com email");
 }

 const patternFieldCount = countPatternFields(lead);
 if (patternFieldCount >= 2) {
   reasons.push(
    `Test/demo-like phrases in name/company/message (${patternFieldCount} fields)`
   );
  } else if (patternFieldCount === 1) {
   if (containsTestPattern(lead.name)) {
    reasons.push("Test/demo-like phrase in name");
   } else if (containsTestPattern(lead.company)) {
    reasons.push("Test/demo-like phrase in company name");
   } else if (containsTestPattern(lead.message ?? "")) {
    reasons.push("Test/demo-like phrase in message");
   }
 }

 if (isMeaninglessShortMessage(lead.message)) {
   reasons.push("Message under 5 characters and meaningless");
 }

 if (isSuspiciousCompany(lead.company)) {
   reasons.push("Company name is URL or localhost-like");
 }

 const quality = computeLeadQualityScore(lead);
 if (hasWeakMessage(lead) && quality.level === "low") {
   reasons.push("Weak message + low quality score");
 }

 const confidence =
 reasons.length === 0 ? "low" : resolveConfidence(reasons, patternFieldCount);

 const isTestLead = resolveIsTestLead(reasons, confidence, patternFieldCount);

 return {
 isTestLead,
 confidence: isTestLead ? confidence : "low",
 reasons,
 isManualMark: false,
 manualOverrideNotTest: false,
 };
}

export function detectTestLead(lead: LeadIntent): TestLeadDetection {
 if (lead.isTestLead === true) {
   const reasons = ["Marked as test lead by admin"];
 if (lead.testLeadReason?.trim()) {
 reasons.push(lead.testLeadReason.trim());
 }
 return {
 isTestLead: true,
 confidence: "high",
 reasons,
 isManualMark: true,
 manualReason: lead.testLeadReason?.trim() || undefined,
 manualOverrideNotTest: false,
 };
 }

 if (lead.isTestLead === false) {
 return {
 isTestLead: false,
 confidence: "low",
   reasons: ["Marked as not test lead by admin"],
 isManualMark: false,
 manualOverrideNotTest: true,
 };
 }

 return detectAutomaticTestLead(lead);
}

export function filterLeadsForMetrics(
 leads: LeadIntent[],
 options: FilterLeadsForMetricsOptions = {}
): LeadIntent[] {
 const excludeTestLeads = options.excludeTestLeads ?? true;

 if (!excludeTestLeads) {
 return leads;
 }

 return leads.filter((lead) => !detectTestLead(lead).isTestLead);
}

export function computeLeadCleanupSummary(
 leads: LeadIntent[],
 options: FilterLeadsForMetricsOptions = {}
): LeadCleanupSummary {
 const excludeTestLeads = options.excludeTestLeads ?? true;
 let testLeadCount = 0;

 for (const lead of leads) {
 if (detectTestLead(lead).isTestLead) {
 testLeadCount += 1;
 }
 }

 const metricsLeads = filterLeadsForMetrics(leads, { excludeTestLeads });
 const excludedFromMetricsCount = excludeTestLeads ? testLeadCount : 0;

 return {
 totalLeads: leads.length,
 testLeadCount,
 excludedFromMetricsCount,
 metricsLeadCount: metricsLeads.length,
 };
}

export function formatTestLeadConfidence(confidence: TestLeadConfidence): string {
 const labels: Record<TestLeadConfidence, string> = {
  high: "High",
  medium: "Medium",
  low: "Low",
 };
 return labels[confidence];
}
