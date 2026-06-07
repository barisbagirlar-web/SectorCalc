import { isFirebaseConfigured } from "@/lib/firebase/client";
import { listLeadIntentsFromFirestore } from "@/lib/leads/firestore";
import { normalizeLeadIntent } from "@/lib/leads/normalize";
import { readStoredLeadIntents, isBrowser } from "@/lib/leads/storage";
import type { LeadIntent } from "@/lib/leads/types";

function sortNewestFirst(leads: LeadIntent[]): LeadIntent[] {
 return [...leads].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

/**
 * Lists lead intents from Firestore (when configured) and localStorage fallback.
 * Firestore entries win when the same id exists in both stores.
 */
export async function listLeadIntents(): Promise<LeadIntent[]> {
 const byId = new Map<string, LeadIntent>();

 if (isFirebaseConfigured) {
 const remote = await listLeadIntentsFromFirestore();
 for (const lead of remote) {
 byId.set(lead.id, lead);
 }
 }

 if (isBrowser()) {
 for (const raw of readStoredLeadIntents()) {
 const normalized = normalizeLeadIntent(raw);
 if (normalized && !byId.has(normalized.id)) {
 byId.set(normalized.id, normalized);
 }
 }
 }

 return sortNewestFirst(Array.from(byId.values()));
}
