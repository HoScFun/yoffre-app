import type { Metadata } from "next";
import Link from "next/link";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Shield, FileText, Send, UserCheck, ClipboardList, Scale, ArrowRight,
  Building2, CheckCircle2, Clock, Sparkles,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Offre d'achat immobilier en ligne, gratuite — Yoffre",
  description:
    "Rédigez gratuitement votre offre d'achat immobilier en 5 minutes : conditions suspensives à cocher (prêt, préemption, diagnostics…), PDF professionnel, envoi au vendeur, à l'agence ou au notaire, réponse horodatée.",
  alternates: { canonical: "/" },
};

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://yoffre.fr";

const faq = [
  {
    q: "Une offre d'achat rédigée avec Yoffre a-t-elle une valeur juridique ?",
    a: "Oui. Depuis la loi du 13 mars 2000 (art. 1366 du Code civil), un écrit électronique a la même valeur juridique qu'un écrit papier. Une offre d'achat transmise par email et acceptée par le vendeur forme un accord sur la chose et le prix (art. 1113 du Code civil). Yoffre horodate l'envoi et la réponse du vendeur.",
  },
  {
    q: "Yoffre est-il vraiment gratuit ?",
    a: "Oui, la création, la génération du PDF et l'envoi de votre offre d'achat sont 100 % gratuits, sans limite. Yoffre se rémunère en proposant, uniquement si vous le demandez, une mise en relation avec des partenaires (courtiers en crédit, diagnostiqueurs…).",
  },
  {
    q: "Quelles conditions suspensives inclure dans une offre d'achat ?",
    a: "La plus importante est la condition suspensive d'obtention de prêt (obligatoire dès que vous financez à crédit, loi Scrivener, art. L.313-41 du Code de la consommation) : elle doit préciser le montant, le taux maximal et la durée du prêt. S'y ajoutent selon les cas : droit de préemption urbain, vente préalable de votre bien, absence de servitudes, obtention d'un permis de construire. Yoffre vous guide clause par clause.",
  },
  {
    q: "L'offre d'achat m'engage-t-elle définitivement ?",
    a: "Si le vendeur accepte votre offre au prix, un accord est en principe formé. Mais l'acquéreur non professionnel bénéficie ensuite d'un délai de rétractation de 10 jours après la signature de l'avant-contrat (art. L.271-1 du Code de la construction), et vos conditions suspensives vous protègent si elles ne se réalisent pas.",
  },
  {
    q: "Puis-je utiliser Yoffre si je passe par une agence immobilière ?",
    a: "Oui. Vous pouvez indiquer l'agent immobilier dans votre offre : il reçoit automatiquement une copie. Les agences peuvent aussi envoyer un lien Yoffre à leurs clients acheteurs pour recevoir des offres structurées, au lieu de PDF à imprimer et scanner.",
  },
  {
    q: "Le vendeur doit-il créer un compte pour répondre ?",
    a: "Non. Le vendeur reçoit un lien personnel sécurisé par email, consulte l'offre en PDF et répond en un clic. Sa réponse est horodatée et toutes les parties (acheteur, agence, notaire) sont notifiées.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "Yoffre",
      url: SITE_URL,
      email: "contact@yoffre.fr",
      description:
        "Service en ligne gratuit de rédaction et d'envoi d'offres d'achat immobilier en France.",
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "Yoffre",
      inLanguage: "fr-FR",
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
    {
      "@type": "WebApplication",
      name: "Yoffre — Générateur d'offre d'achat immobilier",
      url: `${SITE_URL}/nouvelle-offre`,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
      inLanguage: "fr-FR",
    },
    {
      "@type": "FAQPage",
      mainEntity: faq.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ],
};

const features = [
  {
    icon: Shield,
    title: "Conditions suspensives guidées",
    desc: "Prêt, préemption, servitudes, permis de construire : cochez les clauses protectrices adaptées à votre situation, rédigées avec leurs références légales. Ajoutez les vôtres librement.",
  },
  {
    icon: FileText,
    title: "PDF professionnel horodaté",
    desc: "Document structuré, montant en toutes lettres, références juridiques : prêt à envoyer au vendeur, à l'agence et au notaire.",
  },
  {
    icon: Send,
    title: "Envoi direct et réponse trackée",
    desc: "Le vendeur reçoit un lien sécurisé, sans créer de compte. Il accepte ou refuse en un clic ; la réponse est horodatée et tout le monde est notifié.",
  },
];

const steps = [
  { icon: UserCheck, num: "1", title: "Votre profil", desc: "Résidence principale, investissement locatif ou professionnel : les clauses s'adaptent." },
  { icon: ClipboardList, num: "2", title: "Les informations", desc: "Acheteur, bien, prix, financement, vendeur, agence, notaire. Tout est guidé." },
  { icon: Scale, num: "3", title: "Les conditions suspensives", desc: "Clauses pré-rédigées fondées sur le Code civil et le Code de la consommation." },
  { icon: ArrowRight, num: "4", title: "Envoi et suivi", desc: "PDF envoyé par email, lien de réponse sécurisé pour le vendeur, notifications." },
];

export default function HomePage() {
  return (
    <Layout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="py-20 md:py-28">
        <div className="container text-center max-w-3xl mx-auto">
          <p className="inline-flex items-center gap-2 rounded-full border bg-secondary/60 px-4 py-1.5 text-xs font-semibold text-primary mb-6">
            <Sparkles className="h-3.5 w-3.5" /> 100 % gratuit, sans compte obligatoire
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-primary leading-tight mb-6">
            Votre offre d&apos;achat immobilier, rédigée dans les règles en 3 minutes
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed">
            Formulaire guidé, conditions suspensives à cocher, PDF professionnel envoyé au
            vendeur, à l&apos;agence ou à votre notaire — avec réponse horodatée.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/nouvelle-offre">
              <Button size="lg" className="text-base px-8 py-6 h-auto font-semibold">
                Créer mon offre en 3 minutes
              </Button>
            </Link>
            <Link href="/guide-offre-achat">
              <Button size="lg" variant="outline" className="text-base px-8 py-6 h-auto font-semibold">
                Comprendre l&apos;offre d&apos;achat
              </Button>
            </Link>
          </div>
          <p className="mt-6 text-xs text-muted-foreground flex items-center justify-center gap-4 flex-wrap">
            <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> Parcours guidé, aucune expertise requise</span>
            <span className="inline-flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5" /> Références légales incluses</span>
            <span className="inline-flex items-center gap-1"><Shield className="h-3.5 w-3.5" /> Rien n&apos;est envoyé sans votre validation</span>
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-secondary/50">
        <div className="container max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-primary mb-12">
            Une offre d&apos;achat mieux rédigée, c&apos;est une offre plus crédible
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((item) => (
              <Card key={item.title} className="border-0 shadow-md">
                <CardContent className="p-6 text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
                    <item.icon className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="text-sm font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Steps */}
      <section id="etapes" className="py-16">
        <div className="container max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-primary mb-2">
            Comment ça marche ?
          </h2>
          <p className="text-center text-muted-foreground mb-12">
            4 étapes guidées, environ 3 minutes. Vous prévisualisez le PDF et rien n&apos;est envoyé sans votre validation.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step) => (
              <div key={step.num} className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-secondary">
                  <step.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="text-xs font-bold text-muted-foreground mb-1">ÉTAPE {step.num}</div>
                <h3 className="font-semibold text-foreground mb-2 text-sm">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/nouvelle-offre">
              <Button size="lg" className="font-semibold">Préparer une offre claire et complète</Button>
            </Link>
            <p className="mt-3 text-xs text-muted-foreground">
              Les biens attractifs reçoivent souvent plusieurs offres : une offre complète, transmise vite, fait la différence.
            </p>
          </div>
        </div>
      </section>

      {/* Agences */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container max-w-4xl mx-auto text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
            <Building2 className="h-6 w-6" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Vous êtes une agence immobilière ?</h2>
          <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Fini les offres PDF à imprimer, signer et scanner. Envoyez un lien Yoffre à vos
            acheteurs : vous recevez des offres complètes, structurées et horodatées, et votre
            vendeur répond en un clic.
          </p>
          <Link href="/agences">
            <Button size="lg" variant="secondary" className="font-semibold">
              Découvrir Yoffre pour les agences
            </Button>
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16">
        <div className="container max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-primary mb-10">
            Questions fréquentes
          </h2>
          <div className="space-y-3">
            {faq.map((f) => (
              <details key={f.q} className="group border rounded-lg bg-card">
                <summary className="cursor-pointer px-5 py-4 text-sm font-semibold text-foreground list-none flex items-center justify-between gap-4">
                  {f.q}
                  <span className="text-muted-foreground group-open:rotate-180 transition-transform shrink-0">▾</span>
                </summary>
                <p className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
          <p className="text-xs text-muted-foreground text-center mt-8">
            Yoffre fournit un outil de rédaction et de transmission de documents. Yoffre n&apos;est
            pas un cabinet d&apos;avocats et ne délivre pas de conseil juridique individualisé.
          </p>
        </div>
      </section>
    </Layout>
  );
}
