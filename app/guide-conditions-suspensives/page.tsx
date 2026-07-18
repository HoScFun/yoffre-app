import type { Metadata } from "next";
import Link from "next/link";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Conditions suspensives d'une offre d'achat : lesquelles prévoir et comment les rédiger",
  description:
    "Condition suspensive de prêt (loi Scrivener), droit de préemption, vente préalable, servitudes, permis de construire : comment protéger votre offre d'achat immobilier. Guide gratuit avec bases légales.",
  alternates: { canonical: "/guide-conditions-suspensives" },
};

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://yoffre.fr";

const faq = [
  {
    q: "Une condition suspensive de prêt est-elle obligatoire ?",
    a: "Si vous achetez à crédit un bien à usage d'habitation, la condition suspensive d'obtention de prêt est une protection d'ordre public prévue par l'article L.313-41 du Code de la consommation (loi Scrivener) : si le prêt est refusé, la vente ne se fait pas et les sommes versées vous sont restituées. Vous pouvez y renoncer si vous achetez comptant, en le mentionnant expressément.",
  },
  {
    q: "Que doit préciser la clause de prêt pour être valable ?",
    a: "La jurisprudence exige que la clause précise le montant du prêt, le taux maximal et la durée (Cass. Civ. 1re, 20 mai 2010). Une clause imprécise est réputée nulle (Cass. Civ. 3e, 7 novembre 2012) et vous prive de la protection.",
  },
  {
    q: "Que se passe-t-il si une condition suspensive ne se réalise pas ?",
    a: "La vente ne se forme pas : les parties sont libérées et l'acquéreur récupère les sommes éventuellement versées, sans pénalité, dès lors qu'il n'a pas empêché lui-même la réalisation de la condition. Les conditions suspensives sont régies par les articles 1304 et suivants du Code civil.",
  },
  {
    q: "Peut-on ajouter des conditions suspensives dans une offre d'achat ?",
    a: "Oui. L'offre d'achat peut stipuler des conditions suspensives (prêt, préemption, vente préalable de votre bien, permis de construire, absence de servitudes non déclarées…). Elles seront reprises dans le compromis de vente. Les stipuler dès l'offre évite les mauvaises surprises au moment de l'avant-contrat.",
  },
];

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Conditions suspensives d'une offre d'achat immobilier : le guide",
    inLanguage: "fr-FR",
    author: { "@type": "Organization", name: "Yoffre", url: SITE_URL },
    publisher: { "@type": "Organization", name: "Yoffre", url: SITE_URL },
    mainEntityOfPage: `${SITE_URL}/guide-conditions-suspensives`,
    about: [
      "conditions suspensives offre d'achat",
      "condition suspensive de prêt",
      "loi Scrivener",
      "droit de préemption urbain",
      "condition suspensive de vente préalable",
      "permis de construire purgé de recours",
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  },
];

