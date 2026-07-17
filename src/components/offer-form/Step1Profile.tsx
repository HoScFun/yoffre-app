"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { OfferFormData } from "@/types/offer";

const profiles = [
  { value: "residence_principale", emoji: "🏠", label: "Résidence principale", desc: "J'achète pour y habiter" },
  { value: "investissement_locatif", emoji: "🏢", label: "Investissement locatif", desc: "J'achète pour louer" },
  { value: "professionnel", emoji: "💼", label: "Professionnel", desc: "Agence, marchand de biens" },
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
                  ? "border-primary bg-[hsl(213,100%,97%)] shadow-md"
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
    </div>
  );
}
