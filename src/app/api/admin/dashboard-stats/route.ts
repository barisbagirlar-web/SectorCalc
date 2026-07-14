import { type NextRequest, NextResponse } from "next/server";
import { getAuth } from "firebase-admin/auth";
import { getFirebaseAdminApp, getAdminFirestore } from "@/lib/infrastructure/firebase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SUPER_ADMIN_EMAIL = "barisbagirlar@gmail.com";

async function verifySuperAdmin(request: NextRequest) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  const token = authHeader.split(" ")[1]?.trim();
  if (!token) return null;

  const app = getFirebaseAdminApp();
  if (!app) return null;

  try {
    const decoded = await getAuth(app).verifyIdToken(token);
    if (decoded.email === SUPER_ADMIN_EMAIL || decoded.admin === true) {
      return decoded;
    }
    return null;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  const adminUser = await verifySuperAdmin(request);
  if (!adminUser) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const app = getFirebaseAdminApp();
  if (!app) {
    return NextResponse.json({ ok: false, error: "firebase_unavailable" }, { status: 500 });
  }

  const db = getAdminFirestore();
  if (!db) {
    return NextResponse.json({ ok: false, error: "firestore_unavailable" }, { status: 500 });
  }

  try {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();

    // ── Aggregate queries in parallel ──
    const [
      usersAll,
      usersRecent,
      adminUsers,
      leadIntentsAll,
      leadIntentsRecent,
      ticketsAll,
      ticketsOpen,
      caseStudiesAll,
      reportsAll,
      verificationQueueAll,
    ] = await Promise.all([
      getAuth(app).listUsers(1000),
      db.collection("users").where("createdAt", ">=", thirtyDaysAgo).limit(500).get(),
      db.collection("users").where("role", "==", "admin").limit(500).get(),
      db.collection("leadIntents").get(),
      db.collection("leadIntents").where("createdAt", ">=", thirtyDaysAgo).limit(500).get(),
      db.collection("supportTickets").get(),
      db.collection("supportTickets").where("status", "in", ["open", "in_progress"]).limit(500).get(),
      db.collection("caseStudies").get(),
      db.collection("reports").limit(500).get(),
      db.collection("verification_queue").limit(500).get(),
    ]);

    // ── Count admin claims from auth users ──
    let adminClaimCount = 0;
    for (const u of usersAll.users) {
      if (u.customClaims?.admin === true) adminClaimCount++;
    }

    // ── Lead intent status breakdown ──
    let leadsNew = 0;
    let leadsContacted = 0;
    let leadsConverted = 0;
    let leadsLost = 0;
    leadIntentsAll.docs.forEach((doc) => {
      const status = doc.data().status;
      if (status === "new") leadsNew++;
      else if (status === "contacted") leadsContacted++;
      else if (status === "converted") leadsConverted++;
      else if (status === "lost") leadsLost++;
    });

    // ── Ticket status breakdown ──
    let ticketsResolved = 0;
    let ticketsClosed = 0;
    ticketsAll.docs.forEach((doc) => {
      const status = doc.data().status;
      if (status === "resolved") ticketsResolved++;
      else if (status === "closed") ticketsClosed++;
    });

    // ── Build KPI signals from leads ──
    const recentLeads = leadIntentsRecent.docs.map((doc) => ({
      id: doc.id,
      email: doc.data().email ?? "",
      toolSlug: doc.data().toolSlug ?? "",
      status: doc.data().status ?? "new",
      createdAt: doc.data().createdAt ?? "",
    }));

    return NextResponse.json({
      ok: true,
      stats: {
        users: {
          total: usersAll.users.length,
          newLast30d: usersRecent.docs.length,
          adminClaim: adminClaimCount,
          adminRole: adminUsers.docs.length,
        },
        leads: {
          total: leadIntentsAll.docs.length,
          newLast30d: leadIntentsRecent.docs.length,
          statusBreakdown: { new: leadsNew, contacted: leadsContacted, converted: leadsConverted, lost: leadsLost },
          recent: recentLeads.slice(0, 10),
        },
        tickets: {
          total: ticketsAll.docs.length,
          open: ticketsOpen.docs.length,
          resolved: ticketsResolved,
          closed: ticketsClosed,
        },
        caseStudies: {
          total: caseStudiesAll.docs.length,
        },
        reports: {
          total: reportsAll.docs.length,
        },
        verificationQueue: {
          total: verificationQueueAll.docs.length,
        },
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
