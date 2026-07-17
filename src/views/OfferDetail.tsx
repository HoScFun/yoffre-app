"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { Separator } from "@/components/ui/separator";
import { downloadOfferPdf } from "@/lib/pdf";
import { useToast } from "@/hooks/use-toast";
import { numberToFrenchWords } from "@/lib/pdf";
import { Download, Link2, Mail, ChevronRight } from "lucide-react";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const statusBanners: Record<string, { bg: string; text: string; icon: string }> = {
  envoyee: { bg: "bg-primary/10", text: "text-primary", icon: "⏳" },
  acceptee: { bg: "bg-green-50", text: "text-green-700", icon: "✓" },
  refusee: { bg: "bg-destructive/10", text: "text-destructive", icon: "✗" },
  expiree: { bg: "bg-orange-50", text: "text-orange-700", icon: "⚠" },
};

const OfferDetail = () => {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const { toast } = useToast();

  const { data: offer, isLoading } = useQuery({
    queryKey: ["offer", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("offers").select("*").eq("id", id!).single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const { data: offerClauses } = useQuery({
    queryKey: ["offer-clauses", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("offer_clauses").select("*, clauses(*)").eq("offer_id", id!);
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const { data: vendorResponse } = useQuery({
    queryKey: ["vendor-response", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("vendor_responses").select("*").eq("offer_id", id!).maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const { data: agent } = useQuery({
    queryKey: ["offer-agent", id],
    queryFn: async () => {
      const { data } = await supabase.from("agents").select("*").eq("offer_id", id!).single();
      return data;
    },
    enabled: !!id && !!offer?.agent_immobilier,
  });

  if (isLoading) return <Layout><div className="container py-20 text-center text-muted-foreground">Chargement...</div></Layout>;
  if (!offer) return <Layout><div className="container py-20 text-center">Offre introuvable</div></Layout>;

  const handleDownload = () => {
    downloadOfferPdf({ ...offer, _agent: agent }, offerClauses || [], vendorResponse);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/repondre/${offer.vendor_token}`);
    toast({ title: "Lien copié dans le presse-papiers ✓" });
  };

  const handleResendEmails = async () => {
    try {
      const { error } = await supabase.functions.invoke("send-offer-emails", { body: { offerId: offer.id } });
      if (error) throw error;
      toast({ title: "Emails renvoyés ✓", description: "Toutes les parties ont été notifiées." });
    } catch {
      toast({ title: "Erreur", description: "Impossible de renvoyer les emails.", variant: "destructive" });
    }
  };

  const statut = offer.statut || "brouillon";
  const banner = statusBanners[statut];
  const prix = Number(offer.bien_prix_propose);
  const truncatedAddr = offer.bien_adresse.length > 35 ? offer.bien_adresse.substring(0, 35) + "…" : offer.bien_adresse;

  const getBannerLabel = () => {
    const date = (d: string | null) => d ? new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }) : "";
    if (statut === "envoyee") return "⏳ En attente de réponse du vendeur";
    if (statut === "acceptee") return `✓ Offre acceptée le ${date(offer.responded_at)}`;
    if (statut === "refusee") return `✗ Offre refusée le ${date(offer.responded_at)}`;
    if (statut === "expiree") return `⚠ Offre expirée le ${date(offer.vendor_token_expires_at)}`;
    return "";
  };

  return (
    <Layout>
      <div className="container max-w-3xl py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1 text-sm text-muted-foreground mb-6">
          <Link href="/dashboard" className="hover:text-foreground">Mes offres</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground">{truncatedAddr}</span>
        </nav>

        {/* Status banner */}
        {banner && (
          <div className={`${banner.bg} ${banner.text} rounded-lg px-4 py-3 mb-6 font-medium text-sm`}>
            {getBannerLabel()}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" /> Télécharger le PDF
          </Button>
          {statut === "envoyee" && (
            <>
              <Button variant="outline" size="sm" onClick={handleCopyLink}>
                <Link2 className="h-4 w-4 mr-2" /> Copier le lien vendeur
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Mail className="h-4 w-4 mr-2" /> Renvoyer les emails
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Renvoyer les emails ?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Êtes-vous sûr de vouloir renvoyer les emails à toutes les parties ?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction onClick={handleResendEmails}>Confirmer</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          )}
          {statut === "brouillon" && (
            <Link href="/nouvelle-offre">
              <Button variant="outline" size="sm">✏ Continuer la rédaction</Button>
            </Link>
          )}
        </div>

        {/* Info blocks */}
        <Card className="mb-6">
          <CardContent className="p-6 space-y-4 text-sm">
            <Section title="Acheteur">
              <p><span className="text-muted-foreground">Nom :</span> {offer.acheteur_nom}</p>
              <p><span className="text-muted-foreground">Email :</span> {offer.acheteur_email}</p>
              {offer.acheteur_telephone && <p><span className="text-muted-foreground">Tél :</span> {offer.acheteur_telephone}</p>}
              {offer.acheteur_adresse && <p><span className="text-muted-foreground">Adresse :</span> {offer.acheteur_adresse}</p>}
            </Section>
            <Separator />
            <Section title="Bien immobilier">
              <p><span className="text-muted-foreground">Adresse :</span> {offer.bien_adresse}</p>
              {offer.bien_type && <p><span className="text-muted-foreground">Type :</span> {offer.bien_type}</p>}
              <p>
                <span className="text-muted-foreground">Prix proposé :</span>{" "}
                <strong>{prix.toLocaleString("fr-FR")} €</strong>
                <span className="text-muted-foreground italic ml-1">— {numberToFrenchWords(Math.round(prix))} euros</span>
              </p>
            </Section>
            <Separator />
            <Section title="Vendeur">
              <p><span className="text-muted-foreground">Nom :</span> {offer.vendeur_nom}</p>
              <p><span className="text-muted-foreground">Email :</span> {offer.vendeur_email}</p>
              {offer.vendeur_adresse && <p><span className="text-muted-foreground">Adresse :</span> {offer.vendeur_adresse}</p>}
            </Section>

            {agent && (
              <>
                <Separator />
                <Section title="Agent immobilier">
                  <p><span className="text-muted-foreground">Nom :</span> {agent.nom}</p>
                  <p><span className="text-muted-foreground">Agence :</span> {agent.agence}</p>
                  <p><span className="text-muted-foreground">Email :</span> {agent.email}</p>
                  {agent.carte_t && <p><span className="text-muted-foreground">Carte T :</span> {agent.carte_t}</p>}
                </Section>
              </>
            )}

            {offer.notaire_email && (
              <>
                <Separator />
                <Section title="Notaire">
                  <p><span className="text-muted-foreground">Email :</span> {offer.notaire_email}</p>
                </Section>
              </>
            )}

            <Separator />
            <Section title="Conditions suspensives">
              {offerClauses?.length ? (
                <ol className="list-decimal pl-5 space-y-1">
                  {offerClauses.map((oc: any) => (
                    <li key={oc.id}>
                      <span className="font-medium">{oc.clauses?.title || `Clause #${oc.clause_id}`}</span>
                      {oc.clauses?.base_legale && (
                        <span className="text-muted-foreground italic text-xs ml-2">({oc.clauses.base_legale})</span>
                      )}
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="text-muted-foreground">Aucune clause</p>
              )}
            </Section>

            <Separator />
            <Section title="Historique">
              <div className="relative pl-6 space-y-3">
                <TimelineItem label="Offre créée" date={offer.created_at} />
                {offer.sent_at && <TimelineItem label={`Offre envoyée à ${offer.vendeur_email}`} date={offer.sent_at} />}
                {offer.responded_at && <TimelineItem label="Réponse vendeur reçue" date={offer.responded_at} />}
              </div>
            </Section>

            {vendorResponse && (
              <>
                <Separator />
                <Section title="Réponse du vendeur">
                  <p>Décision : <strong>{vendorResponse.decision === "acceptee" ? "Acceptée ✅" : "Refusée ❌"}</strong></p>
                  {vendorResponse.vendeur_nom && <p>Signé par : {vendorResponse.vendeur_nom}</p>}
                  {vendorResponse.responded_at && <p>Date : {new Date(vendorResponse.responded_at).toLocaleString("fr-FR")}</p>}
                  {vendorResponse.commentaire && <p>Commentaire : {vendorResponse.commentaire}</p>}
                </Section>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">{title}</h4>
      {children}
    </div>
  );
}

function TimelineItem({ label, date }: { label: string; date: string | null }) {
  if (!date) return null;
  return (
    <div className="relative">
      <div className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-primary border-2 border-background" />
      <div className="absolute -left-[13px] top-4 w-px h-full bg-border" />
      <p className="text-sm font-medium">{label}</p>
      <p className="text-xs text-muted-foreground">{new Date(date).toLocaleString("fr-FR")}</p>
    </div>
  );
}

export default OfferDetail;
