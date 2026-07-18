"use client";

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { OfferFormData, fullName, professionnelTypeLabels, situationLabels, civiliteLabels } from "@/types/offer";
import { numberToFrenchWords } from "@/lib/pdf";
import { Mail, FileText, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step4Props {
  data: OfferFormData;
  onChange: (data: Partial<OfferFormData>) => void;
}

const bienTypeLabels: Record<string, string> = {
  appartement: "Appartement",
  maison: "Maison",
  terrain: "Terrain",
  local_commercial: "Local commercial",
  autre: "Autre",
};

export function Step4Review({ data, onChange }: Step4Props) {
  const { data: clauses } = useQuery({
    queryKey: ["clauses"],
    queryFn: async () => {
      const { data, error } = await supabase.from("clauses").select("*");
      if (error) throw error;
      return data;
    },
  });

  const selectedClauseDetails = clauses?.filter((c) => data.selectedClauses.includes(c.id)) || [];
  const prix = Number(data.bien_prix_propose);
  const depot = Math.round(prix * 0.1);
  const expirationDate = new Date(Date.now() + data.delai_validite_jours * 24 * 60 * 60 * 1000);

  return (
    <div>
      <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Étape 4</h2>
      <h3 className="text-xl font-bold text-primary mb-6">Vérification & Envoi</h3>

      <div className="space-y-5 text-sm">
        {/* ACHETEUR */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Acheteur</h4>
          <div className="grid md:grid-cols-2 gap-1.5">
            <p>
              <span className="text-muted-foreground">Nom :</span>{" "}
              {[civiliteLabels[data.acheteur_civilite], fullName(data.acheteur_prenom, data.acheteur_nom)].filter(Boolean).join(" ")}
            </p>
            {data.profil_type === "professionnel" && data.acheteur_denomination && (
              <p>
                <span className="text-muted-foreground">Structure :</span> {data.acheteur_denomination}
                {data.acheteur_siren && <span className="text-muted-foreground text-xs ml-1">(SIREN {data.acheteur_siren})</span>}
              </p>
            )}
            <p><span className="text-muted-foreground">Email :</span> {data.acheteur_email}</p>
            <p><span className="text-muted-foreground">Tél :</span> {data.acheteur_telephone}</p>
            <p><span className="text-muted-foreground">Adresse :</span> {data.acheteur_adresse}</p>
            {data.profil_type === "professionnel" && data.professionnel_type && (
              <p><span className="text-muted-foreground">Qualité :</span> {professionnelTypeLabels[data.professionnel_type] || data.professionnel_type}</p>
            )}
            {data.acheteur_situation && (
              <p><span className="text-muted-foreground">Situation :</span> {situationLabels[data.acheteur_situation] || data.acheteur_situation}</p>
            )}
            {fullName(data.conjoint_prenom, data.conjoint_nom) && (
              <p><span className="text-muted-foreground">Co-acquéreur :</span> {fullName(data.conjoint_prenom, data.conjoint_nom)}</p>
            )}
          </div>
        </div>
        <Separator />

        {/* BIEN */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Bien immobilier</h4>
          <div className="space-y-1.5">
            <p><span className="text-muted-foreground">Adresse :</span> {data.bien_adresse}</p>
            <p><span className="text-muted-foreground">Type :</span> {bienTypeLabels[data.bien_type] || data.bien_type}</p>
            <p>
              <span className="text-muted-foreground">Prix proposé :</span>{" "}
              <strong>{prix.toLocaleString("fr-FR")} €</strong>
              <span className="text-muted-foreground italic ml-1">— {numberToFrenchWords(Math.round(prix))} euros</span>
            </p>
            <p><span className="text-muted-foreground">Dépôt de garantie indicatif (10%) :</span> {depot.toLocaleString("fr-FR")} €</p>
          </div>
        </div>
        <Separator />

        {/* FINANCEMENT */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Financement</h4>
          {data.financement === "pret" ? (
            <div className="space-y-1.5">
              <p><span className="text-muted-foreground">Mode :</span> Prêt immobilier</p>
              <p><span className="text-muted-foreground">Montant :</span> {(data.clauseValues.valeur_montant_pret || 0).toLocaleString("fr-FR")} €</p>
              <p><span className="text-muted-foreground">Taux max :</span> {data.clauseValues.valeur_taux_max || 0} %</p>
              <p><span className="text-muted-foreground">Durée :</span> {data.clauseValues.valeur_duree_pret || 0} mois</p>
              {data.financement_banque && (
                <p><span className="text-muted-foreground">Banque :</span> {data.financement_banque}</p>
              )}
            </div>
          ) : data.financement === "comptant" ? (
            <p><span className="text-muted-foreground">Mode :</span> Achat comptant — Sans recours à un emprunt immobilier</p>
          ) : (
            <p className="text-muted-foreground italic">Non renseigné</p>
          )}
        </div>
        <Separator />

        {/* MESSAGE VENDEUR */}
        {data.message_vendeur && data.message_vendeur.trim().length > 0 && (
          <>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Message au vendeur</h4>
              <div className="rounded-lg bg-muted/50 p-3 text-sm italic whitespace-pre-line">
                {data.message_vendeur}
              </div>
            </div>
            <Separator />
          </>
        )}

        {/* VENDEUR */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Vendeur</h4>
          <p>
            <span className="text-muted-foreground">Nom :</span>{" "}
            {[civiliteLabels[data.vendeur_civilite], fullName(data.vendeur_prenom, data.vendeur_nom)].filter(Boolean).join(" ")}
          </p>
          <p><span className="text-muted-foreground">Email :</span> {data.vendeur_email}</p>
          <p><span className="text-muted-foreground">Adresse :</span> {data.vendeur_adresse}</p>
        </div>
        <Separator />

        {/* AGENT */}
        {data.agent.enabled && (
          <>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Agent immobilier</h4>
              <div className="grid md:grid-cols-2 gap-1.5">
                <p><span className="text-muted-foreground">Nom :</span> {data.agent.nom}</p>
                <p><span className="text-muted-foreground">Agence :</span> {data.agent.agence}</p>
                <p><span className="text-muted-foreground">Email :</span> {data.agent.email}</p>
                {data.agent.carte_t && <p><span className="text-muted-foreground">Carte T :</span> {data.agent.carte_t}</p>}
              </div>
            </div>
            <Separator />
          </>
        )}

        {/* NOTAIRE */}
        {data.notaire_email && (
          <>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Notaire</h4>
              <p><span className="text-muted-foreground">Email :</span> {data.notaire_email}</p>
            </div>
            <Separator />
          </>
        )}

        {/* CLAUSES */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
            Conditions suspensives ({selectedClauseDetails.length})
          </h4>
          <ol className="list-decimal pl-5 space-y-2">
            {selectedClauseDetails.map((c) => (
              <li key={c.id}>
                <span className="font-medium">{c.title}</span>
                {c.base_legale && (
                  <span className="text-muted-foreground italic text-xs ml-2">({c.base_legale})</span>
                )}
                {data.clauseNotes[c.id] && (
                  <p className="text-xs text-muted-foreground italic mt-0.5">
                    Précision : {data.clauseNotes[c.id]}
                  </p>
                )}
              </li>
            ))}
          </ol>
        </div>
        <Separator />

        {/* VALIDITÉ */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Validité</h4>
          <p>
            Cette offre est valable <strong>{data.delai_validite_jours} jours</strong> à compter de son envoi,
            soit jusqu'au <strong>{expirationDate.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</strong>.
          </p>
          {data.date_signature_souhaitee && (
            <p className="mt-1">
              <span className="text-muted-foreground">Signature de l'acte souhaitée au plus tard le :</span>{" "}
              <strong>{new Date(data.date_signature_souhaitee).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</strong>
            </p>
          )}
        </div>
        <Separator />

        {/* OPTIONS D'ENVOI */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Options d'envoi</h4>
          <div className="grid md:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => onChange({ envoyer_au_vendeur: true })}
              className={cn(
                "flex flex-col items-start gap-2 rounded-lg border-2 p-4 text-left transition-all",
                data.envoyer_au_vendeur
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-border hover:border-muted-foreground/30"
              )}
            >
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" />
                <span className="font-semibold text-sm">📨 Envoyer au vendeur maintenant</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                L'offre sera transmise directement à {data.vendeur_email || "le vendeur"} par email. Vous recevrez une copie.
              </p>
            </button>

            <button
              type="button"
              onClick={() => onChange({ envoyer_au_vendeur: false })}
              className={cn(
                "flex flex-col items-start gap-2 rounded-lg border-2 p-4 text-left transition-all",
                !data.envoyer_au_vendeur
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-border hover:border-muted-foreground/30"
              )}
            >
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <span className="font-semibold text-sm">📄 Recevoir le PDF uniquement</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Vous recevez votre offre par email. Vous l'envoyez vous-même au vendeur.
              </p>
            </button>
          </div>

          {!data.envoyer_au_vendeur && (
            <div className="mt-3 flex items-start gap-2 rounded-lg bg-blue-50 border border-blue-200 p-3">
              <Info className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
              <p className="text-xs text-blue-800 leading-relaxed">
                Votre offre sera prête à envoyer. Vous pourrez toujours la transmettre au vendeur depuis votre espace ou en la joignant à un email.
              </p>
            </div>
          )}
        </div>
        <Separator />

        {/* DISCLAIMER */}
        <div className="flex items-start gap-3 p-4 rounded-lg border border-primary/30 bg-primary/5">
          <Checkbox
            id="disclaimer"
            checked={data.disclaimer_accepted}
            onCheckedChange={(checked) => onChange({ disclaimer_accepted: !!checked })}
          />
          <Label htmlFor="disclaimer" className="text-xs leading-relaxed cursor-pointer">
            Je comprends que cette offre, si elle est acceptée par le vendeur, m'engage juridiquement.
            Je confirme l'exactitude des informations renseignées. Yoffre met à disposition un outil de
            rédaction et ne fournit pas de conseil juridique individualisé.
          </Label>
        </div>
      </div>
    </div>
  );
}
