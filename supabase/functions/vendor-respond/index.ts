import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Simple in-memory rate limiter: max 10 per IP per hour
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 3600000 });
    return true;
  }
  if (entry.count >= 10) return false;
  entry.count++;
  return true;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const ipAddress = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

    // Rate limit check
    if (!checkRateLimit(ipAddress)) {
      return new Response(JSON.stringify({ error: "Too many requests. Try again later." }), {
        status: 429,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { vendor_token, decision, vendeur_nom } = await req.json();

    if (!vendor_token || !decision || !vendeur_nom) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Validate decision against allowed values
    const ALLOWED_DECISIONS = ["acceptee", "refusee"];
    if (!ALLOWED_DECISIONS.includes(decision)) {
      return new Response(JSON.stringify({ error: "Invalid decision" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Validate vendeur_nom length
    if (typeof vendeur_nom !== "string" || vendeur_nom.length > 200) {
      return new Response(JSON.stringify({ error: "Invalid vendeur_nom" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: offer, error: offerError } = await supabase
      .from("offers")
      .select("*")
      .eq("vendor_token", vendor_token)
      .single();

    if (offerError || !offer) {
      return new Response(JSON.stringify({ error: "Offer not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (offer.vendor_token_expires_at && new Date(offer.vendor_token_expires_at) < new Date()) {
      return new Response(JSON.stringify({ error: "Link expired" }), {
        status: 410,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (offer.statut === "acceptee" || offer.statut === "refusee") {
      return new Response(JSON.stringify({ error: "Already responded" }), {
        status: 409,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const now = new Date().toISOString();

    const { error: responseError } = await supabase.from("vendor_responses").insert({
      offer_id: offer.id,
      decision,
      vendeur_nom,
      commentaire: null,
      responded_at: now,
      ip_address: ipAddress,
    });

    if (responseError) {
      console.error("Insert error:", responseError);
      return new Response(JSON.stringify({ error: "Failed to save response" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { error: updateError } = await supabase
      .from("offers")
      .update({ statut: decision, responded_at: now })
      .eq("id", offer.id);

    if (updateError) {
      console.error("Update error:", updateError);
    }

    // Send notification emails via send-offer-emails function
    try {
      const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
      const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
      await fetch(`${SUPABASE_URL}/functions/v1/send-offer-emails`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        },
        body: JSON.stringify({ offerId: offer.id, eventType: "reponse_vendeur" }),
      });
    } catch (e) {
      console.error("Email notification error:", e);
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
