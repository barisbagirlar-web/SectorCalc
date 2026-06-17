/** Client-safe Firestore document id heuristic (no firebase-admin import). */
export function isLikelyFirestoreDocumentId(id: string): boolean {
  return /^[A-Za-z0-9]{20}$/.test(id);
}
