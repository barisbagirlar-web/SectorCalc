"use client";

import Link from "@/lib/navigation/next-link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
 mapFirebaseSignInError,
 mapGoogleSignInError,
 signInAdminWithEmailPassword,
 signInAdminWithGoogle,
 signOutAdmin,
 verifyUserAdminClaim,
 type User,
} from "@/lib/firebase/auth";
import { useAdminAuth } from "@/lib/admin/use-admin-auth";

const fieldClass =
 "w-full min-h-[44px] rounded-lg border border-slate/25 bg-white px-3 text-sm text-deep-navy focus:border-professional-blue focus:outline-none focus:ring-2 focus:ring-professional-blue/20";

const NOT_ADMIN_EMAIL_MESSAGE = "This user does not have admin privileges.";
const NOT_ADMIN_GOOGLE_MESSAGE =
 "This Google account does not have admin privileges.";

const buttonPrimaryClass =
 "inline-flex min-h-[44px] w-full items-center justify-center rounded-lg bg-professional-blue px-4 text-sm font-semibold text-white transition-colors hover:bg-black disabled:cursor-not-allowed disabled:opacity-50";

const buttonGoogleClass =
 "inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg border border-slate/25 bg-white px-4 text-sm font-semibold text-deep-navy transition-colors hover:border-professional-blue/40 hover:bg-off-white disabled:cursor-not-allowed disabled:opacity-50";

export function AdminLoginForm() {
 const router = useRouter();
 const { loading: authLoading, user, isAdmin } = useAdminAuth();
 const [email, setEmail] = useState("");
 const [password, setPassword] = useState("");
 const [submitting, setSubmitting] = useState(false);
 const [error, setError] = useState<string | null>(null);

 useEffect(() => {
 if (authLoading || submitting) {
 return;
 }

 if (user && isAdmin) {
 router.replace("/admin/leads");
 }
 }, [authLoading, isAdmin, router, submitting, user]);

 const finalizeAdminSignIn = useCallback(
 async (signedInUser: User, notAdminMessage: string): Promise<boolean> => {
 const hasAdminClaim = await verifyUserAdminClaim(signedInUser);

 if (!hasAdminClaim) {
 await signOutAdmin();
 setError(notAdminMessage);
 setSubmitting(false);
 return false;
 }

 router.replace("/admin/leads");
 return true;
 },
 [router]
 );

 const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
 event.preventDefault();
 setError(null);
 setSubmitting(true);

 try {
 const signedInUser = await signInAdminWithEmailPassword(email, password);
 await finalizeAdminSignIn(signedInUser, NOT_ADMIN_EMAIL_MESSAGE);
 } catch (err) {
 setError(mapFirebaseSignInError(err));
 setSubmitting(false);
 }
 };

 const handleGoogleSignIn = async () => {
 setError(null);
 setSubmitting(true);

 try {
 const signedInUser = await signInAdminWithGoogle();
 await finalizeAdminSignIn(signedInUser, NOT_ADMIN_GOOGLE_MESSAGE);
 } catch (err) {
 const googleError = mapGoogleSignInError(err);
 if (googleError) {
 setError(googleError);
 }
 setSubmitting(false);
 }
 };

 if (authLoading) {
 return (
 <p className="text-center text-sm text-text-secondary" role="status">
 Checking session…
 </p>
 );
 }

 if (user && isAdmin) {
 return (
 <p className="text-center text-sm text-text-secondary" role="status">
 Redirecting…
 </p>
 );
 }

 return (
 <div className="mx-auto w-full max-w-md space-y-5 rounded-sm border border-slate/20 bg-white p-6 shadow-card sm:p-8">
 <div className="space-y-1 text-center">
 <h2 className="text-lg font-bold text-deep-navy">Admin Login</h2>
 <p className="text-sm text-text-secondary">
 Only accounts with admin claim can access the panel.
 </p>
 </div>

 {error ? (
 <p className="text-sm font-medium text-amber" role="alert">
 {error}
 </p>
 ) : null}

 <button
 type="button"
 onClick={() => void handleGoogleSignIn()}
 disabled={submitting}
 className={buttonGoogleClass}
 >
 <GoogleIcon />
 {submitting ? "Signing in…" : "Sign in with Google"}
 </button>

 <div className="relative py-1">
 <div className="absolute inset-0 flex items-center" aria-hidden="true">
 <div className="w-full border-t border-slate/20" />
 </div>
 <p className="relative mx-auto w-fit bg-white px-3 text-xs font-medium uppercase tracking-wide text-text-secondary">
 or sign in with email
 </p>
 </div>

 <form onSubmit={(event) => void handleSubmit(event)} className="space-y-5" noValidate>
 <label className="block space-y-1.5">
 <span className="text-xs font-medium uppercase tracking-wide text-text-secondary">
 Email
 </span>
 <input
 type="email"
 name="email"
 autoComplete="email"
 required
 value={email}
 onChange={(event) => setEmail(event.target.value)}
 className={fieldClass}
 disabled={submitting}
 />
 </label>

 <label className="block space-y-1.5">
 <span className="text-xs font-medium uppercase tracking-wide text-text-secondary">
 Password
 </span>
 <input
 type="password"
 name="password"
 autoComplete="current-password"
 required
 value={password}
 onChange={(event) => setPassword(event.target.value)}
 className={fieldClass}
 disabled={submitting}
 />
 </label>

 <button type="submit" disabled={submitting} className={buttonPrimaryClass}>
 {submitting ? "Signing in…" : "Sign in"}
 </button>
 </form>

 <p className="text-center text-xs text-text-secondary">
 Registration and password reset are not available on this screen. After the first Google sign-in, admin claims are only granted by an administrator via UID.
 </p>
 </div>
 );
}

