"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2, Phone, ArrowRight, Loader2 } from "lucide-react";
import { OfferFormData } from "@/types/offer";

interface PostSubmitFlowProps {
  data: OfferFormData;
  offerId: string;
}

export function PostSubmitFlow({ data, offerId }: PostSubmitFlowProps) {
  const { user, isAnonymous } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [step, setStep] = useState<"confirmation" | "account">("confirmation");
  const [leadSent, setLeadSent] = useState(false);
  const [leadLoading, setLeadLoading] = useState(false);
  const [phoneInput, setPhoneInput] = useState(data.acheteur_telephone || "");
  const [showPhoneField, setShowPhoneField] = useState(!data.acheteur_telephone);

  // Account creation
  const [email, setEmail] = useState(data.acheteur_email);
  const [password, setPassword] = useState("");
  const [creatingAccount, setCreatingAccount] = useState(false);

  const handleLeadSubmit = async () => {
    if (!phoneInput.trim() && showPhoneField) return;
    setLeadLoading(true);
    try {
      const { error } = await supabase.from("leads").insert({
        offer_id: offerId,
        email: data.acheteur_email,
        telephone: phoneInput || data.acheteur_telephone || null,
        bien_type: data.bien_type,
        localisation: data.bien_adresse,
        montant: parseFloat(data.bien_prix_propose) || null,
        offre_envoyee: data.envoyer_au_vendeur,
        source: "cta_courtier",
      });
      if (error) throw error;
      setLeadSent(true);
    } catch {
      toast({ title: "Erreur", description: "Impossible d'enregistrer votre demande.", variant: "destructive" });
    } finally {
      setLeadLoading(false);
    }
  };

  const handleCreateAccount = async () => {
    if (password.length < 6) {
      toast({ title: "Mot de passe trop court", description: "Minimum 6 caractères.", variant: "destructive" });
      return;
    }
    setCreatingAccount(true);
    try {
      const { error } = await supabase.auth.updateUser({ email, password });
      if (error) throw error;

      // Update profile
      if (user) {
        await supabase.from("profiles").upsert({
          id: user.id,
          full_name: data.acheteur_nom,
          phone: data.acheteur_telephone || phoneInput || null,
          email,
        });
      }

      toast({ title: "Compte créé !", description: "Retrouvez toutes vos offres ici." });
      router.push("/dashboard");
    } catch (err: any) {
      toast({ title: "Erreur", description: err.message, variant: "destructive" });
    } finally {
      setCreatingAccount(false);
    }
  };

  const goToAccount = () => setStep("account");

  // STEP A: Confirmation + Lead
  if (step === "confirmation") {
    return (
      <div className="space-y-6">
        {/* Success banner */}
        <div className="rounded-xl bg-green-50 border border-green-200 p-6 text-center">
          <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-3" />
          {data.envoyer_au_vendeur ? (
            <>
              <h2 className="text-xl font-bold text-green-800 mb-1">
                Votre offre a été envoyée à {data.vendeur_nom} !
              </h2>
              <p className="text-sm text-green-700">
                Une copie vous a été envoyée par email à {data.acheteur_email}.
              </p>
            </>
          ) : (
            <>
              <h2 className="text-xl font-bold text-green-800 mb-1">
                Votre offre est prête !
              </h2>
              <p className="text-sm text-green-700">
                Le PDF a été envoyé à {data.acheteur_email}.
              </p>
            </>
          )}
        </div>

        {/* Lead CTA */}
        <Card>
          <CardContent className="p-6">
            {!leadSent ? (
              <>
                <h3 className="text-lg font-bold text-primary mb-2">Besoin d'un financement ?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Nos partenaires courtiers peuvent vous accompagner gratuitement dans votre recherche de prêt immobilier.
                </p>

                {showPhoneField && (
                  <div className="mb-4">
                    <Label htmlFor="phone-lead" className="text-sm">Votre numéro de téléphone</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone-lead"
                        value={phoneInput}
                        onChange={(e) => setPhoneInput(e.target.value)}
                        placeholder="06 12 34 56 78"
                        className="flex-1"
                      />
                    </div>
                  </div>
                )}

                <Button
                  onClick={handleLeadSubmit}
                  disabled={leadLoading || (showPhoneField && !phoneInput.trim())}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  {leadLoading ? (
                    <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Envoi...</>
                  ) : (
                    "Être contacté par un courtier"
                  )}
                </Button>
              </>
            ) : (
              <div className="text-center py-2">
                <CheckCircle2 className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <p className="text-sm font-medium text-green-700">
                  ✓ Un courtier vous contactera sous 48h.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <button
          onClick={goToAccount}
          className="text-sm text-muted-foreground hover:text-foreground underline mx-auto block"
        >
          {leadSent ? "Continuer →" : "Non merci, continuer →"}
        </button>
      </div>
    );
  }

  // STEP B: Account creation (anonymous) or dashboard redirect (authenticated)
  if (!isAnonymous) {
    return (
      <div className="space-y-4 text-center py-8">
        <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-2" />
        <h2 className="text-xl font-bold text-primary">C'est fait !</h2>
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
          <Button onClick={() => router.push("/dashboard")}>
            Voir mon dashboard
          </Button>
          <Button variant="outline" onClick={() => router.push("/nouvelle-offre")}>
            Créer une nouvelle offre
          </Button>
        </div>
        <button
          onClick={() => router.push("/")}
          className="text-xs text-muted-foreground hover:text-foreground underline mt-4 block mx-auto"
        >
          Continuer sans compte →
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-bold text-primary mb-2">Créez un compte pour retrouver vos offres</h2>
        <p className="text-sm text-muted-foreground">
          Pré-remplissage automatique de vos informations, historique de vos offres, suivi des réponses vendeurs.
        </p>
      </div>

      <Card>
        <CardContent className="p-6 space-y-4">
          <div>
            <Label htmlFor="signup-email">Email</Label>
            <Input
              id="signup-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="signup-password">Mot de passe (min. 6 caractères)</Label>
            <Input
              id="signup-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-1"
            />
          </div>
          <Button
            onClick={handleCreateAccount}
            disabled={creatingAccount || password.length < 6}
            className="w-full"
          >
            {creatingAccount ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Création...</>
            ) : (
              <>Créer mon compte <ArrowRight className="h-4 w-4 ml-2" /></>
            )}
          </Button>
        </CardContent>
      </Card>

      <button
        onClick={() => router.push("/")}
        className="text-xs text-muted-foreground hover:text-foreground underline mx-auto block"
      >
        Continuer sans compte →
      </button>
    </div>
  );
}
