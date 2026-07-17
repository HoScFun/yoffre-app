"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Info, CreditCard, Banknote, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { OfferFormData } from "@/types/offer";
import { ValidatedInput, ValidatedTextarea } from "@/components/ui/validated-input";
import {
  validateName, validateEmail, validatePhone, validateAddress,
  validatePrice, validatePrixAffiche, validateDelaiValidite,
  validateMontantPret, validateTauxMax, validateDureePret,
  validateAgencyName, validateCarteT, validateOptionalEmail,
  formatPhoneDisplay,
} from "@/lib/validation";

interface Step2Props {
  data: OfferFormData;
  onChange: (data: Partial<OfferFormData>) => void;
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <>
      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mt-6 mb-3">{children}</h4>
      <Separator className="mb-4" />
    </>
  );
}

const messageTemplates = [
  {
    label: "Famille / Résidence principale",
    text: `Madame, Monsieur,\n\nSuite à la visite de votre bien, nous vous adressons cette offre d'achat avec le souhait sincère d'y établir notre résidence principale. Votre bien correspond parfaitement à notre projet de vie familial.\n\nNous restons disponibles pour tout échange.\n\nCordialement,`,
  },
  {
    label: "Investisseur",
    text: `Madame, Monsieur,\n\nVotre bien retient notre attention dans le cadre d'un projet d'investissement locatif. Notre offre reflète notre analyse sérieuse du marché local et notre capacité de financement confirmée.\n\nNous vous remercions de l'attention portée à notre proposition.\n\nCordialement,`,
  },
  {
    label: "Achat comptant / Profil solide",
    text: `Madame, Monsieur,\n\nNous avons le plaisir de vous soumettre cette offre d'achat ferme, sans condition suspensive de financement. Notre dossier est prêt et nous sommes disponibles pour avancer rapidement vers la signature.\n\nDans l'attente de votre réponse,\n\nCordialement,`,
  },
];

