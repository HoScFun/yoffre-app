import type { Metadata } from "next";
import Link from "next/link";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Délai de rétractation achat immobilier : 10 jours, point de départ, mode d'emploi",
  description:
    "Délai de rétractation de 10 jours de l'acquéreur immobilier (article L.271-1 CCH, loi SRU) : à quel moment il s'applique, point de départ, différence entre offre d'achat et compromis, comment se rétracter.",
  alternates: { canonical: "/guide-delai-retractation" },
};

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://yoffre.fr";

const faq = [
  {
    q: "Peut-on se rétracter après une offre d'achat acceptée ?",
    a: "Le délai légal de rétractation de 10 jours de l'article L.271-1 du Code de la construction et de l'habitation s'applique à l'avant-contrat (compromis ou promesse de vente), pas à l'offre d'achat elle-même. En pratique, l'acquéreur non professionnel qui signe ensuite le compromis bénéficie de ces 10 jours pour se rétracter sans motif ni pénalité. Une offre d'achat acceptée crée cependant un accord sur la chose et le prix : elle ne doit jamais être signée à la légère.",
  },
  {
    q: "Quand commence le délai de 10 jours ?",
    a: "Le délai court à compter du lendemain de la première présentation de la lettre recommandée notifiant l'avant-contrat à l'acquéreur (article L.271-1 CCH). Lorsque l'acte est conclu par l'intermédiaire d'un professionnel et remis directement en main propre, le délai court à compter du lendemain de la remise.",
  },
  {
    q: "Comment exercer son droit de rétractation ?",
    a: "En notifiant sa décision au vendeur avant l'expiration du délai, par lettre recommandée avec avis de réception ou par tout autre moyen présentant des garanties équivalentes pour la date de réception. Aucun motif n'est à donner et aucune pénalité ne peut être appliquée.",
  },
  {
    q: "Le vendeur a-t-il aussi un délai de rétractation ?",
    a: "Non. Le délai de rétractation de l'article L.271-1 CCH protège uniquement l'acquéreur non professionnel d'un bien à usage d'habitation. Le vendeur qui a accepté une offre ou signé un compromis est engagé.",
  },
];

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Délai de rétractation en achat immobilier : les 10 jours expliqués",
    inLanguage: "fr-FR",
    author: { "@type": "Organization", name: "Yoffre", url: SITE_URL },
    publisher: { "@type": "Organization", name: "Yoffre", url: SITE_URL },
    mainEntityOfPage: `${SITE_URL}/guide-delai-retractation`,
    about: [
      "délai de rétractation achat immobilier",
      "article L.271-1 CCH",
      "loi SRU",
      "rétractation compromis de vente",
      "rétractation offre d'achat",
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

export default function GuideDelaiRetractationPage() {
  return (
    <Layout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <article className="container max-w-3xl py-12 prose-sm">
        <header className="mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-primary leading-tight mb-4">
            Délai de rétractation en achat immobilier : comment fonctionnent les 10 jours
          </h1>
          <p className="text-muted-foreground text-lg">
            L&apos;acquéreur d&apos;un logement dispose d&apos;un délai de rétractation de 10 jours.
            À quel moment s&apos;applique-t-il, à partir de quand court-il, et que change une offre
            d&apos;achat acceptée ? Le point complet.
          </p>
        </header>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-primary mb-3">Le principe : 10 jours pour changer d&apos;avis</h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-3">
            Pour tout acte ayant pour objet l&apos;acquisition d&apos;un immeuble à usage
            d&apos;habitation, l&apos;acquéreur non professionnel peut se rétracter dans un délai
            de dix jours (article L.271-1 du Code de la construction et de l&apos;habitation).
            Cette rétractation est discrétionnaire : aucun motif à fournir, aucune pénalité, et
            les sommes éventuellement versées sont restituées.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Ce dispositif est issu de la loi SRU du 13 décembre 2000, qui avait instauré un délai
            de 7 jours ; il a été porté à 10 jours par la loi du 6 août 2015.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-primary mb-3">
            Offre d&apos;achat ou compromis : à quel moment le délai s&apos;applique-t-il ?
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-3">
            C&apos;est la confusion la plus fréquente. Le délai de rétractation de l&apos;article
            L.271-1 s&apos;attache à l&apos;<strong className="text-foreground">avant-contrat</strong> —
            compromis ou promesse de vente — qui est notifié à l&apos;acquéreur. L&apos;
            <Link href="/guide-offre-achat" className="text-primary hover:underline">offre d&apos;achat</Link>,
            elle, intervient en amont : une fois acceptée par le vendeur, elle crée un accord sur
            la chose et le prix (article 1113 du Code civil) et ouvre la voie à la signature de
            l&apos;avant-contrat.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed mb-3">
            Concrètement : l&apos;acquéreur qui a fait une offre acceptée signera ensuite le
            compromis, et c&apos;est à ce stade qu&apos;il bénéficiera de ses 10 jours de
            rétractation. L&apos;offre d&apos;achat n&apos;est donc pas un piège sans issue — mais
            elle constitue un véritable engagement et ne doit être faite qu&apos;avec une intention
            réelle d&apos;acheter, au bon prix et avec les bonnes{" "}
            <Link href="/guide-conditions-suspensives" className="text-primary hover:underline">
              conditions suspensives
            </Link>.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            À noter : aucun versement ne peut être exigé de l&apos;acquéreur au stade de
            l&apos;offre d&apos;achat. Le dépôt de garantie éventuel intervient à
            l&apos;avant-contrat.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-primary mb-3">Le point de départ du délai</h2>
          <ul className="text-sm text-muted-foreground leading-relaxed space-y-2 list-disc pl-5 mb-3">
            <li>
              <strong className="text-foreground">Notification par lettre recommandée</strong> :
              le délai de 10 jours court à compter du <strong className="text-foreground">lendemain
              de la première présentation</strong> de la lettre notifiant l&apos;acte — même si
              vous ne retirez le courrier que plus tard.
            </li>
            <li>
              <strong className="text-foreground">Remise en main propre</strong> : lorsque
              l&apos;acte est conclu par l&apos;intermédiaire d&apos;un professionnel (agent
              immobilier, notaire), il peut être remis directement à l&apos;acquéreur ; le délai
              court alors à compter du lendemain de la remise.
            </li>
          </ul>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Lorsque la vente est conclue directement par acte authentique sans avant-contrat
            préalable, l&apos;acquéreur non professionnel bénéficie non pas d&apos;un délai de
            rétractation mais d&apos;un <strong className="text-foreground">délai de réflexion</strong> de
            dix jours avant la signature (même article L.271-1).
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-primary mb-3">Comment se rétracter concrètement</h2>
          <ul className="text-sm text-muted-foreground leading-relaxed space-y-2 list-disc pl-5">
            <li>Notifier sa rétractation avant l&apos;expiration du délai, par lettre recommandée avec avis de réception (ou tout moyen présentant des garanties équivalentes pour la date de réception).</li>
            <li>Aucune justification à fournir, aucune indemnité à payer.</li>
            <li>Les sommes versées au titre du dépôt de garantie doivent être restituées.</li>
            <li>Passé le délai, l&apos;acquéreur est engagé : il ne peut plus renoncer que dans le cadre des conditions suspensives stipulées au contrat.</li>
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
              <Link href="/guide-conditions-suspensives" className="text-primary hover:underline">
                Conditions suspensives : lesquelles prévoir dans votre offre
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
          <h2 className="text-xl font-bold text-primary mb-3">Faites une offre d&apos;achat sérieuse et encadrée</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Formulaire guidé, conditions suspensives pré-rédigées, durée de validité claire, PDF
            professionnel et réponse du vendeur horodatée. Gratuit.
          </p>
          <Link href="/nouvelle-offre">
            <Button size="lg" className="font-semibold">Créer mon offre d&apos;achat</Button>
          </Link>
        </div>

        <p className="text-xs text-muted-foreground mt-8">
          Ce guide est fourni à titre d&apos;information générale et ne constitue pas un conseil
          juridique individualisé. Sources : Légifrance (art. L.271-1 CCH), Service-Public.fr.
        </p>
      </article>
    </Layout>
  );
}
