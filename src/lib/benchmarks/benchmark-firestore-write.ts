import { doc, setDoc } from "firebase/firestore";
import {
  BETA_PARTNER_COLLECTION,
  BENCHMARK_SUBMISSIONS_COLLECTION,
  REPORT_FEEDBACK_COLLECTION,
  type BetaPartner,
  type BenchmarkSubmission,
  type ReportFeedback,
} from "@/lib/benchmarks/benchmark-types";
import { getFirestoreDb, isFirebaseConfigured } from "@/lib/firebase/client";

export async function writeBetaPartnerToFirestore(
  partner: BetaPartner
): Promise<boolean> {
  if (!isFirebaseConfigured) {
    return false;
  }
  const db = getFirestoreDb();
  if (!db) {
    return false;
  }
  await setDoc(doc(db, BETA_PARTNER_COLLECTION, partner.id), partner);
  return true;
}

export async function writeBenchmarkSubmissionToFirestore(
  submission: BenchmarkSubmission
): Promise<boolean> {
  if (!isFirebaseConfigured) {
    return false;
  }
  const db = getFirestoreDb();
  if (!db) {
    return false;
  }
  await setDoc(doc(db, BENCHMARK_SUBMISSIONS_COLLECTION, submission.id), submission);
  return true;
}

export async function writeReportFeedbackToFirestore(
  feedback: ReportFeedback
): Promise<boolean> {
  if (!isFirebaseConfigured) {
    return false;
  }
  const db = getFirestoreDb();
  if (!db) {
    return false;
  }
  await setDoc(doc(db, REPORT_FEEDBACK_COLLECTION, feedback.id), feedback);
  return true;
}
