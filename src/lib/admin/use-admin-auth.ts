"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getFirebaseAuth,
  onAuthStateChanged,
  refreshUserAdminClaim,
  signOutAdmin,
  type User,
} from "@/lib/firebase/auth";

interface AdminAuthState {
  loading: boolean;
  user: User | null;
  isAdmin: boolean;
}

export function useAdminAuth(): AdminAuthState & {
  getIdToken: (forceRefresh?: boolean) => Promise<string | null>;
  signOut: () => Promise<void>;
  refreshAdminClaim: () => Promise<boolean>;
} {
  const [state, setState] = useState<AdminAuthState>({
    loading: true,
    user: null,
    isAdmin: false,
  });

  useEffect(() => {
    const auth = getFirebaseAuth();
    if (!auth) {
      setState({ loading: false, user: null, isAdmin: false });
      return;
    }

    return onAuthStateChanged(auth, (user) => {
      if (!user) {
        setState({ loading: false, user: null, isAdmin: false });
        return;
      }

      void user
        .getIdToken(true)
        .then(() => user.getIdTokenResult())
        .then((tokenResult) => {
          setState({
            loading: false,
            user,
            isAdmin: tokenResult.claims.admin === true,
          });
        })
        .catch(() => {
          setState({ loading: false, user, isAdmin: false });
        });
    });
  }, []);

  const getIdToken = useCallback(
    async (forceRefresh = false): Promise<string | null> => {
      if (!state.user) {
        return null;
      }

      try {
        return await state.user.getIdToken(forceRefresh);
      } catch {
        return null;
      }
    },
    [state.user]
  );

  const signOut = useCallback(async (): Promise<void> => {
    await signOutAdmin();
    setState({ loading: false, user: null, isAdmin: false });
  }, []);

  const refreshAdminClaim = useCallback(async (): Promise<boolean> => {
    if (!state.user) {
      return false;
    }

    const isAdmin = await refreshUserAdminClaim(state.user);
    setState((current) => ({
      ...current,
      loading: false,
      isAdmin,
    }));
    return isAdmin;
  }, [state.user]);

  return { ...state, getIdToken, signOut, refreshAdminClaim };
}
