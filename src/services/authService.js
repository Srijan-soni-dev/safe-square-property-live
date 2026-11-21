import { supabase } from "@/lib/supabaseClient";

export async function signInWithEmail({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signOutUser() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
}

export function onAuthChange(callback) {
  const { data } = supabase.auth.onAuthStateChange((_event, session) => callback(session));
  return () => data.subscription.unsubscribe();
}

/** Turns Supabase auth errors into short, readable messages. */
export function getAuthErrorMessage(error) {
  const msg = (error?.message || "").toLowerCase();
  if (msg.includes("invalid login credentials")) return "Email or password is incorrect.";
  if (msg.includes("email not confirmed")) return "This email is not confirmed yet. Confirm it in the Supabase dashboard.";
  if (msg.includes("failed to fetch") || msg.includes("network")) return "Can't reach the server. Check your internet connection and try again.";
  if (msg.includes("rate limit") || msg.includes("too many")) return "Too many attempts. Wait a minute and try again.";
  return "Sign in failed. Please try again.";
}
