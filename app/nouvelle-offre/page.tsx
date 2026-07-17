import type { Metadata } from "next";
import NewOfferView from "@/views/NewOffer";

export const metadata: Metadata = {
  title: "Créer une offre d'achat immobilier gratuite",
  description:
    "Formulaire guidé en 4 étapes : profil, informations du bien et des parties, conditions suspensives, relecture. PDF professionnel et envoi au vendeur inclus, gratuitement.",
  alternates: { canonical: "/nouvelle-offre" },
};

export default function NewOfferPage() {
  return <NewOfferView />;
}
