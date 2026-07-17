import type { Metadata } from "next";
import { createServerAnonClient } from "@/integrations/supabase/client";
import VendorResponseView from "@/views/VendorResponseView";

export const metadata: Metadata = {
  title: "Répondre à une offre d'achat",
  robots: { index: false },
};

export const dynamic = "force-dynamic";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function VendorResponsePage({
  params,
}: {
  params: { token: string };
}) {
  const token = params.token;

  let payload: any = null;
  if (UUID_RE.test(token)) {
    const supabase = createServerAnonClient();
    const { data } = await supabase.rpc("get_offer_by_token", { _token: token });
    payload = data ?? null;
  }

  return (
    <VendorResponseView
      token={token}
      offer={payload?.offer ?? null}
      clauses={payload?.clauses ?? []}
      agent={payload?.agent ?? null}
    />
  );
}
