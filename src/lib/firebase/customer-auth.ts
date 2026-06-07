import {
 GoogleAuthProvider,
 signInWithPopup,
} from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase/auth";

export async function signInCustomerWithGoogle() {
 const auth = getFirebaseAuth();
 if (!auth) {
 throw new Error("Firebase Auth is not configured.");
 }

 const provider = new GoogleAuthProvider();
 const result = await signInWithPopup(auth, provider);
 return result.user;
}

export function mapCustomerSignInError(error: unknown): string {
 if (
 typeof error === "object" &&
 error !== null &&
 "code" in error &&
 typeof error.code === "string" &&
 (error.code === "auth/popup-closed-by-user" ||
 error.code === "auth/cancelled-popup-request")
 ) {
 return "Sign-in was cancelled.";
 }

 return "Sign-in failed. Try again.";
}
