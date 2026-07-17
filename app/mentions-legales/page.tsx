import type { Metadata } from "next";
import MentionsLegalesView from "@/views/MentionsLegales";

export const metadata: Metadata = {
  title: "Mentions légales",
  alternates: { canonical: "/mentions-legales" },
};

export default function MentionsLegalesPage() {
  return <MentionsLegalesView />;
}
