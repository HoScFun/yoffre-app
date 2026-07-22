import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "@/components/Providers";
import { Analytics } from "@/components/Analytics";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://yoffre.fr";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Yoffre — Offre d'achat immobilier en ligne, gratuite",
    template: "%s | Yoffre",
  },
  description:
    "Rédigez gratuitement une offre d'achat immobilier juridiquement structurée en 5 minutes : conditions suspensives guidées, PDF professionnel, envoi au vendeur et réponse horodatée.",
  keywords: [
    "offre d'achat immobilier",
    "modèle offre d'achat",
    "conditions suspensives",
    "lettre d'offre d'achat",
    "achat immobilier",
    "condition suspensive de prêt",
  ],
  authors: [{ name: "Yoffre" }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "Yoffre",
    title: "Yoffre — Offre d'achat immobilier en ligne, gratuite",
    description:
      "Générez une offre d'achat immobilier juridiquement structurée en 5 minutes. 100 % gratuit.",
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "Yoffre — Offre d'achat immobilier en ligne, gratuite",
    description:
      "Générez une offre d'achat immobilier juridiquement structurée en 5 minutes. 100 % gratuit.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={inter.variable}>
      <body className="font-sans antialiased">
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}
