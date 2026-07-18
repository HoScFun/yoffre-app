"use client";

import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, XCircle, FileText } from "lucide-react";
import { generateOfferPdf } from "@/lib/pdf";
import { fullName } from "@/types/offer";

interface VendorResponseViewProps {
  token: string;
  offer: any | null;
  clauses: any[];
  agent: any | null;
}

const VendorResponseView = ({ token, offer, clauses, agent }: VendorResponseViewProps) => {
  const { toast } = useToast();
  const [vendeurNom, setVendeurNom] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [respondedAt, setRespondedAt] = useState<string | null>(null);

  const isExpired = offer?.vendor_token_expires_at
    ? new Date(offer.vendor_token_expires_at) < new Date()
    : false;

  const alreadyResponded = offer?.statut === "acceptee" || offer?.statut === "refusee";

  const handleViewPdf = () => {
    if (!offer) return;
    const offerWithAgent = { ...offer, _agent: agent };
    const doc = generateOfferPdf(offerWithAgent, clauses || []);
    window.open(doc.output("bloburl"), "_blank");
  };

  const handleRespond = async (decision: "acceptee" | "refusee") => {
    if (!vendeurNom.trim()) {
      toast({ title: "Erreur", description: "Veuillez saisir votre nom.", variant: "destructive" });
      return;
    }
    setSubmitting(true);

    try {
      const { error } = await supabase.functions.invoke("vendor-respond", {
        body: {
          vendor_token: token,
          decision,
          vendeur_nom: vendeurNom,
        },
      });
      if (error) throw error;
      setRespondedAt(new Date().toISOString());
      setSubmitted(true);
    } catch (err: any) {
      toast({ title: "Erreur", description: err.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  // CAS 1 — Invalid
  if (!offer) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <XCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <p className="font-medium mb-2">Ce lien est invalide ou n&apos;existe pas.</p>
            <p className="text-sm text-muted-foreground">Contactez l&apos;acheteur pour obtenir un nouveau lien.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // CAS 2 — Expired
  if (isExpired && !alreadyResponded && !submitted) {
    const expDate = new Date(offer.vendor_token_expires_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <XCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <p className="font-medium mb-2">Ce lien a expiré le {expDate}.</p>
            <p className="text-sm text-muted-foreground">L&apos;offre n&apos;est plus valable. Contactez l&apos;acheteur.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // CAS 3 — Already responded
  if (!submitted && alreadyResponded) {
    const respDate = offer.responded_at
      ? new Date(offer.responded_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })
      : "date inconnue";
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <CheckCircle className="h-12 w-12 text-accent mx-auto mb-4" />
            <p className="font-medium mb-2">Cette offre a déjà reçu une réponse le {respDate}.</p>
            <p className="text-sm text-muted-foreground">Contactez l&apos;acheteur pour toute question.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // CAS 5 — Submitted confirmation
  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <CheckCircle className="h-16 w-16 mx-auto mb-4 text-accent" />
            <h2 className="text-xl font-bold text-primary mb-2">Votre réponse a bien été enregistrée.</h2>
            <p className="text-sm text-muted-foreground mb-1">
              Horodatage : {respondedAt ? new Date(respondedAt).toISOString() : "—"}
            </p>
            <p className="text-sm text-muted-foreground">Toutes les parties ont été notifiées par email.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // CAS 4 — Valid, pending
  const validiteJours = offer.delai_validite_jours || 10;

  return (
    <div className="min-h-screen bg-background py-10">
      <div className="container max-w-2xl px-4">
        {/* Header banner */}
        <div className="rounded-lg p-4 mb-6 text-center bg-primary">
          <h1 className="text-lg font-bold text-white">
            Vous avez reçu une offre d&apos;achat de {fullName(offer.acheteur_prenom, offer.acheteur_nom)}
          </h1>
        </div>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-extrabold text-primary">Yoffre</h2>
          <p className="text-muted-foreground text-sm">Offre d&apos;achat immobilier</p>
        </div>

        {/* Recap */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Récapitulatif de l&apos;offre</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-1">Bien concerné</h4>
              <p>{offer.bien_adresse}</p>
              <p className="font-semibold">Prix proposé : {Number(offer.bien_prix_propose).toLocaleString("fr-FR")} €</p>
              <p className="text-muted-foreground">Durée de validité : {validiteJours} jours</p>
            </div>
            <Separator />
            <div>
              <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-1">Conditions suspensives</h4>
              {clauses?.length ? (
                <ul className="list-disc pl-5 space-y-1">
                  {clauses.map((oc: any) => (
                    <li key={oc.id}>{oc.clauses?.title || `Clause #${oc.clause_id}`}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">Aucune clause renseignée</p>
              )}
            </div>
            <Separator />
            <Button variant="outline" className="w-full" onClick={handleViewPdf}>
              <FileText className="h-4 w-4 mr-2" />
              📄 Voir l&apos;offre complète en PDF
            </Button>
          </CardContent>
        </Card>

        {/* Response form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">VOTRE RÉPONSE</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="vendeur_nom">Votre nom complet *</Label>
              <Input
                id="vendeur_nom"
                value={vendeurNom}
                onChange={(e) => setVendeurNom(e.target.value)}
                placeholder="Nom complet"
                required
              />
            </div>
            <p className="text-xs text-muted-foreground">
              En indiquant votre nom et en cliquant sur Accepter, vous confirmez avoir pris connaissance de l&apos;offre.
              Cette action sera horodatée et notifiée à toutes les parties.
            </p>
            <div className="flex gap-4 pt-2">
              <Button
                className="flex-1 text-white font-semibold h-12 text-base bg-accent hover:bg-accent/90"
                onClick={() => handleRespond("acceptee")}
                disabled={submitting || !vendeurNom.trim()}
              >
                <CheckCircle className="h-5 w-5 mr-2" />
                J&apos;accepte cette offre
              </Button>
              <Button
                variant="outline"
                className="flex-1 border-destructive text-destructive hover:bg-destructive/5 h-12 text-base font-semibold"
                onClick={() => handleRespond("refusee")}
                disabled={submitting || !vendeurNom.trim()}
              >
                <XCircle className="h-5 w-5 mr-2" />
                Je refuse cette offre
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VendorResponseView;
