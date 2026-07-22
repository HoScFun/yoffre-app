"use client";

import Link from "next/link";
import { ExternalLink } from "lucide-react";

const lawItems = [
  { ref: "Art. 1113 Code civil", desc: "Formation du contrat par l'échange d'une offre et d'une acceptation." },
  { ref: "Loi du 13 mars 2000 — Art. 1366 Code civil", desc: "Validité juridique des écrits électroniques." },
  { ref: "Art. L.313-41 Code de la consommation (Loi Scrivener)", desc: "Condition suspensive d'obtention de prêt immobilier obligatoire." },
  { ref: "Art. L.211-1 Code de l'urbanisme", desc: "Droit de préemption urbain au profit des communes." },
  { ref: "Art. 1304 Code civil", desc: "Obligations conditionnelles et conditions suspensives." },
  { ref: "Art. 637 Code civil", desc: "Servitudes foncières." },
  { ref: "Art. L.271-1 Code de la construction", desc: "Délai de rétractation de 10 jours." },
  { ref: "Art. 1590 Code civil", desc: "Arrhes et dépôt de garantie." },
  { ref: "Loi Hoguet — Loi n°70-9 du 2 janvier 1970", desc: "Réglementation des agents immobiliers." },
];

const jurisprudenceItems = [
  { ref: "Cass. Civ. 3e, 15 janvier 2020", desc: "Offre d'achat acceptée par email forme un contrat valable." },
  { ref: "Cass. Civ. 1re, 20 mai 2010", desc: "Montant, taux et durée doivent être explicitement mentionnés dans la condition de prêt." },
  { ref: "Cass. Civ. 3e, 7 novembre 2012", desc: "Condition de prêt sans précisions est réputée nulle." },
  { ref: "Cass. Civ. 3e, 25 mars 2009", desc: "Le droit de préemption doit être mentionné sous peine d'inopposabilité." },
];

const internalGuides = [
  { title: "L'offre d'achat immobilier : le guide complet", href: "/guide-offre-achat" },
  { title: "Conditions suspensives d'une offre d'achat", href: "/guide-conditions-suspensives" },
  { title: "Délai de rétractation de 10 jours", href: "/guide-delai-retractation" },
  { title: "Contre-offre immobilière : effets et négociation", href: "/guide-contre-offre" },
];

const guideItems = [
  { title: "L'offre d'achat immobilier — Guide pratique", source: "Service-Public.fr", link: "https://www.service-public.fr" },
  { title: "Les conditions suspensives dans la vente immobilière", source: "Conseil Supérieur du Notariat (CSN)", link: "https://www.notaires.fr" },
  { title: "Guide de la transaction immobilière", source: "ANIL", link: "https://www.anil.org" },
];

export function Footer() {
  return (
    <footer className="border-t bg-card mt-auto">
      {/* Resources accordion */}
      <div className="container max-w-5xl py-8">
        <h3 className="text-sm font-semibold text-foreground mb-4">Ressources juridiques</h3>

        <details className="group border rounded-lg mb-2">
          <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-foreground hover:bg-secondary/50 transition-colors list-none flex items-center justify-between">
            Textes de loi
            <span className="text-muted-foreground group-open:rotate-180 transition-transform">▾</span>
          </summary>
          <div className="px-4 pb-4">
            <ul className="space-y-2 text-sm text-muted-foreground">
              {lawItems.map((item) => (
                <li key={item.ref}>
                  <span className="font-medium text-foreground">{item.ref}</span> — {item.desc}
                </li>
              ))}
            </ul>
          </div>
        </details>

        <details className="group border rounded-lg mb-2">
          <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-foreground hover:bg-secondary/50 transition-colors list-none flex items-center justify-between">
            Jurisprudence
            <span className="text-muted-foreground group-open:rotate-180 transition-transform">▾</span>
          </summary>
          <div className="px-4 pb-4">
            <ul className="space-y-2 text-sm text-muted-foreground">
              {jurisprudenceItems.map((item) => (
                <li key={item.ref}>
                  <span className="font-medium text-foreground">{item.ref}</span> — {item.desc}
                </li>
              ))}
            </ul>
          </div>
        </details>

        <details className="group border rounded-lg mb-2">
          <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-foreground hover:bg-secondary/50 transition-colors list-none flex items-center justify-between">
            Nos guides
            <span className="text-muted-foreground group-open:rotate-180 transition-transform">▾</span>
          </summary>
          <div className="px-4 pb-4">
            <ul className="space-y-2 text-sm">
              {internalGuides.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-primary hover:underline">
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </details>

        <details className="group border rounded-lg mb-2">
          <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-foreground hover:bg-secondary/50 transition-colors list-none flex items-center justify-between">
            Guides utiles
            <span className="text-muted-foreground group-open:rotate-180 transition-transform">▾</span>
          </summary>
          <div className="px-4 pb-4">
            <ul className="space-y-2 text-sm">
              {guideItems.map((item) => (
                <li key={item.title}>
                  <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">
                    {item.title} <ExternalLink className="h-3 w-3" />
                  </a>
                  <span className="text-muted-foreground"> — {item.source}</span>
                </li>
              ))}
            </ul>
          </div>
        </details>
      </div>

      <div className="border-t py-6">
        <div className="container text-center text-sm text-muted-foreground">
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <span>© {new Date().getFullYear()} Yoffre</span>
            <span>·</span>
            <Link href="/newsletter" className="hover:text-primary hover:underline transition-colors">Newsletter</Link>
            <span>·</span>
            <Link href="/cgu" className="hover:text-primary hover:underline transition-colors">CGU</Link>
            <span>·</span>
            <Link href="/confidentialite" className="hover:text-primary hover:underline transition-colors">Confidentialité</Link>
            <span>·</span>
            <Link href="/mentions-legales" className="hover:text-primary hover:underline transition-colors">Mentions légales</Link>
            <span>·</span>
            <a href="mailto:contact@yoffre.fr" className="hover:text-primary hover:underline transition-colors">Contact</a>
          </div>
          <p className="mt-1 text-xs">yoffre.fr</p>
        </div>
      </div>
    </footer>
  );
}
