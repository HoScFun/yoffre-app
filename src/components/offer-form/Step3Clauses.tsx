"use client";

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Lock, ArrowLeft } from "lucide-react";
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
    return c.profils.includes(data.profil_type);
  });

  const toggleClause = (clauseId: number, obligatoire: boolean) => {
    if (obligatoire) return;
    const clause = filteredClauses?.find((c) => c.id === clauseId);
    if (clause && isPret && isPretClause(clause.title)) return;

    const selected = data.selectedClauses.includes(clauseId)
      ? data.selectedClauses.filter((id) => id !== clauseId)
      : [...data.selectedClauses, clauseId];
    onChange({ selectedClauses: selected });
  };

  // Auto-select mandatory clauses + loan clause if pret
  const mandatoryClauses = filteredClauses?.filter((c) => c.obligatoire).map((c) => c.id) || [];
  const pretClauseIds = isPret
    ? (filteredClauses?.filter((c) => isPretClause(c.title)).map((c) => c.id) || [])
    : [];
  const allSelected = [...new Set([...data.selectedClauses, ...mandatoryClauses, ...pretClauseIds])];
  if (allSelected.length !== data.selectedClauses.length) {
    onChange({ selectedClauses: allSelected });
  }

  const showPretFields = filteredClauses?.some(
    (c) => isPretClause(c.title) && data.selectedClauses.includes(c.id)
  );

  const pretLockedFromStep2 = isPret;

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
            const isPretLocked = isPret && isPretClause(clause.title);

            return (
              <Card
                key={clause.id}
                className={cn(
                  "cursor-pointer transition-all",
                  isSelected && "ring-1 ring-primary/30 bg-primary/5",
                  (isMandatory || isPretLocked) && "cursor-default"
                )}
                onClick={() => toggleClause(clause.id, isMandatory || isPretLocked)}
              >
                <CardContent className="p-4 flex items-start gap-3">
                  {isMandatory || isPretLocked ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="mt-0.5">
                          <Checkbox checked disabled className="opacity-70" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        {isPretLocked ? "Ajoutée automatiquement (financement par prêt)" : "Clause obligatoire — ne peut pas être désactivée"}
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    <Checkbox checked={isSelected} className="mt-0.5" />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm">{clause.title}</p>
                      {(isMandatory || isPretLocked) && <Lock className="h-3 w-3 text-muted-foreground" />}
                    </div>
                    {clause.base_legale && (
                      <p className="text-xs text-muted-foreground mt-1">{clause.base_legale}</p>
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
