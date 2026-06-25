/* eslint-disable @typescript-eslint/ban-ts-comment */

// @ts-nocheck
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
    // Grant access if email is bypass or decoded token has admin claim
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
    // List top 300 users
    const listResult = await getAuth(app).listUsers(300);
    const usersData = [];

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
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
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

  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const { action, uid, email, password, displayName, disabled, admin, creditBalance, subscriptionStatus, plan } = body;

  try {
    if (action === "createUser") {
      if (!email || !password) {
        return NextResponse.json({ ok: false, error: "missing_fields" }, { status: 400 });
      }

      // Create in Firebase Auth
      const newUser = await getAuth(app).createUser({
        email,
        password,
        displayName: displayName || undefined,
        emailVerified: true,
      });

      // Set admin claim if specified
      if (admin === true) {
        await getAuth(app).setCustomUserClaims(newUser.uid, { admin: true });
      }

      // Set in Firestore
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

      // Update in Firebase Auth
      const updateData: any = {
        disabled: disabled === true,
      };
      if (email) updateData.email = email;
      if (password) updateData.password = password;
      if (displayName !== undefined) updateData.displayName = displayName;

      await getAuth(app).updateUser(uid, updateData);

      // Update custom claims
      await getAuth(app).setCustomUserClaims(uid, { admin: admin === true });

      // Update in Firestore
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

      // Delete from Auth
      await getAuth(app).deleteUser(uid);

      // Delete from Firestore
      await db.collection("users").doc(uid).delete();

      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ ok: false, error: "unknown_action" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
