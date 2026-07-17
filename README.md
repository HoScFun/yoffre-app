# Yoffre — offre d'achat immobilier en ligne

App Next.js 14 (App Router) + Supabase.

## Démarrer

```sh
npm install
cp .env.example .env.local   # renseigner les clés
npm run dev                  # http://localhost:3000
npm run build                # build de production
```

## Architecture

- `app/` — routes (App Router). Pages publiques rendues côté serveur (SEO) : `/`, `/agences`, `/guide-offre-achat`, pages légales. Pages authentifiées en client components : dashboard, compte, admin.
- `app/repondre/[token]` — page vendeur : lecture serveur via la RPC Supabase `get_offer_by_token` (SECURITY DEFINER, projection limitée), réponse via l'edge function `vendor-respond`.
- `src/views/` — vues client portées de la v0.
- `src/components/ui/` — shadcn/ui. `src/lib/validation.ts` — validation France. `src/lib/pdf.ts` — génération PDF (jsPDF).
- Supabase : auth (sessions anonymes pour l'offre sans compte), Postgres + RLS, edge functions `send-offer-emails` (Resend) et `vendor-respond`.
