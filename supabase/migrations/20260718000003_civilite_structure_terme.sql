-- Améliorations 2026-07-18 (session 3)
-- Civilité Monsieur/Madame
ALTER TABLE public.offers ADD COLUMN IF NOT EXISTS acheteur_civilite text;
ALTER TABLE public.offers ADD COLUMN IF NOT EXISTS vendeur_civilite text;

-- Acquéreur professionnel : structure (autocomplétion API Recherche d'entreprises)
ALTER TABLE public.offers ADD COLUMN IF NOT EXISTS acheteur_denomination text;
ALTER TABLE public.offers ADD COLUMN IF NOT EXISTS acheteur_siren text;

-- Vente à terme : date de signature souhaitée de l'acte authentique
ALTER TABLE public.offers ADD COLUMN IF NOT EXISTS date_signature_souhaitee date;

-- Doublon « Absence de servitudes non déclarées » (ids 3 et 9) : on garde la 3 (free),
-- enrichie de la base légale complète, et on désactive la 9.
UPDATE public.clauses SET base_legale = 'Art. 637 et 686 Code civil' WHERE id = 3;
UPDATE public.clauses SET active = false WHERE id = 9;
