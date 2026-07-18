-- m. État civil de l'acquéreur + conjoint co-acquéreur (2026-07-18)
ALTER TABLE public.offers ADD COLUMN IF NOT EXISTS acheteur_situation text;
ALTER TABLE public.offers ADD COLUMN IF NOT EXISTS conjoint_prenom text;
ALTER TABLE public.offers ADD COLUMN IF NOT EXISTS conjoint_nom text;
