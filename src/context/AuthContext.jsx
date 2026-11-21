import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import {
  getCurrentSession,
  onAuthChange,
  signInWithEmail,
  signOutUser,
} from "@/services/authService";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    getCurrentSession()
      .then((s) => active && setSession(s))
      .catch(() => active && setSession(null))
      .finally(() => active && setLoading(false));

    const unsubscribe = onAuthChange((s) => {
      if (!active) return;
      setSession(s);
      setLoading(false);
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  const signIn = useCallback((credentials) => signInWithEmail(credentials), []);
  const signOut = useCallback(() => signOutUser(), []);

  const value = useMemo(
    () => ({ session, user: session?.user ?? null, loading, signIn, signOut }),
    [session, loading, signIn, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
