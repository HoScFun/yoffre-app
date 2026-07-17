"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { StepProgress } from "@/components/offer-form/StepProgress";
import { Step1Profile } from "@/components/offer-form/Step1Profile";
import { Step2Info } from "@/components/offer-form/Step2Info";
import { Step3Clauses } from "@/components/offer-form/Step3Clauses";
import { Step4Review } from "@/components/offer-form/Step4Review";
import { PostSubmitFlow } from "@/components/offer-form/PostSubmitFlow";
import { OfferFormData, defaultFormData } from "@/types/offer";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { generateOfferPdf } from "@/lib/pdf";
import { isStep2Valid } from "@/lib/validation";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ArrowLeft, ArrowRight, Send, Eye, Loader2, Download, X } from "lucide-react";

const STORAGE_KEY = "yoffre_draft";

const NewOffer = () => {
  const { user, session, profile, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [anonReady, setAnonReady] = useState(false);
  const [data, setData] = useState<OfferFormData>(() => {
    if (typeof window === "undefined") return defaultFormData;
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      return saved ? { ...defaultFormData, ...JSON.parse(saved) } : defaultFormData;
    } catch {
      return defaultFormData;
    }
  });
  const [sending, setSending] = useState(false);
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [submittedOfferId, setSubmittedOfferId] = useState<string | null>(null);

  const { data: clauses } = useQuery({
    queryKey: ["clauses-for-pdf"],
    queryFn: async () => {
      const { data, error } = await supabase.from("clauses").select("*");
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (authLoading) return;
    const ensureSession = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        await supabase.auth.signInAnonymously();
      }
      setAnonReady(true);
    };
    ensureSession();
  }, [authLoading]);

  useEffect(() => {
    if (!session || !user || !profile) return;
    const isAnon = (user as any).is_anonymous === true;
    if (!isAnon && profile) {
      setData((prev) => ({
        ...prev,
        acheteur_nom: prev.acheteur_nom || profile.full_name || "",
        acheteur_email: prev.acheteur_email || profile.email || user.email || "",
      }));
    }
  }, [session, user, profile]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  useEffect(() => {
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [pdfUrl]);

  const updateData = (partial: Partial<OfferFormData>) => {
    setData((prev) => ({ ...prev, ...partial }));
  };

  const canGoNext = () => {
    if (step === 1) return !!data.profil_type;
    if (step === 2) return isStep2Valid(data);
    if (step === 3) return data.selectedClauses.length > 0;
    if (step === 4) return data.disclaimer_accepted;
    return false;
  };

  const buildOfferObj = () => ({
    ...data,
    _agent: data.agent.enabled ? data.agent : null,
    agent_immobilier: data.agent.enabled,
    _financement: data.financement,
    _financement_banque: data.financement_banque,
    _clauseValues: data.clauseValues,
    _message_vendeur: data.message_vendeur,
  });

  const buildClausesForPdf = () => {
    const selectedClauseDetails = clauses?.filter((c) => data.selectedClauses.includes(c.id)) || [];
    return selectedClauseDetails.map((c) => ({
      clause_id: c.id,
      clauses: c,
      valeur_montant_pret: data.clauseValues.valeur_montant_pret || null,
      valeur_taux_max: data.clauseValues.valeur_taux_max || null,
      valeur_duree_pret: data.clauseValues.valeur_duree_pret || null,
    }));
  };

  const handlePreviewPdf = async () => {
    setGeneratingPdf(true);
    try {
      const offerObj = buildOfferObj();
      const offerClausesForPdf = buildClausesForPdf();
      const doc = generateOfferPdf(offerObj, offerClausesForPdf);
      const blob = doc.output("blob");
      const url = URL.createObjectURL(blob);
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
      setPdfUrl(url);
      setShowPdfModal(true);
    } catch {
      toast({
        title: "Erreur",
        description: "La génération du PDF a échoué. Vérifiez que tous les champs obligatoires sont remplis.",
        variant: "destructive",
      });
    } finally {
      setGeneratingPdf(false);
    }
  };

  const handleDownloadPdf = () => {
    if (!pdfUrl) return;
    const a = document.createElement("a");
    a.href = pdfUrl;
    a.download = `offre-${data.bien_adresse?.replace(/\s+/g, "-").substring(0, 30) || "yoffre"}.pdf`;
    a.click();
  };

  const handleSend = async () => {
    if (!user) return;
    setSending(true);

    try {
      const statut = data.envoyer_au_vendeur ? "envoyee" : "brouillon";

      const { data: offer, error: offerError } = await supabase
        .from("offers")
        .insert({
          user_id: user.id,
          profil_type: data.profil_type,
          acheteur_nom: data.acheteur_nom,
          acheteur_email: data.acheteur_email,
          acheteur_telephone: data.acheteur_telephone || null,
          acheteur_adresse: data.acheteur_adresse || null,
          bien_adresse: data.bien_adresse,
          bien_type: data.bien_type,
          bien_prix_affiche: data.bien_prix_affiche ? parseFloat(data.bien_prix_affiche) : null,
          bien_prix_propose: parseFloat(data.bien_prix_propose),
          delai_validite_jours: data.delai_validite_jours,
          vendeur_nom: data.vendeur_nom,
          vendeur_email: data.vendeur_email,
          vendeur_adresse: data.vendeur_adresse || null,
          notaire_email: data.notaire_email || null,
          agent_immobilier: data.agent.enabled,
          financement: data.financement || null,
          financement_banque: data.financement_banque || null,
          message_vendeur: data.message_vendeur || null,
          envoyer_au_vendeur: data.envoyer_au_vendeur,
          statut,
          sent_at: data.envoyer_au_vendeur ? new Date().toISOString() : null,
          vendor_token_expires_at: new Date(Date.now() + data.delai_validite_jours * 24 * 60 * 60 * 1000).toISOString(),
          disclaimer_accepted: data.disclaimer_accepted,
        })
        .select()
        .single();

      if (offerError) throw offerError;

      const clauseInserts = data.selectedClauses.map((clauseId) => ({
        offer_id: offer.id,
        clause_id: clauseId,
        valeur_montant_pret: data.clauseValues.valeur_montant_pret || null,
        valeur_taux_max: data.clauseValues.valeur_taux_max || null,
        valeur_duree_pret: data.clauseValues.valeur_duree_pret || null,
      }));

      if (clauseInserts.length > 0) {
        const { error: clauseError } = await supabase.from("offer_clauses").insert(clauseInserts);
        if (clauseError) throw clauseError;
      }

      if (data.agent.enabled) {
        const { error: agentError } = await supabase.from("agents").insert({
          offer_id: offer.id,
          nom: data.agent.nom,
          agence: data.agent.agence,
          email: data.agent.email,
          telephone: data.agent.telephone || null,
          carte_t: data.agent.carte_t || null,
        });
        if (agentError) throw agentError;
      }

      try {
        const { error: emailError } = await supabase.functions.invoke("send-offer-emails", {
          body: { offerId: offer.id, eventType: "envoi_offre" },
        });
        if (emailError) console.error("Email sending failed:", emailError);
      } catch (e) {
        console.error("Email edge function error:", e);
      }

      localStorage.removeItem(STORAGE_KEY);
      setSubmittedOfferId(offer.id);
    } catch (error: any) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  if (authLoading || !anonReady) return null;

  // Post-submit flow
  if (submittedOfferId) {
    return (
      <Layout>
        <div className="container max-w-xl py-10">
          <PostSubmitFlow data={data} offerId={submittedOfferId} />
        </div>
      </Layout>
    );
  }

  const nextDisabled = !canGoNext();

  return (
    <Layout>
      <div className="container max-w-3xl py-10">
        <h1 className="text-3xl font-bold text-primary mb-8">Nouvelle offre d'achat</h1>
        <StepProgress currentStep={step} totalSteps={4} />

        <Card>
          <CardContent className="p-6 md:p-8">
            {step === 1 && <Step1Profile data={data} onChange={updateData} />}
            {step === 2 && <Step2Info data={data} onChange={updateData} />}
            {step === 3 && <Step3Clauses data={data} onChange={updateData} onGoToStep={setStep} />}
            {step === 4 && <Step4Review data={data} onChange={updateData} />}

            <div className="flex justify-between mt-8">
              {step > 1 ? (
                <Button variant="outline" onClick={() => setStep(step - 1)}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Précédent
                </Button>
              ) : (
                <div />
              )}

              <div className="flex gap-2">
                {step === 4 && (
                  <>
                    <Button variant="outline" onClick={handlePreviewPdf} disabled={generatingPdf}>
                      {generatingPdf ? (
                        <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Génération...</>
                      ) : (
                        <><Eye className="h-4 w-4 mr-2" /> Prévisualiser le PDF</>
                      )}
                    </Button>
                    <Button
                      onClick={handleSend}
                      disabled={nextDisabled || sending}
                      className="bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      {sending ? (
                        <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Envoi en cours...</>
                      ) : (
                        <><Send className="h-4 w-4 mr-2" /> {data.envoyer_au_vendeur ? "📤 Envoyer l'offre" : "📄 Générer mon offre"}</>
                      )}
                    </Button>
                  </>
                )}
                {step < 4 && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span>
                        <Button onClick={() => setStep(step + 1)} disabled={nextDisabled}>
                          Suivant
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </span>
                    </TooltipTrigger>
                    {nextDisabled && (
                      <TooltipContent>
                        Veuillez corriger les erreurs avant de continuer
                      </TooltipContent>
                    )}
                  </Tooltip>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showPdfModal} onOpenChange={setShowPdfModal}>
        <DialogContent className="max-w-4xl w-[95vw] h-[90vh] flex flex-col p-0">
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <Button variant="ghost" size="sm" onClick={() => setShowPdfModal(false)}>
              <X className="h-4 w-4 mr-1" /> Fermer
            </Button>
            <DialogTitle className="text-sm font-medium">Aperçu du PDF</DialogTitle>
            <Button variant="outline" size="sm" onClick={handleDownloadPdf}>
              <Download className="h-4 w-4 mr-1" /> Télécharger
            </Button>
          </div>
          <div className="flex-1 min-h-0">
            {pdfUrl && (
              <iframe
                src={pdfUrl}
                className="w-full h-full border-0"
                title="Aperçu PDF"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default NewOffer;
