import { LEAD_STORAGE_KEY } from "@/data/lead-options";
import { normalizeLeadIntent } from "@/lib/leads/normalize";
import type { LeadIntent } from "@/lib/leads/types";

export function isBrowser(): boolean {
 return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

export function readStoredLeadIntents(): LeadIntent[] {
 if (!isBrowser()) return [];

 try {
 const raw = localStorage.getItem(LEAD_STORAGE_KEY);
 if (!raw) return [];
 const parsed: unknown = JSON.parse(raw);
 if (!Array.isArray(parsed)) return [];
 const leads: LeadIntent[] = [];
 for (const item of parsed) {
 const normalized = normalizeLeadIntent(item);
 if (normalized) leads.push(normalized);
 }
 return leads;
 } catch {
 return [];
 }
}

export function appendStoredLeadIntent(lead: LeadIntent): void {
 if (!isBrowser()) return;

 const existing = readStoredLeadIntents();
 existing.push(lead);
 localStorage.setItem(LEAD_STORAGE_KEY, JSON.stringify(existing));
}
