"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { Eye, FileDown, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { generateOfferPdf } from "@/lib/pdf";
import { fullName } from "@/types/offer";

interface AdminOffersProps {
  userFilter: string | null;
  onClearFilter: () => void;
}

export function AdminOffers({ userFilter, onClearFilter }: AdminOffersProps) {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [search, setSearch] = useState("");

  const { data: offers, isLoading } = useQuery({
    queryKey: ["admin-offers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("offers")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const filtered = offers?.filter((o) => {
    if (userFilter && o.user_id !== userFilter) return false;
    if (statusFilter !== "all" && o.statut !== statusFilter) return false;
    if (dateFilter !== "all") {
      const days = parseInt(dateFilter);
      const cutoff = new Date(Date.now() - days * 86400000);
      if (new Date(o.created_at || "") < cutoff) return false;
    }
    if (search) {
      const s = search.toLowerCase();
      if (!fullName(o.acheteur_prenom, o.acheteur_nom).toLowerCase().includes(s) && !o.bien_adresse.toLowerCase().includes(s)) return false;
    }
    return true;
  }) || [];

  const counts = {
    total: filtered.length,
    envoyees: filtered.filter((o) => o.statut === "envoyee").length,
    acceptees: filtered.filter((o) => o.statut === "acceptee").length,
    refusees: filtered.filter((o) => o.statut === "refusee").length,
  };

  const handleDownloadPdf = async (offer: any) => {
    const { data: oc } = await supabase
      .from("offer_clauses")
      .select("*, clauses(*)")
      .eq("offer_id", offer.id);
    const { data: vr } = await supabase
      .from("vendor_responses")
      .select("*")
      .eq("offer_id", offer.id)
      .maybeSingle();
    const doc = generateOfferPdf(
      { ...offer, _financement: offer.financement, _financement_banque: offer.financement_banque, _message_vendeur: offer.message_vendeur, _clauseValues: {} },
      oc || [],
      vr
    );
    doc.save(`offre-${offer.id.substring(0, 8)}.pdf`);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">
          Toutes les offres
          {userFilter && (
            <Button variant="ghost" size="sm" className="ml-2 text-xs" onClick={onClearFilter}>
              <X className="h-3 w-3 mr-1" /> Filtre utilisateur actif
            </Button>
          )}
        </h2>
      </div>

      <div className="flex flex-wrap gap-3 mb-4">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px]"><SelectValue placeholder="Statut" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="brouillon">Brouillon</SelectItem>
            <SelectItem value="envoyee">Envoyée</SelectItem>
            <SelectItem value="acceptee">Acceptée</SelectItem>
            <SelectItem value="refusee">Refusée</SelectItem>
          </SelectContent>
        </Select>
        <Select value={dateFilter} onValueChange={setDateFilter}>
          <SelectTrigger className="w-[140px]"><SelectValue placeholder="Période" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tout</SelectItem>
            <SelectItem value="7">7 jours</SelectItem>
            <SelectItem value="30">30 jours</SelectItem>
            <SelectItem value="90">90 jours</SelectItem>
          </SelectContent>
        </Select>
        <Input
          placeholder="Rechercher acheteur ou adresse..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
      </div>

      <div className="rounded-md border overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Acheteur</TableHead>
              <TableHead>Adresse du bien</TableHead>
              <TableHead>Prix</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Chargement...</TableCell></TableRow>
            ) : filtered.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Aucune offre trouvée</TableCell></TableRow>
            ) : filtered.map((o) => (
              <TableRow key={o.id}>
                <TableCell className="text-xs">{new Date(o.created_at || "").toLocaleDateString("fr-FR")}</TableCell>
                <TableCell className="text-sm font-medium">{fullName(o.acheteur_prenom, o.acheteur_nom)}</TableCell>
                <TableCell className="text-sm max-w-[250px] truncate">{o.bien_adresse}</TableCell>
                <TableCell className="text-sm">{Number(o.bien_prix_propose).toLocaleString("fr-FR")} €</TableCell>
                <TableCell><StatusBadge status={o.statut || "brouillon"} /></TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => router.push(`/offre/${o.id}`)}><Eye className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDownloadPdf(o)}><FileDown className="h-4 w-4" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex gap-4 mt-4 text-sm text-muted-foreground">
        <span>Total : <strong className="text-foreground">{counts.total}</strong></span>
        <span>Envoyées : <strong className="text-foreground">{counts.envoyees}</strong></span>
        <span>Acceptées : <strong className="text-green-600">{counts.acceptees}</strong></span>
        <span>Refusées : <strong className="text-destructive">{counts.refusees}</strong></span>
      </div>
    </div>
  );
}