function GoogleIcon() {
 return (
 <svg
 className="h-5 w-5 shrink-0"
 viewBox="0 0 24 24"
 aria-hidden="true"
 focusable="false"
 >
 <path
 fill="#4285F4"
 d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
 />
 <path
 fill="#34A853"
 d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
 />
 <path
 fill="#FBBC05"
 d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
 />
 <path
 fill="#EA4335"
 d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
 />
 </svg>
 );
}

export function AdminAuthBar() {
 const { loading, user, isAdmin, signOut } = useAdminAuth();
 const [signingOut, setSigningOut] = useState(false);

 const handleSignOut = async () => {
 setSigningOut(true);
 try {
 await signOut();
 } finally {
 setSigningOut(false);
 }
 };

 if (loading) {
 return (
 <div
 className="rounded-sm border border-slate/20 bg-white px-5 py-4 text-sm text-text-secondary shadow-card"
 role="status"
 >
 Checking session…
 </div>
 );
 }

 if (!user) {
 return (
 <div
 className="flex flex-col gap-3 rounded-sm border border-amber/35 bg-amber/10 px-5 py-4 text-sm text-deep-navy sm:flex-row sm:items-center sm:justify-between"
 role="alert"
 >
 <p>
 <span className="font-semibold">Admin login required.</span> Sign in to view and save lead data.
 </p>
 <Link
 href="/login"
 className="inline-flex min-h-[44px] shrink-0 items-center justify-center rounded-lg bg-professional-blue px-4 text-sm font-semibold text-white transition-colors hover:bg-black"
 >
 Sign In
 </Link>
 </div>
 );
 }

 if (!isAdmin) {
 return (
 <div
 className="flex flex-col gap-3 rounded-sm border border-amber/25 bg-amber/5 px-5 py-4 text-sm text-deep-navy sm:flex-row sm:items-center sm:justify-between"
 role="alert"
 >
 <div className="space-y-1">
 <p className="font-semibold">Admin authorization required for this action.</p>
 <p className="text-text-secondary">
 Signed in as:{" "}
 <span className="font-medium text-deep-navy">{user.email ?? "—"}</span>
 </p>
 </div>
 <button
 type="button"
 onClick={() => void handleSignOut()}
 disabled={signingOut}
 className="inline-flex min-h-[44px] shrink-0 items-center justify-center rounded-lg border border-slate/25 px-4 text-sm font-semibold text-deep-navy transition-colors hover:border-professional-blue/40 hover:bg-off-white disabled:opacity-50"
 >
 {signingOut ? "Signing out…" : "Sign Out"}
 </button>
 </div>
 );
 }

 return (
 <div className="flex flex-col gap-3 rounded-sm border border-slate/20 bg-white px-5 py-4 text-sm text-deep-navy shadow-card sm:flex-row sm:items-center sm:justify-between">
 <p>
 <span className="text-text-secondary">Signed in:</span>{" "}
 <span className="font-medium">{user.email ?? "—"}</span>
 </p>
 <button
 type="button"
 onClick={() => void handleSignOut()}
 disabled={signingOut}
 className="inline-flex min-h-[44px] shrink-0 items-center justify-center rounded-lg border border-slate/25 px-4 text-sm font-semibold text-deep-navy transition-colors hover:border-professional-blue/40 hover:bg-off-white disabled:opacity-50"
 >
 {signingOut ? "Signing out…" : "Sign Out"}
 </button>
 </div>
 );
}
