import type { Metadata } from "next";
import Link from "next/link";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Offre d'achat immobilier : guide complet 2026 (valeur juridique, conditions suspensives)",
  description:
    "Tout comprendre sur l'offre d'achat immobilier en France : valeur juridique, contenu obligatoire, conditions suspensives (prêt, préemption…), délais, rétractation, jurisprudence. Guide gratuit.",
  alternates: { canonical: "/guide-offre-achat" },
};

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://yoffre.fr";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Offre d'achat immobilier : guide complet",
  inLanguage: "fr-FR",
  author: { "@type": "Organization", name: "Yoffre", url: SITE_URL },
  publisher: { "@type": "Organization", name: "Yoffre", url: SITE_URL },
  mainEntityOfPage: `${SITE_URL}/guide-offre-achat`,
  about: [
    "offre d'achat immobilier",
    "conditions suspensives",
    "condition suspensive de prêt",
    "droit de préemption",
    "délai de rétractation",
  ],
};

export default function GuidePage() {
  return (
    <Layout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <article className="container max-w-3xl py-12 prose-sm">
        <header className="mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-primary leading-tight mb-4">
            L&apos;offre d&apos;achat immobilier : le guide complet
          </h1>
          <p className="text-muted-foreground text-lg">
            Valeur juridique, contenu, conditions suspensives, délais et pièges à éviter —
            tout ce qu&apos;il faut savoir avant de faire une offre sur un bien immobilier en France.
          </p>
        </header>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-primary mb-3">Qu&apos;est-ce qu&apos;une offre d&apos;achat ?</h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-3">
            L&apos;offre d&apos;achat (ou « proposition d&apos;achat ») est le document par lequel un
            candidat acquéreur propose au vendeur d&apos;acheter son bien à un prix donné, pour une
            durée de validité donnée. En droit français, le contrat se forme par la rencontre
            d&apos;une offre et d&apos;une acceptation (article 1113 du Code civil) : une offre
            d&apos;achat acceptée par le vendeur crée donc un accord sur la chose et le prix.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Depuis la loi du 13 mars 2000 (article 1366 du Code civil), l&apos;écrit électronique a la
            même force probante que le papier : une offre envoyée et acceptée par email est valable.
            La Cour de cassation l&apos;a confirmé (Cass. Civ. 3e, 15 janvier 2020).
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-primary mb-3">Que doit contenir une offre d&apos;achat sérieuse ?</h2>
          <ul className="text-sm text-muted-foreground leading-relaxed space-y-2 list-disc pl-5">
            <li><strong className="text-foreground">L&apos;identification des parties</strong> : acheteur (nom, coordonnées) et vendeur.</li>
            <li><strong className="text-foreground">La désignation du bien</strong> : adresse complète, type de bien.</li>
            <li><strong className="text-foreground">Le prix proposé</strong>, en chiffres et en lettres, et le mode de financement (comptant ou à crédit).</li>
            <li><strong className="text-foreground">La durée de validité</strong> de l&apos;offre (généralement 5 à 15 jours).</li>
            <li><strong className="text-foreground">Les conditions suspensives</strong> qui protègent l&apos;acheteur.</li>
            <li>Le cas échéant : l&apos;agence immobilière et le notaire choisis.</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-primary mb-3">Les conditions suspensives essentielles</h2>

          <h3 className="text-base font-semibold text-foreground mb-2">1. L&apos;obtention du prêt immobilier (loi Scrivener)</h3>
          <p className="text-sm text-muted-foreground leading-relaxed mb-3">
            Si vous financez à crédit, la condition suspensive d&apos;obtention de prêt est
            d&apos;ordre public (article L.313-41 du Code de la consommation). Attention : la
            jurisprudence exige que le <strong className="text-foreground">montant</strong>, le{" "}
            <strong className="text-foreground">taux maximal</strong> et la{" "}
            <strong className="text-foreground">durée</strong> du prêt soient précisés
            (Cass. Civ. 1re, 20 mai 2010) ; une clause imprécise est réputée nulle
            (Cass. Civ. 3e, 7 novembre 2012) et vous prive de protection.
          </p>

          <h3 className="text-base font-semibold text-foreground mb-2">2. Le droit de préemption urbain</h3>
          <p className="text-sm text-muted-foreground leading-relaxed mb-3">
            La commune peut préempter le bien (article L.211-1 du Code de l&apos;urbanisme). La
            mention de cette condition est indispensable, sous peine d&apos;inopposabilité
            (Cass. Civ. 3e, 25 mars 2009).
          </p>

          <h3 className="text-base font-semibold text-foreground mb-2">3. Les autres clauses courantes</h3>
          <ul className="text-sm text-muted-foreground leading-relaxed space-y-2 list-disc pl-5 mb-3">
            <li>Vente préalable de votre bien actuel (art. 1304 du Code civil) ;</li>
            <li>Absence de servitudes non déclarées (art. 637 et 686 du Code civil) ;</li>
            <li>Obtention d&apos;un permis de construire purgé de tout recours ;</li>
            <li>Absence de procédure administrative ou contentieuse en cours.</li>
          </ul>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Yoffre propose ces clauses pré-rédigées, à cocher selon votre situation, et vous
            permet d&apos;en rédiger librement d&apos;autres.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-primary mb-3">Après l&apos;acceptation : rétractation et suite</h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-3">
            L&apos;acceptation de l&apos;offre ouvre la voie à la signature d&apos;un avant-contrat
            (compromis ou promesse de vente), puis de l&apos;acte authentique chez le notaire.
            L&apos;acquéreur non professionnel dispose d&apos;un délai de rétractation de 10 jours
            après la signature de l&apos;avant-contrat (article L.271-1 du Code de la construction
            et de l&apos;habitation).
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Aucun versement ne peut être exigé au stade de l&apos;offre d&apos;achat : le dépôt de
            garantie éventuel intervient à l&apos;avant-contrat (art. 1590 du Code civil pour les arrhes).
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-primary mb-3">Les pièges classiques</h2>
          <ul className="text-sm text-muted-foreground leading-relaxed space-y-2 list-disc pl-5">
            <li>Clause de prêt sans montant, taux ni durée → clause nulle, protection perdue.</li>
            <li>Offre sans durée de validité → incertitude juridique prolongée.</li>
            <li>Offre au prix « pour bloquer le bien » sans intention réelle → vous êtes engagé si le vendeur accepte.</li>
            <li>Oublier l&apos;agence ou le notaire dans la boucle → pertes de temps et de traçabilité.</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-primary mb-3">Pour aller plus loin</h2>
          <ul className="text-sm leading-relaxed space-y-2 list-disc pl-5">
            <li>
              <Link href="/guide-conditions-suspensives" className="text-primary hover:underline">
                Conditions suspensives : lesquelles prévoir et comment les rédiger
              </Link>
            </li>
            <li>
              <Link href="/guide-delai-retractation" className="text-primary hover:underline">
                Délai de rétractation de 10 jours : comment ça marche
              </Link>
            </li>
            <li>
              <Link href="/guide-contre-offre" className="text-primary hover:underline">
                Contre-offre immobilière : effets juridiques et négociation
              </Link>
            </li>
          </ul>
        </section>

        <div className="rounded-xl bg-secondary/60 border p-8 text-center">
          <h2 className="text-xl font-bold text-primary mb-3">Prêt à faire votre offre ?</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Formulaire guidé, conditions suspensives pré-rédigées, PDF professionnel, envoi et
            réponse horodatée. Gratuit.
          </p>
          <Link href="/nouvelle-offre">
            <Button size="lg" className="font-semibold">Créer mon offre d&apos;achat</Button>
          </Link>
        </div>

        <p className="text-xs text-muted-foreground mt-8">
          Ce guide est fourni à titre d&apos;information générale et ne constitue pas un conseil
          juridique individualisé. Sources : Légifrance, Service-Public.fr, jurisprudence citée.
        </p>
      </article>
    </Layout>
  );
}
