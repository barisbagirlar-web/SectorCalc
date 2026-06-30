import { getAdminFirestore } from "@/lib/infrastructure/firebase/admin";
import { applyCaseStudyLocalePack, parseCaseStudyLocalePack, type CaseStudyLocalePack } from "@/lib/features/case-studies/case-study-locale-pack";
import { getPublishedCaseStudyBySlug, listPublishedCaseStudies } from "@/lib/features/case-studies/published-case-study-locale";
import type { CaseStudy, CaseStudyResult, CaseStudyTestimonial } from "@/lib/features/case-studies/types";

const COLLECTION = "caseStudies";

export type FirestoreCaseStudyRecord = CaseStudy & {
  readonly firestoreId: string;
  readonly localeContent?: CaseStudyLocalePack;
};

function isResultRow(value: unknown): value is CaseStudyResult {
  if (!value || typeof value !== "object") {
    return false;
  }
  const row = value as CaseStudyResult;
  return (
    typeof row.metric === "string" &&
    typeof row.before === "string" &&
    typeof row.after === "string"
  );
}

function parseTestimonial(value: unknown): CaseStudyTestimonial | undefined {
  if (!value || typeof value !== "object") {
    return undefined;
  }
  const testimonial = value as CaseStudyTestimonial;
  if (
    typeof testimonial.quote !== "string" ||
    typeof testimonial.author !== "string" ||
    typeof testimonial.title !== "string" ||
    typeof testimonial.company !== "string"
  ) {
    return undefined;
  }
  return testimonial;
}

function docToCaseStudy(id: string, data: Record<string, unknown>): FirestoreCaseStudyRecord | null {
  if (typeof data.slug !== "string" || typeof data.title !== "string") {
    return null;
  }

  const tools = Array.isArray(data.tools)
    ? data.tools.filter((tool): tool is string => typeof tool === "string")
    : [];

  const results = Array.isArray(data.results)
    ? data.results.filter(isResultRow)
    : [];

  return {
    firestoreId: id,
    id: typeof data.id === "string" ? data.id : id,
    slug: data.slug,
    title: data.title,
    subtitle: typeof data.subtitle === "string" ? data.subtitle : "",
    industry: typeof data.industry === "string" ? data.industry : "",
    country: typeof data.country === "string" ? data.country : undefined,
    city: typeof data.city === "string" ? data.city : undefined,
    projectDuration: typeof data.projectDuration === "string" ? data.projectDuration : undefined,
    savingsEur: typeof data.savingsEur === "number" ? data.savingsEur : undefined,
    tools,
    challenge: typeof data.challenge === "string" ? data.challenge : "",
    solution: typeof data.solution === "string" ? data.solution : "",
    results,
    testimonial: parseTestimonial(data.testimonial),
    localeContent: parseCaseStudyLocalePack(data.localeContent),
    coverImage: typeof data.coverImage === "string" ? data.coverImage : undefined,
    images: Array.isArray(data.images)
      ? data.images.filter((image): image is string => typeof image === "string")
      : undefined,
    publishedAt: typeof data.publishedAt === "string" ? data.publishedAt : new Date().toISOString(),
    updatedAt: typeof data.updatedAt === "string" ? data.updatedAt : undefined,
    readTime: typeof data.readTime === "number" ? data.readTime : 4,
    author:
      data.author &&
      typeof data.author === "object" &&
      typeof (data.author as { name?: unknown }).name === "string" &&
      typeof (data.author as { linkedin?: unknown }).linkedin === "string"
        ? {
            name: (data.author as { name: string }).name,
            linkedin: (data.author as { linkedin: string }).linkedin,
          }
        : undefined,
    technicalReview:
      data.technicalReview &&
      typeof data.technicalReview === "object" &&
      typeof (data.technicalReview as { reviewer?: unknown }).reviewer === "string" &&
      typeof (data.technicalReview as { mathSciNetId?: unknown }).mathSciNetId === "string"
        ? {
            reviewer: (data.technicalReview as { reviewer: string }).reviewer,
            mathSciNetId: (data.technicalReview as { mathSciNetId: string }).mathSciNetId,
          }
        : undefined,
    seo:
      data.seo && typeof data.seo === "object"
        ? {
            metaTitle:
              typeof (data.seo as { metaTitle?: unknown }).metaTitle === "string"
                ? (data.seo as { metaTitle: string }).metaTitle
                : undefined,
            metaDescription:
              typeof (data.seo as { metaDescription?: unknown }).metaDescription === "string"
                ? (data.seo as { metaDescription: string }).metaDescription
                : undefined,
          }
        : undefined,
  };
}