export default function GuideConditionsSuspensivesPage() {
  return (
    <Layout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <article className="container max-w-3xl py-12 prose-sm">
        <header className="mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-primary leading-tight mb-4">
            Les conditions suspensives d&apos;une offre d&apos;achat immobilier
          </h1>
          <p className="text-muted-foreground text-lg">
            Prêt, préemption, vente préalable, servitudes, permis de construire : quelles
            conditions suspensives prévoir dans votre offre d&apos;achat, et comment les rédiger
            pour qu&apos;elles vous protègent vraiment.
          </p>
        </header>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-primary mb-3">Qu&apos;est-ce qu&apos;une condition suspensive ?</h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-3">
            Une condition suspensive subordonne la formation définitive de la vente à un
            événement futur et incertain : l&apos;obtention d&apos;un prêt, le non-exercice
            d&apos;un droit de préemption, la vente de votre bien actuel… Tant que la condition
            n&apos;est pas réalisée, la vente est suspendue ; si elle ne se réalise pas,
            l&apos;opération tombe et l&apos;acquéreur est libéré. Le régime des obligations
            conditionnelles est fixé par les articles 1304 et suivants du Code civil.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Les conditions suspensives sont stipulées dans l&apos;intérêt de l&apos;acquéreur :
            elles peuvent figurer dès l&apos;
            <Link href="/guide-offre-achat" className="text-primary hover:underline">offre d&apos;achat</Link>{" "}
            et seront reprises dans le compromis de vente.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-primary mb-3">
            La condition suspensive d&apos;obtention de prêt (loi Scrivener)
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-3">
            C&apos;est la plus importante. Si vous financez l&apos;achat d&apos;un bien à usage
            d&apos;habitation par un crédit immobilier, l&apos;article L.313-41 du Code de la
            consommation (issu de la loi Scrivener) fait de l&apos;obtention du prêt une condition
            suspensive de la vente : en cas de refus de prêt, vous récupérez les sommes versées.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed mb-3">
            Attention à la rédaction : la jurisprudence exige que la clause précise le{" "}
            <strong className="text-foreground">montant</strong> du prêt, le{" "}
            <strong className="text-foreground">taux maximal</strong> et la{" "}
            <strong className="text-foreground">durée</strong> (Cass. Civ. 1re, 20 mai 2010).
            Une clause de prêt imprécise est réputée nulle (Cass. Civ. 3e, 7 novembre 2012) :
            vous perdez alors la protection alors même que vous pensiez être couvert.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Exemple de rédaction complète : « sous la condition suspensive d&apos;obtention
            d&apos;un prêt immobilier d&apos;un montant de 250 000 €, à un taux maximum de 4 %
            sur une durée de 240 mois, dans un délai de 45 jours à compter de
            l&apos;acceptation ». C&apos;est exactement la structure de la clause pré-rédigée de
            Yoffre : montant, taux et durée sont des champs obligatoires du formulaire.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-primary mb-3">Le droit de préemption</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Dans de nombreuses communes, la collectivité peut préempter le bien, c&apos;est-à-dire
            se substituer à l&apos;acquéreur (droit de préemption urbain, article L.211-1 du Code
            de l&apos;urbanisme). La condition suspensive de non-exercice du droit de préemption
            doit être mentionnée : la Cour de cassation sanctionne son omission par
            l&apos;inopposabilité (Cass. Civ. 3e, 25 mars 2009).
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-primary mb-3">Les autres conditions suspensives courantes</h2>
          <ul className="text-sm text-muted-foreground leading-relaxed space-y-3 list-disc pl-5">
            <li>
              <strong className="text-foreground">Vente préalable de votre bien actuel</strong> :
              si votre achat dépend de la revente de votre logement, cette condition (fondée sur
              les articles 1304 et suivants du Code civil) vous évite de porter deux biens en même
              temps. Précisez l&apos;adresse du bien à vendre et un délai en mois.
            </li>
            <li>
              <strong className="text-foreground">Absence de servitudes non déclarées</strong> :
              protège contre les servitudes, charges ou droits réels qui affecteraient la
              jouissance ou la valeur du bien et n&apos;auraient pas été révélés (articles 637 et
              686 du Code civil).
            </li>
            <li>
              <strong className="text-foreground">Obtention d&apos;un permis de construire purgé de
              tout recours</strong> : indispensable si votre projet suppose des travaux soumis à
              permis (article L.421-1 du Code de l&apos;urbanisme). Exiger un permis « purgé »
              couvre le délai de recours des tiers (article R.600-2 du Code de l&apos;urbanisme).
            </li>
            <li>
              <strong className="text-foreground">Absence de procédure en cours</strong> :
              condition portant sur l&apos;absence de procédure administrative, judiciaire ou
              contentieuse susceptible d&apos;affecter le bien ou son usage.
            </li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-primary mb-3">Les pièges de rédaction</h2>
          <ul className="text-sm text-muted-foreground leading-relaxed space-y-2 list-disc pl-5">
            <li>Clause de prêt sans montant, taux ni durée → clause réputée nulle, protection perdue.</li>
            <li>Absence de délai de réalisation → incertitude prolongée pour les deux parties.</li>
            <li>Empiler des conditions inutiles → offre moins crédible face à une offre concurrente plus simple.</li>
            <li>Oublier la préemption dans une zone où elle s&apos;applique → risque d&apos;inopposabilité.</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-primary mb-3">Questions fréquentes</h2>
          {faq.map((item) => (
            <div key={item.q} className="mb-5">
              <h3 className="text-base font-semibold text-foreground mb-2">{item.q}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.a}</p>
            </div>
          ))}
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-primary mb-3">Pour aller plus loin</h2>
          <ul className="text-sm leading-relaxed space-y-2 list-disc pl-5">
            <li>
              <Link href="/guide-offre-achat" className="text-primary hover:underline">
                L&apos;offre d&apos;achat immobilier : le guide complet
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
          <h2 className="text-xl font-bold text-primary mb-3">
            Une offre d&apos;achat avec les bonnes conditions suspensives, en quelques minutes
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            Yoffre propose des conditions suspensives pré-rédigées avec leurs bases légales, à
            cocher selon votre situation. La clause de prêt intègre automatiquement montant, taux
            et durée. Gratuit.
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
