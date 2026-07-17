-- RPC sécurisée : lecture d'une offre par token vendeur (projection sans user_id ni vendor_token)
CREATE OR REPLACE FUNCTION public.get_offer_by_token(_token uuid)
RETURNS jsonb
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT jsonb_build_object(
    'offer', to_jsonb(o) - 'user_id' - 'vendor_token',
    'clauses', COALESCE((
      SELECT jsonb_agg(jsonb_build_object(
        'id', oc.id,
        'clause_id', oc.clause_id,
        'valeur_montant_pret', oc.valeur_montant_pret,
        'valeur_taux_max', oc.valeur_taux_max,
        'valeur_duree_pret', oc.valeur_duree_pret,
        'notes_custom', oc.notes_custom,
        'clauses', to_jsonb(c)
      ) ORDER BY c.ordre)
      FROM offer_clauses oc
      LEFT JOIN clauses c ON c.id = oc.clause_id
      WHERE oc.offer_id = o.id
    ), '[]'::jsonb),
    'agent', (SELECT to_jsonb(a) - 'offer_id' FROM agents a WHERE a.offer_id = o.id LIMIT 1)
  )
  FROM offers o
  WHERE o.vendor_token = _token;
$$;

REVOKE ALL ON FUNCTION public.get_offer_by_token(uuid) FROM public;
GRANT EXECUTE ON FUNCTION public.get_offer_by_token(uuid) TO anon, authenticated;

-- Durcissement RPC
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM public, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;

-- Leads : garde-fous sur l'INSERT ouvert
DROP POLICY IF EXISTS "Authenticated users can insert leads" ON public.leads;
CREATE POLICY "Authenticated users can insert leads"
ON public.leads
FOR INSERT
TO authenticated
WITH CHECK (
  email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  AND char_length(email) <= 255
  AND (telephone IS NULL OR char_length(telephone) <= 30)
  AND (localisation IS NULL OR char_length(localisation) <= 300)
);
