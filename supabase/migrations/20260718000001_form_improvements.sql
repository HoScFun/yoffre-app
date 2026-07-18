-- Améliorations formulaire 2026-07-18
-- a. Prénom / nom séparés (rétrocompatible : anciennes lignes ont prenom NULL et nom = nom complet)
ALTER TABLE public.offers ADD COLUMN IF NOT EXISTS acheteur_prenom text;
ALTER TABLE public.offers ADD COLUMN IF NOT EXISTS vendeur_prenom text;

-- g. Qualité du professionnel (marchand_de_biens | fonciere | sci | autre)
ALTER TABLE public.offers ADD COLUMN IF NOT EXISTS professionnel_type text;

-- b/c. Adresses structurées issues de l'autocomplétion BAN (api-adresse.data.gouv.fr)
ALTER TABLE public.offers ADD COLUMN IF NOT EXISTS acheteur_adresse_details jsonb;
ALTER TABLE public.offers ADD COLUMN IF NOT EXISTS vendeur_adresse_details jsonb;
ALTER TABLE public.offers ADD COLUMN IF NOT EXISTS bien_adresse_details jsonb;

-- e. Nouvelles conditions suspensives — insérées inactives, à relire puis activer via l'admin
SELECT setval(pg_get_serial_sequence('public.clauses', 'id'), (SELECT MAX(id) FROM public.clauses));

INSERT INTO public.clauses (title, description, base_legale, obligatoire, ordre, profils, tier, active)
SELECT v.title, v.description, v.base_legale, false, v.ordre, v.profils, 'free', false
FROM (VALUES
  ('Diagnostics techniques sans anomalie majeure',
   'La présente offre est conclue sous la condition suspensive que le dossier de diagnostic technique remis par le vendeur (amiante, plomb, termites, état des installations électrique et gaz, état des risques et pollutions, diagnostic de performance énergétique) ne révèle aucune anomalie majeure de nature à remettre en cause l''usage, la sécurité ou la valeur du bien.',
   'Art. L.271-4 Code de la construction et de l''habitation', 13, ARRAY['tous']),
  ('Bien libre de toute occupation à la signature de l''acte',
   'La présente offre est conclue sous la condition que le bien soit libre de toute occupation, location ou réquisition au jour de la signature de l''acte authentique de vente, le vendeur s''obligeant à délivrer le bien vide de tout occupant et de tout meuble non compris dans la vente.',
   'Art. 1604 Code civil', 14, ARRAY['residence_principale']),
  ('Situation locative conforme (bail en cours transmis)',
   'La présente offre est conclue sous la condition suspensive de la communication par le vendeur du bail en cours, des trois dernières quittances de loyer et de l''état des éventuels impayés, et de la conformité de la situation locative aux informations communiquées à l''acquéreur préalablement à la présente offre.',
   'Art. 1743 Code civil', 15, ARRAY['investissement_locatif','professionnel']),
  ('Documents de copropriété sans anomalie significative',
   'La présente offre est conclue sous la condition suspensive de la communication des documents de la copropriété prévus par la loi (règlement de copropriété, procès-verbaux des trois dernières assemblées générales, montant des charges courantes, procédures en cours) ne révélant ni procédure judiciaire affectant l''immeuble, ni travaux votés ou envisagés représentant une charge exceptionnelle pour l''acquéreur.',
   'Art. L.721-2 Code de la construction et de l''habitation', 16, ARRAY['tous']),
  ('Conformité de l''installation d''assainissement',
   'La présente offre est conclue sous la condition suspensive que le contrôle de l''installation d''assainissement (collectif ou non collectif) ne révèle aucune non-conformité dont la mise aux normes serait mise à la charge de l''acquéreur.',
   'Art. L.1331-11-1 Code de la santé publique', 17, ARRAY['tous']),
  ('Obtention d''une autorisation d''urbanisme pour travaux',
   'La présente offre est conclue sous la condition suspensive de l''obtention par l''acquéreur de l''autorisation d''urbanisme nécessaire aux travaux qu''il envisage (déclaration préalable ou permis), purgée du recours des tiers et du retrait administratif.',
   'Art. R.421-17 Code de l''urbanisme', 18, ARRAY['tous'])
) AS v(title, description, base_legale, ordre, profils)
WHERE NOT EXISTS (SELECT 1 FROM public.clauses c WHERE c.title = v.title);
