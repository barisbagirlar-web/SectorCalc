import { type NextRequest, NextResponse } from "next/server";
import { getAuth } from "firebase-admin/auth";
import { getFirebaseAdminApp, getAdminFirestore } from "@/lib/firebase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function verifyAdmin(request: NextRequest) {
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
    if (decoded.email === "barisbagirlar@gmail.com" || decoded.admin === true) {
      return decoded;
    }
    return null;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  const adminUser = await verifyAdmin(request);
  if (!adminUser) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const app = getFirebaseAdminApp();
  if (!app) {
    return NextResponse.json({ ok: false, error: "firebase_unavailable" }, { status: 500 });
  }

  const db = getAdminFirestore();

  try {
    const listResult = await getAuth(app).listUsers(300);
    const usersData: Array<Record<string, unknown>> = [];

    for (const authUser of listResult.users) {
      let creditBalance = 0;
      let subscriptionStatus = "none";
      let plan = "";

      if (db) {
        const userDoc = await db.collection("users").doc(authUser.uid).get();
        if (userDoc.exists) {
          const data = userDoc.data();
          creditBalance = Number(data?.creditBalance ?? 0);
          subscriptionStatus = data?.subscription?.status ?? "none";
          plan = data?.subscription?.plan ?? "";
        }
      }

      usersData.push({
        uid: authUser.uid,
        email: authUser.email ?? "",
        displayName: authUser.displayName ?? "",
        disabled: authUser.disabled,
        admin: authUser.customClaims?.admin === true,
        creditBalance,
        subscriptionStatus,
        plan,
        creationTime: authUser.metadata.creationTime,
        lastSignInTime: authUser.metadata.lastSignInTime,
      });
    }

    return NextResponse.json({ ok: true, users: usersData });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const adminUser = await verifyAdmin(request);
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

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const { action, uid, email, password, displayName, disabled, admin, creditBalance, subscriptionStatus, plan } = body as {
    action?: string;
    uid?: string;
    email?: string;
    password?: string;
    displayName?: string;
    disabled?: boolean;
    admin?: boolean;
    creditBalance?: number;
    subscriptionStatus?: string;
    plan?: string;
  };

  try {
    if (action === "createUser") {
      if (!email || !password) {
        return NextResponse.json({ ok: false, error: "missing_fields" }, { status: 400 });
      }

      const newUser = await getAuth(app).createUser({
        email,
        password,
        displayName: displayName || undefined,
        emailVerified: true,
      });

      if (admin === true) {
        await getAuth(app).setCustomUserClaims(newUser.uid, { admin: true });
      }

      await db.collection("users").doc(newUser.uid).set({
        email: email,
        displayName: displayName || "",
        creditBalance: Number(creditBalance ?? 0),
        subscription: {
          status: subscriptionStatus || "none",
          plan: plan || null,
          updatedAt: new Date().toISOString(),
        },
      });

      return NextResponse.json({ ok: true, uid: newUser.uid });
    }

    if (action === "updateUser") {
      if (!uid) {
        return NextResponse.json({ ok: false, error: "missing_uid" }, { status: 400 });
      }

      const updateData: Record<string, unknown> = {
        disabled: disabled === true,
      };
      if (email) updateData.email = email;
      if (password) updateData.password = password;
      if (displayName !== undefined) updateData.displayName = displayName;

      await getAuth(app).updateUser(uid, updateData);

      await getAuth(app).setCustomUserClaims(uid, { admin: admin === true });

      await db.collection("users").doc(uid).set({
        creditBalance: Number(creditBalance ?? 0),
        subscription: {
          status: subscriptionStatus || "none",
          plan: plan || null,
          updatedAt: new Date().toISOString(),
        },
      }, { merge: true });

      return NextResponse.json({ ok: true });
    }

    if (action === "deleteUser") {
      if (!uid) {
        return NextResponse.json({ ok: false, error: "missing_uid" }, { status: 400 });
      }

      await getAuth(app).deleteUser(uid);
      await db.collection("users").doc(uid).delete();

      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ ok: false, error: "unknown_action" }, { status: 400 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
