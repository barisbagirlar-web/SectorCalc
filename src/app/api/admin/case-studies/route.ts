import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  createFirestoreCaseStudy,
  listFirestoreCaseStudies,
} from "@/lib/case-studies/firestore-case-studies";
import { buildCaseStudyPublishBundle } from "@/lib/case-studies/case-study-publish";
import { type CaseStudyFormValues } from "@/lib/case-studies/case-study-drafts";
import { requireAdminFromRequest } from "@/lib/firebase/verify-admin-user";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function isCaseStudyFormValues(value: unknown): value is CaseStudyFormValues {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }
  const record = value as CaseStudyFormValues;
  return typeof record.title === "string" && typeof record.id === "string";
}

export async function GET(request: NextRequest) {
  const admin = await requireAdminFromRequest(request);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const studies = await listFirestoreCaseStudies();
    return NextResponse.json(
      studies.map(({ firestoreId, ...study }) => ({
        id: firestoreId,
        source: "firestore" as const,
        ...study,
      })),
    );
  } catch (error) {
    console.error("GET /api/admin/case-studies error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const admin = await requireAdminFromRequest(request);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!isCaseStudyFormValues(body)) {
    return NextResponse.json({ error: "Invalid case study payload" }, { status: 400 });
  }

  if (!body.title.trim()) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  try {
    const publishBundle = await buildCaseStudyPublishBundle(body);
    if (!publishBundle.ok) {
      return NextResponse.json(
        { error: publishBundle.errorCode, message: publishBundle.message },
        { status: publishBundle.errorCode === "MISSING_API_KEY" ? 503 : 500 },
      );
    }

    const { draft, localeContent } = publishBundle.bundle;
    const { source: _source, ...payload } = draft;
    const created = await createFirestoreCaseStudy({
      ...payload,
      localeContent,
    });

    if (!created) {
      return NextResponse.json({ error: "Firestore unavailable" }, { status: 503 });
    }

    const { firestoreId, ...study } = created;
    return NextResponse.json({ id: firestoreId, ...study }, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/case-studies error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
