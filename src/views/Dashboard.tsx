"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Plus, Eye, Download, Link2, FileText } from "lucide-react";
import { downloadOfferPdf } from "@/lib/pdf";

type FilterTab = "all" | "envoyee" | "acceptee" | "refusee" | "expiree";

const tabs: { key: FilterTab; label: string }[] = [
  { key: "all", label: "Toutes" },
  { key: "envoyee", label: "En attente" },
  { key: "acceptee", label: "Acceptées" },
  { key: "refusee", label: "Refusées" },
  { key: "expiree", label: "Expirées" },
];

const Dashboard = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [filter, setFilter] = useState<FilterTab>("all");

  useEffect(() => {
    if (!loading && !user) router.push("/auth");
  }, [user, loading, router]);

  const { data: offers, isLoading } = useQuery({
    queryKey: ["offers", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("offers")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const handleDownloadPdf = async (offerId: string) => {
    const { data: offer } = await supabase.from("offers").select("*").eq("id", offerId).single();
    const { data: offerClauses } = await supabase.from("offer_clauses").select("*, clauses(*)").eq("offer_id", offerId);
    const { data: vendorResponse } = await supabase.from("vendor_responses").select("*").eq("offer_id", offerId).maybeSingle();
    let agent = null;
    if (offer?.agent_immobilier) {
      const { data } = await supabase.from("agents").select("*").eq("offer_id", offerId).single();
      agent = data;
    }
    if (offer) {
      downloadOfferPdf({ ...offer, _agent: agent }, offerClauses || [], vendorResponse);
    }
  };

  const handleCopyLink = async (offerId: string) => {
    // Fetch token server-side to avoid exposing it in the DOM
    const { data } = await supabase.from("offers").select("vendor_token").eq("id", offerId).single();
    if (data?.vendor_token) {
      const link = `${window.location.origin}/repondre/${data.vendor_token}`;
      navigator.clipboard.writeText(link);
      toast({ title: "Lien copié dans le presse-papiers ✓" });
    }
  };

  const filtered = offers?.filter((o) => {
    if (filter === "all") return true;
    return o.statut === filter;
  });

  if (loading) return null;

  return (
    <Layout>
      <div className="container py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-primary">Mes offres</h1>
          <Link href="/nouvelle-offre">
            <Button style={{ backgroundColor: "#1E3A5F" }} className="text-white hover:opacity-90">
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle offre
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground">Chargement...</div>
        ) : !offers?.length ? (
          <div className="flex flex-col items-center justify-center py-20">
            <FileText className="h-16 w-16 text-muted-foreground/40 mb-4" />
            <p className="text-lg text-muted-foreground mb-6">Vous n'avez pas encore créé d'offre.</p>
            <Link href="/nouvelle-offre">
              <Button style={{ backgroundColor: "#1E3A5F" }} className="text-white hover:opacity-90">
                Créer ma première offre
              </Button>
            </Link>
          </div>
        ) : (
          <>
            {/* Filter tabs */}
            <div className="flex gap-1 mb-4 border-b">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key)}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    filter === tab.key
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Adresse du bien</TableHead>
                      <TableHead>Vendeur</TableHead>
                      <TableHead className="text-right">Prix proposé</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered?.map((offer) => (
                      <TableRow key={offer.id}>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(offer.created_at!).toLocaleDateString("fr-FR")}
                        </TableCell>
                        <TableCell className="font-medium">
                          {offer.bien_adresse.length > 40
                            ? offer.bien_adresse.substring(0, 40) + "…"
                            : offer.bien_adresse}
                        </TableCell>
                        <TableCell>{offer.vendeur_nom}</TableCell>
                        <TableCell className="text-right font-medium">
                          {Number(offer.bien_prix_propose).toLocaleString("fr-FR")} €
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={offer.statut} />
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Link href={`/offre/${offer.id}`}>
                              <Button variant="ghost" size="icon" title="Voir le détail">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button variant="ghost" size="icon" title="Télécharger PDF" onClick={() => handleDownloadPdf(offer.id)}>
                              <Download className="h-4 w-4" />
                            </Button>
                            {offer.statut === "envoyee" && (
                              <Button variant="ghost" size="icon" title="Copier le lien vendeur" onClick={() => handleCopyLink(offer.id)}>
                                <Link2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <p className="text-xs text-muted-foreground mt-4 text-center">
              Les offres expirées sont conservées 12 mois puis supprimées.
            </p>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
