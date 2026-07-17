import type { Metadata } from "next";
import { Layout } from "@/components/layout/Layout";

export const metadata: Metadata = {
  title: "Conditions générales d'utilisation",
  alternates: { canonical: "/cgu" },
};

export default function CGUPage() {
  return (
    <Layout>
      <div className="container max-w-3xl py-12">
        <h1 className="text-3xl font-bold text-primary mb-8">Conditions générales d&apos;utilisation</h1>
        <div className="space-y-8 text-sm text-muted-foreground leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">1. Objet</h2>
            <p>
              Les présentes Conditions Générales d&apos;Utilisation (CGU) régissent l&apos;utilisation de la
              plateforme Yoffre, accessible à l&apos;adresse yoffre.fr. Yoffre est un service en ligne
              permettant aux particuliers et aux professionnels de rédiger, personnaliser et transmettre
              des offres d&apos;achat immobilier sous forme électronique.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">2. Gratuité du service</h2>
            <p>
              La création, la génération en PDF et l&apos;envoi d&apos;offres d&apos;achat sont gratuits.
              Yoffre peut proposer, de manière optionnelle et clairement identifiée, des mises en
              relation avec des partenaires (courtiers en crédit immobilier, diagnostiqueurs,
              assureurs, entreprises de travaux). Ces mises en relation n&apos;interviennent que si
              l&apos;utilisateur en fait la demande expresse.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">3. Nature du service — absence de conseil juridique</h2>
            <p>
              Yoffre est un outil d&apos;aide à la rédaction documentaire. Les clauses proposées sont
              des modèles génériques accompagnés de leurs références légales ; elles ne sont pas
              adaptées à une situation particulière. Yoffre n&apos;est ni un cabinet d&apos;avocats, ni
              un office notarial, et ne fournit aucun conseil juridique individualisé. Pour toute
              question sur votre situation, consultez un professionnel du droit (notaire, avocat).
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">4. Responsabilité de l&apos;utilisateur</h2>
            <p>
              L&apos;utilisateur est seul responsable de l&apos;exactitude des informations saisies, du
              choix des clauses et de la décision d&apos;émettre une offre. Une offre d&apos;achat
              acceptée par le vendeur est susceptible de créer des obligations juridiques.
              L&apos;utilisateur reconnaît avoir été informé de cette portée avant chaque envoi.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">5. Compte et sécurité</h2>
            <p>
              La création d&apos;offres est possible sans compte. La création d&apos;un compte permet de
              retrouver ses offres et de suivre les réponses. L&apos;utilisateur est responsable de la
              confidentialité de ses identifiants.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">6. Données personnelles</h2>
            <p>
              Le traitement des données personnelles est décrit dans notre{" "}
              <a href="/confidentialite" className="text-primary underline">politique de confidentialité</a>.
              En résumé : vos données servent à fournir le service ; elles ne sont transmises à des
              partenaires commerciaux qu&apos;avec votre consentement explicite, recueilli au cas par cas.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">7. Disponibilité</h2>
            <p>
              Yoffre s&apos;efforce d&apos;assurer une disponibilité continue du service, sans garantie
              d&apos;absence d&apos;interruption. Yoffre ne saurait être tenu responsable d&apos;un
              préjudice résultant d&apos;une indisponibilité temporaire.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">8. Droit applicable</h2>
            <p>
              Les présentes CGU sont soumises au droit français. Tout litige relève des juridictions
              françaises compétentes.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">9. Contact</h2>
            <p>Pour toute question : contact@yoffre.fr</p>
          </section>
        </div>
      </div>
    </Layout>
  );
}
