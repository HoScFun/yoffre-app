"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, X } from "lucide-react";

export function Header() {
  const { user, profile, isAnonymous, signOut } = useAuth();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  const isRealUser = !!user && !isAnonymous;

  const initials = (() => {
    const name = profile?.full_name || user?.email || "";
    const parts = name.split(/[\s@]+/);
    return (parts[0]?.[0] || "").toUpperCase() + (parts[1]?.[0] || "").toUpperCase();
  })();

  return (
    <header className="sticky top-0 z-50 border-b bg-white shadow-sm">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="font-extrabold tracking-tight text-primary text-[22px]">
          Yoffre
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/nouvelle-offre" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Créer une offre
          </Link>
          <Link href="/agences" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Pour les agences
          </Link>
          <Link href="/guide-offre-achat" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Guide
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {isRealUser ? (
            <>
              <Link href="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Mon espace
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-white bg-primary"
                    aria-label="Menu du compte"
                  >
                    {initials || "?"}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => router.push("/compte")}>Mon compte</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>Déconnexion</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Link href="/auth" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Se connecter
            </Link>
          )}
        </div>

        <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t bg-white px-4 pb-4 space-y-3">
          <Link href="/nouvelle-offre" onClick={() => setMobileOpen(false)} className="block py-2 text-sm font-medium text-muted-foreground">
            Créer une offre
          </Link>
          <Link href="/agences" onClick={() => setMobileOpen(false)} className="block py-2 text-sm font-medium text-muted-foreground">
            Pour les agences
          </Link>
          <Link href="/guide-offre-achat" onClick={() => setMobileOpen(false)} className="block py-2 text-sm font-medium text-muted-foreground">
            Guide
          </Link>

          <div className="border-t border-border" />

          {isRealUser ? (
            <>
              <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="block py-2 text-sm font-medium text-muted-foreground">
                Mon espace
              </Link>
              <Link href="/compte" onClick={() => setMobileOpen(false)} className="block py-2 text-sm font-medium text-muted-foreground">
                Mon compte
              </Link>
              <button onClick={() => { handleSignOut(); setMobileOpen(false); }} className="block py-2 text-sm font-medium text-destructive">
                Déconnexion
              </button>
            </>
          ) : (
            <Link href="/auth" onClick={() => setMobileOpen(false)} className="block py-2 text-sm font-medium text-muted-foreground">
              Se connecter
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
