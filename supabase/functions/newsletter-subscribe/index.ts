import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SITE_URL = Deno.env.get("SITE_URL") || "https://yoffre.fr";
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const BREVO_FOLDER_NAME = "Yoffre";
const BREVO_LIST_NAME = "Newsletter site";

async function brevoFetch(path: string, apiKey: string, init: RequestInit = {}): Promise<Response> {
  return fetch(`https://api.brevo.com/v3${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      "api-key": apiKey,
      ...(init.headers || {}),
    },
  });
}

async function findOrCreateFolder(apiKey: string, name: string): Promise<number> {
  const listRes = await brevoFetch(`/contacts/folders?limit=50&offset=0`, apiKey);
  if (listRes.ok) {
    const data = await listRes.json();
    const found = (data.folders || []).find((f: any) => f.name === name);
    if (found) return found.id;
  }
  const createRes = await brevoFetch(`/contacts/folders`, apiKey, {
    method: "POST",
    body: JSON.stringify({ name }),
  });
  if (!createRes.ok) throw new Error(`Brevo folder creation failed: ${await createRes.text()}`);
  const created = await createRes.json();
  return created.id;
}

async function findOrCreateList(apiKey: string, name: string, folderId: number): Promise<number> {
  const listRes = await brevoFetch(`/contacts/folders/${folderId}/lists?limit=50&offset=0`, apiKey);
  if (listRes.ok) {
    const data = await listRes.json();
    const found = (data.lists || []).find((l: any) => l.name === name);
    if (found) return found.id;
  }
  const createRes = await brevoFetch(`/contacts/lists`, apiKey, {
    method: "POST",
    body: JSON.stringify({ name, folderId }),
  });
  if (!createRes.ok) throw new Error(`Brevo list creation failed: ${await createRes.text()}`);
  const created = await createRes.json();
  return created.id;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const { email, source } = await req.json();

    if (typeof email !== "string" || !EMAIL_RE.test(email) || email.length > 255) {
      return new Response(JSON.stringify({ error: "Adresse email invalide" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const normalizedEmail = email.trim().toLowerCase();
    const safeSource = typeof source === "string" ? source.slice(0, 100) : "site";

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { error: dbError } = await supabase
      .from("newsletter_subscribers")
      .upsert(
        { email: normalizedEmail, source: safeSource, consent_at: new Date().toISOString() },
        { onConflict: "email" },
      );

    if (dbError) {
      console.error("newsletter_subscribers upsert failed:", dbError);
      return new Response(JSON.stringify({ error: "Erreur serveur" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const BREVO_API_KEY = Deno.env.get("BREVO_API_KEY");
    if (!BREVO_API_KEY) {
      console.warn("BREVO_API_KEY not configured, subscriber saved locally only");
      return new Response(JSON.stringify({ success: true, brevo: false }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    try {
      const folderId = await findOrCreateFolder(BREVO_API_KEY, BREVO_FOLDER_NAME);
      const listId = await findOrCreateList(BREVO_API_KEY, BREVO_LIST_NAME, folderId);

      // Double opt-in réel (email de confirmation Brevo) : nécessite un template créé dans
      // le dashboard Brevo (Campagnes > Modèles) dont l'ID est stocké dans le secret
      // BREVO_DOI_TEMPLATE_ID. Sans ce secret, on retombe sur un opt-in simple (inscription
      // directe) : le consentement explicite est capturé côté site via la case à cocher.
      const DOI_TEMPLATE_ID = Deno.env.get("BREVO_DOI_TEMPLATE_ID");
      let brevoRes: Response;
      if (DOI_TEMPLATE_ID) {
        brevoRes = await brevoFetch(`/contacts/doubleOptinConfirmation`, BREVO_API_KEY, {
          method: "POST",
          body: JSON.stringify({
            email: normalizedEmail,
            includeListIds: [listId],
            templateId: Number(DOI_TEMPLATE_ID),
            redirectionUrl: `${SITE_URL}/newsletter?confirmed=1`,
            attributes: { SOURCE: safeSource },
          }),
        });
      } else {
        brevoRes = await brevoFetch(`/contacts`, BREVO_API_KEY, {
          method: "POST",
          body: JSON.stringify({
            email: normalizedEmail,
            listIds: [listId],
            updateEnabled: true,
            attributes: { SOURCE: safeSource },
          }),
        });
      }

      if (!brevoRes.ok) {
        console.error("Brevo sync failed:", await brevoRes.text());
      } else {
        await supabase
          .from("newsletter_subscribers")
          .update({ brevo_synced: true })
          .eq("email", normalizedEmail);
      }
    } catch (brevoErr) {
      console.error("Brevo sync error:", brevoErr);
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("newsletter-subscribe error:", e);
    return new Response(JSON.stringify({ error: "Erreur serveur" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
