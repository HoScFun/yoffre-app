import type { Metadata } from "next";
import Link from "next/link";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Contre-offre immobilière : effets juridiques, caducité de l'offre et négociation",
  description:
    "Le vendeur répond à votre offre d'achat par une contre-proposition ? Effets juridiques d'une contre-offre (articles 1113 et 1118 du Code civil), sort de l'offre initiale, et conseils pour bien négocier.",
  alternates: { canonical: "/guide-contre-offre" },
};

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://yoffre.fr";

const faq = [
  {
    q: "Qu'est-ce qu'une contre-offre immobilière ?",
    a: "C'est la réponse du vendeur (ou de l'acheteur) qui n'accepte pas purement et simplement la proposition reçue, mais en modifie un élément : prix, conditions suspensives, durée de validité, date de signature… Juridiquement, une acceptation non conforme à l'offre est dépourvue d'effet, sauf à constituer une offre nouvelle (article 1118 du Code civil).",
  },
  {
    q: "L'offre initiale survit-elle à une contre-offre ?",
    a: "Non : en formulant une contre-proposition, son auteur n'accepte pas l'offre initiale — il émet une offre nouvelle, dont il devient l'offrant. L'acheteur qui reçoit une contre-offre du vendeur redevient libre : c'est à lui de l'accepter, de la refuser ou de formuler à son tour une nouvelle proposition. Par ailleurs, toute offre devient caduque à l'expiration du délai fixé par son auteur ou, à défaut, à l'issue d'un délai raisonnable (article 1117 du Code civil).",
  },
  {
    q: "Une contre-offre acceptée forme-t-elle la vente ?",
    a: "Oui : le contrat est formé par la rencontre d'une offre et d'une acceptation (article 1113 du Code civil). Si l'acheteur accepte la contre-offre du vendeur (ou inversement), l'accord sur la chose et le prix est constitué, et les parties s'orientent vers la signature de l'avant-contrat.",
  },
  {
    q: "Une contre-offre par email est-elle valable ?",
    a: "Oui. L'écrit électronique a la même force probante que le papier (article 1366 du Code civil), et la Cour de cassation a admis qu'une offre d'achat acceptée par email forme un contrat valable (Cass. Civ. 3e, 15 janvier 2020). D'où l'intérêt de formaliser chaque proposition par écrit, avec un contenu précis et daté.",
  },
];

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Contre-offre immobilière : effets juridiques et négociation",
    inLanguage: "fr-FR",
    author: { "@type": "Organization", name: "Yoffre", url: SITE_URL },
    publisher: { "@type": "Organization", name: "Yoffre", url: SITE_URL },
    mainEntityOfPage: `${SITE_URL}/guide-contre-offre`,
    about: [
      "contre-offre immobilier",
      "contre-proposition vendeur",
      "caducité de l'offre d'achat",
      "article 1118 Code civil",
      "négociation prix immobilier",
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

export default function GuideContreOffrePage() {
  return (
    <Layout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <article className="container max-w-3xl py-12 prose-sm">
        <header className="mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-primary leading-tight mb-4">
            La contre-offre immobilière : ce qu&apos;elle change juridiquement
          </h1>
          <p className="text-muted-foreground text-lg">
            Le vendeur ne dit ni oui ni non : il propose un autre prix. Quels sont les effets
            d&apos;une contre-proposition, que devient votre offre initiale, et comment mener la
            négociation ?
          </p>
        </header>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-primary mb-3">Contre-offre : définition</h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-3">
            Après réception d&apos;une{" "}
            <Link href="/guide-offre-achat" className="text-primary hover:underline">offre d&apos;achat</Link>,
            le vendeur a trois options : accepter, refuser, ou proposer d&apos;autres termes —
            un prix supérieur, une date de signature différente, moins de conditions… Cette
            troisième voie est la contre-offre (ou contre-proposition).
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Le Code civil la qualifie précisément : « l&apos;acceptation non conforme à
            l&apos;offre est dépourvue d&apos;effet, sauf à constituer une offre nouvelle »
            (article 1118 du Code civil). Répondre « d&apos;accord, mais à 260 000 € au lieu de
            250 000 € » n&apos;est donc pas une acceptation : c&apos;est une offre nouvelle, émise
            cette fois par le vendeur.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-primary mb-3">Que devient l&apos;offre initiale ?</h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-3">
            La contre-offre inverse les rôles : son auteur devient l&apos;offrant, et son
            destinataire devient libre d&apos;accepter, de refuser ou de renégocier.
            L&apos;acheteur dont l&apos;offre a fait l&apos;objet d&apos;une contre-proposition
            n&apos;est plus tenu par sa proposition initiale : celle-ci n&apos;a pas été acceptée
            dans ses termes.
          </p>
          <ul className="text-sm text-muted-foreground leading-relaxed space-y-2 list-disc pl-5">
            <li>
              <strong className="text-foreground">Caducité par expiration</strong> : toute offre
              devient caduque à l&apos;expiration du délai fixé par son auteur ou, à défaut, à
              l&apos;issue d&apos;un délai raisonnable (article 1117 du Code civil). D&apos;où
              l&apos;importance de fixer une durée de validité explicite dans chaque proposition.
            </li>
            <li>
              <strong className="text-foreground">Rétractation encadrée</strong> : une offre ne
              peut pas être librement retirée avant l&apos;expiration du délai fixé par son auteur
              ou, à défaut, d&apos;un délai raisonnable (article 1116 du Code civil). Une
              contre-offre est donc un engagement sérieux, pas une simple posture de négociation.
            </li>
            <li>
              <strong className="text-foreground">Formation du contrat</strong> : dès que
              l&apos;une des parties accepte purement et simplement la dernière proposition en
              cours, le contrat se forme (article 1113 du Code civil) — accord sur la chose et
              le prix.
            </li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-primary mb-3">Bien négocier après une contre-offre</h2>
          <ul className="text-sm text-muted-foreground leading-relaxed space-y-3 list-disc pl-5">
            <li>
              <strong className="text-foreground">Répondez par écrit</strong> : chaque étape de la
              négociation (offre, contre-offre, nouvelle offre) mérite un écrit daté et précis.
              L&apos;email est juridiquement valable (article 1366 du Code civil ; Cass. Civ. 3e,
              15 janvier 2020) — un document structuré et horodaté vaut mieux qu&apos;un échange
              oral invérifiable.
            </li>
            <li>
              <strong className="text-foreground">Fixez une durée de validité courte</strong>{" "}
              (5 à 10 jours) : elle borne la caducité de votre proposition et maintient un rythme
              de négociation.
            </li>
            <li>
              <strong className="text-foreground">Ne négociez pas que le prix</strong> : date de
              signature, mobilier inclus, souplesse sur la libération des lieux… autant de
              variables qui peuvent débloquer un désaccord sur le montant.
            </li>
            <li>
              <strong className="text-foreground">Gardez vos protections</strong> : n&apos;abandonnez
              pas vos{" "}
              <Link href="/guide-conditions-suspensives" className="text-primary hover:underline">
                conditions suspensives
              </Link>{" "}
              essentielles (notamment la condition de prêt) pour rendre votre offre plus séduisante.
            </li>
            <li>
              <strong className="text-foreground">Chiffrez votre plafond à l&apos;avance</strong> :
              décidez avant la négociation du prix maximal cohérent avec votre financement, et
              tenez-vous-y.
            </li>
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
              <Link href="/guide-delai-retractation" className="text-primary hover:underline">
                Délai de rétractation de 10 jours : comment ça marche
              </Link>
            </li>
          </ul>
        </section>

        <div className="rounded-xl bg-secondary/60 border p-8 text-center">
          <h2 className="text-xl font-bold text-primary mb-3">
            Formalisez chaque proposition, noir sur blanc
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            Avec Yoffre, votre offre d&apos;achat est un document structuré : prix en chiffres et
            en lettres, durée de validité, conditions suspensives, envoi au vendeur et réponse
            horodatée. Gratuit.
          </p>
          <Link href="/nouvelle-offre">
            <Button size="lg" className="font-semibold">Créer mon offre d&apos;achat</Button>
          </Link>
        </div>

        <p className="text-xs text-muted-foreground mt-8">
          Ce guide est fourni à titre d&apos;information générale et ne constitue pas un conseil
          juridique individualisé. Sources : Légifrance (articles 1113 à 1118 du Code civil),
          jurisprudence citée.
        </p>
      </article>
    </Layout>
  );
}
