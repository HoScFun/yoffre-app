import type { Metadata } from "next";
import Link from "next/link";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Send, FileCheck2, Clock3, BellRing, ShieldCheck, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Yoffre pour les agences immobilières — offres d'achat digitalisées",
  description:
    "Envoyez un lien Yoffre à vos acheteurs et recevez des offres d'achat complètes, structurées et horodatées. Fini les PDF à imprimer, signer et scanner. Gratuit pour vos clients.",
  alternates: { canonical: "/agences" },
};

const benefits = [
  {
    icon: Send,
    title: "Un lien plutôt qu'un PDF",
    desc: "Votre acheteur remplit un formulaire guidé en 5 minutes sur son téléphone, au lieu d'imprimer, remplir à la main et scanner un document.",
  },
  {
    icon: FileCheck2,
    title: "Des offres complètes du premier coup",
    desc: "Identité, financement, conditions suspensives avec montant/taux/durée du prêt : les champs obligatoires sont contrôlés, plus d'allers-retours pour données manquantes.",
  },
  {
    icon: Clock3,
    title: "Réponse vendeur en un clic",
    desc: "Le vendeur reçoit un lien sécurisé, consulte le PDF et accepte ou refuse. La réponse est horodatée — utile en cas d'offres multiples.",
  },
  {
    icon: BellRing,
    title: "Vous restez dans la boucle",
    desc: "L'agent renseigné dans l'offre reçoit automatiquement une copie de l'offre et de la réponse du vendeur.",
  },
  {
    icon: ShieldCheck,
    title: "Un cadre juridique propre",
    desc: "Clauses pré-rédigées avec leurs bases légales (loi Scrivener, Code civil, Code de l'urbanisme). L'écrit électronique a valeur probante (art. 1366 C. civ.).",
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
            <Link href="/nouvelle-offre">
              <Button size="lg" className="font-semibold">Tester avec une offre</Button>
            </Link>
            <a href="mailto:contact@yoffre.fr?subject=Yoffre%20pour%20mon%20agence">
              <Button size="lg" variant="outline" className="font-semibold">
                <Mail className="h-4 w-4 mr-2" /> Parler à l&apos;équipe
              </Button>
            </a>
          </div>
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
            <li><strong className="text-foreground">Partagez le lien</strong> yoffre.fr/nouvelle-offre à votre acheteur (email, SMS, WhatsApp).</li>
            <li><strong className="text-foreground">L&apos;acheteur remplit</strong> le formulaire guidé et renseigne votre agence — vous recevez copie de l&apos;offre.</li>
            <li><strong className="text-foreground">Le vendeur répond</strong> via son lien sécurisé ; acceptation ou refus horodaté, tout le monde est notifié.</li>
          </ol>
          <p className="text-sm text-muted-foreground mb-8">
            C&apos;est gratuit pour vos clients, sans engagement pour vous. Des fonctionnalités
            dédiées aux agences (espace multi-offres, marque blanche) arrivent : dites-nous ce
            dont vous avez besoin.
          </p>
          <a href="mailto:contact@yoffre.fr?subject=Yoffre%20pour%20mon%20agence">
            <Button size="lg" className="font-semibold">Contacter l&apos;équipe Yoffre</Button>
          </a>
        </div>
      </section>
    </Layout>
  );
}
