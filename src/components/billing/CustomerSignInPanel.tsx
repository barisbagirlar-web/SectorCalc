"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useClientSearchParam } from "@/lib/navigation/use-client-search-params";
import {
 mapCustomerSignInError,
 signInCustomerWithGoogle,
} from "@/lib/firebase/customer-auth";

const buttonClass =
 "inline-flex min-h-[48px] w-full items-center justify-center rounded-lg bg-accent-teal px-4 text-sm font-semibold text-white transition-colors hover:bg-black disabled:cursor-not-allowed disabled:opacity-50";

interface CustomerSignInPanelProps {
 nextPath: string;
}

export function CustomerSignInPanel({ nextPath }: CustomerSignInPanelProps) {
 const router = useRouter();
 const [pending, setPending] = useState(false);
 const [error, setError] = useState<string | null>(null);

 const handleGoogleSignIn = async () => {
 setError(null);
 setPending(true);

 try {
 await signInCustomerWithGoogle();
 router.replace(nextPath);
 } catch (caught) {
 setError(mapCustomerSignInError(caught));
 setPending(false);
 }
 };

 return (
 <div className="mt-8 rounded-sm border border-border-subtle bg-bg-subtle p-6">
 <h2 className="text-lg font-bold text-text-primary">SectorCalc Pro sign-in</h2>
 <p className="mt-2 text-sm leading-relaxed text-text-secondary">
 Sign in with Google to access premium analyzers or continue checkout. Admin
 sign-in is separate above.
 </p>
 <button
 type="button"
 onClick={() => void handleGoogleSignIn()}
 disabled={pending}
 className={`${buttonClass} mt-4`}
 >
 {pending ? "Signing in…" : "Continue with Google"}
 </button>
 {error ? <p className="mt-3 text-sm text-amber">{error}</p> : null}
 </div>
 );
}

export function CustomerSignInFromNextParam() {
 const next = useClientSearchParam("next");

 if (!next || !next.startsWith("/")) {
 return null;
 }

 return <CustomerSignInPanel nextPath={next} />;
}

interface PremiumLoginPromptProps {
 paidSlug: string;
}

export function PremiumLoginPrompt({ paidSlug }: PremiumLoginPromptProps) {
 const loginHref = `/login?next=${encodeURIComponent(`/tools/premium/${paidSlug}`)}`;

 return (
 <aside className="mx-auto max-w-2xl rounded-sm border border-border-subtle bg-white p-6 shadow-card sm:p-8">
 <p className="text-xs font-semibold uppercase tracking-wider text-deep-navy">
 Sign in required
 </p>
 <h2 className="mt-3 text-xl font-bold text-text-primary sm:text-2xl">
 Sign in to check SectorCalc Pro access
 </h2>
 <p className="mt-3 text-sm leading-relaxed text-text-secondary">
 Premium analyzers require a signed-in account with an active SectorCalc Pro
 subscription.
 </p>
 <Link
 href={loginHref}
 className="mt-6 inline-flex min-h-[48px] w-full items-center justify-center rounded-lg bg-deep-navy px-5 text-sm font-semibold text-white transition-colors hover:bg-black sm:w-auto"
 >
 Sign in
 </Link>
 </aside>
 );
}
