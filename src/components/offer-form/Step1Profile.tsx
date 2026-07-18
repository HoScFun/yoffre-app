"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { OfferFormData } from "@/types/offer";

const profiles = [
  { value: "residence_principale", emoji: "🏠", label: "Résidence principale", desc: "J'achète pour y habiter" },
  { value: "investissement_locatif", emoji: "🏢", label: "Investissement locatif", desc: "J'achète pour louer" },
  { value: "professionnel", emoji: "💼", label: "Professionnel", desc: "Marchand de biens, entreprise foncière" },
];

const professionnelTypes = [
  { value: "marchand_de_biens", label: "Marchand de biens" },
  { value: "fonciere", label: "Entreprise foncière" },
  { value: "autre", label: "Autre structure professionnelle" },
];

interface Step1Props {
  data: OfferFormData;
  onChange: (data: Partial<OfferFormData>) => void;
}

export function Step1Profile({ data, onChange }: Step1Props) {
  return (
    <div>
      <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Étape 1</h2>
      <h3 className="text-xl font-bold text-primary mb-6">Quel est votre profil ?</h3>
      <div className="grid md:grid-cols-3 gap-4">
        {profiles.map((p) => {
          const selected = data.profil_type === p.value;
          return (
            <Card
              key={p.value}
              className={cn(
                "cursor-pointer transition-all hover:shadow-md border-2",
                selected
                  ? "border-primary bg-secondary shadow-md"
                  : "border-transparent"
              )}
              onClick={() => onChange({ profil_type: p.value })}
            >
              <CardContent className="p-6 text-center">
                <span className="text-4xl mb-3 block">{p.emoji}</span>
                <p className="font-semibold text-foreground">{p.label}</p>
                <p className="text-sm text-muted-foreground mt-1">{p.desc}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {data.profil_type === "professionnel" && (
        <div className="mt-6 space-y-4">
          <div className="space-y-2 max-w-sm">
            <Label htmlFor="professionnel_type">Type de structure</Label>
            <Select
              value={data.professionnel_type}
              onValueChange={(v) => onChange({ professionnel_type: v })}
            >
              <SelectTrigger id="professionnel_type">
                <SelectValue placeholder="Sélectionnez votre structure" />
              </SelectTrigger>
              <SelectContent>
                {professionnelTypes.map((t) => (
                  <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-start gap-2 rounded-lg border border-blue-200 bg-blue-50 p-4">
            <Info className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
            <p className="text-xs text-blue-800 leading-relaxed">
              En tant qu'acquéreur professionnel, vous ne bénéficiez pas du délai de rétractation de
              10 jours prévu à l'article L.271-1 du Code de la construction et de l'habitation, réservé
              aux acquéreurs non professionnels. Votre offre acceptée vous engage sans faculté de
              rétractation légale.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
