# Yoffre — contexte pour agents

Yoffre (https://yoffre.fr) : création gratuite d'offres d'achat immobilier en France. Formulaire guidé 4 étapes, conditions suspensives, PDF, envoi au vendeur avec lien de réponse horodaté. Modèle : gratuit pour les particuliers → leads qualifiés (courtiers, diagnostiqueurs, assureurs) + offre agences.

## Infrastructure
- **Front/serveur** : Next.js 14 App Router (ce repo). Déploiement : Vercel projet `yoffre-app` — chaque push sur `main` déploie en production. Domaine canonique yoffre.fr ; www + yoffre.com en 308.
- **Données/auth** : Supabase `hwivlvllupjvsncffoir` (Postgres + RLS, sessions anonymes pour l'offre sans compte). Migrations dans `supabase/migrations/` (à appliquer via MCP Supabase ou CLI). La page vendeur lit via la RPC `get_offer_by_token`.
- **Emails** : Brevo (compte « HomeScan », domaine yoffre.fr authentifié DKIM/DMARC). Edge function `supabase/functions/send-offer-emails` (secret `BREVO_API_KEY` dans Supabase). Expéditeur : noreply@yoffre.fr.
- **DNS** : OVH (yoffre.fr, yoffre.com).

## Conventions
- Pages publiques = SSR indexable + metadata + canonical + JSON-LD ; toute nouvelle page entre dans `app/sitemap.ts`.
- Vues client portées de la v0 dans `src/views/` ; composants shadcn dans `src/components/ui/`.
- Actifs métier précieux : `src/lib/validation.ts` (validation France), `src/lib/pdf.ts` (PDF offre, montant en lettres).
- Interdits : conseil juridique individualisé dans le produit ou le contenu ; données personnelles dans les URLs ; secrets côté client.
- `npm run build` doit passer avant tout commit.

## Équipe d'agents (.claude/agents/)
`seo-geo`, `integrations-immo`, `contenu-newsletter`, `service-client`, `leads-partenariats` — rôles et garde-fous détaillés dans chaque fichier + runbook dans `docs/equipe-agents.md`. Règle commune : toute communication externe (envoi d'email de prospection, publication, réponse client) est un brouillon soumis au fondateur tant qu'une autorisation explicite par catégorie n'a pas été donnée.
