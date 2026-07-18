"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useIsAdmin } from "@/hooks/use-admin";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { AdminClauses } from "@/components/admin/AdminClauses";
import { AdminOffers } from "@/components/admin/AdminOffers";
import { AdminUsers } from "@/components/admin/AdminUsers";
import { AdminStats } from "@/components/admin/AdminStats";
import { useEffect } from "react";

export default function Admin() {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, isLoading: adminLoading } = useIsAdmin();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("clauses");
  const [userFilter, setUserFilter] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) router.push("/auth");
    else if (!authLoading && !adminLoading && !isAdmin) router.push("/dashboard");
  }, [user, authLoading, isAdmin, adminLoading, router]);

  if (authLoading || adminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!isAdmin) return null;

  const handleViewUserOffers = (userId: string) => {
    setUserFilter(userId);
    setActiveTab("offres");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <header className="bg-primary text-white">
        <div className="container flex items-center justify-between py-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight">YOFFRE — Administration</h1>
            <p className="text-sm text-white/70">Espace réservé aux administrateurs</p>
          </div>
          <Badge variant="destructive" className="text-xs font-bold">ADMIN</Badge>
        </div>
      </header>

      {/* Tabs */}
      <div className="container py-6">
        <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v); if (v !== "offres") setUserFilter(null); }}>
          <TabsList className="mb-6">
            <TabsTrigger value="clauses">Clauses</TabsTrigger>
            <TabsTrigger value="offres">Offres</TabsTrigger>
            <TabsTrigger value="utilisateurs">Utilisateurs</TabsTrigger>
            <TabsTrigger value="stats">Stats</TabsTrigger>
          </TabsList>

          <TabsContent value="clauses"><AdminClauses /></TabsContent>
          <TabsContent value="offres"><AdminOffers userFilter={userFilter} onClearFilter={() => setUserFilter(null)} /></TabsContent>
          <TabsContent value="utilisateurs"><AdminUsers onViewOffers={handleViewUserOffers} /></TabsContent>
          <TabsContent value="stats"><AdminStats /></TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