export function Step2Info({ data, onChange }: Step2Props) {
  const prixPropose = parseFloat(data.bien_prix_propose) || 0;
  const depot = prixPropose * 0.1;
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const [confirmReplace, setConfirmReplace] = useState<string | null>(null);

  const updateAgent = (partial: Partial<OfferFormData["agent"]>) => {
    onChange({ agent: { ...data.agent, ...partial } });
  };

  const dureeMois = data.clauseValues.valeur_duree_pret || 0;
  const dureeAns = Math.floor(dureeMois / 12);
  const dureeResteM = dureeMois % 12;

  const handleSelectTemplate = (text: string) => {
    if (data.message_vendeur && data.message_vendeur.trim().length > 0) {
      setConfirmReplace(text);
    } else {
      onChange({ message_vendeur: text });
      setTemplateDialogOpen(false);
    }
  };

  const confirmReplaceMessage = () => {
    if (confirmReplace) {
      onChange({ message_vendeur: confirmReplace });
      setConfirmReplace(null);
      setTemplateDialogOpen(false);
    }
  };

  const handlePhoneBlur = (field: "acheteur_telephone" | "agent") => {
    if (field === "acheteur_telephone") {
      const formatted = formatPhoneDisplay(data.acheteur_telephone);
      if (formatted !== data.acheteur_telephone) onChange({ acheteur_telephone: formatted });
    } else {
      const formatted = formatPhoneDisplay(data.agent.telephone);
      if (formatted !== data.agent.telephone) updateAgent({ telephone: formatted });
    }
  };

  return (
    <div>
      <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Étape 2</h2>
      <h3 className="text-xl font-bold text-primary mb-2">Informations de l'offre</h3>

      <SectionTitle>Vos informations</SectionTitle>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="acheteur_nom">Nom complet *</Label>
          <ValidatedInput
            id="acheteur_nom"
            value={data.acheteur_nom}
            onChange={(e) => onChange({ acheteur_nom: e.target.value })}
            validate={(v) => validateName(v)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="acheteur_email">Email *</Label>
          <ValidatedInput
            id="acheteur_email"
            type="email"
            value={data.acheteur_email}
            onChange={(e) => onChange({ acheteur_email: e.target.value })}
            validate={validateEmail}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="acheteur_telephone">Téléphone *</Label>
          <ValidatedInput
            id="acheteur_telephone"
            value={data.acheteur_telephone}
            onChange={(e) => onChange({ acheteur_telephone: e.target.value })}
            validate={validatePhone}
            onBlur={() => handlePhoneBlur("acheteur_telephone")}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="acheteur_adresse">Adresse complète *</Label>
          <ValidatedInput
            id="acheteur_adresse"
            value={data.acheteur_adresse}
            onChange={(e) => onChange({ acheteur_adresse: e.target.value })}
            validate={validateAddress}
          />
        </div>
      </div>

      <SectionTitle>Le bien</SectionTitle>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="bien_adresse">Adresse complète du bien *</Label>
          <ValidatedInput
            id="bien_adresse"
            value={data.bien_adresse}
            onChange={(e) => onChange({ bien_adresse: e.target.value })}
            validate={validateAddress}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="bien_type">Type de bien</Label>
          <Select value={data.bien_type} onValueChange={(v) => onChange({ bien_type: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="appartement">Appartement</SelectItem>
              <SelectItem value="maison">Maison</SelectItem>
              <SelectItem value="terrain">Terrain</SelectItem>
              <SelectItem value="local_commercial">Local commercial</SelectItem>
              <SelectItem value="autre">Autre</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="bien_prix_affiche">Prix affiché par le vendeur (€)</Label>
          <ValidatedInput
            id="bien_prix_affiche"
            type="number"
            value={data.bien_prix_affiche}
            onChange={(e) => onChange({ bien_prix_affiche: e.target.value })}
            validate={validatePrixAffiche}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="bien_prix_propose">Prix proposé (€) *</Label>
          <ValidatedInput
            id="bien_prix_propose"
            type="number"
            value={data.bien_prix_propose}
            onChange={(e) => onChange({ bien_prix_propose: e.target.value })}
            validate={(v) => validatePrice(v, data.bien_prix_affiche)}
          />
          {prixPropose > 0 && (
            <p className="text-xs text-muted-foreground italic">
              Dépôt de garantie indicatif : {depot.toLocaleString("fr-FR")} €
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="delai">Durée de validité (jours)</Label>
          <ValidatedInput
            id="delai"
            type="number"
            value={data.delai_validite_jours}
            onChange={(e) => onChange({ delai_validite_jours: parseInt(e.target.value) || 10 })}
            validate={(v) => validateDelaiValidite(parseInt(v) || 0)}
          />
        </div>
      </div>

      {/* ─── FINANCEMENT ─── */}
      <SectionTitle>Financement</SectionTitle>
      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <Card
          className={cn(
            "cursor-pointer transition-all border-2",
            data.financement === "pret" ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"
          )}
          onClick={() => onChange({ financement: "pret" })}
        >
          <CardContent className="p-4 flex items-start gap-3">
            <CreditCard className="h-6 w-6 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-sm">Achat avec prêt immobilier</p>
              <p className="text-xs text-muted-foreground">Je finance tout ou partie de l'achat par un crédit bancaire</p>
            </div>
          </CardContent>
        </Card>
        <Card
          className={cn(
            "cursor-pointer transition-all border-2",
            data.financement === "comptant" ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"
          )}
          onClick={() => onChange({ financement: "comptant" })}
        >
          <CardContent className="p-4 flex items-start gap-3">
            <Banknote className="h-6 w-6 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-sm">Achat comptant</p>
              <p className="text-xs text-muted-foreground">Je finance l'achat sans recours à un emprunt bancaire</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {data.financement === "pret" && (
        <>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-1">
                Montant total du prêt (€) *
                <Tooltip>
                  <TooltipTrigger asChild><Info className="h-3.5 w-3.5 text-muted-foreground" /></TooltipTrigger>
                  <TooltipContent>Généralement entre 70% et 110% du prix d'achat selon votre apport personnel.</TooltipContent>
                </Tooltip>
              </Label>
              <ValidatedInput
                type="number"
                value={data.clauseValues.valeur_montant_pret || ""}
                onChange={(e) => onChange({ clauseValues: { ...data.clauseValues, valeur_montant_pret: parseFloat(e.target.value) || undefined } })}
                validate={(v) => validateMontantPret(parseFloat(v) || undefined, data.bien_prix_propose)}
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-1">
                Taux d'intérêt maximum accepté (%) *
                <Tooltip>
                  <TooltipTrigger asChild><Info className="h-3.5 w-3.5 text-muted-foreground" /></TooltipTrigger>
                  <TooltipContent>Si le taux obtenu dépasse ce seuil, la condition suspensive s'applique et protège votre dépôt de garantie.</TooltipContent>
                </Tooltip>
              </Label>
              <ValidatedInput
                type="number"
                step="0.01"
                value={data.clauseValues.valeur_taux_max ?? ""}
                onChange={(e) => onChange({ clauseValues: { ...data.clauseValues, valeur_taux_max: parseFloat(e.target.value) || undefined } })}
                validate={(v) => validateTauxMax(parseFloat(v) || undefined)}
              />
            </div>
            <div className="space-y-2">
              <Label>Durée du prêt (mois) *</Label>
              <ValidatedInput
                type="number"
                value={data.clauseValues.valeur_duree_pret ?? ""}
                onChange={(e) => onChange({ clauseValues: { ...data.clauseValues, valeur_duree_pret: parseInt(e.target.value) || undefined } })}
                validate={(v) => validateDureePret(parseInt(v) || undefined)}
              />
              {dureeMois > 0 && (
                <p className="text-xs text-muted-foreground">
                  {dureeMois} mois = {dureeAns} an{dureeAns > 1 ? "s" : ""}{dureeResteM > 0 ? ` et ${dureeResteM} mois` : ""}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-1">
                Établissement bancaire visé
                <Tooltip>
                  <TooltipTrigger asChild><Info className="h-3.5 w-3.5 text-muted-foreground" /></TooltipTrigger>
                  <TooltipContent>Informatif uniquement. La condition suspensive couvre tout établissement bancaire de votre choix.</TooltipContent>
                </Tooltip>
              </Label>
              <ValidatedInput
                value={data.financement_banque}
                onChange={(e) => onChange({ financement_banque: e.target.value })}
                placeholder="Ex : BNP Paribas, Crédit Agricole..."
              />
            </div>
          </div>
          <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800">
            ✓ La condition suspensive d'obtention de prêt sera automatiquement ajoutée à votre offre (Art. L.313-41 Code de la consommation — Loi Scrivener). Elle protège votre dépôt de garantie si le prêt vous est refusé.
          </div>
          <div className="rounded-lg border p-4 text-sm mt-3" style={{ backgroundColor: "#EFF6FF", borderColor: "#BFDBFE" }}>
            <p className="font-medium text-blue-900 mb-1">🏦 Besoin d'un courtier ?</p>
            <p className="text-blue-800 text-xs mb-2">Obtenez le meilleur taux avec Nesto Courtage.</p>
            <a href="https://www.nestocourtage.com" target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-primary hover:underline">
              Découvrir Nesto Courtage →
            </a>
          </div>
        </>
      )}

      {data.financement === "comptant" && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
          ℹ Votre offre ne comportera pas de condition suspensive de financement. Le vendeur peut percevoir cela comme un engagement plus fort de votre part.
        </div>
      )}

      {/* ─── MESSAGE VENDEUR ─── */}
      <SectionTitle>Votre message au vendeur</SectionTitle>
      <p className="text-sm text-muted-foreground mb-3">
        Personnalisez votre offre en vous adressant directement au vendeur. Un message sincère peut faire la différence.
      </p>
      <div className="space-y-2">
        <ValidatedTextarea
          value={data.message_vendeur}
          onChange={(e) => {
            if (e.target.value.length <= 1000) onChange({ message_vendeur: e.target.value });
          }}
          rows={6}
          placeholder={`Madame, Monsieur,\n\nAprès avoir visité votre bien situé au [adresse], nous avons le plaisir de vous soumettre cette offre d'achat...\n\nDécrivez votre projet, votre situation personnelle, pourquoi ce bien vous correspond, votre disponibilité pour la suite...`}
          className="resize-y"
        />
        <div className="flex items-center justify-between">
          <Dialog open={templateDialogOpen} onOpenChange={setTemplateDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="text-xs gap-1">
                <Sparkles className="h-3 w-3" /> Suggestions de formulations →
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Modèles de messages</DialogTitle>
              </DialogHeader>
              {confirmReplace ? (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">Remplacer votre message actuel ?</p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setConfirmReplace(null)}>Annuler</Button>
                    <Button size="sm" onClick={confirmReplaceMessage}>Remplacer</Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {messageTemplates.map((t) => (
                    <Card
                      key={t.label}
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => handleSelectTemplate(t.text)}
                    >
                      <CardContent className="p-4">
                        <p className="font-medium text-sm mb-2">{t.label}</p>
                        <p className="text-xs text-muted-foreground whitespace-pre-line">{t.text}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </DialogContent>
          </Dialog>
          <span className="text-xs text-muted-foreground">{data.message_vendeur.length} / 1000 caractères</span>
        </div>
      </div>

      {/* ─── VENDEUR ─── */}
      <SectionTitle>Vendeur</SectionTitle>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="vendeur_nom">Nom du vendeur *</Label>
          <ValidatedInput
            id="vendeur_nom"
            value={data.vendeur_nom}
            onChange={(e) => onChange({ vendeur_nom: e.target.value })}
            validate={(v) => validateName(v)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="vendeur_email" className="flex items-center gap-1">
            Email du vendeur *
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-3.5 w-3.5 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>Le vendeur recevra un lien sécurisé pour répondre. Il n'a pas besoin de créer un compte.</TooltipContent>
            </Tooltip>
          </Label>
          <ValidatedInput
            id="vendeur_email"
            type="email"
            value={data.vendeur_email}
            onChange={(e) => onChange({ vendeur_email: e.target.value })}
            validate={validateEmail}
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="vendeur_adresse">Adresse postale du vendeur *</Label>
          <ValidatedInput
            id="vendeur_adresse"
            value={data.vendeur_adresse}
            onChange={(e) => onChange({ vendeur_adresse: e.target.value })}
            validate={validateAddress}
          />
        </div>
      </div>

      <SectionTitle>Agent immobilier</SectionTitle>
      <div className="flex items-center gap-2 mb-4">
        <Checkbox
          id="agent_enabled"
          checked={data.agent.enabled}
          onCheckedChange={(checked) => updateAgent({ enabled: !!checked })}
        />
        <Label htmlFor="agent_enabled" className="cursor-pointer text-sm">
          Ce bien m'a été présenté par un agent immobilier
        </Label>
      </div>

      {data.agent.enabled && (
        <div className="grid md:grid-cols-2 gap-4 pl-6 border-l-2 border-primary/20">
          <div className="space-y-2">
            <Label htmlFor="agent_nom">Nom complet de l'agent *</Label>
            <ValidatedInput
              id="agent_nom"
              value={data.agent.nom}
              onChange={(e) => updateAgent({ nom: e.target.value })}
              validate={(v) => validateName(v)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="agent_agence">Nom de l'agence *</Label>
            <ValidatedInput
              id="agent_agence"
              value={data.agent.agence}
              onChange={(e) => updateAgent({ agence: e.target.value })}
              validate={validateAgencyName}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="agent_email">Email de l'agent *</Label>
            <ValidatedInput
              id="agent_email"
              type="email"
              value={data.agent.email}
              onChange={(e) => updateAgent({ email: e.target.value })}
              validate={validateEmail}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="agent_telephone">Téléphone de l'agent</Label>
            <ValidatedInput
              id="agent_telephone"
              value={data.agent.telephone}
              onChange={(e) => updateAgent({ telephone: e.target.value })}
              onBlur={() => handlePhoneBlur("agent")}
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="agent_carte_t" className="flex items-center gap-1">
              Numéro de carte professionnelle / Carte T
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-3.5 w-3.5 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>La carte T est la carte professionnelle obligatoire des agents immobiliers en France (Loi Hoguet).</TooltipContent>
              </Tooltip>
            </Label>
            <ValidatedInput
              id="agent_carte_t"
              value={data.agent.carte_t}
              onChange={(e) => updateAgent({ carte_t: e.target.value })}
              validate={validateCarteT}
            />
          </div>
        </div>
      )}

      <SectionTitle>Notaire (optionnel)</SectionTitle>
      <div className="space-y-2 max-w-md">
        <Label htmlFor="notaire_email" className="flex items-center gap-1">
          Email du notaire
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-3.5 w-3.5 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>Si renseigné, le notaire sera copié automatiquement à l'acceptation de l'offre.</TooltipContent>
          </Tooltip>
        </Label>
        <ValidatedInput
          id="notaire_email"
          type="email"
          value={data.notaire_email}
          onChange={(e) => onChange({ notaire_email: e.target.value })}
          validate={validateOptionalEmail}
        />
      </div>
    </div>
  );
}
