"use client";

import { Badge } from "@/components/ui/badge";

const statusConfig: Record<string, { label: string; className: string }> = {
  brouillon: { label: "Brouillon", className: "bg-muted text-muted-foreground hover:bg-muted" },
  envoyee: { label: "Envoyée", className: "bg-primary/10 text-primary hover:bg-primary/10" },
  acceptee: { label: "Acceptée", className: "bg-accent/10 text-accent hover:bg-accent/10" },
  refusee: { label: "Refusée", className: "bg-destructive/10 text-destructive hover:bg-destructive/10" },
  expiree: { label: "Expirée", className: "bg-orange-100 text-orange-700 hover:bg-orange-100" },
};

export function StatusBadge({ status }: { status: string | null }) {
  const config = statusConfig[status || "brouillon"] || statusConfig.brouillon;
  return <Badge className={config.className}>{config.label}</Badge>;
}
