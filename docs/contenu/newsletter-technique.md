# Newsletter Yoffre — état technique et actions restantes pour le fondateur

Produit par l'agent contenu-newsletter, run du 22/07/2026.

## Ce qui est fait

- **Page `/newsletter`** (`app/newsletter/page.tsx`) : page publique, indexée (SEO), formulaire d'inscription
  (`src/components/newsletter/NewsletterForm.tsx`), ajoutée au sitemap et liée depuis le footer.
- **Table `newsletter_subscribers`** créée sur le projet Supabase Yoffre (`hwivlvllupjvsncffoir`) via migration
  `supabase/migrations/20260722000001_newsletter_subscribers.sql` — RLS activé, aucune policy anon/authenticated
  (écriture réservée au rôle service). Colonnes : `email` (unique, validé), `source`, `consent_at`, `brevo_synced`.
- **Edge function `newsletter-subscribe`** (`supabase/functions/newsletter-subscribe/index.ts`) : valide l'email,
  enregistre le consentement en base (source de vérité, backup indépendant de Brevo), puis synchronise vers Brevo
  si `BREVO_API_KEY` est configuré (déjà le cas : ce secret existe côté Supabase, utilisé par `send-offer-emails`).
  Elle crée automatiquement, si besoin, un dossier Brevo « Yoffre » et une liste « Newsletter site » — aucun ID à
  saisir manuellement.

## Ce qui manque / nécessite une action du fondateur

1. **Déployer la edge function `newsletter-subscribe` sur Supabase.**
   Le code est prêt dans le repo mais **n'a pas été déployé** : l'action de déploiement de code en production a été
   bloquée par le mode automatique de cette session (garde-fou volontaire — déployer du code exécutable en prod
   n'est pas une action anodine). Tant que ce n'est pas fait, la page `/newsletter` enregistrera une erreur au
   moment de l'inscription.
   → À faire : `supabase functions deploy newsletter-subscribe --project-ref hwivlvllupjvsncffoir` (CLI, après
   `supabase login`), ou depuis le dashboard Supabase, ou en repassant par un agent Claude Code en session
   interactive pour valider explicitement le déploiement.

2. **Double opt-in réel (email de confirmation) — actuellement en opt-in simple.**
   Le vrai double opt-in RGPD (email de confirmation avec lien à cliquer avant inscription effective) suppose un
   template de confirmation créé dans Brevo (Campagnes > Modèles), dont l'ID doit être renseigné dans le secret
   Supabase `BREVO_DOI_TEMPLATE_ID`. Ce template ne peut pas être créé par API sans accès au dashboard Brevo.
   Sans ce secret, la fonction retombe sur une inscription directe (opt-in simple) : le consentement explicite est
   quand même capturé via la case à cocher obligatoire du formulaire, avec horodatage en base (`consent_at`) — mais
   ce n'est pas un double opt-in au sens strict.
   → À faire : créer le template de confirmation dans Brevo, renseigner `BREVO_DOI_TEMPLATE_ID` dans les secrets
   Supabase du projet Yoffre. La fonction bascule automatiquement en double opt-in dès que ce secret existe.

3. **Envoi de la newsletter n°1.**
   Le contenu est prêt (`docs/contenu/newsletter-01.md`) mais reste un brouillon : à créer manuellement comme
   campagne *draft* dans Brevo une fois la liste « Newsletter site » alimentée par au moins quelques inscrits, puis
   à valider et envoyer par le fondateur. Aucun envoi n'est automatisé par cet agent.

## Sécurité / RGPD — ce qui est déjà garanti par le code

- Aucune donnée de l'offre transactionnelle ne nourrit la newsletter (table et flux totalement séparés du parcours
  d'offre d'achat).
- Le consentement est horodaté et conservé (`consent_at`), avec la source de l'inscription (`source`).
- La table n'est accessible en écriture que par le rôle service (edge function) : aucun accès direct anon/authentifié.
- Aucune liste n'est achetée ni important en masse : uniquement les inscriptions via `/newsletter`.
