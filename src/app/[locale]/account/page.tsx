export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { createPageMetadata } from "@/lib/infrastructure/metadata";
import type { AppLocale } from "@/i18n/routing";
import { cookies } from "next/headers";
import { redirect } from "@/i18n/routing";
import { getAuth } from "firebase-admin/auth";
import { getFirebaseAdminApp } from "@/lib/infrastructure/firebase/admin";

import { CreditSummary } from './_components/CreditSummary';
import { SubscriptionCard } from './_components/SubscriptionCard';
import { SupportTicketModal } from './_components/SupportTicketModal';
import { LogoutButton } from './_components/LogoutButton';
import { OpenSupportButton } from './_components/OpenSupportButton';

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "accountPage" });
  return {
    ...createPageMetadata({
      title: t("meta.title"),
      description: t("meta.description"),
      path: "/account",
      locale: locale as AppLocale,
    }),
    robots: { index: false, follow: false },
  };
}

async function getServerSession() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("__session")?.value;
  if (!sessionCookie) return null;
  try {
    const app = getFirebaseAdminApp();
    if (!app) return null;
    const decodedClaims = await getAuth(app).verifySessionCookie(sessionCookie, true);
    return {
      user: {
        id: decodedClaims.uid,
        email: decodedClaims.email || "",
      }
    };
  } catch (error) {
    return null;
  }
}

export default async function AccountPage({ params }: PageProps) {
  const session = await getServerSession();
  if (!session) redirect({ href: "/login", locale: "en" });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* HEADER */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Account Dashboard</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage your subscription, credits, and support tickets in one place.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <OpenSupportButton />
            <LogoutButton />
          </div>
        </header>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT COLUMN: FINANCIALS & ACTIVITY */}
          <div className="lg:col-span-2 space-y-8">
            <CreditSummary userId={session.user.id} />
            
            {/* Placeholder for Recent Activity / Saved Reports */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
              <div className="text-sm text-gray-500 italic">No recent calculations found.</div>
            </section>
          </div>

          {/* RIGHT COLUMN: SUBSCRIPTION & PROFILE */}
          <aside className="space-y-8">
            <SubscriptionCard userId={session.user.id} />
            
            <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile Details</h2>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-gray-500">Email</dt>
                  <dd className="font-medium text-gray-900">{session.user.email}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Account Type</dt>
                  <dd className="font-medium text-gray-900">Standard User</dd>
                </div>
              </dl>
            </section>
          </aside>
        </div>
      </div>

      {/* SUPPORT MODAL (Hidden by default) */}
      <SupportTicketModal userId={session.user.id} email={session.user.email} />
    </div>
  );
}
