# Équipe d'agents Yoffre — runbook

Cinq agents spécialisés, définis dans `.claude/agents/`, invocables depuis toute session Claude Code sur ce repo (mention `@agent-<nom>` ou via l'outil Agent). Chacun embarque ses garde-fous ; règle commune : **rien ne part vers l'extérieur sans validation du fondateur** (envois, publications, réponses), jusqu'à autorisation explicite par catégorie.

| Agent | Mission | Cadence conseillée | Prérequis manquants |
|---|---|---|---|
| `seo-geo` | Pages SEO, visibilité moteurs IA (GEO), hygiène technique | hebdo | Google Search Console à connecter |
| `integrations-immo` | API publique, serveur MCP, connecteurs MyNotary/Hektor/MaBriqueImmo… | à la demande | décision de priorité produit |
| `contenu-newsletter` | Contenu multi-canal + newsletter Brevo (double opt-in) | hebdo | page /newsletter + liste Brevo dédiée |
| `service-client` | Boîte support, FAQ, triage bugs | quotidien | boîte mail réelle contact@yoffre.fr (à créer : routage OVH MX ou Google Workspace) et connecteur pour la lire |
| `leads-partenariats` | Listes qualifiées + séquences B2B (validées lot par lot) | hebdo | adresse d'envoi dédiée (ex. bonjour@yoffre.fr) |

## Passage en autonomie planifiée
Chaque agent peut devenir une routine cloud planifiée (cron) — à activer volontairement car chaque exécution est facturée. Ordre recommandé d'activation : seo-geo (hebdo) → contenu-newsletter (hebdo) → service-client (quotidien, une fois la boîte mail en place). leads-partenariats reste semi-automatique par conception (validation des lots).

## Journal
Chaque run d'agent se conclut par un compte rendu : actions faites, éléments en attente de validation, prochaines étapes. Les validations en attente sont adressées au fondateur.