export async function listFirestoreCaseStudies(): Promise<FirestoreCaseStudyRecord[]> {
  const db = getAdminFirestore();
  if (!db) {
    return [];
  }

  try {
    const snapshot = await db.collection(COLLECTION).orderBy("publishedAt", "desc").get();
    return snapshot.docs
      .map((doc) => docToCaseStudy(doc.id, doc.data() as Record<string, unknown>))
      .filter((entry): entry is FirestoreCaseStudyRecord => entry !== null);
  } catch (error) {
    console.error("listFirestoreCaseStudies error:", error);
    return [];
  }
}

export async function getFirestoreCaseStudyById(id: string): Promise<FirestoreCaseStudyRecord | null> {
  const db = getAdminFirestore();
  if (!db) {
    return null;
  }

  try {
    const doc = await db.collection(COLLECTION).doc(id).get();
    if (!doc.exists) {
      return null;
    }
    return docToCaseStudy(doc.id, doc.data() as Record<string, unknown>);
  } catch (error) {
    console.error("getFirestoreCaseStudyById error:", error);
    return null;
  }
}

export async function getFirestoreCaseStudyBySlug(slug: string): Promise<FirestoreCaseStudyRecord | null> {
  const db = getAdminFirestore();
  if (!db) {
    return null;
  }

  try {
    const snapshot = await db.collection(COLLECTION).where("slug", "==", slug).limit(1).get();
    const doc = snapshot.docs[0];
    if (!doc) {
      return null;
    }
    return docToCaseStudy(doc.id, doc.data() as Record<string, unknown>);
  } catch (error) {
    console.error("getFirestoreCaseStudyBySlug error:", error);
    return null;
  }
}

export async function createFirestoreCaseStudy(
  payload: Omit<CaseStudy, "slug"> & { slug: string; localeContent?: CaseStudyLocalePack },
): Promise<FirestoreCaseStudyRecord | null> {
  const db = getAdminFirestore();
  if (!db) {
    return null;
  }

  const now = new Date().toISOString();
  const docRef = await db.collection(COLLECTION).add({
    ...payload,
    createdAt: now,
    updatedAt: now,
  });

  const created = await docRef.get();
  return docToCaseStudy(created.id, (created.data() ?? {}) as Record<string, unknown>);
}

export async function updateFirestoreCaseStudy(
  id: string,
  payload: Partial<CaseStudy> & { localeContent?: CaseStudyLocalePack },
): Promise<boolean> {
  const db = getAdminFirestore();
  if (!db) {
    return false;
  }

  await db
    .collection(COLLECTION)
    .doc(id)
    .update({
      ...payload,
      updatedAt: new Date().toISOString(),
    });
  return true;
}

export async function deleteFirestoreCaseStudy(id: string): Promise<boolean> {
  const db = getAdminFirestore();
  if (!db) {
    return false;
  }

  await db.collection(COLLECTION).doc(id).delete();
  return true;
}

export async function listMergedPublishedCaseStudies(locale: string): Promise<CaseStudy[]> {
  const staticStudies = listPublishedCaseStudies(locale);
  const firestoreStudies = await listFirestoreCaseStudies();
  const staticSlugs = new Set(staticStudies.map((study) => study.slug));

  const merged = [
    ...staticStudies,
    ...firestoreStudies
      .filter((study) => !staticSlugs.has(study.slug))
      .map((study) => applyCaseStudyLocalePack(study, locale, study.localeContent)),
  ];

  return merged.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export async function resolvePublishedCaseStudyBySlug(
  slug: string,
  locale: string,
): Promise<CaseStudy | undefined> {
  const staticStudy = getPublishedCaseStudyBySlug(slug, locale);
  if (staticStudy) {
    return staticStudy;
  }

  const firestoreStudy = await getFirestoreCaseStudyBySlug(slug);
  if (!firestoreStudy) {
    return undefined;
  }

  return applyCaseStudyLocalePack(firestoreStudy, locale, firestoreStudy.localeContent);
}

export { isLikelyFirestoreDocumentId } from "@/lib/features/case-studies/case-study-id-utils";
