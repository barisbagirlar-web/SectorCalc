import { NextRequest, NextResponse } from "next/server";
import { getAdminFirestore } from "@/lib/infrastructure/firebase/admin";
import { requireAdminFromRequest } from "@/lib/infrastructure/firebase/verify-admin-user";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const VALID_STATUSES = ["open", "in_progress", "resolved", "closed"] as const;
const VALID_PRIORITIES = ["low", "normal", "high", "critical"] as const;

function isStatusValid(value: string): value is (typeof VALID_STATUSES)[number] {
  return VALID_STATUSES.includes(value as (typeof VALID_STATUSES)[number]);
}

function isPriorityValid(value: string): value is (typeof VALID_PRIORITIES)[number] {
  return VALID_PRIORITIES.includes(value as (typeof VALID_PRIORITIES)[number]);
}

export async function GET(request: NextRequest) {
  const admin = await requireAdminFromRequest(request);
  if (!admin) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const db = getAdminFirestore();
  if (!db) {
    return NextResponse.json({ error: "SERVICE_UNAVAILABLE" }, { status: 503 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status")?.toLowerCase();
  const priority = searchParams.get("priority")?.toLowerCase();
  const search = searchParams.get("search")?.trim();
  const limit = Math.min(Math.max(Number(searchParams.get("limit")) || 50, 1), 200);

  try {
    let query: FirebaseFirestore.Query = db.collection("supportTickets").orderBy("createdAt", "desc");

    if (status && isStatusValid(status)) {
      query = query.where("status", "==", status);
    }
    if (priority && isPriorityValid(priority)) {
      query = query.where("priority", "==", priority);
    }

    query = query.limit(limit);

    const snapshot = await query.get();
    let tickets = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    // Client-side filtering for search (Firestore doesn't support regex natively)
    if (search) {
      const term = search.toLowerCase();
      tickets = tickets.filter(
        (t: Record<string, unknown>) =>
          (typeof t.subject === "string" && t.subject.toLowerCase().includes(term)) ||
          (typeof t.email === "string" && t.email.toLowerCase().includes(term)) ||
          (typeof t.message === "string" && t.message.toLowerCase().includes(term)),
      );
    }

    return NextResponse.json({ tickets, total: tickets.length });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to fetch tickets";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
