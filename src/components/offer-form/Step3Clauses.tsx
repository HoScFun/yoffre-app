"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ShieldCheck, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { OfferFormData } from "@/types/offer";

interface Step3Props {
  data: OfferFormData;
  onChange: (data: Partial<OfferFormData>) => void;
  onGoToStep?: (step: number) => void;
}

export function Step3Clauses({ data, onChange, onGoToStep }: Step3Props) {
  const { data: clauses, isLoading } = useQuery({
    queryKey: ["clauses", data.profil_type],
    queryFn: async () => {
      const { data: result, error } = await supabase
        .from("clauses")
        .select("*")
        .order("ordre", { ascending: true });
      if (error) throw error;
      return result;
    },
  });

  const isPretClause = (title: string) =>
    title.toLowerCase().includes("prêt") || title.toLowerCase().includes("pret");

  const isComptant = data.financement === "comptant";
  const isPret = data.financement === "pret";

  // Filter: active only, match profile, ignore tier (all unlocked)
  const filteredClauses = clauses?.filter((c) => {
    if ((c as any).active === false) return false;
    if (isComptant && isPretClause(c.title)) return false;
    if (!c.profils || c.profils.length === 0) return true;
    return c.profils.includes("tous") || c.profils.includes(data.profil_type);
  });

  // Toutes les clauses sont décochables : retirer une clause auto-proposée (obligatoire ou prêt)
  // la mémorise dans removedClauses pour qu'elle ne soit pas re-cochée automatiquement.
  const toggleClause = (clauseId: number, autoProposed: boolean) => {
    const isSelected = data.selectedClauses.includes(clauseId);
    const selected = isSelected
      ? data.selectedClauses.filter((id) => id !== clauseId)
      : [...data.selectedClauses, clauseId];
    const removed = isSelected
      ? (autoProposed ? [...new Set([...data.removedClauses, clauseId])] : data.removedClauses)
      : data.removedClauses.filter((id) => id !== clauseId);
    onChange({ selectedClauses: selected, removedClauses: removed });
  };

  // Auto-select mandatory clauses + loan clause if pret (en effet, pas pendant le rendu),
  // sauf celles que l'utilisateur a explicitement retirées.
  const mandatoryClauses = filteredClauses?.filter((c) => c.obligatoire).map((c) => c.id) || [];
  const pretClauseIds = isPret
    ? (filteredClauses?.filter((c) => isPretClause(c.title)).map((c) => c.id) || [])
    : [];
  const removedClauses = data.removedClauses || [];
  const autoIds = [...mandatoryClauses, ...pretClauseIds].filter((id) => !removedClauses.includes(id));
  const allSelected = [...new Set([...data.selectedClauses, ...autoIds])];
  useEffect(() => {
    if (allSelected.length !== data.selectedClauses.length) {
      onChange({ selectedClauses: allSelected });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allSelected.length, data.selectedClauses.length]);

  const showPretFields = filteredClauses?.some(
    (c) => isPretClause(c.title) && data.selectedClauses.includes(c.id)
  );

  const pretLockedFromStep2 = isPret;

  const NOTE_MAX = 500;
  const setClauseNote = (clauseId: number, note: string) => {
    if (note.length > NOTE_MAX) return;
    const notes = { ...data.clauseNotes };
    if (note.trim().length === 0) delete notes[clauseId];
    else notes[clauseId] = note;
    onChange({ clauseNotes: notes });
  };

  // Le texte des clauses porte déjà les unités (« [MONTANT] € », « [TAUX]% », « [DUREE] mois ») :
  // on substitue les valeurs nues pour éviter les doublons.
  const clauseDescription = (clause: { description: string }) => {
    let desc = clause.description || "";
    if (data.clauseValues.valeur_montant_pret)
      desc = desc.replace("[MONTANT]", data.clauseValues.valeur_montant_pret.toLocaleString("fr-FR"));
    if (data.clauseValues.valeur_taux_max) desc = desc.replace("[TAUX]", String(data.clauseValues.valeur_taux_max));
    if (data.clauseValues.valeur_duree_pret) desc = desc.replace("[DUREE]", String(data.clauseValues.valeur_duree_pret));
    return desc;
  };

  return (
    <div>
      <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Étape 3</h2>
      <h3 className="text-xl font-bold text-primary mb-1">Sélectionnez vos conditions suspensives</h3>
      <p className="text-sm text-muted-foreground mb-6">Ces clauses protègent votre dépôt de garantie.</p>

      {isLoading ? (
        <p className="text-muted-foreground">Chargement des clauses...</p>
      ) : (
        <div className="space-y-3">
          {filteredClauses?.map((clause) => {
            const isSelected = data.selectedClauses.includes(clause.id);
            const isMandatory = clause.obligatoire === true;
            const isPretAuto = isPret && isPretClause(clause.title);
            const isAutoProposed = isMandatory || isPretAuto;

            return (
              <Card
                key={clause.id}
                className={cn(
                  "cursor-pointer transition-all",
                  isSelected && "ring-1 ring-primary/30 bg-primary/5"
                )}
                onClick={() => toggleClause(clause.id, isAutoProposed)}
              >
                <CardContent className="p-4 flex items-start gap-3">
                  <Checkbox checked={isSelected} className="mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm">{clause.title}</p>
                      {isAutoProposed && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-semibold text-accent">
                              <ShieldCheck className="h-3 w-3" /> Recommandée
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            {isPretAuto
                              ? "Ajoutée automatiquement car vous financez par un prêt. Vous pouvez la retirer, à vos risques."
                              : "Clause fortement recommandée. Vous pouvez la retirer, à vos risques."}
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                    {isAutoProposed && !isSelected && (
                      <p className="mt-2 rounded-md border border-amber-200 bg-amber-50 p-2.5 text-xs text-amber-900 leading-relaxed">
                        {isPretAuto
                          ? "⚠️ Sans cette clause, votre dépôt de garantie n'est plus protégé en cas de refus de prêt (loi Scrivener, art. L.313-41 C. conso). Ne la retirez que si votre financement est absolument certain."
                          : "⚠️ Cette clause protège vos intérêts fondamentaux. La retirer rend votre offre plus engageante pour le vendeur, mais vous expose à un risque juridique réel."}
                      </p>
                    )}
                    {clause.base_legale && (
                      <p className="text-xs text-muted-foreground mt-1">{clause.base_legale}</p>
                    )}
                    {isSelected && (
                      <div className="mt-3 space-y-2" onClick={(e) => e.stopPropagation()}>
                        <p className="text-xs text-muted-foreground leading-relaxed rounded-md bg-muted/50 p-2.5">
                          {clauseDescription(clause)}
                        </p>
                        <div className="space-y-1">
                          <Label htmlFor={`clause_note_${clause.id}`} className="text-xs text-muted-foreground">
                            Précision à ajouter à cette clause (optionnel)
                          </Label>
                          <textarea
                            id={`clause_note_${clause.id}`}
                            value={data.clauseNotes[clause.id] || ""}
                            onChange={(e) => setClauseNote(clause.id, e.target.value)}
                            rows={2}
                            placeholder="Ex : sous réserve de la levée de l'hypothèque avant le 30 septembre…"
                            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-xs ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-y"
                          />
                          {(data.clauseNotes[clause.id] || "").length > 0 && (
                            <p className="text-[10px] text-muted-foreground text-right">
                              {(data.clauseNotes[clause.id] || "").length} / {NOTE_MAX}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {showPretFields && (
        <div className="mt-6 p-4 rounded-lg border bg-secondary/30">
          <h4 className="text-sm font-semibold mb-3">Détails du prêt immobilier</h4>
          {pretLockedFromStep2 ? (
            <div className="space-y-3">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Montant du prêt</Label>
                  <p className="text-sm font-medium">{(data.clauseValues.valeur_montant_pret || 0).toLocaleString("fr-FR")} €</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Taux maximum</Label>
                  <p className="text-sm font-medium">{data.clauseValues.valeur_taux_max || 0} %</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Durée</Label>
                  <p className="text-sm font-medium">{data.clauseValues.valeur_duree_pret || 0} mois</p>
                </div>
              </div>
              {onGoToStep && (
                <button
                  type="button"
                  onClick={() => onGoToStep(2)}
                  className="text-xs text-primary hover:underline inline-flex items-center gap-1 mt-1"
                >
                  <ArrowLeft className="h-3 w-3" /> Modifier → retour étape 2
                </button>
              )}
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Montant du prêt (€)</Label>
                <Input
                  type="number"
                  value={data.clauseValues.valeur_montant_pret || ""}
                  onChange={(e) =>
                    onChange({
                      clauseValues: { ...data.clauseValues, valeur_montant_pret: parseFloat(e.target.value) || undefined },
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Taux maximum (%)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={data.clauseValues.valeur_taux_max || ""}
                  onChange={(e) =>
                    onChange({
                      clauseValues: { ...data.clauseValues, valeur_taux_max: parseFloat(e.target.value) || undefined },
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Durée (mois)</Label>
                <Input
                  type="number"
                  value={data.clauseValues.valeur_duree_pret || ""}
                  onChange={(e) =>
                    onChange({
                      clauseValues: { ...data.clauseValues, valeur_duree_pret: parseInt(e.target.value) || undefined },
                    })
                  }
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
