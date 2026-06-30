import { getAdminFirestore } from "@/lib/infrastructure/firebase/admin";
import {
 parseSavedVerdictReport,
 type SavedVerdictReport,
} from "@/lib/features/reports/report-storage";

export async function getVerdictReportByIdAdmin(
 reportId: string
): Promise<SavedVerdictReport | null> {
 if (!reportId.trim()) {
 return null;
 }

 const db = getAdminFirestore();
 if (!db) {
 return null;
 }

 try {
 const snapshot = await db.collection("reports").doc(reportId).get();
 if (!snapshot.exists) {
 return null;
 }

 return parseSavedVerdictReport(snapshot.id, snapshot.data());
 } catch {
 return null;
 }
}
