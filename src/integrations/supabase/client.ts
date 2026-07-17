import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://hwivlvllupjvsncffoir.supabase.co";
const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3aXZsdmxsdXBqdnNuY2Zmb2lyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwMDI1NTQsImV4cCI6MjA4ODU3ODU1NH0.dSJ_fVP5yPC6PLYqH6lNfATMxuNUBzjojisMKY7kfxI";

// Client navigateur : sessions persistées en localStorage (pages authentifiées = client components).
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Client serveur sans session : lectures publiques (RPC get_offer_by_token, clauses) depuis les RSC.
// cache: "no-store" — le fetch patché de Next.js ne doit jamais servir une réponse Supabase en cache.
export function createServerAnonClient() {
  return createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (url, options = {}) => fetch(url, { ...options, cache: "no-store" }),
    },
  });
}
