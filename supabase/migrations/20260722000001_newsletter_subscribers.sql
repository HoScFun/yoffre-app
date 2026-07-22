-- Newsletter Yoffre : inscriptions opt-in (page /newsletter).
-- Écriture réservée au rôle service (edge function newsletter-subscribe) : aucune policy anon/authenticated.
CREATE TABLE public.newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  source text,
  consent_at timestamptz NOT NULL DEFAULT now(),
  brevo_synced boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT newsletter_subscribers_email_unique UNIQUE (email),
  CONSTRAINT newsletter_subscribers_email_format CHECK (
    email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' AND char_length(email) <= 255
  )
);

ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
