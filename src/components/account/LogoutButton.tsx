"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { signOutAdmin } from "@/lib/infrastructure/firebase/auth";

export function LogoutButton() {
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  const handleLogout = async () => {
    setSigningOut(true);

    try {
      await signOutAdmin();
    } catch {
      // Proceed with redirect even if signOut fails
    }

    router.push("/login");
  };

  return (
    <button
      type="button"
      onClick={() => void handleLogout()}
      disabled={signingOut}
      className="sc-cta-secondary logout-button"
    >
      {signingOut ? "Signing out..." : "Sign out"}
    </button>
  );
}
