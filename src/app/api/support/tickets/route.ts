import { NextResponse } from "next/server";
import { getAdminFirestore } from "@/lib/infrastructure/firebase/admin";
import { parseBearerToken, verifySignedInUser } from "@/lib/infrastructure/firebase/verify-signed-in-user";
import {
  sendTicketConfirmationEmail,
  sendAdminTicketAlertEmail,
  resolveAdminSupportEmail,
} from "@/lib/infrastructure/email/send-ticket-email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TICKET_RATE_LIMIT = 3;
const RATE_WINDOW_MS = 3600_000;

const HONEYPOT_FIELD = "_hp_confirm_email";

const PRIORITY_VALUES = ["low", "normal", "high", "critical"] as const;

type TicketPayload = {
  subject: string;
  message: string;
  priority: string;
  [HONEYPOT_FIELD]?: string;
};

function isPriorityValid(value: string): value is (typeof PRIORITY_VALUES)[number] {
  return PRIORITY_VALUES.includes(value as (typeof PRIORITY_VALUES)[number]);
}

export async function POST(request: Request) {
  const token = parseBearerToken(request);
  if (!token) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const user = await verifySignedInUser(token);
  if (!user || !user.email) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  let body: TicketPayload;
  try {
    body = (await request.json()) as TicketPayload;
  } catch {
    return NextResponse.json({ error: "INVALID_JSON" }, { status: 400 });
  }

  // Honeypot check
  if (body[HONEYPOT_FIELD] && body[HONEYPOT_FIELD]!.trim().length > 0) {
    return NextResponse.json({ ok: true });
  }

  const subject = body.subject?.trim();
  const message = body.message?.trim();
  const priority = body.priority?.trim().toLowerCase();

  if (!subject || subject.length < 5 || subject.length > 200) {
    return NextResponse.json(
      { error: "VALIDATION_ERROR", details: "Subject must be between 5 and 200 characters." },
      { status: 400 }
    );
  }

  if (!message || message.length < 20 || message.length > 5000) {
    return NextResponse.json(
      { error: "VALIDATION_ERROR", details: "Message must be between 20 and 5000 characters." },
      { status: 400 }
    );
  }

  if (!priority || !isPriorityValid(priority)) {
    return NextResponse.json(
      { error: "VALIDATION_ERROR", details: "Priority must be one of: low, normal, high, critical." },
      { status: 400 }
    );
  }

  const db = getAdminFirestore();
  if (!db) {
    return NextResponse.json({ error: "SERVICE_UNAVAILABLE" }, { status: 503 });
  }

  // Rate-limit check
  const windowStart = new Date(Date.now() - RATE_WINDOW_MS).toISOString();
  const recentTicketsSnap = await db
    .collection("supportTickets")
    .where("userId", "==", user.uid)
    .where("createdAt", ">=", windowStart)
    .get();

  if (recentTicketsSnap.size >= TICKET_RATE_LIMIT) {
    return NextResponse.json(
      { error: "RATE_LIMITED", details: `Maximum ${TICKET_RATE_LIMIT} tickets per hour. Please wait before submitting again.` },
      { status: 429 }
    );
  }

  // Store ticket
  const now = new Date().toISOString();
  const ticketRef = db.collection("supportTickets").doc();
  const ticket = {
    id: ticketRef.id,
    userId: user.uid,
    email: user.email,
    subject,
    message,
    priority,
    status: "open",
    createdAt: now,
    updatedAt: now,
  };

  await ticketRef.set(ticket);

  // Send emails — non-blocking, failures logged but never block ticket creation
  const emailPromises: Promise<unknown>[] = [];

  emailPromises.push(
    sendTicketConfirmationEmail(user.email, {
      ticketId: ticketRef.id,
      subject,
      priority,
    }).catch((err: unknown) => {
      console.error(`[ticket-email] confirmation failed for ${ticketRef.id}:`, err);
    }),
  );

  const adminEmail = resolveAdminSupportEmail();
  if (adminEmail) {
    emailPromises.push(
      sendAdminTicketAlertEmail(adminEmail, {
        ticketId: ticketRef.id,
        userEmail: user.email,
        subject,
        priority,
        message,
      }).catch((err: unknown) => {
        console.error(`[ticket-email] admin alert failed for ${ticketRef.id}:`, err);
      }),
    );
  }

  void Promise.all(emailPromises);

  return NextResponse.json({ ticketId: ticketRef.id }, { status: 201 });
}
