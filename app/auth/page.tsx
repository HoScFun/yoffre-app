import type { Metadata } from "next";
import AuthView from "@/views/Auth";

export const metadata: Metadata = {
  title: "Connexion / Inscription",
  description: "Connectez-vous à votre espace Yoffre pour suivre vos offres d'achat immobilier.",
  robots: { index: false },
};

export default function AuthPage() {
  return <AuthView />;
}
