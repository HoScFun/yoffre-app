import type { Metadata } from "next";
import OfferDetailView from "@/views/OfferDetail";

export const metadata: Metadata = {
  title: "Détail de l'offre",
  robots: { index: false },
};

export default function OfferDetailPage() {
  return <OfferDetailView />;
}
