import type { Metadata } from "next";
import { Layout } from "@/components/layout/Layout";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  alternates: { canonical: "/confidentialite" },
};

export default function ConfidentialitePage() {
  return (
    <Layout>
      <div className="container max-w-3xl py-12">
        <h1 className="text-3xl font-bold text-primary mb-8">Politique de confidentialité</h1>
        <div className="space-y-8 text-sm text-muted-foreground leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">1. Responsable du traitement</h2>
            <p>
              Le responsable du traitement des données collectées sur yoffre.fr est Yoffre
              (contact : contact@yoffre.fr).
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">2. Données collectées</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong className="text-foreground">Données d&apos;offre</strong> : identité et coordonnées de
                l&apos;acheteur, du vendeur, le cas échéant de l&apos;agent immobilier et du notaire ;
                caractéristiques du bien, prix proposé, conditions suspensives, mode de financement.
              </li>
              <li>
                <strong className="text-foreground">Données de compte</strong> : email, nom, téléphone (facultatif).
              </li>
              <li>
                <strong className="text-foreground">Données de réponse vendeur</strong> : nom déclaré, décision,
                horodatage et adresse IP (à des fins de preuve et de lutte contre la fraude).
              </li>
              <li>
                <strong className="text-foreground">Demandes de mise en relation</strong> : coordonnées et projet,
                lorsque vous demandez expressément à être contacté par un partenaire.
              </li>
            </ul>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">3. Finalités et bases légales</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong className="text-foreground">Fournir le service</strong> (rédaction, envoi, suivi des offres,
                notifications email) — exécution du contrat.
              </li>
              <li>
                <strong className="text-foreground">Mise en relation avec des partenaires</strong> (courtiers en
                crédit, diagnostiqueurs, assureurs, entreprises de travaux) —{" "}
                <strong className="text-foreground">uniquement avec votre consentement explicite</strong>, recueilli
                au moment où vous demandez à être contacté. Vous pouvez retirer ce consentement à tout moment.
              </li>
              <li>
                <strong className="text-foreground">Statistiques agrégées et anonymisées</strong> sur le marché
                immobilier (aucune donnée identifiante n&apos;est communiquée) — intérêt légitime.
              </li>
              <li>
                <strong className="text-foreground">Sécurité et preuve</strong> (horodatage, IP de la réponse
                vendeur) — intérêt légitime.
              </li>
            </ul>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">4. Destinataires</h2>
            <p>
              Les données d&apos;une offre sont transmises aux destinataires que vous désignez
              (vendeur, agent immobilier, notaire). Les demandes de mise en relation sont transmises
              au seul partenaire concerné. Nos sous-traitants techniques : Supabase (hébergement des
              données, Union européenne), Resend (envoi d&apos;emails), hébergeur du site. Aucune
              donnée n&apos;est vendue ou transmise à des tiers en dehors de ces cas.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">5. Durées de conservation</h2>
            <p>
              Les offres sont conservées pendant la durée de vie de votre compte, ou 12 mois après
              expiration pour les offres créées sans compte. Les demandes de mise en relation sont
              conservées 3 ans au plus. Vous pouvez demander la suppression anticipée à tout moment.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">6. Vos droits</h2>
            <p>
              Conformément au RGPD, vous disposez des droits d&apos;accès, de rectification,
              d&apos;effacement, de limitation, d&apos;opposition et de portabilité. Exercez-les en
              écrivant à contact@yoffre.fr. Vous pouvez introduire une réclamation auprès de la CNIL
              (cnil.fr).
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">7. Cookies</h2>
            <p>
              Yoffre utilise uniquement des stockages techniques nécessaires au fonctionnement
              (session de connexion, brouillon d&apos;offre sur votre appareil). Aucun cookie
              publicitaire tiers n&apos;est déposé.
            </p>
          </section>
        </div>
      </div>
    </Layout>
  );
}
