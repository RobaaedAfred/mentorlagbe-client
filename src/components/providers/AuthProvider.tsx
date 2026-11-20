"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { api, clearToken } from "@/lib/api";
import type { Profile } from "@/lib/types";

interface AuthState {
  user: Profile | null;
  /** true while the session / profile is still being resolved (never redirect while true) */
  loading: boolean;
  refresh: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthState>({ user: null, loading: true, refresh: async () => {}, signOut: async () => {} });

export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = authClient.useSession();
  const [user, setUser] = useState<Profile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const sessionEmail = session?.user?.email ?? null;

  const loadProfile = useCallback(async () => {
    try {
      setUser(await api<Profile>("/me", { auth: true }));
    } catch {
      setUser(null);
    } finally {
      setProfileLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isPending) return;
    if (!sessionEmail) {
      clearToken();
      setUser(null);
      setProfileLoading(false);
      return;
    }
    setProfileLoading(true);
    loadProfile();
  }, [isPending, sessionEmail, loadProfile]);

  const signOut = useCallback(async () => {
    await authClient.signOut();
    clearToken();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, loading: isPending || profileLoading, refresh: loadProfile, signOut }),
    [user, isPending, profileLoading, loadProfile, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
