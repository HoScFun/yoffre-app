"use client";

import { Layout } from "@/components/layout/Layout";

export default function MentionsLegales() {
  return (
    <Layout>
      <div className="container max-w-3xl py-12">
        <h1 className="text-3xl font-bold text-primary mb-8">Mentions légales</h1>
        <p className="text-sm text-muted-foreground mb-6">Dernière mise à jour : 8 mars 2026</p>

        <div className="prose prose-sm max-w-none space-y-6 text-foreground">
          <section>
            <h2 className="text-lg font-semibold text-primary mt-6 mb-2">1. Éditeur du site</h2>
            <div className="text-sm leading-relaxed text-muted-foreground space-y-1">
              <p><strong className="text-foreground">Nom du site :</strong> Yoffre</p>
              <p><strong className="text-foreground">URL :</strong> yoffre.fr</p>
              <p><strong className="text-foreground">Éditeur :</strong> Yoffre SAS</p>
              <p><strong className="text-foreground">Email :</strong> <a href="mailto:contact@yoffre.fr" className="text-primary hover:underline">contact@yoffre.fr</a></p>
              <p><strong className="text-foreground">Directeur de la publication :</strong> Le représentant légal de la société Yoffre</p>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-primary mt-6 mb-2">2. Hébergement</h2>
            <div className="text-sm leading-relaxed text-muted-foreground space-y-1">
              <p><strong className="text-foreground">Hébergeur :</strong> Clever Cloud SAS</p>
              <p><strong className="text-foreground">Adresse :</strong> 4 rue Voltaire, 44000 Nantes, France</p>
              <p><strong className="text-foreground">Site web :</strong> <a href="https://www.clever.cloud" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">clever.cloud</a></p>
              <p className="mt-2"><strong className="text-foreground">Données et authentification :</strong> Supabase Inc. — <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">supabase.com</a> (données hébergées dans l'Union européenne)</p>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-primary mt-6 mb-2">3. Activité</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Yoffre est un service en ligne de rédaction assistée d'offres d'achat immobilier. Il permet aux utilisateurs de créer, personnaliser et envoyer des offres d'achat formalisées par voie électronique.
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground mt-2">
              Yoffre ne fournit aucun conseil juridique et ne se substitue pas à un notaire, avocat ou tout autre professionnel du droit. Les documents générés le sont à titre informatif et doivent être vérifiés par un professionnel qualifié.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-primary mt-6 mb-2">4. Propriété intellectuelle</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              L'ensemble des éléments constituant le site yoffre.fr (textes, graphismes, logiciels, photographies, images, vidéos, sons, plans, noms, logos, marques, créations et œuvres protégeables diverses, bases de données, etc.) ainsi que le site lui-même, relèvent des législations françaises et internationales sur le droit d'auteur et la propriété intellectuelle.
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground mt-2">
              Ces éléments sont la propriété exclusive de Yoffre SAS. Toute reproduction, représentation, modification, publication, transmission, dénaturation, totale ou partielle du site ou de son contenu, par quelque procédé que ce soit, et sur quelque support que ce soit est interdite sans l'autorisation écrite préalable de Yoffre.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-primary mt-6 mb-2">5. Protection des données personnelles</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi n°78-17 du 6 janvier 1978 relative à l'informatique, aux fichiers et aux libertés, l'utilisateur dispose des droits suivants concernant ses données personnelles :
            </p>
            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1 mt-2">
              <li><strong className="text-foreground">Droit d'accès :</strong> obtenir la confirmation que des données sont traitées et en obtenir une copie</li>
              <li><strong className="text-foreground">Droit de rectification :</strong> demander la correction de données inexactes</li>
              <li><strong className="text-foreground">Droit à l'effacement :</strong> demander la suppression des données dans les conditions prévues par la loi</li>
              <li><strong className="text-foreground">Droit à la portabilité :</strong> recevoir les données dans un format structuré</li>
              <li><strong className="text-foreground">Droit d'opposition :</strong> s'opposer au traitement pour des motifs légitimes</li>
            </ul>
            <p className="text-sm leading-relaxed text-muted-foreground mt-3">
              Pour exercer ces droits, contactez-nous à : <a href="mailto:contact@yoffre.fr" className="text-primary hover:underline">contact@yoffre.fr</a>
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-primary mt-6 mb-2">6. Cookies</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Le site yoffre.fr utilise des cookies strictement nécessaires au fonctionnement du service (authentification, préférences utilisateur). Aucun cookie publicitaire ou de suivi tiers n'est déposé.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-primary mt-6 mb-2">7. Limitation de responsabilité</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              L'éditeur s'efforce de fournir sur le site des informations aussi précises que possible. Toutefois, il ne pourra être tenu responsable des omissions, des inexactitudes et des carences dans la mise à jour, qu'elles soient de son fait ou du fait des tiers partenaires qui lui fournissent ces informations.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-primary mt-6 mb-2">8. Droit applicable</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Le présent site et ses mentions légales sont régis par le droit français. En cas de litige et à défaut de résolution amiable, les tribunaux français seront seuls compétents.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-primary mt-6 mb-2">9. Contact</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Pour toute question ou demande d'information, vous pouvez nous contacter à : <a href="mailto:contact@yoffre.fr" className="text-primary hover:underline">contact@yoffre.fr</a>
            </p>
          </section>
        </div>
      </div>
    </Layout>
  );
}
