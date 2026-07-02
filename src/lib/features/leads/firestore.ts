import {
 collection,
 doc,
 getDocs,
 orderBy,
 query,
 setDoc,
} from "firebase/firestore";
import {
 getFirebaseProjectId,
 getFirestoreDb,
 isFirebaseConfigured,
} from "@/lib/infrastructure/firebase/client";
import { normalizeLeadIntent } from "@/lib/features/leads/normalize";
import type { LeadIntent, LeadPlan } from "@/lib/features/leads/types";

const COLLECTION_NAME = "leadIntents";

const VALID_LEAD_PLANS: LeadPlan[] = [
 "single_report",
 "sector_pass",
 "pro",
 "free",
 "unknown",
];

export interface FirestoreLeadResult {
 ok: boolean;
 error?: string;
}

/** Firestore create payload - only allowed lead fields, no diagnostics */
function leadToFirestoreDocument(lead: LeadIntent): LeadIntent {
 const document: LeadIntent = {
 id: lead.id,
 name: lead.name,
 email: lead.email,
 company: lead.company,
 industry: lead.industry,
 toolRequested: lead.toolRequested,
 intendedUse: lead.intendedUse,
 source: lead.source,
 pagePath: lead.pagePath,
 createdAt: lead.createdAt,
 status: "new",
 storageMode: "firestore",
 };

 if (lead.message) {
 document.message = lead.message;
 }

 if (lead.plan && VALID_LEAD_PLANS.includes(lead.plan)) {
 document.plan = lead.plan;
 }

 return document;
}

export async function saveLeadIntentToFirestore(
 lead: LeadIntent
): Promise<FirestoreLeadResult> {
 console.info("[SectorCalc] Firebase configured:", isFirebaseConfigured);
 console.info("[SectorCalc] Firebase project:", getFirebaseProjectId());

 if (!isFirebaseConfigured) {
 return { ok: false, error: "Firebase is not configured." };
 }

 const db = getFirestoreDb();
 if (!db) {
 return { ok: false, error: "Firestore is unavailable in this environment." };
 }

 const payload = leadToFirestoreDocument(lead);

 console.info(
 "[SectorCalc] Writing lead to Firestore:",
 lead.id,
 payload.storageMode
 );

 try {
 await setDoc(doc(db, COLLECTION_NAME, lead.id), payload);
 console.info("[SectorCalc] Firestore write success:", lead.id);
 return { ok: true };
 } catch (err) {
 const message =
 err instanceof Error ? err.message : "Failed to save lead intent.";
 console.error("[SectorCalc] Firestore write failed:", err);
 return { ok: false, error: message };
 }
}

export async function listLeadIntentsFromFirestore(): Promise<LeadIntent[]> {
 if (!isFirebaseConfigured) {
 return [];
 }

 const db = getFirestoreDb();
 if (!db) {
 return [];
 }

 try {
 const leadsQuery = query(
 collection(db, COLLECTION_NAME),
 orderBy("createdAt", "desc")
 );
 const snapshot = await getDocs(leadsQuery);
 const leads: LeadIntent[] = [];

 for (const document of snapshot.docs) {
 const normalized = normalizeLeadIntent(document.data());
 if (normalized) {
 leads.push(normalized);
 }
 }

 return leads;
 } catch {
 return [];
 }
}
