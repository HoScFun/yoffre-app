import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SITE_URL = Deno.env.get("SITE_URL") || "https://yoffre.fr";

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function emailWrapper(title: string, body: string): string {
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:32px 0;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;">
  <tr><td style="background:#1E3A5F;padding:28px 32px;text-align:center;">
    <span style="color:#ffffff;font-size:24px;font-weight:bold;letter-spacing:4px;text-transform:uppercase;">YOFFRE</span>
    <br><span style="color:#94a3b8;font-size:12px;letter-spacing:1px;">Offre d'achat immobilier</span>
  </td></tr>
  <tr><td style="padding:32px;">
    <h2 style="color:#1E3A5F;margin:0 0 20px;">${title}</h2>
    ${body}
  </td></tr>
  <tr><td style="padding:20px 32px;background:#f9fafb;text-align:center;">
    <p style="color:#9ca3af;font-size:12px;margin:0 0 8px;">yoffre.fr — Générez votre offre d'achat en 5 minutes</p>
    <a href="${SITE_URL}/nouvelle-offre" style="color:#1E3A5F;font-size:11px;text-decoration:underline;">Créer ma propre offre →</a>
  </td></tr>
</table>
</td></tr></table>
</body></html>`;
}

function recapBlock(offer: any, expirationDate: string): string {
  return `<div style="background:#f4f4f5;border-radius:6px;padding:16px;margin:16px 0;">
    <p style="margin:4px 0;"><strong>Bien :</strong> ${escapeHtml(offer.bien_adresse)}</p>
    <p style="margin:4px 0;"><strong>Prix proposé :</strong> ${Number(offer.bien_prix_propose).toLocaleString("fr-FR")} €</p>
    ${offer.financement ? `<p style="margin:4px 0;"><strong>Financement :</strong> ${offer.financement === 'pret' ? 'Prêt immobilier' : 'Comptant'}</p>` : ''}
    <p style="margin:4px 0;"><strong>Valable jusqu'au :</strong> ${escapeHtml(expirationDate)}</p>
  </div>`;
}

function button(text: string, url: string, color = "#22C55E"): string {
  return `<p style="text-align:center;margin:24px 0;">
    <a href="${url}" style="display:inline-block;padding:14px 28px;background:${color};color:#ffffff;text-decoration:none;border-radius:6px;font-weight:bold;font-size:15px;">${escapeHtml(text)}</a>
  </p>`;
}

function ctaSecondaire(text: string, url: string): string {
  return `<div style="margin-top:32px;padding-top:16px;border-top:1px solid #e5e7eb;text-align:center;">
    <p style="color:#9ca3af;font-size:12px;margin:0;">${escapeHtml(text)}</p>
    <a href="${url}" style="color:#1E3A5F;font-size:11px;text-decoration:underline;">En savoir plus →</a>
  </div>`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { offerId, eventType } = await req.json();

    if (!offerId) {
      return new Response(JSON.stringify({ error: "Missing offerId" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const authHeader = req.headers.get("Authorization") || "";
    const token = authHeader.replace("Bearer ", "");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;

    const isServiceRole = token === SUPABASE_SERVICE_ROLE_KEY;
    let callerUserId: string | null = null;

    if (!isServiceRole) {
      if (!token) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const userClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        global: { headers: { Authorization: `Bearer ${token}` } },
      });
      const { data: claims, error: claimsError } = await userClient.auth.getUser(token);
      if (claimsError || !claims?.user) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      callerUserId = claims.user.id;
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const BREVO_API_KEY = Deno.env.get("BREVO_API_KEY");
    if (!BREVO_API_KEY) {
      console.warn("BREVO_API_KEY not configured, skipping emails");
      return new Response(JSON.stringify({ warning: "BREVO_API_KEY not configured" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: offer, error } = await supabase.from("offers").select("*").eq("id", offerId).single();
    if (error || !offer) {
      return new Response(JSON.stringify({ error: "Offer not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!isServiceRole && offer.user_id !== callerUserId) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let agent = null;
    if (offer.agent_immobilier) {
      const { data: agentData } = await supabase.from("agents").select("*").eq("offer_id", offerId).single();
      agent = agentData;
    }

    const expirationDate = offer.vendor_token_expires_at
      ? new Date(offer.vendor_token_expires_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })
      : "N/A";

    // Envoi via Brevo (https://developers.brevo.com/reference/sendtransacemail)
    const sendEmail = async (to: string, subject: string, html: string, replyTo?: string) => {
      try {
        const payload: any = {
          sender: { name: "Yoffre", email: "noreply@yoffre.fr" },
          to: [{ email: to }],
          subject,
          htmlContent: html,
        };
        if (replyTo) payload.replyTo = { email: replyTo };
        const res = await fetch("https://api.brevo.com/v3/smtp/email", {
          method: "POST",
          headers: { "Content-Type": "application/json", "api-key": BREVO_API_KEY },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          console.error("Brevo error:", res.status, await res.text());
        }
      } catch (e) {
        console.error("Email error:", e);
      }
    };

    const event = eventType || "envoi_offre";
    const envoyerAuVendeur = offer.envoyer_au_vendeur !== false;

    if (event === "envoi_offre") {
      const recap = recapBlock(offer, expirationDate);

      if (envoyerAuVendeur) {
        // === SEND TO SELLER ===
        const vendorLink = `${SITE_URL}/repondre/${offer.vendor_token}`;

        let messageBlock = "";
        if (offer.message_vendeur && offer.message_vendeur.trim()) {
          messageBlock = `<div style="background:#FEF3C7;border-left:4px solid #F59E0B;border-radius:4px;padding:16px;margin:16px 0;">
            <p style="margin:0 0 8px;font-weight:bold;color:#92400E;font-size:13px;">Message de l'acheteur :</p>
            <p style="margin:0;font-style:italic;color:#78350F;white-space:pre-line;">${escapeHtml(offer.message_vendeur)}</p>
          </div>`;
        }

        await sendEmail(
          offer.vendeur_email,
          `Offre d'achat pour votre bien — ${escapeHtml(offer.bien_adresse)}`,
          emailWrapper("Vous avez reçu une offre d'achat", `
            <p><strong>${escapeHtml(offer.acheteur_nom)}</strong> vous fait une offre d'achat pour le bien suivant :</p>
            ${recap}
            <p><strong>Acheteur :</strong> ${escapeHtml(offer.acheteur_nom)} (${escapeHtml(offer.acheteur_email)})</p>
            ${messageBlock}
            ${button("Consulter et répondre à cette offre", vendorLink)}
            <p style="color:#9ca3af;font-size:12px;text-align:center;">Vous n'avez pas besoin de créer un compte. Ce lien est personnel et sécurisé.</p>
            ${ctaSecondaire("Vous vendez votre bien ? Pensez au diagnostic immobilier obligatoire.", SITE_URL)}
          `),
          offer.acheteur_email
        );

        // === SEND TO BUYER (copy) ===
        await sendEmail(
          offer.acheteur_email,
          `Votre offre d'achat — ${escapeHtml(offer.bien_adresse)}`,
          emailWrapper("Votre offre a bien été envoyée", `
            <p>Votre offre pour le bien situé au <strong>${escapeHtml(offer.bien_adresse)}</strong> a été transmise à <strong>${escapeHtml(offer.vendeur_nom)}</strong>.</p>
            ${recap}
            <p>Vous serez notifié dès qu'il répond.</p>
            ${button("Suivre mon offre", `${SITE_URL}/dashboard`, "#1E3A5F")}
            ${ctaSecondaire("Besoin d'un prêt immobilier ? Nos partenaires courtiers vous accompagnent gratuitement.", SITE_URL)}
          `)
        );

        // === SEND TO NOTAIRE ===
        if (offer.notaire_email) {
          await sendEmail(
            offer.notaire_email,
            `Copie — Offre d'achat ${escapeHtml(offer.bien_adresse)}`,
            emailWrapper("Vous êtes désigné comme notaire dans le cadre de cette transaction", `
              <p>Une offre d'achat a été transmise entre les parties suivantes :</p>
              <p><strong>Acheteur :</strong> ${escapeHtml(offer.acheteur_nom)} (${escapeHtml(offer.acheteur_email)})</p>
              <p><strong>Vendeur :</strong> ${escapeHtml(offer.vendeur_nom)} (${escapeHtml(offer.vendeur_email)})</p>
              ${recap}
              <p>Cette offre vous est transmise à titre d'information.</p>
            `),
            offer.acheteur_email
          );
        }

        // === SEND TO AGENT ===
        if (agent) {
          await sendEmail(
            agent.email,
            `Offre transmise pour votre bien — ${escapeHtml(offer.bien_adresse)}`,
            emailWrapper("Votre client vient de transmettre une offre", `
              <p><strong>${escapeHtml(offer.acheteur_nom)}</strong> a fait une offre de <strong>${Number(offer.bien_prix_propose).toLocaleString("fr-FR")} €</strong> pour le bien situé au <strong>${escapeHtml(offer.bien_adresse)}</strong>.</p>
              ${recap}
            `),
            offer.acheteur_email
          );
        }
      } else {
        // === PDF ONLY — send only to buyer ===
        await sendEmail(
          offer.acheteur_email,
          `Votre offre d'achat — ${escapeHtml(offer.bien_adresse)}`,
          emailWrapper("Votre offre est prête", `
            <p>Votre offre pour le bien situé au <strong>${escapeHtml(offer.bien_adresse)}</strong> est prête.</p>
            ${recap}
            <p>Retrouvez le PDF dans votre espace. Envoyez-le au vendeur quand vous êtes prêt.</p>
            ${button("Accéder à mon espace", `${SITE_URL}/dashboard`, "#1E3A5F")}
            ${ctaSecondaire("Besoin d'un prêt immobilier ? Nos partenaires courtiers vous accompagnent gratuitement.", SITE_URL)}
          `)
        );
      }
    } else if (event === "reponse_vendeur") {
      const { data: vendorResponse } = await supabase
        .from("vendor_responses")
        .select("*")
        .eq("offer_id", offerId)
        .single();

      const accepted = vendorResponse?.decision === "acceptee";
      const label = accepted ? "acceptée" : "refusée";
      const LABEL = accepted ? "ACCEPTÉE" : "REFUSÉE";
      const responseDate = vendorResponse?.responded_at
        ? new Date(vendorResponse.responded_at).toLocaleString("fr-FR")
        : "N/A";

      await sendEmail(
        offer.acheteur_email,
        accepted ? `✓ Votre offre a été acceptée — Yoffre` : `Votre offre a été refusée — Yoffre`,
        emailWrapper(`Votre offre a été ${label}`, `
          <p>Le vendeur <strong>${escapeHtml(vendorResponse?.vendeur_nom || offer.vendeur_nom)}</strong> a <strong>${label}</strong> votre offre pour le bien situé au <strong>${escapeHtml(offer.bien_adresse)}</strong>.</p>
          <p><strong>Date de réponse :</strong> ${responseDate}</p>
          ${accepted ? button("Voir l'offre acceptée", `${SITE_URL}/offre/${offer.id}`, "#22C55E") : ""}
        `)
      );

      if (offer.notaire_email) {
        await sendEmail(
          offer.notaire_email,
          `Offre ${label} — ${escapeHtml(offer.bien_adresse)}`,
          emailWrapper(`Offre ${LABEL}`, `
            <p>L'offre d'achat pour le bien situé au <strong>${escapeHtml(offer.bien_adresse)}</strong> a été <strong>${label}</strong> par le vendeur.</p>
            <p><strong>Date :</strong> ${responseDate}</p>
          `)
        );
      }

      if (agent) {
        await sendEmail(
          agent.email,
          `Offre ${label} pour ${escapeHtml(offer.bien_adresse)}`,
          emailWrapper(`Offre ${LABEL}`, `
            <p>L'offre de votre client <strong>${escapeHtml(offer.acheteur_nom)}</strong> pour le bien situé au <strong>${escapeHtml(offer.bien_adresse)}</strong> a été <strong>${label}</strong> par le vendeur.</p>
            <p><strong>Date :</strong> ${responseDate}</p>
          `)
        );
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error:", err);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
