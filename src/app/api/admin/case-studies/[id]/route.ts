import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  deleteFirestoreCaseStudy,
  getFirestoreCaseStudyById,
  updateFirestoreCaseStudy,
} from "@/lib/case-studies/firestore-case-studies";
import { buildCaseStudyPublishBundle } from "@/lib/case-studies/case-study-publish";
import { type CaseStudyFormValues } from "@/lib/case-studies/case-study-drafts";
import { requireAdminFromRequest } from "@/lib/firebase/verify-admin-user";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ id: string }>;
};

function isCaseStudyFormValues(value: unknown): value is CaseStudyFormValues {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }
  const record = value as CaseStudyFormValues;
  return typeof record.title === "string" && typeof record.id === "string";
}

export async function GET(request: NextRequest, context: RouteContext) {
  const admin = await requireAdminFromRequest(request);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  try {
    const study = await getFirestoreCaseStudyById(id);
    if (!study) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const { firestoreId, ...payload } = study;
    return NextResponse.json({ id: firestoreId, ...payload });
  } catch (error) {
    console.error("GET /api/admin/case-studies/[id] error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
  const admin = await requireAdminFromRequest(request);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!isCaseStudyFormValues(body)) {
    return NextResponse.json({ error: "Invalid case study payload" }, { status: 400 });
  }

  try {
    const existing = await getFirestoreCaseStudyById(id);
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const publishBundle = await buildCaseStudyPublishBundle(body);
    if (!publishBundle.ok) {
      return NextResponse.json(
        { error: publishBundle.errorCode, message: publishBundle.message },
        { status: publishBundle.errorCode === "MISSING_API_KEY" ? 503 : 500 },
      );
    }

    const { draft, localeContent } = publishBundle.bundle;
    const { source: _source, ...payload } = draft;
    await updateFirestoreCaseStudy(id, { ...payload, localeContent });
    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error("PUT /api/admin/case-studies/[id] error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const admin = await requireAdminFromRequest(request);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  try {
    const existing = await getFirestoreCaseStudyById(id);
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await deleteFirestoreCaseStudy(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/admin/case-studies/[id] error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
