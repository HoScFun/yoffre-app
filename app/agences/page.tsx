import type { Metadata } from "next";
import Link from "next/link";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileCheck2, Clock3, ShieldCheck, Building2, Check, HeartHandshake, Timer } from "lucide-react";

export const metadata: Metadata = {
  title: "Yoffre pour les agences immobilières — offres d'achat digitalisées",
  description:
    "Envoyez un lien Yoffre à vos acheteurs et recevez des offres d'achat complètes, structurées et horodatées dans un espace unique. Offre de lancement : 9 € HT/mois. Gratuit pour vos clients.",
  alternates: { canonical: "/agences" },
};

const benefits = [
  {
    icon: Timer,
    title: "Gagnez du temps sur chaque offre",
    desc: "Un lien plutôt qu'un PDF à imprimer, signer et scanner : votre acheteur remplit un formulaire guidé en quelques minutes sur son téléphone, et vous recevez l'offre sans ressaisie ni relance.",
  },
  {
    icon: FileCheck2,
    title: "Des offres complètes du premier coup",
    desc: "Identité, financement, conditions suspensives avec montant/taux/durée du prêt : les champs obligatoires sont contrôlés, plus d'allers-retours pour données manquantes.",
  },
  {
    icon: Clock3,
    title: "Réponse vendeur en un clic",
    desc: "Le vendeur reçoit un lien sécurisé, consulte le PDF et accepte ou refuse. La réponse est horodatée — utile en cas d'offres multiples — et l'agent renseigné reçoit copie de tout.",
  },
  {
    icon: ShieldCheck,
    title: "Conformité juridique",
    desc: "Clauses pré-rédigées avec leurs bases légales (loi Scrivener, Code civil, Code de l'urbanisme), rappels réglementaires intégrés, horodatage : l'écrit électronique a valeur probante (art. 1366 C. civ.).",
  },
  {
    icon: HeartHandshake,
    title: "Un meilleur parcours pour vos acquéreurs",
    desc: "Un parcours moderne, guidé et rassurant qui explique chaque clause à vos clients : ils comprennent ce qu'ils signent, et c'est votre agence qui en récolte la crédibilité.",
  },
  {
    icon: Building2,
    title: "Uniformisez les pratiques de vos équipes",
    desc: "Tous vos négociateurs — et toutes les agences d'un groupe ou d'un réseau — travaillent sur la même trame d'offre. Une prise d'offres homogène et professionnelle.",
  },
];

export default function AgencesPage() {
  return (
    <Layout>
      <section className="py-20">
        <div className="container max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-primary leading-tight mb-6">
            Digitalisez la prise d&apos;offres de votre agence
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Envoyez un lien Yoffre à vos acheteurs. Vous recevez des offres d&apos;achat
            structurées, complètes et horodatées — sans papier, sans scanner, sans ressaisie.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="mailto:contact@yoffre.fr?subject=Tester%20Yoffre%20dans%20mon%20agence">
              <Button size="lg" className="font-semibold">Tester Yoffre dans mon agence</Button>
            </a>
            <Link href="/nouvelle-offre">
              <Button size="lg" variant="outline" className="font-semibold">
                Voir le parcours acheteur
              </Button>
            </Link>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Gratuit pour vos acheteurs et vos vendeurs. Sans engagement pour votre agence.
          </p>
        </div>
      </section>

      <section className="py-16 bg-secondary/50">
        <div className="container max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-primary mb-12">
            Pourquoi les agences utilisent Yoffre
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((b) => (
              <Card key={b.title} className="border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-accent/10">
                    <b.icon className="h-5 w-5 text-accent" />
                  </div>
                  <h3 className="text-sm font-semibold text-foreground mb-2">{b.title}</h3>
                  <p className="text-sm text-muted-foreground">{b.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-primary mb-4">Comment ça marche pour votre agence ?</h2>
          <ol className="text-left max-w-xl mx-auto space-y-4 text-sm text-muted-foreground mb-10 list-decimal pl-6">
            <li><strong className="text-foreground">Créez votre espace agence</strong> : votre organisation, votre lien personnalisé, votre logo, vos agents invités.</li>
            <li><strong className="text-foreground">Partagez votre lien</strong> à vos acheteurs (email, SMS, WhatsApp) : ils remplissent le formulaire guidé en renseignant votre agence.</li>
            <li><strong className="text-foreground">Recevez et suivez les offres</strong> dans votre tableau de bord : statuts (envoyée, acceptée, refusée, expirée), historique horodaté, notifications — et transmission au notaire choisi par le client.</li>
          </ol>
          <p className="text-sm text-muted-foreground mb-8">
            Toutes les offres de l&apos;agence sont centralisées et traçables, sans ressaisie ni
            classeur de PDF : une prise d&apos;offres homogène pour tous vos négociateurs, et une
            vue claire de chaque bien et chaque acheteur — comme dans un CRM.
          </p>
        </div>
      </section>

      {/* Tarif */}
      <section className="py-16 bg-secondary/50">
        <div className="container max-w-lg mx-auto">
          <h2 className="text-2xl font-bold text-center text-primary mb-8">Un tarif simple</h2>
          <Card className="border-2 border-primary shadow-lg">
            <CardContent className="p-8 text-center">
              <p className="text-xs font-semibold uppercase tracking-wider text-accent mb-2">Offre de lancement</p>
              <h3 className="text-lg font-bold text-foreground mb-1">Yoffre Agence</h3>
              <p className="mb-1">
                <span className="text-4xl font-extrabold text-primary">9 €</span>
                <span className="text-sm text-muted-foreground"> HT / mois</span>
              </p>
              <p className="text-xs text-muted-foreground mb-6">
                Prix public à terme : 19 € HT / mois. Sans engagement. Gratuit pour vos acheteurs et vendeurs.
              </p>
              <ul className="text-left text-sm text-muted-foreground space-y-2 mb-8 max-w-xs mx-auto">
                {[
                  "Lien de prise d'offres personnalisé (logo, agence)",
                  "Offres complètes, structurées et horodatées",
                  "Tableau de bord : statuts, historique, métriques",
                  "Agents illimités dans votre espace",
                  "Copies automatiques à l'agent et au notaire désigné",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-accent mt-0.5 shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <a href="mailto:contact@yoffre.fr?subject=Tester%20Yoffre%20dans%20mon%20agence">
                <Button size="lg" className="w-full font-semibold">Tester Yoffre dans mon agence</Button>
              </a>
              <p className="mt-3 text-xs text-muted-foreground">
                Vous dirigez un réseau ou un groupe ? Lancez une agence pilote :{" "}
                <a href="mailto:contact@yoffre.fr?subject=Agence%20pilote%20r%C3%A9seau" className="underline text-primary">
                  parlez-nous de votre organisation
                </a>.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </Layout>
  );
}
