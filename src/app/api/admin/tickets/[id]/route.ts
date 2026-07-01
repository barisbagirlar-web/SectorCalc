import { NextRequest, NextResponse } from "next/server";
import { getAdminFirestore } from "@/lib/infrastructure/firebase/admin";
import { requireAdminFromRequest } from "@/lib/infrastructure/firebase/verify-admin-user";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const VALID_STATUSES = ["open", "in_progress", "resolved", "closed"] as const;

function isStatusValid(value: string): value is (typeof VALID_STATUSES)[number] {
  return VALID_STATUSES.includes(value as (typeof VALID_STATUSES)[number]);
}

type Params = Promise<{ id: string }>;

export async function GET(request: NextRequest, { params }: { params: Params }) {
  const admin = await requireAdminFromRequest(request);
  if (!admin) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const { id } = await params;
  const db = getAdminFirestore();
  if (!db) {
    return NextResponse.json({ error: "SERVICE_UNAVAILABLE" }, { status: 503 });
  }

  try {
    const ticketDoc = await db.collection("supportTickets").doc(id).get();
    if (!ticketDoc.exists) {
      return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
    }

    const repliesSnap = await db
      .collection("supportTickets")
      .doc(id)
      .collection("replies")
      .orderBy("createdAt", "asc")
      .get();

    const ticket = { id: ticketDoc.id, ...ticketDoc.data() };
    const replies = repliesSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    return NextResponse.json({ ticket, replies });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to fetch ticket";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: { params: Params }) {
  const admin = await requireAdminFromRequest(request);
  if (!admin) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const { id } = await params;
  const db = getAdminFirestore();
  if (!db) {
    return NextResponse.json({ error: "SERVICE_UNAVAILABLE" }, { status: 503 });
  }

  let body: { content?: string; status?: string };
  try {
    body = (await request.json()) as { content?: string; status?: string };
  } catch {
    return NextResponse.json({ error: "INVALID_JSON" }, { status: 400 });
  }

  const content = body.content?.trim();
  if (!content || content.length < 1) {
    return NextResponse.json({ error: "VALIDATION_ERROR", details: "Reply content is required." }, { status: 400 });
  }

  const newStatus = body.status?.toLowerCase();
  if (newStatus && !isStatusValid(newStatus)) {
    return NextResponse.json(
      { error: "VALIDATION_ERROR", details: `Status must be one of: ${VALID_STATUSES.join(", ")}.` },
      { status: 400 }
    );
  }

  // Single transaction: add reply + update ticket status atomically
  try {
    await db.runTransaction(async (transaction) => {
      const ticketRef = db.collection("supportTickets").doc(id);
      const ticketSnap = await transaction.get(ticketRef);

      if (!ticketSnap.exists) {
        throw new Error("NOT_FOUND");
      }

      const now = new Date().toISOString();
      const updateData: Record<string, unknown> = { updatedAt: now };

      if (newStatus) {
        updateData.status = newStatus;
      }

      transaction.update(ticketRef, updateData);

      const replyRef = db.collection("supportTickets").doc(id).collection("replies").doc();
      transaction.set(replyRef, {
        authorId: admin.uid,
        authorEmail: admin.email,
        isAdmin: true,
        content,
        createdAt: now,
      });
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof Error && err.message === "NOT_FOUND") {
      return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
    }
    const message = err instanceof Error ? err.message : "Failed to save reply";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
